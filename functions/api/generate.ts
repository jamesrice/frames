interface Env {
  GEMINI_API_KEY?: string
}

interface PagesContext {
  request: Request
  env: Env
}

interface SceneRequest {
  mode: 'scene'
  presetName?: string | null
  specString?: string | null
  moodCues?: string[]
}

interface ComposeRequest {
  mode: 'compose'
  decisions?: string[]
  scene?: Record<string, string>
  capMode?: boolean
}

type GenerateRequest = SceneRequest | ComposeRequest

const MODEL = 'gemini-2.5-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const SCENE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    subject: { type: 'STRING' },
    environment: { type: 'STRING' },
    action: { type: 'STRING' },
    lightAtmosphere: { type: 'STRING' },
  },
  required: ['subject', 'environment', 'action', 'lightAtmosphere'],
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function callGemini(
  key: string,
  prompt: string,
  generationConfig: Record<string, unknown>,
): Promise<{ text: string | null; status: number }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig,
    }),
  })
  if (!res.ok) return { text: null, status: res.status }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  return { text: data.candidates?.[0]?.content?.parts?.[0]?.text ?? null, status: res.status }
}

function scenePrompt(body: SceneRequest): string {
  const look = body.presetName
    ? `"${body.presetName}"${body.specString ? ` (${body.specString})` : ''}`
    : 'a custom manual setup'
  const cues = body.moodCues && body.moodCues.length > 0 ? body.moodCues.join(', ') : 'none set yet'
  return [
    'You are a film director inventing one still-photograph scene for an analog-photography image prompt.',
    `The look the photographer has dialed in: ${look}. Mood cues from their other selections: ${cues}.`,
    'Invent ONE fresh, specific, filmable scene: a real kind of place, one clear subject, a moment caught mid-motion.',
    'Be surprising and concrete — a night ferry deckhand, a laundromat at closing, a beekeeper in a city lot — never a generic person standing somewhere.',
    'Do not mention cameras, lenses, film stocks, or eras; those are chosen elsewhere.',
    'Return JSON with exactly these fields:',
    'subject — who or what the frame is about, 18 words max.',
    'environment — where this is happening, 18 words max.',
    'action — what is happening mid-motion, 15 words max.',
    'lightAtmosphere — the mood the light is carrying, 15 words max.',
  ].join('\n')
}

function composePrompt(body: ComposeRequest): string {
  const decisions = body.decisions && body.decisions.length > 0 ? body.decisions.join('\n') : 'none'
  const scene = body.scene ?? {}
  const sceneLines = Object.entries(scene)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([field, value]) => `${field}: ${value.trim()}`)
    .join('\n')
  const lengthRule = body.capMode
    ? 'Length: one paragraph, and the whole thing MUST stay under 1000 characters.'
    : 'Length: one cohesive paragraph of roughly 170-230 words.'
  return [
    'You are a director of photography writing the final prompt for a film-photography image-generation model.',
    'Using ONLY the creative decisions listed below, write one narratively rich paragraph.',
    'Requirements:',
    '- Open with the framing and camera position.',
    '- Ground the subject in a lived-in moment with concrete, sensory visual detail — texture, color, small imperfections.',
    '- Weave the light through the scene: its direction, hardness, and what it does to the subject and background.',
    '- Name the camera body, film stock, grain, and scan character exactly as given; never invent gear that is not listed.',
    '- If an era is given, make it visible through wardrobe, signage, vehicles, and street life rather than naming a date twice.',
    '- Close on the emotional note the subject is holding.',
    '- Write it as the prompt itself: no preamble, no headings, no mention of prompts or models.',
    lengthRule,
    '',
    'Creative decisions:',
    decisions,
    sceneLines ? `\nScene notes:\n${sceneLines}` : '',
  ].join('\n')
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const key = context.env.GEMINI_API_KEY
  if (!key) {
    return jsonResponse({ error: 'GEMINI_API_KEY is not configured for this deployment' }, 503)
  }

  let body: GenerateRequest
  try {
    body = (await context.request.json()) as GenerateRequest
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  try {
    if (body.mode === 'scene') {
      const { text, status } = await callGemini(key, scenePrompt(body), {
        temperature: 1.2,
        topP: 0.95,
        responseMimeType: 'application/json',
        responseSchema: SCENE_SCHEMA,
      })
      if (!text) return jsonResponse({ error: `Generation failed (upstream ${status})` }, 502)
      const parsed = JSON.parse(text) as Record<string, unknown>
      const fields = ['subject', 'environment', 'action', 'lightAtmosphere'] as const
      if (!fields.every((field) => typeof parsed[field] === 'string')) {
        return jsonResponse({ error: 'Malformed generation output' }, 502)
      }
      return jsonResponse({
        subject: parsed.subject,
        environment: parsed.environment,
        action: parsed.action,
        lightAtmosphere: parsed.lightAtmosphere,
      })
    }

    if (body.mode === 'compose') {
      const { text, status } = await callGemini(key, composePrompt(body), {
        temperature: 0.9,
        maxOutputTokens: 1024,
      })
      if (!text) return jsonResponse({ error: `Generation failed (upstream ${status})` }, 502)
      return jsonResponse({ prompt: text.trim() })
    }
  } catch {
    return jsonResponse({ error: 'Generation failed' }, 502)
  }

  return jsonResponse({ error: 'Unknown mode' }, 400)
}

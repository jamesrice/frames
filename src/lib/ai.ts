export interface SceneIdea {
  subject: string
  environment: string
  action: string
  lightAtmosphere: string
}

export interface SceneInput {
  presetName: string | null
  specString: string | null
  moodCues: string[]
}

export interface ComposeInput {
  decisions: string[]
  scene: Record<string, string>
  capMode: boolean
}

/** Either a usable value, or a reason to show the person using the app. */
export type AiResult<T> = { ok: true; value: T } | { ok: false; error: string }

const GENERIC_ERROR = 'The idea engine is unreachable — check your connection and try again.'

async function post(body: unknown, timeoutMs: number): Promise<AiResult<Record<string, unknown>>> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    // The API reports its own failures as 200 + { error } so the reason survives
    // the CDN, but still handle a genuine non-2xx (proxy error, 404, timeout).
    const data = (await res.json().catch(() => null)) as Record<string, unknown> | null
    if (data && typeof data.error === 'string') return { ok: false, error: data.error }
    if (!res.ok || !data) return { ok: false, error: GENERIC_ERROR }
    return { ok: true, value: data }
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError'
    return {
      ok: false,
      error: aborted ? 'The idea engine took too long to respond — try again.' : GENERIC_ERROR,
    }
  } finally {
    clearTimeout(timer)
  }
}

export async function generateSceneIdea(input: SceneInput): Promise<AiResult<SceneIdea>> {
  const result = await post({ mode: 'scene', ...input }, 20000)
  if (!result.ok) return result
  const data = result.value as Partial<SceneIdea>
  if (
    typeof data.subject === 'string' &&
    typeof data.environment === 'string' &&
    typeof data.action === 'string' &&
    typeof data.lightAtmosphere === 'string'
  ) {
    return {
      ok: true,
      value: {
        subject: data.subject,
        environment: data.environment,
        action: data.action,
        lightAtmosphere: data.lightAtmosphere,
      },
    }
  }
  return { ok: false, error: 'The idea engine returned an incomplete scene — try again.' }
}

export async function generateRichPrompt(input: ComposeInput): Promise<AiResult<string>> {
  const result = await post({ mode: 'compose', ...input }, 30000)
  if (!result.ok) return result
  const prompt = result.value.prompt
  return typeof prompt === 'string' && prompt.length > 0
    ? { ok: true, value: prompt }
    : { ok: false, error: 'The idea engine returned an empty prompt — try again.' }
}

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

async function post(body: unknown, timeoutMs: number): Promise<unknown | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function generateSceneIdea(input: SceneInput): Promise<SceneIdea | null> {
  const data = (await post({ mode: 'scene', ...input }, 20000)) as Partial<SceneIdea> | null
  if (
    data &&
    typeof data.subject === 'string' &&
    typeof data.environment === 'string' &&
    typeof data.action === 'string' &&
    typeof data.lightAtmosphere === 'string'
  ) {
    return {
      subject: data.subject,
      environment: data.environment,
      action: data.action,
      lightAtmosphere: data.lightAtmosphere,
    }
  }
  return null
}

export async function generateRichPrompt(input: ComposeInput): Promise<string | null> {
  const data = (await post({ mode: 'compose', ...input }, 30000)) as { prompt?: unknown } | null
  return data && typeof data.prompt === 'string' && data.prompt.length > 0 ? data.prompt : null
}

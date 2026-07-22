export type Approach = 'prelit' | 'manual'

export interface DraftPayload {
  approach: Approach | null
  presetId: string | null
  text: Record<string, string>
  selections: Record<string, string | null>
  capMode: boolean
}

export interface ArchivedPrompt {
  id: string
  name: string
  prompt: string
  savedAt: number
}

const DRAFT_KEY = 'frames.draft.v1'
const ARCHIVE_KEY = 'frames.archive.v1'

export function loadDraft(): DraftPayload | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DraftPayload
  } catch {
    return null
  }
}

export function saveDraft(draft: DraftPayload): void {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // localStorage unavailable (e.g. private browsing) — session-only fallback
  }
}

export function clearDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // no-op
  }
}

export function loadArchive(): ArchivedPrompt[] {
  try {
    const raw = window.localStorage.getItem(ARCHIVE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ArchivedPrompt[]) : []
  } catch {
    return []
  }
}

export function saveArchive(archive: ArchivedPrompt[]): void {
  try {
    window.localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive))
  } catch {
    // no-op
  }
}

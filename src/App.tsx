import { useEffect, useMemo, useReducer } from 'react'
import { WORLD } from './data/world'
import { assemblePrompt } from './lib/assemble'
import { loadArchive, loadDraft, saveArchive, saveDraft } from './lib/storage'
import type { Approach, ArchivedPrompt, DraftPayload } from './lib/storage'
import type { Preset } from './data/world'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ApproachPicker } from './components/ApproachPicker'

interface BuilderState extends DraftPayload {
  archive: ArchivedPrompt[]
  hydrated: boolean
}

type Action =
  | { type: 'HYDRATE'; draft: DraftPayload | null; archive: ArchivedPrompt[] }
  | { type: 'SET_APPROACH'; approach: Approach }
  | { type: 'APPLY_PRESET'; preset: Preset }
  | { type: 'SET_TEXT'; fieldId: string; value: string }
  | { type: 'TOGGLE_OPTION'; fieldId: string; optionId: string }
  | { type: 'TOGGLE_CAP_MODE' }
  | { type: 'ARCHIVE_PROMPT'; prompt: string }
  | { type: 'DELETE_ARCHIVED'; id: string }
  | { type: 'RESET' }

function initialText(): Record<string, string> {
  const text: Record<string, string> = {}
  for (const section of WORLD.sections) {
    if (section.kind !== 'text') continue
    for (const field of section.fields) {
      if (field.kind === 'text') text[field.id] = ''
    }
  }
  return text
}

function initialSelections(): Record<string, string | null> {
  const selections: Record<string, string | null> = {}
  for (const section of WORLD.sections) {
    if (section.kind !== 'options') continue
    for (const field of section.fields) {
      if (field.kind === 'options') selections[field.id] = null
    }
  }
  return selections
}

function createInitialState(): BuilderState {
  return {
    approach: null,
    presetId: null,
    text: initialText(),
    selections: initialSelections(),
    capMode: false,
    archive: [],
    hydrated: false,
  }
}

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'HYDRATE': {
      if (!action.draft) return { ...state, archive: action.archive, hydrated: true }
      return { ...state, ...action.draft, archive: action.archive, hydrated: true }
    }
    case 'SET_APPROACH':
      return {
        ...state,
        approach: action.approach,
        presetId: action.approach === 'manual' ? null : state.presetId,
      }
    case 'APPLY_PRESET':
      return {
        ...state,
        approach: 'prelit',
        presetId: action.preset.id,
        selections: { ...state.selections, ...action.preset.selections },
      }
    case 'SET_TEXT':
      return { ...state, text: { ...state.text, [action.fieldId]: action.value } }
    case 'TOGGLE_OPTION': {
      const current = state.selections[action.fieldId]
      const next = current === action.optionId ? null : action.optionId
      return {
        ...state,
        presetId: null,
        selections: { ...state.selections, [action.fieldId]: next },
      }
    }
    case 'TOGGLE_CAP_MODE':
      return { ...state, capMode: !state.capMode }
    case 'ARCHIVE_PROMPT': {
      const preset = WORLD.presets.find((candidate) => candidate.id === state.presetId)
      const entry: ArchivedPrompt = {
        id: crypto.randomUUID(),
        name: preset ? preset.name : 'Manual Prompt',
        prompt: action.prompt,
        savedAt: Date.now(),
      }
      return { ...state, archive: [entry, ...state.archive] }
    }
    case 'DELETE_ARCHIVED':
      return { ...state, archive: state.archive.filter((entry) => entry.id !== action.id) }
    case 'RESET':
      return { ...createInitialState(), archive: state.archive, hydrated: true }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  useEffect(() => {
    dispatch({ type: 'HYDRATE', draft: loadDraft(), archive: loadArchive() })
  }, [])

  useEffect(() => {
    if (!state.hydrated) return
    const timeout = setTimeout(() => {
      const draft: DraftPayload = {
        approach: state.approach,
        presetId: state.presetId,
        text: state.text,
        selections: state.selections,
        capMode: state.capMode,
      }
      saveDraft(draft)
    }, 300)
    return () => clearTimeout(timeout)
  }, [state.approach, state.presetId, state.text, state.selections, state.capMode, state.hydrated])

  useEffect(() => {
    if (!state.hydrated) return
    saveArchive(state.archive)
  }, [state.archive, state.hydrated])

  const prompt = useMemo(
    () => assemblePrompt({ text: state.text, selections: state.selections }),
    [state.text, state.selections],
  )

  return (
    <div className="min-h-screen bg-ft-beige text-ft-ink">
      <Header />
      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 pb-24 pt-8 lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <Hero eyebrow={WORLD.eyebrow} name={WORLD.name} subline={WORLD.subline} />
          <ApproachPicker
            approach={state.approach}
            onSelect={(approach) => dispatch({ type: 'SET_APPROACH', approach })}
          />
        </div>
        <aside className="h-fit rounded-[20px] bg-ft-ink p-6 text-white lg:sticky lg:top-8">
          <p className="text-white/50">{prompt || 'Nothing conjured yet.'}</p>
        </aside>
      </main>
    </div>
  )
}

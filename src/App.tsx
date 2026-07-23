import { useEffect, useMemo, useReducer, useState } from 'react'
import { WORLD } from './data/world'
import { composePrompt } from './lib/compose'
import {
  clearDraft,
  loadArchive,
  loadComposeCount,
  loadDraft,
  loadIntroSeen,
  saveArchive,
  saveComposeCount,
  saveDraft,
  saveIntroSeen,
} from './lib/storage'
import type { Approach, ArchivedPrompt, DraftPayload } from './lib/storage'
import type { Field, Preset, Section } from './data/world'
import { Header } from './components/Header'
import { IntroModal } from './components/IntroModal'
import { ApproachPicker } from './components/ApproachPicker'
import { Accordion } from './components/Accordion'
import { PresetGrid } from './components/PresetGrid'
import { TextField } from './components/TextField'
import { OptionCardGrid } from './components/OptionCardGrid'
import { IconOptionGrid } from './components/IconOptionGrid'
import { WheelSelector } from './components/WheelSelector'
import { Slider } from './components/Slider'
import { SliderVertical } from './components/SliderVertical'
import { PromptRail } from './components/PromptRail'
import type { DraftToken } from './components/PromptRail'

const CHAR_CAP = 1024
const VERTICAL_SLIDER_PAIR = ['grain', 'filmScan']

interface BuilderState extends DraftPayload {
  archive: ArchivedPrompt[]
  hydrated: boolean
  composed: string | null
}

type Action =
  | { type: 'HYDRATE'; draft: DraftPayload | null; archive: ArchivedPrompt[] }
  | { type: 'SET_APPROACH'; approach: Approach }
  | { type: 'APPLY_PRESET'; preset: Preset }
  | { type: 'SET_TEXT'; fieldId: string; value: string }
  | { type: 'SET_SELECTION'; fieldId: string; optionId: string | null }
  | { type: 'TOGGLE_CAP_MODE' }
  | { type: 'COMPOSE'; composed: string }
  | { type: 'CLEAR_COMPOSED' }
  | { type: 'ARCHIVE_PROMPT'; prompt: string }
  | { type: 'DELETE_ARCHIVED'; id: string }
  | { type: 'RESET' }

function initialText(): Record<string, string> {
  const text: Record<string, string> = {}
  for (const section of WORLD.sections) {
    for (const field of section.fields) {
      if (field.kind === 'text') text[field.id] = ''
    }
  }
  return text
}

function initialSelections(): Record<string, string | null> {
  const selections: Record<string, string | null> = {}
  for (const section of WORLD.sections) {
    for (const field of section.fields) {
      if (field.kind !== 'text') selections[field.id] = null
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
    composed: null,
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
        composed: null,
      }
    case 'SET_TEXT':
      return { ...state, text: { ...state.text, [action.fieldId]: action.value }, composed: null }
    case 'SET_SELECTION':
      return {
        ...state,
        presetId: null,
        selections: { ...state.selections, [action.fieldId]: action.optionId },
        composed: null,
      }
    case 'TOGGLE_CAP_MODE':
      return { ...state, capMode: !state.capMode }
    case 'COMPOSE':
      return { ...state, composed: action.composed }
    case 'CLEAR_COMPOSED':
      return { ...state, composed: null }
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
  const [tab, setTab] = useState<'draft' | 'archive'>('draft')
  const [copied, setCopied] = useState(false)
  const [showIntro, setShowIntro] = useState(() => !loadIntroSeen())
  const [composeCount, setComposeCount] = useState(() => loadComposeCount())
  const [openSectionIds, setOpenSectionIds] = useState<string[]>(() =>
    WORLD.sections[0] ? [WORLD.sections[0].id] : [],
  )

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

  const tokens = useMemo<DraftToken[]>(() => {
    const list: DraftToken[] = []
    for (const section of WORLD.sections) {
      for (const field of section.fields) {
        if (field.kind === 'text') {
          const value = state.text[field.id]?.trim()
          if (value) list.push({ fieldId: field.id, label: value.length > 30 ? `${value.slice(0, 30)}…` : value })
        } else {
          const optionId = state.selections[field.id]
          if (!optionId) continue
          const option = field.options.find((candidate) => candidate.id === optionId)
          if (option) list.push({ fieldId: field.id, label: option.name })
        }
      }
    }
    return list
  }, [state.text, state.selections])

  const totalFields = useMemo(
    () => WORLD.sections.reduce((count, section) => count + section.fields.length, 0),
    [],
  )

  // Sliding two-section window: a selection keeps its own section open and
  // opens the next one; once a third section enters the window, the section
  // two steps back closes.
  const advanceFrom = (sectionId: string) => {
    setOpenSectionIds((prev) => {
      const index = WORLD.sections.findIndex((section) => section.id === sectionId)
      const next = WORLD.sections[index + 1]
      const queue = prev.includes(sectionId) ? [...prev] : [...prev, sectionId]
      if (next && !queue.includes(next.id)) queue.push(next.id)
      while (queue.length > 2) queue.shift()
      return queue
    })
  }

  const toggleSection = (sectionId: string) => {
    setOpenSectionIds((prev) => {
      if (prev.includes(sectionId)) return prev.filter((id) => id !== sectionId)
      const queue = [...prev, sectionId]
      while (queue.length > 2) queue.shift()
      return queue
    })
  }

  const selectInSection = (section: Section, fieldId: string, optionId: string | null) => {
    dispatch({ type: 'SET_SELECTION', fieldId, optionId })
    if (!optionId) return
    advanceFrom(section.id)
  }

  const handleCompose = () => {
    const composed = composePrompt({ text: state.text, selections: state.selections })
    if (!composed) return
    dispatch({ type: 'COMPOSE', composed })
    const next = composeCount + 1
    setComposeCount(next)
    saveComposeCount(next)
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
    clearDraft()
    setOpenSectionIds(WORLD.sections[0] ? [WORLD.sections[0].id] : [])
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — leave the button state unchanged
    }
  }

  const closeIntro = (dontShowAgain: boolean) => {
    if (dontShowAgain) saveIntroSeen()
    setShowIntro(false)
  }

  const renderField = (section: Section, field: Field) => {
    if (field.kind === 'text') {
      return (
        <TextField
          key={field.id}
          field={field}
          value={state.text[field.id] ?? ''}
          onChange={(value) => dispatch({ type: 'SET_TEXT', fieldId: field.id, value })}
        />
      )
    }

    const selectedOptionId = state.selections[field.id] ?? null
    const setSelection = (optionId: string) => selectInSection(section, field.id, optionId)
    const toggleSelection = (optionId: string) =>
      selectInSection(section, field.id, selectedOptionId === optionId ? null : optionId)

    if (field.kind === 'slider') {
      return <Slider key={field.id} field={field} selectedOptionId={selectedOptionId} onSelect={setSelection} />
    }

    if (field.kind === 'wheel') {
      return (
        <div key={field.id} className="lg:col-span-2">
          <WheelSelector
            fieldLabel={field.label}
            options={field.options}
            selectedOptionId={selectedOptionId}
            onSelect={toggleSelection}
          />
        </div>
      )
    }

    if (field.kind === 'icon-options') {
      return (
        <IconOptionGrid key={field.id} field={field} selectedOptionId={selectedOptionId} onSelect={toggleSelection} />
      )
    }

    return <OptionCardGrid key={field.id} field={field} selectedOptionId={selectedOptionId} onSelect={toggleSelection} />
  }

  const renderSectionFields = (section: Section) => {
    const paired = section.fields.filter((field) => VERTICAL_SLIDER_PAIR.includes(field.id))
    const rest = section.fields.filter((field) => !VERTICAL_SLIDER_PAIR.includes(field.id))
    return (
      <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
        {rest.map((field) => renderField(section, field))}
        {paired.length === 2 && (
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:col-span-2">
            {paired.map((field) =>
              field.kind !== 'text' ? (
                <SliderVertical
                  key={field.id}
                  field={field}
                  selectedOptionId={state.selections[field.id] ?? null}
                  onSelect={(optionId) => selectInSection(section, field.id, optionId)}
                />
              ) : null,
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ft-beige text-ft-ink">
      {showIntro && <IntroModal onClose={closeIntro} />}
      <div className="lg:grid lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <Header composeCount={composeCount} onReset={handleReset} onShowIntro={() => setShowIntro(true)} />
          <main className="px-6 pb-24 lg:px-10">
            <section className="border-t border-ft-ink/10 pt-5">
              <h2 className="font-gilroy text-lg font-bold uppercase tracking-[0.08em]">The Approach</h2>
              <div className="mt-3">
                <ApproachPicker
                  approach={state.approach}
                  onSelect={(approach) => dispatch({ type: 'SET_APPROACH', approach })}
                />
              </div>
            </section>
            <div className="mt-6 border-t border-ft-ink/10">
              {WORLD.sections.map((section) => (
                <Accordion
                  key={section.id}
                  number={section.number}
                  title={section.title}
                  subtitle={section.subtitle}
                  open={openSectionIds.includes(section.id)}
                  onToggle={() => toggleSection(section.id)}
                >
                  {section.special === 'presets' && (
                    <PresetGrid
                      presets={WORLD.presets}
                      selectedPresetId={state.presetId}
                      onSelect={(preset) => {
                        dispatch({ type: 'APPLY_PRESET', preset })
                        advanceFrom(section.id)
                      }}
                    />
                  )}
                  {renderSectionFields(section)}
                </Accordion>
              ))}
            </div>
          </main>
        </div>
        <PromptRail
          tokens={tokens}
          filled={tokens.length}
          total={totalFields}
          composed={state.composed}
          charCap={CHAR_CAP}
          capMode={state.capMode}
          onToggleCapMode={() => dispatch({ type: 'TOGGLE_CAP_MODE' })}
          onCompose={handleCompose}
          onEditDraft={() => dispatch({ type: 'CLEAR_COMPOSED' })}
          onCopy={() => state.composed && handleCopy(state.composed)}
          onArchive={() => state.composed && dispatch({ type: 'ARCHIVE_PROMPT', prompt: state.composed })}
          copied={copied}
          tab={tab}
          onTabChange={setTab}
          archive={state.archive}
          onCopyArchived={(entry) => handleCopy(entry.prompt)}
          onDeleteArchived={(id) => dispatch({ type: 'DELETE_ARCHIVED', id })}
        />
      </div>
    </div>
  )
}

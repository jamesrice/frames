import { WORLD } from '../data/world'

export interface AssembleInput {
  text: Record<string, string>
  selections: Record<string, string | null>
}

const TEXT_FIELD_ORDER = ['subject', 'environment', 'action', 'lightAtmosphere']

export function assemblePrompt({ text, selections }: AssembleInput): string {
  const fragments: string[] = []

  for (const fieldId of TEXT_FIELD_ORDER) {
    const value = text[fieldId]?.trim()
    if (value) fragments.push(value)
  }

  for (const section of WORLD.sections) {
    if (section.kind !== 'options') continue
    for (const field of section.fields) {
      if (field.kind !== 'options') continue
      const optionId = selections[field.id]
      if (!optionId) continue
      const option = field.options.find((candidate) => candidate.id === optionId)
      if (option) fragments.push(option.phrase)
    }
  }

  if (fragments.length === 0) return ''

  const [first, ...rest] = fragments
  const sentenceCased = first.charAt(0).toUpperCase() + first.slice(1)
  const prose = [sentenceCased, ...rest].join(', ')
  return prose.endsWith('.') ? prose : `${prose}.`
}

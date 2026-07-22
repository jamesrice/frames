import type { SelectField } from '../data/world'

interface OptionCardGridProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function OptionCardGrid({ field, selectedOptionId, onSelect }: OptionCardGridProps) {
  return (
    <div className="py-4 first:pt-0">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ft-ink/60">{field.label}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              className={`rounded-[12px] border p-4 text-left transition-all duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50 ${
                active ? 'border-ft-purple bg-ft-purple/5' : 'border-ft-ink/15 hover:border-ft-purple/50'
              }`}
            >
              <span className="block font-gilroy text-base font-bold">{option.name}</span>
              <span className="mt-1 block text-sm text-ft-ink/55">{option.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

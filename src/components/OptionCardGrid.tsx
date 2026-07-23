import type { SelectField } from '../data/world'

interface OptionCardGridProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function OptionCardGrid({ field, selectedOptionId, onSelect }: OptionCardGridProps) {
  const selected = field.options.find((option) => option.id === selectedOptionId)

  return (
    <div className="py-3 first:pt-0">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ft-ink/72">{field.label}</p>
        <p className="truncate font-mono text-[11px] text-ft-purple">{selected ? selected.name : ''}</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              title={option.description}
              className={`rounded-[6px] border px-2.5 py-2 text-left transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50 ${
                active
                  ? 'border-ft-purple bg-ft-purple/5 text-ft-purple'
                  : 'border-ft-ink/15 bg-white/40 hover:border-ft-purple/50'
              }`}
            >
              <span className="block truncate font-mono text-[10px] uppercase leading-tight tracking-[0.04em]">
                {option.name}
              </span>
            </button>
          )
        })}
      </div>
      {selected && <p className="mt-2 text-xs text-ft-ink/70">{selected.description}</p>}
    </div>
  )
}

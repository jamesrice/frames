import type { SelectField } from '../data/world'

interface OptionCardGridProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function OptionCardGrid({ field, selectedOptionId, onSelect }: OptionCardGridProps) {
  return (
    <div className="py-4 first:pt-0">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">{field.label}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              className={`rounded-[6px] border p-4 text-left transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60 ${
                active
                  ? 'border-ft-purple bg-ft-purple/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-ft-purple/60'
              }`}
            >
              <span
                className={`block font-mono text-[11px] font-bold uppercase tracking-[0.08em] ${
                  active ? 'text-ft-purple' : ''
                }`}
              >
                {option.name}
              </span>
              <span className="mt-1 block text-xs leading-snug text-white/40">{option.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

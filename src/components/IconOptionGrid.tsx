import type { SelectField } from '../data/world'
import { Icon } from './Icon'

interface IconOptionGridProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function IconOptionGrid({ field, selectedOptionId, onSelect }: IconOptionGridProps) {
  return (
    <div className="py-4 first:pt-0">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ft-ink/60">{field.label}</p>
      <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              title={option.description}
              className={`flex flex-col items-center gap-2 rounded-[12px] border p-3 text-center transition-all duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50 ${
                active
                  ? 'border-ft-purple bg-ft-purple/5 text-ft-purple'
                  : 'border-ft-ink/15 text-ft-ink hover:border-ft-purple/50'
              }`}
            >
              {option.icon && <Icon name={option.icon} />}
              <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.04em]">{option.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

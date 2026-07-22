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
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">{field.label}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={active}
              className={`overflow-hidden rounded-[6px] border text-left transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60 ${
                active ? 'border-ft-purple' : 'border-white/10 hover:border-ft-purple/60'
              }`}
            >
              <div
                className={`flex aspect-[4/3] w-full items-center justify-center bg-white/5 ${
                  active ? 'text-ft-purple' : 'text-white/70'
                }`}
                aria-hidden="true"
              >
                {option.icon && <Icon name={option.icon} className="h-7 w-7" />}
              </div>
              <div className="bg-white/[0.03] p-3">
                <span
                  className={`block font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.08em] ${
                    active ? 'text-ft-purple' : ''
                  }`}
                >
                  {option.name}
                </span>
                <span className="mt-1 block text-[11px] leading-snug text-white/35">{option.description}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

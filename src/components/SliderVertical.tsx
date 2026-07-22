import type { SelectField } from '../data/world'

interface SliderVerticalProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function SliderVertical({ field, selectedOptionId, onSelect }: SliderVerticalProps) {
  const selected = field.options.find((option) => option.id === selectedOptionId)

  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">{field.label}</p>
        <p className="font-mono text-xs text-ft-purple">{selected ? selected.name : 'Not set'}</p>
      </div>
      <ul className="mt-4 border-l border-white/15">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <li key={option.id} className="relative">
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                aria-pressed={active}
                className="group flex w-full items-center gap-3 py-2.5 pl-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[4.5px] size-2 rounded-full transition-colors duration-[250ms] ease-ft ${
                    active ? 'bg-ft-purple' : 'bg-white/25 group-hover:bg-ft-purple/60'
                  }`}
                />
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.06em] transition-colors duration-[250ms] ease-ft ${
                    active ? 'font-bold text-ft-purple' : 'text-white/45 group-hover:text-white/70'
                  }`}
                >
                  {option.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 min-h-[2.5em] text-xs leading-snug text-white/35">
        {selected ? selected.description : 'Slide to set — or leave unset to let the model decide.'}
      </p>
    </div>
  )
}

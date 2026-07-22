import type { SelectField } from '../data/world'

interface SliderVerticalProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function SliderVertical({ field, selectedOptionId, onSelect }: SliderVerticalProps) {
  const selected = field.options.find((option) => option.id === selectedOptionId)

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ft-ink/50">{field.label}</p>
        <p className="font-mono text-[11px] text-ft-purple">{selected ? selected.name : 'Not set'}</p>
      </div>
      <ul className="mt-3 border-l border-ft-ink/15">
        {field.options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <li key={option.id} className="relative">
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                aria-pressed={active}
                className="group flex w-full items-center gap-3 py-1.5 pl-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[4.5px] size-2 rounded-full transition-colors duration-[250ms] ease-ft ${
                    active ? 'bg-ft-purple' : 'bg-ft-ink/20 group-hover:bg-ft-purple/60'
                  }`}
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.06em] transition-colors duration-[250ms] ease-ft ${
                    active ? 'font-bold text-ft-purple' : 'text-ft-ink/45 group-hover:text-ft-ink/70'
                  }`}
                >
                  {option.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 min-h-[2em] text-xs leading-snug text-ft-ink/40">
        {selected ? selected.description : 'Pick a stop — or leave unset to let the model decide.'}
      </p>
    </div>
  )
}

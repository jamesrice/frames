import type { SelectField } from '../data/world'

interface SliderProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

export function Slider({ field, selectedOptionId, onSelect }: SliderProps) {
  const max = field.options.length - 1
  const selectedIndex = field.options.findIndex((option) => option.id === selectedOptionId)
  const index = Math.max(0, selectedIndex)
  const selected = selectedIndex >= 0 ? field.options[selectedIndex] : undefined

  const handle = (value: number) => {
    const option = field.options[value]
    if (option) onSelect(option.id)
  }

  return (
    <div className="py-3 first:pt-0">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ft-ink/50">{field.label}</p>
        <p className="font-mono text-[11px] text-ft-purple">{selected ? selected.name : 'Not set'}</p>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={index}
        onChange={(event) => handle(Number(event.target.value))}
        onClick={(event) => handle(Number(event.currentTarget.value))}
        className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-ft-ink/15 accent-ft-purple"
        aria-label={field.label}
      />
      <div className="mt-1.5 flex justify-between gap-1 font-mono text-[9px] uppercase tracking-[0.04em]">
        {field.options.map((option, i) => (
          <span key={option.id} className={i === index && selected ? 'font-bold text-ft-purple' : 'text-ft-ink/35'}>
            {option.name}
          </span>
        ))}
      </div>
      {selected && <p className="mt-2 text-xs text-ft-ink/45">{selected.description}</p>}
    </div>
  )
}

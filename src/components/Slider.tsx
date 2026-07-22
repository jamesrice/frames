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
    <div className="py-4 first:pt-0">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/50">{field.label}</p>
        <p className="font-mono text-xs text-ft-purple">{selected ? selected.name : 'Not set'}</p>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={index}
        onChange={(event) => handle(Number(event.target.value))}
        onClick={(event) => handle(Number(event.currentTarget.value))}
        className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-ft-purple"
        aria-label={field.label}
      />
      <div className="mt-2 flex justify-between gap-1 font-mono text-[10px] uppercase tracking-[0.04em]">
        {field.options.map((option, i) => (
          <span key={option.id} className={i === index && selected ? 'font-bold text-ft-purple' : 'text-white/30'}>
            {option.name}
          </span>
        ))}
      </div>
      {selected && <p className="mt-3 text-sm text-white/40">{selected.description}</p>}
    </div>
  )
}

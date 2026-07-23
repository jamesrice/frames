import type { SelectField } from '../data/world'

interface SliderProps {
  field: SelectField
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

// Thumb diameter in px. The native <input> is invisible and only handles
// keyboard/drag; the visible thumb, fill, and labels are all positioned by
// the same fraction math so the marker always sits under its stop + label.
const THUMB = 16
const HALF = THUMB / 2

export function Slider({ field, selectedOptionId, onSelect }: SliderProps) {
  const count = field.options.length
  const max = count - 1
  const selectedIndex = field.options.findIndex((option) => option.id === selectedOptionId)
  const index = Math.max(0, selectedIndex)
  const selected = selectedIndex >= 0 ? field.options[selectedIndex] : undefined
  const fraction = max > 0 ? index / max : 0

  const handle = (value: number) => {
    const option = field.options[value]
    if (option) onSelect(option.id)
  }

  // Position along the track, in px-aware calc: HALF at fraction 0, (width - HALF) at 1.
  const at = (f: number) => `calc(${HALF}px + ${f} * (100% - ${THUMB}px))`

  return (
    <div className="py-3 first:pt-0">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ft-ink/85">{field.label}</p>
        <p className="font-mono text-[11px] text-ft-purple">{selected ? selected.name : 'Not set'}</p>
      </div>

      <div className="relative mt-4 h-4">
        {/* baseline track */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ft-ink/20"
          style={{ left: HALF, right: HALF }}
        />
        {/* filled portion */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ft-purple"
          style={{ left: HALF, width: `calc(${fraction} * (100% - ${THUMB}px))` }}
        />
        {/* stop ticks */}
        {field.options.map((option, i) => {
          const on = i <= index && selected
          return (
            <span
              key={option.id}
              aria-hidden="true"
              className={`absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                on ? 'bg-ft-purple' : 'bg-ft-ink/25'
              }`}
              style={{ left: at(max > 0 ? i / max : 0) }}
            />
          )
        })}
        {/* visible thumb */}
        {selected && (
          <span
            aria-hidden="true"
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ft-beige bg-ft-purple shadow-[0_1px_3px_rgba(19,19,19,0.35)]"
            style={{ left: at(fraction) }}
          />
        )}
        {/* invisible native input: keyboard + drag, full a11y */}
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={index}
          onChange={(event) => handle(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={field.label}
          aria-valuetext={selected ? selected.name : 'Not set'}
        />
      </div>

      <div className="relative mt-2 h-3">
        {field.options.map((option, i) => {
          const active = i === index && selected
          // Endpoint labels anchor inward so they don't clip against the panel edge.
          const translate = i === 0 ? 'translateX(0)' : i === max ? 'translateX(-100%)' : 'translateX(-50%)'
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handle(i)}
              className={`absolute whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.02em] transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50 ${
                active ? 'font-bold text-ft-purple' : 'text-ft-ink/75 hover:text-ft-ink/80'
              }`}
              style={{ left: at(max > 0 ? i / max : 0), transform: translate }}
            >
              {option.name}
            </button>
          )
        })}
      </div>

      {selected && <p className="mt-4 text-xs text-ft-ink/85">{selected.description}</p>}
    </div>
  )
}

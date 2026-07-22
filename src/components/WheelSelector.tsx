import { useMemo } from 'react'
import type { Option } from '../data/world'

interface WheelSelectorProps {
  options: Option[]
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

const SIZE = 240
const CENTER = SIZE / 2
const OUTER_R = 112
const INNER_R = 58
const GAP_DEG = 3

function polar(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) }
}

function slicePath(startAngle: number, endAngle: number) {
  const outerStart = polar(endAngle, OUTER_R)
  const outerEnd = polar(startAngle, OUTER_R)
  const innerStart = polar(endAngle, INNER_R)
  const innerEnd = polar(startAngle, INNER_R)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

function wrapLabel(text: string): string[] {
  if (text.length <= 11) return [text]
  const words = text.split(' ')
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

export function WheelSelector({ options, selectedOptionId, onSelect }: WheelSelectorProps) {
  const slices = useMemo(() => {
    const step = 360 / options.length
    return options.map((option, index) => ({
      option,
      path: slicePath(index * step + GAP_DEG / 2, (index + 1) * step - GAP_DEG / 2),
    }))
  }, [options])

  const selected = options.find((option) => option.id === selectedOptionId)
  const centerLines = selected ? wrapLabel(selected.name) : ['Undecided']

  return (
    <div className="flex flex-col items-center gap-8 py-4 sm:flex-row sm:items-center sm:justify-center">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="shrink-0">
        {slices.map(({ option, path }) => {
          const active = option.id === selectedOptionId
          return (
            <path
              key={option.id}
              d={path}
              className={`cursor-pointer stroke-ft-ink outline-none transition-colors duration-[250ms] ease-ft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ft-purple ${
                active ? 'fill-ft-purple' : 'fill-white/10 hover:fill-ft-purple/40'
              }`}
              strokeWidth={3}
              onClick={() => onSelect(option.id)}
              role="button"
              aria-pressed={active}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(option.id)
                }
              }}
            />
          )
        })}
        <circle cx={CENTER} cy={CENTER} r={INNER_R - 5} className="fill-ft-purple" />
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-mono text-[10px] font-bold uppercase tracking-[0.08em]"
        >
          {centerLines.map((line, index) => (
            <tspan key={line} x={CENTER} dy={index === 0 ? `${-(centerLines.length - 1) * 0.6}em` : '1.2em'}>
              {line}
            </tspan>
          ))}
        </text>
      </svg>
      <ul className="grid w-full grid-cols-2 gap-2 sm:max-w-xs">
        {options.map((option) => {
          const active = option.id === selectedOptionId
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                aria-pressed={active}
                className={`w-full rounded-full border px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.06em] transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50 ${
                  active
                    ? 'border-ft-purple bg-ft-purple text-white'
                    : 'border-white/15 text-white/60 hover:border-ft-purple/60'
                }`}
              >
                {option.name}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

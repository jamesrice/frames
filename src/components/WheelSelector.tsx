import { useMemo } from 'react'
import type { Option } from '../data/world'

interface WheelSelectorProps {
  fieldLabel: string
  options: Option[]
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
}

const SIZE = 480
const CENTER = SIZE / 2
const OUTER_R = 234
const INNER_R = 122
const LABEL_R = (OUTER_R + INNER_R) / 2 + 8

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

export function WheelSelector({ fieldLabel, options, selectedOptionId, onSelect }: WheelSelectorProps) {
  const slices = useMemo(() => {
    const step = 360 / options.length
    return options.map((option, index) => {
      const mid = index * step + step / 2
      return {
        option,
        path: slicePath(index * step, (index + 1) * step),
        label: polar(mid, LABEL_R),
      }
    })
  }, [options])

  const selected = options.find((option) => option.id === selectedOptionId)

  return (
    <div className="flex justify-center py-2">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full max-w-[400px]" role="group" aria-label={fieldLabel}>
        {slices.map(({ option, path }) => {
          const active = option.id === selectedOptionId
          return (
            <path
              key={option.id}
              d={path}
              className={`cursor-pointer stroke-ft-ink/15 outline-none transition-colors duration-[250ms] ease-ft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ft-purple ${
                active ? 'fill-ft-ink/15' : 'fill-ft-ink/[0.04] hover:fill-ft-purple/15'
              }`}
              strokeWidth={1}
              onClick={() => onSelect(option.id)}
              role="button"
              aria-pressed={active}
              aria-label={option.name}
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
        {slices.map(({ option, label }) => {
          const active = option.id === selectedOptionId
          return (
            <text
              key={`label-${option.id}`}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`pointer-events-none select-none font-mono text-[17px] transition-colors duration-[250ms] ease-ft ${
                active ? 'fill-ft-purple' : 'fill-ft-ink/45'
              }`}
            >
              {option.name}
            </text>
          )
        })}
        <circle cx={CENTER} cy={CENTER} r={INNER_R - 4} className="fill-ft-purple" />
        <text
          x={CENTER}
          y={CENTER - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-gilroy text-[30px] font-bold"
        >
          {selected ? selected.name : 'Undecided'}
        </text>
        <text
          x={CENTER}
          y={CENTER + 26}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white/70 font-mono text-[13px] uppercase"
          style={{ letterSpacing: '0.2em' }}
        >
          {fieldLabel}
        </text>
      </svg>
    </div>
  )
}

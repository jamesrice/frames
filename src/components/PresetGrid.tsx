import type { Preset } from '../data/world'
import { Icon } from './Icon'

interface PresetGridProps {
  presets: Preset[]
  selectedPresetId: string | null
  onSelect: (preset: Preset) => void
}

const TILE_COLORS: Record<Preset['tileColor'], string> = {
  aqua: 'bg-ft-aqua',
  blue: 'bg-ft-blue',
  red: 'bg-ft-red',
  orange: 'bg-ft-orange',
}

export function PresetGrid({ presets, selectedPresetId, onSelect }: PresetGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {presets.map((preset) => {
        const active = preset.id === selectedPresetId
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            aria-pressed={active}
            className={`overflow-hidden rounded-[6px] border text-left transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60 ${
              active ? 'border-ft-purple' : 'border-white/10 hover:border-ft-purple/60'
            }`}
          >
            <div
              className={`flex aspect-[4/3] w-full items-center justify-center text-white ${TILE_COLORS[preset.tileColor]}`}
              aria-hidden="true"
            >
              <Icon name={preset.icon} className="h-8 w-8" />
            </div>
            <div className="bg-white/5 p-3">
              <h4 className={`font-mono text-xs font-bold uppercase tracking-[0.08em] ${active ? 'text-ft-purple' : ''}`}>
                {preset.name}
              </h4>
              <p className="mt-1 font-mono text-[10px] leading-relaxed text-white/35">{preset.specString}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

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
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      {presets.map((preset) => {
        const active = preset.id === selectedPresetId
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            aria-pressed={active}
            className={`flex items-center gap-3 overflow-hidden rounded-[6px] border p-2.5 text-left transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60 ${
              active ? 'border-ft-purple bg-ft-purple/5' : 'border-ft-ink/15 bg-white/40 hover:border-ft-purple/60'
            }`}
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-[4px] text-white ${TILE_COLORS[preset.tileColor]}`}
              aria-hidden="true"
            >
              <Icon name={preset.icon} className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span
                className={`block truncate font-mono text-[11px] font-bold uppercase tracking-[0.06em] ${
                  active ? 'text-ft-purple' : ''
                }`}
              >
                {preset.name}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[10px] text-ft-ink/65">{preset.specString}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

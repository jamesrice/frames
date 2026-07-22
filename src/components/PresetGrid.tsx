import type { Preset } from '../data/world'

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {presets.map((preset) => {
        const active = preset.id === selectedPresetId
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            aria-pressed={active}
            className={`overflow-hidden rounded-[20px] border text-left transition-all duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50 ${
              active
                ? 'border-ft-purple shadow-[0_10px_25px_rgba(76,0,255,0.12)]'
                : 'border-ft-ink/15 hover:border-ft-purple/60'
            }`}
          >
            <div className={`h-24 w-full ${TILE_COLORS[preset.tileColor]}`} aria-hidden="true" />
            <div className="p-5">
              <h4 className="font-gilroy text-lg font-semibold">{preset.name}</h4>
              <p className="mt-1 font-mono text-xs text-ft-ink/55">{preset.specString}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

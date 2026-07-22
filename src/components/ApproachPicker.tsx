import type { Approach } from '../lib/storage'

interface ApproachPickerProps {
  approach: Approach | null
  onSelect: (approach: Approach) => void
}

const CARDS: { id: Approach; title: string; description: string }[] = [
  { id: 'prelit', title: 'Pre-Lit', description: 'Start from a curated look. Adjust and build from there.' },
  { id: 'manual', title: 'Manual Setup', description: 'A blank slate — you set the lights and dial every control.' },
]

export function ApproachPicker({ approach, onSelect }: ApproachPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CARDS.map((card) => {
        const active = approach === card.id
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            aria-pressed={active}
            className={`rounded-[6px] border px-5 py-4 text-left transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              active
                ? 'border-ft-purple bg-ft-purple text-white'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-ft-purple/60'
            }`}
          >
            <span className="block font-mono text-sm font-bold uppercase tracking-[0.12em]">{card.title}</span>
            <span className={`mt-1 block text-sm ${active ? 'text-white/80' : 'text-white/40'}`}>{card.description}</span>
          </button>
        )
      })}
    </div>
  )
}

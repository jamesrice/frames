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
            className={`rounded-[6px] border px-4 py-3 text-left transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-ink/40 ${
              active
                ? 'border-ft-purple bg-ft-purple text-white'
                : 'border-ft-ink/15 bg-white/40 text-ft-ink/70 hover:border-ft-purple/60'
            }`}
          >
            <span className="block font-mono text-xs font-bold uppercase tracking-[0.12em]">{card.title}</span>
            <span className={`mt-0.5 block text-xs ${active ? 'text-white/80' : 'text-ft-ink/40'}`}>
              {card.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

import type { Approach } from '../lib/storage'

interface ApproachPickerProps {
  approach: Approach | null
  onSelect: (approach: Approach) => void
}

const CARDS: { id: Approach; title: string; description: string }[] = [
  { id: 'prelit', title: 'Pre-Lit', description: 'Start from a curated look and adjust what you like.' },
  { id: 'manual', title: 'Manual Setup', description: 'Build the frame field by field, from nothing.' },
]

export function ApproachPicker({ approach, onSelect }: ApproachPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CARDS.map((card) => {
        const active = approach === card.id
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            aria-pressed={active}
            className={`rounded-[20px] border p-6 text-left transition-all duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50 ${
              active
                ? 'border-ft-purple bg-ft-purple/5 shadow-[0_10px_25px_rgba(76,0,255,0.12)]'
                : 'border-ft-ink/15 hover:border-ft-purple/60'
            }`}
          >
            <h3 className="font-gilroy text-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-ft-ink/60">{card.description}</p>
          </button>
        )
      })}
    </div>
  )
}

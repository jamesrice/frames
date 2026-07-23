import { useState } from 'react'

interface IntroModalProps {
  onClose: (dontShowAgain: boolean) => void
}

const STEPS: { number: string; title: string; body: string }[] = [
  {
    number: '01',
    title: 'Choose your approach',
    body: 'Presets drop you into a curated look you can adjust from there. Skip and start empty at step 2 — every control is yours to dial.',
  },
  {
    number: '02',
    title: 'Set the scene',
    body: 'Describe subject, environment, and action: who is in frame, where they are, and what is happening.',
  },
  {
    number: '03',
    title: 'Direct',
    body: 'Work down the page to set emotion, style, light quality, composition, camera body, film stock, grain, and era. Every choice becomes a token in your draft.',
  },
  {
    number: '04',
    title: 'Compose & send',
    body: 'Hit Compose Prompt to expand your tokens into a full director-style prompt, then copy it into the image model of your choice.',
  },
]

export function IntroModal({ onClose }: IntroModalProps) {
  const [dontShow, setDontShow] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ft-ink/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className="relative w-full max-w-md rounded-[12px] border border-ft-ink/10 bg-ft-beige p-8 shadow-[0_20px_60px_rgba(19,19,19,0.35)]">
        <button
          type="button"
          onClick={() => onClose(dontShow)}
          aria-label="Close"
          className="absolute right-4 top-4 font-mono text-sm text-ft-ink/65 transition-colors duration-[250ms] ease-ft hover:text-ft-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60"
        >
          ×
        </button>

        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ft-purple">How it works</p>
        <h2 id="intro-title" className="mt-3 font-gilroy text-2xl font-bold uppercase tracking-wide">
          Compose your prompt
        </h2>

        <ol className="mt-6 space-y-4">
          {STEPS.map((step) => (
            <li key={step.number}>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ft-ink/72">
                <span className="mr-2 text-ft-purple">{step.number}</span>
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ft-ink/85">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ft-ink/72">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(event) => setDontShow(event.target.checked)}
              className="size-4 cursor-pointer appearance-none rounded-[3px] border border-ft-ink/30 accent-ft-purple checked:appearance-auto"
            />
            Don't show again
          </label>
          <button
            type="button"
            onClick={() => onClose(dontShow)}
            className="rounded-[6px] bg-ft-purple px-6 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white transition-colors duration-[250ms] ease-ft hover:bg-ft-purple/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-ink/60"
          >
            Start composing
          </button>
        </div>
      </div>
    </div>
  )
}

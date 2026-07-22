import { useState, type ReactNode } from 'react'

interface AccordionProps {
  number: string
  title: string
  subtitle: string
  children: ReactNode
}

export function Accordion({ number, title, subtitle, children }: AccordionProps) {
  const [open, setOpen] = useState(true)
  const panelId = `accordion-panel-${number}`

  return (
    <div className="border-b border-white/10 py-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-baseline justify-between gap-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50"
      >
        <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono text-sm text-ft-purple">{number}</span>
          <span className="font-gilroy text-2xl font-bold uppercase tracking-[0.08em]">{title}</span>
          <span className="text-sm text-white/35">{subtitle}</span>
        </span>
        <span
          className={`shrink-0 font-mono text-xl text-white/50 transition-transform duration-[250ms] ease-ft ${
            open ? 'rotate-45' : ''
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-[250ms] ease-ft ${
          open ? 'mt-6 grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

import { useState, type ReactNode } from 'react'

interface AccordionProps {
  number: string
  title: string
  subtitle: string
  children: ReactNode
}

export function Accordion({ number, title, subtitle, children }: AccordionProps) {
  const [open, setOpen] = useState(false)
  const panelId = `accordion-panel-${number}`

  return (
    <div className="border-b border-ft-ink/10 py-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50"
      >
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-ft-purple">{number}</span>
          <span>
            <span className="block font-gilroy text-2xl font-semibold">{title}</span>
            <span className="mt-1 block text-sm text-ft-ink/55">{subtitle}</span>
          </span>
        </span>
        <span
          className={`mt-2 shrink-0 text-2xl font-light transition-transform duration-[250ms] ease-ft ${
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

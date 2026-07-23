interface ConsentBannerProps {
  onAccept: () => void
  onDecline: () => void
}

export function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:right-auto sm:max-w-sm">
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent"
        className="rounded-[10px] border border-ft-ink/15 bg-ft-beige p-5 shadow-[0_16px_40px_rgba(19,19,19,0.28)]"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ft-purple">Cookies</p>
        <p className="mt-2 text-sm leading-relaxed text-ft-ink/80">
          We use analytics cookies (Google Analytics, LinkedIn, Snitcher) to understand traffic. Nothing loads until you
          choose.
        </p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={onAccept}
            className="rounded-[6px] bg-ft-purple px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-colors duration-[250ms] ease-ft hover:bg-ft-purple/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-ink/50"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="rounded-[6px] border border-ft-ink/20 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ft-ink/75 transition-colors duration-[250ms] ease-ft hover:border-ft-ink hover:text-ft-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

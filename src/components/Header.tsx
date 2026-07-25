interface HeaderProps {
  composeCount: number
  onReset: () => void
  onShowIntro: () => void
}

export function Header({ composeCount, onReset, onShowIntro }: HeaderProps) {
  return (
    <header className="flex items-start justify-between gap-6 px-6 pb-5 pt-5 lg:px-10">
      <div className="min-w-0">
        <h1 className="leading-none">
          <img src="/imagology.svg" alt="Imagology" className="h-12 w-auto lg:h-14" />
        </h1>
        <p className="mt-3 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-ft-ink/85">
          Explore prompting for photography. Built as example of custom, brand controlled image generation.
        </p>
      </div>
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-end gap-1 pt-1">
          <button
            type="button"
            onClick={onShowIntro}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-ft-ink/65 transition-colors duration-[250ms] ease-ft hover:text-ft-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-ft-ink/65 transition-colors duration-[250ms] ease-ft hover:text-ft-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60"
          >
            Reset settings
          </button>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ft-ink/65">Composed</p>
          <p className="font-mono text-3xl leading-none text-ft-purple">{composeCount}</p>
        </div>
      </div>
    </header>
  )
}

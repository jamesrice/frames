interface HeaderProps {
  composeCount: number
  onReset: () => void
  onShowIntro: () => void
}

export function Header({ composeCount, onReset, onShowIntro }: HeaderProps) {
  return (
    <header className="flex items-start justify-between gap-6 px-6 pb-6 pt-6 lg:px-10">
      <div>
        <h1 className="font-gilroy text-4xl font-bold uppercase leading-none tracking-tight lg:text-5xl">Frames</h1>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
          Best paired with your image model of choice
        </p>
      </div>
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <button
            type="button"
            onClick={onShowIntro}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 transition-colors duration-[250ms] ease-ft hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 transition-colors duration-[250ms] ease-ft hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60"
          >
            Reset settings
          </button>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">Composed</p>
          <p className="font-mono text-4xl leading-none text-ft-purple">{composeCount}</p>
        </div>
      </div>
    </header>
  )
}

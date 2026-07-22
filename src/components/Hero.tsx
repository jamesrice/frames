interface HeroProps {
  eyebrow: string
  name: string
  subline: string
}

export function Hero({ eyebrow, name, subline }: HeroProps) {
  return (
    <section className="pb-12 pt-4">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-ft-purple">{eyebrow}</p>
      <h1 className="mt-4 max-w-[16ch] font-gilroy text-[clamp(40px,7vw,88px)] font-bold leading-[0.95] tracking-[-0.02em]">
        {name}
      </h1>
      <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ft-ink/70">{subline}</p>
    </section>
  )
}

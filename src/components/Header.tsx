const NAV_LINKS = ['Worlds', 'Archive', 'Manual', 'Pricing']

export function Header() {
  return (
    <header className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-6">
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={25}
          viewBox="0 0 64 67"
          fill="none"
          className="text-ft-ink"
          aria-hidden="true"
        >
          <path d="M31.939 42.5853L21.286 36.5151L31.939 30.4136L42.5892 36.5094L31.939 42.5882" fill="currentColor" />
          <path
            d="M42.5892 12.1831L31.9419 6.0873L21.286 0L10.6359 6.10432L21.286 12.1916L31.9419 18.2874L42.5892 24.3832L53.2365 18.2818L42.5892 12.1831Z"
            fill="currentColor"
          />
          <path d="M53.2365 30.4168L63.8837 24.3862L53.2365 18.2876V30.4168Z" fill="currentColor" />
          <path d="M10.6358 18.2251L0 24.3294L7.08866 28.3905L10.6358 30.4196V18.2251Z" fill="currentColor" />
          <path
            d="M31.9419 18.2876L21.286 12.1918L10.6358 6.10449V18.2252V30.4196L7.08866 28.3905L0 24.3295V36.5807L10.6358 42.6765V48.7808V54.6752V54.8057V60.91L21.286 67.0002V60.8987V54.8738V48.7723L31.9419 54.8256V54.695V48.778V42.5857L21.286 36.5154V24.3181L31.9419 30.4111L42.5891 36.5098V24.3834L31.9419 18.2876Z"
            fill="currentColor"
          />
          <path d="M42.5891 54.8396V48.6416L31.9418 54.8254V60.8758L42.5891 66.9659V60.8985V54.8396Z" fill="currentColor" />
        </svg>
        <span className="font-mono text-sm uppercase tracking-[0.08em]">Frames</span>
      </div>
      <nav className="hidden items-center gap-8 font-mono text-sm uppercase tracking-[0.08em] text-ft-ink/60 md:flex">
        {NAV_LINKS.map((link) => (
          <span key={link} aria-disabled="true" className="cursor-default select-none">
            {link}
          </span>
        ))}
      </nav>
      <button
        type="button"
        aria-disabled="true"
        className="cursor-default rounded-full border-[1.5px] border-ft-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.08em]"
      >
        Sign In
      </button>
    </header>
  )
}

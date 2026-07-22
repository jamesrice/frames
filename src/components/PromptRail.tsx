import type { ArchivedPrompt } from '../lib/storage'
import { ArchiveList } from './ArchiveList'

interface PromptRailProps {
  prompt: string
  charCap: number
  capMode: boolean
  onToggleCapMode: () => void
  onCopy: () => void
  onArchive: () => void
  onReset: () => void
  copied: boolean
  tab: 'draft' | 'archive'
  onTabChange: (tab: 'draft' | 'archive') => void
  archive: ArchivedPrompt[]
  onCopyArchived: (entry: ArchivedPrompt) => void
  onDeleteArchived: (id: string) => void
}

export function PromptRail({
  prompt,
  charCap,
  capMode,
  onToggleCapMode,
  onCopy,
  onArchive,
  onReset,
  copied,
  tab,
  onTabChange,
  archive,
  onCopyArchived,
  onDeleteArchived,
}: PromptRailProps) {
  const empty = prompt.length === 0
  const overLimit = capMode && prompt.length > charCap

  return (
    <aside className="h-fit rounded-[20px] bg-ft-ink text-white lg:sticky lg:top-8">
      <div className="flex border-b border-white/10">
        {(['draft', 'archive'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onTabChange(value)}
            aria-pressed={tab === value}
            className={`flex-1 py-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
              tab === value ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {value === 'draft' ? 'Draft' : `Archive (${archive.length})`}
          </button>
        ))}
      </div>

      {tab === 'draft' ? (
        <div className="p-6">
          <div className="min-h-[160px] text-lg leading-relaxed">
            {empty ? (
              <p className="text-white/50">
                <span className="bg-gradient-to-r from-[#F24A3D] to-[#F9B8C2] bg-clip-text text-transparent">
                  Nothing conjured
                </span>{' '}
                yet. Pick a preset or start building below — the prompt takes shape right here.
              </p>
            ) : (
              <p>{prompt}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between font-mono text-xs text-white/50">
            <button
              type="button"
              onClick={onToggleCapMode}
              aria-pressed={capMode}
              className="uppercase tracking-[0.08em] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {capMode ? 'Cap: On' : 'Cap: Off'}
            </button>
            <span className={overLimit ? 'text-[#F24A3D]' : ''}>
              {capMode
                ? `${prompt.length} / ${charCap}${overLimit ? ` (over by ${prompt.length - charCap})` : ''}`
                : prompt.length}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={empty}
              onClick={onCopy}
              className="rounded-full border-[1.5px] border-white px-5 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-[250ms] ease-ft hover:bg-ft-purple hover:border-ft-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white disabled:hover:bg-transparent"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              disabled={empty}
              onClick={onArchive}
              className="rounded-full border-[1.5px] border-white px-5 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-[250ms] ease-ft hover:bg-ft-purple hover:border-ft-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white disabled:hover:bg-transparent"
            >
              Archive
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border-[1.5px] border-white/30 px-5 py-2 font-mono text-xs uppercase tracking-[0.08em] text-white/60 transition-colors duration-[250ms] ease-ft hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <ArchiveList archive={archive} onCopy={onCopyArchived} onDelete={onDeleteArchived} />
      )}
    </aside>
  )
}

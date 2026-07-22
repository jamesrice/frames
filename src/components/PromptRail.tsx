import type { ArchivedPrompt } from '../lib/storage'
import { ArchiveList } from './ArchiveList'

export interface DraftToken {
  fieldId: string
  label: string
}

interface PromptRailProps {
  tokens: DraftToken[]
  filled: number
  total: number
  composed: string | null
  charCap: number
  capMode: boolean
  onToggleCapMode: () => void
  onCompose: () => void
  onEditDraft: () => void
  onCopy: () => void
  onArchive: () => void
  copied: boolean
  tab: 'draft' | 'archive'
  onTabChange: (tab: 'draft' | 'archive') => void
  archive: ArchivedPrompt[]
  onCopyArchived: (entry: ArchivedPrompt) => void
  onDeleteArchived: (id: string) => void
}

export function PromptRail({
  tokens,
  filled,
  total,
  composed,
  charCap,
  capMode,
  onToggleCapMode,
  onCompose,
  onEditDraft,
  onCopy,
  onArchive,
  copied,
  tab,
  onTabChange,
  archive,
  onCopyArchived,
  onDeleteArchived,
}: PromptRailProps) {
  const empty = tokens.length === 0
  const overLimit = capMode && composed !== null && composed.length > charCap

  return (
    <aside className="flex flex-col border-t border-white/10 bg-ft-panel lg:sticky lg:top-0 lg:h-screen lg:border-l lg:border-t-0">
      <div className="flex shrink-0">
        {(['draft', 'archive'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onTabChange(value)}
            aria-pressed={tab === value}
            className={`flex-1 border-b py-4 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-[250ms] ease-ft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60 ${
              tab === value
                ? 'border-ft-purple text-ft-purple'
                : 'border-white/10 text-white/40 hover:text-white/70'
            }`}
          >
            {value === 'draft' ? 'Draft' : `Archive · ${archive.length}`}
          </button>
        ))}
      </div>

      {tab === 'draft' ? (
        <>
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-white/70">
                {composed ? 'Composed prompt' : 'Draft prompt'}
              </p>
              <p className={`font-mono text-xs ${overLimit ? 'text-ft-red' : 'text-ft-purple'}`}>
                {composed
                  ? `${composed.length}${capMode ? ` / ${charCap}` : ''}${
                      overLimit ? ` (over by ${composed.length - charCap})` : ''
                    }`
                  : `${filled} / ${total}`}
              </p>
            </div>

            {composed ? (
              <div className="mt-4">
                <p className="text-sm leading-relaxed text-white/85">{composed}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onCopy}
                    className="rounded-[6px] border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-[250ms] ease-ft hover:border-ft-purple hover:bg-ft-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={onArchive}
                    className="rounded-[6px] border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-[250ms] ease-ft hover:border-ft-purple hover:bg-ft-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={onEditDraft}
                    className="rounded-[6px] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/50 transition-colors duration-[250ms] ease-ft hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/60"
                  >
                    Back to tokens
                  </button>
                </div>
              </div>
            ) : empty ? (
              <p className="mt-4 text-sm leading-relaxed text-white/40">
                Nothing set yet. Pick a preset or work the controls — every selection lands here as a token.
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {tokens.map((token) => (
                  <span
                    key={token.fieldId}
                    className="rounded-[4px] border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.04em] text-white/80"
                  >
                    {token.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-white/10 p-5">
            <label className="flex cursor-pointer items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
              <input
                type="checkbox"
                checked={capMode}
                onChange={onToggleCapMode}
                className="size-3.5 cursor-pointer appearance-none rounded-[3px] border border-white/30 accent-ft-purple checked:appearance-auto"
              />
              Limit character count for Adobe Firefly
            </label>
            <button
              type="button"
              disabled={empty}
              onClick={onCompose}
              className="mt-4 w-full rounded-[6px] bg-ft-purple py-3.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors duration-[250ms] ease-ft hover:bg-ft-purple/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
            >
              Compose prompt
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ArchiveList archive={archive} onCopy={onCopyArchived} onDelete={onDeleteArchived} />
        </div>
      )}
    </aside>
  )
}

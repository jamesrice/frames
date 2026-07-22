import type { ArchivedPrompt } from '../lib/storage'

interface ArchiveListProps {
  archive: ArchivedPrompt[]
  onCopy: (entry: ArchivedPrompt) => void
  onDelete: (id: string) => void
}

export function ArchiveList({ archive, onCopy, onDelete }: ArchiveListProps) {
  if (archive.length === 0) {
    return <p className="p-6 font-mono text-xs text-white/40">Nothing archived yet — compose a prompt from the Draft tab.</p>
  }

  return (
    <ul className="divide-y divide-white/10 overflow-y-auto">
      {archive.map((entry) => (
        <li key={entry.id} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.08em]">{entry.name}</p>
              <p className="mt-1 font-mono text-[10px] text-white/35">{new Date(entry.savedAt).toLocaleString()}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => onCopy(entry)}
                className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/50 hover:text-ft-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ft-purple/50"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/55">{entry.prompt}</p>
        </li>
      ))}
    </ul>
  )
}

import type { ArchivedPrompt } from '../lib/storage'

interface ArchiveListProps {
  archive: ArchivedPrompt[]
  onCopy: (entry: ArchivedPrompt) => void
  onDelete: (id: string) => void
}

export function ArchiveList({ archive, onCopy, onDelete }: ArchiveListProps) {
  if (archive.length === 0) {
    return <p className="p-6 text-sm text-white/50">Nothing archived yet — save a prompt from the Draft tab.</p>
  }

  return (
    <ul className="max-h-[520px] divide-y divide-white/10 overflow-y-auto">
      {archive.map((entry) => (
        <li key={entry.id} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-gilroy text-sm font-semibold">{entry.name}</p>
              <p className="mt-1 text-xs text-white/40">{new Date(entry.savedAt).toLocaleString()}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onCopy(entry)}
                className="font-mono text-xs uppercase tracking-[0.08em] text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => onDelete(entry.id)}
                className="font-mono text-xs uppercase tracking-[0.08em] text-white/60 hover:text-[#F24A3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm text-white/70">{entry.prompt}</p>
        </li>
      ))}
    </ul>
  )
}

import type { TextField as TextFieldModel } from '../data/world'

interface TextFieldProps {
  field: TextFieldModel
  value: string
  onChange: (value: string) => void
}

export function TextField({ field, value, onChange }: TextFieldProps) {
  return (
    <label className="block py-4 first:pt-0">
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-ft-ink/60">{field.label}</span>
      <span className="mt-1 block text-sm text-ft-ink/45">{field.hint}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={2}
        className="mt-3 w-full resize-y rounded-[12px] border border-ft-ink/15 bg-white/40 p-4 text-base leading-relaxed outline-none transition-colors duration-[250ms] ease-ft placeholder:text-ft-ink/30 focus:border-ft-purple focus-visible:ring-2 focus-visible:ring-ft-purple/40"
      />
    </label>
  )
}

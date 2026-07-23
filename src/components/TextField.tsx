import type { TextField as TextFieldModel } from '../data/world'

interface TextFieldProps {
  field: TextFieldModel
  value: string
  onChange: (value: string) => void
}

export function TextField({ field, value, onChange }: TextFieldProps) {
  return (
    <label className="block py-3 first:pt-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ft-ink/80">
        {field.label} <span className="ml-2 normal-case tracking-normal text-ft-ink/60">{field.hint}</span>
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={2}
        className="mt-2 w-full resize-y rounded-[6px] border border-ft-ink/15 bg-white/50 p-3 font-mono text-xs leading-relaxed text-ft-ink outline-none transition-colors duration-[250ms] ease-ft placeholder:text-ft-ink/55 focus:border-ft-purple focus-visible:ring-2 focus-visible:ring-ft-purple/40"
      />
      {field.helper && (
        <span className="mt-1.5 block font-mono text-[10px] leading-relaxed text-ft-ink/60">{field.helper}</span>
      )}
    </label>
  )
}

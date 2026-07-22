import type { TextField as TextFieldModel } from '../data/world'

interface TextFieldProps {
  field: TextFieldModel
  value: string
  onChange: (value: string) => void
}

export function TextField({ field, value, onChange }: TextFieldProps) {
  return (
    <label className="block py-4 first:pt-0">
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/70">
        {field.label} <span className="ml-2 normal-case tracking-normal text-white/30">{field.hint}</span>
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={2}
        className="mt-3 w-full resize-y rounded-[6px] border border-white/10 bg-black/40 p-4 font-mono text-sm leading-relaxed text-ft-beige outline-none transition-colors duration-[250ms] ease-ft placeholder:text-white/25 focus:border-ft-purple focus-visible:ring-2 focus-visible:ring-ft-purple/40"
      />
      {field.helper && <span className="mt-2 block font-mono text-[10px] leading-relaxed text-white/30">{field.helper}</span>}
    </label>
  )
}

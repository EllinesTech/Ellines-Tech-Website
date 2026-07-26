import { cn } from '@/lib/utils'

/** Shared input/textarea/select surface so forms across the site stay consistent. */
export const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition-colors placeholder:text-slate-500 hover:border-white/20 focus:border-brand-400/60 focus:bg-white/[0.06] focus:outline-none'

/** Native selects need an opaque background so the option list is readable. */
export const selectClass = fieldClass.replace('bg-white/[0.03]', 'bg-slate-900')

interface FieldProps {
  label: string
  htmlFor: string
  hint?: string
  optional?: boolean
  className?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, hint, optional, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between gap-3 text-[13px] font-medium text-slate-300"
      >
        <span>{label}</span>
        {optional && (
          <span className="text-[11px] font-normal uppercase tracking-[0.14em] text-slate-500">
            Optional
          </span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

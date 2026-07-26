import { Button } from '@/components/ui/Button'

type CtaAction = {
  label: string
  href: string
  external?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}

type CtaPanelProps = {
  eyebrow?: string
  title: string
  description: string
  primary: CtaAction
  secondary?: CtaAction
  className?: string
  /** Wider layout with actions aligned to the right on desktop */
  split?: boolean
}

export function CtaPanel({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  className = '',
  split = false,
}: CtaPanelProps) {
  const actions = (
    <div className={`flex flex-col gap-3 sm:flex-row ${split ? 'sm:shrink-0' : ''}`}>
      <Button
        href={primary.href}
        size="lg"
        icon
        variant={primary.variant ?? 'primary'}
        external={primary.external}
      >
        {primary.label}
      </Button>
      {secondary ? (
        <Button
          href={secondary.href}
          size="lg"
          variant={secondary.variant ?? 'secondary'}
          external={secondary.external}
        >
          {secondary.label}
        </Button>
      ) : null}
    </div>
  )

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-brand-500/20 bg-gradient-to-br from-brand-900/50 via-slate-950 to-sky-950/60 p-8 sm:p-12 ${className}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand-500/10 blur-3xl" />
      <div
        className={`relative ${
          split
            ? 'flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center'
            : 'max-w-xl'
        }`}
      >
        <div className={split ? 'max-w-xl' : undefined}>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={`font-display text-2xl font-bold tracking-tight text-white sm:text-3xl ${
              eyebrow ? 'mt-4' : ''
            }`}
          >
            {title}
          </h2>
          <p className="mt-4 text-slate-300">{description}</p>
          {!split ? <div className="mt-8">{actions}</div> : null}
        </div>
        {split ? actions : null}
      </div>
    </div>
  )
}

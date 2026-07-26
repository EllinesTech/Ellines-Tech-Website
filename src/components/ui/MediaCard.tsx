import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Aspect = 'wide' | 'photo' | 'portrait'

const aspectClass: Record<Aspect, string> = {
  wide: 'aspect-[16/9]',
  photo: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
}

interface MediaCardProps {
  title: string
  image: string
  imageFit?: 'cover' | 'contain'
  aspect?: Aspect
  eyebrow?: string
  description?: string
  href?: string
  external?: boolean
  /** Small glass chip floated over the artwork — an icon, index, or partner mark. */
  badge?: React.ReactNode
  /** Optional line pinned to the bottom-right of the artwork. */
  overline?: React.ReactNode
  cta?: string
  /** Stagger position within its grid. */
  index?: number
  className?: string
  bodyClassName?: string
  children?: React.ReactNode
}

export function MediaCard({
  title,
  image,
  imageFit = 'cover',
  aspect = 'wide',
  eyebrow,
  description,
  href,
  external,
  badge,
  overline,
  cta,
  index = 0,
  className,
  bodyClassName,
  children,
}: MediaCardProps) {
  const interactive = Boolean(href)

  const inner = (
    <>
      <div
        className={cn(
          'relative overflow-hidden',
          aspectClass[aspect],
          imageFit === 'contain' &&
            'bg-gradient-to-br from-slate-900 via-surface to-slate-950',
        )}
      >
        <img
          src={image}
          alt=""
          className={cn(
            'h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]',
            imageFit === 'contain' ? 'object-contain p-7 sm:p-8' : 'object-cover object-center',
          )}
          loading="lazy"
        />
        {/* Photos get a scrim so overlays stay legible; logo stages are already dark. */}
        {imageFit === 'cover' && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
        {overline && <div className="absolute bottom-4 right-4">{overline}</div>}
      </div>

      <div className={cn('flex flex-1 flex-col p-6', bodyClassName)}>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">
            {eyebrow}
          </p>
        )}
        <h3
          className={cn(
            'font-display text-lg font-semibold tracking-tight text-white sm:text-xl',
            eyebrow && 'mt-2',
            interactive && 'transition-colors group-hover:text-brand-200',
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{description}</p>
        )}
        {children}
        {cta && (
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
            {cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </>
  )

  const shell = cn(
    'group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-surface-elevated/40 transition-all duration-300',
    interactive && 'hover:-translate-y-1 hover:border-brand-500/35 hover:bg-surface-elevated/70',
    className,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: Math.min(index, 5) * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {href ? (
        external || href.startsWith('http') ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={shell}
          >
            {inner}
          </a>
        ) : (
          <Link to={href} className={shell}>
            {inner}
          </Link>
        )
      ) : (
        <article className={shell}>{inner}</article>
      )}
    </motion.div>
  )
}

/** Glass icon chip used over MediaCard artwork. */
export function MediaBadge({
  children,
  tone = 'brand',
}: {
  children: React.ReactNode
  tone?: 'brand' | 'neutral'
}) {
  return (
    <span
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-md ring-1',
        tone === 'brand'
          ? 'bg-brand-500/25 text-brand-100 ring-brand-400/35'
          : 'bg-slate-950/60 text-slate-200 ring-white/15',
      )}
    >
      {children}
    </span>
  )
}

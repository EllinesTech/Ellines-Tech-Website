import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

type LogoVariant = 'mark' | 'full' | 'nav' | 'square'

interface LogoProps {
  variant?: LogoVariant
  className?: string
  link?: boolean
  onClick?: () => void
}

/**
 * Header uses a dedicated retina mark + CSS wordmark (never a tiny muddy PNG wordmark).
 * Full/hero variants use processed transparent assets from with-background sources.
 */
export function Logo({ variant = 'nav', className, link = true, onClick }: LogoProps) {
  const content =
    variant === 'full' ? (
      <img
        src={siteConfig.logos.full}
        alt="Ellines Tech"
        className={cn(
          'h-12 w-auto max-w-[min(100%,300px)] object-contain object-left sm:h-14',
          className,
        )}
        decoding="async"
      />
    ) : variant === 'square' ? (
      <img
        src={siteConfig.logos.square}
        alt="Ellines Tech"
        className={cn('h-16 w-auto object-contain', className)}
        decoding="async"
      />
    ) : variant === 'mark' ? (
      <img
        src={siteConfig.logos.markNav}
        alt="Ellines Tech"
        width={48}
        height={48}
        className={cn('h-12 w-12 object-contain', className)}
        decoding="async"
      />
    ) : (
      <span className={cn('flex min-w-0 items-center gap-3', className)}>
        <img
          src={siteConfig.logos.markNav}
          alt=""
          width={48}
          height={48}
          className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
          decoding="async"
          fetchPriority="high"
          style={{ imageRendering: 'auto' }}
        />
        <span className="hidden min-[400px]:block leading-none">
          <span className="font-display text-[1.125rem] font-bold tracking-[-0.03em] text-white sm:text-[1.25rem]">
            Ellines{' '}
            <span className="text-brand-300">Tech</span>
          </span>
        </span>
      </span>
    )

  if (!link) return content

  return (
    <Link
      to="/"
      className="relative z-20 inline-flex shrink-0 items-center"
      onClick={onClick}
      aria-label="Ellines Tech home"
    >
      {content}
    </Link>
  )
}

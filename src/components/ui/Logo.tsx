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
 * Brand lockup using original Ellines Tech artwork (3D E + wing mark).
 * Nav uses the crisp mark PNG + CSS wordmark — never invent a replacement mark.
 */
export function Logo({ variant = 'nav', className, link = true, onClick }: LogoProps) {
  const content =
    variant === 'full' ? (
      <img
        src={siteConfig.logos.full}
        alt="Ellines Tech"
        className={cn(
          'h-10 w-auto max-w-[min(100%,240px)] object-contain object-left sm:h-11',
          className,
        )}
        decoding="async"
      />
    ) : variant === 'square' ? (
      <img
        src={siteConfig.logos.square}
        alt="Ellines Tech"
        className={cn('h-14 w-auto object-contain', className)}
        decoding="async"
      />
    ) : variant === 'mark' ? (
      <img
        src={siteConfig.logos.markNav}
        alt="Ellines Tech"
        width={40}
        height={40}
        className={cn('h-10 w-10 object-contain', className)}
        decoding="async"
      />
    ) : (
      <span className={cn('group flex min-w-0 items-center gap-3', className)}>
        <img
          src={siteConfig.logos.markNav}
          alt=""
          width={40}
          height={40}
          className="h-9 w-9 shrink-0 object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:h-10 sm:w-10"
          decoding="async"
          fetchPriority="high"
        />
        <span className="hidden min-[380px]:block leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-[-0.045em] text-white sm:text-[1.125rem]">
            Ellines{' '}
            <span className="bg-gradient-to-r from-brand-300 to-sky-400 bg-clip-text text-transparent">
              Tech
            </span>
          </span>
        </span>
      </span>
    )

  if (!link) return content

  return (
    <Link
      to="/"
      className="relative z-20 inline-flex shrink-0 items-center rounded-lg outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      onClick={onClick}
      aria-label="Ellines Tech home"
    >
      {content}
    </Link>
  )
}

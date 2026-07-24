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
 * Header: crisp small mark + CSS wordmark once.
 * Never scale muddy full-logo PNGs for branding at large sizes.
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
        width={36}
        height={36}
        className={cn('h-9 w-9 object-contain', className)}
        decoding="async"
      />
    ) : (
      <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
        <img
          src={siteConfig.logos.markNav}
          alt=""
          width={36}
          height={36}
          className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
          decoding="async"
          fetchPriority="high"
        />
        <span className="hidden min-[380px]:block leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-[-0.04em] text-white sm:text-[1.125rem]">
            Ellines <span className="text-brand-300">Tech</span>
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

import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

type LogoVariant = 'mark' | 'full' | 'nav'

interface LogoProps {
  variant?: LogoVariant
  className?: string
  link?: boolean
  onClick?: () => void
}

export function Logo({ variant = 'nav', className, link = true, onClick }: LogoProps) {
  const content =
    variant === 'full' ? (
      <img
        src={siteConfig.logos.full}
        alt="Ellines Tech"
        className={cn('h-12 w-auto object-contain sm:h-14', className)}
      />
    ) : variant === 'mark' ? (
      <img
        src={siteConfig.logos.mark}
        alt="Ellines Tech"
        className={cn('h-9 w-auto object-contain', className)}
      />
    ) : (
      <span className={cn('flex items-center gap-2.5', className)}>
        <img
          src={siteConfig.logos.mark}
          alt=""
          className="h-9 w-auto object-contain"
        />
        <span className="font-display text-lg font-bold tracking-tight text-white">
          Ellines<span className="text-brand-400">Tech</span>
        </span>
      </span>
    )

  if (!link) return content

  return (
    <Link to="/" className="inline-flex items-center" onClick={onClick} aria-label="Ellines Tech home">
      {content}
    </Link>
  )
}

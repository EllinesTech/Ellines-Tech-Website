import { Facebook, Github, Instagram, Linkedin } from 'lucide-react'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const iconMap: Record<string, React.ElementType> = {
  facebook: Facebook,
  twitter: XIcon,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
}

interface SocialLinksProps {
  className?: string
  showLabels?: boolean
  size?: 'sm' | 'md'
}

export function SocialLinks({ className, showLabels, size = 'md' }: SocialLinksProps) {
  const box = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10'
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-4.5 w-4.5 h-[1.1rem] w-[1.1rem]'

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {siteConfig.socialLinks.map((item) => {
        const Icon = iconMap[item.id] ?? Github
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={`${item.label} ${item.handle}`}
            className={cn(
              'inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-brand-200',
              box,
              showLabels && 'w-auto gap-2 px-3',
            )}
          >
            <Icon className={icon} />
            {showLabels && <span className="text-xs font-medium">{item.handle}</span>}
          </a>
        )
      })}
    </div>
  )
}

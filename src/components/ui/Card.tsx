import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  description: string
  href?: string
  tag?: string
  icon?: React.ReactNode
  image?: string
  className?: string
  children?: React.ReactNode
}

export function Card({
  title,
  description,
  href,
  tag,
  icon,
  image,
  className,
  children,
}: CardProps) {
  const content = (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated/50 transition-all duration-300 hover:border-brand-500/30 hover:bg-surface-elevated/80',
        href && 'cursor-pointer',
        className,
      )}
    >
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/5">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {tag && (
          <span className="mb-3 inline-flex w-fit rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            {tag}
          </span>
        )}
        {icon && <div className="mb-4 text-brand-400">{icon}</div>}
        <h3 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-brand-300">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{description}</p>
        {children}
        {href && (
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
            Learn more <ArrowUpRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </article>
  )

  if (href) {
    return (
      <Link to={href} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}

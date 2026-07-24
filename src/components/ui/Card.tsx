import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  description: string
  href?: string
  tag?: string
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function Card({ title, description, href, tag, icon, className, children }: CardProps) {
  const content = (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl border border-white/10 bg-surface-elevated/50 p-6 transition-all duration-300 hover:border-brand-500/30 hover:bg-surface-elevated/80',
        href && 'cursor-pointer',
        className,
      )}
    >
      {tag && (
        <span className="mb-3 inline-flex w-fit rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
          {tag}
        </span>
      )}
      {icon && <div className="mb-4 text-brand-400">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-white group-hover:text-brand-300 transition-colors">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{description}</p>
      {children}
      {href && (
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
          Learn more <ArrowUpRight className="h-4 w-4" />
        </div>
      )}
    </article>
  )

  if (href) {
    return <Link to={href}>{content}</Link>
  }

  return content
}

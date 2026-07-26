import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export type Crumb = {
  label: string
  href?: string
}

export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden /> : null}
              {last || !item.href ? (
                <span
                  className={last ? 'font-medium text-slate-300' : undefined}
                  aria-current={last ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="transition-colors hover:text-brand-300">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

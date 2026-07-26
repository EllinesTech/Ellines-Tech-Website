import { Globe, MapPin, Monitor, Network, Shield, Wifi } from 'lucide-react'
import type { VisitorContext as Visitor } from '@/lib/cmsApi'
import { cn } from '@/lib/utils'

/**
 * Shared renderers for edge-derived visitor intelligence (IP, region, browser).
 * The API blanks `ip` / `userAgent` for roles without PII access and always
 * supplies `ipMasked`, so these components render whatever they are given
 * rather than deciding permissions themselves.
 */

export function visitorLocation(visitor?: Visitor, fallback?: string) {
  if (fallback) return fallback
  if (!visitor) return ''
  return [visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ')
}

export function visitorIpLabel(visitor?: Visitor) {
  if (!visitor) return '—'
  return visitor.ip || visitor.ipMasked || '—'
}

function Chip({
  icon: Icon,
  children,
  tone = 'default',
}: {
  icon: React.ElementType
  children: React.ReactNode
  tone?: 'default' | 'warn'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]',
        tone === 'warn'
          ? 'border-amber-400/25 bg-amber-500/10 text-amber-200'
          : 'border-white/10 bg-white/[0.03] text-slate-400',
      )}
    >
      <Icon className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
      {children}
    </span>
  )
}

/** Compact single-line summary for list rows. */
export function VisitorChips({
  visitor,
  location,
  showIp = true,
}: {
  visitor?: Visitor
  location?: string
  showIp?: boolean
}) {
  if (!visitor) return null
  const place = visitorLocation(visitor, location)
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {showIp && <Chip icon={Network}>{visitorIpLabel(visitor)}</Chip>}
      {place && <Chip icon={MapPin}>{place}</Chip>}
      {visitor.browser && (
        <Chip icon={Globe}>
          {visitor.browser}
          {visitor.os ? ` · ${visitor.os}` : ''}
        </Chip>
      )}
      {visitor.device && <Chip icon={Monitor}>{visitor.device}</Chip>}
      {visitor.bot && (
        <Chip icon={Shield} tone="warn">
          Bot signature
        </Chip>
      )}
    </div>
  )
}

/** Full detail block for the live-chat agent sidebar. */
export function VisitorDetails({ visitor, location }: { visitor?: Visitor; location?: string }) {
  if (!visitor) {
    return <p className="text-xs text-slate-500">No visitor context captured for this session.</p>
  }
  const rows: [string, string][] = [
    ['IP address', visitorIpLabel(visitor)],
    ['Location', visitorLocation(visitor, location) || '—'],
    ['Timezone', visitor.timezone || '—'],
    ['Browser', visitor.browser || '—'],
    ['Operating system', visitor.os || '—'],
    ['Device', visitor.device || '—'],
    ['Network', visitor.network || '—'],
    ['Edge location', visitor.colo || '—'],
    ['Language', visitor.language || '—'],
    ['Referrer', visitor.referrer || 'Direct'],
  ]
  return (
    <dl className="space-y-1.5 text-xs">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-slate-500">{label}</dt>
          <dd className="min-w-0 break-words text-right text-slate-300">{value}</dd>
        </div>
      ))}
      {visitor.bot && (
        <p className="mt-2 flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200">
          <Wifi className="h-3 w-3" aria-hidden /> Automated client signature detected.
        </p>
      )}
    </dl>
  )
}

/** Shown when the signed-in role only gets a masked IP. */
export function MaskedIpNotice({ canSeeIp }: { canSeeIp: boolean }) {
  if (canSeeIp) return null
  return (
    <p className="text-[11px] text-slate-500">
      IP addresses are partly masked for your role. Full addresses are visible to Super Admin and
      Admin accounts.
    </p>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAnalytics, fetchVisitors, type VisitorRecord } from '@/lib/cmsApi'
import { MaskedIpNotice, VisitorChips } from '@/components/admin/VisitorContext'

type Breakdown = Record<string, number>

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-5">
      <div className="max-w-3xl">
        <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5">
        {children}
      </div>
    </div>
  )
}

function BreakdownList({ title, data }: { title: string; data: Breakdown }) {
  const rows = Object.entries(data || {}).sort((a, b) => b[1] - a[1]).slice(0, 8)
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{title}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {rows.map(([label, count]) => (
          <li key={label} className="flex justify-between gap-3">
            <span className="truncate text-slate-300">{label}</span>
            <span className="text-slate-500">{count}</span>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-slate-500">No data yet.</li>}
      </ul>
    </div>
  )
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  if (!Number.isFinite(diff)) return ''
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

/**
 * Visitor intelligence for Super Admin / Admin (and staff with masked IPs):
 * who is on the site, where they connect from, what they use, and their path
 * through the site. Nothing here is ever exposed to public visitors.
 */
export function AdminVisitorsModule() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([])
  const [canSeeIp, setCanSeeIp] = useState(false)
  const [totals, setTotals] = useState<{
    total: number
    today: number
    onlineNow: number
    countries: Breakdown
    browsers: Breakdown
    devices: Breakdown
    pages: Breakdown
  }>({ total: 0, today: 0, onlineNow: 0, countries: {}, browsers: {}, devices: {}, pages: {} })
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [list, analytics] = await Promise.all([fetchVisitors(), fetchAnalytics()])
        if (cancelled) return
        setVisitors(list.visitors)
        setCanSeeIp(list.canSeeIp)
        setTotals({
          total: analytics?.visitors?.total ?? 0,
          today: analytics?.visitors?.today ?? 0,
          onlineNow: analytics?.onlineNow ?? 0,
          countries: analytics?.countries || {},
          browsers: analytics?.browsers || {},
          devices: analytics?.devices || {},
          pages: analytics?.visitors?.pages || {},
        })
        setError('')
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load visitors')
      }
    }
    load()
    const t = setInterval(load, 20000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  const needle = filter.trim().toLowerCase()
  const visible = needle
    ? visitors.filter((v) =>
        [
          v.visitor?.ip,
          v.visitor?.ipMasked,
          v.visitor?.country,
          v.visitor?.city,
          v.visitor?.region,
          v.visitor?.browser,
          v.visitor?.os,
          v.visitor?.device,
          v.location,
          v.path,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(needle),
      )
    : visitors

  return (
    <div className="space-y-6">
      <Panel
        title="Visitor intelligence"
        description="IP, region, browser, device, and journey for recent sessions. Admin-only — never shown on the public site."
      >
        {error && (
          <p className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-xs text-slate-500">Total visits</p>
            <p className="mt-1 text-2xl font-bold text-white">{totals.total}</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-xs text-slate-500">Today</p>
            <p className="mt-1 text-2xl font-bold text-white">{totals.today}</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-xs text-slate-500">Online now</p>
            <p className="mt-1 text-2xl font-bold text-white">{totals.onlineNow}</p>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <BreakdownList title="Countries" data={totals.countries} />
          <BreakdownList title="Browsers" data={totals.browsers} />
          <BreakdownList title="Devices" data={totals.devices} />
        </div>
      </Panel>

      <Panel
        title="Recent sessions"
        description="One row per visitor session, newest first, refreshed every 20 seconds."
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by IP, city, country, browser, path…"
            className="h-9 w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-brand-400/40"
          />
          <MaskedIpNotice canSeeIp={canSeeIp} />
        </div>
        <ul className="space-y-2">
          {visible.length === 0 && (
            <li className="text-sm text-slate-500">
              No visitor sessions recorded yet. Sessions appear once a visitor accepts analytics
              consent.
            </li>
          )}
          {visible.map((v) => (
            <li key={v.sessionId} className="rounded-xl border border-white/10 px-3 py-2.5 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-medium text-white">
                  {v.online && (
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
                      aria-label="Online now"
                    />
                  )}
                  {v.path}
                </span>
                <span className="text-xs text-slate-500">
                  {v.hits} view{v.hits === 1 ? '' : 's'} · {relativeTime(v.lastSeen)}
                </span>
              </div>
              <div className="mt-1.5">
                <VisitorChips visitor={v.visitor} location={v.location} />
              </div>
              {v.paths?.length > 1 && (
                <p className="mt-1.5 truncate text-[11px] text-slate-600">
                  Journey: {v.paths.slice(0, 6).join(' → ')}
                </p>
              )}
              {v.visitor?.referrer && (
                <p className="mt-1 truncate text-[11px] text-slate-600">
                  Referrer: {v.visitor.referrer}
                </p>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/admin/online" className="text-brand-300">
            Online users →
          </Link>
          <Link to="/admin/analytics" className="text-brand-300">
            Analytics →
          </Link>
          <Link to="/admin/live-chat" className="text-brand-300">
            Live chat →
          </Link>
        </div>
      </Panel>
    </div>
  )
}

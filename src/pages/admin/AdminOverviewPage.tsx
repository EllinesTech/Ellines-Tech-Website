import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Package,
  Layers,
  Users,
  Globe,
  RefreshCw,
  Inbox,
  ShoppingBag,
  Radio,
} from 'lucide-react'
import { siteConfig } from '@/data/site'
import { listLiveSessions } from '@/lib/liveChatApi'
import {
  fetchActivity,
  fetchAnalytics,
  fetchLeads,
  fetchPresence,
  fetchSiteProfile,
} from '@/lib/cmsApi'
import { Button } from '@/components/ui/Button'

type Analytics = {
  visitors?: { total: number; today: number; pages?: Record<string, number> }
  liveChats?: number
  waitingChats?: number
  onlineNow?: number
  leadsTotal?: number
  shopPublished?: number
  servicesPublished?: number
  productsPublished?: number
}

export function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [waiting, setWaiting] = useState(0)
  const [live, setLive] = useState(0)
  const [online, setOnline] = useState(0)
  const [leadsToday, setLeadsToday] = useState(0)
  const [activity, setActivity] = useState<{ id: string; at: string; message?: string; type?: string }[]>(
    [],
  )
  const [socialCount, setSocialCount] = useState<number>(siteConfig.socialLinks.length)
  const [updated, setUpdated] = useState(new Date())
  const [intervalSec, setIntervalSec] = useState(15)
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const [a, sessions, presence, leads, acts, profile] = await Promise.all([
        fetchAnalytics().catch(() => null),
        listLiveSessions().catch(() => []),
        fetchPresence().catch(() => ({ online: [], count: 0 })),
        fetchLeads().catch(() => []),
        fetchActivity().catch(() => []),
        fetchSiteProfile().catch(() => null),
      ])
      if (a) setAnalytics(a as Analytics)
      setWaiting(
        sessions.filter((s) => s.status === 'waiting').length ||
          (a as Analytics | null)?.waitingChats ||
          0,
      )
      setLive(
        sessions.filter((s) => s.status === 'live').length || (a as Analytics | null)?.liveChats || 0,
      )
      setOnline(presence.count || (a as Analytics | null)?.onlineNow || 0)
      const day = new Date().toISOString().slice(0, 10)
      setLeadsToday(
        (leads as { at?: string }[]).filter((l) => String(l.at || '').startsWith(day)).length,
      )
      setActivity(acts.slice(0, 8))
      if (profile?.socialLinks?.length) setSocialCount(profile.socialLinks.length)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not refresh dashboard')
    }
    setUpdated(new Date())
  }

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, intervalSec * 1000)
    return () => clearInterval(t)
  }, [intervalSec])

  const cards = [
    {
      label: 'Visits today',
      value: analytics?.visitors?.today ?? '—',
      icon: Globe,
      to: '/admin/visitors',
    },
    {
      label: 'Online now',
      value: online,
      icon: Radio,
      to: '/admin/online',
    },
    {
      label: 'Waiting chats',
      value: waiting,
      icon: Inbox,
      to: '/admin/live-chat',
    },
    {
      label: 'Live chats',
      value: live,
      icon: MessageCircle,
      to: '/admin/live-chat',
    },
    {
      label: 'Leads today',
      value: leadsToday,
      icon: Users,
      to: '/admin/leads',
    },
    {
      label: 'Published services',
      value: analytics?.servicesPublished ?? '—',
      icon: Layers,
      to: '/admin/services',
    },
    {
      label: 'Published products',
      value: analytics?.productsPublished ?? '—',
      icon: Package,
      to: '/admin/products',
    },
    {
      label: 'Pricing packages',
      value: analytics?.shopPublished ?? '—',
      icon: ShoppingBag,
      to: '/admin/shop',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Welcome back, Admin ·{' '}
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Live control center for {siteConfig.url.replace('https://', '')} · {socialCount} social
            channels
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[15, 30, 60].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setIntervalSec(n)}
              className={`rounded-lg border px-2.5 py-1 text-xs ${
                intervalSec === n
                  ? 'border-brand-400/40 bg-brand-500/15 text-brand-200'
                  : 'border-white/10 text-slate-400'
              }`}
            >
              {n}s
            </button>
          ))}
          <Button type="button" variant="secondary" onClick={() => void refresh()}>
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </span>
          </Button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Live · Updated {updated.toLocaleTimeString()}
        {analytics?.visitors?.total != null ? ` · ${analytics.visitors.total} total visits` : ''}
      </p>
      {error && <p className="text-sm text-amber-200">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand-400/30"
          >
            <card.icon className="h-5 w-5 text-brand-400" />
            <p className="mt-4 font-display text-3xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-display text-lg font-semibold text-white">Priority actions</h3>
          <div className="mt-4 space-y-2">
            <Link
              to="/admin/live-chat"
              className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm hover:border-brand-400/30"
            >
              <span>Open Live Chat inbox</span>
              <span className="text-brand-300">{waiting} waiting</span>
            </Link>
            <Link
              to="/admin/leads"
              className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm hover:border-brand-400/30"
            >
              <span>Review leads</span>
              <span className="text-slate-500">{analytics?.leadsTotal ?? 0} total</span>
            </Link>
            <Link
              to="/admin/pages"
              className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm hover:border-brand-400/30"
            >
              <span>Edit website pages</span>
              <span className="text-slate-500">Page Editor</span>
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-white">Live activity</h3>
            <Link to="/admin/activity" className="text-xs text-brand-300">
              Full feed →
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {activity.length === 0 && (
              <li className="text-sm text-slate-500">No activity yet — saves and leads appear here.</li>
            )}
            {activity.map((a) => (
              <li key={a.id} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
                <p className="text-slate-200">{a.message}</p>
                <p className="text-[11px] text-slate-500">
                  {a.type} · {new Date(a.at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

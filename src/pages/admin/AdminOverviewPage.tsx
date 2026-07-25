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
} from 'lucide-react'
import { siteConfig } from '@/data/site'
import { products } from '@/data/products'
import { services } from '@/data/services'
import { clientBrands } from '@/data/clients'
import { listLiveSessions } from '@/lib/liveChatApi'
import { Button } from '@/components/ui/Button'

export function AdminOverviewPage() {
  const [waiting, setWaiting] = useState(0)
  const [live, setLive] = useState(0)
  const [updated, setUpdated] = useState(new Date())
  const [intervalSec, setIntervalSec] = useState(15)

  async function refresh() {
    try {
      const sessions = await listLiveSessions()
      setWaiting(sessions.filter((s) => s.status === 'waiting').length)
      setLive(sessions.filter((s) => s.status === 'live').length)
    } catch {
      /* API may be local-only before functions deploy */
    }
    setUpdated(new Date())
  }

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, intervalSec * 1000)
    return () => clearInterval(t)
  }, [intervalSec])

  const cards = [
    { label: 'Products', value: products.length, icon: Package },
    { label: 'Services', value: services.length, icon: Layers },
    { label: 'Client brands', value: clientBrands.length, icon: Users },
    { label: 'Waiting chats', value: waiting, icon: Inbox },
    { label: 'Live chats', value: live, icon: MessageCircle },
    { label: 'Social channels', value: siteConfig.socialLinks.length, icon: Globe },
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
            Super Admin control center for {siteConfig.url.replace('https://', '')}
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
          <Button type="button" variant="secondary" onClick={refresh}>
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </span>
          </Button>
        </div>
      </div>

      <p className="text-xs text-slate-500">Updated: {updated.toLocaleTimeString()}</p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <card.icon className="h-5 w-5 text-brand-400" />
            <p className="mt-4 font-display text-3xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </div>
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
              to="/admin/chat-settings"
              className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm hover:border-brand-400/30"
            >
              <span>Train AI / FAQ knowledge</span>
              <span className="text-slate-500">Chat Settings</span>
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
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <h3 className="font-display text-lg font-semibold text-white">Always open</h3>
          <p className="mt-2 text-sm text-slate-300">
            Visitor floating chat supports AI answers, WhatsApp, and live human agents from this
            panel. Claim a waiting chat to talk to customers in real time.
          </p>
        </div>
      </div>
    </div>
  )
}

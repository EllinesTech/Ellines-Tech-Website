import { useMemo, useState } from 'react'
import { MessageSquareText, Users, ShieldCheck, Download } from 'lucide-react'
import {
  clearTranscripts,
  loadFaqs,
  loadSettings,
  loadTranscripts,
} from '@/lib/engagementStore'
import { siteConfig } from '@/data/site'
import { Button } from '@/components/ui/Button'

export function AdminOverviewPage() {
  const faqs = useMemo(() => loadFaqs(), [])
  const transcripts = useMemo(() => loadTranscripts(), [])
  const settings = useMemo(() => loadSettings(), [])
  const [, tick] = useState(0)

  function exportAll() {
    const payload = {
      exportedAt: new Date().toISOString(),
      faqs: loadFaqs(),
      settings: loadSettings(),
      transcripts: loadTranscripts(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ellines-tech-godmode-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Control center</h1>
        <p className="mt-2 text-slate-400">
          Super-admin overview for engagement, knowledge, and site switches on {siteConfig.url}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Chat FAQs', value: faqs.length, icon: MessageSquareText },
          { label: 'Saved chats', value: transcripts.length, icon: Users },
          {
            label: 'Chat status',
            value: settings.chatEnabled ? 'Online' : 'Off',
            icon: ShieldCheck,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-5"
          >
            <card.icon className="h-5 w-5 text-brand-400" />
            <p className="mt-4 font-display text-2xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-6">
        <h2 className="font-display text-lg font-semibold text-white">God Mode actions</h2>
        <p className="mt-2 text-sm text-slate-400">
          Export all engagement data, or clear local chat transcripts stored in this browser.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={exportAll} icon>
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Export JSON
            </span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              clearTranscripts()
              tick((n) => n + 1)
            }}
          >
            Clear transcripts
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-amber-100/90">
        Full CMS “edit every page live” needs a connected backend (Cloudflare KV/D1). This God Mode
        already controls chat knowledge, transcripts, announcements, and engagement switches in this
        browser — perfect for operating the customer engagement system now.
      </div>
    </div>
  )
}

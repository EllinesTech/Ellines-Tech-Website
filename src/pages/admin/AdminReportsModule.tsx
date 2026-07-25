import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchReports } from '@/lib/cmsApi'

type Report = {
  leadsTotal: number
  leadsByIntent: Record<string, number>
  invoicesTotal: number
  invoicesPaid: number
  invoicesUnpaid: number
  revenueKes: number
  outstandingKes: number
  visitors?: { total?: number; today?: number }
  recentPaid?: { number: string; clientName: string; total: number; receiptNumber?: string }[]
  recentLeads?: { name: string; email: string; intent?: string; at: string }[]
}

export function AdminReportsModule() {
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReports()
      .then(setReport)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load report'))
  }, [])

  if (error) {
    return <p className="text-sm text-amber-200">{error}</p>
  }
  if (!report) {
    return <p className="text-sm text-slate-400">Loading report…</p>
  }

  const cards = [
    { label: 'Leads', value: report.leadsTotal },
    { label: 'Invoices paid', value: report.invoicesPaid },
    { label: 'Outstanding invoices', value: report.invoicesUnpaid },
    { label: 'Revenue (KES)', value: report.revenueKes.toLocaleString() },
    { label: 'Outstanding (KES)', value: report.outstandingKes.toLocaleString() },
    { label: 'Visits (total)', value: report.visitors?.total ?? '—' },
    { label: 'Visits (today)', value: report.visitors?.today ?? '—' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Business reports</h2>
          <p className="mt-1 text-sm text-slate-400">
            Leads, invoices, receipts, and traffic in one view.
          </p>
        </div>
        <Link to="/admin/invoices" className="text-sm text-brand-300">
          Manage invoices →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">{c.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">Leads by intent</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(report.leadsByIntent || {}).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-white/5 py-1.5">
                <span className="capitalize text-slate-300">{k}</span>
                <span className="text-white">{v}</span>
              </li>
            ))}
            {!Object.keys(report.leadsByIntent || {}).length && (
              <li className="text-slate-500">No lead data yet.</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">Recent receipts</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(report.recentPaid || []).map((inv) => (
              <li key={inv.number} className="border-b border-white/5 py-1.5">
                <p className="text-white">
                  {inv.receiptNumber || inv.number} · {inv.clientName}
                </p>
                <p className="text-xs text-slate-500">KES {Number(inv.total).toLocaleString()}</p>
              </li>
            ))}
            {!report.recentPaid?.length && (
              <li className="text-slate-500">No paid invoices yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

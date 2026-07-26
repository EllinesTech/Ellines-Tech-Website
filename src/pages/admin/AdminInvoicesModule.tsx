import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  deleteInvoice,
  fetchInvoices,
  markInvoicePaid,
  saveInvoice,
  type Invoice,
  type InvoiceItem,
} from '@/lib/cmsApi'

const emptyItem = (): InvoiceItem => ({ description: '', qty: 1, unitPrice: 0 })

export function AdminInvoicesModule() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [draft, setDraft] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    currency: 'KES',
    tax: 0,
    notes: '',
    dueDate: '',
    status: 'draft',
    items: [emptyItem()],
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [paymentRef, setPaymentRef] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Paystack')

  async function load() {
    try {
      setInvoices(await fetchInvoices())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load invoices')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const items = draft.items || [emptyItem()]
  const subtotal = items.reduce((s, r) => s + Number(r.qty || 0) * Number(r.unitPrice || 0), 0)
  const total = subtotal + Number(draft.tax || 0)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Invoices & Receipts</h2>
        <p className="mt-1 text-sm text-slate-400">
          Create invoices for clients. Clients can pay via Paystack on the public invoice link
          (full balance or 50% deposit). You can also mark paid manually after offline payment.
        </p>
      </div>
      {error && <p className="text-sm text-amber-200">{error}</p>}
      {message && <p className="text-sm text-emerald-300">{message}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">
            {draft.id ? `Edit ${draft.number || 'invoice'}` : 'New invoice'}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ['clientName', 'Client name'],
                ['clientEmail', 'Client email'],
                ['clientPhone', 'Phone'],
                ['clientCompany', 'Company'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-xs text-slate-400">
                {label}
                <input
                  value={(draft[key] as string) || ''}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
                />
              </label>
            ))}
          </div>
          <label className="block text-xs text-slate-400">
            Due date
            <input
              type="date"
              value={draft.dueDate || ''}
              onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
            />
          </label>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Line items</p>
            {items.map((row, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_4rem_6rem_auto] gap-2">
                <input
                  placeholder="Description"
                  value={row.description}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...row, description: e.target.value }
                    setDraft((d) => ({ ...d, items: next }))
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                />
                <input
                  type="number"
                  value={row.qty}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...row, qty: Number(e.target.value) }
                    setDraft((d) => ({ ...d, items: next }))
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                />
                <input
                  type="number"
                  value={row.unitPrice}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...row, unitPrice: Number(e.target.value) }
                    setDraft((d) => ({ ...d, items: next }))
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                />
                <button
                  type="button"
                  className="text-xs text-rose-300"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      items: items.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDraft((d) => ({ ...d, items: [...items, emptyItem()] }))}
            >
              Add line
            </Button>
          </div>
          <label className="block text-xs text-slate-400">
            Tax (KES)
            <input
              type="number"
              value={draft.tax || 0}
              onChange={(e) => setDraft((d) => ({ ...d, tax: Number(e.target.value) }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
            />
          </label>
          <textarea
            placeholder="Notes (payment instructions, M-Pesa till, etc.)"
            value={draft.notes || ''}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            rows={2}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
          <p className="text-sm text-slate-300">
            Subtotal {subtotal.toLocaleString()} · Total{' '}
            <strong className="text-white">{total.toLocaleString()} KES</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={async () => {
                try {
                  const res = await saveInvoice({ ...draft, status: draft.status || 'draft' })
                  setMessage(`Saved ${res.invoice.number}`)
                  setDraft({
                    clientName: '',
                    clientEmail: '',
                    clientPhone: '',
                    clientCompany: '',
                    currency: 'KES',
                    tax: 0,
                    notes: '',
                    dueDate: '',
                    status: 'draft',
                    items: [emptyItem()],
                  })
                  await load()
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Save failed')
                }
              }}
            >
              Save invoice
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                try {
                  const res = await saveInvoice({ ...draft, status: 'sent' })
                  setMessage(`Invoice ${res.invoice.number} marked sent`)
                  await load()
                  setDraft(res.invoice)
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'Failed')
                }
              }}
            >
              Save & send
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">All invoices</h3>
          <ul className="mt-4 max-h-[36rem] space-y-3 overflow-auto">
            {invoices.length === 0 && (
              <li className="text-sm text-slate-500">No invoices yet.</li>
            )}
            {invoices.map((inv) => (
              <li key={inv.id} className="rounded-xl border border-white/10 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">
                      {inv.number} · {inv.clientName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {inv.currency} {Number(inv.total).toLocaleString()} · {inv.status}
                      {inv.receiptNumber ? ` · ${inv.receiptNumber}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button type="button" className="text-brand-300" onClick={() => setDraft(inv)}>
                      Edit
                    </button>
                    <Link
                      to={`/invoice/${inv.id}?token=${inv.publicToken}`}
                      className="text-slate-400 hover:text-white"
                    >
                      Open
                    </Link>
                    {inv.status !== 'paid' && (
                      <button
                        type="button"
                        className="text-emerald-300"
                        onClick={async () => {
                          try {
                            const res = await markInvoicePaid(inv.id, paymentMethod, paymentRef)
                            setMessage(`Receipt ${res.invoice.receiptNumber} issued`)
                            setPaymentRef('')
                            await load()
                          } catch (e) {
                            setError(e instanceof Error ? e.message : 'Failed')
                          }
                        }}
                      >
                        Mark paid
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-rose-300"
                      onClick={async () => {
                        await deleteInvoice(inv.id)
                        await load()
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <input
              placeholder="Payment method (Paystack / M-Pesa / Bank)"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-white"
            />
            <input
              placeholder="Payment ref (optional)"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

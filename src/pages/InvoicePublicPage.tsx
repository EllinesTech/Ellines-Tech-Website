import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { fetchInvoicePublic, type Invoice } from '@/lib/cmsApi'
import { startPaystackCheckout } from '@/lib/paystackApi'
import { siteConfig } from '@/data/site'
import { locations } from '@/data/locations'
import { cn } from '@/lib/utils'

function statusTone(status?: string) {
  const s = String(status || '').toLowerCase()
  if (s === 'paid') return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
  if (s === 'void' || s === 'cancelled') return 'border-rose-400/30 bg-rose-500/15 text-rose-200'
  if (s === 'sent') return 'border-sky-400/30 bg-sky-500/15 text-sky-200'
  return 'border-amber-400/30 bg-amber-500/15 text-amber-200'
}

export function InvoicePublicPage() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [error, setError] = useState('')
  const [payError, setPayError] = useState('')
  const [paying, setPaying] = useState<'full' | 'deposit' | null>(null)

  useEffect(() => {
    if (!id || !token) {
      setError('Invalid invoice link')
      return
    }
    fetchInvoicePublic(id, token)
      .then(setInvoice)
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'))
  }, [id, token])

  async function pay(kind: 'full' | 'deposit') {
    if (!invoice) return
    setPayError('')
    setPaying(kind)
    try {
      await startPaystackCheckout({
        type: kind === 'deposit' ? 'deposit' : 'invoice',
        email: invoice.clientEmail,
        name: invoice.clientName,
        invoiceId: invoice.id,
        publicToken: invoice.publicToken,
        currency: invoice.currency || 'KES',
        brand: 'tech',
      })
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Could not start payment')
      setPaying(null)
    }
  }

  if (error || !invoice) {
    return (
      <section className="section-padding">
        <div className="section-container max-w-lg">
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            {error ? 'Invoice unavailable' : 'Loading invoice…'}
          </h1>
          <p className="mt-4 text-slate-400">
            {error
              ? `${error}. Billing links expire and are unique to each document — ask us to resend yours.`
              : 'Fetching your billing document.'}
          </p>
          {error && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" icon>
                Request a new link
              </Button>
              <Button href="/account" variant="secondary">
                Client portal
              </Button>
            </div>
          )}
        </div>
      </section>
    )
  }

  const isPaid = invoice.status === 'paid'
  const docLabel = isPaid ? 'Receipt' : 'Invoice'
  const docNumber = isPaid ? invoice.receiptNumber : invoice.number
  const amountPaid = Number(invoice.amountPaid || 0)
  const remaining = Math.max(0, Number(invoice.total || 0) - amountPaid)
  const canPay =
    !isPaid && invoice.status !== 'cancelled' && remaining > 0 && Boolean(invoice.clientEmail)

  return (
    <>
      <SEO
        title={isPaid ? `Receipt ${invoice.receiptNumber}` : `Invoice ${invoice.number}`}
        description={`${siteConfig.name} billing document for ${invoice.clientName}`}
        path={`/invoice/${invoice.id}`}
        noindex
      />

      <section className="relative section-padding">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-40 print:hidden" />

        <div className="section-container relative max-w-3xl">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-elevated/50 print:rounded-none print:border-0 print:bg-white print:text-black">
            <header className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 p-6 sm:p-8 print:border-slate-200">
              <div>
                <Logo variant="nav" link={false} className="print:[&_span]:!text-slate-900" />
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white print:text-slate-900">
                    {docLabel} {docNumber}
                  </h1>
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] print:border-slate-300 print:bg-transparent print:text-slate-700',
                      statusTone(invoice.status),
                    )}
                  >
                    {invoice.status}
                  </span>
                </div>
                {invoice.paidAt && (
                  <p className="mt-2 text-sm text-slate-400 print:text-slate-600">
                    Paid {new Date(invoice.paidAt).toLocaleDateString()}
                  </p>
                )}
                {invoice.dueDate && !isPaid && (
                  <p className="mt-2 text-sm text-slate-400 print:text-slate-600">
                    Due {invoice.dueDate}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="print:hidden"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                Print / PDF
              </Button>
            </header>

            <div className="grid gap-8 border-b border-white/10 p-6 sm:grid-cols-2 sm:p-8 print:border-slate-200">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Bill to
                </p>
                <p className="mt-3 font-medium text-white print:text-slate-900">
                  {invoice.clientName}
                </p>
                <div className="mt-1 space-y-0.5 text-sm text-slate-400 print:text-slate-600">
                  <p>{invoice.clientEmail}</p>
                  {invoice.clientCompany && <p>{invoice.clientCompany}</p>}
                  {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  From
                </p>
                <p className="mt-3 font-medium text-white print:text-slate-900">
                  {siteConfig.name}
                </p>
                <div className="mt-1 space-y-0.5 text-sm text-slate-400 print:text-slate-600">
                  <p>{siteConfig.email}</p>
                  <p>{siteConfig.phone}</p>
                  {locations.map((location) => (
                    <p key={location.id}>{location.address}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.14em] text-slate-500 print:border-slate-200">
                    <th className="pb-3 font-semibold">Item</th>
                    <th className="pb-3 text-right font-semibold">Qty</th>
                    <th className="pb-3 text-right font-semibold">Price</th>
                    <th className="pb-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 last:border-0 print:border-slate-100"
                    >
                      <td className="py-3 pr-4 text-white print:text-slate-900">
                        {row.description}
                      </td>
                      <td className="py-3 text-right tabular-nums text-slate-400 print:text-slate-600">
                        {row.qty}
                      </td>
                      <td className="py-3 text-right tabular-nums text-slate-400 print:text-slate-600">
                        {Number(row.unitPrice).toLocaleString()}
                      </td>
                      <td className="py-3 text-right tabular-nums text-white print:text-slate-900">
                        {(Number(row.qty) * Number(row.unitPrice)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 flex justify-end">
                <dl className="w-full max-w-xs space-y-2 text-sm">
                  <div className="flex justify-between gap-6">
                    <dt className="text-slate-400 print:text-slate-600">Subtotal</dt>
                    <dd className="tabular-nums text-slate-300 print:text-slate-700">
                      {invoice.currency} {Number(invoice.subtotal).toLocaleString()}
                    </dd>
                  </div>
                  {Number(invoice.tax) > 0 && (
                    <div className="flex justify-between gap-6">
                      <dt className="text-slate-400 print:text-slate-600">Tax</dt>
                      <dd className="tabular-nums text-slate-300 print:text-slate-700">
                        {invoice.currency} {Number(invoice.tax).toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {amountPaid > 0 && !isPaid && (
                    <div className="flex justify-between gap-6">
                      <dt className="text-slate-400 print:text-slate-600">Paid so far</dt>
                      <dd className="tabular-nums text-emerald-300 print:text-emerald-700">
                        {invoice.currency} {amountPaid.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-6 border-t border-white/10 pt-3 print:border-slate-200">
                    <dt className="font-display font-semibold text-white print:text-slate-900">
                      {isPaid ? 'Total' : amountPaid > 0 ? 'Balance due' : 'Total'}
                    </dt>
                    <dd className="font-display text-lg font-bold tabular-nums text-white print:text-slate-900">
                      {invoice.currency}{' '}
                      {(isPaid ? Number(invoice.total) : remaining).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              {canPay && (
                <div className="mt-8 space-y-3 print:hidden">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => void pay('full')}
                      disabled={paying !== null}
                    >
                      {paying === 'full'
                        ? 'Opening checkout…'
                        : `Pay ${invoice.currency} ${remaining.toLocaleString()}`}
                    </Button>
                    {remaining >= 2 && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => void pay('deposit')}
                        disabled={paying !== null}
                      >
                        {paying === 'deposit'
                          ? 'Opening checkout…'
                          : `Pay 50% deposit (${invoice.currency} ${Math.round(remaining * 0.5).toLocaleString()})`}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Secure Paystack checkout opens on this page (card / mobile money where available).
                  </p>
                  {payError && (
                    <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      {payError}
                    </p>
                  )}
                </div>
              )}

              {isPaid && (
                <p className="mt-6 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 print:border-emerald-600 print:bg-transparent print:text-emerald-700">
                  Paid in full via {invoice.paymentMethod || 'confirmed payment'}
                  {invoice.paymentRef ? ` · Ref ${invoice.paymentRef}` : ''}
                </p>
              )}

              {invoice.notes && (
                <div className="mt-8 border-t border-white/10 pt-6 print:border-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Notes
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-400 print:text-slate-600">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>

            <footer className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-500 sm:px-8 print:border-slate-200 print:text-slate-500">
              <Link to="/" className="text-brand-300 print:text-slate-600">
                {siteConfig.url.replace('https://', '')}
              </Link>
              <span className="mx-2 text-slate-700" aria-hidden>
                /
              </span>
              {siteConfig.address}
            </footer>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 print:hidden">
            Questions about this {docLabel.toLowerCase()}?{' '}
            <Link to="/contact" className="text-brand-300 hover:text-brand-200">
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

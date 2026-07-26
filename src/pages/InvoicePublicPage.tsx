import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { fetchInvoicePublic, type Invoice } from '@/lib/cmsApi'
import { startPaystackCheckout } from '@/lib/paystackApi'
import { siteConfig } from '@/data/site'
import { locations, primaryLocation } from '@/data/locations'
import { cn } from '@/lib/utils'

function statusTone(status?: string) {
  const s = String(status || '').toLowerCase()
  if (s === 'paid') return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
  if (s === 'void' || s === 'cancelled') return 'border-rose-400/30 bg-rose-500/15 text-rose-200'
  if (s === 'sent') return 'border-sky-400/30 bg-sky-500/15 text-sky-200'
  return 'border-amber-400/30 bg-amber-500/15 text-amber-200'
}

function money(currency: string, amount: number) {
  return `${currency} ${Number(amount).toLocaleString()}`
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function statusLabel(status?: string) {
  const s = String(status || '').toLowerCase()
  if (s === 'paid') return 'Paid'
  if (s === 'sent') return 'Sent'
  if (s === 'cancelled') return 'Cancelled'
  if (s === 'draft') return 'Draft'
  return status || '—'
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
  const docNumber = isPaid ? invoice.receiptNumber || invoice.number : invoice.number
  const amountPaid = Number(invoice.amountPaid || 0)
  const remaining = Math.max(0, Number(invoice.total || 0) - amountPaid)
  const canPay =
    !isPaid && invoice.status !== 'cancelled' && remaining > 0 && Boolean(invoice.clientEmail)
  const issueDate = formatDate(invoice.createdAt)
  const dueDate = invoice.dueDate ? formatDate(invoice.dueDate) : null
  const paidDate = invoice.paidAt ? formatDate(invoice.paidAt) : null
  const totalLabel = isPaid ? 'Amount paid' : amountPaid > 0 ? 'Balance due' : 'Amount due'

  return (
    <>
      <SEO
        title={isPaid ? `Receipt ${docNumber}` : `Invoice ${invoice.number}`}
        description={`${siteConfig.name} billing document for ${invoice.clientName}`}
        path={`/invoice/${invoice.id}`}
        noindex
      />

      <section className="relative section-padding print:bg-white print:py-0">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-40 print:hidden" />

        <div className="section-container relative max-w-3xl print:max-w-none print:px-0">
          <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              {docLabel} · <span className="font-medium text-slate-200">{docNumber}</span>
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4" />
              Print / PDF
            </Button>
          </div>

          <article className="invoice-document overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface-elevated/55 print:overflow-visible print:rounded-none print:border-0 print:bg-white print:text-slate-900">
            {/* Company + document title */}
            <header className="invoice-block border-b border-white/10 px-6 py-7 sm:px-8 print:border-slate-200 print:px-0 print:pb-5 print:pt-0">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="min-w-0 max-w-md">
                  <div className="flex items-center gap-3">
                    <Logo variant="mark" link={false} className="h-10 w-10 sm:h-11 sm:w-11" />
                    <div className="leading-tight">
                      <p className="font-display text-lg font-semibold tracking-tight text-white print:text-slate-900 sm:text-xl">
                        {siteConfig.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 print:text-slate-500">
                        {siteConfig.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-0.5 text-sm leading-relaxed text-slate-400 print:text-slate-600">
                    <p>{siteConfig.ordersEmail}</p>
                    <p>{siteConfig.phone}</p>
                    <p>{primaryLocation.address}</p>
                    {locations
                      .filter((loc) => loc.id !== primaryLocation.id)
                      .map((loc) => (
                        <p key={loc.id}>
                          {loc.role}: {loc.address}
                        </p>
                      ))}
                  </div>
                </div>

                <div className="min-w-[12rem] text-left sm:text-right">
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300 print:text-slate-500">
                    {docLabel}
                  </p>
                  <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white print:text-slate-900 sm:text-[1.75rem]">
                    {docNumber}
                  </h1>
                  <span
                    className={cn(
                      'mt-3 inline-flex rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] print:border-slate-300 print:bg-transparent print:text-slate-700',
                      statusTone(invoice.status),
                    )}
                  >
                    {statusLabel(invoice.status)}
                  </span>
                </div>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-4 print:border-slate-200">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Issue date
                  </dt>
                  <dd className="mt-1 tabular-nums text-slate-200 print:text-slate-800">{issueDate}</dd>
                </div>
                {dueDate && !isPaid && (
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Due date
                    </dt>
                    <dd className="mt-1 tabular-nums text-slate-200 print:text-slate-800">{dueDate}</dd>
                  </div>
                )}
                {paidDate && (
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Payment date
                    </dt>
                    <dd className="mt-1 tabular-nums text-slate-200 print:text-slate-800">{paidDate}</dd>
                  </div>
                )}
                {!isPaid && invoice.number && (
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Invoice #
                    </dt>
                    <dd className="mt-1 font-medium text-slate-200 print:text-slate-800">
                      {invoice.number}
                    </dd>
                  </div>
                )}
                {isPaid && invoice.number && invoice.receiptNumber && (
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Invoice #
                    </dt>
                    <dd className="mt-1 font-medium text-slate-200 print:text-slate-800">
                      {invoice.number}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Currency
                  </dt>
                  <dd className="mt-1 text-slate-200 print:text-slate-800">{invoice.currency}</dd>
                </div>
              </dl>
            </header>

            {/* Parties */}
            <div className="invoice-block grid gap-8 border-b border-white/10 px-6 py-7 sm:grid-cols-2 sm:px-8 print:border-slate-200 print:px-0">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Bill to
                </p>
                <p className="mt-3 font-display text-base font-semibold text-white print:text-slate-900">
                  {invoice.clientName}
                </p>
                <div className="mt-1.5 space-y-0.5 text-sm leading-relaxed text-slate-400 print:text-slate-600">
                  {invoice.clientCompany && <p>{invoice.clientCompany}</p>}
                  <p>{invoice.clientEmail}</p>
                  {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  From
                </p>
                <p className="mt-3 font-display text-base font-semibold text-white print:text-slate-900">
                  {siteConfig.name}
                </p>
                <div className="mt-1.5 space-y-0.5 text-sm leading-relaxed text-slate-400 print:text-slate-600">
                  <p>{siteConfig.ordersEmail}</p>
                  <p>{siteConfig.phone}</p>
                  <p>{siteConfig.url.replace(/^https?:\/\//, '')}</p>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="px-6 py-7 sm:px-8 print:px-0 print:py-6">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/15 text-[11px] uppercase tracking-[0.14em] text-slate-500 print:border-slate-300">
                    <th className="pb-3 pr-4 font-semibold">Description</th>
                    <th className="w-16 pb-3 text-right font-semibold">Qty</th>
                    <th className="w-28 pb-3 text-right font-semibold">Unit price</th>
                    <th className="w-28 pb-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 last:border-b-0 print:border-slate-100"
                    >
                      <td className="py-3.5 pr-4 align-top text-slate-100 print:text-slate-900">
                        {row.description}
                      </td>
                      <td className="py-3.5 text-right align-top tabular-nums text-slate-400 print:text-slate-600">
                        {row.qty}
                      </td>
                      <td className="py-3.5 text-right align-top tabular-nums text-slate-400 print:text-slate-600">
                        {Number(row.unitPrice).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right align-top tabular-nums font-medium text-slate-100 print:text-slate-900">
                        {(Number(row.qty) * Number(row.unitPrice)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-block mt-8 flex justify-end">
                <dl className="w-full max-w-sm space-y-2.5 text-sm">
                  <div className="flex justify-between gap-8">
                    <dt className="text-slate-400 print:text-slate-600">Subtotal</dt>
                    <dd className="tabular-nums text-slate-200 print:text-slate-800">
                      {money(invoice.currency, invoice.subtotal)}
                    </dd>
                  </div>
                  {Number(invoice.tax) > 0 && (
                    <div className="flex justify-between gap-8">
                      <dt className="text-slate-400 print:text-slate-600">Tax</dt>
                      <dd className="tabular-nums text-slate-200 print:text-slate-800">
                        {money(invoice.currency, invoice.tax)}
                      </dd>
                    </div>
                  )}
                  {amountPaid > 0 && !isPaid && (
                    <>
                      <div className="flex justify-between gap-8">
                        <dt className="text-slate-400 print:text-slate-600">Invoice total</dt>
                        <dd className="tabular-nums text-slate-200 print:text-slate-800">
                          {money(invoice.currency, invoice.total)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-8">
                        <dt className="text-slate-400 print:text-slate-600">Paid so far</dt>
                        <dd className="tabular-nums text-emerald-300 print:text-emerald-800">
                          − {money(invoice.currency, amountPaid)}
                        </dd>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between gap-8 border-t border-white/15 pt-3 print:border-slate-300">
                    <dt className="font-display text-base font-semibold text-white print:text-slate-900">
                      {totalLabel}
                    </dt>
                    <dd className="font-display text-xl font-bold tabular-nums tracking-tight text-white print:text-slate-900">
                      {money(invoice.currency, isPaid ? Number(invoice.total) : remaining)}
                    </dd>
                  </div>
                </dl>
              </div>

              {canPay && (
                <div className="no-print mt-8 space-y-3 print:hidden">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={() => void pay('full')}
                      disabled={paying !== null}
                    >
                      {paying === 'full'
                        ? 'Opening checkout…'
                        : `Pay ${money(invoice.currency, remaining)}`}
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
                          : `Pay 50% deposit (${money(invoice.currency, Math.round(remaining * 0.5))})`}
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
                <div className="invoice-block mt-8 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3.5 print:rounded-none print:border print:border-slate-300 print:bg-transparent">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300 print:text-slate-500">
                    Payment confirmation
                  </p>
                  <p className="mt-1.5 text-sm text-emerald-100 print:text-slate-700">
                    Paid in full via {invoice.paymentMethod || 'confirmed payment'}
                    {invoice.paymentRef ? ` · Reference ${invoice.paymentRef}` : ''}
                    {paidDate ? ` · ${paidDate}` : ''}
                  </p>
                </div>
              )}

              {!isPaid && invoice.status !== 'cancelled' && (
                <div className="invoice-block mt-8 border-t border-white/10 pt-6 print:border-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Payment instructions
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400 print:text-slate-600">
                    Please settle the {amountPaid > 0 ? 'remaining balance' : 'amount due'} by the due
                    date using the secure payment options on this page, or contact{' '}
                    <span className="text-slate-300 print:text-slate-800">{siteConfig.ordersEmail}</span>{' '}
                    to arrange an alternative method. Quote invoice{' '}
                    <span className="font-medium text-slate-200 print:text-slate-900">
                      {invoice.number}
                    </span>{' '}
                    with your remittance.
                  </p>
                </div>
              )}

              {invoice.notes && (
                <div className="invoice-block mt-8 border-t border-white/10 pt-6 print:border-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Notes
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-400 print:text-slate-600">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>

            <footer className="invoice-block border-t border-white/10 px-6 py-5 sm:px-8 print:border-slate-200 print:px-0 print:pt-5">
              <p className="text-center text-sm text-slate-400 print:text-slate-600">
                Thank you for your business.
              </p>
              <p className="mt-2 text-center text-xs leading-relaxed text-slate-500 print:text-slate-500">
                {siteConfig.name}
                <span className="mx-1.5 text-slate-700 print:text-slate-300" aria-hidden>
                  ·
                </span>
                {siteConfig.url.replace(/^https?:\/\//, '')}
                <span className="mx-1.5 text-slate-700 print:text-slate-300" aria-hidden>
                  ·
                </span>
                {siteConfig.phone}
              </p>
              <p className="mt-1 text-center text-xs text-slate-600 print:text-slate-500">
                {siteConfig.address}
              </p>
            </footer>
          </article>

          <p className="no-print mt-6 text-center text-xs text-slate-500 print:hidden">
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

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { fetchInvoicePublic, type Invoice } from '@/lib/cmsApi'
import { siteConfig } from '@/data/site'

export function InvoicePublicPage() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || !token) {
      setError('Invalid invoice link')
      return
    }
    fetchInvoicePublic(id, token)
      .then(setInvoice)
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'))
  }, [id, token])

  if (error || !invoice) {
    return (
      <section className="section-padding">
        <div className="section-container max-w-lg text-center">
          <h1 className="font-display text-2xl font-bold text-white">Invoice</h1>
          <p className="mt-3 text-slate-400">{error || 'Loading…'}</p>
          <Button href="/contact" className="mt-6">
            Contact us
          </Button>
        </div>
      </section>
    )
  }

  const isPaid = invoice.status === 'paid'

  return (
    <>
      <SEO
        title={isPaid ? `Receipt ${invoice.receiptNumber}` : `Invoice ${invoice.number}`}
        description={`${siteConfig.name} billing document for ${invoice.clientName}`}
        path={`/invoice/${invoice.id}`}
        noindex
      />
      <section className="section-padding">
        <div className="section-container max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 print:border-0 print:bg-white print:text-black">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 print:text-slate-600">
                  {siteConfig.name}
                </p>
                <h1 className="mt-2 font-display text-2xl font-bold text-white print:text-slate-900">
                  {isPaid ? 'Receipt' : 'Invoice'} {isPaid ? invoice.receiptNumber : invoice.number}
                </h1>
                <p className="mt-1 text-sm text-slate-400 print:text-slate-600">
                  Status: {invoice.status}
                  {invoice.paidAt && ` · Paid ${new Date(invoice.paidAt).toLocaleDateString()}`}
                </p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}>
                Print / PDF
              </Button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Bill to</p>
                <p className="mt-1 font-medium text-white print:text-slate-900">{invoice.clientName}</p>
                <p className="text-slate-400 print:text-slate-600">{invoice.clientEmail}</p>
                {invoice.clientCompany && (
                  <p className="text-slate-400 print:text-slate-600">{invoice.clientCompany}</p>
                )}
                {invoice.clientPhone && (
                  <p className="text-slate-400 print:text-slate-600">{invoice.clientPhone}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">From</p>
                <p className="mt-1 text-white print:text-slate-900">{siteConfig.name}</p>
                <p className="text-slate-400 print:text-slate-600">{siteConfig.email}</p>
                <p className="text-slate-400 print:text-slate-600">{siteConfig.phone}</p>
                {invoice.dueDate && !isPaid && (
                  <p className="mt-2 text-slate-300 print:text-slate-700">
                    Due: {invoice.dueDate}
                  </p>
                )}
              </div>
            </div>

            <table className="mt-8 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-2 font-medium">Item</th>
                  <th className="py-2 font-medium">Qty</th>
                  <th className="py-2 font-medium">Price</th>
                  <th className="py-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-2 text-white print:text-slate-900">{row.description}</td>
                    <td className="py-2 text-slate-400">{row.qty}</td>
                    <td className="py-2 text-slate-400">
                      {Number(row.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-white print:text-slate-900">
                      {(Number(row.qty) * Number(row.unitPrice)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 space-y-1 text-sm text-right">
              <p className="text-slate-400">
                Subtotal: {invoice.currency} {Number(invoice.subtotal).toLocaleString()}
              </p>
              {Number(invoice.tax) > 0 && (
                <p className="text-slate-400">
                  Tax: {invoice.currency} {Number(invoice.tax).toLocaleString()}
                </p>
              )}
              <p className="text-lg font-semibold text-white print:text-slate-900">
                Total: {invoice.currency} {Number(invoice.total).toLocaleString()}
              </p>
              {isPaid && (
                <p className="text-emerald-300 print:text-emerald-700">
                  Paid via {invoice.paymentMethod || 'confirmed payment'}
                  {invoice.paymentRef ? ` · Ref ${invoice.paymentRef}` : ''}
                </p>
              )}
            </div>

            {invoice.notes && (
              <p className="mt-6 whitespace-pre-wrap text-sm text-slate-400 print:text-slate-600">
                {invoice.notes}
              </p>
            )}

            <p className="mt-8 text-center text-xs text-slate-500">
              <Link to="/" className="text-brand-300 print:hidden">
                {siteConfig.url.replace('https://', '')}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

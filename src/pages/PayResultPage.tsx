import { Link, useSearchParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'

export function PayResultPage() {
  const [params] = useSearchParams()
  const status = (params.get('status') || '').toLowerCase()
  const reference = params.get('reference') || ''
  const invoiceId = params.get('invoiceId') || ''
  const token = params.get('token') || ''
  const success = status === 'success'

  const invoiceHref =
    invoiceId && token ? `/invoice/${invoiceId}?token=${encodeURIComponent(token)}` : null

  return (
    <>
      <SEO
        title={success ? 'Payment successful' : 'Payment status'}
        description="Paystack payment result for Ellines Tech."
        path="/pay/result"
        noindex
      />
      <section className="section-padding">
        <div className="section-container max-w-lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ellines Tech · Payments
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
            {success ? 'Payment received' : status === 'failed' ? 'Payment not completed' : 'Payment update'}
          </h1>
          <p className="mt-4 text-slate-400">
            {success
              ? 'Thank you. Your Paystack payment was verified. A receipt will appear on your invoice when processing finishes.'
              : 'We could not confirm a successful charge. You can retry from your invoice, or contact us if you were debited.'}
          </p>
          {reference && (
            <p className="mt-4 font-mono text-xs text-slate-500">Ref {reference}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {invoiceHref && (
              <Button href={invoiceHref} icon>
                View invoice
              </Button>
            )}
            <Button href="/account" variant={invoiceHref ? 'secondary' : 'primary'}>
              Client portal
            </Button>
            {!success && (
              <Button href="/contact" variant="ghost">
                Contact support
              </Button>
            )}
          </div>
          <p className="mt-10 text-sm text-slate-500">
            Need another package?{' '}
            <Link to="/pricing" className="text-brand-300 hover:text-brand-200">
              Browse pricing
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Field, fieldClass, selectClass } from '@/components/ui/Field'
import { cn } from '@/lib/utils'
import {
  starterPricingPackages,
  groupPricingPackages,
  type PricingPackage,
} from '@/data/pricingPackages'
import { fetchShop, submitServiceRequest } from '@/lib/cmsApi'
import { useHoneypot } from '@/components/HoneypotField'
import { isInstantCheckoutPackage } from '@/lib/checkoutPackages'
import { startPaystackCheckout } from '@/lib/paystackApi'
import { loadAuthUser } from '@/lib/auth'
import { loadPublishedServices, type CatalogService } from '@/lib/servicesCatalog'
import { siteConfig } from '@/data/site'

function withGroupDefaults(list: PricingPackage[]): PricingPackage[] {
  return list
    .filter((p) => p.status === 'published')
    .map((p) => ({
      ...p,
      groupId: p.groupId || p.id,
      groupName: p.groupName || p.name,
      tierLabel: p.tierLabel || p.level || p.name,
    }))
}

const steps = ['Intent', 'Package', 'Details', 'Confirm'] as const

const budgets = [
  'Under KES 20,000',
  'KES 20,000 – 50,000',
  'KES 50,000 – 150,000',
  'KES 150,000 – 500,000',
  'KES 500,000+',
  'Not sure yet',
]

const timelines = ['ASAP (1–2 weeks)', '2–4 weeks', '1–2 months', 'Flexible / planning']

type Intent = 'buy' | 'request' | 'quote'

export function RequestServicePage() {
  const [params] = useSearchParams()
  const initialPackageId = params.get('package') || ''
  const initialPay = params.get('pay') === '1'
  const initialIntent = (params.get('intent') as Intent) || 'request'
  const [step, setStep] = useState(() => {
    // Pay now from pricing: skip intent/package/confirm — one checkout screen.
    if (initialPay && initialPackageId && initialIntent === 'buy') return 2
    if (initialPackageId) return 1
    return 0
  })
  const [intent, setIntent] = useState<Intent>(initialIntent)
  const [packageId, setPackageId] = useState(initialPackageId)
  const [serviceSlug, setServiceSlug] = useState(params.get('service') || '')
  const [packages, setPackages] = useState(() => withGroupDefaults(starterPricingPackages))
  const [services, setServices] = useState<CatalogService[]>([])
  const authUser = loadAuthUser()
  const [name, setName] = useState(authUser?.name || '')
  const [email, setEmail] = useState(authUser?.email || '')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [privacyOk, setPrivacyOk] = useState(false)
  const [wantPayNow, setWantPayNow] = useState(initialPay)
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES')
  const { website, honeypot } = useHoneypot()

  useEffect(() => {
    fetchShop()
      .then((list) => {
        const published = withGroupDefaults(list as PricingPackage[])
        if (published.length) setPackages(published)
      })
      .catch(() => undefined)
    void loadPublishedServices().then(setServices)
  }, [])

  const serviceGroups = useMemo(() => groupPricingPackages(packages), [packages])

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === packageId),
    [packages, packageId],
  )
  const selectedService = useMemo(
    () => services.find((s) => s.slug === serviceSlug),
    [services, serviceSlug],
  )

  const canInstantPay =
    intent === 'buy' && Boolean(selectedPackage && isInstantCheckoutPackage(selectedPackage))

  /** Pricing “Pay now”: package already chosen — one screen, then Paystack popup. */
  const expressCheckout =
    initialPay && intent === 'buy' && Boolean(initialPackageId) && canInstantPay

  useEffect(() => {
    if (!canInstantPay) setWantPayNow(false)
    else if (expressCheckout) setWantPayNow(true)
  }, [canInstantPay, expressCheckout])

  async function submit(payOverride?: boolean) {
    setError('')
    if (!privacyOk) {
      setError('Please accept the privacy notice to continue.')
      return
    }
    const shouldPay = Boolean(payOverride ?? (wantPayNow && canInstantPay))
    if (shouldPay && (!name.trim() || !email.includes('@'))) {
      setError('Name and valid email are required to pay')
      return
    }
    setSubmitting(true)
    try {
      if (shouldPay && selectedPackage && canInstantPay) {
        await startPaystackCheckout({
          type: 'checkout',
          email,
          name,
          phone,
          company,
          packageId: selectedPackage.id,
          currency,
          brand: 'tech',
        })
        return
      }
      await submitServiceRequest({
        name,
        email,
        phone,
        company,
        budget,
        timeline,
        intent,
        packageId: selectedPackage?.id,
        packageName: selectedPackage
          ? `${selectedPackage.groupName || selectedPackage.name} — ${selectedPackage.tierLabel || selectedPackage.name}`
          : undefined,
        packagePrice: selectedPackage
          ? `${selectedPackage.currency} ${selectedPackage.price.toLocaleString()}`
          : undefined,
        service: selectedService?.name || serviceSlug,
        message,
        source: 'request-flow',
        website,
      })
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit request')
    } finally {
      setSubmitting(false)
    }
  }

  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi Ellines Tech — I'd like to ${intent === 'buy' ? 'purchase' : 'request'} ${selectedPackage?.name || selectedService?.name || 'a service'}.`,
  )}`

  if (done) {
    return (
      <>
        <SEO title="Request received" path="/request" />
        <section className="section-padding">
          <div className="section-container max-w-xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15 text-brand-300">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold text-white">Request received</h1>
            <p className="mt-3 text-slate-400">
              Our team will respond within a few hours (24/7). You can also continue on WhatsApp.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href={waHref} external icon>
                Continue on WhatsApp
              </Button>
              <Button href="/pricing" variant="secondary">
                Back to pricing
              </Button>
            </div>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <p className="text-sm font-medium text-white">Create a client account to track this</p>
              <p className="mt-1 text-xs text-slate-400">
                Optional — register with the same email to see requests and invoices in your client
                portal.
              </p>
              <Button href="/account" size="sm" className="mt-4" variant="secondary">
                Create client account
              </Button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Request a service"
        description="Request or purchase Ellines Tech packages — websites, software, AI, design, and career documents."
        path="/request"
      />
      <section className="section-padding">
        <div className="relative section-container max-w-3xl">
          {honeypot}
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
            {expressCheckout ? 'Express checkout' : 'Professional intake'}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            {expressCheckout ? 'Pay for your package' : 'Request or buy a service'}
          </h1>
          <p className="mt-3 text-slate-400">
            {expressCheckout
              ? 'Confirm your details and pay securely on this page — no redirect maze.'
              : 'A short brief so we can quote accurately — same flow used by modern product studios.'}
          </p>

          {!expressCheckout && (
            <ol className="mt-10 flex items-center gap-2 sm:gap-3">
              {steps.map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3">
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border font-display text-xs font-bold transition-colors',
                      i < step && 'border-brand-400/40 bg-brand-500/20 text-brand-200',
                      i === step && 'border-brand-400/60 bg-brand-400 text-slate-950',
                      i > step && 'border-white/10 bg-white/[0.03] text-slate-500',
                    )}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      'hidden text-[11px] font-semibold uppercase tracking-[0.14em] sm:block',
                      i === step ? 'text-white' : 'text-slate-500',
                    )}
                  >
                    {label}
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      className={cn(
                        'h-px flex-1 transition-colors',
                        i < step ? 'bg-brand-400/40' : 'bg-white/10',
                      )}
                    />
                  )}
                </li>
              ))}
            </ol>
          )}

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 sm:p-8">
            {step === 0 && !expressCheckout && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-white">What do you need?</h2>
                {(
                  [
                    ['buy', 'Buy a listed package', 'Pick from Product Pricing and start fulfilment.'],
                    ['request', 'Request a scoped service', 'Tell us the outcome — we’ll propose scope & price.'],
                    ['quote', 'Get a custom quote', 'Larger builds, retainers, or multi-workstream projects.'],
                  ] as const
                ).map(([value, title, desc]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setIntent(value)}
                    className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                      intent === value
                        ? 'border-brand-400/50 bg-brand-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-slate-400">{desc}</p>
                  </button>
                ))}
                <Button type="button" className="mt-4" onClick={() => setStep(1)} icon>
                  Continue
                </Button>
              </div>
            )}

            {step === 1 && !expressCheckout && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-white">
                  {intent === 'buy' ? 'Choose a package' : 'Select a starting point'}
                </h2>
                <p className="text-sm text-slate-400">
                  Pick a service, then the tier that matches your experience, needs, and budget.
                </p>
                <div className="max-h-[28rem] space-y-4 overflow-auto pr-1">
                  {serviceGroups.map((g) => {
                    const selectedInGroup = g.variants.some((v) => v.id === packageId)
                    return (
                      <div
                        key={g.groupId}
                        className={`rounded-xl border p-3 ${
                          selectedInGroup
                            ? 'border-brand-400/40 bg-brand-500/[0.06]'
                            : 'border-white/10 bg-white/[0.02]'
                        }`}
                      >
                        <div className="mb-2 flex items-baseline justify-between gap-2">
                          <p className="text-sm font-semibold text-white">{g.groupName}</p>
                          <p className="text-[11px] uppercase tracking-wider text-slate-500">
                            {g.category}
                          </p>
                        </div>
                        <div className="space-y-1.5" role="radiogroup" aria-label={g.groupName}>
                          {g.variants.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              role="radio"
                              aria-checked={packageId === p.id}
                              onClick={() => {
                                setPackageId(p.id)
                                setServiceSlug('')
                              }}
                              className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                                packageId === p.id
                                  ? 'border-brand-400/50 bg-brand-500/10'
                                  : 'border-white/8 hover:border-white/20'
                              }`}
                            >
                              <span>
                                <span className="block text-sm font-medium text-white">
                                  {p.tierLabel}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {p.experienceBand || p.level || p.name}
                                </span>
                              </span>
                              <span className="shrink-0 text-sm text-brand-300">
                                {p.currency} {p.price.toLocaleString()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {intent !== 'buy' && (
                  <>
                    <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Or pick a service line
                    </p>
                    <select
                      aria-label="Service line"
                      value={serviceSlug}
                      onChange={(e) => {
                        setServiceSlug(e.target.value)
                        if (e.target.value) setPackageId('')
                      }}
                      className={selectClass}
                    >
                      <option value="">Select service…</option>
                      {services.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (intent === 'buy' && !packageId) {
                        setError('Select a package to continue')
                        return
                      }
                      setError('')
                      setStep(2)
                    }}
                    icon
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-white">Your details</h2>
                {expressCheckout && selectedPackage && (
                  <div className="rounded-xl border border-brand-400/25 bg-brand-500/[0.08] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300">
                      Paying now
                    </p>
                    <p className="mt-1 font-medium text-white">
                      {selectedPackage.groupName || selectedPackage.name}
                      {selectedPackage.tierLabel
                        ? ` — ${selectedPackage.tierLabel}`
                        : ''}
                    </p>
                    <p className="mt-0.5 font-display text-lg font-semibold tabular-nums text-brand-200">
                      {selectedPackage.currency}{' '}
                      {Number(selectedPackage.price).toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="req-name">
                    <input
                      id="req-name"
                      required
                      placeholder="Amina Wanjiku"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={fieldClass}
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Work / Personal email" htmlFor="req-email">
                    <input
                      id="req-email"
                      required
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={fieldClass}
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Phone / WhatsApp" htmlFor="req-phone" optional>
                    <input
                      id="req-phone"
                      placeholder="+254 …"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={fieldClass}
                      autoComplete="tel"
                    />
                  </Field>
                  <Field label="Company / School" htmlFor="req-company" optional>
                    <input
                      id="req-company"
                      placeholder="Your company or school"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  {!expressCheckout && (
                    <>
                      <Field label="Budget range" htmlFor="req-budget" optional>
                        <select
                          id="req-budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select a range…</option>
                          {budgets.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Timeline" htmlFor="req-timeline" optional>
                        <select
                          id="req-timeline"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Select a timeline…</option>
                          {timelines.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </>
                  )}
                </div>
                {!expressCheckout && (
                  <Field
                    label="Project notes"
                    htmlFor="req-message"
                    optional
                    hint="Goals, constraints, or links to references — the more context, the sharper the quote."
                  >
                    <textarea
                      id="req-message"
                      rows={4}
                      placeholder="Describe goals, constraints, or links to references…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                )}
                {expressCheckout && (
                  <>
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                      <input
                        type="checkbox"
                        checked={privacyOk}
                        onChange={(e) => setPrivacyOk(e.target.checked)}
                        className="mt-1 accent-cyan-400"
                        required
                      />
                      <span>
                        I agree that Ellines Tech may collect and process this information under the{' '}
                        <Link to="/privacy" className="text-brand-300 hover:text-brand-200">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    <p className="text-xs text-slate-500">
                      Paystack opens on this page. Card / mobile money — deposit and full-pay invoices
                      still work from your invoice link.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button href="/pricing" variant="secondary">
                        Change package
                      </Button>
                      <Button
                        type="button"
                        onClick={() => void submit(true)}
                        disabled={submitting || !privacyOk}
                        icon
                      >
                        {submitting
                          ? 'Opening checkout…'
                          : `Pay ${selectedPackage?.currency || 'KES'} ${Number(selectedPackage?.price || 0).toLocaleString()}`}
                      </Button>
                    </div>
                  </>
                )}
                {!expressCheckout && (
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!name.trim() || !email.includes('@')) {
                          setError('Name and valid email are required')
                          return
                        }
                        setError('')
                        setStep(3)
                      }}
                      icon
                    >
                      Review
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 3 && !expressCheckout && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-white">Confirm request</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4 border-b border-white/5 py-2">
                    <dt className="text-slate-500">Intent</dt>
                    <dd className="text-white capitalize">{intent}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/5 py-2">
                    <dt className="text-slate-500">Package / service</dt>
                    <dd className="text-right text-white">
                      {selectedPackage
                        ? `${selectedPackage.groupName || selectedPackage.name} — ${selectedPackage.tierLabel || selectedPackage.name}`
                        : selectedService?.name || 'Custom'}
                      {selectedPackage && (
                        <span className="mt-0.5 block text-brand-300">
                          {selectedPackage.currency}{' '}
                          {selectedPackage.price.toLocaleString()}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/5 py-2">
                    <dt className="text-slate-500">Contact</dt>
                    <dd className="text-right text-white">
                      {name}
                      <br />
                      {email}
                      {phone && (
                        <>
                          <br />
                          {phone}
                        </>
                      )}
                    </dd>
                  </div>
                  {(budget || timeline) && (
                    <div className="flex justify-between gap-4 border-b border-white/5 py-2">
                      <dt className="text-slate-500">Budget / timeline</dt>
                      <dd className="text-right text-white">
                        {[budget, timeline].filter(Boolean).join(' · ')}
                      </dd>
                    </div>
                  )}
                </dl>
                <p className="text-xs text-slate-500">
                  {wantPayNow && canInstantPay
                    ? 'Paystack opens on this page so you can pay this fixed package now. Custom project work still uses the request → invoice path.'
                    : 'Payment instructions (M-Pesa / invoice) are shared after we confirm scope. No card charge on this form unless you choose Pay now on an eligible package.'}
                </p>
                {canInstantPay && (
                  <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <label className="flex items-start gap-3 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={wantPayNow}
                        onChange={(e) => setWantPayNow(e.target.checked)}
                        className="mt-1 accent-cyan-400"
                      />
                      <span>
                        Pay now with Paystack ({selectedPackage?.currency}{' '}
                        {Number(selectedPackage?.price || 0).toLocaleString()})
                      </span>
                    </label>
                    {wantPayNow && (
                      <label className="block text-xs text-slate-400">
                        Charge currency
                        <select
                          value={currency}
                          onChange={(e) =>
                            setCurrency(e.target.value === 'USD' ? 'USD' : 'KES')
                          }
                          className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
                        >
                          <option value="KES">KES (default)</option>
                          <option value="USD">USD</option>
                        </select>
                        <span className="mt-1 block text-[11px] text-slate-600">
                          Package catalogue prices are in KES; choosing USD charges the same numeric
                          amount in USD (confirm with the team if unsure).
                        </span>
                      </label>
                    )}
                  </div>
                )}
                <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                  <input
                    type="checkbox"
                    checked={privacyOk}
                    onChange={(e) => setPrivacyOk(e.target.checked)}
                    className="mt-1 accent-cyan-400"
                    required
                  />
                  <span>
                    I agree that Ellines Tech may collect and process this information under the{' '}
                    <Link to="/privacy" className="text-brand-300 hover:text-brand-200">
                      Privacy Policy
                    </Link>{' '}
                    and Kenya Data Protection Act, 2019. I can manage cookies in the{' '}
                    <Link to="/cookies" className="text-brand-300 hover:text-brand-200">
                      Cookie Policy
                    </Link>
                    .
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => void submit()}
                    disabled={submitting || !privacyOk}
                    icon
                  >
                    {submitting
                      ? wantPayNow && canInstantPay
                        ? 'Opening checkout…'
                        : 'Sending…'
                      : wantPayNow && canInstantPay
                        ? 'Pay with Paystack'
                        : intent === 'buy'
                          ? 'Submit purchase request'
                          : 'Submit request'}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
              >
                {error}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Prefer email?{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-brand-300">
              {siteConfig.email}
            </a>
            {' · '}
            <Link to="/contact" className="text-brand-300">
              Contact page
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { services } from '@/data/services'
import { starterPricingPackages } from '@/data/pricingPackages'
import { fetchShop, submitServiceRequest } from '@/lib/cmsApi'
import { siteConfig } from '@/data/site'

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
  const [step, setStep] = useState(0)
  const [intent, setIntent] = useState<Intent>(
    (params.get('intent') as Intent) || 'request',
  )
  const [packageId, setPackageId] = useState(params.get('package') || '')
  const [serviceSlug, setServiceSlug] = useState(params.get('service') || '')
  const [packages, setPackages] = useState(starterPricingPackages)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchShop()
      .then((list) => {
        const published = (list as typeof starterPricingPackages).filter(
          (p) => p.status === 'published',
        )
        if (published.length) setPackages(published)
      })
      .catch(() => undefined)
  }, [])

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === packageId),
    [packages, packageId],
  )
  const selectedService = useMemo(
    () => services.find((s) => s.slug === serviceSlug),
    [serviceSlug],
  )

  async function submit() {
    setError('')
    setSubmitting(true)
    try {
      await submitServiceRequest({
        name,
        email,
        phone,
        company,
        budget,
        timeline,
        intent,
        packageId: selectedPackage?.id,
        packageName: selectedPackage?.name,
        packagePrice: selectedPackage
          ? `${selectedPackage.currency} ${selectedPackage.price.toLocaleString()}`
          : undefined,
        service: selectedService?.name || serviceSlug,
        message,
        source: 'request-flow',
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
        <div className="section-container max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
            Professional intake
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Request or buy a service
          </h1>
          <p className="mt-3 text-slate-400">
            A short brief so we can quote accurately — same flow used by modern product studios.
          </p>

          <ol className="mt-8 flex flex-wrap gap-2">
            {steps.map((label, i) => (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  i === step
                    ? 'bg-brand-500/20 text-brand-200'
                    : i < step
                      ? 'bg-white/10 text-white'
                      : 'bg-white/[0.03] text-slate-500'
                }`}
              >
                <span>{i + 1}</span>
                {label}
                {i < steps.length - 1 && <ChevronRight className="h-3 w-3 opacity-40" />}
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            {step === 0 && (
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

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-white">
                  {intent === 'buy' ? 'Choose a package' : 'Select a starting point'}
                </h2>
                <div className="max-h-72 space-y-2 overflow-auto pr-1">
                  {packages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPackageId(p.id)
                        setServiceSlug('')
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left ${
                        packageId === p.id
                          ? 'border-brand-400/50 bg-brand-500/10'
                          : 'border-white/10'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium text-white">{p.name}</span>
                        <span className="text-xs text-slate-500">{p.category}</span>
                      </span>
                      <span className="shrink-0 text-sm text-brand-300">
                        {p.currency} {p.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
                {intent !== 'buy' && (
                  <>
                    <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Or pick a service line
                    </p>
                    <select
                      value={serviceSlug}
                      onChange={(e) => {
                        setServiceSlug(e.target.value)
                        if (e.target.value) setPackageId('')
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white"
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                  />
                  <input
                    placeholder="Phone / WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                  />
                  <input
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                  />
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white"
                  >
                    <option value="">Budget range</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white"
                  >
                    <option value="">Timeline</option>
                    {timelines.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe goals, constraints, or links to references…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white"
                />
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
              </div>
            )}

            {step === 3 && (
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
                      {selectedPackage?.name || selectedService?.name || 'Custom'}
                      {selectedPackage && (
                        <span className="mt-0.5 block text-brand-300">
                          From {selectedPackage.currency}{' '}
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
                  Payment instructions (M-Pesa / invoice) are shared after we confirm scope. No card
                  charge on this form.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="button" onClick={submit} disabled={submitting} icon>
                    {submitting ? 'Sending…' : intent === 'buy' ? 'Submit purchase request' : 'Submit request'}
                  </Button>
                </div>
              </div>
            )}

            {error && <p className="mt-4 text-sm text-amber-200">{error}</p>}
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

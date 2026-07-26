import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  CalendarClock,
  ArrowUpRight,
  Check,
  Send,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { LocationMaps } from '@/components/LocationMaps'
import { Button } from '@/components/ui/Button'
import { Field, fieldClass } from '@/components/ui/Field'
import { SocialLinks } from '@/components/engagement/SocialLinks'
import { PrivacyConsentField } from '@/components/PrivacyConsentField'
import { useHoneypot } from '@/components/HoneypotField'
import { siteConfig } from '@/data/site'
import { directionsUrl, locationLine, locations, mapsSearchUrl } from '@/data/locations'
import { useSiteProfile } from '@/context/SiteProfileContext'
import { useSiteCopy } from '@/hooks/useSiteCopy'

const interestOptions = [
  { value: 'quote', label: 'Request a quote', hint: 'Scoped pricing for a defined build' },
  { value: 'demo', label: 'Product demo', hint: 'See our platforms in action' },
  { value: 'partnership', label: 'Partnership', hint: 'Agencies, resellers, ventures' },
  { value: 'support', label: 'Support', hint: 'An existing project or system' },
  { value: 'other', label: 'Something else', hint: 'Tell us in your own words' },
] as const

const nextSteps = [
  'We read your brief and reply within a few hours — day or night.',
  'A short call or WhatsApp thread to confirm scope and priorities.',
  'You get a written proposal with timeline, price, and deliverables.',
]

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const { profile } = useSiteProfile()
  const { contact: liveContact } = useSiteCopy()
  const { honeypot } = useHoneypot()
  const phone = profile.phone || siteConfig.phone
  const whatsapp = profile.whatsapp || siteConfig.whatsapp
  const email = profile.email || siteConfig.email
  const address = profile.address || siteConfig.address
  const waHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}`
  const mapsHref = mapsSearchUrl(address)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSending(true)
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch('/api/cms?resource=leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'lead',
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone') || '',
          company: data.get('company') || '',
          message: `${data.get('interest') || ''}: ${data.get('message') || ''}`,
          intent: 'quote',
          source: 'contact',
          website: data.get('website') || '',
        }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(
          typeof payload.error === 'string' ? payload.error : 'Could not send message',
        )
      }
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Could not reach the server. Please try WhatsApp or email.',
      )
    } finally {
      setSending(false)
    }
  }

  const channels = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: whatsapp,
      note: 'Fastest reply',
      href: waHref,
      external: true,
      accent: 'text-emerald-300 bg-emerald-500/10 ring-emerald-400/25',
    },
    {
      icon: Phone,
      label: 'Call us',
      value: phone,
      note: 'Talk it through',
      href: `tel:${phone.replace(/\s/g, '')}`,
      accent: 'text-brand-300 bg-brand-500/10 ring-brand-400/25',
    },
    {
      icon: Mail,
      label: 'Email',
      value: email,
      note: 'Briefs & documents',
      href: `mailto:${email}`,
      accent: 'text-brand-300 bg-brand-500/10 ring-brand-400/25',
    },
    {
      icon: CalendarClock,
      label: 'Book a meeting',
      value: 'Schedule a call',
      note: 'Pick a time that works',
      href: `mailto:${email}?subject=Meeting%20Request`,
      accent: 'text-sky-300 bg-sky-500/10 ring-sky-400/25',
    },
  ]

  const directLines = [
    ...[email, ...siteConfig.emails.filter((e) => e !== email)].map((addr) => ({
      icon: Mail,
      label: 'Email',
      value: addr,
      href: `mailto:${addr}`,
      external: false,
    })),
    ...[phone, ...siteConfig.phones.filter((p) => p !== phone && p !== whatsapp)].map((p) => ({
      icon: Phone,
      label: 'Phone',
      value: p,
      href: `tel:${p.replace(/\s/g, '')}`,
      external: false,
    })),
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: whatsapp,
      href: waHref,
      external: true,
    },
    ...locations.map((location) => ({
      icon: MapPin,
      label: location.role,
      value: location.address,
      href: directionsUrl(location),
      external: true,
    })),
  ]

  return (
    <>
      <SEO
        title={`Contact — ${locationLine}`}
        description="Contact Ellines Tech in Nyeri and Nairobi, Kenya — request a quote, book a meeting, or reach us via WhatsApp, email, or phone for IT, web design, and consulting."
        path="/contact"
      />

      {/* Hero — atmosphere over a real scene, one clear job: start the conversation */}
      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.contact}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-brand-500/12 blur-[110px]" />

        <div className="section-container relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Contact
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              {liveContact.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              {liveContact.lead}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#quote" size="lg" icon>
                Send a brief
              </Button>
              <Button href={waHref} variant="secondary" size="lg" external>
                WhatsApp us
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2 font-medium text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {siteConfig.hours.label} · 24/7
              </span>
              <span>{siteConfig.hours.detail}</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-slate-500" />
                {locationLine}
              </span>
              {address !== locationLine && <span>{address}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Channels — pick the way you prefer to talk */}
      <section className="border-b border-white/5 bg-surface/40">
        <div className="section-container py-8 sm:py-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel, i) => (
              <motion.a
                key={channel.label}
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 transition-all hover:border-brand-500/30 hover:bg-white/[0.05]"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${channel.accent}`}
                >
                  <channel.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {channel.label}
                  </span>
                  <span className="mt-0.5 block truncate font-medium text-white">
                    {channel.value}
                  </span>
                  <span className="text-xs text-slate-500">{channel.note}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-300" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Brief + direct lines */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            <motion.div
              id="quote"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="scroll-mt-28 lg:col-span-3"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 sm:p-9">
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-500/12 blur-3xl" />

                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
                    Project brief
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Tell us what you&apos;re building
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                    {liveContact.formNote ||
                      'A few details is all we need to come back with a considered answer — usually within a few hours.'}
                  </p>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative mt-10"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">
                      <Check className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-white">
                      Your brief is in.
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                      We&apos;ve received your message and will reply to you shortly. If it&apos;s
                      urgent, continue the conversation on WhatsApp and we&apos;ll pick it up right
                      away.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button href={waHref} external icon>
                        Continue on WhatsApp
                      </Button>
                      <Button href="/portfolio" variant="secondary">
                        See our work
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative mt-9 space-y-7">
                    {honeypot}
                    <fieldset className="space-y-3">
                      <legend className="text-[13px] font-medium text-slate-300">
                        What can we help with?
                      </legend>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {interestOptions.map((option, i) => (
                          <label
                            key={option.value}
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition-colors hover:border-white/20 has-[:checked]:border-brand-400/60 has-[:checked]:bg-brand-500/10 sm:last:col-span-2"
                          >
                            <input
                              type="radio"
                              name="interest"
                              value={option.value}
                              defaultChecked={i === 0}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
                            />
                            <span>
                              <span className="block text-sm font-medium text-white">
                                {option.label}
                              </span>
                              <span className="mt-0.5 block text-xs text-slate-500">
                                {option.hint}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full name" htmlFor="name">
                        <input
                          id="name"
                          name="name"
                          required
                          className={fieldClass}
                          placeholder="Amina Wanjiku"
                        />
                      </Field>
                      <Field label="Email" htmlFor="email">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className={fieldClass}
                          placeholder="you@email.com"
                        />
                      </Field>
                      <Field label="Company / School" htmlFor="company" optional>
                        <input
                          id="company"
                          name="company"
                          className={fieldClass}
                          placeholder="Your company or school"
                        />
                      </Field>
                      <Field label="Phone / WhatsApp" htmlFor="phone" optional>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          className={fieldClass}
                          placeholder="+254 …"
                        />
                      </Field>
                    </div>

                    <Field
                      label="Your brief"
                      htmlFor="message"
                      hint="Goals, timeline, budget range, or links to references — whatever you have."
                    >
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className={fieldClass}
                        placeholder="We need a booking platform for a 40-room property…"
                      />
                    </Field>

                    <div className="space-y-5 border-t border-white/8 pt-6">
                      <PrivacyConsentField />
                      {error && (
                        <p
                          role="alert"
                          className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
                        >
                          {error}
                        </p>
                      )}
                      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <Button type="submit" size="lg" disabled={sending}>
                          {sending ? 'Sending…' : 'Send brief'}
                          <Send className="h-4 w-4" />
                        </Button>
                        <p className="text-xs leading-relaxed text-slate-500">
                          Prefer a guided intake?{' '}
                          <Link to="/request" className="text-brand-300 hover:text-brand-200">
                            Use the request flow
                          </Link>{' '}
                          for packages and pricing.
                        </p>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            <div className="space-y-8 lg:col-span-2">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">Direct lines</h2>
                <div className="mt-4 divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                  {directLines.map((line) => (
                    <a
                      key={`${line.label}-${line.value}`}
                      href={line.href}
                      target={line.external ? '_blank' : undefined}
                      rel={line.external ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <line.icon className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-brand-300" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {line.label}
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-white transition-colors group-hover:text-brand-200">
                          {line.value}
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-700 transition-colors group-hover:text-brand-300" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.09] via-transparent to-transparent p-5">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {siteConfig.hours.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {siteConfig.hours.detail}. Weekends and late nights included — we build for teams
                  in different time zones.
                </p>
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-white">What happens next</h2>
                <ol className="mt-4 space-y-4">
                  {nextSteps.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-400/25 bg-brand-500/10 font-display text-xs font-bold text-brand-300">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-slate-400">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-white">Follow along</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Product releases, client launches, and engineering notes.
                </p>
                <SocialLinks className="mt-4" showLabels />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location — two cities, two maps */}
      <section className="relative border-t border-white/5 bg-surface/30">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-40" />
        <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-[110px]" />

        <div className="section-container relative section-padding">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
              <MapPin className="h-3.5 w-3.5" />
              Where we are
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Two homes in Kenya — {locations.map((l) => l.city).join(' & ')}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Our head office is in Nyeri and we keep a working presence in Nairobi, so we can meet
              you wherever the project lives. Delivery stays remote-first for clients across Africa
              and beyond.
            </p>
          </div>

          <LocationMaps className="mt-10" />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={mapsHref} variant="secondary" size="sm" external>
              Find us in Maps
            </Button>
            <Button href="/about" variant="ghost" size="sm" icon>
              About Ellines Tech
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

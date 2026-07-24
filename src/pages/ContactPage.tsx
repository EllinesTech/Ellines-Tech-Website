import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Calendar } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/data/site'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SEO
        title="Contact"
        description="Contact Ellines Tech — request a quote, book a meeting, or reach us via WhatsApp, email, or phone."
        path="/contact"
      />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Contact"
            title="Let's Build Something Great"
            description="Reach out for project inquiries, demos, partnerships, or support. We're here 24/7 to assist you with demos and services — and you can also reach us on WhatsApp or social media."
            align="center"
            className="mb-16"
          />

          <div className="grid gap-12 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <div className="space-y-1">
                    {siteConfig.emails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="block text-white transition-colors hover:text-brand-300"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {siteConfig.phones.map((phone) => (
                <div key={phone} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Phone</p>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-white transition-colors hover:text-brand-300"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">WhatsApp</p>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition-colors hover:text-brand-300"
                  >
                    +254 748 255 466
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="text-white">{siteConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Book a Meeting</p>
                  <a
                    href={`mailto:${siteConfig.email}?subject=Meeting%20Request`}
                    className="text-white transition-colors hover:text-brand-300"
                  >
                    Schedule a call
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-6">
                <h3 className="font-display font-semibold text-white">Google Maps</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Visit our office in {siteConfig.address}. Map integration can be added during
                  deployment.
                </p>
                <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-white/5 text-sm text-slate-500">
                  Map placeholder — Nairobi, Kenya
                </div>
              </div>
            </div>

            <div id="quote" className="scroll-mt-24 lg:col-span-3">
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-white">Send Us a Message</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Fill out the form and we&apos;ll get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="mt-8 rounded-xl bg-brand-500/10 p-6 text-center">
                    <p className="font-medium text-brand-300">
                      Thank you! Your message has been received.
                    </p>
                    <p className="mt-2 text-sm text-slate-400">We&apos;ll be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-300">
                        Company
                      </label>
                      <input
                        id="company"
                        name="company"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label htmlFor="interest" className="block text-sm font-medium text-slate-300">
                        I&apos;m interested in
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                      >
                        <option value="quote">Request a Quote</option>
                        <option value="demo">Product Demo</option>
                        <option value="partnership">Partnership</option>
                        <option value="support">Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
                        placeholder="Tell us about your project..."
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

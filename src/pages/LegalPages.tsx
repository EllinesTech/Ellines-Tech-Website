import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { siteConfig } from '@/data/site'
import { Link } from 'react-router-dom'
import { useSiteCopy } from '@/hooks/useSiteCopy'
import { CONSENT_POLICY_VERSION, loadConsent, saveConsent } from '@/lib/consent'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const updated = '25 July 2026'

function LegalShell({
  title,
  description,
  path,
  children,
}: {
  title: string
  description: string
  path: string
  children: React.ReactNode
}) {
  return (
    <>
      <SEO title={title} description={description} path={path} />
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/30 to-transparent" />
        <div className="section-container relative max-w-3xl py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">Legal</p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
            <span>Updated {updated}</span>
            <span className="text-slate-700" aria-hidden>
              /
            </span>
            <span>{siteConfig.name}</span>
            <span className="text-slate-700" aria-hidden>
              /
            </span>
            <span>{siteConfig.address}</span>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <div className="prose-legal space-y-6 text-sm leading-relaxed text-slate-400 sm:text-base">
            {children}
          </div>
          <p className="mt-12 border-t border-white/10 pt-8 text-sm text-slate-500">
            Related:{' '}
            <Link to="/privacy" className="text-brand-300 hover:text-brand-200">
              Privacy
            </Link>
            {' · '}
            <Link to="/cookies" className="text-brand-300 hover:text-brand-200">
              Cookies
            </Link>
            {' · '}
            <Link to="/terms" className="text-brand-300 hover:text-brand-200">
              Terms
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      description="How Ellines Tech collects, uses, and protects personal data under Kenyan law."
      path="/privacy"
    >
      <p>
        This Privacy Policy explains how <strong className="text-slate-200">{siteConfig.name}</strong>{' '}
        (“we”, “us”) processes personal data when you use {siteConfig.url}, our chat, forms,
        accounts, and related services. We operate from {siteConfig.headOfficeAddress}, with a
        Nairobi presence, and process data in
        line with the <strong className="text-slate-200">Data Protection Act, 2019</strong> of Kenya
        and guidance from the Office of the Data Protection Commissioner (ODPC).
      </p>

      <h3 className="font-display text-lg font-semibold text-white">1. Data controller</h3>
      <p>
        Controller: {siteConfig.name}, {siteConfig.headOfficeAddress}. Contact:{' '}
        <a href={`mailto:${siteConfig.email}`} className="text-brand-300 hover:text-brand-200">
          {siteConfig.email}
        </a>
        , phone {siteConfig.phone}. For data-protection requests, email the same address with subject
        “Data protection request”.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">2. Personal data we collect</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong className="text-slate-200">Identity & contact</strong> — name, email, phone /
          WhatsApp, company, and messages you send via contact, request, careers, or chat.
        </li>
        <li>
          <strong className="text-slate-200">Account data</strong> — login email, role, and activity
          needed to operate client / staff / admin access.
        </li>
        <li>
          <strong className="text-slate-200">Transaction & project context</strong> — package
          selections, quotes, invoices, and service requests you submit.
        </li>
        <li>
          <strong className="text-slate-200">Technical data</strong> — IP address, browser type,
          pages visited, and similar logs (where analytics consent is given).
        </li>
        <li>
          <strong className="text-slate-200">Careers</strong> — CV / application materials you upload
          voluntarily when applying for roles.
        </li>
      </ul>

      <h3 className="font-display text-lg font-semibold text-white">3. Purposes & legal bases</h3>
      <p>We process personal data to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Respond to enquiries and deliver contracted services (contract / steps prior to contract).</li>
        <li>Operate accounts, security, and fraud prevention (legitimate interests / legal obligation).</li>
        <li>Improve the website with analytics only where you consent (consent).</li>
        <li>Send service messages you request; marketing only with consent or as allowed by law.</li>
        <li>Comply with Kenyan tax, accounting, and regulatory duties (legal obligation).</li>
      </ul>

      <h3 className="font-display text-lg font-semibold text-white">4. Cookies & similar tech</h3>
      <p>
        See our{' '}
        <Link to="/cookies" className="text-brand-300 hover:text-brand-200">
          Cookie Policy
        </Link>
        . You can accept, reject optional cookies, or customise preferences via the consent banner
        (policy version {CONSENT_POLICY_VERSION}).
      </p>

      <h3 className="font-display text-lg font-semibold text-white">5. Sharing</h3>
      <p>
        We do not sell personal data. We may share data with processors who help us host the site
        (for example Cloudflare), send email, process payments you initiate, or provide professional
        advisors — under confidentiality and data-protection terms. We may disclose data if required
        by Kenyan law or a competent authority.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">6. Transfers</h3>
      <p>
        Some infrastructure may process data outside Kenya. Where that happens, we take appropriate
        safeguards consistent with the Data Protection Act, 2019 (for example contractual clauses
        and security controls).
      </p>

      <h3 className="font-display text-lg font-semibold text-white">7. Retention</h3>
      <p>
        We keep enquiry and project records for as long as needed to deliver services and meet legal
        retention (including tax) periods, then delete or anonymise them. Analytics logs are kept for
        shorter operational windows. You may ask us to erase data where the law allows.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">8. Your rights</h3>
      <p>Under Kenyan law you may request to:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Erase data in certain cases</li>
        <li>Object to or restrict certain processing</li>
        <li>Withdraw consent where processing is based on consent</li>
        <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC)</li>
      </ul>
      <p>
        To exercise rights, email {siteConfig.email}. We may need to verify your identity before
        responding.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">9. Children</h3>
      <p>
        Our services are directed at businesses and adults. We do not knowingly collect personal data
        from children under 18 without appropriate authority.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">10. Security</h3>
      <p>
        We apply reasonable technical and organisational measures (access control, encrypted
        transport, least-privilege admin access). No method of transmission is 100% secure; please
        use strong passwords for accounts we provide.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">11. Contact</h3>
      <p>
        Questions about this policy: {siteConfig.email} · {siteConfig.phone} · WhatsApp{' '}
        {siteConfig.phones[1]}. We&apos;re {siteConfig.hours.label.toLowerCase()}.
      </p>
    </LegalShell>
  )
}

export function CookiePolicyPage() {
  const existing = loadConsent()
  const [analytics, setAnalytics] = useState(existing?.analytics ?? false)
  const [functional, setFunctional] = useState(existing?.functional ?? false)
  const [saved, setSaved] = useState('')

  return (
    <LegalShell
      title="Cookie Policy"
      description="How Ellines Tech uses cookies and how you can manage consent in Kenya."
      path="/cookies"
    >
      <p>
        This Cookie Policy explains what cookies and similar technologies we use on{' '}
        {siteConfig.url}, and how you can control them. It should be read with our{' '}
        <Link to="/privacy" className="text-brand-300 hover:text-brand-200">
          Privacy Policy
        </Link>
        .
      </p>

      <h3 className="font-display text-lg font-semibold text-white">What are cookies?</h3>
      <p>
        Cookies are small text files stored on your device. We also use local storage for preferences
        such as your consent choices and (if allowed) chat continuity.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">Categories we use</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong className="text-slate-200">Necessary</strong> — required for security, load
          balancing, consent storage, and core site function. These do not require optional consent.
        </li>
        <li>
          <strong className="text-slate-200">Analytics</strong> — help us understand which pages are
          used so we can improve the site. Used only with your consent.
        </li>
        <li>
          <strong className="text-slate-200">Functional</strong> — remember helpful features such as
          chat continuity. Used only with your consent.
        </li>
      </ul>

      <h3 className="font-display text-lg font-semibold text-white">Manage your preferences</h3>
      <p className="mb-4">
        You can update choices anytime (policy version {CONSENT_POLICY_VERSION}):
      </p>
      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <label className="flex items-start gap-3 text-slate-300">
          <input type="checkbox" checked disabled className="mt-1" />
          <span>Necessary (always on)</span>
        </label>
        <label className="flex items-start gap-3 text-slate-300">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="mt-1 accent-cyan-400"
          />
          <span>Analytics</span>
        </label>
        <label className="flex items-start gap-3 text-slate-300">
          <input
            type="checkbox"
            checked={functional}
            onChange={(e) => setFunctional(e.target.checked)}
            className="mt-1 accent-cyan-400"
          />
          <span>Functional</span>
        </label>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            saveConsent({ analytics, functional })
            setSaved('Preferences saved on this device.')
          }}
        >
          Save cookie preferences
        </Button>
        {saved && <p className="text-sm text-brand-300">{saved}</p>}
      </div>

      <h3 className="font-display text-lg font-semibold text-white">Browser controls</h3>
      <p>
        You can also block or delete cookies in your browser settings. Blocking necessary cookies may
        affect login or form security features.
      </p>
    </LegalShell>
  )
}

export function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      description="Terms governing use of the Ellines Tech website and services in Kenya."
      path="/terms"
    >
      <p>
        By using this website or submitting a request to {siteConfig.name}, you agree to these Terms
        and our{' '}
        <Link to="/privacy" className="text-brand-300 hover:text-brand-200">
          Privacy Policy
        </Link>
        . Project delivery is governed by separate proposals, statements of work, or contracts.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">1. Who we are</h3>
      <p>
        {siteConfig.name} is a technology company with offices in {siteConfig.address}. Contact:{' '}
        {siteConfig.email}.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">2. Website use</h3>
      <p>
        Content is informational. Prices on /pricing are starting guides in Kenya Shillings (KES)
        and may change. You agree not to misuse the site, scrape aggressively, attempt unauthorised
        access, or submit unlawful or harmful content.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">3. Requests & purchases</h3>
      <p>
        Submitting a buy / quote request is not automatic payment. We confirm scope, then share
        payment instructions. No charge is taken on the public request form unless a separate
        payment channel is clearly stated.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">4. Intellectual property</h3>
      <p>
        Site design, software, and brand assets remain ours or their respective owners unless
        assigned in writing. Client deliverables are handled under the applicable project agreement.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">5. Personal data</h3>
      <p>
        By using forms, chat, or accounts you acknowledge collection of information as described in
        the Privacy and Cookie policies, and you must provide accurate details. Where consent is
        required, we will ask you to accept before processing optional data uses.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">6. Limitation</h3>
      <p>
        To the fullest extent permitted by Kenyan law, we are not liable for indirect or
        consequential loss arising from website use. Nothing here limits liability that cannot be
        limited by law.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">7. Governing law</h3>
      <p>
        These Terms are governed by the laws of Kenya. Courts in Kenya have exclusive jurisdiction,
        without prejudice to mandatory consumer protections.
      </p>

      <h3 className="font-display text-lg font-semibold text-white">8. Contact</h3>
      <p>
        {siteConfig.email} · WhatsApp {siteConfig.phones[1]} · {siteConfig.address}.
      </p>
    </LegalShell>
  )
}

export function FaqPage() {
  const { faq: cmsFaq } = useSiteCopy()
  const fallback = [
    {
      q: 'What does Ellines Tech build?',
      a: 'Software applications, AI products, websites, brand identity, and digital transformation systems for African and global businesses.',
    },
    {
      q: 'Are you available 24/7?',
      a: 'Yes. Demos, support, and project inquiries are always open — chat on the site or WhatsApp a human anytime.',
    },
    {
      q: 'How do I get a quote?',
      a: 'Use the contact form, request flow, chat assistant, or WhatsApp. We scope your needs and usually reply within a few hours.',
    },
    {
      q: 'How long does a typical project take?',
      a: 'Smaller services (resume, logo, landing pages) can ship in days. Product builds and custom software usually take weeks, with a clear milestone plan before we start.',
    },
    {
      q: 'Do you offer AI products?',
      a: 'Yes — including AfyaVox AI, RV22 AI Assistant, and Juno4, plus custom AI automation for support, ops, and document workflows.',
    },
    {
      q: 'What does onboarding look like?',
      a: 'Brief → scope → build → launch. You get a written plan, demos you can react to, and a clean handoff with support that stays available 24/7.',
    },
    {
      q: 'Where are you based?',
      a: 'We have two homes in Kenya: our head office at Square2 Street, Skt, Nyeri, and a Nairobi presence for client meetings and on-site work — serving clients across Africa and beyond.',
    },
    {
      q: 'How do you handle my personal data?',
      a: 'Under the Kenya Data Protection Act, 2019. See Privacy and Cookie policies, and use the consent banner to manage cookies.',
    },
    {
      q: 'Can you work with schools, clinics, and SMEs — not only enterprises?',
      a: 'Yes. We build for individuals, schools, clinics, SACCOs, and growing businesses as often as we build for larger organizations.',
    },
  ]
  const faqs = cmsFaq?.length ? cmsFaq : fallback

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about Ellines Tech products, services, timelines, pricing, and support in Kenya."
        path="/faq"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
        faqs={faqs.map((item) => ({ question: item.q, answer: item.a }))}
      />
      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.faq}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-55" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-brand-500/12 blur-[110px]" />

        <div className="section-container relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">Help</p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              Frequently asked
              <span className="mt-1 block text-gradient">questions</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Quick answers about what we build, how we work, and how to reach us.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact#quote" size="lg" icon>
                Send a brief
              </Button>
              <Button
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`}
                variant="secondary"
                size="lg"
                external
              >
                WhatsApp us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((item, i) => (
              <motion.details
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i, 6) * 0.04 }}
                className="group py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display font-semibold text-white transition-colors hover:text-brand-200">
                  {item.q}
                  <ChevronDown className="h-4.5 w-4.5 shrink-0 text-slate-500 transition-transform duration-300 group-open:rotate-180 group-open:text-brand-300" />
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">{item.a}</p>
              </motion.details>
            ))}
          </div>

          <div className="mt-14 relative overflow-hidden rounded-[1.75rem] border border-brand-500/20 bg-gradient-to-br from-brand-900/50 via-slate-950 to-sky-950/60 p-7 sm:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                Still stuck?
              </p>
              <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Still have a question?
              </h2>
              <p className="mt-3 text-slate-300">
                We&apos;re available 24/7 — send a brief or message us directly and a real person will
                answer.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" icon>
                  Send a brief
                </Button>
                <Button
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`}
                  variant="secondary"
                  external
                >
                  WhatsApp us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

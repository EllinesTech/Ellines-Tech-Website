import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { siteConfig } from '@/data/site'
import { Link } from 'react-router-dom'

export function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How Ellines Tech collects, uses, and protects information."
        path="/privacy"
      />
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <SectionHeader
            eyebrow="Legal"
            title="Privacy Policy"
            description={`Last updated ${new Date().getFullYear()}. ${siteConfig.name} respects your privacy.`}
          />
          <div className="mt-10 space-y-6 text-slate-400 leading-relaxed">
            <p>
              We collect information you submit through contact forms, chat, WhatsApp, email, or
              project inquiries — typically name, contact details, and project context — so we can
              respond and deliver services.
            </p>
            <p>
              We use industry-standard safeguards for systems we build and operate. We do not sell
              personal data. Access is limited to team members who need it to support you.
            </p>
            <p>
              Engagement chat transcripts may be stored locally in your browser for continuity and
              admin review on this device. Production CRM storage can be connected separately.
            </p>
            <p>
              Questions? Email {siteConfig.email} or visit our{' '}
              <Link to="/contact" className="text-brand-300 hover:text-brand-200">
                Contact
              </Link>{' '}
              page. We’re {siteConfig.hours.label.toLowerCase()}.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms governing use of the Ellines Tech website and services."
        path="/terms"
      />
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <SectionHeader
            eyebrow="Legal"
            title="Terms of Service"
            description="Using this website and engaging Ellines Tech for work."
          />
          <div className="mt-10 space-y-6 text-slate-400 leading-relaxed">
            <p>
              Content on this site is provided for information about {siteConfig.name} products and
              services. Project work is governed by separate proposals, statements of work, and
              contracts.
            </p>
            <p>
              You agree not to misuse the site, attempt unauthorized access to systems, or submit
              unlawful content through forms or chat.
            </p>
            <p>
              Software and brand assets remain the property of Ellines Tech or their respective
              owners unless otherwise agreed in writing.
            </p>
            <p>
              For commercial terms, contact {siteConfig.email} or WhatsApp {siteConfig.phones[1]}.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export function FaqPage() {
  const faqs = [
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
      a: 'Use the contact form, chat assistant, or WhatsApp. We’ll scope your needs and respond with next steps.',
    },
    {
      q: 'Do you offer AI products?',
      a: 'Yes — including AfyaVox AI, RV22 AI Assistant, and Juno4, plus custom AI automation.',
    },
    {
      q: 'Where are you based?',
      a: 'Nairobi, Kenya — serving clients across Africa and beyond.',
    },
  ]

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about Ellines Tech products, services, and support."
        path="/faq"
      />
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <SectionHeader
            eyebrow="Help"
            title="Frequently asked questions"
            description="Quick answers — or open chat to ask anything else."
            align="center"
            className="mb-12"
          />
          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/10 bg-surface-elevated/40 px-5 py-4 open:border-brand-400/25"
              >
                <summary className="cursor-pointer list-none font-display font-semibold text-white">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

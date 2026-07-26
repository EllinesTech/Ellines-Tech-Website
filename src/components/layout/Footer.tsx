import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { filterFooterNavigation, footerSectionLabels } from '@/data/navigation'
import { siteConfig, technologies } from '@/data/site'
import { directionsUrl, locations } from '@/data/locations'
import { Logo } from '@/components/ui/Logo'
import { SocialLinks } from '@/components/engagement/SocialLinks'
import { InstallAppButton } from '@/components/engagement/InstallApp'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { useSiteFeatures } from '@/context/SiteFeaturesContext'
import { useSiteProfile } from '@/context/SiteProfileContext'

function FooterLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith('http')
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-400 transition-colors hover:text-brand-300"
      >
        {label}
      </a>
    )
  }
  return (
    <Link to={href} className="text-sm text-slate-400 transition-colors hover:text-brand-300">
      {label}
    </Link>
  )
}

export function Footer() {
  const { profile } = useSiteProfile()
  const waHref = `https://wa.me/${(profile.whatsapp || siteConfig.whatsapp).replace(/\D/g, '')}`
  const { settings } = useSiteFeatures()
  const footerNav = useMemo(() => filterFooterNavigation(settings), [settings])
  const emails = useMemo(() => {
    const primary = profile.email || siteConfig.email
    return [primary, ...siteConfig.emails.filter((e) => e !== primary)]
  }, [profile.email])
  const phones = useMemo(() => {
    const primary = profile.phone || siteConfig.phone
    const wa = profile.whatsapp || siteConfig.phones[1]
    return [primary, ...siteConfig.phones.filter((p) => p !== primary && p !== wa), wa].filter(
      (p, i, arr) => p && arr.indexOf(p) === i,
    )
  }, [profile.phone, profile.whatsapp])

  return (
    <footer className="relative border-t border-white/5 bg-surface/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/25 to-transparent" />
      <div className="section-container section-padding">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="nav" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              {siteConfig.description}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {siteConfig.hours.label} · 24/7
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-300"
                >
                  <Mail className="h-4 w-4 shrink-0 text-slate-600" /> {email}
                </a>
              ))}
              {phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-brand-300"
                >
                  <Phone className="h-4 w-4 shrink-0 text-slate-600" /> {phone}
                </a>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/15"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp us
              </a>
              <Link
                to="/contact#quote"
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-brand-400/30 hover:text-brand-200"
              >
                Send a brief
              </Link>
              <InstallAppButton variant="chip" />
            </div>

            <div className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-slate-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <div className="space-y-1">
                {locations.map((location) => (
                  <p key={location.id}>
                    <a
                      href={directionsUrl(location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-brand-300"
                    >
                      <span className="font-semibold text-slate-400">{location.city}</span> ·{' '}
                      {location.address}
                    </a>
                  </p>
                ))}
                <p>{siteConfig.hours.detail}</p>
              </div>
            </div>
            <SocialLinks className="mt-6" size="sm" />
            {settings.newsletterEnabled && (
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Newsletter
                </p>
                <NewsletterSignup />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5">
            {(Object.keys(footerNav) as (keyof typeof footerNav)[]).map((key) =>
              footerNav[key].length === 0 ? null : (
                <div key={key}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                    {footerSectionLabels[key]}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {footerNav[key].map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <FooterLink href={link.href} label={link.label} />
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
            Technologies We Use
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
            {technologies.map((tech, i) => (
              <span key={tech} className="inline-flex items-center gap-3">
                {tech}
                {i < technologies.length - 1 && (
                  <span className="text-slate-700" aria-hidden>
                    /
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <a href={siteConfig.url} className="transition-colors hover:text-brand-300">
              {siteConfig.url.replace('https://', '')}
            </a>
            <Link to="/faq" className="transition-colors hover:text-brand-300">
              FAQ
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-brand-300">
              Privacy
            </Link>
            <Link to="/cookies" className="transition-colors hover:text-brand-300">
              Cookies
            </Link>
            <Link to="/terms" className="transition-colors hover:text-brand-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

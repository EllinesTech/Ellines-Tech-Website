import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { footerNavigation } from '@/data/navigation'
import { siteConfig, technologies } from '@/data/site'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`

  return (
    <footer className="border-t border-white/5 bg-surface/80">
      <div className="section-container section-padding">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="nav" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              {siteConfig.description}
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-slate-400">
              {siteConfig.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 transition-colors hover:text-brand-300"
                >
                  <Mail className="h-4 w-4 shrink-0" /> {email}
                </a>
              ))}
              {siteConfig.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 transition-colors hover:text-brand-300"
                >
                  <Phone className="h-4 w-4 shrink-0" /> {phone}
                </a>
              ))}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-brand-300"
              >
                <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {siteConfig.address}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {Object.entries(footerNavigation).map(([key, links]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white capitalize">
                  {key}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-brand-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
            Technologies We Use
          </p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400"
              >
                {tech}
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
            <Link to="/resources#faqs" className="transition-colors hover:text-brand-300">
              Privacy
            </Link>
            <Link to="/resources#faqs" className="transition-colors hover:text-brand-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

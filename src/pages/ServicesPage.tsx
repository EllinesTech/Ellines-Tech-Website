import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { ProcessSection } from '@/components/home/ProcessSection'
import { serviceCategories, type ServiceCategory } from '@/data/services'
import { siteConfig } from '@/data/site'
import {
  loadPublishedServices,
  serviceImage,
  staticServicesAsCatalog,
  type CatalogService,
} from '@/lib/servicesCatalog'
import {
  Brain,
  Briefcase,
  Code2,
  FileCheck,
  FileText,
  Megaphone,
  Palette,
  Shield,
  Shirt,
  Wrench,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Palette,
  Brain,
  Megaphone,
  Shield,
  FileText,
  Briefcase,
  FileCheck,
  Wrench,
  Shirt,
}

export function ServicesPage() {
  const [services, setServices] = useState<CatalogService[]>(() => staticServicesAsCatalog())
  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`
  const categories = Object.entries(serviceCategories) as [
    ServiceCategory,
    (typeof serviceCategories)[ServiceCategory],
  ][]

  useEffect(() => {
    void loadPublishedServices().then(setServices)
  }, [])

  return (
    <>
      <SEO
        title="IT & Digital Services in Kenya"
        description="Ellines Tech services in Kenya — web design, software development, AI automation, IT consulting, digital marketing, cyber security, logo design, and career documents."
        path="/services"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.serviceTech}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />

        <div className="section-container relative py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Our services
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
              Technology services
              <span className="mt-1 block text-gradient">built to ship</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Design, development, AI, marketing, security, and career documents — scoped
              professionally with transparent pricing.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/request" size="lg" icon>
                Request a service
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                Product pricing
              </Button>
            </div>
          </motion.div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-white/8 pt-8">
            {categories.map(([key, cat]) => (
              <a
                key={key}
                href={`#${key}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-300"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          {services.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
              <p className="font-display text-xl font-semibold text-white">Services updating</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                The catalogue is refreshing. In the meantime, send a brief and we&apos;ll recommend
                the right engagement.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/contact#quote" icon>
                  Send a brief
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-20">
              {categories.map(([key, cat]) => {
                const Icon = iconMap[cat.icon] ?? Code2
                const categoryServices = services.filter((s) => s.category === key)
                if (categoryServices.length === 0) return null
                return (
                  <div key={key} id={key} className="scroll-mt-24">
                    <div className="mb-8 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-bold text-white">{cat.label}</h2>
                        <p className="mt-1 text-slate-400">{cat.description}</p>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryServices.map((service) => (
                        <Card
                          key={service.slug}
                          title={service.name}
                          description={service.description}
                          tag={
                            service.startingPrice != null && service.startingPrice > 0
                              ? `From KES ${service.startingPrice.toLocaleString()}`
                              : undefined
                          }
                          href={`/services/${service.slug}`}
                          image={serviceImage(service)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <ProcessSection />

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <CtaPanel
            eyebrow="Not sure which service fits?"
            title="Describe the outcome — we'll scope the work"
            description="Send a short brief and we'll recommend the right service and price. Replies within a few hours, 24/7."
            primary={{ label: 'Send a brief', href: '/contact#quote' }}
            secondary={{ label: 'WhatsApp us', href: waHref, external: true }}
          />
        </div>
      </section>
    </>
  )
}

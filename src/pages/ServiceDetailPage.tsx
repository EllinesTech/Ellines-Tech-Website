import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { PageLoading } from '@/components/ui/PageLoading'
import { ProcessSection } from '@/components/home/ProcessSection'
import { serviceCategories } from '@/data/services'
import { siteConfig } from '@/data/site'
import {
  loadPublishedServices,
  loadServiceBySlug,
  serviceImage,
  type CatalogService,
} from '@/lib/servicesCatalog'

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<CatalogService | null | undefined>(undefined)
  const [related, setRelated] = useState<CatalogService[]>([])

  useEffect(() => {
    if (!slug) {
      setService(null)
      return
    }
    let cancelled = false
    void (async () => {
      const found = await loadServiceBySlug(slug)
      if (cancelled) return
      if (!found || found.status === 'draft') {
        setService(null)
        return
      }
      setService(found)
      const all = await loadPublishedServices()
      if (cancelled) return
      setRelated(
        all
          .filter((s) => s.category === found.category && s.slug !== found.slug)
          .slice(0, 3),
      )
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (service === undefined) {
    return <PageLoading label="Loading service…" />
  }

  if (!service) {
    return <Navigate to="/services" replace />
  }

  const category = serviceCategories[service.category] || serviceCategories.consulting
  const scene = serviceImage(service)

  return (
    <>
      <SEO
        title={service.name}
        description={service.description}
        path={`/services/${service.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        jsonLd={{
          '@type': 'Service',
          name: service.name,
          description: service.description,
          provider: { '@id': `${siteConfig.url}/#organization` },
          areaServed: ['KE', 'Africa'],
          url: `${siteConfig.url}/services/${service.slug}`,
          serviceType: category.label,
          ...(service.startingPrice != null && service.startingPrice > 0
            ? {
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'KES',
                  price: service.startingPrice,
                  availability: 'https://schema.org/InStock',
                },
              }
            : {}),
        }}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={scene}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="section-container relative py-16 sm:py-20 lg:py-24">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: service.name },
            ]}
          />
          <Link
            to="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-brand-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
          <span className="inline-flex rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-200 ring-1 ring-brand-400/25">
            {category.label}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
            {service.description}
          </p>
          {service.startingPrice != null && service.startingPrice > 0 ? (
            <p className="mt-3 text-sm font-medium text-brand-200">
              From KES {service.startingPrice.toLocaleString()}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/request?intent=request&service=${service.slug}`} icon>
              Request this service
            </Button>
            <Button
              href={
                service.pricingGroupId
                  ? `/pricing?group=${encodeURIComponent(service.pricingGroupId)}`
                  : '/pricing'
              }
              variant="secondary"
            >
              View pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl font-bold text-white">What’s included</h2>
              <p className="mt-3 max-w-xl text-slate-400">
                Practical deliverables under {category.label.toLowerCase()} — scoped to your goals
                and executed from idea to handoff.
              </p>
              <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
                {service.offerings.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-t border-white/8 py-4 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                  >
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-400" />
                    <span className="text-sm leading-relaxed text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
                  Why Ellines Tech
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">
                  {category.description}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  We execute meticulously from start to finish — clear communication, modern
                  tooling, and outcomes aligned with your vision.
                </p>
                <dl className="mt-6 divide-y divide-white/8 border-y border-white/8 text-sm">
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Based in
                    </dt>
                    <dd className="text-slate-200">{siteConfig.address}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Availability
                    </dt>
                    <dd className="text-slate-200">{siteConfig.hours.label} · 24/7</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Direct line
                    </dt>
                    <dd>
                      <a
                        href={`tel:${siteConfig.phones[0].replace(/\s/g, '')}`}
                        className="text-slate-200 transition-colors hover:text-brand-300"
                      >
                        {siteConfig.phones[0]}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button href={`/request?intent=request&service=${service.slug}`} icon>
                    Start this service
                  </Button>
                  <Button href="/contact#quote" variant="secondary">
                    Ask a question
                  </Button>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
                    Related
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-white">
                    More in {category.label}
                  </h2>
                </div>
                <Link
                  to="/services"
                  className="hidden items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200 sm:inline-flex"
                >
                  All services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Card
                    key={item.slug}
                    title={item.name}
                    description={item.description}
                    href={`/services/${item.slug}`}
                    image={serviceImage(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <ProcessSection ctaHref={`/request?intent=request&service=${service.slug}`} />
    </>
  )
}

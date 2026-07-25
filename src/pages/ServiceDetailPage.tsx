import { useParams, Link, Navigate } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  getServiceBySlug,
  serviceCategories,
  services,
} from '@/data/services'
import { siteConfig } from '@/data/site'

const categoryScenes: Record<string, string> = {
  design: siteConfig.media.scenes.webDesign,
  development: siteConfig.media.scenes.serviceTech,
  ai: siteConfig.media.scenes.aiVisual,
  marketing: siteConfig.media.scenes.growth,
  security: siteConfig.media.scenes.uiDesign,
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? getServiceBySlug(slug) : undefined

  if (!service) {
    return <Navigate to="/services" replace />
  }

  const category = serviceCategories[service.category]
  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3)
  const scene = categoryScenes[service.category] ?? siteConfig.media.scenes.heroTech

  return (
    <>
      <SEO
        title={service.name}
        description={service.description}
        path={`/services/${service.slug}`}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img src={scene} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/55" />
        <div className="section-container relative py-16 sm:py-20 lg:py-24">
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
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/request?intent=request&service=${service.slug}`} icon>
              Request this service
            </Button>
            <Button href="/pricing" variant="secondary">
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
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {service.offerings.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-surface-elevated/40 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
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
                <div className="mt-6 space-y-2 text-sm text-slate-400">
                  <p>
                    Motto:{' '}
                    <span className="font-medium text-slate-200">{siteConfig.motto}</span>
                  </p>
                  <p>
                    Based in {siteConfig.address} · {siteConfig.phones[0]}
                  </p>
                </div>
                <Button href={`/request?intent=request&service=${service.slug}`} className="mt-8 w-full sm:w-auto" icon>
                  Start this service
                </Button>
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
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

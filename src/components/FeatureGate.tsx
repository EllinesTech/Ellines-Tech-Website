import { Link } from 'react-router-dom'
import { useSiteFeatures } from '@/context/SiteFeaturesContext'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/SEO'

export function FeatureGate({
  feature,
  children,
  title = 'Not available',
  description = 'This section of the site is temporarily unavailable.',
}: {
  feature: keyof ReturnType<typeof useSiteFeatures>['settings']
  children: React.ReactNode
  title?: string
  description?: string
}) {
  const { settings, loading } = useSiteFeatures()
  const enabled = Boolean(settings[feature])

  if (loading) {
    return (
      <section className="section-padding">
        <div className="section-container max-w-lg text-center">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </section>
    )
  }

  if (!enabled) {
    return (
      <>
        <SEO title={title} description={description} />
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 mesh-bg opacity-50" />
          <div className="pointer-events-none absolute inset-0 hero-grid" />
          <div className="section-container relative flex min-h-[60vh] flex-col justify-center py-20">
            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                Ellines Tech
              </p>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-400">{description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/" icon>
                  Back home
                </Button>
                {settings.contactEnabled && feature !== 'contactEnabled' && (
                  <Button href="/contact" variant="secondary">
                    Contact us
                  </Button>
                )}
              </div>
              <p className="mt-8 text-sm text-slate-500">
                Looking for something else?{' '}
                <Link to="/about" className="text-brand-300 hover:text-brand-200">
                  Learn about Ellines Tech
                </Link>
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return <>{children}</>
}

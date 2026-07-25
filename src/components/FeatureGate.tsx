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
        <section className="section-padding">
          <div className="section-container max-w-lg text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              Ellines Tech
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white">{title}</h1>
            <p className="mt-3 text-slate-400">{description}</p>
            <div className="mt-8 flex justify-center gap-3">
              <Button href="/" variant="secondary">
                Back home
              </Button>
              {settings.contactEnabled && feature !== 'contactEnabled' && (
                <Button href="/contact" variant="outline">
                  Contact us
                </Button>
              )}
            </div>
            <p className="mt-6 text-xs text-slate-600">
              Looking for something else?{' '}
              <Link to="/about" className="text-brand-300 hover:underline">
                Learn about Ellines Tech
              </Link>
            </p>
          </div>
        </section>
      </>
    )
  }

  return <>{children}</>
}

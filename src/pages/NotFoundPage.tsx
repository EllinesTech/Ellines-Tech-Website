import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noindex
      />
      <section className="section-padding">
        <div className="section-container text-center">
          <p className="font-display text-8xl font-bold text-brand-500/30">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white">Page Not Found</h1>
          <p className="mt-2 text-slate-400">The page you're looking for doesn't exist or has been moved.</p>
          <Button href="/" className="mt-8" icon>Back to Home</Button>
        </div>
      </section>
    </>
  )
}

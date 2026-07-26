import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/data/site'

const suggestions = [
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist on Ellines Tech."
        noindex
      />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-60" />
        <div className="pointer-events-none absolute inset-0 hero-grid" />
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-500/12 blur-[100px]" />
        <div className="section-container relative flex min-h-[70vh] flex-col justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="font-display text-[6rem] font-extrabold leading-none tracking-[-0.05em] text-gradient sm:text-[8rem]">
              404
            </p>
            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              This page doesn&apos;t exist
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              The link may be outdated or the page has moved. Here&apos;s where most people go next
              — or reach {siteConfig.name} directly.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/" size="lg" icon>
                Back to home
              </Button>
              <Button href="/contact#quote" variant="secondary" size="lg">
                Send a brief
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

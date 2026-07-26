import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { PageLoading } from '@/components/ui/PageLoading'
import { productCategories } from '@/data/products'
import { productVisual } from '@/data/imagery'
import { siteConfig } from '@/data/site'
import { loadProductBySlug, type CatalogProduct } from '@/lib/productsCatalog'
import { cn } from '@/lib/utils'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<CatalogProduct | null | undefined>(undefined)
  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`

  useEffect(() => {
    if (!slug) {
      setProduct(null)
      return
    }
    let cancelled = false
    void loadProductBySlug(slug).then((found) => {
      if (cancelled) return
      if (!found || found.status === 'draft') setProduct(null)
      else setProduct(found)
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (product === undefined) {
    return <PageLoading label="Loading product…" />
  }

  if (!product) {
    return <Navigate to="/products" replace />
  }

  const category = productCategories[product.category]
  const visual = productVisual(product)

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        path={`/products/${product.slug}`}
        image={visual.src}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
        jsonLd={{
          '@type': 'SoftwareApplication',
          name: product.name,
          description: product.description,
          applicationCategory: category?.label || product.category,
          operatingSystem: 'Web',
          url: `${siteConfig.url}/products/${product.slug}`,
          image: visual.src.startsWith('http') ? visual.src : `${siteConfig.url}${visual.src}`,
          provider: { '@id': `${siteConfig.url}/#organization` },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'KES',
            availability: 'https://schema.org/InStock',
            url: `${siteConfig.url}/contact`,
          },
        }}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-brand-500/12 blur-[110px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-sky-600/10 blur-[110px]" />

        <div className="section-container relative py-16 sm:py-20 lg:py-24">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.name },
            ]}
          />
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brand-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
                {category?.label || product.category}
              </p>
              <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
                {product.name}
              </h1>
              <p className="mt-4 font-display text-xl text-gradient sm:text-2xl">
                {product.tagline}
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
                {product.description}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Request a demo
                </Button>
                <Button href={waHref} variant="secondary" size="lg" external>
                  Talk to sales
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/20 via-transparent to-sky-700/15 blur-2xl" />
              <div
                className={cn(
                  'relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/40',
                  visual.fit === 'contain' &&
                    'flex items-center justify-center bg-gradient-to-br from-slate-900 via-surface to-slate-950 p-10',
                )}
              >
                {visual.fit === 'contain' ? (
                  <img
                    src={visual.src}
                    alt={product.name}
                    className="max-h-64 w-auto object-contain"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <img
                      src={visual.src}
                      alt={product.name}
                      className="aspect-[3/2] h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {product.highlights && product.highlights.length > 0 && (
        <section className="border-b border-white/5 bg-surface/40">
          <div className="section-container py-10 sm:py-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {product.highlights.map((highlight, i) => (
                <motion.p
                  key={highlight}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="border-l border-brand-400/30 pl-4 font-display text-sm font-semibold leading-snug text-white"
                >
                  {highlight}
                </motion.p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Key features
              </h2>
              <p className="mt-3 text-slate-400">
                What ships with {product.name} — configured to your operation during onboarding.
              </p>
            </div>
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 border-t border-white/8 py-4 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                >
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-400" />
                  <span className="text-sm leading-relaxed text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <CtaPanel
            eyebrow="Next step"
            title={`See ${product.name} running on your data`}
            description="We'll walk you through a live environment, answer implementation questions, and scope what rollout looks like for your team."
            primary={{ label: 'Book a walkthrough', href: '/contact#quote' }}
            secondary={{ label: 'Browse all products', href: '/products' }}
          />
        </div>
      </section>
    </>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { productCategories, type ProductCategory } from '@/data/products'
import { productVisual } from '@/data/imagery'
import { siteConfig } from '@/data/site'
import {
  loadPublishedProducts,
  staticProductsAsCatalog,
  type CatalogProduct,
} from '@/lib/productsCatalog'

export function ProductsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>(() => staticProductsAsCatalog())
  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`
  const categories = Object.entries(productCategories) as [
    ProductCategory,
    (typeof productCategories)[ProductCategory],
  ][]

  useEffect(() => {
    void loadPublishedProducts().then(setProducts)
  }, [])

  return (
    <>
      <SEO
        title="Products"
        description="Explore Ellines Tech products — MedFlow, AfyaVox, RV22, ERP systems, and more for healthcare, business, and AI."
        path="/products"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.heroTech}
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
              Products
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
              Every product,
              <span className="mt-1 block text-gradient">one ecosystem</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Each Ellines Tech product runs on its own dedicated platform — built for scale,
              security, and the realities of African markets.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/request" size="lg" icon>
                Request a demo
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                View pricing
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
          {products.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
              <p className="font-display text-xl font-semibold text-white">Products updating</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                The product catalogue is refreshing. Book a walkthrough and we&apos;ll show you the
                right platform live.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/contact#quote" icon>
                  Book a demo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-20">
              {categories.map(([key, cat]) => {
                const categoryProducts = products.filter((p) => p.category === key)
                if (!categoryProducts.length) return null
                return (
                  <div key={key} id={key} className="scroll-mt-28">
                    <div className="mb-8 border-t border-white/10 pt-7">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                          {cat.label}
                        </h2>
                        <span className="font-mono text-[11px] tabular-nums tracking-[0.1em] text-slate-600">
                          {String(categoryProducts.length).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-2 max-w-2xl text-slate-400">{cat.description}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryProducts.map((product) => {
                        const visual = productVisual(product)
                        return (
                          <Card
                            key={product.slug}
                            title={product.name}
                            description={product.tagline}
                            href={`/products/${product.slug}`}
                            tag={product.highlights?.[0]}
                            image={visual.src}
                            imageFit={visual.fit}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <CtaPanel
            eyebrow="See it working"
            title="Book a walkthrough of any product"
            description="We run live demos 24/7 — see the platform with your own workflows before you commit to anything."
            primary={{ label: 'Book a demo', href: '/contact#quote' }}
            secondary={{ label: 'WhatsApp us', href: waHref, external: true }}
          />
        </div>
      </section>
    </>
  )
}

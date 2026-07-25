import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { fetchShop } from '@/lib/cmsApi'
import { loadAuthUser } from '@/lib/auth'
import { starterPricingPackages, type PricingPackage } from '@/data/pricingPackages'

export function PricingPage() {
  const [products, setProducts] = useState<PricingPackage[]>([])
  const [error, setError] = useState('')
  const user = loadAuthUser()

  useEffect(() => {
    fetchShop()
      .then((list) => {
        const published = (list as PricingPackage[]).filter((p) => p.status === 'published')
        setProducts(published.length ? published : starterPricingPackages.filter((p) => p.status === 'published'))
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Could not load pricing')
        setProducts(starterPricingPackages.filter((p) => p.status === 'published'))
      })
  }, [])

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <>
      <SEO
        title="Product Pricing"
        description="Transparent product pricing for Ellines Tech packages — websites, design, software, AI, and support."
        path="/pricing"
      />
      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Product pricing"
            title="Packages & starting prices"
            description="Clear starting prices for common IT packages. Need something custom? Enquire and we’ll scope a fit."
            align="center"
            className="mb-12"
          />
          {error && <p className="mb-6 text-center text-sm text-amber-200">{error}</p>}
          {!user && (
            <p className="mb-8 text-center text-sm text-slate-400">
              <Link to="/account" className="font-semibold text-brand-300">
                Create an account
              </Link>{' '}
              to save packages when checkout goes live.
            </p>
          )}

          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="mb-5 font-display text-lg font-semibold text-brand-300">{category}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products
                  .filter((p) => p.category === category)
                  .map((p) => (
                    <article
                      key={p.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                      <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                      <p className="mt-3 text-sm text-slate-400">{p.description}</p>
                      <p className="mt-6 text-lg font-semibold text-white">
                        From {p.currency} {Number(p.price).toLocaleString()}
                      </p>
                      <Button href="/contact#quote" className="mt-4" variant="secondary">
                        Enquire
                      </Button>
                    </article>
                  ))}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p className="text-center text-slate-400">
              Pricing is being updated. Contact us for a custom quote.
            </p>
          )}
        </div>
      </section>
    </>
  )
}

/** @deprecated use PricingPage — kept for route alias */
export const ShopPage = PricingPage

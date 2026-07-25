import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { fetchShop } from '@/lib/cmsApi'
import { loadAuthUser } from '@/lib/auth'
import { starterPricingPackages, retiredPricingIds, type PricingPackage } from '@/data/pricingPackages'

export function PricingPage() {
  const [products, setProducts] = useState<PricingPackage[]>([])
  const [error, setError] = useState('')
  const user = loadAuthUser()

  useEffect(() => {
    const retired = new Set<string>(retiredPricingIds)
    fetchShop()
      .then((list) => {
        const published = (list as PricingPackage[]).filter(
          (p) =>
            p.status === 'published' &&
            !retired.has(p.id) &&
            !String(p.name || '').toLowerCase().includes('hosting'),
        )
        setProducts(
          published.length
            ? published
            : starterPricingPackages.filter((p) => p.status === 'published'),
        )
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
        description="Transparent product pricing for Ellines Tech packages — websites, design, software, AI, career documents, and more."
        path="/pricing"
      />
      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Product pricing"
            title="Packages & starting prices"
            description="Clear Kenya-market starting prices. Request a package or buy through our professional intake — we confirm scope, then share payment details."
            align="center"
            className="mb-8"
          />
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <Button href="/request?intent=buy" icon>
              Buy a package
            </Button>
            <Button href="/request?intent=quote" variant="secondary">
              Custom quote
            </Button>
          </div>
          {error && <p className="mb-6 text-center text-sm text-amber-200">{error}</p>}
          {!user && (
            <p className="mb-8 text-center text-sm text-slate-400">
              <Link to="/account" className="font-semibold text-brand-300">
                Create an account
              </Link>{' '}
              to save packages when checkout expands.
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
                      className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                      <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                      <p className="mt-3 flex-1 text-sm text-slate-400">{p.description}</p>
                      <p className="mt-6 text-lg font-semibold text-white">
                        From {p.currency} {Number(p.price).toLocaleString()}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          href={`/request?intent=buy&package=${encodeURIComponent(p.id)}`}
                          size="sm"
                        >
                          Buy / request
                        </Button>
                        <Button href="/contact#quote" size="sm" variant="ghost">
                          Ask a question
                        </Button>
                      </div>
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

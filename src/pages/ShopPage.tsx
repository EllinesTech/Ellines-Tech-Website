import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { fetchShop } from '@/lib/cmsApi'
import { loadAuthUser } from '@/lib/auth'
import { starterPricingPackages, retiredPricingIds, type PricingPackage } from '@/data/pricingPackages'
import { posterForPackage } from '@/data/posterMap'

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
            <Button href="/account" variant="ghost">
              Client login
            </Button>
          </div>
          {error && <p className="mb-6 text-center text-sm text-amber-200">{error}</p>}
          {!user && (
            <p className="mb-8 text-center text-sm text-slate-400">
              <Link to="/account" className="font-semibold text-brand-300">
                Create a client account
              </Link>{' '}
              to track packages, requests, and invoices.
            </p>
          )}

          {categories.map((category) => (
            <div key={category} className="mb-14">
              <h2 className="mb-6 font-display text-lg font-semibold tracking-wide text-brand-300">
                {category}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products
                  .filter((p) => p.category === category)
                  .map((p) => {
                    const poster = posterForPackage(p)
                    return (
                      <article
                        key={p.id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.1] to-surface-elevated/90 shadow-[0_22px_55px_-28px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/45 hover:shadow-[0_28px_60px_-22px_rgba(34,211,238,0.3)]"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                          <img
                            src={poster}
                            alt={`${p.name} — package preview`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            loading="lazy"
                            onError={(e) => {
                              const el = e.currentTarget
                              if (el.dataset.fallback === '1') return
                              el.dataset.fallback = '1'
                              el.src = posterForPackage({
                                ...p,
                                id: undefined,
                                image: undefined,
                              })
                            }}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/10" />
                          <img
                            src="/logos/logo-mark-nav.png"
                            alt=""
                            width={36}
                            height={36}
                            className="absolute right-3 top-3 h-9 w-9 rounded-lg border border-white/15 bg-slate-950/75 object-contain p-1 shadow-lg backdrop-blur-md sm:right-4 sm:top-4"
                          />
                          <span className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200 backdrop-blur-md sm:left-4">
                            {p.category}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <h3 className="font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand-200 sm:text-xl">
                            {p.name}
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                            {p.description}
                          </p>
                          <div className="mt-5 border-t border-white/12 pt-4">
                            <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
                              <span className="mr-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                                From
                              </span>
                              <span className="text-brand-200">{p.currency}</span>{' '}
                              {Number(p.price).toLocaleString()}
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
                          </div>
                        </div>
                      </article>
                    )
                  })}
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

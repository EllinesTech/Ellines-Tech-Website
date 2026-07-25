import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { fetchShop } from '@/lib/cmsApi'
import { loadAuthUser } from '@/lib/auth'

type ShopProduct = {
  id: string
  name: string
  price: number
  currency: string
  category: string
  description: string
  status: string
}

export function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [error, setError] = useState('')
  const user = loadAuthUser()

  useEffect(() => {
    fetchShop()
      .then((list) =>
        setProducts((list as ShopProduct[]).filter((p) => p.status === 'published')),
      )
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load shop'))
  }, [])

  const show = products

  return (
    <>
      <SEO
        title="Shop"
        description="IT packages and digital products from Ellines Tech — websites, identity, and starter kits."
        path="/shop"
      />
      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Shop"
            title="IT packages & digital kits"
            description="Buy ready packages for websites, branding, and digital starter work. Full checkout expands next — create an account to get early access."
            align="center"
            className="mb-12"
          />
          {error && <p className="mb-6 text-center text-sm text-amber-200">{error}</p>}
          {!user && (
            <p className="mb-8 text-center text-sm text-slate-400">
              <Link to="/account" className="font-semibold text-brand-300">
                Sign in or create an account
              </Link>{' '}
              to save purchases when checkout goes live.
            </p>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {show.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                  {p.category}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-white">{p.name}</h2>
                <p className="mt-3 text-sm text-slate-400">{p.description}</p>
                <p className="mt-6 text-lg font-semibold text-white">
                  {p.currency} {p.price.toLocaleString()}
                </p>
                <Button href="/contact" className="mt-4" variant="secondary">
                  Enquire
                </Button>
              </article>
            ))}
          </div>
          {show.length === 0 && (
            <p className="text-center text-slate-400">
              Packages are being prepared. Contact us for a custom quote.
            </p>
          )}
        </div>
      </section>
    </>
  )
}

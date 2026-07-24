import { useParams, Link, Navigate } from 'react-router-dom'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { getProductBySlug, productCategories } from '@/data/products'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : undefined

  if (!product) {
    return <Navigate to="/products" replace />
  }

  const category = productCategories[product.category]

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        path={`/products/${product.slug}`}
      />

      <section className="section-padding">
        <div className="section-container">
          <Link
            to="/products"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brand-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
                {category.label}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-2 text-xl text-brand-300">{product.tagline}</p>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">{product.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/contact#quote" icon>Request a Demo</Button>
                <Button href="/contact" variant="secondary">Contact Sales</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-8">
              <h2 className="font-display text-xl font-semibold text-white">Key Features</h2>
              <ul className="mt-6 space-y-4">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

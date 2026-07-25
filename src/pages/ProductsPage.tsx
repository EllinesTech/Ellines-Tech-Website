import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { products, productCategories, type ProductCategory } from '@/data/products'

export function ProductsPage() {
  const categories = Object.entries(productCategories) as [ProductCategory, typeof productCategories[ProductCategory]][]

  return (
    <>
      <SEO title="Products" description="Explore Ellines Tech products — MedFlow, AfyaVox, RV22, ERP systems, and more." path="/products" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Products"
            title="Every Product, One Ecosystem"
            description="Each Ellines Tech product has its own dedicated platform — built for scale, security, and African market needs."
            align="center"
            className="mb-16"
          />

          <div className="space-y-20">
            {categories.map(([key, cat]) => {
              const categoryProducts = products.filter((p) => p.category === key)
              return (
                <div key={key} id={key} className="scroll-mt-24">
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold text-white">{cat.label}</h2>
                    <p className="mt-1 text-slate-400">{cat.description}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map((product) => (
                      <Card
                        key={product.slug}
                        title={product.name}
                        description={product.tagline}
                        href={`/products/${product.slug}`}
                        tag={product.highlights?.[0]}
                        image={product.image}
                        imageFit={product.imageFit}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

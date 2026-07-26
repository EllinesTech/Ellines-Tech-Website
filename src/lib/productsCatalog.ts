import { products, type Product, type ProductCategory } from '@/data/products'
import { fetchCmsProduct, fetchCmsProducts, type CmsProduct } from '@/lib/cmsApi'

export type CatalogProduct = Product & {
  id: string
  status: 'published' | 'draft'
}

export function staticProductsAsCatalog(): CatalogProduct[] {
  return products.map((p) => ({
    id: `prod_${p.slug.replace(/-/g, '_')}`,
    ...p,
    status: 'published' as const,
  }))
}

function normalize(raw: CmsProduct): CatalogProduct {
  return {
    id: raw.id || `prod_${raw.slug}`,
    slug: raw.slug,
    name: raw.name,
    category: (raw.category || 'digital') as ProductCategory,
    tagline: raw.tagline || '',
    description: raw.description || '',
    features: Array.isArray(raw.features) ? raw.features : [],
    highlights: raw.highlights?.length ? raw.highlights : undefined,
    image: raw.image || undefined,
    imageFit: raw.imageFit === 'contain' ? 'contain' : 'cover',
    status: raw.status === 'draft' ? 'draft' : 'published',
  }
}

export async function loadPublishedProducts(): Promise<CatalogProduct[]> {
  try {
    const list = await fetchCmsProducts(true)
    if (Array.isArray(list) && list.length > 0) return list.map(normalize)
  } catch {
    /* offline */
  }
  return staticProductsAsCatalog()
}

export async function loadAdminProducts(): Promise<CatalogProduct[]> {
  try {
    const list = await fetchCmsProducts(false)
    if (Array.isArray(list) && list.length > 0) return list.map(normalize)
  } catch {
    /* fall through */
  }
  return staticProductsAsCatalog()
}

export async function loadProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  try {
    const p = await fetchCmsProduct(slug)
    if (p) return normalize(p)
  } catch {
    /* fall through */
  }
  return staticProductsAsCatalog().find((p) => p.slug === slug)
}

import { services, type Service, type ServiceCategory } from '@/data/services'
import { servicePosterMap } from '@/data/posterMap'
import { fetchService, fetchServices, type CmsService } from '@/lib/cmsApi'

export type CatalogService = Service & {
  id: string
  image?: string
  startingPrice?: number | null
  pricingGroupId?: string
  status: 'published' | 'draft'
}

export function staticServicesAsCatalog(): CatalogService[] {
  return services.map((s) => ({
    id: `svc_${s.slug.replace(/-/g, '_')}`,
    ...s,
    image: servicePosterMap[s.slug] || '',
    startingPrice: null,
    pricingGroupId: '',
    status: 'published' as const,
  }))
}

function normalize(raw: CmsService): CatalogService {
  const category = (raw.category || 'consulting') as ServiceCategory
  return {
    id: raw.id || `svc_${raw.slug}`,
    slug: raw.slug,
    name: raw.name,
    category,
    description: raw.description || '',
    offerings: Array.isArray(raw.offerings) ? raw.offerings : [],
    image: raw.image || servicePosterMap[raw.slug] || '',
    startingPrice: raw.startingPrice ?? null,
    pricingGroupId: raw.pricingGroupId || '',
    status: raw.status === 'draft' ? 'draft' : 'published',
  }
}

/** Public catalogue — CMS when available, otherwise static defaults. */
export async function loadPublishedServices(): Promise<CatalogService[]> {
  try {
    const list = await fetchServices(true)
    if (Array.isArray(list) && list.length > 0) return list.map(normalize)
  } catch {
    /* offline / local without Functions */
  }
  return staticServicesAsCatalog()
}

/** Admin catalogue including drafts. */
export async function loadAdminServices(): Promise<CatalogService[]> {
  try {
    const list = await fetchServices(false)
    if (Array.isArray(list) && list.length > 0) return list.map(normalize)
  } catch {
    /* fall through */
  }
  return staticServicesAsCatalog()
}

export async function loadServiceBySlug(slug: string): Promise<CatalogService | undefined> {
  try {
    const s = await fetchService(slug)
    if (s) return normalize(s)
  } catch {
    /* fall through */
  }
  return staticServicesAsCatalog().find((s) => s.slug === slug)
}

export function serviceImage(service: CatalogService): string {
  // Prefer the canonical per-slug map so stale CMS seeds cannot reintroduce shared posters.
  return (
    servicePosterMap[service.slug] ||
    service.image ||
    '/media/posters/packages/shop_starter_web.jpg'
  )
}

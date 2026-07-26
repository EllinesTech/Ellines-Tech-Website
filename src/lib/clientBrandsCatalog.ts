import { clientBrands as defaultBrands, type ClientBrand } from '@/data/clients'
import { fetchSiteCopy, saveSiteCopy } from '@/lib/cmsApi'

export type CatalogClientBrand = ClientBrand

export function staticClientBrands(): CatalogClientBrand[] {
  return defaultBrands.map((b) => ({ ...b }))
}

function normalize(raw: Partial<ClientBrand> & { id?: string; name?: string }): CatalogClientBrand | null {
  if (!raw?.name) return null
  const id =
    raw.id ||
    String(raw.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  return {
    id,
    name: String(raw.name),
    logo: String(raw.logo || '/client-logos/ellines-consultancy.png'),
    category: (raw.category || 'services') as ClientBrand['category'],
    work: String(raw.work || ''),
  }
}

export async function loadClientBrands(): Promise<CatalogClientBrand[]> {
  try {
    const copy = (await fetchSiteCopy()) as { clientBrands?: unknown[] }
    if (Array.isArray(copy.clientBrands) && copy.clientBrands.length) {
      return copy.clientBrands
        .map((b) => normalize(b as Partial<ClientBrand>))
        .filter((b): b is CatalogClientBrand => Boolean(b))
    }
  } catch {
    /* offline */
  }
  return staticClientBrands()
}

export async function saveClientBrands(brands: CatalogClientBrand[]) {
  const copy = await fetchSiteCopy()
  return saveSiteCopy({
    ...copy,
    clientBrands: brands.map((b) => ({
      id: b.id,
      name: b.name,
      logo: b.logo,
      category: b.category,
      work: b.work,
    })),
  })
}

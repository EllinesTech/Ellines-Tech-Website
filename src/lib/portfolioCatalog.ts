import {
  portfolioProjects,
  type PortfolioCategory,
  type PortfolioProject,
} from '@/data/portfolio'
import { fetchPortfolio, type CmsPortfolioProject } from '@/lib/cmsApi'

export type CatalogProject = PortfolioProject & {
  id: string
  status: 'published' | 'draft'
}

export function staticPortfolioAsCatalog(): CatalogProject[] {
  return portfolioProjects.map((p) => ({
    id: `pf_${p.slug.replace(/-/g, '_')}`,
    ...p,
    status: 'published' as const,
  }))
}

function normalize(raw: CmsPortfolioProject): CatalogProject {
  return {
    id: raw.id || `pf_${raw.slug}`,
    slug: raw.slug,
    name: raw.name,
    category: (raw.category || 'web') as PortfolioCategory,
    client: raw.client || undefined,
    description: raw.description || '',
    technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
    results: raw.results?.length ? raw.results : undefined,
    logo: raw.logo || undefined,
    image: raw.image || undefined,
    status: raw.status === 'draft' ? 'draft' : 'published',
  }
}

export async function loadPublishedPortfolio(): Promise<CatalogProject[]> {
  try {
    const list = await fetchPortfolio(true)
    if (Array.isArray(list) && list.length > 0) {
      return list.filter((p) => p.status !== 'draft').map(normalize)
    }
  } catch {
    /* offline */
  }
  return staticPortfolioAsCatalog()
}

export async function loadAdminPortfolio(): Promise<CatalogProject[]> {
  try {
    const list = await fetchPortfolio(false)
    if (Array.isArray(list) && list.length > 0) return list.map(normalize)
  } catch {
    /* fall through */
  }
  return staticPortfolioAsCatalog()
}

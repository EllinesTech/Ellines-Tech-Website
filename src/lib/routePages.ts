import { fetchPages, type CmsPage } from '@/lib/cmsApi'
import { normalizeRoutePath } from '@/data/sitePages'
import { isAdminAuthed } from '@/lib/engagementStore'

let cache: Promise<CmsPage[]> | null = null
let cachedForAdmin = false

function onlyRoutePages(list: CmsPage[]) {
  return list.filter((p) => Boolean(normalizeRoutePath(p.path)))
}

async function load(admin: boolean): Promise<CmsPage[]> {
  if (admin) {
    try {
      return onlyRoutePages(await fetchPages(false))
    } catch {
      /* admin key rejected — fall back to the public list */
    }
  }
  try {
    return onlyRoutePages(await fetchPages(true))
  } catch {
    return []
  }
}

/**
 * CMS content attached to real site routes. Admins also get drafts so an
 * unpublished page can be previewed before going live.
 */
export function loadPublishedRoutePages(): Promise<CmsPage[]> {
  const admin = isAdminAuthed()
  if (!cache || cachedForAdmin !== admin) {
    cachedForAdmin = admin
    cache = load(admin)
  }
  return cache
}

/** Call after saving/deleting a page so the public site picks up the change. */
export function clearRoutePagesCache() {
  cache = null
}

export function findRoutePage(pages: CmsPage[], path: string): CmsPage | undefined {
  const normalized = normalizeRoutePath(path)
  if (!normalized) return undefined
  return pages.find((p) => normalizeRoutePath(p.path) === normalized)
}

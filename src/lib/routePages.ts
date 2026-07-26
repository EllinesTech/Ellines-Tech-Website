import { fetchPages, type CmsPage } from '@/lib/cmsApi'
import { normalizeRoutePath } from '@/data/sitePages'
import { isAdminAuthed } from '@/lib/engagementStore'

let cache: Promise<CmsPage[]> | null = null
let cachedForAdmin = false

function loadRoutePages(includeDrafts: boolean): Promise<CmsPage[]> {
  return fetchPages(!includeDrafts)
    .then((list) => list.filter((p) => Boolean(normalizeRoutePath(p.path))))
    .catch(() => [])
}

/**
 * Published CMS content attached to real site routes. Admins additionally get
 * drafts so an unpublished page can be previewed before going live.
 */
export function loadPublishedRoutePages(): Promise<CmsPage[]> {
  const admin = isAdminAuthed()
  if (!cache || cachedForAdmin !== admin) {
    cachedForAdmin = admin
    cache = admin
      ? loadRoutePages(true).then((list) => (list.length ? list : loadRoutePages(false)))
      : loadRoutePages(false)
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

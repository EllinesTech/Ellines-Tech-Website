const ADMIN_KEY = () =>
  (typeof localStorage !== 'undefined' && localStorage.getItem('et_admin_api_key')) ||
  'EllinesGodMode2026'

async function cmsFetch(params: string, init?: RequestInit) {
  const res = await fetch(`/api/cms?${params}`, init)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'CMS request failed')
  return data
}

export type CmsPage = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  status: 'draft' | 'published'
  seoTitle: string
  seoDescription: string
  updatedAt: string
  createdAt: string
}

export type CmsUser = {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'customer'
  createdAt: string
}

export async function fetchPages(publishedOnly = false): Promise<CmsPage[]> {
  const data = await cmsFetch(`resource=pages${publishedOnly ? '&published=1' : ''}`)
  return data.pages || []
}

export async function fetchPage(slug: string): Promise<CmsPage> {
  const data = await cmsFetch(`resource=pages&slug=${encodeURIComponent(slug)}`)
  return data.page
}

export async function savePage(page: Partial<CmsPage>) {
  return cmsFetch('resource=pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'save_page', page }),
  })
}

export async function deletePage(id: string, slug?: string) {
  return cmsFetch('resource=pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'delete_page', id, slug }),
  })
}

export async function fetchSiteCopy() {
  const data = await cmsFetch('resource=site-copy')
  return data.siteCopy
}

export async function saveSiteCopy(siteCopy: unknown) {
  return cmsFetch('resource=site-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'save_site_copy', siteCopy }),
  })
}

export async function fetchActivity() {
  const data = await cmsFetch('resource=activity')
  return data.activity || []
}

export async function fetchLeads() {
  const data = await cmsFetch('resource=leads')
  return data.leads || []
}

export async function fetchUsers(): Promise<CmsUser[]> {
  const data = await cmsFetch('resource=users', {
    headers: { 'X-Admin-Key': ADMIN_KEY() },
  })
  return data.users || []
}

export async function updateUserRole(userId: string, role: CmsUser['role']) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'update_user_role', userId, role }),
  })
}

export async function createAdminUser(input: {
  email: string
  password: string
  name?: string
  role?: 'admin' | 'super_admin'
}) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'create_admin_user', ...input }),
  })
}

export async function fetchShop() {
  const data = await cmsFetch('resource=shop')
  return data.products || []
}

export async function saveShop(products: unknown[]) {
  return cmsFetch('resource=shop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'save_shop', products }),
  })
}

export async function fetchReviews() {
  const data = await cmsFetch('resource=reviews')
  return data.reviews || []
}

export async function saveReviews(reviews: unknown[]) {
  return cmsFetch('resource=reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'save_reviews', reviews }),
  })
}

export async function fetchNewsletter() {
  const data = await cmsFetch('resource=newsletter')
  return data.subscribers || []
}

export async function fetchNotifications() {
  const data = await cmsFetch('resource=notifications')
  return data.notifications || []
}

export async function fetchAnalytics() {
  const data = await cmsFetch('resource=analytics')
  return data.analytics
}

export async function backupCms() {
  return cmsFetch('resource=backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'backup' }),
  })
}

export async function restoreCms() {
  return cmsFetch('resource=backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() },
    body: JSON.stringify({ action: 'restore_latest' }),
  })
}

export async function registerCustomer(input: {
  email: string
  password: string
  name?: string
}) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'register', ...input }),
  })
}

export async function loginCustomer(input: { email: string; password: string }) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', ...input }),
  })
}

export async function trackVisit(path: string) {
  try {
    await cmsFetch('resource=analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'track_visit', path }),
    })
  } catch {
    /* ignore */
  }
}

export async function submitServiceRequest(input: {
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
  source?: string
  intent?: string
  budget?: string
  timeline?: string
  packageId?: string
  packageName?: string
  packagePrice?: string
  service?: string
}) {
  return cmsFetch('resource=leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'lead', ...input }),
  })
}

export async function subscribeNewsletter(email: string) {
  return cmsFetch('resource=newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'newsletter_subscribe', email }),
  })
}

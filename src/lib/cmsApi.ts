import { getAdminApiKey, isAdminAuthed } from '@/lib/engagementStore'
import { loadAuthToken } from '@/lib/auth'
import type { DownloadResource } from '@/data/downloads'
import type { SiteFeatureSettings } from '@/lib/siteFeatures'
import { defaultFeatureSettings } from '@/lib/siteFeatures'

function userHeaders(json = false): HeadersInit {
  const token = loadAuthToken() || ''
  return json
    ? { 'Content-Type': 'application/json', 'X-User-Token': token }
    : { 'X-User-Token': token }
}

/**
 * Sends whichever elevated credentials the browser holds. The server decides
 * what they unlock: an admin-panel session token or a `super_admin` user token
 * both resolve to God Mode, other staff tokens resolve to staff access.
 */
function elevatedHeaders(json = false): HeadersInit {
  const token = loadAuthToken() || ''
  const adminToken = getAdminApiKey()
  const base: Record<string, string> = {}
  if (json) base['Content-Type'] = 'application/json'
  if (isAdminAuthed() && adminToken) base['X-Admin-Key'] = adminToken
  if (token) base['X-User-Token'] = token
  return base
}

/** God Mode endpoints — same credentials, kept as a named alias for intent. */
const adminHeaders = elevatedHeaders

async function cmsFetch(params: string, init?: RequestInit) {
  let res: Response
  try {
    res = await fetch(`/api/cms?${params}`, init)
  } catch {
    throw new Error(
      'CMS API unreachable. Run `npm run preview:full` (or `npm run dev:api` with Vite) so /api/cms is available.',
    )
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (!data.error && (res.status === 500 || res.status === 502 || res.status === 503)) {
      throw new Error(
        'CMS API unreachable. Start Pages Functions with `npm run preview:full` or `npm run dev:api` (port 8788).',
      )
    }
    throw new Error(data.error || 'CMS request failed')
  }
  return data
}

export type CmsPage = {
  id: string
  slug: string
  /** Site route this record targets (e.g. `/about`). Empty for custom `/p/:slug` pages. */
  path?: string
  /** How route-backed content renders: below the built-in page, or instead of it. */
  mode?: 'append' | 'replace'
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
  role: 'super_admin' | 'admin' | 'staff' | 'customer'
  jobTitle?: string
  active?: boolean
  createdAt: string
}

export async function fetchPages(publishedOnly = false): Promise<CmsPage[]> {
  const data = await cmsFetch(
    `resource=pages${publishedOnly ? '&published=1' : ''}`,
    publishedOnly ? undefined : { headers: adminHeaders() },
  )
  return data.pages || []
}

/**
 * `preview` sends the elevated credentials so admins/staff can open drafts.
 * Public visitors keep getting 404 for anything unpublished.
 */
export async function fetchPage(slug: string, preview = false): Promise<CmsPage> {
  const data = await cmsFetch(
    `resource=pages&slug=${encodeURIComponent(slug)}`,
    preview ? { headers: elevatedHeaders() } : undefined,
  )
  return data.page
}

export async function savePage(page: Partial<CmsPage>): Promise<{ page: CmsPage }> {
  return cmsFetch('resource=pages', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'save_page', page }),
  })
}

/**
 * Opens a page for editing, creating a draft record when the slug/route has none yet.
 * This is what makes "edit a page that does not exist" work from the admin UI.
 */
export async function ensurePage(input: {
  path?: string
  slug?: string
  title?: string
  excerpt?: string
  body?: string
  mode?: CmsPage['mode']
}): Promise<{ page: CmsPage; created: boolean }> {
  const data = await cmsFetch('resource=pages', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'ensure_page', ...input }),
  })
  return { page: data.page as CmsPage, created: Boolean(data.created) }
}

export async function deletePage(id: string, slug?: string) {
  return cmsFetch('resource=pages', {
    method: 'POST',
    headers: adminHeaders(true),
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
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'save_site_copy', siteCopy }),
  })
}

export async function fetchActivity() {
  const data = await cmsFetch('resource=activity', { headers: elevatedHeaders() })
  return data.activity || []
}

export async function fetchLeads() {
  const data = await cmsFetch('resource=leads', { headers: elevatedHeaders() })
  return data.leads || []
}

export async function fetchMyLeads() {
  const data = await cmsFetch('resource=my-leads', { headers: userHeaders() })
  return data.leads || []
}

export async function fetchMyInvoices(): Promise<Invoice[]> {
  const data = await cmsFetch('resource=my-invoices', { headers: userHeaders() })
  return data.invoices || []
}

export async function updateProfile(name: string, phone?: string) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: userHeaders(true),
    body: JSON.stringify({
      action: 'update_profile',
      name,
      ...(phone !== undefined ? { phone } : {}),
    }),
  })
}

/** Change password while signed in. Returns a fresh session token. */
export async function changePassword(currentPassword: string, newPassword: string) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: userHeaders(true),
    body: JSON.stringify({ action: 'change_password', currentPassword, newPassword }),
  })
}

/** Request a password-reset OTP (email + SMS when available). */
export async function requestPasswordReset(email: string) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'password_reset_request', email }),
  })
}

export async function verifyPasswordResetCode(email: string, code: string) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'password_reset_verify', email, code }),
  })
}

export async function completePasswordReset(email: string, code: string, newPassword: string) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'password_reset_complete', email, code, newPassword }),
  })
}

export async function fetchUsers(): Promise<CmsUser[]> {
  const data = await cmsFetch('resource=users', {
    headers: adminHeaders(),
  })
  return data.users || []
}

export async function updateUserRole(
  userId: string,
  role: CmsUser['role'],
  jobTitle?: string,
) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'update_user_role', userId, role, jobTitle }),
  })
}

export async function setUserActive(userId: string, active: boolean) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'set_user_active', userId, active }),
  })
}

export async function createAdminUser(input: {
  email: string
  password: string
  name?: string
  role?: 'admin' | 'staff' | 'super_admin'
  jobTitle?: string
}) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'create_staff_user', ...input }),
  })
}

export async function fetchShop() {
  const data = await cmsFetch('resource=shop')
  return data.products || []
}

export async function saveShop(products: unknown[]) {
  return cmsFetch('resource=shop', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_shop', products }),
  })
}

export type CmsService = {
  id: string
  slug: string
  name: string
  category: string
  description: string
  offerings: string[]
  image?: string
  startingPrice?: number | null
  pricingGroupId?: string
  status: 'published' | 'draft'
}

export type CmsMediaItem = {
  id: string
  label: string
  src: string
  group: 'banners' | 'scenes' | 'packages' | 'custom'
  createdAt?: string
}

export async function fetchServices(publishedOnly = true): Promise<CmsService[]> {
  const data = await cmsFetch(
    `resource=services${publishedOnly ? '&published=1' : ''}`,
    publishedOnly ? undefined : { headers: elevatedHeaders() },
  )
  return (data.services || []) as CmsService[]
}

export async function fetchService(slug: string): Promise<CmsService> {
  const data = await cmsFetch(`resource=services&slug=${encodeURIComponent(slug)}`)
  return data.service as CmsService
}

export async function saveServices(services: CmsService[]) {
  return cmsFetch('resource=services', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_services', services }),
  })
}

export async function fetchMediaExtras(): Promise<CmsMediaItem[]> {
  const data = await cmsFetch('resource=media')
  return (data.media || []) as CmsMediaItem[]
}

export async function saveMediaItem(item: Partial<CmsMediaItem>) {
  return cmsFetch('resource=media', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_media_item', item }),
  })
}

export async function deleteMediaItem(id: string) {
  return cmsFetch('resource=media', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'delete_media_item', id }),
  })
}

export type CmsProduct = {
  id: string
  slug: string
  name: string
  category: string
  tagline: string
  description: string
  features: string[]
  highlights?: string[]
  image?: string
  imageFit?: 'cover' | 'contain'
  status: 'published' | 'draft'
}

export type CmsPortfolioProject = {
  id: string
  slug: string
  name: string
  category: string
  client?: string
  description: string
  technologies: string[]
  results?: string[]
  logo?: string
  image?: string
  status: 'published' | 'draft'
}

export type SiteProfile = {
  email: string
  phone: string
  whatsapp: string
  address: string
  socialLinks: { id: string; label: string; handle: string; href: string }[]
}

export type ChatFaqRecord = {
  id: string
  questions: string[]
  answer: string
  links?: { label: string; href: string }[]
}

export async function fetchCmsProducts(publishedOnly = true): Promise<CmsProduct[]> {
  const data = await cmsFetch(
    `resource=products${publishedOnly ? '&published=1' : ''}`,
    publishedOnly ? undefined : { headers: elevatedHeaders() },
  )
  return (data.products || []) as CmsProduct[]
}

export async function fetchCmsProduct(slug: string): Promise<CmsProduct> {
  const data = await cmsFetch(`resource=products&slug=${encodeURIComponent(slug)}`)
  return data.product as CmsProduct
}

export async function saveProducts(products: CmsProduct[]) {
  return cmsFetch('resource=products', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_products', products }),
  })
}

export async function fetchPortfolio(publishedOnly = true): Promise<CmsPortfolioProject[]> {
  const data = await cmsFetch(
    `resource=portfolio${publishedOnly ? '&published=1' : ''}`,
    publishedOnly ? undefined : { headers: elevatedHeaders() },
  )
  return (data.projects || []) as CmsPortfolioProject[]
}

export async function savePortfolio(projects: CmsPortfolioProject[]) {
  return cmsFetch('resource=portfolio', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_portfolio', projects }),
  })
}

export async function fetchSiteProfile(): Promise<SiteProfile> {
  const data = await cmsFetch('resource=site-profile')
  return data.profile as SiteProfile
}

export async function saveSiteProfile(profile: SiteProfile) {
  return cmsFetch('resource=site-profile', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'save_site_profile', profile }),
  })
}

export async function fetchChatFaqs(): Promise<ChatFaqRecord[]> {
  const data = await cmsFetch('resource=chat-faqs')
  return (data.faqs || []) as ChatFaqRecord[]
}

export async function saveChatFaqs(faqs: ChatFaqRecord[]) {
  return cmsFetch('resource=chat-faqs', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_chat_faqs', faqs }),
  })
}

/**
 * Edge-derived context for a site visitor. `ip` and `userAgent` are blanked by
 * the API for roles without PII access — `ipMasked` is always safe to show.
 */
export type VisitorContext = {
  ip?: string
  ipMasked?: string
  country?: string
  region?: string
  city?: string
  timezone?: string
  network?: string
  colo?: string
  browser?: string
  os?: string
  device?: string
  bot?: boolean
  userAgent?: string
  referrer?: string
  language?: string
}

export type PresenceEntry = {
  sessionId: string
  path: string
  at: string
  visitor?: VisitorContext
  location?: string
}

export type VisitorRecord = {
  sessionId: string
  firstSeen: string
  lastSeen: string
  hits: number
  path: string
  paths: string[]
  visitor?: VisitorContext
  location?: string
  online?: boolean
}

export async function fetchPresence(): Promise<{
  online: PresenceEntry[]
  count: number
  canSeeIp: boolean
}> {
  const data = await cmsFetch('resource=presence', { headers: elevatedHeaders() })
  return {
    online: data.online || [],
    count: data.count || 0,
    canSeeIp: Boolean(data.canSeeIp),
  }
}

/** Recent visitor sessions with IP, geo, device, journey — admin/staff only. */
export async function fetchVisitors(): Promise<{
  visitors: VisitorRecord[]
  canSeeIp: boolean
}> {
  const data = await cmsFetch('resource=visitors', { headers: elevatedHeaders() })
  return { visitors: data.visitors || [], canSeeIp: Boolean(data.canSeeIp) }
}

import type { KnowledgeArticle } from '@/data/knowledge'

export type { KnowledgeArticle }

export async function fetchKnowledge(publishedOnly = true): Promise<KnowledgeArticle[]> {
  const data = await cmsFetch(
    `resource=knowledge${publishedOnly ? '&published=1' : ''}`,
    publishedOnly ? undefined : { headers: elevatedHeaders() },
  )
  return (data.articles || []) as KnowledgeArticle[]
}

export async function fetchKnowledgeArticle(slug: string): Promise<KnowledgeArticle> {
  const data = await cmsFetch(`resource=knowledge&slug=${encodeURIComponent(slug)}`)
  return data.article as KnowledgeArticle
}

export async function saveKnowledgeArticle(article: Partial<KnowledgeArticle>) {
  return cmsFetch('resource=knowledge', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_knowledge_article', article }),
  })
}

export async function deleteKnowledgeArticle(id: string, slug?: string) {
  return cmsFetch('resource=knowledge', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'delete_knowledge_article', id, slug }),
  })
}

export async function fetchReviews() {
  const data = await cmsFetch('resource=reviews')
  return data.reviews || []
}

export async function saveReviews(reviews: unknown[]) {
  return cmsFetch('resource=reviews', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'save_reviews', reviews }),
  })
}

export async function fetchNewsletter() {
  const data = await cmsFetch('resource=newsletter', { headers: elevatedHeaders() })
  return data.subscribers || []
}

export async function fetchNotifications() {
  const data = await cmsFetch('resource=notifications', { headers: elevatedHeaders() })
  return data.notifications || []
}

export async function createNotification(title: string, body: string) {
  return cmsFetch('resource=notifications', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'notify', title, body }),
  })
}

export async function fetchAnalytics() {
  const data = await cmsFetch('resource=analytics', { headers: elevatedHeaders() })
  return data.analytics
}

export async function backupCms() {
  return cmsFetch('resource=backup', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'backup' }),
  })
}

export async function restoreCms() {
  return cmsFetch('resource=backup', {
    method: 'POST',
    headers: adminHeaders(true),
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

export async function logoutUser() {
  try {
    await cmsFetch('resource=users', {
      method: 'POST',
      headers: userHeaders(true),
      body: JSON.stringify({ action: 'logout' }),
    })
  } catch {
    /* local session is cleared regardless */
  }
}

/**
 * Owner sign-in. The password is verified at the edge against `ADMIN_API_KEY`
 * and exchanged for a short-lived God Mode session token — it is never compared
 * in the browser and never shipped in the bundle.
 */
export async function adminLogin(password: string): Promise<{ token: string }> {
  const data = await cmsFetch('resource=users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'admin_login', password }),
  })
  return { token: data.token as string }
}

export async function adminLogout() {
  try {
    await cmsFetch('resource=users', {
      method: 'POST',
      headers: adminHeaders(true),
      body: JSON.stringify({ action: 'admin_logout' }),
    })
  } catch {
    /* local session is cleared regardless */
  }
}

export async function trackVisit(path: string) {
  try {
    let sessionId = ''
    try {
      sessionId = localStorage.getItem('et_visitor_sid') || ''
      if (!sessionId) {
        sessionId = `vis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
        localStorage.setItem('et_visitor_sid', sessionId)
      }
    } catch {
      sessionId = `vis_${Date.now().toString(36)}`
    }
    const data = await cmsFetch('resource=analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'track_visit', path, sessionId }),
    })
    if (data?.sessionId) {
      try {
        localStorage.setItem('et_visitor_sid', data.sessionId)
      } catch {
        /* ignore */
      }
    }
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
  /** Honeypot value from `useHoneypot` — must stay empty for real submissions. */
  website?: string
}) {
  const token = loadAuthToken()
  return cmsFetch('resource=leads', {
    method: 'POST',
    headers: token
      ? { 'Content-Type': 'application/json', 'X-User-Token': token }
      : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'lead', ...input }),
  })
}

export async function subscribeNewsletter(email: string, website = '') {
  return cmsFetch('resource=newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'newsletter_subscribe', email, website }),
  })
}

export type InvoiceItem = {
  description: string
  qty: number
  unitPrice: number
}

export type Invoice = {
  id: string
  number: string
  publicToken: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientCompany?: string
  items: InvoiceItem[]
  currency: string
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'cancelled'
  notes?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  paidAt?: string | null
  paymentMethod?: string
  paymentRef?: string
  receiptNumber?: string | null
  amountPaid?: number
  lastPaymentAt?: string | null
  lastPaymentType?: string
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const data = await cmsFetch('resource=invoices', { headers: elevatedHeaders() })
  return data.invoices || []
}

export async function fetchInvoicePublic(id: string, token: string): Promise<Invoice> {
  const data = await cmsFetch(
    `resource=invoices&id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`,
  )
  return data.invoice
}

export async function saveInvoice(invoice: Partial<Invoice>) {
  return cmsFetch('resource=invoices', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_invoice', invoice }),
  })
}

export async function markInvoicePaid(
  id: string,
  paymentMethod?: string,
  paymentRef?: string,
) {
  return cmsFetch('resource=invoices', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'mark_invoice_paid', id, paymentMethod, paymentRef }),
  })
}

export async function deleteInvoice(id: string) {
  return cmsFetch('resource=invoices', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'delete_invoice', id }),
  })
}

export async function fetchReports() {
  const data = await cmsFetch('resource=reports', { headers: elevatedHeaders() })
  return data.report
}

export type { DownloadResource }

export async function fetchDownloads(publishedOnly = true): Promise<DownloadResource[]> {
  const data = await cmsFetch(
    `resource=downloads${publishedOnly ? '&published=1' : ''}`,
    publishedOnly ? undefined : { headers: elevatedHeaders() },
  )
  return (data.downloads || []) as DownloadResource[]
}

export async function saveDownload(download: Partial<DownloadResource>) {
  return cmsFetch('resource=downloads', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_download', download }),
  })
}

export async function deleteDownload(id: string) {
  return cmsFetch('resource=downloads', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'delete_download', id }),
  })
}

export async function updateLeadStatus(id: string, status: string, notes?: string) {
  return cmsFetch('resource=leads', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'update_lead_status', id, status, notes }),
  })
}

export type { SiteFeatureSettings }

export type JobPosting = {
  id: string
  title: string
  department: string
  type: string
  location: string
  description?: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export type JobApplication = {
  id: string
  jobId: string
  jobTitle: string
  name: string
  email: string
  phone?: string
  coverLetter?: string
  portfolioUrl?: string
  linkedinUrl?: string
  resumeFileName?: string
  resumeMime?: string
  resumeData?: string
  status: string
  at: string
  notes?: string
}

export async function fetchSiteSettings(): Promise<SiteFeatureSettings> {
  const data = await cmsFetch('resource=settings')
  return { ...defaultFeatureSettings, ...(data.settings || {}) }
}

export async function saveSiteSettings(settings: SiteFeatureSettings) {
  return cmsFetch('resource=settings', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'save_settings', settings }),
  })
}

export type PaymentMethodsConfig = {
  currency: string
  merchantEmail: string
  mode: 'sandbox' | 'live'
  mpesa: {
    enabled: boolean
    paybill: string
    accountName: string
    tillNumber: string
    consumerKey: string
    consumerSecret: string
    passkey: string
    shortcode: string
  }
  paypal: {
    enabled: boolean
    clientId: string
    clientSecret: string
    merchantEmail: string
  }
  paystack: {
    enabled: boolean
    publicKey: string
    secretKey: string
    webhookSecret?: string
    merchantEmail: string
  }
  notes: string
  updatedAt: string
}

export async function fetchPaymentMethods(): Promise<PaymentMethodsConfig> {
  const data = await cmsFetch('resource=payments', { headers: adminHeaders() })
  return data.payments as PaymentMethodsConfig
}

export async function savePaymentMethods(payments: PaymentMethodsConfig) {
  return cmsFetch('resource=payments', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'save_payments', payments }),
  })
}

export async function fetchJobs(publishedOnly = true): Promise<JobPosting[]> {
  const data = await cmsFetch(
    `resource=jobs${publishedOnly ? '&published=1' : ''}`,
    publishedOnly ? undefined : { headers: elevatedHeaders() },
  )
  return (data.jobs || []) as JobPosting[]
}

export async function saveJob(job: Partial<JobPosting>) {
  return cmsFetch('resource=jobs', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'save_job', job }),
  })
}

export async function deleteJob(id: string) {
  return cmsFetch('resource=jobs', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'delete_job', id }),
  })
}

export async function fetchApplications(): Promise<JobApplication[]> {
  const data = await cmsFetch('resource=applications', { headers: elevatedHeaders() })
  return (data.applications || []) as JobApplication[]
}

export async function updateApplicationStatus(id: string, status: string, notes?: string) {
  return cmsFetch('resource=applications', {
    method: 'POST',
    headers: elevatedHeaders(true),
    body: JSON.stringify({ action: 'update_application_status', id, status, notes }),
  })
}

export async function submitJobApplication(input: {
  jobId: string
  jobTitle?: string
  name: string
  email: string
  phone?: string
  coverLetter?: string
  portfolioUrl?: string
  linkedinUrl?: string
  resumeFileName?: string
  resumeMime?: string
  resumeData?: string
}) {
  return cmsFetch('resource=jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'job_apply', ...input }),
  })
}

import { getAdminApiKey, isAdminAuthed } from '@/lib/engagementStore'
import { loadAuthToken } from '@/lib/auth'

const ADMIN_KEY = () => getAdminApiKey()

function adminHeaders(json = false): HeadersInit {
  return json
    ? { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY() }
    : { 'X-Admin-Key': ADMIN_KEY() }
}

function userHeaders(json = false): HeadersInit {
  const token = loadAuthToken() || ''
  return json
    ? { 'Content-Type': 'application/json', 'X-User-Token': token }
    : { 'X-User-Token': token }
}

/** God Mode key only when Super Admin session is active; otherwise staff/customer token */
function elevatedHeaders(json = false): HeadersInit {
  const token = loadAuthToken() || ''
  const base: Record<string, string> = {}
  if (json) base['Content-Type'] = 'application/json'
  if (isAdminAuthed()) base['X-Admin-Key'] = ADMIN_KEY()
  if (token) base['X-User-Token'] = token
  return base
}

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

export async function fetchPage(slug: string): Promise<CmsPage> {
  const data = await cmsFetch(`resource=pages&slug=${encodeURIComponent(slug)}`)
  return data.page
}

export async function savePage(page: Partial<CmsPage>) {
  return cmsFetch('resource=pages', {
    method: 'POST',
    headers: adminHeaders(true),
    body: JSON.stringify({ action: 'save_page', page }),
  })
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

export async function updateProfile(name: string) {
  return cmsFetch('resource=users', {
    method: 'POST',
    headers: userHeaders(true),
    body: JSON.stringify({ action: 'update_profile', name }),
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
  const token = loadAuthToken()
  return cmsFetch('resource=leads', {
    method: 'POST',
    headers: token
      ? { 'Content-Type': 'application/json', 'X-User-Token': token }
      : { 'Content-Type': 'application/json' },
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

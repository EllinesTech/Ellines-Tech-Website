import { defaultKnowledge } from './knowledgeDefaults.js'
import { defaultDownloads } from './downloadsDefaults.js'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-User-Token',
}

/** Load Knowledge Hub articles — seed defaults when KV is empty; merge missing seed ids / downloadUrl */
async function loadKnowledgeArticles(env) {
  let articles = await getJson(env, 'cms:knowledge', null)
  const defaults = defaultKnowledge()
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    articles = defaults
    await putJson(env, 'cms:knowledge', articles)
    return articles
  }
  const byId = new Map(articles.map((a) => [a.id, a]))
  let changed = false
  for (const d of defaults) {
    const existing = byId.get(d.id)
    if (!existing) {
      articles.push(d)
      changed = true
      continue
    }
    if (d.downloadUrl && !existing.downloadUrl) {
      existing.downloadUrl = d.downloadUrl
      if (d.htmlUrl && !existing.htmlUrl) existing.htmlUrl = d.htmlUrl
      changed = true
    }
  }
  if (changed) await putJson(env, 'cms:knowledge', articles)
  return articles
}

async function loadDownloads(env) {
  let list = await getJson(env, 'cms:downloads', null)
  const defaults = defaultDownloads()
  if (!list || !Array.isArray(list) || list.length === 0) {
    list = defaults
    await putJson(env, 'cms:downloads', list)
    return list
  }
  const ids = new Set(list.map((d) => d.id))
  let changed = false
  for (const d of defaults) {
    if (!ids.has(d.id)) {
      list.push(d)
      changed = true
    }
  }
  if (changed) await putJson(env, 'cms:downloads', list)
  return list
}

function defaultSiteSettings() {
  return {
    careersEnabled: true,
    requestEnabled: true,
    chatEnabled: true,
    pricingEnabled: true,
    resourcesEnabled: true,
    downloadsEnabled: true,
    newsletterEnabled: true,
    contactEnabled: true,
    announcement: '',
    alwaysOpen: true,
  }
}

async function loadSiteSettings(env) {
  const stored = await getJson(env, 'cms:settings', null)
  return { ...defaultSiteSettings(), ...(stored && typeof stored === 'object' ? stored : {}) }
}

function defaultJobs() {
  const now = new Date().toISOString()
  return [
    {
      id: 'job_fullstack',
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'Nairobi / Remote',
      description:
        'Own end-to-end product delivery across React, APIs, and cloud infrastructure for Ellines platforms.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_flutter',
      title: 'Flutter Mobile Developer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'Nairobi',
      description:
        'Ship polished mobile experiences for healthcare and business products used across East Africa.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_ai',
      title: 'AI/ML Engineer',
      department: 'AI Lab',
      type: 'Full-time',
      location: 'Remote',
      description:
        'Build and productionize ML systems for voice, automation, and decision-support products.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_design',
      title: 'UI/UX Designer',
      department: 'Design',
      type: 'Full-time',
      location: 'Nairobi',
      description:
        'Design product interfaces and brand systems that feel premium, clear, and African-market ready.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_devops',
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      type: 'Full-time',
      location: 'Remote',
      description:
        'Harden deployment pipelines, observability, and secure cloud operations for our product suite.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_bd',
      title: 'Business Development Manager',
      department: 'Sales',
      type: 'Full-time',
      location: 'Nairobi',
      description:
        'Grow enterprise and SME relationships across Kenya and the region with consultative selling.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'job_internship',
      title: 'Internship / Graduate Program',
      department: 'Talent',
      type: 'Internship',
      location: 'Nairobi / Hybrid',
      description:
        'Open call for interns and recent graduates passionate about technology in Africa.',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

async function loadJobs(env) {
  let list = await getJson(env, 'cms:jobs', null)
  if (!list || !Array.isArray(list) || list.length === 0) {
    list = defaultJobs()
    await putJson(env, 'cms:jobs', list)
    return list
  }
  return list
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

function id(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function adminOk(request, env) {
  const key = request.headers.get('X-Admin-Key') || ''
  const expected = env.ADMIN_API_KEY || 'EllinesGodMode2026'
  return key === expected
}

/** Super Admin God Mode only (panel password / ADMIN_API_KEY). Staff never use this. */
function isGodMode(request, env) {
  return adminOk(request, env)
}

const STAFF_ROLES = new Set(['staff', 'admin', 'super_admin'])
const CUSTOMER_ROLE = 'customer'

async function resolveUserSession(request, env) {
  const token = request.headers.get('X-User-Token') || ''
  if (!token) return null
  const session = await getJson(env, `cms:session:${token}`, null)
  if (!session?.userId) return null
  const users = await getJson(env, 'cms:users', [])
  const user = users.find((u) => u.id === session.userId)
  if (!user || user.active === false) return null
  return user
}

async function staffOk(request, env) {
  const user = await resolveUserSession(request, env)
  if (!user || !STAFF_ROLES.has(user.role)) return null
  return user
}

/** God Mode OR staff/admin user token — for day-to-day CMS modules */
async function staffOrGod(request, env) {
  if (isGodMode(request, env)) return { kind: 'god', user: null }
  const user = await staffOk(request, env)
  if (user) return { kind: 'staff', user }
  return null
}

async function sendResendEmail(env, { to, subject, html }) {
  const key = env.RESEND_API_KEY
  if (!key || !to) return { sent: false, reason: 'no_key' }
  try {
    const from = env.RESEND_FROM || 'Ellines Tech <onboarding@resend.dev>'
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    })
    if (!res.ok) {
      const err = await res.text().catch(() => '')
      return { sent: false, reason: err || 'send_failed' }
    }
    return { sent: true }
  } catch (e) {
    return { sent: false, reason: String(e) }
  }
}

async function getJson(env, key, fallback) {
  const raw = await env.ET_STORE.get(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

async function putJson(env, key, value) {
  await env.ET_STORE.put(key, JSON.stringify(value))
}

async function logActivity(env, entry) {
  const list = await getJson(env, 'cms:activity', [])
  list.unshift({ id: id('act'), at: new Date().toISOString(), ...entry })
  await putJson(env, 'cms:activity', list.slice(0, 200))
}

async function hashPassword(password, saltB64) {
  const enc = new TextEncoder()
  const salt = saltB64
    ? Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key,
    256,
  )
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)))
  const saltOut = btoa(String.fromCharCode(...salt))
  return { hash, salt: saltOut }
}

export async function onRequestOptions() {
  return new Response(null, { headers: cors })
}

export async function onRequestGet(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const url = new URL(request.url)
  const resource = url.searchParams.get('resource') || 'pages'
  const slug = url.searchParams.get('slug')

  if (resource === 'pages') {
    const pages = await getJson(env, 'cms:pages', [])
    if (slug) {
      const page = pages.find((p) => p.slug === slug)
      if (!page) return json({ error: 'not found' }, 404)
      if (page.status !== 'published' && !(await staffOrGod(request, env))) {
        return json({ error: 'not found' }, 404)
      }
      return json({ page })
    }
    const publishedOnly = url.searchParams.get('published') === '1'
    if (!publishedOnly && !(await staffOrGod(request, env))) {
      return json({ error: 'unauthorized' }, 401)
    }
    return json({
      pages: publishedOnly ? pages.filter((p) => p.status === 'published') : pages,
    })
  }

  if (resource === 'site-copy') {
    return json({ siteCopy: await getJson(env, 'cms:site-copy', defaultSiteCopy()) })
  }

  if (resource === 'activity') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    return json({ activity: await getJson(env, 'cms:activity', []) })
  }

  if (resource === 'leads') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    return json({ leads: await getJson(env, 'cms:leads', []) })
  }

  if (resource === 'me') {
    const user = await resolveUserSession(request, env)
    if (!user) return json({ error: 'unauthorized' }, 401)
    const { passwordHash, salt, ...safe } = user
    return json({ user: safe })
  }

  if (resource === 'my-leads') {
    const user = await resolveUserSession(request, env)
    if (!user || user.role !== CUSTOMER_ROLE) return json({ error: 'unauthorized' }, 401)
    const leads = await getJson(env, 'cms:leads', [])
    const email = String(user.email || '').toLowerCase()
    const mine = leads.filter(
      (l) =>
        String(l.email || '').toLowerCase() === email ||
        l.userId === user.id,
    )
    return json({ leads: mine })
  }

  if (resource === 'my-invoices') {
    const user = await resolveUserSession(request, env)
    if (!user || user.role !== CUSTOMER_ROLE) return json({ error: 'unauthorized' }, 401)
    const invoices = await getJson(env, 'cms:invoices', [])
    const email = String(user.email || '').toLowerCase()
    const mine = invoices.filter(
      (i) =>
        String(i.clientEmail || '').toLowerCase() === email ||
        i.userId === user.id,
    )
    return json({ invoices: mine })
  }

  if (resource === 'reviews') {
    return json({ reviews: await getJson(env, 'cms:reviews', []) })
  }

  if (resource === 'newsletter') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    return json({ subscribers: await getJson(env, 'cms:newsletter', []) })
  }

  if (resource === 'notifications') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    return json({ notifications: await getJson(env, 'cms:notifications', []) })
  }

  if (resource === 'shop') {
    let products = await getJson(env, 'cms:shop-products', null)
    const defaults = defaultShop()
    const retired = new Set(['shop_hosting_care'])
    const defaultById = new Map(defaults.map((d) => [d.id, d]))
    if (!products || !Array.isArray(products) || products.length === 0) {
      products = defaults
      await putJson(env, 'cms:shop-products', products)
    } else {
      const before = products.length
      products = products.filter(
        (p) =>
          !retired.has(p.id) &&
          !(String(p.name || '').toLowerCase().includes('hosting')),
      )
      const ids = new Set(products.map((p) => p.id))
      let changed = products.length !== before
      for (const d of defaults) {
        if (!ids.has(d.id)) {
          products.push(d)
          changed = true
        }
      }
      // Repair posters + catalogue metadata from code defaults (KV self-heals on fetch)
      products = products.map((p) => {
        const d = defaultById.get(p.id)
        if (!d) {
          // Migrate legacy Career category label even for unknown custom rows
          if (String(p.category || '') === 'Career') {
            changed = true
            return { ...p, category: 'Career Documents' }
          }
          return p
        }
        const image = String(p.image || '')
        let category = String(p.category || d.category || '')
        if (category === 'Career') category = 'Career Documents'
        const wrongGraphics =
          (image.includes('poster-graphics') ||
            image.includes('design_graphics_pack') ||
            image.includes('GRAPHICS')) &&
          category !== 'Graphics'
        // Web (and any non-Graphics) must never keep the shared Graphics Design poster
        const webStuckOnGraphics =
          category === 'Web' &&
          (wrongGraphics ||
            image.includes('poster-graphics') ||
            image.includes('design_graphics_pack') ||
            !image)
        const isLegacyArt =
          !image ||
          image.endsWith('.svg') ||
          image.endsWith('.png') ||
          image.includes('logo-hero') ||
          image.includes('ellines-rebranding') ||
          /\/media\/posters\/poster-/.test(image) ||
          /\/media\/scenes\//.test(image)
        const catalogPhoto = String(d.image || '')
        const shouldUseCatalog =
          Boolean(catalogPhoto) &&
          catalogPhoto.includes('/media/posters/packages/') &&
          image !== catalogPhoto
        const needsImage =
          Boolean(d.image) &&
          image !== d.image &&
          (wrongGraphics || webStuckOnGraphics || isLegacyArt || shouldUseCatalog)
        const needsMeta =
          Number(p.price) !== Number(d.price) ||
          String(p.name || '') !== String(d.name || '') ||
          String(p.description || '') !== String(d.description || '') ||
          category !== String(d.category || '') ||
          String(p.level || '') !== String(d.level || '') ||
          String(p.currency || '') !== String(d.currency || 'KES') ||
          String(p.groupId || '') !== String(d.groupId || '') ||
          String(p.groupName || '') !== String(d.groupName || '') ||
          String(p.tierLabel || '') !== String(d.tierLabel || '') ||
          String(p.experienceBand || '') !== String(d.experienceBand || '')
        if (!needsImage && !needsMeta) return p
        changed = true
        return {
          ...p,
          name: d.name,
          price: d.price,
          currency: d.currency || 'KES',
          category: d.category,
          level: d.level,
          description: d.description,
          groupId: d.groupId,
          groupName: d.groupName,
          tierLabel: d.tierLabel,
          experienceBand: d.experienceBand,
          ...(needsImage || shouldUseCatalog ? { image: d.image } : {}),
        }
      })
      if (changed) await putJson(env, 'cms:shop-products', products)
    }
    return json({ products })
  }

  if (resource === 'knowledge') {
    const articles = await loadKnowledgeArticles(env)
    if (slug) {
      const article = articles.find((a) => a.slug === slug)
      if (!article) return json({ error: 'not found' }, 404)
      if (article.status !== 'published' && !(await staffOrGod(request, env))) {
        return json({ error: 'not found' }, 404)
      }
      return json({ article })
    }
    const publishedOnly = url.searchParams.get('published') === '1'
    const category = url.searchParams.get('category')
    let list = articles
    if (publishedOnly) list = list.filter((a) => a.status === 'published')
    else if (!(await staffOrGod(request, env))) {
      return json({ error: 'unauthorized' }, 401)
    }
    if (category) list = list.filter((a) => a.category === category)
    return json({ articles: list })
  }

  if (resource === 'users') {
    // Users module: Super Admin God Mode only — staff never manage accounts here
    if (!isGodMode(request, env)) return json({ error: 'unauthorized' }, 401)
    const users = await getJson(env, 'cms:users', [])
    return json({
      users: users.map(({ passwordHash, salt, ...safe }) => safe),
    })
  }

  if (resource === 'analytics') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    const visitors = await getJson(env, 'cms:visitors', { total: 0, today: 0, pages: {} })
    const sessions = await getJson(env, 'chat:index', [])
    return json({
      analytics: {
        visitors,
        liveChats: sessions.length,
        waitingChats: sessions.filter((s) => s.status === 'waiting').length,
      },
    })
  }

  if (resource === 'invoices') {
    const invoiceId = url.searchParams.get('id')
    const token = url.searchParams.get('token')
    const invoices = await getJson(env, 'cms:invoices', [])
    if (invoiceId && token) {
      const inv = invoices.find((i) => i.id === invoiceId && i.publicToken === token)
      if (!inv) return json({ error: 'not found' }, 404)
      return json({ invoice: inv })
    }
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    return json({ invoices })
  }

  if (resource === 'reports') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    const leads = await getJson(env, 'cms:leads', [])
    const invoices = await getJson(env, 'cms:invoices', [])
    const visitors = await getJson(env, 'cms:visitors', { total: 0, today: 0, pages: {} })
    const paid = invoices.filter((i) => i.status === 'paid')
    const unpaid = invoices.filter((i) => i.status === 'sent' || i.status === 'draft')
    const revenue = paid.reduce((sum, i) => sum + Number(i.total || 0), 0)
    const outstanding = unpaid.reduce((sum, i) => sum + Number(i.total || 0), 0)
    const byIntent = {}
    for (const l of leads) {
      const key = l.intent || 'other'
      byIntent[key] = (byIntent[key] || 0) + 1
    }
    return json({
      report: {
        leadsTotal: leads.length,
        leadsByIntent: byIntent,
        invoicesTotal: invoices.length,
        invoicesPaid: paid.length,
        invoicesUnpaid: unpaid.length,
        revenueKes: revenue,
        outstandingKes: outstanding,
        visitors,
        recentPaid: paid.slice(0, 8),
        recentLeads: leads.slice(0, 8),
      },
    })
  }

  if (resource === 'downloads') {
    const list = await loadDownloads(env)
    const publishedOnly = url.searchParams.get('published') === '1'
    if (!publishedOnly && !(await staffOrGod(request, env))) {
      return json({ error: 'unauthorized' }, 401)
    }
    return json({
      downloads: publishedOnly ? list.filter((d) => d.status === 'published') : list,
    })
  }

  if (resource === 'settings') {
    const settings = await loadSiteSettings(env)
    return json({ settings })
  }

  if (resource === 'jobs') {
    const settings = await loadSiteSettings(env)
    const list = await loadJobs(env)
    const publishedOnly = url.searchParams.get('published') === '1'
    if (publishedOnly) {
      if (!settings.careersEnabled) return json({ jobs: [], careersEnabled: false })
      return json({
        jobs: list.filter((j) => j.status === 'published'),
        careersEnabled: true,
      })
    }
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    return json({ jobs: list, careersEnabled: settings.careersEnabled })
  }

  if (resource === 'applications') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    const applications = await getJson(env, 'cms:applications', [])
    return json({ applications })
  }

  return json({ error: 'unknown resource' }, 400)
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const body = await request.json().catch(() => ({}))
  const action = body.action || 'save'

  // Public lead capture / newsletter
  if (action === 'lead') {
    const settings = await loadSiteSettings(env)
    const source = String(body.source || 'website')
    if (
      !settings.requestEnabled &&
      (source === 'request-flow' || body.intent === 'buy' || body.intent === 'quote')
    ) {
      return json({ error: 'Service requests are currently unavailable' }, 403)
    }
    if (!settings.contactEnabled && source === 'contact') {
      return json({ error: 'Contact form is currently unavailable' }, 403)
    }
    const sessionUser = await resolveUserSession(request, env)
    const leads = await getJson(env, 'cms:leads', [])
    const lead = {
      id: id('lead'),
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      company: body.company || '',
      message: body.message || '',
      source: body.source || 'website',
      intent: body.intent || 'quote',
      budget: body.budget || '',
      timeline: body.timeline || '',
      packageId: body.packageId || '',
      packageName: body.packageName || '',
      packagePrice: body.packagePrice || '',
      service: body.service || '',
      userId: sessionUser?.id || body.userId || '',
      status: body.intent === 'buy' ? 'purchase_request' : 'new',
      at: new Date().toISOString(),
    }
    leads.unshift(lead)
    await putJson(env, 'cms:leads', leads.slice(0, 500))
    await logActivity(env, {
      type: 'lead',
      message: `${lead.intent || 'Lead'}: ${lead.packageName || lead.service || lead.name || lead.email}`,
    })

    // Auto-draft invoice on purchase intent — email if Resend configured (never block)
    let invoice = null
    let emailResult = { sent: false, reason: 'skipped' }
    if (lead.intent === 'buy' && lead.email) {
      const invoices = await getJson(env, 'cms:invoices', [])
      const priceMatch = String(lead.packagePrice || '').replace(/[^\d.]/g, '')
      const unitPrice = Number(priceMatch) || 0
      invoice = {
        id: id('inv'),
        number: `ET-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
        publicToken: id('tok').replace('tok_', ''),
        clientName: lead.name || lead.email,
        clientEmail: lead.email,
        clientPhone: lead.phone || '',
        clientCompany: lead.company || '',
        userId: lead.userId || '',
        items: [
          {
            description: lead.packageName || lead.service || 'Service request',
            qty: 1,
            unitPrice,
          },
        ],
        currency: 'KES',
        subtotal: unitPrice,
        tax: 0,
        total: unitPrice,
        status: 'draft',
        notes: 'Auto-created from purchase request. Confirm scope before sending.',
        dueDate: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paidAt: null,
        paymentMethod: '',
        paymentRef: '',
        receiptNumber: null,
        leadId: lead.id,
      }
      invoices.unshift(invoice)
      await putJson(env, 'cms:invoices', invoices)
      const origin = new URL(request.url).origin
      const link = `${origin}/invoice/${invoice.id}?token=${invoice.publicToken}`
      emailResult = await sendResendEmail(env, {
        to: lead.email,
        subject: `Ellines Tech — draft invoice ${invoice.number}`,
        html: `<p>Hi ${lead.name || 'there'},</p>
<p>Thanks for your request for <strong>${lead.packageName || 'a package'}</strong>.</p>
<p>We've prepared a draft invoice (${invoice.number}). Our team will confirm scope, then share payment details.</p>
<p><a href="${link}">View draft invoice</a></p>
<p>— Ellines Tech</p>`,
      })
      if (!emailResult.sent) {
        const notes = await getJson(env, 'cms:notifications', [])
        notes.unshift({
          id: id('note'),
          title: 'Invoice email queued',
          body: `Draft ${invoice.number} for ${lead.email} — email not sent (${emailResult.reason || 'no_key'}). Resend when RESEND_API_KEY is set.`,
          at: new Date().toISOString(),
          read: false,
          kind: 'email_queue',
          invoiceId: invoice.id,
          leadId: lead.id,
        })
        await putJson(env, 'cms:notifications', notes.slice(0, 100))
      }
    }

    return json({ ok: true, lead, invoice, email: emailResult })
  }

  if (action === 'newsletter_subscribe') {
    const settings = await loadSiteSettings(env)
    if (!settings.newsletterEnabled) {
      return json({ error: 'Newsletter signup is currently unavailable' }, 403)
    }
    const list = await getJson(env, 'cms:newsletter', [])
    const email = String(body.email || '').toLowerCase().trim()
    if (!email.includes('@')) return json({ error: 'invalid email' }, 400)
    if (!list.some((s) => s.email === email)) {
      list.unshift({ id: id('sub'), email, at: new Date().toISOString() })
      await putJson(env, 'cms:newsletter', list.slice(0, 2000))
    }
    return json({ ok: true })
  }

  if (action === 'job_apply') {
    const settings = await loadSiteSettings(env)
    if (!settings.careersEnabled) {
      return json({ error: 'Careers applications are currently closed' }, 403)
    }
    const name = String(body.name || '').trim()
    const email = String(body.email || '').toLowerCase().trim()
    if (!name || !email.includes('@')) {
      return json({ error: 'name and valid email required' }, 400)
    }
    const jobs = await loadJobs(env)
    const jobId = String(body.jobId || '').trim()
    const job = jobs.find((j) => j.id === jobId && j.status === 'published')
    if (!job && jobId !== 'general') {
      return json({ error: 'Role not found or no longer open' }, 404)
    }
    // Resume payloads live in KV — keep under ~1.2MB base64 (~900KB file)
    const resumeData = typeof body.resumeData === 'string' ? body.resumeData : ''
    if (resumeData.length > 1_200_000) {
      return json({ error: 'Resume file too large (max ~900KB)' }, 400)
    }
    const application = {
      id: id('app'),
      jobId: job?.id || jobId || 'general',
      jobTitle: job?.title || body.jobTitle || 'General application',
      name,
      email,
      phone: String(body.phone || '').trim(),
      coverLetter: String(body.coverLetter || '').trim().slice(0, 8000),
      portfolioUrl: String(body.portfolioUrl || '').trim().slice(0, 500),
      linkedinUrl: String(body.linkedinUrl || '').trim().slice(0, 500),
      resumeFileName: String(body.resumeFileName || '').trim().slice(0, 200),
      resumeMime: String(body.resumeMime || '').trim().slice(0, 100),
      resumeData,
      status: 'new',
      at: new Date().toISOString(),
      notes: '',
    }
    const applications = await getJson(env, 'cms:applications', [])
    applications.unshift(application)
    await putJson(env, 'cms:applications', applications.slice(0, 500))
    await logActivity(env, {
      type: 'application',
      message: `Application: ${application.name} → ${application.jobTitle}`,
    })
    const notes = await getJson(env, 'cms:notifications', [])
    notes.unshift({
      id: id('note'),
      title: 'New job application',
      body: `${application.name} applied for ${application.jobTitle} (${application.email})`,
      at: new Date().toISOString(),
      read: false,
      kind: 'application',
      applicationId: application.id,
    })
    await putJson(env, 'cms:notifications', notes.slice(0, 100))
    const emailResult = await sendResendEmail(env, {
      to: env.CAREERS_NOTIFY_EMAIL || 'careers@ellinestech.co.ke',
      subject: `Application: ${application.jobTitle} — ${application.name}`,
      html: `<p><strong>${application.name}</strong> applied for <strong>${application.jobTitle}</strong>.</p>
<p>Email: ${application.email}<br/>Phone: ${application.phone || '—'}<br/>
LinkedIn: ${application.linkedinUrl || '—'}<br/>Portfolio: ${application.portfolioUrl || '—'}</p>
<p>${(application.coverLetter || '').replace(/</g, '&lt;').slice(0, 2000)}</p>
<p>View in Admin → Careers.</p>`,
    })
    const { resumeData: _omit, ...safe } = application
    return json({ ok: true, application: safe, email: emailResult })
  }

  if (action === 'track_visit') {
    const visitors = await getJson(env, 'cms:visitors', { total: 0, today: 0, day: '', pages: {} })
    const day = new Date().toISOString().slice(0, 10)
    if (visitors.day !== day) {
      visitors.day = day
      visitors.today = 0
    }
    visitors.total += 1
    visitors.today += 1
    const path = body.path || '/'
    visitors.pages[path] = (visitors.pages[path] || 0) + 1
    await putJson(env, 'cms:visitors', visitors)
    return json({ ok: true })
  }

  if (action === 'register') {
    const email = String(body.email || '').toLowerCase().trim()
    const name = String(body.name || '').trim()
    const password = String(body.password || '')
    if (!email.includes('@') || password.length < 6) {
      return json({ error: 'Valid email and password (6+ chars) required' }, 400)
    }
    // Public signup is customers only — staff are created by Super Admin
    const users = await getJson(env, 'cms:users', [])
    if (users.some((u) => u.email === email)) return json({ error: 'Email already registered' }, 409)
    const { hash, salt } = await hashPassword(password)
    const user = {
      id: id('user'),
      email,
      name: name || email.split('@')[0],
      role: 'customer',
      jobTitle: '',
      active: true,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    }
    users.unshift(user)
    await putJson(env, 'cms:users', users)
    await logActivity(env, { type: 'user', message: `Customer registered: ${email}` })
    const token = id('tok')
    await putJson(env, `cms:session:${token}`, {
      userId: user.id,
      email: user.email,
      role: user.role,
      at: new Date().toISOString(),
    })
    return json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        jobTitle: user.jobTitle,
      },
    })
  }

  if (action === 'login') {
    const email = String(body.email || '').toLowerCase().trim()
    const password = String(body.password || '')
    const users = await getJson(env, 'cms:users', [])
    const user = users.find((u) => u.email === email)
    if (!user) return json({ error: 'Invalid credentials' }, 401)
    if (user.active === false) return json({ error: 'Account deactivated' }, 403)
    const { hash } = await hashPassword(password, user.salt)
    if (hash !== user.passwordHash) return json({ error: 'Invalid credentials' }, 401)
    const token = id('tok')
    await putJson(env, `cms:session:${token}`, {
      userId: user.id,
      email: user.email,
      role: user.role,
      at: new Date().toISOString(),
    })
    return json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        jobTitle: user.jobTitle || '',
      },
    })
  }

  if (action === 'update_profile') {
    const user = await resolveUserSession(request, env)
    if (!user) return json({ error: 'unauthorized' }, 401)
    const users = await getJson(env, 'cms:users', [])
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx < 0) return json({ error: 'user not found' }, 404)
    if (body.name) users[idx].name = String(body.name).trim()
    await putJson(env, 'cms:users', users)
    const { passwordHash, salt, ...safe } = users[idx]
    return json({ ok: true, user: safe })
  }

  // Elevated actions below — God Mode OR staff for operational modules
  const actor = await staffOrGod(request, env)
  if (!actor) return json({ error: 'unauthorized' }, 401)
  const godOnly = actor.kind === 'god'

  if (action === 'save_page') {
    const pages = await getJson(env, 'cms:pages', [])
    const page = body.page
    if (!page?.slug || !page?.title) return json({ error: 'slug and title required' }, 400)
    const slug = String(page.slug)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
    const existing = pages.findIndex((p) => p.id === page.id || p.slug === slug)
    const record = {
      id: page.id || id('page'),
      slug,
      title: page.title,
      excerpt: page.excerpt || '',
      body: page.body || '',
      status: page.status === 'published' ? 'published' : 'draft',
      seoTitle: page.seoTitle || page.title,
      seoDescription: page.seoDescription || page.excerpt || '',
      updatedAt: new Date().toISOString(),
      createdAt: page.createdAt || new Date().toISOString(),
    }
    if (existing >= 0) pages[existing] = { ...pages[existing], ...record }
    else pages.unshift(record)
    await putJson(env, 'cms:pages', pages)
    await logActivity(env, {
      type: 'page',
      message: `Saved page /p/${record.slug} (${record.status})`,
    })
    return json({ ok: true, page: record })
  }

  if (action === 'delete_page') {
    const pages = await getJson(env, 'cms:pages', [])
    const next = pages.filter((p) => p.id !== body.id && p.slug !== body.slug)
    await putJson(env, 'cms:pages', next)
    await logActivity(env, { type: 'page', message: `Deleted page ${body.slug || body.id}` })
    return json({ ok: true })
  }

  if (action === 'save_site_copy') {
    await putJson(env, 'cms:site-copy', body.siteCopy || {})
    await logActivity(env, { type: 'site', message: 'Updated core site copy' })
    return json({ ok: true })
  }

  if (action === 'save_knowledge_article') {
    const articles = await loadKnowledgeArticles(env)
    const article = body.article
    if (!article?.slug || !article?.title) {
      return json({ error: 'slug and title required' }, 400)
    }
    const slug = String(article.slug)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
    const category = String(article.category || 'articles')
    const existing = articles.findIndex((a) => a.id === article.id || a.slug === slug)
    const record = {
      id: article.id || id('kh'),
      slug,
      title: article.title,
      excerpt: article.excerpt || '',
      body: article.body || '',
      category,
      tags: Array.isArray(article.tags)
        ? article.tags.map((t) => String(t).trim()).filter(Boolean)
        : String(article.tags || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
      status: article.status === 'published' ? 'published' : 'draft',
      seoTitle: article.seoTitle || article.title,
      seoDescription: article.seoDescription || article.excerpt || '',
      downloadUrl: article.downloadUrl || '',
      htmlUrl: article.htmlUrl || '',
      updatedAt: new Date().toISOString(),
      createdAt: article.createdAt || new Date().toISOString(),
    }
    if (existing >= 0) articles[existing] = { ...articles[existing], ...record }
    else articles.unshift(record)
    await putJson(env, 'cms:knowledge', articles)
    await logActivity(env, {
      type: 'knowledge',
      message: `Saved knowledge /resources/${record.slug} (${record.status})`,
    })
    return json({ ok: true, article: record })
  }

  if (action === 'delete_knowledge_article') {
    const articles = await loadKnowledgeArticles(env)
    const next = articles.filter((a) => a.id !== body.id && a.slug !== body.slug)
    await putJson(env, 'cms:knowledge', next)
    await logActivity(env, {
      type: 'knowledge',
      message: `Deleted knowledge ${body.slug || body.id}`,
    })
    return json({ ok: true })
  }

  if (action === 'update_lead_status') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    const leadId = body.id || body.leadId
    const status = String(body.status || '').trim()
    if (!leadId || !status) return json({ error: 'id and status required' }, 400)
    const leads = await getJson(env, 'cms:leads', [])
    const idx = leads.findIndex((l) => l.id === leadId)
    if (idx < 0) return json({ error: 'not found' }, 404)
    leads[idx] = {
      ...leads[idx],
      status,
      statusUpdatedAt: new Date().toISOString(),
      notes: body.notes !== undefined ? String(body.notes) : leads[idx].notes || '',
    }
    await putJson(env, 'cms:leads', leads)
    await logActivity(env, {
      type: 'lead',
      message: `Lead ${leads[idx].email || leadId} → ${status}`,
    })
    return json({ ok: true, lead: leads[idx] })
  }

  if (action === 'save_settings') {
    if (!godOnly) return json({ error: 'Not authorized' }, 403)
    const incoming = body.settings || {}
    const next = {
      ...defaultSiteSettings(),
      ...incoming,
      careersEnabled: Boolean(incoming.careersEnabled),
      requestEnabled: Boolean(incoming.requestEnabled),
      chatEnabled: Boolean(incoming.chatEnabled),
      pricingEnabled: Boolean(incoming.pricingEnabled),
      resourcesEnabled: Boolean(incoming.resourcesEnabled),
      downloadsEnabled: Boolean(incoming.downloadsEnabled),
      newsletterEnabled: Boolean(incoming.newsletterEnabled),
      contactEnabled: Boolean(incoming.contactEnabled),
      announcement: String(incoming.announcement || '').slice(0, 500),
      alwaysOpen: Boolean(incoming.alwaysOpen),
    }
    await putJson(env, 'cms:settings', next)
    await logActivity(env, { type: 'settings', message: 'Updated site feature settings' })
    return json({ ok: true, settings: next })
  }

  if (action === 'save_job') {
    const item = body.job || body.item
    if (!item?.title) return json({ error: 'title required' }, 400)
    const list = await loadJobs(env)
    const record = {
      id: item.id || id('job'),
      title: String(item.title).trim(),
      department: String(item.department || '').trim(),
      type: String(item.type || 'Full-time').trim(),
      location: String(item.location || '').trim(),
      description: String(item.description || '').trim().slice(0, 4000),
      status: item.status === 'published' ? 'published' : 'draft',
      updatedAt: new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
    }
    const existing = list.findIndex((j) => j.id === record.id)
    if (existing >= 0) list[existing] = { ...list[existing], ...record }
    else list.unshift(record)
    await putJson(env, 'cms:jobs', list)
    await logActivity(env, {
      type: 'jobs',
      message: `Saved job ${record.title} (${record.status})`,
    })
    return json({ ok: true, job: record })
  }

  if (action === 'delete_job') {
    const list = await loadJobs(env)
    const next = list.filter((j) => j.id !== body.id)
    await putJson(env, 'cms:jobs', next)
    await logActivity(env, { type: 'jobs', message: `Deleted job ${body.id}` })
    return json({ ok: true })
  }

  if (action === 'update_application_status') {
    const appId = body.id || body.applicationId
    const status = String(body.status || '').trim()
    if (!appId || !status) return json({ error: 'id and status required' }, 400)
    const applications = await getJson(env, 'cms:applications', [])
    const idx = applications.findIndex((a) => a.id === appId)
    if (idx < 0) return json({ error: 'not found' }, 404)
    applications[idx] = {
      ...applications[idx],
      status,
      statusUpdatedAt: new Date().toISOString(),
      notes: body.notes !== undefined ? String(body.notes) : applications[idx].notes || '',
    }
    await putJson(env, 'cms:applications', applications)
    await logActivity(env, {
      type: 'application',
      message: `Application ${applications[idx].email || appId} → ${status}`,
    })
    const { resumeData: _omit, ...safe } = applications[idx]
    return json({ ok: true, application: safe })
  }

  if (action === 'save_download') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    const item = body.download || body.item
    if (!item?.title || !item?.fileUrl) {
      return json({ error: 'title and fileUrl required' }, 400)
    }
    const list = await loadDownloads(env)
    const record = {
      id: item.id || id('dl'),
      title: String(item.title),
      description: String(item.description || ''),
      fileUrl: String(item.fileUrl),
      htmlUrl: String(item.htmlUrl || ''),
      category: String(item.category || 'company'),
      status: item.status === 'published' ? 'published' : 'draft',
      updatedAt: new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
    }
    const existing = list.findIndex((d) => d.id === record.id)
    if (existing >= 0) list[existing] = { ...list[existing], ...record }
    else list.unshift(record)
    await putJson(env, 'cms:downloads', list)
    await logActivity(env, {
      type: 'downloads',
      message: `Saved download ${record.title} (${record.status})`,
    })
    return json({ ok: true, download: record })
  }

  if (action === 'delete_download') {
    if (!(await staffOrGod(request, env))) return json({ error: 'unauthorized' }, 401)
    const list = await loadDownloads(env)
    const next = list.filter((d) => d.id !== body.id)
    await putJson(env, 'cms:downloads', next)
    await logActivity(env, { type: 'downloads', message: `Deleted download ${body.id}` })
    return json({ ok: true })
  }

  if (action === 'save_shop') {
    await putJson(env, 'cms:shop-products', body.products || [])
    await logActivity(env, { type: 'shop', message: 'Updated shop catalogue' })
    return json({ ok: true })
  }

  if (action === 'save_reviews') {
    await putJson(env, 'cms:reviews', body.reviews || [])
    return json({ ok: true })
  }

  if (action === 'update_user_role') {
    if (!godOnly) return json({ error: 'Not authorized' }, 403)
    const users = await getJson(env, 'cms:users', [])
    const idx = users.findIndex((u) => u.id === body.userId)
    if (idx < 0) return json({ error: 'user not found' }, 404)
    const role = body.role
    if (!['super_admin', 'admin', 'staff', 'customer'].includes(role)) {
      return json({ error: 'invalid role' }, 400)
    }
    users[idx].role = role
    if (body.jobTitle !== undefined) users[idx].jobTitle = String(body.jobTitle || '')
    await putJson(env, 'cms:users', users)
    await logActivity(env, {
      type: 'user',
      message: `Role updated: ${users[idx].email} → ${role}`,
    })
    return json({ ok: true })
  }

  if (action === 'set_user_active') {
    if (!godOnly) return json({ error: 'Not authorized' }, 403)
    const users = await getJson(env, 'cms:users', [])
    const idx = users.findIndex((u) => u.id === body.userId)
    if (idx < 0) return json({ error: 'user not found' }, 404)
    users[idx].active = body.active !== false
    await putJson(env, 'cms:users', users)
    await logActivity(env, {
      type: 'user',
      message: `${users[idx].active ? 'Activated' : 'Deactivated'}: ${users[idx].email}`,
    })
    return json({ ok: true })
  }

  if (action === 'create_admin_user' || action === 'create_staff_user') {
    if (!godOnly) return json({ error: 'Not authorized' }, 403)
    const email = String(body.email || '').toLowerCase().trim()
    const password = String(body.password || '')
    // Employees are staff or admin — never create God Mode via this form as default
    let role = body.role === 'admin' ? 'admin' : 'staff'
    if (body.role === 'super_admin') role = 'super_admin'
    if (!email.includes('@') || password.length < 6) {
      return json({ error: 'Valid email and password required' }, 400)
    }
    const users = await getJson(env, 'cms:users', [])
    if (users.some((u) => u.email === email)) return json({ error: 'exists' }, 409)
    const { hash, salt } = await hashPassword(password)
    users.unshift({
      id: id('user'),
      email,
      name: body.name || 'Staff',
      role,
      jobTitle: body.jobTitle || '',
      active: true,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    })
    await putJson(env, 'cms:users', users)
    await logActivity(env, {
      type: 'user',
      message: `Staff account created: ${email} (${role}${body.jobTitle ? ` · ${body.jobTitle}` : ''})`,
    })
    return json({ ok: true })
  }

  if (action === 'backup' || action === 'restore_latest') {
    if (!godOnly) return json({ error: 'Not authorized' }, 403)
  }

  if (action === 'notify') {
    const list = await getJson(env, 'cms:notifications', [])
    list.unshift({
      id: id('note'),
      title: body.title || 'Notification',
      body: body.body || '',
      at: new Date().toISOString(),
      read: false,
    })
    await putJson(env, 'cms:notifications', list.slice(0, 100))
    return json({ ok: true })
  }

  if (action === 'backup') {
    const backup = {
      at: new Date().toISOString(),
      pages: await getJson(env, 'cms:pages', []),
      siteCopy: await getJson(env, 'cms:site-copy', {}),
      shop: await getJson(env, 'cms:shop-products', []),
      knowledge: await getJson(env, 'cms:knowledge', []),
      downloads: await getJson(env, 'cms:downloads', []),
      reviews: await getJson(env, 'cms:reviews', []),
      newsletter: await getJson(env, 'cms:newsletter', []),
      leads: await getJson(env, 'cms:leads', []),
      invoices: await getJson(env, 'cms:invoices', []),
      settings: await getJson(env, 'cms:settings', defaultSiteSettings()),
      jobs: await getJson(env, 'cms:jobs', []),
      applications: await getJson(env, 'cms:applications', []),
    }
    await putJson(env, `cms:backup:${Date.now()}`, backup)
    await putJson(env, 'cms:backup:latest', backup)
    return json({ ok: true, backup })
  }

  if (action === 'restore_latest') {
    const backup = await getJson(env, 'cms:backup:latest', null)
    if (!backup) return json({ error: 'no backup' }, 404)
    if (backup.pages) await putJson(env, 'cms:pages', backup.pages)
    if (backup.siteCopy) await putJson(env, 'cms:site-copy', backup.siteCopy)
    if (backup.shop) await putJson(env, 'cms:shop-products', backup.shop)
    if (backup.knowledge) await putJson(env, 'cms:knowledge', backup.knowledge)
    if (backup.downloads) await putJson(env, 'cms:downloads', backup.downloads)
    if (backup.reviews) await putJson(env, 'cms:reviews', backup.reviews)
    if (backup.newsletter) await putJson(env, 'cms:newsletter', backup.newsletter)
    if (backup.leads) await putJson(env, 'cms:leads', backup.leads)
    if (backup.invoices) await putJson(env, 'cms:invoices', backup.invoices)
    if (backup.settings) await putJson(env, 'cms:settings', backup.settings)
    if (backup.jobs) await putJson(env, 'cms:jobs', backup.jobs)
    if (backup.applications) await putJson(env, 'cms:applications', backup.applications)
    await logActivity(env, { type: 'system', message: 'Restored latest backup' })
    return json({ ok: true })
  }

  if (action === 'save_invoice') {
    const invoices = await getJson(env, 'cms:invoices', [])
    const input = body.invoice || {}
    if (!input.clientName || !input.clientEmail) {
      return json({ error: 'client name and email required' }, 400)
    }
    const items = Array.isArray(input.items) ? input.items : []
    const subtotal = items.reduce(
      (sum, row) => sum + Number(row.qty || 0) * Number(row.unitPrice || 0),
      0,
    )
    const tax = Number(input.tax || 0)
    const total = subtotal + tax
    const existing = invoices.findIndex((i) => i.id === input.id)
    const record = {
      id: input.id || id('inv'),
      number:
        input.number ||
        `ET-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
      publicToken: input.publicToken || id('tok').replace('tok_', ''),
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone || '',
      clientCompany: input.clientCompany || '',
      items,
      currency: input.currency || 'KES',
      subtotal,
      tax,
      total,
      status: input.status || 'draft',
      notes: input.notes || '',
      dueDate: input.dueDate || '',
      createdAt: input.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: input.paidAt || null,
      paymentMethod: input.paymentMethod || '',
      paymentRef: input.paymentRef || '',
      receiptNumber: input.receiptNumber || null,
    }
    if (existing >= 0) invoices[existing] = { ...invoices[existing], ...record }
    else invoices.unshift(record)
    await putJson(env, 'cms:invoices', invoices)
    await logActivity(env, {
      type: 'invoice',
      message: `Invoice ${record.number} saved (${record.status})`,
    })
    return json({ ok: true, invoice: record })
  }

  if (action === 'mark_invoice_paid') {
    const invoices = await getJson(env, 'cms:invoices', [])
    const idx = invoices.findIndex((i) => i.id === body.id)
    if (idx < 0) return json({ error: 'invoice not found' }, 404)
    const receiptNumber =
      invoices[idx].receiptNumber ||
      `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    invoices[idx] = {
      ...invoices[idx],
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentMethod: body.paymentMethod || invoices[idx].paymentMethod || 'M-Pesa / Bank',
      paymentRef: body.paymentRef || invoices[idx].paymentRef || '',
      receiptNumber,
      updatedAt: new Date().toISOString(),
    }
    await putJson(env, 'cms:invoices', invoices)
    await logActivity(env, {
      type: 'receipt',
      message: `Receipt ${receiptNumber} for invoice ${invoices[idx].number}`,
    })
    const inv = invoices[idx]
    let emailResult = { sent: false, reason: 'skipped' }
    if (inv.clientEmail) {
      const origin = new URL(request.url).origin
      const link = `${origin}/invoice/${inv.id}?token=${inv.publicToken}`
      emailResult = await sendResendEmail(env, {
        to: inv.clientEmail,
        subject: `Ellines Tech — receipt ${receiptNumber}`,
        html: `<p>Hi ${inv.clientName || 'there'},</p>
<p>Payment received. Your receipt <strong>${receiptNumber}</strong> for invoice ${inv.number} is ready.</p>
<p>Total: ${inv.currency} ${Number(inv.total).toLocaleString()}</p>
<p><a href="${link}">View receipt</a></p>
<p>— Ellines Tech</p>`,
      })
      if (!emailResult.sent) {
        const notes = await getJson(env, 'cms:notifications', [])
        notes.unshift({
          id: id('note'),
          title: 'Receipt email queued',
          body: `Receipt ${receiptNumber} for ${inv.clientEmail} — email not sent (${emailResult.reason || 'no_key'}).`,
          at: new Date().toISOString(),
          read: false,
          kind: 'email_queue',
          invoiceId: inv.id,
        })
        await putJson(env, 'cms:notifications', notes.slice(0, 100))
      }
    }
    return json({ ok: true, invoice: inv, email: emailResult })
  }

  if (action === 'delete_invoice') {
    const invoices = await getJson(env, 'cms:invoices', [])
    await putJson(
      env,
      'cms:invoices',
      invoices.filter((i) => i.id !== body.id),
    )
    return json({ ok: true })
  }

  return json({ error: 'unknown action' }, 400)
}

function defaultSiteCopy() {
  return {
    home: {
      heroHeadline: 'Ellines Tech',
      heroSub:
        'Software applications, mobile apps, and digital solutions — executed from start to finish.',
      storyTitle: 'We execute our ideas from start to finish',
      storyBody:
        'We bring ideas to life meticulously — quality, innovation, and results aligned with your vision.',
      groupTitle: 'Ellines Group',
      groupBody:
        'Ellines Group is the parent company behind Ellines Tech, Ellines Haven, and Ellines Rattan — technology, publishing, and furniture under one vision.',
    },
    about: {
      title: 'Who We Are',
      lead:
        'With years of experience in IT services, Ellines Tech crafts cutting-edge software and mobile apps for clients around the globe.',
      groupTitle: 'Ellines Group',
      groupBody:
        'Ellines Tech is the technology arm of Ellines Group — alongside Ellines Haven and Ellines Rattan (Furniture).',
    },
  }
}

function defaultShop() {
  return [
    {
      "id": "career_resume_student",
      "name": "Student Resume — Education Only",
      "price": 1000,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Student",
      "description": "Clean ATS resume for students with education only — no work or volunteer history yet.",
      "status": "published",
      "image": "/media/posters/packages/career_resume_student.jpg",
      "groupId": "career_resume",
      "groupName": "Resume Writing",
      "tierLabel": "Student — education only",
      "experienceBand": "Students · no work history yet"
    },
    {
      "id": "career_resume_student_plus",
      "name": "Student Resume — With Attachments",
      "price": 1500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Student",
      "description": "Student CV plus volunteer, attachments, campus roles, or projects — still accessible pricing.",
      "status": "published",
      "image": "/media/posters/packages/career_resume_student_plus.jpg",
      "groupId": "career_resume",
      "groupName": "Resume Writing",
      "tierLabel": "Student — with attachments",
      "experienceBand": "Campus roles · projects · volunteer"
    },
    {
      "id": "career_resume_build",
      "name": "Entry Career Resume (≤2 yrs)",
      "price": 2500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Entry",
      "description": "First professional resume for graduates and early talent — structure, keywords, and clear achievements.",
      "status": "published",
      "image": "/media/posters/packages/career_resume_build.jpg",
      "groupId": "career_resume",
      "groupName": "Resume Writing",
      "tierLabel": "Entry (≤2 years)",
      "experienceBand": "Graduates & early talent"
    },
    {
      "id": "career_resume_revamp",
      "name": "Resume Revamp / Refresh",
      "price": 2000,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Entry",
      "description": "Polish an existing CV into a neat, ATS-friendly format — ideal when content exists but layout needs work.",
      "status": "published",
      "image": "/media/posters/packages/career_resume_revamp.jpg",
      "groupId": "career_resume",
      "groupName": "Resume Writing",
      "tierLabel": "Revamp / refresh",
      "experienceBand": "Existing CV · needs polish"
    },
    {
      "id": "career_resume_mid",
      "name": "Mid-Career Resume (3–7 yrs)",
      "price": 4500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Mid",
      "description": "Role-targeted CV for established professionals — impact bullets, skills mapping, and role keywords.",
      "status": "published",
      "image": "/media/posters/packages/career_resume_mid.jpg",
      "groupId": "career_resume",
      "groupName": "Resume Writing",
      "tierLabel": "Mid-career (3–7 years)",
      "experienceBand": "Established professionals"
    },
    {
      "id": "career_resume_senior",
      "name": "Senior Resume (8–15 yrs)",
      "price": 7500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Senior",
      "description": "Leadership and specialist CV for managers and senior ICs — scope, outcomes, and market positioning.",
      "status": "published",
      "image": "/media/posters/packages/career_resume_senior.jpg",
      "groupId": "career_resume",
      "groupName": "Resume Writing",
      "tierLabel": "Senior (8–15 years)",
      "experienceBand": "Managers & senior ICs"
    },
    {
      "id": "career_resume_executive",
      "name": "Executive / C-Level Resume",
      "price": 12000,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Executive",
      "description": "Board-ready executive CV with career narrative, strategic impact, and C-suite framing.",
      "status": "published",
      "image": "/media/posters/packages/career_resume_executive.jpg",
      "groupId": "career_resume",
      "groupName": "Resume Writing",
      "tierLabel": "Executive / C-level",
      "experienceBand": "Board & C-suite"
    },
    {
      "id": "career_cover_student",
      "name": "Student Cover Letter",
      "price": 300,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Student",
      "description": "Short, confident cover letter for internships, attachments, and first roles.",
      "status": "published",
      "image": "/media/posters/packages/career_cover_student.jpg",
      "groupId": "career_cover",
      "groupName": "Cover Letter",
      "tierLabel": "Student",
      "experienceBand": "Internships · attachments · first roles"
    },
    {
      "id": "career_cover_letter",
      "name": "Cover Letter — 1–2 Years Experience",
      "price": 500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Entry",
      "description": "Tailored cover letter matched to your CV and target role — clear value in one page.",
      "status": "published",
      "image": "/media/posters/packages/career_cover_letter.jpg",
      "groupId": "career_cover",
      "groupName": "Cover Letter",
      "tierLabel": "1–2 years",
      "experienceBand": "Early professional experience"
    },
    {
      "id": "career_cover_mid",
      "name": "Cover Letter — 3–5 Years Experience",
      "price": 550,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Mid",
      "description": "Role-targeted letter for professionals with a few years of proven delivery — concise impact storytelling.",
      "status": "published",
      "image": "/media/posters/packages/career_cover_letter.jpg",
      "groupId": "career_cover",
      "groupName": "Cover Letter",
      "tierLabel": "3–5 years",
      "experienceBand": "Growing mid-level careers"
    },
    {
      "id": "career_cover_senior",
      "name": "Cover Letter — 5+ Years Experience",
      "price": 600,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Senior",
      "description": "Leadership-tone cover letter for senior and specialist applications.",
      "status": "published",
      "image": "/media/posters/packages/career_cover_senior.jpg",
      "groupId": "career_cover",
      "groupName": "Cover Letter",
      "tierLabel": "5+ years",
      "experienceBand": "Senior & specialist applicants"
    },
    {
      "id": "career_cover_executive",
      "name": "Executive Cover Letter",
      "price": 650,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Executive",
      "description": "Executive briefing-style letter for C-level, board, and senior leadership openings.",
      "status": "published",
      "image": "/media/posters/packages/career_cover_executive.jpg",
      "groupId": "career_cover",
      "groupName": "Cover Letter",
      "tierLabel": "Executive",
      "experienceBand": "C-level · board · senior leadership"
    },
    {
      "id": "career_linkedin_entry",
      "name": "LinkedIn Profile Starter",
      "price": 2200,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Entry",
      "description": "Headline, About, and photo guidance so recruiters can find you faster.",
      "status": "published",
      "image": "/media/posters/packages/career_linkedin.jpg",
      "groupId": "career_linkedin",
      "groupName": "LinkedIn Profile",
      "tierLabel": "Starter",
      "experienceBand": "Students & early career"
    },
    {
      "id": "career_linkedin",
      "name": "LinkedIn Profile Optimisation",
      "price": 3500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Mid",
      "description": "Headline, About, and experience rewrite so recruiters find you faster.",
      "status": "published",
      "image": "/media/posters/packages/career_linkedin.jpg",
      "groupId": "career_linkedin",
      "groupName": "LinkedIn Profile",
      "tierLabel": "Professional",
      "experienceBand": "Mid-career professionals"
    },
    {
      "id": "career_linkedin_exec",
      "name": "Executive LinkedIn Branding",
      "price": 6500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Executive",
      "description": "Executive personal brand on LinkedIn — positioning, featured narrative, and thought-leadership framing.",
      "status": "published",
      "image": "/media/posters/packages/career_linkedin_exec.jpg",
      "groupId": "career_linkedin",
      "groupName": "LinkedIn Profile",
      "tierLabel": "Executive branding",
      "experienceBand": "Leaders & executives"
    },
    {
      "id": "career_docs_bundle",
      "name": "Starter Career Docs Bundle",
      "price": 3500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Entry",
      "description": "Entry resume + cover letter together — save versus buying separately.",
      "status": "published",
      "image": "/media/posters/packages/career_docs_bundle.jpg",
      "groupId": "career_bundle",
      "groupName": "Career Docs Bundle",
      "tierLabel": "Starter",
      "experienceBand": "Resume + cover letter"
    },
    {
      "id": "career_docs_bundle_pro",
      "name": "Professional Career Docs Bundle",
      "price": 8500,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Mid",
      "description": "Mid-career resume + cover letter + LinkedIn optimisation in one package.",
      "status": "published",
      "image": "/media/posters/packages/career_docs_bundle_pro.jpg",
      "groupId": "career_bundle",
      "groupName": "Career Docs Bundle",
      "tierLabel": "Professional",
      "experienceBand": "Resume + letter + LinkedIn"
    },
    {
      "id": "career_docs_bundle_exec",
      "name": "Executive Career Docs Bundle",
      "price": 18000,
      "currency": "KES",
      "category": "Career Documents",
      "level": "Executive",
      "description": "Executive resume + executive cover letter + LinkedIn branding — full leadership pack.",
      "status": "published",
      "image": "/media/posters/packages/career_docs_bundle_exec.jpg",
      "groupId": "career_bundle",
      "groupName": "Career Docs Bundle",
      "tierLabel": "Executive",
      "experienceBand": "Full leadership pack"
    },
    {
      "id": "shop_landing_web",
      "name": "Landing Page Website",
      "price": 15000,
      "currency": "KES",
      "category": "Web",
      "level": "Starter",
      "description": "Focused one-page site — hero, offers, and contact — ready to launch fast.",
      "status": "published",
      "image": "/media/posters/packages/shop_starter_web.jpg",
      "groupId": "web_site",
      "groupName": "Business Website",
      "tierLabel": "Landing page",
      "experienceBand": "Pocket · single-page launch"
    },
    {
      "id": "shop_starter_web",
      "name": "Business Website Starter",
      "price": 25000,
      "currency": "KES",
      "category": "Web",
      "level": "Starter",
      "description": "One-page to multi-page business website — design, build, and launch.",
      "status": "published",
      "image": "/media/posters/packages/shop_starter_web.jpg",
      "groupId": "web_site",
      "groupName": "Business Website",
      "tierLabel": "Starter multi-page",
      "experienceBand": "Small business presence"
    },
    {
      "id": "shop_business_web",
      "name": "Business Website Pro",
      "price": 55000,
      "currency": "KES",
      "category": "Web",
      "level": "Business",
      "description": "Multi-page site with CMS-ready structure, contact flows, and SEO basics.",
      "status": "published",
      "image": "/media/posters/packages/shop_business_web.jpg",
      "groupId": "web_site",
      "groupName": "Business Website",
      "tierLabel": "Business Pro",
      "experienceBand": "CMS-ready · SEO basics"
    },
    {
      "id": "shop_ecommerce",
      "name": "E-commerce Storefront",
      "price": 95000,
      "currency": "KES",
      "category": "Web",
      "level": "Growth",
      "description": "Online storefront for products, carts, payments readiness, and order enquiries.",
      "status": "published",
      "image": "/media/posters/packages/shop_ecommerce.jpg",
      "groupId": "web_site",
      "groupName": "Business Website",
      "tierLabel": "E-commerce",
      "experienceBand": "Products · carts · payments"
    },
    {
      "id": "shop_logo_pack",
      "name": "Logo Identity Pack",
      "price": 8000,
      "currency": "KES",
      "category": "Design",
      "level": "Starter",
      "description": "Logo concepts, revisions, and delivery formats for brand launch.",
      "status": "published",
      "image": "/media/posters/packages/shop_logo_pack.jpg",
      "groupId": "design_logo",
      "groupName": "Logo Design",
      "tierLabel": "Starter pack",
      "experienceBand": "Concepts + delivery files"
    },
    {
      "id": "shop_logo_pro",
      "name": "Logo System Pro",
      "price": 14000,
      "currency": "KES",
      "category": "Design",
      "level": "Business",
      "description": "Expanded logo system — primary/secondary marks, lockups, and usage guidance.",
      "status": "published",
      "image": "/media/posters/packages/shop_logo_pack.jpg",
      "groupId": "design_logo",
      "groupName": "Logo Design",
      "tierLabel": "Pro system",
      "experienceBand": "Variations · lockups · usage"
    },
    {
      "id": "shop_logo_premium",
      "name": "Premium Logo Identity",
      "price": 20000,
      "currency": "KES",
      "category": "Design",
      "level": "Professional",
      "description": "Premium identity mark suite with mono/colour versions and concise brand notes.",
      "status": "published",
      "image": "/media/posters/packages/shop_logo_pack.jpg",
      "groupId": "design_logo",
      "groupName": "Logo Design",
      "tierLabel": "Premium identity",
      "experienceBand": "Full mark suite + guidelines"
    },
    {
      "id": "shop_brand_kit",
      "name": "Brand Identity Kit",
      "price": 22000,
      "currency": "KES",
      "category": "Design",
      "level": "Business",
      "description": "Logo, colour system, typography, and basic brand guidelines.",
      "status": "published",
      "image": "/media/posters/packages/shop_brand_kit.jpg",
      "groupId": "design_brand_kit",
      "groupName": "Brand Identity Kit",
      "tierLabel": "Essentials",
      "experienceBand": "Logo · colour · type"
    },
    {
      "id": "shop_brand_kit_full",
      "name": "Brand Identity Kit — Full",
      "price": 38000,
      "currency": "KES",
      "category": "Design",
      "level": "Professional",
      "description": "Expanded brand kit with guidelines PDF, social templates, and asset library.",
      "status": "published",
      "image": "/media/posters/packages/shop_brand_kit.jpg",
      "groupId": "design_brand_kit",
      "groupName": "Brand Identity Kit",
      "tierLabel": "Full kit",
      "experienceBand": "Guidelines + asset library"
    },
    {
      "id": "shop_uiux",
      "name": "UI/UX Design Package",
      "price": 45000,
      "currency": "KES",
      "category": "Design",
      "level": "Professional",
      "description": "Wireframes and high-fidelity screens for web or mobile products.",
      "status": "published",
      "image": "/media/posters/packages/shop_uiux.jpg",
      "groupId": "design_uiux",
      "groupName": "UI/UX Design",
      "tierLabel": "Core screens",
      "experienceBand": "Wireframes + hi-fi"
    },
    {
      "id": "shop_uiux_full",
      "name": "UI/UX Product System",
      "price": 95000,
      "currency": "KES",
      "category": "Design",
      "level": "Enterprise",
      "description": "End-to-end product UI — key flows, component set, and developer handoff.",
      "status": "published",
      "image": "/media/posters/packages/shop_uiux.jpg",
      "groupId": "design_uiux",
      "groupName": "UI/UX Design",
      "tierLabel": "Product system",
      "experienceBand": "Flows · components · handoff"
    },
    {
      "id": "shop_custom_software",
      "name": "Custom Software Starter",
      "price": 95000,
      "currency": "KES",
      "category": "Software",
      "level": "Starter",
      "description": "Scoped business system or internal tool with discovery and first release.",
      "status": "published",
      "image": "/media/posters/packages/shop_custom_software.jpg",
      "groupId": "software_custom",
      "groupName": "Custom Software",
      "tierLabel": "Starter",
      "experienceBand": "Discovery + first release"
    },
    {
      "id": "shop_custom_software_growth",
      "name": "Custom Software Growth",
      "price": 180000,
      "currency": "KES",
      "category": "Software",
      "level": "Growth",
      "description": "Multi-module business system with integrations and staged delivery.",
      "status": "published",
      "image": "/media/posters/packages/shop_custom_software.jpg",
      "groupId": "software_custom",
      "groupName": "Custom Software",
      "tierLabel": "Growth",
      "experienceBand": "Multi-module build"
    },
    {
      "id": "shop_custom_software_enterprise",
      "name": "Custom Software Enterprise",
      "price": 350000,
      "currency": "KES",
      "category": "Software",
      "level": "Enterprise",
      "description": "Enterprise-grade build — architecture, security posture, and multi-stakeholder delivery.",
      "status": "published",
      "image": "/media/posters/packages/shop_custom_software.jpg",
      "groupId": "software_custom",
      "groupName": "Custom Software",
      "tierLabel": "Enterprise",
      "experienceBand": "Complex ops · scale"
    },
    {
      "id": "shop_mobile_app",
      "name": "Mobile App MVP",
      "price": 180000,
      "currency": "KES",
      "category": "Software",
      "level": "Growth",
      "description": "Cross-platform MVP app scope — core screens, auth, and API wiring.",
      "status": "published",
      "image": "/media/posters/packages/shop_mobile_app.jpg",
      "groupId": "software_mobile",
      "groupName": "Mobile App",
      "tierLabel": "MVP",
      "experienceBand": "Core screens · auth · API"
    },
    {
      "id": "shop_mobile_app_growth",
      "name": "Mobile App Growth",
      "price": 320000,
      "currency": "KES",
      "category": "Software",
      "level": "Professional",
      "description": "Expanded mobile product — richer features, polish, and release readiness.",
      "status": "published",
      "image": "/media/posters/packages/shop_mobile_app.jpg",
      "groupId": "software_mobile",
      "groupName": "Mobile App",
      "tierLabel": "Growth",
      "experienceBand": "Richer features · polish"
    },
    {
      "id": "shop_ai_automation",
      "name": "AI Automation Starter",
      "price": 65000,
      "currency": "KES",
      "category": "AI",
      "level": "Starter",
      "description": "Chatbot or workflow automation tailored to your operations.",
      "status": "published",
      "image": "/media/posters/packages/shop_ai_automation.jpg",
      "groupId": "ai_automation",
      "groupName": "AI Automation",
      "tierLabel": "Starter",
      "experienceBand": "Chatbot or workflow kickoff"
    },
    {
      "id": "shop_ai_automation_growth",
      "name": "AI Automation Growth",
      "price": 120000,
      "currency": "KES",
      "category": "AI",
      "level": "Growth",
      "description": "Multi-flow automation with CRM/tools wiring and operator playbooks.",
      "status": "published",
      "image": "/media/posters/packages/shop_ai_automation.jpg",
      "groupId": "ai_automation",
      "groupName": "AI Automation",
      "tierLabel": "Growth",
      "experienceBand": "Multi-flow automation"
    },
    {
      "id": "shop_ai_automation_enterprise",
      "name": "AI Automation Enterprise",
      "price": 220000,
      "currency": "KES",
      "category": "AI",
      "level": "Enterprise",
      "description": "Organisation-wide AI automation programme with governance and staged rollout.",
      "status": "published",
      "image": "/media/posters/packages/shop_ai_automation.jpg",
      "groupId": "ai_automation",
      "groupName": "AI Automation",
      "tierLabel": "Enterprise",
      "experienceBand": "Ops-wide AI programme"
    },
    {
      "id": "shop_digital_marketing",
      "name": "Digital Marketing Starter",
      "price": 25000,
      "currency": "KES",
      "category": "Marketing",
      "level": "Starter",
      "description": "Campaign setup, social assets, and performance tracking kickoff.",
      "status": "published",
      "image": "/media/posters/packages/shop_digital_marketing.jpg",
      "groupId": "marketing_digital",
      "groupName": "Digital Marketing",
      "tierLabel": "Starter",
      "experienceBand": "Campaign kickoff month"
    },
    {
      "id": "shop_digital_marketing_growth",
      "name": "Digital Marketing Growth",
      "price": 55000,
      "currency": "KES",
      "category": "Marketing",
      "level": "Growth",
      "description": "Multi-channel campaign month — creatives, ads setup support, and weekly performance reviews.",
      "status": "published",
      "image": "/media/posters/packages/shop_digital_marketing_growth.jpg",
      "groupId": "marketing_digital",
      "groupName": "Digital Marketing",
      "tierLabel": "Growth",
      "experienceBand": "Multi-channel month"
    },
    {
      "id": "shop_digital_marketing_retainer",
      "name": "Digital Marketing Retainer",
      "price": 95000,
      "currency": "KES",
      "category": "Marketing",
      "level": "Professional",
      "description": "Monthly growth retainer — creatives, campaigns, and reporting cadence.",
      "status": "published",
      "image": "/media/posters/packages/shop_digital_marketing_growth.jpg",
      "groupId": "marketing_digital",
      "groupName": "Digital Marketing",
      "tierLabel": "Retainer",
      "experienceBand": "Ongoing growth partner"
    },
    {
      "id": "shop_cyber_audit",
      "name": "Cyber Security Review",
      "price": 35000,
      "currency": "KES",
      "category": "Security",
      "level": "Business",
      "description": "Baseline security review for websites and apps with actionable fixes.",
      "status": "published",
      "image": "/media/posters/packages/shop_cyber_audit.jpg",
      "groupId": "security_audit",
      "groupName": "Cyber Security",
      "tierLabel": "Baseline review",
      "experienceBand": "Websites & apps"
    },
    {
      "id": "shop_cyber_audit_enterprise",
      "name": "Cyber Security Deep Audit",
      "price": 85000,
      "currency": "KES",
      "category": "Security",
      "level": "Enterprise",
      "description": "Expanded security assessment — threat surface review, prioritised remediation, and stakeholder briefing.",
      "status": "published",
      "image": "/media/posters/packages/shop_cyber_audit_enterprise.jpg",
      "groupId": "security_audit",
      "groupName": "Cyber Security",
      "tierLabel": "Deep audit",
      "experienceBand": "Threat surface + briefing"
    },
    {
      "id": "shop_cyber_programme",
      "name": "Cyber Security Programme",
      "price": 150000,
      "currency": "KES",
      "category": "Security",
      "level": "Enterprise",
      "description": "Multi-week security programme — hardening roadmap, checks, and executive updates.",
      "status": "published",
      "image": "/media/posters/packages/shop_cyber_audit_enterprise.jpg",
      "groupId": "security_audit",
      "groupName": "Cyber Security",
      "tierLabel": "Security programme",
      "experienceBand": "Ongoing hardening"
    },
    {
      "id": "consult_it_halfday",
      "name": "IT Consulting (half day)",
      "price": 25000,
      "currency": "KES",
      "category": "Consulting",
      "level": "Starter",
      "description": "Focused advisory session — systems review, decisions, and next steps.",
      "status": "published",
      "image": "/media/posters/packages/consult_it_halfday.jpg",
      "groupId": "consulting_it",
      "groupName": "IT Consulting",
      "tierLabel": "Half day",
      "experienceBand": "Focused advisory session"
    },
    {
      "id": "consult_it_fullday",
      "name": "IT Consulting (full day)",
      "price": 45000,
      "currency": "KES",
      "category": "Consulting",
      "level": "Business",
      "description": "Deep-dive workshop with stakeholders — architecture, priorities, and roadmap sketch.",
      "status": "published",
      "image": "/media/posters/packages/consult_it_fullday.jpg",
      "groupId": "consulting_it",
      "groupName": "IT Consulting",
      "tierLabel": "Full day",
      "experienceBand": "Stakeholder workshop"
    },
    {
      "id": "consult_tech_roadmap",
      "name": "Technology Roadmap Package",
      "price": 120000,
      "currency": "KES",
      "category": "Consulting",
      "level": "Professional",
      "description": "Multi-week advisory: assessment, target architecture, and prioritised delivery plan.",
      "status": "published",
      "image": "/media/posters/packages/consult_tech_roadmap.jpg",
      "groupId": "consulting_it",
      "groupName": "IT Consulting",
      "tierLabel": "Technology roadmap",
      "experienceBand": "Multi-week advisory"
    },
    {
      "id": "consult_digital_transform",
      "name": "Digital Transformation Programme",
      "price": 180000,
      "currency": "KES",
      "category": "Consulting",
      "level": "Enterprise",
      "description": "Current-state audit, initiative backlog, and change-ready transformation plan.",
      "status": "published",
      "image": "/media/posters/packages/consult_digital_transform.jpg",
      "groupId": "consulting_it",
      "groupName": "IT Consulting",
      "tierLabel": "Digital transformation",
      "experienceBand": "Programme-level change"
    },
    {
      "id": "tax_kenya_return",
      "name": "Kenya Tax Return Filing",
      "price": 500,
      "currency": "KES",
      "category": "Tax & Compliance",
      "level": "Starter",
      "description": "Individual Kenya tax return filing assistance — KRA iTax support at an accessible rate.",
      "status": "published",
      "image": "/media/posters/packages/tax_kenya_return.jpg",
      "groupId": "tax_kenya",
      "groupName": "Kenya Tax & iTax",
      "tierLabel": "Individual return",
      "experienceBand": "Accessible filing assist"
    },
    {
      "id": "tax_kenya_pin_assist",
      "name": "KRA PIN / iTax Assist",
      "price": 800,
      "currency": "KES",
      "category": "Tax & Compliance",
      "level": "Entry",
      "description": "Help creating or recovering KRA PIN and basic iTax account setup.",
      "status": "published",
      "image": "/media/posters/packages/tax_kenya_pin_assist.jpg",
      "groupId": "tax_kenya",
      "groupName": "Kenya Tax & iTax",
      "tierLabel": "PIN / iTax setup",
      "experienceBand": "Account create or recover"
    },
    {
      "id": "tax_kenya_sme",
      "name": "SME Tax Filing Assist",
      "price": 3500,
      "currency": "KES",
      "category": "Tax & Compliance",
      "level": "Business",
      "description": "Small-business return support — books check, iTax filing guidance, and compliance notes.",
      "status": "published",
      "image": "/media/posters/packages/tax_kenya_sme.jpg",
      "groupId": "tax_kenya",
      "groupName": "Kenya Tax & iTax",
      "tierLabel": "SME filing",
      "experienceBand": "Small-business returns"
    },
    {
      "id": "tech_os_install",
      "name": "OS Installation",
      "price": 2500,
      "currency": "KES",
      "category": "Tech Support",
      "level": "Starter",
      "description": "Windows or Linux OS installation / reinstall with drivers and essential updates.",
      "status": "published",
      "image": "/media/posters/packages/tech_os_install.jpg",
      "groupId": "tech_os",
      "groupName": "OS & Device Setup",
      "tierLabel": "OS install",
      "experienceBand": "Windows or Linux"
    },
    {
      "id": "tech_os_install_office",
      "name": "OS Install + Office Setup",
      "price": 4500,
      "currency": "KES",
      "category": "Tech Support",
      "level": "Business",
      "description": "OS installation plus productivity suite setup and basic optimisation.",
      "status": "published",
      "image": "/media/posters/packages/tech_os_install_office.jpg",
      "groupId": "tech_os",
      "groupName": "OS & Device Setup",
      "tierLabel": "OS + Office",
      "experienceBand": "Productivity suite ready"
    },
    {
      "id": "tech_os_tuneup",
      "name": "Device Full Tune-Up",
      "price": 6500,
      "currency": "KES",
      "category": "Tech Support",
      "level": "Professional",
      "description": "Full device tune-up — cleanup, updates, performance, and basic security hygiene.",
      "status": "published",
      "image": "/media/posters/packages/tech_os_install_office.jpg",
      "groupId": "tech_os",
      "groupName": "OS & Device Setup",
      "tierLabel": "Full tune-up",
      "experienceBand": "Speed · cleanup · security basics"
    },
    {
      "id": "tech_app_testing",
      "name": "App Testing (starter)",
      "price": 15000,
      "currency": "KES",
      "category": "QA & Testing",
      "level": "Starter",
      "description": "Manual functional testing for web or mobile apps with a clear bug report.",
      "status": "published",
      "image": "/media/posters/packages/tech_app_testing.jpg",
      "groupId": "qa_testing",
      "groupName": "App Testing",
      "tierLabel": "Starter",
      "experienceBand": "Functional pass + bug report"
    },
    {
      "id": "tech_app_testing_full",
      "name": "App Testing (full cycle)",
      "price": 45000,
      "currency": "KES",
      "category": "QA & Testing",
      "level": "Professional",
      "description": "Broader test plan — functional, UI, and regression checks with prioritised findings.",
      "status": "published",
      "image": "/media/posters/packages/tech_app_testing_full.jpg",
      "groupId": "qa_testing",
      "groupName": "App Testing",
      "tierLabel": "Full cycle",
      "experienceBand": "Functional · UI · regression"
    },
    {
      "id": "tech_app_testing_enterprise",
      "name": "App Testing (enterprise)",
      "price": 85000,
      "currency": "KES",
      "category": "QA & Testing",
      "level": "Enterprise",
      "description": "Release-gate testing programme with severity matrix and stakeholder-ready report.",
      "status": "published",
      "image": "/media/posters/packages/tech_app_testing_full.jpg",
      "groupId": "qa_testing",
      "groupName": "App Testing",
      "tierLabel": "Enterprise",
      "experienceBand": "Release gates · stakeholder report"
    },
    {
      "id": "brand_identity_session",
      "name": "Brand Identity Session",
      "price": 20000,
      "currency": "KES",
      "category": "Branding",
      "level": "Starter",
      "description": "Brand discovery workshop — positioning, voice, and visual direction for your business.",
      "status": "published",
      "image": "/media/posters/packages/brand_identity_session.jpg",
      "groupId": "branding_biz",
      "groupName": "Business Branding",
      "tierLabel": "Identity session",
      "experienceBand": "Discovery workshop"
    },
    {
      "id": "brand_full_kit",
      "name": "Full Branding Kit",
      "price": 55000,
      "currency": "KES",
      "category": "Branding",
      "level": "Business",
      "description": "Logo system, colours, typography, and brand board ready for print and digital.",
      "status": "published",
      "image": "/media/posters/packages/brand_full_kit.jpg",
      "groupId": "branding_biz",
      "groupName": "Business Branding",
      "tierLabel": "Full branding kit",
      "experienceBand": "Logo system + board"
    },
    {
      "id": "brand_rebrand",
      "name": "Business Rebrand Package",
      "price": 95000,
      "currency": "KES",
      "category": "Branding",
      "level": "Enterprise",
      "description": "Full rebrand — refreshed identity, messaging, and rollout assets for an existing business.",
      "status": "published",
      "image": "/media/posters/packages/brand_rebrand.jpg",
      "groupId": "branding_biz",
      "groupName": "Business Branding",
      "tierLabel": "Full rebrand",
      "experienceBand": "Existing business refresh"
    },
    {
      "id": "merch_cap",
      "name": "Branded Cap (per piece)",
      "price": 800,
      "currency": "KES",
      "category": "Merchandise",
      "level": "Starter",
      "description": "Cap branding with your logo — embroidery or print options on request.",
      "status": "published",
      "image": "/media/posters/packages/merch_cap.jpg",
      "groupId": "merch_branded",
      "groupName": "Branded Merchandise",
      "tierLabel": "Cap",
      "experienceBand": "Per piece · embroidery/print"
    },
    {
      "id": "merch_phone_case",
      "name": "Phone Case Decoration",
      "price": 1000,
      "currency": "KES",
      "category": "Merchandise",
      "level": "Starter",
      "description": "Custom phone case artwork / logo decoration — model-specific production.",
      "status": "published",
      "image": "/media/posters/packages/merch_phone_case.jpg",
      "groupId": "merch_branded",
      "groupName": "Branded Merchandise",
      "tierLabel": "Phone case",
      "experienceBand": "Model-specific decoration"
    },
    {
      "id": "merch_tshirt",
      "name": "Branded T-Shirt (per piece)",
      "price": 1500,
      "currency": "KES",
      "category": "Merchandise",
      "level": "Entry",
      "description": "Company logo print on quality tee — artwork setup included. Bulk quotes available.",
      "status": "published",
      "image": "/media/posters/packages/merch_tshirt.jpg",
      "groupId": "merch_branded",
      "groupName": "Branded Merchandise",
      "tierLabel": "T-shirt",
      "experienceBand": "Per piece · bulk quotes"
    },
    {
      "id": "merch_clothing_custom",
      "name": "Custom Clothing Branding",
      "price": 2000,
      "currency": "KES",
      "category": "Merchandise",
      "level": "Mid",
      "description": "Logo branding on client-supplied or sourced apparel — priced from per piece.",
      "status": "published",
      "image": "/media/posters/packages/merch_clothing_custom.jpg",
      "groupId": "merch_branded",
      "groupName": "Branded Merchandise",
      "tierLabel": "Custom apparel",
      "experienceBand": "Client-supplied or sourced"
    },
    {
      "id": "merch_hoodie",
      "name": "Branded Hoodie (per piece)",
      "price": 3500,
      "currency": "KES",
      "category": "Merchandise",
      "level": "Business",
      "description": "Hoodie with company logo branding for teams and events.",
      "status": "published",
      "image": "/media/posters/packages/merch_hoodie.jpg",
      "groupId": "merch_branded",
      "groupName": "Branded Merchandise",
      "tierLabel": "Hoodie",
      "experienceBand": "Teams & events"
    },
    {
      "id": "design_flyer",
      "name": "Flyer / Handbill Design",
      "price": 3500,
      "currency": "KES",
      "category": "Graphics",
      "level": "Starter",
      "description": "Print-ready flyer design with your brand message and call to action.",
      "status": "published",
      "image": "/media/posters/packages/design_flyer.jpg",
      "groupId": "graphics_design",
      "groupName": "Graphics Design",
      "tierLabel": "Flyer / handbill",
      "experienceBand": "Print-ready single piece"
    },
    {
      "id": "design_campaign_poster",
      "name": "Campaign Poster Design",
      "price": 5000,
      "currency": "KES",
      "category": "Graphics",
      "level": "Entry",
      "description": "Original campaign poster design for print and digital — one concept + revisions.",
      "status": "published",
      "image": "/media/posters/packages/design_campaign_poster.jpg",
      "groupId": "graphics_design",
      "groupName": "Graphics Design",
      "tierLabel": "Campaign poster",
      "experienceBand": "One concept + revisions"
    },
    {
      "id": "design_graphics_pack",
      "name": "Graphics Design Pack",
      "price": 10000,
      "currency": "KES",
      "category": "Graphics",
      "level": "Business",
      "description": "Social and marketing graphics pack — posts, story frames, and brand-aligned assets.",
      "status": "published",
      "image": "/media/posters/packages/design_graphics_pack.jpg",
      "groupId": "graphics_design",
      "groupName": "Graphics Design",
      "tierLabel": "Social graphics pack",
      "experienceBand": "Posts · stories · frames"
    },
    {
      "id": "design_poster_set",
      "name": "Campaign Poster Set (3)",
      "price": 14000,
      "currency": "KES",
      "category": "Graphics",
      "level": "Professional",
      "description": "Set of three coordinated campaign posters for events, launches, or ads.",
      "status": "published",
      "image": "/media/posters/packages/design_poster_set.jpg",
      "groupId": "graphics_design",
      "groupName": "Graphics Design",
      "tierLabel": "Poster set (3)",
      "experienceBand": "Coordinated campaign set"
    },
    {
      "id": "stationery_stamp_seal",
      "name": "Stamp / Seal Design",
      "price": 1500,
      "currency": "KES",
      "category": "Stationery",
      "level": "Starter",
      "description": "Company stamp or seal artwork for rubber stamp / digital seal use.",
      "status": "published",
      "image": "/media/posters/packages/stationery_stamp_seal.jpg",
      "groupId": "stationery_pack",
      "groupName": "Business Stationery",
      "tierLabel": "Stamp / seal",
      "experienceBand": "Rubber or digital seal"
    },
    {
      "id": "stationery_comp_slips",
      "name": "Complimentary Slips",
      "price": 2000,
      "currency": "KES",
      "category": "Stationery",
      "level": "Entry",
      "description": "With-compliments slip design matching your letterhead and brand colours.",
      "status": "published",
      "image": "/media/posters/packages/stationery_comp_slips.jpg",
      "groupId": "stationery_pack",
      "groupName": "Business Stationery",
      "tierLabel": "Compliment slips",
      "experienceBand": "With-compliments design"
    },
    {
      "id": "design_business_cards",
      "name": "Business Cards Design",
      "price": 2500,
      "currency": "KES",
      "category": "Stationery",
      "level": "Entry",
      "description": "Print-ready business card design — front/back, brand-aligned, and print-file delivery.",
      "status": "published",
      "image": "/media/posters/packages/design_business_cards.jpg",
      "groupId": "stationery_pack",
      "groupName": "Business Stationery",
      "tierLabel": "Business cards",
      "experienceBand": "Front/back print-ready"
    },
    {
      "id": "stationery_envelopes",
      "name": "Envelope Design",
      "price": 2500,
      "currency": "KES",
      "category": "Stationery",
      "level": "Mid",
      "description": "Branded envelope artwork for DL / C5 — return address and logo placement.",
      "status": "published",
      "image": "/media/posters/packages/stationery_envelopes.jpg",
      "groupId": "stationery_pack",
      "groupName": "Business Stationery",
      "tierLabel": "Envelopes",
      "experienceBand": "DL / C5 branding"
    },
    {
      "id": "stationery_letterhead",
      "name": "Letterhead Design",
      "price": 3000,
      "currency": "KES",
      "category": "Stationery",
      "level": "Mid",
      "description": "Branded letterhead template for Word/PDF — logo, contact block, and print margins.",
      "status": "published",
      "image": "/media/posters/packages/stationery_letterhead.jpg",
      "groupId": "stationery_pack",
      "groupName": "Business Stationery",
      "tierLabel": "Letterhead",
      "experienceBand": "Word/PDF template"
    },
    {
      "id": "stationery_full_pack",
      "name": "Full Rebrand Stationery Pack",
      "price": 18000,
      "currency": "KES",
      "category": "Stationery",
      "level": "Business",
      "description": "Business cards, letterhead, envelopes, complimentary slips, and stamp design as one coordinated pack.",
      "status": "published",
      "image": "/media/posters/packages/stationery_full_pack.jpg",
      "groupId": "stationery_pack",
      "groupName": "Business Stationery",
      "tierLabel": "Full stationery pack",
      "experienceBand": "Coordinated brand set"
    }
  ]
}

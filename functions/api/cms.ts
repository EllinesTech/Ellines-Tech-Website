const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-User-Token',
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
      if (changed) await putJson(env, 'cms:shop-products', products)
    }
    return json({ products })
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

  return json({ error: 'unknown resource' }, 400)
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const body = await request.json().catch(() => ({}))
  const action = body.action || 'save'

  // Public lead capture / newsletter
  if (action === 'lead') {
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
    const list = await getJson(env, 'cms:newsletter', [])
    const email = String(body.email || '').toLowerCase().trim()
    if (!email.includes('@')) return json({ error: 'invalid email' }, 400)
    if (!list.some((s) => s.email === email)) {
      list.unshift({ id: id('sub'), email, at: new Date().toISOString() })
      await putJson(env, 'cms:newsletter', list.slice(0, 2000))
    }
    return json({ ok: true })
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
    if (!godOnly) return json({ error: 'Super Admin only' }, 403)
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
    if (!godOnly) return json({ error: 'Super Admin only' }, 403)
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
    if (!godOnly) return json({ error: 'Super Admin only' }, 403)
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
    if (!godOnly) return json({ error: 'Super Admin only' }, 403)
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
      reviews: await getJson(env, 'cms:reviews', []),
      newsletter: await getJson(env, 'cms:newsletter', []),
      leads: await getJson(env, 'cms:leads', []),
      invoices: await getJson(env, 'cms:invoices', []),
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
    if (backup.reviews) await putJson(env, 'cms:reviews', backup.reviews)
    if (backup.newsletter) await putJson(env, 'cms:newsletter', backup.newsletter)
    if (backup.leads) await putJson(env, 'cms:leads', backup.leads)
    if (backup.invoices) await putJson(env, 'cms:invoices', backup.invoices)
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
      id: 'shop_starter_web',
      name: 'Business Website Starter',
      price: 45000,
      currency: 'KES',
      category: 'Web',
      description: 'One-page to multi-page business website — design, build, and launch.',
      status: 'published',
    },
    {
      id: 'shop_business_web',
      name: 'Business Website Pro',
      price: 85000,
      currency: 'KES',
      category: 'Web',
      description: 'Multi-page site with CMS-ready structure, contact flows, and SEO basics.',
      status: 'published',
    },
    {
      id: 'shop_ecommerce',
      name: 'E-commerce Starter',
      price: 150000,
      currency: 'KES',
      category: 'Web',
      description: 'Online storefront for products, carts, and order enquiries.',
      status: 'published',
    },
    {
      id: 'shop_logo_pack',
      name: 'Logo Identity Pack',
      price: 15000,
      currency: 'KES',
      category: 'Design',
      description: 'Logo concepts, revisions, and delivery formats for brand launch.',
      status: 'published',
    },
    {
      id: 'shop_brand_kit',
      name: 'Brand Identity Kit',
      price: 35000,
      currency: 'KES',
      category: 'Design',
      description: 'Logo, colour system, typography, and basic brand guidelines.',
      status: 'published',
    },
    {
      id: 'shop_uiux',
      name: 'UI/UX Design Package',
      price: 60000,
      currency: 'KES',
      category: 'Design',
      description: 'Wireframes and high-fidelity screens for web or mobile products.',
      status: 'published',
    },
    {
      id: 'shop_mobile_app',
      name: 'Mobile App MVP',
      price: 250000,
      currency: 'KES',
      category: 'Software',
      description: 'Cross-platform MVP app scope — core screens, auth, and API wiring.',
      status: 'published',
    },
    {
      id: 'shop_custom_software',
      name: 'Custom Software Starter',
      price: 180000,
      currency: 'KES',
      category: 'Software',
      description: 'Scoped business system or internal tool with discovery and first release.',
      status: 'published',
    },
    {
      id: 'shop_ai_automation',
      name: 'AI Automation Starter',
      price: 120000,
      currency: 'KES',
      category: 'AI',
      description: 'Chatbot or workflow automation tailored to your operations.',
      status: 'published',
    },
    {
      id: 'shop_digital_marketing',
      name: 'Digital Marketing Starter',
      price: 40000,
      currency: 'KES',
      category: 'Marketing',
      description: 'Campaign setup, social assets, and performance tracking kickoff.',
      status: 'published',
    },
    {
      id: 'shop_cyber_audit',
      name: 'Cyber Security Review',
      price: 55000,
      currency: 'KES',
      category: 'Security',
      description: 'Baseline security review for websites and apps with actionable fixes.',
      status: 'published',
    },
    {
      id: 'consult_it_halfday',
      name: 'IT Consulting (half day)',
      price: 25000,
      currency: 'KES',
      category: 'Consulting',
      description: 'Focused advisory session — systems review, decisions, and next steps.',
      status: 'published',
    },
    {
      id: 'consult_it_fullday',
      name: 'IT Consulting (full day)',
      price: 45000,
      currency: 'KES',
      category: 'Consulting',
      description: 'Deep-dive workshop with stakeholders — architecture, priorities, and roadmap sketch.',
      status: 'published',
    },
    {
      id: 'consult_tech_roadmap',
      name: 'Technology Roadmap Package',
      price: 120000,
      currency: 'KES',
      category: 'Consulting',
      description: 'Multi-week advisory: assessment, target architecture, and prioritised delivery plan.',
      status: 'published',
    },
    {
      id: 'consult_digital_transform',
      name: 'Digital Transformation Starter',
      price: 150000,
      currency: 'KES',
      category: 'Consulting',
      description: 'Current-state audit, initiative backlog, and change-ready transformation plan.',
      status: 'published',
    },
    {
      id: 'career_resume_revamp',
      name: 'Resume / CV Revamp',
      price: 3500,
      currency: 'KES',
      category: 'Career',
      description:
        'Refresh your existing CV into a clean, ATS-friendly format — Kenya market rates for graduates and early professionals.',
      status: 'published',
    },
    {
      id: 'career_resume_build',
      name: 'Resume Building (ATS CV)',
      price: 5000,
      currency: 'KES',
      category: 'Career',
      description:
        'Full professional resume built from scratch — structure, achievements, and keywords for Kenyan and remote roles.',
      status: 'published',
    },
    {
      id: 'career_resume_mid',
      name: 'Mid-Career Resume Package',
      price: 6500,
      currency: 'KES',
      category: 'Career',
      description:
        'Role-targeted CV for 3–9 years’ experience — impact bullets, skills mapping, and role keywords.',
      status: 'published',
    },
    {
      id: 'career_resume_senior',
      name: 'Senior Resume Package',
      price: 9000,
      currency: 'KES',
      category: 'Career',
      description:
        'Leadership-focused CV for managers and senior specialists — aligned with Kenya mid-to-senior market pricing.',
      status: 'published',
    },
    {
      id: 'career_resume_executive',
      name: 'Executive Resume Package',
      price: 14000,
      currency: 'KES',
      category: 'Career',
      description:
        'Executive / C-suite CV with career narrative and achievement framing — Kenya executive writing range.',
      status: 'published',
    },
    {
      id: 'career_cover_letter',
      name: 'Cover Letter',
      price: 1500,
      currency: 'KES',
      category: 'Career',
      description: 'Tailored cover letter matched to your CV and target role.',
      status: 'published',
    },
    {
      id: 'career_linkedin',
      name: 'LinkedIn Profile Optimisation',
      price: 3500,
      currency: 'KES',
      category: 'Career',
      description: 'Headline, about, and experience rewrite so recruiters find you faster.',
      status: 'published',
    },
    {
      id: 'career_docs_bundle',
      name: 'Career Docs Bundle',
      price: 8500,
      currency: 'KES',
      category: 'Career',
      description: 'Resume build or revamp + cover letter + LinkedIn optimisation in one package.',
      status: 'published',
      image: '',
    },
    {
      id: 'tax_kenya_return',
      name: 'Kenya Tax Return Filing',
      price: 200,
      currency: 'KES',
      category: 'Tax & Compliance',
      description: 'Individual Kenya tax return filing assistance — KRA iTax support at an accessible rate.',
      status: 'published',
      image: '/media/posters/poster-tax-returns.png',
    },
    {
      id: 'tax_kenya_pin_assist',
      name: 'KRA PIN / iTax Assist',
      price: 500,
      currency: 'KES',
      category: 'Tax & Compliance',
      description: 'Help creating or recovering KRA PIN and basic iTax account setup.',
      status: 'published',
      image: '/media/posters/poster-tax-returns.png',
    },
    {
      id: 'tech_os_install',
      name: 'OS Installation',
      price: 2500,
      currency: 'KES',
      category: 'Tech Support',
      description: 'Windows or Linux OS installation / reinstall with drivers and essential updates.',
      status: 'published',
      image: '/media/posters/poster-os-install.png',
    },
    {
      id: 'tech_os_install_office',
      name: 'OS Install + Office Setup',
      price: 4500,
      currency: 'KES',
      category: 'Tech Support',
      description: 'OS installation plus productivity suite setup and basic optimisation.',
      status: 'published',
      image: '/media/posters/poster-os-install.png',
    },
    {
      id: 'tech_app_testing',
      name: 'App Testing (starter)',
      price: 15000,
      currency: 'KES',
      category: 'QA & Testing',
      description: 'Manual functional testing for web or mobile apps with a clear bug report.',
      status: 'published',
      image: '/media/posters/poster-app-testing.png',
    },
    {
      id: 'tech_app_testing_full',
      name: 'App Testing (full cycle)',
      price: 35000,
      currency: 'KES',
      category: 'QA & Testing',
      description: 'Broader test plan — functional, UI, and regression checks with prioritised findings.',
      status: 'published',
      image: '/media/posters/poster-app-testing.png',
    },
    {
      id: 'brand_identity_session',
      name: 'Brand Identity Session',
      price: 20000,
      currency: 'KES',
      category: 'Branding',
      description: 'Brand discovery workshop — positioning, voice, and visual direction for your business.',
      status: 'published',
      image: '/media/posters/poster-branding.png',
    },
    {
      id: 'brand_full_kit',
      name: 'Full Branding Kit',
      price: 55000,
      currency: 'KES',
      category: 'Branding',
      description: 'Logo system, colours, typography, and brand board ready for print and digital.',
      status: 'published',
      image: '/media/posters/poster-branding.png',
    },
    {
      id: 'brand_rebrand',
      name: 'Business Rebrand Package',
      price: 75000,
      currency: 'KES',
      category: 'Branding',
      description: 'Full rebrand — refreshed identity, messaging, and rollout assets for an existing business.',
      status: 'published',
      image: '/media/posters/poster-rebrand-kit.png',
    },
    {
      id: 'merch_tshirt',
      name: 'Branded T-Shirt (per piece)',
      price: 1200,
      currency: 'KES',
      category: 'Merchandise',
      description: 'Company logo print on quality tee — artwork setup included. Bulk quotes available.',
      status: 'published',
      image: '/media/posters/poster-apparel.png',
    },
    {
      id: 'merch_cap',
      name: 'Branded Cap (per piece)',
      price: 800,
      currency: 'KES',
      category: 'Merchandise',
      description: 'Cap branding with your logo — embroidery or print options on request.',
      status: 'published',
      image: '/media/posters/poster-apparel.png',
    },
    {
      id: 'merch_hoodie',
      name: 'Branded Hoodie (per piece)',
      price: 2500,
      currency: 'KES',
      category: 'Merchandise',
      description: 'Hoodie with company logo branding for teams and events.',
      status: 'published',
      image: '/media/posters/poster-apparel.png',
    },
    {
      id: 'merch_clothing_custom',
      name: 'Custom Clothing Branding',
      price: 1500,
      currency: 'KES',
      category: 'Merchandise',
      description: 'Logo branding on client-supplied or sourced apparel — priced from per piece.',
      status: 'published',
      image: '/media/posters/poster-apparel.png',
    },
    {
      id: 'merch_phone_case',
      name: 'Phone Case Decoration',
      price: 1000,
      currency: 'KES',
      category: 'Merchandise',
      description: 'Custom phone case artwork / logo decoration — model-specific production.',
      status: 'published',
      image: '/media/posters/poster-phone-case.png',
    },
    {
      id: 'design_graphics_pack',
      name: 'Graphics Design Pack',
      price: 8000,
      currency: 'KES',
      category: 'Graphics',
      description: 'Social and marketing graphics pack — posts, story frames, and brand-aligned assets.',
      status: 'published',
      image: '/media/posters/poster-graphics.png',
    },
    {
      id: 'design_campaign_poster',
      name: 'Campaign Poster Design',
      price: 5000,
      currency: 'KES',
      category: 'Graphics',
      description: 'Original campaign poster design for print and digital — one concept + revisions.',
      status: 'published',
      image: '/media/posters/poster-campaign.png',
    },
    {
      id: 'design_poster_set',
      name: 'Campaign Poster Set (3)',
      price: 12000,
      currency: 'KES',
      category: 'Graphics',
      description: 'Set of three coordinated campaign posters for events, launches, or ads.',
      status: 'published',
      image: '/media/posters/poster-campaign.png',
    },
    {
      id: 'design_flyer',
      name: 'Flyer / Handbill Design',
      price: 3500,
      currency: 'KES',
      category: 'Graphics',
      description: 'Print-ready flyer design with your brand message and call to action.',
      status: 'published',
      image: '/media/posters/poster-graphics.png',
    },
    {
      id: 'design_business_cards',
      name: 'Business Cards Design',
      price: 2500,
      currency: 'KES',
      category: 'Stationery',
      description: 'Print-ready business card design — front/back, brand-aligned, and print-file delivery.',
      status: 'published',
      image: '/media/posters/poster-business-card.png',
    },
    {
      id: 'stationery_letterhead',
      name: 'Letterhead Design',
      price: 3000,
      currency: 'KES',
      category: 'Stationery',
      description: 'Branded letterhead template for Word/PDF — logo, contact block, and print margins.',
      status: 'published',
      image: '/media/posters/poster-letterhead.png',
    },
    {
      id: 'stationery_envelopes',
      name: 'Envelope Design',
      price: 2500,
      currency: 'KES',
      category: 'Stationery',
      description: 'Branded envelope artwork for DL / C5 — return address and logo placement.',
      status: 'published',
      image: '/media/posters/poster-letterhead.png',
    },
    {
      id: 'stationery_comp_slips',
      name: 'Complimentary Slips',
      price: 2000,
      currency: 'KES',
      category: 'Stationery',
      description: 'With-compliments slip design matching your letterhead and brand colours.',
      status: 'published',
      image: '/media/posters/poster-letterhead.png',
    },
    {
      id: 'stationery_stamp_seal',
      name: 'Stamp / Seal Design',
      price: 1500,
      currency: 'KES',
      category: 'Stationery',
      description: 'Company stamp or seal artwork for rubber stamp / digital seal use.',
      status: 'published',
      image: '/media/posters/poster-rebrand-kit.png',
    },
    {
      id: 'stationery_full_pack',
      name: 'Full Rebrand Stationery Pack',
      price: 18000,
      currency: 'KES',
      category: 'Stationery',
      description:
        'Business cards, letterhead, envelopes, complimentary slips, and stamp design as one coordinated pack.',
      status: 'published',
      image: '/media/posters/poster-rebrand-kit.png',
    },
  ]
}

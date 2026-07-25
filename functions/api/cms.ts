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
      return json({ page })
    }
    const publishedOnly = url.searchParams.get('published') === '1'
    return json({
      pages: publishedOnly ? pages.filter((p) => p.status === 'published') : pages,
    })
  }

  if (resource === 'site-copy') {
    return json({ siteCopy: await getJson(env, 'cms:site-copy', defaultSiteCopy()) })
  }

  if (resource === 'activity') {
    return json({ activity: await getJson(env, 'cms:activity', []) })
  }

  if (resource === 'leads') {
    return json({ leads: await getJson(env, 'cms:leads', []) })
  }

  if (resource === 'reviews') {
    return json({ reviews: await getJson(env, 'cms:reviews', []) })
  }

  if (resource === 'newsletter') {
    return json({ subscribers: await getJson(env, 'cms:newsletter', []) })
  }

  if (resource === 'notifications') {
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
    if (!adminOk(request, env)) return json({ error: 'unauthorized' }, 401)
    const users = await getJson(env, 'cms:users', [])
    return json({
      users: users.map(({ passwordHash, salt, ...safe }) => safe),
    })
  }

  if (resource === 'analytics') {
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

  return json({ error: 'unknown resource' }, 400)
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const body = await request.json().catch(() => ({}))
  const action = body.action || 'save'

  // Public lead capture / newsletter
  if (action === 'lead') {
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
      status: body.intent === 'buy' ? 'purchase_request' : 'new',
      at: new Date().toISOString(),
    }
    leads.unshift(lead)
    await putJson(env, 'cms:leads', leads.slice(0, 500))
    await logActivity(env, {
      type: 'lead',
      message: `${lead.intent || 'Lead'}: ${lead.packageName || lead.service || lead.name || lead.email}`,
    })
    return json({ ok: true, lead })
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
    const users = await getJson(env, 'cms:users', [])
    if (users.some((u) => u.email === email)) return json({ error: 'Email already registered' }, 409)
    const { hash, salt } = await hashPassword(password)
    const user = {
      id: id('user'),
      email,
      name: name || email.split('@')[0],
      role: 'customer',
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  }

  if (action === 'login') {
    const email = String(body.email || '').toLowerCase().trim()
    const password = String(body.password || '')
    const users = await getJson(env, 'cms:users', [])
    const user = users.find((u) => u.email === email)
    if (!user) return json({ error: 'Invalid credentials' }, 401)
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  }

  // Admin-only below
  if (!adminOk(request, env)) return json({ error: 'unauthorized' }, 401)

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
    const users = await getJson(env, 'cms:users', [])
    const idx = users.findIndex((u) => u.id === body.userId)
    if (idx < 0) return json({ error: 'user not found' }, 404)
    const role = body.role
    if (!['super_admin', 'admin', 'customer'].includes(role)) {
      return json({ error: 'invalid role' }, 400)
    }
    users[idx].role = role
    await putJson(env, 'cms:users', users)
    await logActivity(env, {
      type: 'user',
      message: `Role updated: ${users[idx].email} → ${role}`,
    })
    return json({ ok: true })
  }

  if (action === 'create_admin_user') {
    const email = String(body.email || '').toLowerCase().trim()
    const password = String(body.password || '')
    const role = body.role === 'super_admin' ? 'super_admin' : 'admin'
    if (!email.includes('@') || password.length < 6) {
      return json({ error: 'Valid email and password required' }, 400)
    }
    const users = await getJson(env, 'cms:users', [])
    if (users.some((u) => u.email === email)) return json({ error: 'exists' }, 409)
    const { hash, salt } = await hashPassword(password)
    users.unshift({
      id: id('user'),
      email,
      name: body.name || 'Admin',
      role,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    })
    await putJson(env, 'cms:users', users)
    return json({ ok: true })
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
    await logActivity(env, { type: 'system', message: 'Restored latest backup' })
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
    },
    about: {
      title: 'Who We Are',
      lead:
        'With years of experience in IT services, Ellines Tech crafts cutting-edge software and mobile apps for clients around the globe.',
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
    },
  ]
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key, X-User-Token',
}

const STAFF_ROLES = new Set(['staff', 'admin', 'super_admin'])

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

function id() {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function adminOk(request, env) {
  const key = (request.headers.get('X-Admin-Key') || '').trim()
  const expected = String(env.ADMIN_API_KEY ?? '').trim() || 'EllinesGodMode2026'
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

/** God Mode key OR staff/admin CMS user token */
async function agentOk(request, env) {
  if (adminOk(request, env)) return { kind: 'god', name: 'Admin' }
  const token = (request.headers.get('X-User-Token') || '').trim()
  if (!token) return null
  const session = await getJson(env, `cms:session:${token}`, null)
  if (!session?.userId) return null
  const users = await getJson(env, 'cms:users', [])
  const user = users.find((u) => u.id === session.userId)
  if (!user || user.active === false || !STAFF_ROLES.has(user.role)) return null
  return { kind: 'staff', name: user.name || 'Staff', user }
}

async function listSessions(env) {
  const raw = await env.ET_STORE.get('chat:index')
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function saveIndex(env, sessions) {
  await env.ET_STORE.put('chat:index', JSON.stringify(sessions.slice(0, 200)))
}

async function getSession(env, sessionId) {
  const raw = await env.ET_STORE.get(`chat:session:${sessionId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function putSession(env, session) {
  await env.ET_STORE.put(`chat:session:${session.id}`, JSON.stringify(session))
  const index = await listSessions(env)
  const next = [
    {
      id: session.id,
      status: session.status,
      visitorName: session.visitorName,
      preview: session.messages.at(-1)?.text?.slice(0, 80) || '',
      updatedAt: session.updatedAt,
      createdAt: session.createdAt,
      unreadAdmin: session.unreadAdmin || 0,
    },
    ...index.filter((s) => s.id !== session.id),
  ]
  await saveIndex(env, next)
}

export async function onRequestOptions() {
  return new Response(null, { headers: cors })
}

export async function onRequestGet(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const url = new URL(request.url)
  const sessionId = url.searchParams.get('sessionId')
  const admin = url.searchParams.get('admin') === '1'

  if (admin && !sessionId) {
    if (!(await agentOk(request, env))) return json({ error: 'unauthorized' }, 401)
    const sessions = await listSessions(env)
    return json({ sessions })
  }

  if (!sessionId) return json({ error: 'sessionId required' }, 400)
  const session = await getSession(env, sessionId)
  if (!session) return json({ error: 'not found' }, 404)
  if (admin) {
    if (!(await agentOk(request, env))) return json({ error: 'unauthorized' }, 401)
    session.unreadAdmin = 0
    await putSession(env, session)
  }
  return json({ session })
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const body = await request.json().catch(() => ({}))
  const action = body.action || 'message'

  if (action === 'create') {
    const session = {
      id: id(),
      visitorName: body.visitorName || 'Visitor',
      status: 'ai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadAdmin: 0,
      messages: [
        {
          id: id(),
          role: 'assistant',
          text: 'Welcome to Ellines Tech live support. Ask me anything, open WhatsApp, or request a human agent.',
          at: new Date().toISOString(),
        },
      ],
    }
    await putSession(env, session)
    return json({ session })
  }

  if (action === 'message') {
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    let role = body.role || 'visitor'
    if (role === 'admin') {
      if (!(await agentOk(request, env))) return json({ error: 'unauthorized' }, 401)
    } else if (role !== 'visitor' && role !== 'assistant' && role !== 'ai') {
      role = 'visitor'
    }
    const msg = {
      id: id(),
      role,
      text: String(body.text || '').slice(0, 4000),
      at: new Date().toISOString(),
    }
    session.messages.push(msg)
    session.updatedAt = msg.at
    if (role === 'visitor') {
      session.unreadAdmin = (session.unreadAdmin || 0) + 1
      if (session.status === 'ai' && body.requestHuman) session.status = 'waiting'
    }
    if (role === 'admin') {
      session.status = 'live'
      session.unreadAdmin = 0
    }
    await putSession(env, session)
    return json({ session })
  }

  if (action === 'request_human') {
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'waiting'
    session.updatedAt = new Date().toISOString()
    session.messages.push({
      id: id(),
      role: 'system',
      text: 'Visitor requested a human agent. An Ellines Tech team member will join shortly.',
      at: session.updatedAt,
    })
    session.unreadAdmin = (session.unreadAdmin || 0) + 1
    await putSession(env, session)
    return json({ session })
  }

  if (action === 'claim') {
    const agent = await agentOk(request, env)
    if (!agent) return json({ error: 'unauthorized' }, 401)
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'live'
    session.adminName = body.adminName || agent.name || 'Admin'
    session.updatedAt = new Date().toISOString()
    session.messages.push({
      id: id(),
      role: 'system',
      text: `${session.adminName} joined the chat.`,
      at: session.updatedAt,
    })
    await putSession(env, session)
    return json({ session })
  }

  if (action === 'close') {
    if (!(await agentOk(request, env))) return json({ error: 'unauthorized' }, 401)
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'closed'
    session.updatedAt = new Date().toISOString()
    await putSession(env, session)
    return json({ session })
  }

  return json({ error: 'unknown action' }, 400)
}

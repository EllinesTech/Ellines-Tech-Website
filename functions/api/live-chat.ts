const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
}

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
    if (!adminOk(request, env)) return json({ error: 'unauthorized' }, 401)
    const sessions = await listSessions(env)
    return json({ sessions })
  }

  if (!sessionId) return json({ error: 'sessionId required' }, 400)
  const session = await getSession(env, sessionId)
  if (!session) return json({ error: 'not found' }, 404)
  if (admin) {
    if (!adminOk(request, env)) return json({ error: 'unauthorized' }, 401)
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
      if (!adminOk(request, env)) return json({ error: 'unauthorized' }, 401)
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
      text: 'Visitor requested a human agent. An Ellines Tech admin will join shortly.',
      at: session.updatedAt,
    })
    session.unreadAdmin = (session.unreadAdmin || 0) + 1
    await putSession(env, session)
    return json({ session })
  }

  if (action === 'claim') {
    if (!adminOk(request, env)) return json({ error: 'unauthorized' }, 401)
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'live'
    session.adminName = body.adminName || 'Admin'
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
    if (!adminOk(request, env)) return json({ error: 'unauthorized' }, 401)
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'closed'
    session.updatedAt = new Date().toISOString()
    await putSession(env, session)
    return json({ session })
  }

  return json({ error: 'unknown action' }, 400)
}

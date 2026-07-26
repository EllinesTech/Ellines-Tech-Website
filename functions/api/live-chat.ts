import {
  ALLOWED_HEADERS,
  canSeeVisitorPii,
  cleanPlain,
  cleanText,
  locationLabel,
  rateLimitByIp,
  redactVisitor,
  resolveActor,
  visitorContext,
} from '../_shared/security'

const cors = {
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': ALLOWED_HEADERS,
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

async function getJson(env, key, fallback) {
  const raw = await env.ET_STORE.get(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/** God Mode key / super admin session OR staff-admin CMS user token */
async function agentOk(request, env) {
  const actor = await resolveActor(request, env)
  if (!actor) return null
  return { kind: actor.kind, name: actor.name, role: actor.role, user: actor.user, actor }
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
  const raw = await env.ET_STORE.get(`chat:session:${cleanPlain(sessionId, 80)}`)
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
      /** Enough context for an agent to triage from the inbox list. */
      location: locationLabel(session.visitor),
      device: session.visitor?.device || '',
      browser: session.visitor?.browser || '',
    },
    ...index.filter((s) => s.id !== session.id),
  ]
  await saveIndex(env, next)
}

/** Visitors never receive another visitor's context; agents get it redacted by role. */
function sessionForAgent(session, agent) {
  return {
    ...session,
    visitor: redactVisitor(session.visitor || {}, agent?.actor),
    location: locationLabel(session.visitor),
  }
}

function sessionForVisitor(session) {
  const { visitor, ...safe } = session
  return safe
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
    const agent = await agentOk(request, env)
    if (!agent) return json({ error: 'unauthorized' }, 401)
    const sessions = await listSessions(env)
    return json({ sessions, canSeeIp: canSeeVisitorPii(agent.actor) })
  }

  if (!sessionId) return json({ error: 'sessionId required' }, 400)
  const session = await getSession(env, sessionId)
  if (!session) return json({ error: 'not found' }, 404)
  if (admin) {
    const agent = await agentOk(request, env)
    if (!agent) return json({ error: 'unauthorized' }, 401)
    session.unreadAdmin = 0
    await putSession(env, session)
    return json({ session: sessionForAgent(session, agent), canSeeIp: canSeeVisitorPii(agent.actor) })
  }
  return json({ session: sessionForVisitor(session) })
}

export async function onRequestPost(context) {
  const { request, env } = context
  if (!env.ET_STORE) return json({ error: 'KV not bound' }, 500)
  const body = await request.json().catch(() => ({}))
  const action = body.action || 'message'

  if (action === 'create') {
    const limited = await rateLimitByIp(env, request, 'chat-create', {
      limit: 8,
      windowSeconds: 600,
    })
    if (!limited.ok) return json({ error: 'Too many chat sessions. Try again shortly.' }, 429)
    const session = {
      id: id(),
      visitorName: cleanPlain(body.visitorName, 80) || 'Visitor',
      status: 'ai',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadAdmin: 0,
      /** Edge-derived context (IP / geo / device) for the agent inbox. */
      visitor: visitorContext(request),
      messages: [
        {
          id: id(),
          role: 'assistant',
          text: 'Welcome to Ellines Tech live support. I’m Ellenia — ask me anything, open WhatsApp, or request a human agent.',
          at: new Date().toISOString(),
        },
      ],
    }
    await putSession(env, session)
    return json({ session: sessionForVisitor(session) })
  }

  if (action === 'message') {
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    // Only visitors may post unauthenticated. Admin/agent roles require a
    // verified staff/god session — never accept client-supplied "assistant"/"ai"
    // labels (that would let anyone inject fake Ellenia / system bubbles).
    let role = body.role === 'admin' ? 'admin' : 'visitor'
    let agent = null
    if (role === 'admin') {
      agent = await agentOk(request, env)
      if (!agent) return json({ error: 'unauthorized' }, 401)
    }
    if (role !== 'admin') {
      const limited = await rateLimitByIp(env, request, 'chat-message', {
        limit: 40,
        windowSeconds: 300,
      })
      if (!limited.ok) return json({ error: 'Slow down a moment.' }, 429)
    }
    const text = cleanText(body.text, 4000)
    if (!text) return json({ error: 'text required' }, 400)
    const msg = { id: id(), role, text, at: new Date().toISOString() }
    session.messages.push(msg)
    // Keep transcripts bounded so a single session can't blow the KV value cap.
    if (session.messages.length > 300) session.messages = session.messages.slice(-300)
    session.updatedAt = msg.at
    if (role === 'visitor') {
      // Refresh context each turn — visitors move between networks and devices.
      session.visitor = { ...(session.visitor || {}), ...visitorContext(request) }
      session.unreadAdmin = (session.unreadAdmin || 0) + 1
      if (session.status === 'ai' && body.requestHuman) session.status = 'waiting'
    }
    if (role === 'admin') {
      session.status = 'live'
      session.unreadAdmin = 0
    }
    await putSession(env, session)
    return json({
      session: agent ? sessionForAgent(session, agent) : sessionForVisitor(session),
    })
  }

  if (action === 'request_human') {
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'waiting'
    session.updatedAt = new Date().toISOString()
    session.visitor = { ...(session.visitor || {}), ...visitorContext(request) }
    session.messages.push({
      id: id(),
      role: 'system',
      text: 'Visitor requested a human agent. An Ellines Tech team member will join shortly.',
      at: session.updatedAt,
    })
    session.unreadAdmin = (session.unreadAdmin || 0) + 1
    await putSession(env, session)
    return json({ session: sessionForVisitor(session) })
  }

  if (action === 'claim') {
    const agent = await agentOk(request, env)
    if (!agent) return json({ error: 'unauthorized' }, 401)
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'live'
    session.adminName = cleanPlain(body.adminName, 80) || agent.name || 'Agent'
    session.updatedAt = new Date().toISOString()
    session.messages.push({
      id: id(),
      role: 'system',
      text: `${session.adminName} joined the chat.`,
      at: session.updatedAt,
    })
    await putSession(env, session)
    return json({ session: sessionForAgent(session, agent) })
  }

  if (action === 'close') {
    const agent = await agentOk(request, env)
    if (!agent) return json({ error: 'unauthorized' }, 401)
    const session = await getSession(env, body.sessionId)
    if (!session) return json({ error: 'not found' }, 404)
    session.status = 'closed'
    session.updatedAt = new Date().toISOString()
    await putSession(env, session)
    return json({ session: sessionForAgent(session, agent) })
  }

  return json({ error: 'unknown action' }, 400)
}

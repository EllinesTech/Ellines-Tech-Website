import { getAdminApiKey, isAdminAuthed } from '@/lib/engagementStore'
import { loadAuthToken } from '@/lib/auth'
import type { VisitorContext } from '@/lib/cmsApi'

export type LiveRole = 'visitor' | 'admin' | 'assistant' | 'system' | 'ai'

export interface LiveMessage {
  id: string
  role: LiveRole
  text: string
  at: string
}

export interface LiveSession {
  id: string
  visitorName: string
  status: 'ai' | 'waiting' | 'live' | 'closed'
  adminName?: string
  createdAt: string
  updatedAt: string
  unreadAdmin?: number
  messages: LiveMessage[]
  /** Only present on agent-authenticated reads; redacted by role at the edge. */
  visitor?: VisitorContext
  location?: string
}

export interface LiveSessionSummary {
  id: string
  status: LiveSession['status']
  visitorName: string
  preview: string
  updatedAt: string
  createdAt: string
  unreadAdmin: number
  location?: string
  device?: string
  browser?: string
}

const base = '/api/live-chat'

/**
 * Whatever elevated credentials the browser holds — an admin-panel session
 * token or a CMS user token. The edge decides what they unlock.
 */
function agentHeaders(json = false): HeadersInit {
  const token = loadAuthToken() || ''
  const adminToken = getAdminApiKey()
  const headers: Record<string, string> = {}
  if (json) headers['Content-Type'] = 'application/json'
  if (isAdminAuthed() && adminToken) headers['X-Admin-Key'] = adminToken
  if (token) headers['X-User-Token'] = token
  return headers
}

export async function createLiveSession(visitorName?: string): Promise<LiveSession> {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', visitorName }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create session')
  return data.session
}

export async function getLiveSession(sessionId: string, admin = false): Promise<LiveSession> {
  const res = await fetch(
    `${base}?sessionId=${encodeURIComponent(sessionId)}${admin ? '&admin=1' : ''}`,
    admin ? { headers: agentHeaders() } : undefined,
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to load session')
  return data.session
}

export async function listLiveSessions(): Promise<LiveSessionSummary[]> {
  const res = await fetch(`${base}?admin=1`, { headers: agentHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to list sessions')
  return data.sessions || []
}

export async function postLiveMessage(
  sessionId: string,
  text: string,
  role: 'visitor' | 'admin',
  requestHuman = false,
): Promise<LiveSession> {
  const headers =
    role === 'admin' ? agentHeaders(true) : { 'Content-Type': 'application/json' }
  const res = await fetch(base, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action: 'message', sessionId, text, role, requestHuman }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to send')
  return data.session
}

export async function requestHumanAgent(sessionId: string): Promise<LiveSession> {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'request_human', sessionId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to request human')
  return data.session
}

export async function claimLiveSession(sessionId: string, adminName = 'Admin'): Promise<LiveSession> {
  const res = await fetch(base, {
    method: 'POST',
    headers: agentHeaders(true),
    body: JSON.stringify({ action: 'claim', sessionId, adminName }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to claim')
  return data.session
}

export async function closeLiveSession(sessionId: string): Promise<LiveSession> {
  const res = await fetch(base, {
    method: 'POST',
    headers: agentHeaders(true),
    body: JSON.stringify({ action: 'close', sessionId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to close')
  return data.session
}

/**
 * Ask Ellenia. Elevated credentials are forwarded when present so the edge can
 * decide the audience (public / staff / admin / God Mode) — the browser never
 * declares its own role.
 */
export async function askAi(
  question: string,
  history: { role: string; text: string }[],
): Promise<{ answer: string; audience: string; source: string }> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: agentHeaders(true),
    body: JSON.stringify({ question, history }),
  })
  const data = await res.json()
  if (!res.ok && !data.answer) throw new Error(data.error || 'AI failed')
  return {
    answer: String(data.answer || ''),
    audience: String(data.audience || 'public'),
    source: String(data.source || 'unknown'),
  }
}

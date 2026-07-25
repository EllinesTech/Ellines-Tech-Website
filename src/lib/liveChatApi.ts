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
}

export interface LiveSessionSummary {
  id: string
  status: LiveSession['status']
  visitorName: string
  preview: string
  updatedAt: string
  createdAt: string
  unreadAdmin: number
}

const base = '/api/live-chat'

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
  const res = await fetch(`${base}?sessionId=${encodeURIComponent(sessionId)}${admin ? '&admin=1' : ''}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to load session')
  return data.session
}

export async function listLiveSessions(): Promise<LiveSessionSummary[]> {
  const res = await fetch(`${base}?admin=1`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to list sessions')
  return data.sessions || []
}

export async function postLiveMessage(
  sessionId: string,
  text: string,
  role: 'visitor' | 'admin' | 'assistant' | 'ai',
  requestHuman = false,
): Promise<LiveSession> {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'claim', sessionId, adminName }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to claim')
  return data.session
}

export async function askAi(
  question: string,
  history: { role: string; text: string }[],
): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'AI failed')
  return data.answer as string
}

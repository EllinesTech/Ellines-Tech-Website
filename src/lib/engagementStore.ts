import { defaultChatFaqs, type ChatFaq } from '@/data/chatKnowledge'

const FAQ_KEY = 'et_chat_faqs_v1'
const TRANSCRIPTS_KEY = 'et_chat_transcripts_v1'
const SETTINGS_KEY = 'et_site_settings_v1'
const ADMIN_SESSION_KEY = 'et_admin_session_v1'

export interface SiteRuntimeSettings {
  chatEnabled: boolean
  announcement: string
  alwaysOpen: boolean
}

export interface ChatTranscript {
  id: string
  startedAt: string
  messages: { role: 'user' | 'assistant' | 'system'; text: string; at: string }[]
}

export const defaultRuntimeSettings: SiteRuntimeSettings = {
  chatEnabled: true,
  announcement: '',
  alwaysOpen: true,
}

export function loadFaqs(): ChatFaq[] {
  try {
    const raw = localStorage.getItem(FAQ_KEY)
    if (!raw) return defaultChatFaqs
    const parsed = JSON.parse(raw) as ChatFaq[]
    return Array.isArray(parsed) && parsed.length ? parsed : defaultChatFaqs
  } catch {
    return defaultChatFaqs
  }
}

export function saveFaqs(faqs: ChatFaq[]) {
  localStorage.setItem(FAQ_KEY, JSON.stringify(faqs))
}

export function resetFaqs() {
  localStorage.removeItem(FAQ_KEY)
}

export function loadSettings(): SiteRuntimeSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultRuntimeSettings
    return { ...defaultRuntimeSettings, ...(JSON.parse(raw) as SiteRuntimeSettings) }
  } catch {
    return defaultRuntimeSettings
  }
}

export function saveSettings(settings: SiteRuntimeSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadTranscripts(): ChatTranscript[] {
  try {
    const raw = localStorage.getItem(TRANSCRIPTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChatTranscript[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTranscript(transcript: ChatTranscript) {
  const all = loadTranscripts().filter((t) => t.id !== transcript.id)
  all.unshift(transcript)
  localStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(all.slice(0, 50)))
}

export function clearTranscripts() {
  localStorage.removeItem(TRANSCRIPTS_KEY)
}

/**
 * God Mode credentials never live in the client bundle. `/admin/login` posts the
 * owner password to `/api/cms` (`action: admin_login`), the edge compares it to
 * `ADMIN_API_KEY`, and the browser only ever holds the short-lived opaque
 * session token returned on success. A `super_admin` CMS account is the other
 * route into God Mode and uses the normal user token instead.
 */
const ADMIN_TOKEN_KEY = 'et_admin_token'

function readAdminToken(): string {
  if (typeof sessionStorage === 'undefined') return ''
  return (sessionStorage.getItem(ADMIN_TOKEN_KEY) || '').trim()
}

export function isAdminAuthed(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  if (readAdminToken()) return true
  // Legacy flag from a session created before token auth shipped.
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1' && Boolean(readAdminToken())
}

export function setAdminAuthed(value: boolean) {
  if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
  else sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function setAdminApiKey(key: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, key.trim())
}

export function clearAdminApiKey() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  // Clear the pre-token storage location too, so old keys stop being sent.
  try {
    localStorage.removeItem('et_admin_api_key')
  } catch {
    /* ignore */
  }
}

/** Opaque God Mode session token, or '' when the owner is not signed in. */
export function getAdminApiKey(): string {
  return readAdminToken()
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s+/]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function answerQuestion(input: string, faqs: ChatFaq[] = loadFaqs()): {
  answer: string
  links?: { label: string; href: string }[]
  matched: boolean
  wantsHuman: boolean
} {
  const q = normalize(input)
  const wantsHuman =
    /\b(human|agent|person|whatsapp|call me|talk to|speak to|real person|support)\b/.test(q)

  let best: { score: number; faq: ChatFaq } | null = null
  for (const faq of faqs) {
    for (const phrase of faq.questions) {
      const p = normalize(phrase)
      if (!p) continue
      let score = 0
      if (q === p) score = 100
      else if (q.includes(p) || p.includes(q)) score = 80
      else {
        const words = p.split(' ').filter((w) => w.length > 2)
        const hits = words.filter((w) => q.includes(w)).length
        if (hits) score = (hits / words.length) * 60
      }
      if (!best || score > best.score) best = { score, faq }
    }
  }

  if (best && best.score >= 35) {
    return {
      answer: best.faq.answer,
      links: best.faq.links,
      matched: true,
      wantsHuman: wantsHuman || best.faq.id === 'human',
    }
  }

  return {
    answer:
      "I don't have a stored answer for that yet — let me think it through, or tap “Live Agent” to reach a human on our team right away.",
    matched: false,
    wantsHuman: true,
  }
}

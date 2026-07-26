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

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
}

export function setAdminAuthed(value: boolean) {
  if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
  else sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

/**
 * Default owner / Super Admin password when env is unset or blank.
 * Frontend: `VITE_ADMIN_PASSWORD` (build-time). Backend: `ADMIN_API_KEY` (Pages/Workers).
 * Keep both in sync in production. Vite may bake `""` for empty vars — never use
 * `??` alone; trim and fall through to this default.
 */
export const DEFAULT_ADMIN_PASSWORD = 'EllinesGodMode2026'

/** Resolve configured admin password; empty / whitespace Vite env → default. */
export function resolveConfiguredAdminPassword(): string {
  const fromEnv = String(import.meta.env.VITE_ADMIN_PASSWORD ?? '').trim()
  return fromEnv || DEFAULT_ADMIN_PASSWORD
}

export function verifyAdminPassword(password: string): boolean {
  return password.trim() === resolveConfiguredAdminPassword()
}

const ADMIN_API_KEY = 'et_admin_api_key'

export function setAdminApiKey(key: string) {
  localStorage.setItem(ADMIN_API_KEY, key.trim())
}

export function clearAdminApiKey() {
  localStorage.removeItem(ADMIN_API_KEY)
}

export function getAdminApiKey(): string {
  const stored =
    typeof localStorage !== 'undefined' ? (localStorage.getItem(ADMIN_API_KEY) || '').trim() : ''
  return stored || resolveConfiguredAdminPassword()
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
      "I don't have a precise answer for that yet — but a human on our team can help immediately. Tap “Talk to a human” and we’ll continue on WhatsApp.",
    matched: false,
    wantsHuman: true,
  }
}

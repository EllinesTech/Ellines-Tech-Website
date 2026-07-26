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

/**
 * Grounded answers for reasonable technical / commercial questions when no FAQ
 * row matches and Workers AI is unavailable. Prefer this over a dead-end
 * "no stored answer" line — Ellenia should still sound capable.
 */
export function capabilityFallback(input: string): {
  answer: string
  links?: { label: string; href: string }[]
  wantsHuman: boolean
} {
  const q = normalize(input)
  const payment =
    /\b(m\s?pesa|mpesa|paystack|stripe|paypal|payment|payments|mobile money|paybill|till|checkout|gateway)\b/.test(
      q,
    )
  const integrate = /\b(integrat|api|apis|webhook|webhooks|crm|erp|third party|connect)\b/.test(q)
  const timeline =
    /\b(mvp|timeline|how fast|how long|how soon|turnaround|delivery|ship|when can|start date)\b/.test(
      q,
    )
  const pricing = /\b(price|pricing|cost|quote|budget|how much|kes|fee)\b/.test(q)
  const custom =
    /\b(custom|build|software|app|apps|website|booking|ecommerce|e commerce|platform|system|flutter|mobile|offline|react|node)\b/.test(
      q,
    )

  if (payment || (integrate && /\b(pay|money|card|checkout)\b/.test(q))) {
    return {
      answer:
        'Yes — we integrate M-Pesa (STK Push, Paybill, Till) and Paystack (card, mobile money, deposits) into websites, apps, stores, and invoicing. Scope usually covers checkout UX, webhooks, reconciliation, and receipts; we can run one gateway or both. Timeline and cost depend on your stack and edge cases (refunds, partials, multi-currency). Send a brief via /request and we’ll outline a concrete integration plan.',
      links: [
        { label: 'Request a quote', href: '/request' },
        { label: 'Pricing', href: '/pricing' },
      ],
      wantsHuman: false,
    }
  }

  if (integrate) {
    return {
      answer:
        'Integrations are a core part of our delivery — payment gateways, CRMs, ERPs, SMS/WhatsApp, hospital and SACCO systems, and custom APIs. We map auth, data flows, webhooks, and go-live cutover with you. Tell me which systems you need linked, or open /request for a scoped plan.',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Request a quote', href: '/request' },
      ],
      wantsHuman: false,
    }
  }

  if (timeline) {
    return {
      answer:
        'Timelines depend on scope. Focused websites often ship in weeks; a Mobile App MVP or payment-ready storefront is typically a few weeks to a couple of months once requirements are clear; larger multi-module systems are phased. We always start with a written plan — deliverables, timeline, and investment. Share your target date on /request and we’ll say what’s realistic.',
      links: [
        { label: 'Request a quote', href: '/request' },
        { label: 'Pricing packages', href: '/pricing' },
      ],
      wantsHuman: false,
    }
  }

  if (pricing) {
    return {
      answer:
        'Pricing depends on scope — features, integrations, data migration, and timeline. Published package starting points are on /pricing; custom work is quoted after a short brief, usually within a day. Tell me what you’re building and I’ll outline the cost drivers, or use /request for a formal quote.',
      links: [
        { label: 'View pricing', href: '/pricing' },
        { label: 'Request a quote', href: '/request' },
      ],
      wantsHuman: false,
    }
  }

  if (custom) {
    return {
      answer:
        'Ellines Tech builds custom software, websites, AI assistants, brand systems, and digital platforms for businesses across Kenya and Africa — including payments, APIs, and staged MVPs. Share the outcome you need (users, must-have features, timeline) and I’ll map a sensible approach, or send a brief via /request.',
      links: [
        { label: 'Services', href: '/services' },
        { label: 'Request a quote', href: '/request' },
      ],
      wantsHuman: false,
    }
  }

  return {
    answer:
      'I can help with Ellines Tech services, products, integrations, timelines, and pricing. Tell me a bit more about what you need — stack, users, or deadline — and I’ll give a concrete answer. You can also open /request for a quote, switch to Live Agent, or WhatsApp us; we’re online 24/7.',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Request a quote', href: '/request' },
      { label: 'Contact', href: '/contact' },
    ],
    wantsHuman: false,
  }
}

export function answerQuestion(input: string, faqs: ChatFaq[] = loadFaqs()): {
  answer: string
  links?: { label: string; href: string }[]
  matched: boolean
  score: number
  wantsHuman: boolean
} {
  const q = normalize(input)
  const wantsHuman =
    /\b(human|agent|person|whatsapp|call me|talk to|speak to|real person)\b/.test(q)

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
      score: best.score,
      wantsHuman: wantsHuman || best.faq.id === 'human',
    }
  }

  const capability = capabilityFallback(input)
  return {
    answer: capability.answer,
    links: capability.links,
    matched: false,
    score: 0,
    wantsHuman: wantsHuman || capability.wantsHuman,
  }
}

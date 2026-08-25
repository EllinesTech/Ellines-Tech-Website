import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  X,
  Send,
  UserRound,
  Sparkles,
  Minimize2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/data/site'
import { answerQuestion, loadFaqs, saveFaqs } from '@/lib/engagementStore'
import { defaultChatFaqs } from '@/data/chatKnowledge'
import { useSiteFeatures } from '@/context/SiteFeaturesContext'
import { useSiteProfile } from '@/context/SiteProfileContext'
import {
  askAi,
  createLiveSession,
  getLiveSession,
  postLiveMessage,
  requestHumanAgent,
  type LiveSession,
} from '@/lib/liveChatApi'
import { fetchChatFaqs } from '@/lib/cmsApi'
import { currentActor } from '@/lib/adminAccess'
import { cn } from '@/lib/utils'

type Mode = 'ai' | 'human' | 'whatsapp'
type Bubble = {
  id: string
  role: 'user' | 'assistant' | 'system' | 'admin'
  text: string
  links?: { label: string; href: string }[]
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const SESSION_KEY = 'et_live_session_id'

/** Ellenia adapts her opening line and shortcuts to who is signed in. */
function greetingFor(actor: ReturnType<typeof currentActor>) {
  if (actor.god) {
    return `Hi ${actor.name || 'there'} — I’m Ellenia, your God Mode copilot. Ask me about leads, invoices, live chats, visitors, or any admin module, and I can draft client replies for you.`
  }
  if (actor.staff) {
    return `Hi ${actor.name || 'there'} — I’m Ellenia. I can summarise your leads and chats, draft replies and quotes, and answer client questions with you.`
  }
  return `Hi — I’m Ellenia, the Ellines Tech AI. Ask me anything technical: scope, integrations, timelines, or pricing. You can also reach a human agent or WhatsApp. We’re ${siteConfig.hours.label.toLowerCase()}.`
}

function promptsFor(actor: ReturnType<typeof currentActor>) {
  if (actor.god) {
    return [
      'Summarise today’s leads and what needs action',
      'Draft a follow-up email for an unpaid invoice',
      'Where do I change payment settings?',
    ]
  }
  if (actor.staff) {
    return [
      'Summarise the open leads I should call first',
      'Draft a friendly reply to a pricing question',
      'How do I share company materials with a client?',
    ]
  }
  return [
    'What would a custom booking system cost?',
    'Can you integrate M-Pesa and Paystack?',
    'How fast can you ship an MVP?',
  ]
}

export function ChatWidget() {
  const { settings } = useSiteFeatures()
  const { profile } = useSiteProfile()
  const actor = useMemo(() => currentActor(), [])
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('ai')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [session, setSession] = useState<LiveSession | null>(null)
  const [messages, setMessages] = useState<Bubble[]>([
    { id: 'welcome', role: 'assistant', text: greetingFor(actor) },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const waBase = `https://wa.me/${(profile.whatsapp || siteConfig.whatsapp).replace(/\D/g, '')}`
  const quickPrompts = useMemo(() => promptsFor(actor), [actor])
  const showPrompts = messages.length <= 1 && mode === 'ai'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, session?.messages.length])

  // Hydrate chat knowledge from CMS, then fill any gaps from shipped defaults
  // so newer capability FAQs (payments, integrations, timelines) land even when
  // KV still holds an older shorter seed.
  // Only fetch when the widget is first opened — avoids a cold API call on every
  // page load even for users who never open the chat.
  const faqsLoaded = useRef(false)
  useEffect(() => {
    if (!open || faqsLoaded.current) return
    faqsLoaded.current = true
    let cancelled = false
    void fetchChatFaqs()
      .then((list) => {
        if (cancelled) return
        const fromCms = Array.isArray(list)
          ? list.map((f) => ({
              id: f.id,
              questions: f.questions,
              answer: f.answer,
              links: f.links,
            }))
          : []
        const byId = new Map<string, (typeof defaultChatFaqs)[number]>()
        for (const faq of defaultChatFaqs) byId.set(faq.id, faq)
        for (const faq of fromCms) {
          if (faq?.id) byId.set(faq.id, faq)
        }
        saveFaqs([...byId.values()])
      })
      .catch(() => {
        if (!cancelled) saveFaqs(defaultChatFaqs)
      })
    return () => {
      cancelled = true
    }
  }, [open])

  // Poll live session when in human mode — only while open and actively waiting.
  // 5 s is responsive enough for human chat without hammering the edge.
  useEffect(() => {
    if (!open || mode !== 'human' || !session?.id) return
    // Stop polling once the agent has responded and the session is live to save
    // on unnecessary requests; restart if the user sends another message.
    const t = setInterval(async () => {
      try {
        const fresh = await getLiveSession(session.id)
        setSession(fresh)
      } catch {
        /* ignore transient */
      }
    }, 5000)
    return () => clearInterval(t)
  }, [open, mode, session?.id])

  if (!settings.chatEnabled) return null

  async function ensureSession() {
    if (session) return session
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing) {
      try {
        const s = await getLiveSession(existing)
        setSession(s)
        return s
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    const created = await createLiveSession(actor.staff ? `${actor.name} (team)` : 'Website visitor')
    localStorage.setItem(SESSION_KEY, created.id)
    setSession(created)
    return created
  }

  async function sendAi(text: string) {
    setBusy(true)
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text }])
    try {
      const local = answerQuestion(text, loadFaqs())
      // Always ask Workers AI so complex / novel questions get a real answer.
      // FAQ and capabilityFallback stay as the offline (or empty-model) path.
      let answer = local.answer
      let links = local.links
      try {
        const history = messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-6)
          .map((m) => ({ role: m.role, text: m.text }))
        const result = await askAi(text, history)
        if (result.answer?.trim()) {
          answer = result.answer.trim()
          // Model copy stands alone; keep FAQ/capability deep-links on offline answers.
          links = result.source === 'workers-ai' ? undefined : local.links
        }
      } catch {
        // Keep local FAQ or capabilityFallback answer as-is.
      }
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text: answer, links }])
    } finally {
      setBusy(false)
    }
  }

  async function sendHuman(text: string) {
    setBusy(true)
    try {
      const s = await ensureSession()
      const updated = await postLiveMessage(s.id, text, 'visitor')
      setSession(updated)
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'system',
          text: 'Live chat is connecting… If this persists, use WhatsApp and we’ll reply ASAP.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  async function startHuman() {
    setMode('human')
    setBusy(true)
    try {
      const s = await ensureSession()
      const updated = await requestHumanAgent(s.id)
      setSession(updated)
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'system',
          text: 'Connecting you to a human Ellines Tech agent. Stay on this tab — replies appear here live.',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'system',
          text: 'Human queue unavailable right now. Use WhatsApp for instant human support.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  function openWhatsApp() {
    setMode('whatsapp')
    const msg = encodeURIComponent('Hello Ellines Tech — I need help from the website chat.')
    window.open(`${waBase}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  async function handleSend(raw: string) {
    const text = raw.trim()
    if (!text || busy) return
    setInput('')
    if (mode === 'human') await sendHuman(text)
    else await sendAi(text)
  }

  const liveBubbles: Bubble[] =
    mode === 'human' && session
      ? session.messages.map((m) => ({
          id: m.id,
          role:
            m.role === 'visitor'
              ? 'user'
              : m.role === 'admin'
                ? 'admin'
                : m.role === 'system'
                  ? 'system'
                  : 'assistant',
          text: m.text,
        }))
      : messages

  const statusLine =
    mode === 'human'
      ? session?.status === 'live'
        ? 'Human connected'
        : 'Waiting for human'
      : mode === 'whatsapp'
        ? 'WhatsApp'
        : actor.god
          ? 'God Mode copilot'
          : actor.staff
            ? 'Team copilot'
            : 'AI online'

  return (
    <div className="no-print pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 print:hidden sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="pointer-events-auto flex h-[min(36rem,80vh)] w-[min(25rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.35rem] border border-white/12 bg-slate-950/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-brand-500/15 via-transparent to-sky-500/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-400/30">
                  <Sparkles className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">Ellenia</p>
                  <p className="text-[11px] text-emerald-300/90">
                    {siteConfig.hours.label} · {statusLine}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            {actor.staff && (
              <p className="flex items-center gap-1.5 border-b border-white/10 bg-brand-500/[0.07] px-4 py-1.5 text-[11px] text-brand-200">
                <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden />
                Signed in as {actor.god ? 'Super Admin' : actor.role} — operational answers enabled.
              </p>
            )}

            <div
              className="grid grid-cols-3 gap-1 border-b border-white/10 p-2"
              role="tablist"
              aria-label="Support channels"
            >
              {(
                [
                  { id: 'ai', label: 'Ellenia', icon: Sparkles },
                  { id: 'human', label: 'Live Agent', icon: UserRound },
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.id}
                  onClick={() => {
                    if (tab.id === 'whatsapp') openWhatsApp()
                    else if (tab.id === 'human') startHuman()
                    else setMode('ai')
                  }}
                  className={cn(
                    'inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition',
                    mode === tab.id
                      ? 'bg-brand-500/20 text-brand-200'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {liveBubbles.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex',
                    m.role === 'user' || m.role === 'admin' ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      m.role === 'user' && 'bg-brand-500 text-slate-950',
                      m.role === 'admin' && 'bg-emerald-500 text-slate-950',
                      m.role === 'assistant' &&
                        'border border-white/10 bg-white/[0.04] text-slate-200',
                      m.role === 'system' && 'text-xs text-slate-500',
                    )}
                  >
                    {m.role === 'admin' && (
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Human agent
                      </p>
                    )}
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.links?.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="mt-2 mr-2 inline-block text-xs font-semibold text-brand-300"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {showPrompts && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-left text-[11px] text-slate-300 transition hover:border-brand-400/30 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              {busy && mode === 'ai' && (
                <p className="text-[11px] text-slate-500">Ellenia is thinking…</p>
              )}
              <div ref={endRef} />
            </div>

            <form
              className="flex items-center gap-2 border-t border-white/10 p-3"
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(input)
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'human'
                    ? 'Message the human agent…'
                    : actor.staff
                      ? 'Ask Ellenia about leads, admin, or draft a reply…'
                      : 'Ask Ellenia anything…'
                }
                aria-label={
                  mode === 'human' ? 'Message the human agent' : 'Message Ellenia'
                }
                disabled={busy || mode === 'whatsapp'}
                className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand-400/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || mode === 'whatsapp'}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-400 text-slate-950 transition hover:bg-brand-300 disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto relative inline-flex items-center gap-2 rounded-full bg-brand-400 px-4 py-3 font-display text-sm font-semibold text-slate-950 shadow-[0_12px_40px_-10px_rgba(34,211,238,0.65)] transition hover:bg-brand-300"
        aria-label={open ? 'Close Ellenia chat' : 'Open Ellenia chat'}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask Ellenia'}</span>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 sm:static sm:ml-1 sm:h-2 sm:w-2 sm:ring-0" />
        )}
      </button>
    </div>
  )
}

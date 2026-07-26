import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  X,
  Send,
  UserRound,
  Bot,
  Minimize2,
  MessageSquare,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/data/site'
import { answerQuestion, loadFaqs, saveFaqs } from '@/lib/engagementStore'
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

export function ChatWidget() {
  const { settings } = useSiteFeatures()
  const { profile } = useSiteProfile()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('ai')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [session, setSession] = useState<LiveSession | null>(null)
  const [messages, setMessages] = useState<Bubble[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi — I’m Ellines Assist. Ask complex product/tech questions, open WhatsApp, or talk to a human agent live. We’re ${siteConfig.hours.label.toLowerCase()}.`,
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const waBase = `https://wa.me/${(profile.whatsapp || siteConfig.whatsapp).replace(/\D/g, '')}`

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open, session?.messages.length])

  // Hydrate chat knowledge from CMS (falls back to localStorage / defaults)
  useEffect(() => {
    let cancelled = false
    void fetchChatFaqs()
      .then((list) => {
        if (cancelled || !Array.isArray(list) || !list.length) return
        const mapped = list.map((f) => ({
          id: f.id,
          questions: f.questions,
          answer: f.answer,
          links: f.links,
        }))
        saveFaqs(mapped)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  // Poll live session when in human mode
  useEffect(() => {
    if (!open || mode !== 'human' || !session?.id) return
    const t = setInterval(async () => {
      try {
        const fresh = await getLiveSession(session.id)
        setSession(fresh)
      } catch {
        /* ignore transient */
      }
    }, 2500)
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
    const created = await createLiveSession('Website visitor')
    localStorage.setItem(SESSION_KEY, created.id)
    setSession(created)
    return created
  }

  async function sendAi(text: string) {
    setBusy(true)
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text }])
    try {
      const local = answerQuestion(text, loadFaqs())
      let answer = local.answer
      // For unmatched / complex questions, call Workers AI
      if (!local.matched || text.split(' ').length > 8) {
        try {
          const history = messages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .slice(-6)
            .map((m) => ({ role: m.role, text: m.text }))
          answer = await askAi(text, history)
        } catch {
          if (!local.matched) {
            answer =
              local.answer +
              ' You can also switch to Talk to a human for a live agent, or WhatsApp.'
          }
        }
      } else {
        answer = local.answer
      }
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'assistant', text: answer, links: local.links },
      ])
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
    const msg = encodeURIComponent(
      'Hello Ellines Tech — I need help from the website chat.',
    )
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

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
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
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">Ellines Assist</p>
                  <p className="text-[11px] text-emerald-300/90">
                    {siteConfig.hours.label} ·{' '}
                    {mode === 'human'
                      ? session?.status === 'live'
                        ? 'Human connected'
                        : 'Waiting for human'
                      : mode === 'whatsapp'
                        ? 'WhatsApp'
                        : 'AI online'}
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

            <div className="grid grid-cols-3 gap-1 border-b border-white/10 p-2">
              {(
                [
                  { id: 'ai', label: 'AI', icon: Bot },
                  { id: 'human', label: 'Human', icon: UserRound },
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
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
                    <p>{m.text}</p>
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
                  mode === 'human' ? 'Message the human agent…' : 'Ask anything…'
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
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Chat with us'}</span>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 sm:static sm:ml-1 sm:h-2 sm:w-2 sm:ring-0" />
        )}
      </button>
    </div>
  )
}

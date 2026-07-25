import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send, UserRound, Bot, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatQuickReplies } from '@/data/chatKnowledge'
import { siteConfig } from '@/data/site'
import {
  answerQuestion,
  loadFaqs,
  loadSettings,
  saveTranscript,
  type ChatTranscript,
} from '@/lib/engagementStore'
import { cn } from '@/lib/utils'

type Msg = { id: string; role: 'user' | 'assistant'; text: string; links?: { label: string; href: string }[] }

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function ChatWidget() {
  const settings = useMemo(() => loadSettings(), [])
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi — I’m the Ellines Tech assistant. Ask about products, services, or pricing. We’re ${siteConfig.hours.label.toLowerCase()} and I can connect you to a human anytime.`,
    },
  ])
  const transcriptId = useRef(uid())
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  if (!settings.chatEnabled) return null

  const waBase = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`

  function persist(next: Msg[]) {
    const transcript: ChatTranscript = {
      id: transcriptId.current,
      startedAt: new Date().toISOString(),
      messages: next.map((m) => ({
        role: m.role,
        text: m.text,
        at: new Date().toISOString(),
      })),
    }
    saveTranscript(transcript)
  }

  function pushAssistant(text: string, links?: Msg['links']) {
    setMessages((prev) => {
      const next = [...prev, { id: uid(), role: 'assistant' as const, text, links }]
      persist(next)
      return next
    })
  }

  function handleSend(raw: string) {
    const text = raw.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => {
      const withUser = [...prev, { id: uid(), role: 'user' as const, text }]
      persist(withUser)
      const result = answerQuestion(text, loadFaqs())
      const assistant: Msg = {
        id: uid(),
        role: 'assistant',
        text: result.answer,
        links: result.links,
      }
      const next = [...withUser, assistant]
      persist(next)
      return next
    })
  }

  function connectHuman() {
    const summary = messages
      .filter((m) => m.role === 'user')
      .slice(-4)
      .map((m) => `• ${m.text}`)
      .join('%0A')
    const msg = encodeURIComponent(
      `Hello Ellines Tech — I'd like to speak with a human.\n\nChat context:\n${decodeURIComponent(summary || '• (new conversation)')}`,
    )
    window.open(`${waBase}?text=${msg}`, '_blank', 'noopener,noreferrer')
    pushAssistant(
      'Opening WhatsApp so a human can continue with you. We’re always available — typically replies within a day or sooner.',
    )
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="pointer-events-auto flex h-[min(34rem,78vh)] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.35rem] border border-white/12 bg-slate-950/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-brand-500/15 via-transparent to-sky-500/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-400/30">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">Ellines Assist</p>
                  <p className="text-[11px] text-emerald-300/90">{siteConfig.hours.label} · Online</p>
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

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-white/10 bg-white/[0.04] text-slate-200',
                    )}
                  >
                    <p>{m.text}</p>
                    {m.links && m.links.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.links.map((link) =>
                          link.href.startsWith('http') ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-brand-300 underline-offset-2 hover:underline"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              key={link.href}
                              to={link.href}
                              className="text-xs font-semibold text-brand-300 underline-offset-2 hover:underline"
                              onClick={() => setOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 px-3 py-2">
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                {chatQuickReplies.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => (q.toLowerCase().includes('human') ? connectHuman() : handleSend(q))}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-slate-300 transition hover:border-brand-400/30 hover:text-brand-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={connectHuman}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
                >
                  <UserRound className="h-3.5 w-3.5" />
                  Human
                </button>
                <form
                  className="flex flex-1 items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend(input)
                  }}
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything…"
                    className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand-400/40"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-400 text-slate-950 transition hover:bg-brand-300"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
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

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  claimLiveSession,
  getLiveSession,
  listLiveSessions,
  postLiveMessage,
  type LiveSession,
  type LiveSessionSummary,
} from '@/lib/liveChatApi'
import { cn } from '@/lib/utils'

export function AdminLiveChatPage() {
  const [sessions, setSessions] = useState<LiveSessionSummary[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [session, setSession] = useState<LiveSession | null>(null)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  async function refreshList() {
    try {
      const list = await listLiveSessions()
      setSessions(list)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load chats')
    }
  }

  useEffect(() => {
    refreshList()
    const t = setInterval(refreshList, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!activeId) {
      setSession(null)
      return
    }
    let cancelled = false
    async function load() {
      try {
        const s = await getLiveSession(activeId!, true)
        if (!cancelled) setSession(s)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unable to load session')
      }
    }
    load()
    const t = setInterval(load, 2500)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [activeId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages.length])

  async function send() {
    if (!activeId || !text.trim()) return
    const next = await postLiveMessage(activeId, text.trim(), 'admin')
    setSession(next)
    setText('')
    refreshList()
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Live Chat</h2>
        <p className="mt-1 text-sm text-slate-400">
          Talk to website visitors in real time when they choose “Talk to a human”.
        </p>
      </div>
      {error && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {error}. Live chat syncs after Cloudflare Functions + KV are active on deploy.
        </p>
      )}

      <div className="grid min-h-[32rem] gap-4 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-white">
            Inbox
          </div>
          <div className="max-h-[34rem] overflow-y-auto">
            {sessions.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No chat sessions yet.</p>
            )}
            {sessions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={cn(
                  'block w-full border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5',
                  activeId === s.id && 'bg-brand-500/10',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white">{s.visitorName}</p>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                      s.status === 'waiting' && 'bg-amber-500/20 text-amber-200',
                      s.status === 'live' && 'bg-emerald-500/20 text-emerald-200',
                      s.status === 'ai' && 'bg-sky-500/20 text-sky-200',
                      s.status === 'closed' && 'bg-slate-500/20 text-slate-300',
                    )}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{s.preview}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          {!session ? (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{session.visitorName}</p>
                  <p className="text-xs text-slate-500">{session.status}</p>
                </div>
                {session.status !== 'live' && session.status !== 'closed' && (
                  <Button
                    type="button"
                    onClick={async () => {
                      const s = await claimLiveSession(session.id, 'Admin')
                      setSession(s)
                      refreshList()
                    }}
                  >
                    Claim & join
                  </Button>
                )}
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {session.messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'flex',
                      m.role === 'admin' ? 'justify-end' : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                        m.role === 'admin' && 'bg-brand-400 text-slate-950',
                        m.role === 'visitor' && 'border border-white/10 bg-white/5 text-slate-200',
                        (m.role === 'assistant' || m.role === 'ai') &&
                          'border border-sky-500/20 bg-sky-500/10 text-sky-100',
                        m.role === 'system' && 'text-xs text-slate-500',
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <form
                className="flex gap-2 border-t border-white/10 p-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  send()
                }}
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Message visitor…"
                  className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-brand-400/40"
                />
                <Button type="submit">Send</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

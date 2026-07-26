import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { ChatFaq } from '@/data/chatKnowledge'
import { defaultChatFaqs } from '@/data/chatKnowledge'
import { loadFaqs, resetFaqs, saveFaqs } from '@/lib/engagementStore'
import { fetchChatFaqs, saveChatFaqs } from '@/lib/cmsApi'

export function AdminChatPage() {
  const [faqs, setFaqs] = useState<ChatFaq[]>(() => loadFaqs())
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChatFaqs()
      .then((list) => {
        if (Array.isArray(list) && list.length) {
          const mapped = list.map((f) => ({
            id: f.id,
            questions: f.questions,
            answer: f.answer,
            links: f.links,
          }))
          setFaqs(mapped)
          saveFaqs(mapped)
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load CMS FAQs'))
      .finally(() => setLoading(false))
  }, [])

  function updateFaq(index: number, patch: Partial<ChatFaq>) {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))
    setSaved(false)
  }

  function addFaq() {
    setFaqs((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        questions: ['new question'],
        answer: 'Write the answer customers should receive.',
      },
    ])
    setSaved(false)
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  async function persist() {
    setError('')
    try {
      await saveChatFaqs(faqs)
      saveFaqs(faqs)
      setSaved(true)
    } catch (e) {
      // Still keep local copy so chat works on this device
      saveFaqs(faqs)
      setError(e instanceof Error ? e.message : 'CMS save failed — saved locally only')
      setSaved(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Chat knowledge</h1>
          <p className="mt-2 text-slate-400">
            Train the engagement assistant. Saves to CMS (KV) so every visitor gets the same answers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={addFaq}>
            Add FAQ
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              resetFaqs()
              setFaqs(defaultChatFaqs)
              setSaved(false)
            }}
          >
            Reset defaults
          </Button>
          <Button type="button" onClick={() => void persist()} icon disabled={loading}>
            {saved ? 'Saved' : 'Save knowledge'}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-amber-200">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading CMS knowledge…</p>}

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <article
            key={faq.id}
            className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-mono text-xs text-slate-500">{faq.id}</p>
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="text-xs text-rose-300 hover:text-rose-200"
              >
                Remove
              </button>
            </div>
            <label className="block text-sm text-slate-400">
              Trigger phrases (comma separated)
              <input
                value={faq.questions.join(', ')}
                onChange={(e) =>
                  updateFaq(index, {
                    questions: e.target.value
                      .split(',')
                      .map((q) => q.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
              />
            </label>
            <label className="mt-3 block text-sm text-slate-400">
              Answer
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(index, { answer: e.target.value })}
                rows={3}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
              />
            </label>
          </article>
        ))}
      </div>
    </div>
  )
}

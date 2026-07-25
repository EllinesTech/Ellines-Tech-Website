import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { subscribeNewsletter } from '@/lib/cmsApi'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await subscribeNewsletter(email)
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('err')
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-brand-400/40 sm:max-w-xs"
      />
      <Button type="submit" variant="secondary">
        Subscribe
      </Button>
      {status === 'ok' && <span className="text-xs text-emerald-300">You’re on the list.</span>}
      {status === 'err' && <span className="text-xs text-amber-200">Try again.</span>}
    </form>
  )
}

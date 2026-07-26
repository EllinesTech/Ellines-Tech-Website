import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { subscribeNewsletter } from '@/lib/cmsApi'
import { useHoneypot } from '@/components/HoneypotField'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [consent, setConsent] = useState(false)
  const { website, honeypot } = useHoneypot()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) {
      setStatus('err')
      return
    }
    try {
      await subscribeNewsletter(email, website)
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('err')
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-3">
      {honeypot}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-brand-400/40 sm:max-w-xs"
        />
        <Button type="submit" variant="secondary" disabled={!consent}>
          Subscribe
        </Button>
      </div>
      <label className="flex max-w-xl items-start gap-2 text-xs leading-relaxed text-slate-500">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-cyan-400"
          required
        />
        <span>
          I consent to Ellines Tech storing my email for updates, per the{' '}
          <Link to="/privacy" className="text-brand-300 hover:text-brand-200">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {status === 'ok' && <span className="text-xs text-emerald-300">You’re on the list.</span>}
      {status === 'err' && (
        <span className="text-xs text-amber-200">
          {consent ? 'Try again.' : 'Please accept the privacy notice.'}
        </span>
      )}
    </form>
  )
}

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

/**
 * Second step after password succeeds when TOTP is enabled.
 * Accepts a 6-digit authenticator code or a one-time recovery code.
 */
export function TotpChallengeForm({
  onVerify,
  onBack,
  busy = false,
  error = '',
}: {
  onVerify: (code: string) => Promise<void> | void
  onBack?: () => void
  busy?: boolean
  error?: string
}) {
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError('')
    const cleaned = code.trim()
    if (!cleaned) {
      setLocalError('Enter your authenticator or recovery code')
      return
    }
    await onVerify(cleaned)
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <div>
        <label htmlFor="totp-challenge-code" className="text-sm font-medium text-slate-200">
          Authenticator code
        </label>
        <p id="totp-challenge-hint" className="mt-1 text-xs text-slate-500">
          Open your authenticator app, or use a one-time recovery code.
        </p>
      </div>
      <input
        id="totp-challenge-code"
        type="text"
        inputMode="text"
        autoComplete="one-time-code"
        spellCheck={false}
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="123456 or recovery code"
        aria-describedby="totp-challenge-hint"
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-lg tracking-widest text-white outline-none focus:border-brand-400/40"
        autoFocus
      />
      {(error || localError) && (
        <p role="alert" className="text-sm text-rose-300">
          {error || localError}
        </p>
      )}
      <Button type="submit" className="w-full" icon disabled={busy}>
        {busy ? 'Verifying…' : 'Verify and continue'}
      </Button>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-xs text-slate-500 hover:text-brand-300"
        >
          ← Back to password
        </button>
      )}
    </form>
  )
}

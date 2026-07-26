import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import {
  disableTotp,
  fetchTotpStatus,
  beginTotpSetup,
  confirmTotpSetup,
} from '@/lib/cmsApi'

type TotpStatus = {
  subject: 'owner' | 'user'
  enabled: boolean
  recoveryRemaining: number
  enabledAt: string | null
  role?: string | null
}

/**
 * Enable / disable TOTP for the current privileged session
 * (owner-key God Mode or staff / admin / super_admin account).
 */
export function TotpSetupPanel({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<TotpStatus | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [secret, setSecret] = useState('')
  const [otpauthUrl, setOtpauthUrl] = useState('')
  const [accountName, setAccountName] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [disablePassword, setDisablePassword] = useState('')
  const [disableCode, setDisableCode] = useState('')

  async function refresh() {
    const next = await fetchTotpStatus()
    setStatus(next)
  }

  useEffect(() => {
    let cancelled = false
    fetchTotpStatus()
      .then((s) => {
        if (!cancelled) setStatus(s)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load 2FA status')
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onBegin() {
    setBusy(true)
    setError('')
    setMessage('')
    setRecoveryCodes([])
    try {
      const res = await beginTotpSetup()
      setSecret(res.secret)
      setOtpauthUrl(res.otpauthUrl)
      setAccountName(res.accountName)
      setMessage('Scan or enter the secret in your authenticator app, then confirm with a code.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start 2FA setup')
    } finally {
      setBusy(false)
    }
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const res = await confirmTotpSetup(confirmCode.trim())
      setRecoveryCodes(res.recoveryCodes)
      setSecret('')
      setOtpauthUrl('')
      setConfirmCode('')
      setMessage(res.message)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not confirm 2FA')
    } finally {
      setBusy(false)
    }
  }

  async function onDisable(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await disableTotp({ password: disablePassword, code: disableCode.trim() })
      setDisablePassword('')
      setDisableCode('')
      setRecoveryCodes([])
      setMessage('Two-factor authentication disabled.')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not disable 2FA')
    } finally {
      setBusy(false)
    }
  }

  const subjectLabel =
    status?.subject === 'owner' ? 'Owner key' : status?.role === 'super_admin' ? 'Super Admin' : 'Staff account'

  return (
    <div className={`space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 ${className}`}>
      <div>
        <h3 className="font-display text-lg font-semibold text-white">Two-factor authentication</h3>
        <p className="mt-1 text-xs text-slate-400">
          TOTP via Google Authenticator, Authy, 1Password, or any compatible app. Applies to this{' '}
          {subjectLabel.toLowerCase()} sign-in.
        </p>
      </div>

      {status && (
        <p className="text-sm text-slate-300">
          Status:{' '}
          <span className={status.enabled ? 'text-emerald-300' : 'text-amber-200'}>
            {status.enabled ? 'Enabled' : 'Not enabled'}
          </span>
          {status.enabled && status.recoveryRemaining >= 0 && (
            <span className="text-slate-500">
              {' '}
              · {status.recoveryRemaining} recovery code{status.recoveryRemaining === 1 ? '' : 's'} left
            </span>
          )}
        </p>
      )}

      {error && <p className="text-sm text-rose-300">{error}</p>}
      {message && <p className="text-sm text-emerald-300">{message}</p>}

      {recoveryCodes.length > 0 && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-amber-100">Save these recovery codes now</p>
          <p className="mt-1 text-xs text-amber-100/80">
            Each code works once. Store them offline — they will not be shown again.
          </p>
          <ul className="mt-3 grid gap-1 font-mono text-sm text-amber-50 sm:grid-cols-2">
            {recoveryCodes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      )}

      {!status?.enabled && !secret && (
        <Button type="button" size="sm" onClick={() => void onBegin()} disabled={busy}>
          {busy ? 'Starting…' : 'Set up authenticator'}
        </Button>
      )}

      {secret && (
        <form onSubmit={(e) => void onConfirm(e)} className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Manual entry</p>
            <p className="mt-1">
              Account: <span className="text-white">{accountName}</span>
            </p>
            <p className="mt-2 break-all font-mono text-sm tracking-wide text-brand-200">{secret}</p>
            {otpauthUrl && (
              <a
                href={otpauthUrl}
                className="mt-2 inline-block text-brand-300 hover:text-brand-200"
              >
                Open otpauth:// link on this device
              </a>
            )}
          </div>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            pattern="[0-9]{6}"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
            placeholder="6-digit code"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-white outline-none focus:border-brand-400/40"
          />
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? 'Confirming…' : 'Confirm and enable 2FA'}
          </Button>
        </form>
      )}

      {status?.enabled && (
        <form onSubmit={(e) => void onDisable(e)} className="space-y-3 border-t border-white/10 pt-4">
          <p className="text-xs text-slate-500">
            Disable requires your{' '}
            {status.subject === 'owner' ? 'owner key' : 'current password'} plus a fresh authenticator
            or recovery code.
          </p>
          <PasswordInput
            required
            value={disablePassword}
            onChange={(e) => setDisablePassword(e.target.value)}
            placeholder={status.subject === 'owner' ? 'Owner key (ADMIN_API_KEY)' : 'Current password'}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
            autoComplete="current-password"
          />
          <input
            type="text"
            required
            value={disableCode}
            onChange={(e) => setDisableCode(e.target.value)}
            placeholder="Authenticator or recovery code"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-white outline-none focus:border-brand-400/40"
          />
          <Button type="submit" size="sm" variant="secondary" disabled={busy}>
            {busy ? 'Disabling…' : 'Disable 2FA'}
          </Button>
        </form>
      )}
    </div>
  )
}

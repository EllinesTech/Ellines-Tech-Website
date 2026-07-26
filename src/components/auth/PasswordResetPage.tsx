import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Field, fieldClass } from '@/components/ui/Field'
import { PasswordInput } from '@/components/ui/PasswordInput'
import {
  completePasswordReset,
  requestPasswordReset,
  verifyPasswordResetCode,
} from '@/lib/cmsApi'
import { isGodRole, isStaffRole, saveAuthSession } from '@/lib/auth'
import { cn } from '@/lib/utils'

type Step = 'request' | 'verify' | 'complete'

/**
 * Shared forgot-password flow for clients, staff, admins, and super admins.
 * Delivers a hashed OTP by email + SMS (when a phone is on file).
 */
export function PasswordResetPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState(params.get('email') || '')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const returnTo = params.get('from') || '/account'

  async function requestCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    try {
      const res = await requestPasswordReset(email.trim())
      const emailReady = Boolean(res.channels?.emailConfigured)
      const smsReady = Boolean(res.channels?.smsConfigured)
      if (!emailReady && !smsReady) {
        setError(
          'Password reset delivery is not configured on this site yet. Contact support or try again later.',
        )
        return
      }
      setMessage(
        res.message ||
          'If an account exists for that email, a reset code has been sent by email and SMS.',
      )
      setStep('verify')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send code')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await verifyPasswordResetCode(email.trim(), code.trim())
      setMessage('Code verified. Choose a new password.')
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
    } finally {
      setBusy(false)
    }
  }

  async function finish(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPassword !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      const res = await completePasswordReset(email.trim(), code.trim(), newPassword)
      if (res.token && res.user) {
        saveAuthSession(res.token as string, {
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          role: res.user.role,
          jobTitle: res.user.jobTitle,
          phone: res.user.phone,
        })
        if (isGodRole(res.user.role)) {
          navigate('/admin', { replace: true })
          return
        }
        if (isStaffRole(res.user.role)) {
          navigate('/staff', { replace: true })
          return
        }
        navigate('/account', { replace: true })
        return
      }
      setMessage('Password updated. You can sign in now.')
      setStep('request')
      navigate(returnTo.startsWith('/') ? returnTo : '/account', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SEO
        title="Reset password"
        description="Reset your Ellines Tech account password with a one-time code."
        path="/account/reset"
      />
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,168,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-md px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
            Ellines Tech
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">Reset password</h1>
          <p className="mt-3 text-sm text-slate-400">
            Works for client, staff, admin, and Super Admin accounts. We send a one-time code by
            email and SMS when a phone number is on your profile.
          </p>

          <div className="mt-6 flex gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {(['request', 'verify', 'complete'] as Step[]).map((s, i) => (
              <span
                key={s}
                className={cn(
                  'rounded-md px-2 py-1',
                  step === s ? 'bg-brand-500/15 text-brand-200' : 'bg-white/[0.03]',
                )}
              >
                {i + 1}. {s === 'request' ? 'Email' : s === 'verify' ? 'Code' : 'New password'}
              </span>
            ))}
          </div>

          {step === 'request' && (
            <form
              onSubmit={requestCode}
              className="mt-6 space-y-5 rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6"
            >
              <Field label="Account email" htmlFor="reset-email">
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  autoComplete="email"
                  autoFocus
                />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-rose-300">
                  {error}
                </p>
              )}
              {message && (
                <p role="status" className="text-sm text-emerald-300">
                  {message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? 'Sending…' : 'Send reset code'}
              </Button>
            </form>
          )}

          {step === 'verify' && (
            <form
              onSubmit={verifyCode}
              className="mt-6 space-y-5 rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6"
            >
              <p className="text-sm text-slate-400">
                Enter the 6-digit code sent to <span className="text-slate-200">{email}</span>.
              </p>
              <Field label="Reset code" htmlFor="reset-code">
                <input
                  id="reset-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={cn(fieldClass, 'tracking-[0.35em]')}
                  autoComplete="one-time-code"
                  autoFocus
                />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-rose-300">
                  {error}
                </p>
              )}
              {message && (
                <p role="status" className="text-sm text-emerald-300">
                  {message}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={busy}>
                  {busy ? 'Checking…' : 'Verify code'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => {
                    void (async () => {
                      setError('')
                      setMessage('')
                      setBusy(true)
                      try {
                        const res = await requestPasswordReset(email.trim())
                        setCode('')
                        setMessage(
                          res.message ||
                            'If an account exists for that email, a new reset code has been sent.',
                        )
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Could not resend code')
                      } finally {
                        setBusy(false)
                      }
                    })()
                  }}
                >
                  Resend code
                </Button>
              </div>
            </form>
          )}

          {step === 'complete' && (
            <form
              onSubmit={finish}
              className="mt-6 space-y-5 rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6"
            >
              <Field label="New password" htmlFor="reset-new" hint="At least 8 characters.">
                <PasswordInput
                  id="reset-new"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={fieldClass}
                  autoComplete="new-password"
                  autoFocus
                />
              </Field>
              <Field label="Confirm password" htmlFor="reset-confirm">
                <PasswordInput
                  id="reset-confirm"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={fieldClass}
                  autoComplete="new-password"
                />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-rose-300">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? 'Saving…' : 'Set new password'}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            Remembered it?{' '}
            <Link to={returnTo.startsWith('/') ? returnTo : '/account'} className="text-brand-300">
              Back to sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

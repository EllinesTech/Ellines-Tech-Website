import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, fieldClass } from '@/components/ui/Field'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { changePassword } from '@/lib/cmsApi'
import { loadAuthToken, saveAuthSession, type AuthUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

/**
 * Signed-in password change for any CMS role (super_admin, admin, staff, client).
 * Owner-key God Mode sessions have no account password — those callers see an error.
 */
export function ChangePasswordForm({
  user,
  onUpdated,
  className,
}: {
  user: AuthUser
  onUpdated?: (next: AuthUser) => void
  className?: string
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (newPassword !== confirm) {
      setError('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    setBusy(true)
    try {
      const res = await changePassword(currentPassword, newPassword)
      const next = {
        ...user,
        name: (res.user?.name as string) || user.name,
        phone: (res.user?.phone as string) || user.phone,
      }
      if (res.token) saveAuthSession(res.token as string, next)
      else {
        const token = loadAuthToken()
        if (token) saveAuthSession(token, next)
      }
      onUpdated?.(next)
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
      setMessage('Password updated. Other sessions for this account were signed out.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn('space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5', className)}
    >
      <div>
        <h3 className="font-display text-lg font-semibold text-white">Change password</h3>
        <p className="mt-1 text-xs text-slate-500">
          Updates the password for {user.email}. You will stay signed in on this device.
        </p>
      </div>
      <Field label="Current password" htmlFor="pwd-current">
        <PasswordInput
          id="pwd-current"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={fieldClass}
          autoComplete="current-password"
        />
      </Field>
      <Field label="New password" htmlFor="pwd-new" hint="At least 8 characters.">
        <PasswordInput
          id="pwd-new"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={fieldClass}
          autoComplete="new-password"
        />
      </Field>
      <Field label="Confirm new password" htmlFor="pwd-confirm">
        <PasswordInput
          id="pwd-confirm"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={fieldClass}
          autoComplete="new-password"
        />
      </Field>
      {error && <p className="text-sm text-rose-300">{error}</p>}
      {message && <p className="text-sm text-emerald-300">{message}</p>}
      <Button type="submit" size="sm" disabled={busy}>
        {busy ? 'Saving…' : 'Update password'}
      </Button>
    </form>
  )
}

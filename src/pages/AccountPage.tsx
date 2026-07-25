import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { loginCustomer, registerCustomer } from '@/lib/cmsApi'
import {
  clearAuthSession,
  loadAuthUser,
  saveAuthSession,
  type AuthUser,
} from '@/lib/auth'

export function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthUser())
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res =
        mode === 'login'
          ? await loginCustomer({ email, password })
          : await registerCustomer({ email, password, name })
      saveAuthSession(res.token, res.user)
      setUser(res.user)
      setMessage(mode === 'login' ? 'Signed in' : 'Account created')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    }
  }

  return (
    <>
      <SEO title="Account" description="Customer account for Ellines Tech shop and orders." path="/account" />
      <section className="section-padding">
        <div className="section-container max-w-md">
          <h1 className="font-display text-3xl font-bold text-white">Account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Customer accounts for the IT shop. Staff use{' '}
            <Link to="/admin/login" className="text-brand-300">
              Super Admin
            </Link>
            .
          </p>

          {user ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white">
                Signed in as <strong>{user.name}</strong>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {user.email} · {user.role}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button href="/shop">Browse shop</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    clearAuthSession()
                    setUser(null)
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  className={mode === 'login' ? 'text-brand-300' : 'text-slate-500'}
                  onClick={() => setMode('login')}
                >
                  Sign in
                </button>
                <span className="text-slate-600">/</span>
                <button
                  type="button"
                  className={mode === 'register' ? 'text-brand-300' : 'text-slate-500'}
                  onClick={() => setMode('register')}
                >
                  Create account
                </button>
              </div>
              {mode === 'register' && (
                <input
                  required
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
                />
              )}
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
              />
              <input
                required
                type="password"
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
              />
              {error && <p className="text-sm text-amber-200">{error}</p>}
              {message && <p className="text-sm text-emerald-300">{message}</p>}
              <Button type="submit" className="w-full">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

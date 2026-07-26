import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { CompanyMaterials } from '@/components/downloads/CompanyMaterials'
import {
  fetchMyInvoices,
  fetchMyLeads,
  loginCustomer,
  registerCustomer,
  updateProfile,
  type Invoice,
} from '@/lib/cmsApi'
import {
  clearAuthSession,
  isCustomerRole,
  isStaffRole,
  loadAuthToken,
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
  const [leads, setLeads] = useState<
    { id: string; packageName?: string; intent?: string; status?: string; at: string }[]
  >([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    if (!user) return
    if (isStaffRole(user.role)) return
    setProfileName(user.name)
    fetchMyLeads()
      .then(setLeads)
      .catch(() => setLeads([]))
    fetchMyInvoices()
      .then(setInvoices)
      .catch(() => setInvoices([]))
  }, [user])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res =
        mode === 'login'
          ? await loginCustomer({ email, password })
          : await registerCustomer({ email, password, name })
      if (isStaffRole(res.user.role)) {
        saveAuthSession(res.token, res.user)
        window.location.href = '/staff'
        return
      }
      if (!isCustomerRole(res.user.role)) {
        setError('Use the correct portal for your account type.')
        return
      }
      saveAuthSession(res.token, res.user)
      setUser(res.user)
      setMessage(mode === 'login' ? 'Signed in' : 'Account created')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    }
  }

  if (user && isStaffRole(user.role)) {
    return <NavigateStaff />
  }

  return (
    <>
      <SEO
        title="Client account"
        description="Client login for Ellines Tech product pricing, packages, requests, and invoices."
        path="/account"
        noindex
      />
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-white">Client account</h1>
          <p className="mt-2 text-sm text-slate-400">
            For clients using product pricing and packages — track requests, invoices, and orders.
            Employees use{' '}
            <Link to="/staff/login" className="text-brand-300">
              Staff login
            </Link>
            .
          </p>

          {user && isCustomerRole(user.role) ? (
            <div className="mt-8 space-y-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-white">
                  Signed in as <strong>{user.name}</strong>
                </p>
                <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button href="/request?intent=buy">New package request</Button>
                  <Button href="/pricing" variant="secondary">
                    Browse pricing
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      clearAuthSession()
                      setUser(null)
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 p-5">
                  <h2 className="font-display text-lg font-semibold text-white">My requests</h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {leads.map((l) => (
                      <li key={l.id} className="border-b border-white/5 pb-2 text-slate-300">
                        {l.packageName || l.intent || 'Request'} · {l.status || 'submitted'}
                        <span className="block text-xs text-slate-600">
                          {new Date(l.at).toLocaleString()}
                        </span>
                      </li>
                    ))}
                    {leads.length === 0 && (
                      <li className="text-slate-500">No requests linked to this email yet.</li>
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 p-5">
                  <h2 className="font-display text-lg font-semibold text-white">
                    Invoices & receipts
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {invoices.map((inv) => (
                      <li key={inv.id} className="border-b border-white/5 pb-2 text-slate-300">
                        <Link
                          to={`/invoice/${inv.id}?token=${inv.publicToken}`}
                          className="text-brand-300 hover:underline"
                        >
                          {inv.number}
                        </Link>{' '}
                        · {inv.status} · {inv.currency} {Number(inv.total).toLocaleString()}
                      </li>
                    ))}
                    {invoices.length === 0 && (
                      <li className="text-slate-500">
                        No invoices yet. Guest invoice links still work from email.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 p-5">
                <h2 className="font-display text-lg font-semibold text-white">Profile</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={async () => {
                      try {
                        const res = await updateProfile(profileName)
                        const token = loadAuthToken()
                        const next = { ...user, name: res.user.name as string }
                        if (token) saveAuthSession(token, next)
                        setUser(next)
                        setMessage('Profile updated')
                      } catch (err) {
                        setError(err instanceof Error ? err.message : 'Update failed')
                      }
                    }}
                  >
                    Save name
                  </Button>
                </div>
                {message && <p className="mt-2 text-sm text-emerald-300">{message}</p>}
                {error && <p className="mt-2 text-sm text-amber-200">{error}</p>}
              </div>

              <div className="rounded-2xl border border-white/10 p-5">
                <CompanyMaterials
                  compact
                  title="Company materials"
                  description=""
                />
                <p className="mt-3 text-xs text-slate-500">
                  Need a custom pack for a tender?{' '}
                  <Link to="/contact" className="text-brand-300">
                    Contact us
                  </Link>
                  .
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mt-8 max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  className={mode === 'login' ? 'text-brand-300' : 'text-slate-500'}
                  onClick={() => setMode('login')}
                >
                  Client sign in
                </button>
                <span className="text-slate-600">/</span>
                <button
                  type="button"
                  className={mode === 'register' ? 'text-brand-300' : 'text-slate-500'}
                  onClick={() => setMode('register')}
                >
                  Create client account
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
              <PasswordInput
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
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

function NavigateStaff() {
  return (
    <section className="section-padding">
      <div className="section-container max-w-md text-center">
        <p className="text-slate-300">You are signed in as staff.</p>
        <Button href="/staff" className="mt-4">
          Go to staff workspace
        </Button>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { Field, fieldClass } from '@/components/ui/Field'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { CompanyMaterials } from '@/components/downloads/CompanyMaterials'
import {
  completeLogin2fa,
  fetchMyInvoices,
  fetchMyLeads,
  loginCustomer,
  logoutUser,
  registerCustomer,
  updateProfile,
  type Invoice,
} from '@/lib/cmsApi'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { TotpChallengeForm } from '@/components/auth/TotpChallengeForm'
import {
  clearAuthSession,
  isCustomerRole,
  isStaffRole,
  loadAuthToken,
  loadAuthUser,
  saveAuthSession,
  type AuthUser,
} from '@/lib/auth'
import { startPaystackCheckout } from '@/lib/paystackApi'
import { cn } from '@/lib/utils'

type PortalTab = 'overview' | 'requests' | 'invoices' | 'support' | 'profile'

const tabs: { id: PortalTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'requests', label: 'Requests' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'support', label: 'Support' },
  { id: 'profile', label: 'Profile & Password' },
]

function statusTone(status?: string) {
  const s = String(status || '').toLowerCase()
  if (['won', 'paid', 'closed', 'completed'].includes(s)) return 'bg-emerald-500/15 text-emerald-200'
  if (['lost', 'cancelled', 'void'].includes(s)) return 'bg-rose-500/15 text-rose-200'
  if (['sent', 'contacted', 'qualified', 'in_progress'].includes(s))
    return 'bg-sky-500/15 text-sky-200'
  return 'bg-amber-500/15 text-amber-200'
}

export function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthUser())
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState<PortalTab>('overview')
  const [leads, setLeads] = useState<
    { id: string; packageName?: string; intent?: string; status?: string; at: string }[]
  >([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [payingId, setPayingId] = useState<string | null>(null)
  const [challengeToken, setChallengeToken] = useState('')
  const [busyAuth, setBusyAuth] = useState(false)

  useEffect(() => {
    if (!user) return
    if (isStaffRole(user.role)) return
    setProfileName(user.name)
    setProfilePhone(user.phone || '')
    fetchMyLeads()
      .then(setLeads)
      .catch(() => setLeads([]))
    fetchMyInvoices()
      .then(setInvoices)
      .catch(() => setInvoices([]))
  }, [user])

  function finishAuth(token: string, next: AuthUser) {
    if (isStaffRole(next.role)) {
      saveAuthSession(token, next)
      window.location.href = '/staff'
      return
    }
    if (!isCustomerRole(next.role)) {
      setError('Use the correct portal for your account type.')
      return
    }
    saveAuthSession(token, next)
    setUser(next)
    setChallengeToken('')
    setMessage(mode === 'login' ? 'Signed in' : 'Account created')
  }

  async function payInvoice(inv: Invoice, kind: 'full' | 'deposit' = 'full') {
    if (!inv.clientEmail) {
      setError('Invoice is missing a billing email — open the invoice link to pay.')
      return
    }
    setError('')
    setPayingId(`${inv.id}:${kind}`)
    try {
      await startPaystackCheckout({
        type: kind === 'deposit' ? 'deposit' : 'invoice',
        email: inv.clientEmail,
        name: inv.clientName || user?.name,
        invoiceId: inv.id,
        publicToken: inv.publicToken,
        currency: inv.currency || 'KES',
        brand: 'tech',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start payment')
      setPayingId(null)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setBusyAuth(true)
    try {
      if (mode === 'login') {
        const res = await loginCustomer({ email, password })
        if ('requires2fa' in res && res.requires2fa) {
          setChallengeToken(res.challengeToken)
          return
        }
        if (!('user' in res) || !res.user) {
          setError('Sign-in incomplete. Try again.')
          return
        }
        finishAuth(res.token, res.user)
        return
      }
      const res = await registerCustomer({ email, password, name })
      finishAuth(res.token as string, res.user as AuthUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setBusyAuth(false)
    }
  }

  async function onVerify2fa(code: string) {
    setError('')
    setBusyAuth(true)
    try {
      const res = await completeLogin2fa({ challengeToken, code })
      if (!('user' in res) || !res.user) {
        setError('Sign-in incomplete. Try again.')
        return
      }
      finishAuth(res.token, res.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setBusyAuth(false)
    }
  }

  if (user && isStaffRole(user.role)) {
    return <NavigateStaff />
  }

  const openLeads = leads.filter(
    (l) => !['won', 'lost', 'closed'].includes(String(l.status || '')),
  ).length
  const unpaid = invoices.filter((i) => i.status === 'sent' || i.status === 'draft').length

  return (
    <>
      <SEO
        title="Client account"
        description="Client login for Ellines Tech product pricing, packages, requests, and invoices."
        path="/account"
        noindex
      />
      <section className="relative section-padding">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 mesh-bg opacity-40" />

        <div className="section-container relative max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
            Client portal
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {user && isCustomerRole(user.role)
              ? `Welcome back, ${user.name.split(' ')[0]}`
              : 'Your projects, in one place'}
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Track package requests, invoices, and company materials. Employees use{' '}
            <Link to="/staff/login" className="text-brand-300 hover:text-brand-200">
              Staff login
            </Link>
            .
          </p>

          {user && isCustomerRole(user.role) ? (
            <div className="mt-10 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 font-display text-base font-bold text-brand-200 ring-1 ring-brand-400/25">
                    {user.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await logoutUser()
                    clearAuthSession()
                    setUser(null)
                  }}
                >
                  Sign out
                </Button>
              </div>

              <nav
                className="flex flex-wrap gap-x-1 gap-y-1 border-b border-white/10"
                aria-label="Portal sections"
              >
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    aria-pressed={tab === t.id}
                    className={cn(
                      'relative -mb-px px-3 py-2.5 text-sm font-medium transition-colors',
                      tab === t.id ? 'text-brand-200' : 'text-slate-400 hover:text-slate-200',
                    )}
                  >
                    {t.label}
                    {tab === t.id && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-400" />
                    )}
                  </button>
                ))}
              </nav>

              {tab === 'overview' && (
                <div className="space-y-10">
                  <div className="grid gap-8 border-b border-white/10 pb-8 sm:grid-cols-3">
                    {[
                      { label: 'Open requests', value: openLeads },
                      { label: 'All requests', value: leads.length },
                      { label: 'Unpaid invoices', value: unpaid },
                    ].map((s, i) => (
                      <div
                        key={s.label}
                        className={cn(
                          'sm:px-6 sm:first:pl-0',
                          i > 0 && 'sm:border-l sm:border-white/10',
                        )}
                      >
                        <p className="font-display text-4xl font-bold tracking-tight text-gradient">
                          {s.value}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button href="/request?intent=buy" icon>
                      New package request
                    </Button>
                    <Button href="/pricing" variant="secondary">
                      Browse pricing
                    </Button>
                    <Button href="/contact" variant="ghost">
                      Contact support
                    </Button>
                  </div>
                  <div className="border-t border-white/10 pt-8">
                    <CompanyMaterials
                      compact
                      title="Company materials"
                      description="Download company profile and pricing packs."
                    />
                  </div>
                </div>
              )}

              {tab === 'requests' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-xl font-bold tracking-tight text-white">
                      My requests
                    </h2>
                    <Button href="/request?intent=buy" size="sm">
                      New request
                    </Button>
                  </div>
                  <ul className="mt-6 divide-y divide-white/8 border-y border-white/10">
                    {leads.map((l) => (
                      <li
                        key={l.id}
                        className="flex flex-wrap items-center justify-between gap-3 py-4"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-white">
                            {l.packageName || l.intent || 'Request'}
                          </p>
                          <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-slate-600">
                            {new Date(l.at).toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize',
                            statusTone(l.status),
                          )}
                        >
                          {l.status || 'submitted'}
                        </span>
                      </li>
                    ))}
                    {leads.length === 0 && (
                      <li className="py-6 text-sm text-slate-500">
                        No requests linked to this email yet.{' '}
                        <Link to="/request?intent=buy" className="text-brand-300">
                          Start one
                        </Link>
                        .
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {tab === 'invoices' && (
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-white">
                    Invoices &amp; receipts
                  </h2>
                  {error && (
                    <p className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                      {error}
                    </p>
                  )}
                  <ul className="mt-6 divide-y divide-white/8 border-y border-white/10">
                    {invoices.map((inv) => {
                      const remaining = Math.max(
                        0,
                        Number(inv.total || 0) - Number(inv.amountPaid || 0),
                      )
                      const unpaid =
                        inv.status !== 'paid' && inv.status !== 'cancelled' && remaining > 0
                      return (
                        <li
                          key={inv.id}
                          className="flex flex-wrap items-center justify-between gap-3 py-4"
                        >
                          <Link
                            to={`/invoice/${inv.id}?token=${inv.publicToken}`}
                            className="group min-w-0 flex-1"
                          >
                            <p className="font-medium text-white transition-colors group-hover:text-brand-200">
                              {inv.number}
                            </p>
                            <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-slate-600">
                              {inv.currency} {Number(inv.total).toLocaleString()}
                              {Number(inv.amountPaid || 0) > 0 && inv.status !== 'paid'
                                ? ` · balance ${remaining.toLocaleString()}`
                                : ''}
                            </span>
                          </Link>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize',
                                statusTone(inv.status),
                              )}
                            >
                              {inv.status}
                            </span>
                            {unpaid && (
                              <>
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={payingId !== null}
                                  onClick={() => void payInvoice(inv, 'full')}
                                >
                                  {payingId === `${inv.id}:full`
                                    ? 'Opening…'
                                    : `Pay ${inv.currency} ${remaining.toLocaleString()}`}
                                </Button>
                                {remaining >= 2 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    disabled={payingId !== null}
                                    onClick={() => void payInvoice(inv, 'deposit')}
                                  >
                                    {payingId === `${inv.id}:deposit` ? 'Opening…' : '50% deposit'}
                                  </Button>
                                )}
                                <Button
                                  href={`/invoice/${inv.id}?token=${inv.publicToken}`}
                                  size="sm"
                                  variant="ghost"
                                >
                                  View
                                </Button>
                              </>
                            )}
                          </div>
                        </li>
                      )
                    })}
                    {invoices.length === 0 && (
                      <li className="py-6 text-sm text-slate-500">
                        No invoices yet. Guest invoice links from email still work.
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {tab === 'support' && (
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-white">
                    Support
                  </h2>
                  <p className="mt-3 max-w-xl text-slate-400">
                    Need help with a request or invoice? Reach the team through the contact form or
                    the site chat widget — agents reply from Live Chat, 24/7.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button href="/contact#quote" icon>
                      Contact form
                    </Button>
                    <Button href="/faq" variant="secondary">
                      FAQ
                    </Button>
                    <Button href="/request" variant="ghost">
                      Service request
                    </Button>
                  </div>
                </div>
              )}

              {tab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-tight text-white">
                      Profile &amp; Password
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">{user.email}</p>
                    <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                      <label className="block text-xs text-slate-400">
                        Display name
                        <input
                          aria-label="Display name"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className={cn(fieldClass, 'mt-1')}
                        />
                      </label>
                      <label className="block text-xs text-slate-400">
                        Mobile (for SMS reset codes)
                        <input
                          aria-label="Phone"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="+2547…"
                          className={cn(fieldClass, 'mt-1')}
                          autoComplete="tel"
                        />
                      </label>
                      <Button
                        type="button"
                        size="sm"
                        onClick={async () => {
                          try {
                            const res = await updateProfile(profileName, profilePhone)
                            const token = loadAuthToken()
                            const next = {
                              ...user,
                              name: res.user.name as string,
                              phone: (res.user.phone as string) || '',
                            }
                            if (token) saveAuthSession(token, next)
                            setUser(next)
                            setMessage('Profile updated')
                            setError('')
                          } catch (err) {
                            setError(err instanceof Error ? err.message : 'Update failed')
                          }
                        }}
                      >
                        Save profile
                      </Button>
                    </div>
                    {message && <p className="mt-2 text-sm text-emerald-300">{message}</p>}
                    {error && <p className="mt-2 text-sm text-amber-200">{error}</p>}
                  </div>
                  <ChangePasswordForm user={user} onUpdated={setUser} />
                </div>
              )}
            </div>
          ) : (
            <div className="relative mt-10 max-w-md overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

              {challengeToken ? (
                <div className="relative">
                  <p className="text-sm font-medium text-white">Two-factor verification</p>
                  <p className="mt-1 text-xs text-slate-500">
                    This account has authenticator 2FA enabled.
                  </p>
                  <div className="mt-5">
                    <TotpChallengeForm
                      busy={busyAuth}
                      error={error}
                      onVerify={onVerify2fa}
                      onBack={() => {
                        setChallengeToken('')
                        setError('')
                      }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div
                    className="relative grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
                    role="tablist"
                  >
                    {(
                      [
                        ['login', 'Sign in'],
                        ['register', 'Create account'],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={mode === value}
                        className={cn(
                          'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          mode === value
                            ? 'bg-brand-500/15 text-brand-200'
                            : 'text-slate-400 hover:text-slate-200',
                        )}
                        onClick={() => {
                          setMode(value)
                          setChallengeToken('')
                          setError('')
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="relative mt-7 space-y-5">
                    {mode === 'register' && (
                      <Field label="Name" htmlFor="account-name">
                        <input
                          id="account-name"
                          required
                          placeholder="Amina Wanjiku"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={fieldClass}
                          autoComplete="name"
                        />
                      </Field>
                    )}
                    <Field label="Email" htmlFor="account-email">
                      <input
                        id="account-email"
                        required
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldClass}
                        autoComplete="email"
                      />
                    </Field>
                    <Field label="Password" htmlFor="account-password">
                      <PasswordInput
                        id="account-password"
                        required
                        minLength={8}
                        placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={fieldClass}
                        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      />
                    </Field>

                    {mode === 'login' && (
                      <p className="text-right text-xs">
                        <Link
                          to={`/account/reset?from=${encodeURIComponent('/account')}`}
                          className="text-brand-300 hover:text-brand-200"
                        >
                          Forgot password?
                        </Link>
                      </p>
                    )}

                    {error && (
                      <p className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                        {error}
                      </p>
                    )}
                    {message && <p className="text-sm text-emerald-300">{message}</p>}

                    <Button type="submit" size="lg" className="w-full" disabled={busyAuth}>
                      {busyAuth ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
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

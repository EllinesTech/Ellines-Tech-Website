import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Building2,
  Briefcase,
  Bell,
  Home,
  Inbox,
  LogOut,
  ArrowLeft,
  MessageCircle,
  Receipt,
  ShoppingBag,
  Download,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { CompanyMaterials } from '@/components/downloads/CompanyMaterials'
import { AdminLiveChatPage } from '@/pages/admin/AdminLiveChatPage'
import {
  completeLogin2fa,
  loginCustomer,
  fetchLeads,
  fetchInvoices,
  fetchActivity,
  fetchShop,
  fetchNotifications,
  updateLeadStatus,
  updateProfile,
  logoutUser,
  type VisitorContext,
} from '@/lib/cmsApi'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { TotpChallengeForm } from '@/components/auth/TotpChallengeForm'
import { TotpSetupPanel } from '@/components/auth/TotpSetupPanel'
import { VisitorChips } from '@/components/admin/VisitorContext'
import {
  clearAuthSession,
  isGodRole,
  isStaffRole,
  loadAuthToken,
  loadAuthUser,
  saveAuthSession,
  type AuthUser,
} from '@/lib/auth'
import { leadStatusOptions } from '@/data/downloads'
import { useLockViewportScroll } from '@/hooks/useLockViewportScroll'
import { cn } from '@/lib/utils'

const staffNav = [
  { to: '/staff', label: 'Overview', icon: Home, end: true },
  { to: '/staff/leads', label: 'Leads', icon: Inbox },
  { to: '/staff/live-chat', label: 'Live Chat', icon: MessageCircle },
  { to: '/staff/careers', label: 'Careers', icon: Briefcase },
  { to: '/staff/clients', label: 'Clients', icon: Building2 },
  { to: '/staff/invoices', label: 'Invoices', icon: Receipt },
  { to: '/staff/pricing', label: 'Pricing packages', icon: ShoppingBag },
  { to: '/staff/materials', label: 'Company materials', icon: Download },
  { to: '/staff/notifications', label: 'Notifications', icon: Bell },
  { to: '/staff/profile', label: 'Profile & Password', icon: User },
]

export function StaffLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [challengeToken, setChallengeToken] = useState('')

  useEffect(() => {
    const user = loadAuthUser()
    if (user && isGodRole(user.role)) navigate('/admin', { replace: true })
    else if (user && isStaffRole(user.role)) navigate('/staff', { replace: true })
  }, [navigate])

  function finishLogin(token: string, user: AuthUser) {
    if (!isStaffRole(user.role)) {
      setError('This portal is for employees only. Clients use Client login at /account.')
      return
    }
    saveAuthSession(token, user)
    navigate(isGodRole(user.role) ? '/admin' : '/staff', { replace: true })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await loginCustomer({ email, password })
      if ('requires2fa' in res && res.requires2fa) {
        setChallengeToken(res.challengeToken)
        return
      }
      if (!('user' in res)) {
        setError('Sign-in incomplete. Try again.')
        return
      }
      finishLogin(res.token, res.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  async function onVerify2fa(code: string) {
    setError('')
    setBusy(true)
    try {
      const res = await completeLogin2fa({ challengeToken, code })
      if (!('user' in res) || !res.user) {
        setError('Sign-in incomplete. Try again.')
        return
      }
      finishLogin(res.token, res.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-ui">
      <div className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-surface-elevated/70 p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
          Ellines Tech · Staff
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">
          {challengeToken ? 'Two-factor verification' : 'Staff login'}
        </h1>
        {challengeToken ? (
          <div className="mt-6">
            <TotpChallengeForm
              busy={busy}
              error={error}
              onVerify={onVerify2fa}
              onBack={() => {
                setChallengeToken('')
                setError('')
              }}
            />
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <p className="mt-3 text-sm text-slate-400">
              Employee workspace for Marketing, Sales, Support, and Finance.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
              autoFocus
            />
            <PasswordInput
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
            />
            {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
            <Button type="submit" className="mt-5 w-full" icon disabled={busy}>
              {busy ? 'Verifying…' : 'Enter staff workspace'}
            </Button>
            <p className="mt-4 text-center text-xs text-slate-500">
              <Link
                to={`/account/reset?from=${encodeURIComponent('/staff/login')}`}
                className="text-brand-300"
              >
                Forgot password?
              </Link>
              {' · '}
              Clients:{' '}
              <Link to="/account" className="text-brand-300">
                Client login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function RequireStaff({ children }: { children: React.ReactNode }) {
  const user = loadAuthUser()
  if (!user || !isStaffRole(user.role)) return <Navigate to="/staff/login" replace />
  return children
}

export function StaffLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = loadAuthUser()

  useLockViewportScroll(true)

  const activeLabel = useMemo(() => {
    const hit = staffNav.find((n) =>
      n.end ? location.pathname === n.to : location.pathname.startsWith(n.to),
    )
    return hit?.label || 'Overview'
  }, [location.pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <RequireStaff>
      <div className="fixed inset-0 z-0 flex overflow-hidden bg-[#050b14] font-ui text-slate-100">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#071018] transition-transform duration-200 ease-out lg:static lg:translate-x-0',
            mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full lg:translate-x-0',
          )}
        >
          <div className="shrink-0 px-3 pb-2 pt-4">
            <div className="px-2">
              <Logo variant="nav" link={false} />
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
                Staff workspace
              </p>
              <p className="mt-2 truncate text-xs text-slate-400">
                {user?.name}
                {user?.jobTitle ? ` · ${user.jobTitle}` : ''}
              </p>
              {isGodRole(user?.role) && (
                <Link
                  to="/admin"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand-500/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-300 ring-1 ring-inset ring-brand-400/20"
                >
                  God Mode · Admin panel
                </Link>
              )}
            </div>
          </div>
          <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2">
            {staffNav.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition',
                      isActive
                        ? 'bg-brand-500/15 text-brand-200'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#071018]/90 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-white/10 px-2 py-1 text-xs lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                Menu
              </button>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Staff</p>
                <h1 className="font-display text-lg font-semibold text-white">{activeLabel}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Site
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logoutUser()
                  clearAuthSession()
                  navigate('/staff/login')
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </RequireStaff>
  )
}

export function StaffOverviewPage() {
  const user = loadAuthUser() as AuthUser
  const [stats, setStats] = useState({
    leads: 0,
    open: 0,
    invoices: 0,
    unpaid: 0,
  })
  const [activity, setActivity] = useState<
    { id: string; at: string; message?: string; type?: string }[]
  >([])

  useEffect(() => {
    Promise.all([fetchLeads(), fetchInvoices(), fetchActivity()])
      .then(([leads, invoices, acts]) => {
        const open = leads.filter(
          (l: { status?: string }) =>
            !['won', 'lost', 'closed'].includes(String(l.status || '')),
        ).length
        const unpaid = invoices.filter(
          (i: { status?: string }) => i.status === 'sent' || i.status === 'draft',
        ).length
        setStats({
          leads: leads.length,
          open,
          invoices: invoices.length,
          unpaid,
        })
        setActivity(acts.slice(0, 8))
      })
      .catch(() => undefined)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">
          Welcome, {user.name.split(' ')[0]}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {user.jobTitle || user.role} · Staff workspace
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'All leads', value: stats.leads, to: '/staff/leads' },
          { label: 'Open leads', value: stats.open, to: '/staff/leads' },
          { label: 'Invoices', value: stats.invoices, to: '/staff/invoices' },
          { label: 'Unpaid / draft', value: stats.unpaid, to: '/staff/invoices' },
        ].map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand-400/30"
          >
            <p className="text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{s.value}</p>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button href="/staff/leads" size="sm">
          Work leads
        </Button>
        <Button href="/staff/live-chat" size="sm" variant="secondary">
          Live chat queue
        </Button>
        <Button href="/staff/materials" size="sm" variant="ghost">
          Share materials
        </Button>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="font-display text-lg font-semibold text-white">Recent activity</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {activity.map((a) => (
            <li key={a.id} className="border-b border-white/5 pb-2 text-slate-400">
              <span className="text-slate-200">{a.message || a.type || 'Update'}</span>
              <span className="ml-2 text-xs text-slate-600">
                {a.at ? new Date(a.at).toLocaleString() : ''}
              </span>
            </li>
          ))}
          {activity.length === 0 && (
            <li className="text-slate-500">No recent activity yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export function StaffLeadsPage() {
  const [leads, setLeads] = useState<
    {
      id: string
      name: string
      email: string
      intent?: string
      packageName?: string
      at: string
      status?: string
      phone?: string
      message?: string
      company?: string
      visitor?: VisitorContext
    }[]
  >([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLeads()
      .then(setLeads)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  async function onStatus(id: string, status: string) {
    setSaving(id)
    try {
      await updateLeadStatus(id, status)
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setSaving('')
    }
  }

  const visible = leads.filter((l) => {
    if (filter === 'all') return true
    if (filter === 'open') return !['won', 'lost', 'closed'].includes(String(l.status || ''))
    return (l.status || 'new') === filter
  })

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Leads & requests</h2>
      <p className="text-sm text-slate-400">Update status as you contact and qualify each lead.</p>
      <div className="flex flex-wrap gap-2">
        {['all', 'open', 'new', 'contacted', 'qualified', 'won', 'lost'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg border px-3 py-1 text-xs capitalize transition',
              filter === f
                ? 'border-brand-400/40 bg-brand-500/15 text-brand-200'
                : 'border-white/10 text-slate-400 hover:bg-white/5',
            )}
          >
            {f}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-amber-200">{error}</p>}
      <ul className="space-y-2">
        {visible.slice(0, 120).map((l) => (
          <li key={l.id} className="rounded-xl border border-white/10 px-4 py-3 text-sm">
            <p className="font-medium text-white">
              {l.name || l.email}{' '}
              <span className="text-xs font-normal text-brand-300">{l.intent || 'lead'}</span>
            </p>
            <p className="text-slate-400">
              {l.email}
              {l.phone ? ` · ${l.phone}` : ''} · {l.packageName || '—'}
              {l.company ? ` · ${l.company}` : ''}
            </p>
            {l.message && <p className="mt-1 text-slate-500">{l.message}</p>}
            {l.visitor && (
              <div className="mt-2">
                <VisitorChips visitor={l.visitor} />
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select
                value={l.status || 'new'}
                disabled={saving === l.id}
                onChange={(e) => onStatus(l.id, e.target.value)}
                className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
              >
                {!leadStatusOptions.includes(
                  (l.status || 'new') as (typeof leadStatusOptions)[number],
                ) && <option value={l.status || 'new'}>{l.status || 'new'}</option>}
                {leadStatusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-600">{new Date(l.at).toLocaleString()}</span>
            </div>
          </li>
        ))}
        {visible.length === 0 && !error && (
          <li className="text-sm text-slate-500">No leads in this filter.</li>
        )}
      </ul>
    </div>
  )
}

export function StaffClientsPage() {
  const [contacts, setContacts] = useState<
    {
      email: string
      name: string
      company?: string
      phone?: string
      leads: number
      invoices: number
      unpaid: number
    }[]
  >([])

  useEffect(() => {
    Promise.all([fetchLeads(), fetchInvoices()])
      .then(([list, invoices]) => {
        const map = new Map<
          string,
          {
            email: string
            name: string
            company?: string
            phone?: string
            leads: number
            invoices: number
            unpaid: number
          }
        >()
        for (const l of list) {
          const email = String(l.email || '').toLowerCase()
          if (!email) continue
          const prev = map.get(email)
          if (prev) {
            prev.leads += 1
            if (!prev.company && l.company) prev.company = l.company
            if (!prev.phone && l.phone) prev.phone = l.phone
          } else {
            map.set(email, {
              email,
              name: l.name || email,
              company: l.company,
              phone: l.phone,
              leads: 1,
              invoices: 0,
              unpaid: 0,
            })
          }
        }
        for (const inv of invoices) {
          const email = String(inv.clientEmail || '').toLowerCase()
          if (!email) continue
          const prev = map.get(email)
          if (prev) {
            prev.invoices += 1
            if (inv.status === 'sent' || inv.status === 'draft') prev.unpaid += 1
            if (!prev.name && inv.clientName) prev.name = inv.clientName
          } else {
            map.set(email, {
              email,
              name: inv.clientName || email,
              leads: 0,
              invoices: 1,
              unpaid: inv.status === 'sent' || inv.status === 'draft' ? 1 : 0,
            })
          }
        }
        setContacts(
          [...map.values()].sort((a, b) => b.leads + b.invoices - (a.leads + a.invoices)),
        )
      })
      .catch(() => undefined)
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Clients</h2>
      <p className="text-sm text-slate-400">
        Contacts from leads and invoices — use this list when following up.
      </p>
      <ul className="space-y-2">
        {contacts.map((c) => (
          <li key={c.email} className="rounded-xl border border-white/10 px-4 py-3 text-sm">
            <p className="text-white">{c.name}</p>
            <p className="text-slate-400">
              {c.email}
              {c.company ? ` · ${c.company}` : ''}
              {c.phone ? ` · ${c.phone}` : ''}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {c.leads} request(s) · {c.invoices} invoice(s)
              {c.unpaid ? ` · ${c.unpaid} unpaid/draft` : ''}
            </p>
          </li>
        ))}
        {contacts.length === 0 && <li className="text-sm text-slate-500">No clients yet.</li>}
      </ul>
    </div>
  )
}

export function StaffPricingPage() {
  const [products, setProducts] = useState<
    { id: string; name: string; price: number; currency: string; category: string; status: string }[]
  >([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchShop()
      .then((list) =>
        setProducts(list.filter((p: { status?: string }) => p.status === 'published')),
      )
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load pricing'))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Pricing packages</h2>
      <p className="text-sm text-slate-400">
        Live catalogue from CMS. Share{' '}
        <Link to="/pricing" className="text-brand-300">
          /pricing
        </Link>{' '}
        with clients. Package edits are managed in the owner control panel.
      </p>
      {error && <p className="text-sm text-amber-200">{error}</p>}
      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium text-white">{p.name}</p>
              <p className="text-xs text-slate-500">{p.category}</p>
            </div>
            <p className="text-brand-300">
              {p.currency} {Number(p.price).toLocaleString()}
            </p>
          </li>
        ))}
        {products.length === 0 && !error && (
          <li className="text-sm text-slate-500">No published packages.</li>
        )}
      </ul>
      <Button href="/request?intent=buy" variant="secondary" size="sm">
        Open request form
      </Button>
    </div>
  )
}

export function StaffMaterialsPage() {
  return (
    <div className="max-w-3xl">
      <CompanyMaterials
        title="Company materials"
        description="Share these PDFs with prospects — company profile, pricing rate card, capabilities, and service catalogue."
      />
    </div>
  )
}

export function StaffNotificationsPage() {
  const [items, setItems] = useState<{ id: string; title: string; body: string; at: string }[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotifications()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Notifications</h2>
      <p className="text-sm text-slate-400">System notices for leads, invoices, and applications.</p>
      {error && <p className="text-sm text-amber-200">{error}</p>}
      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id} className="rounded-xl border border-white/10 px-4 py-3 text-sm">
            <p className="text-white">{n.title}</p>
            <p className="text-slate-400">{n.body}</p>
            <p className="mt-1 text-xs text-slate-600">
              {n.at ? new Date(n.at).toLocaleString() : ''}
            </p>
          </li>
        ))}
        {items.length === 0 && !error && (
          <li className="text-sm text-slate-500">No notifications yet.</li>
        )}
      </ul>
    </div>
  )
}

export function StaffLiveChatPage() {
  const user = loadAuthUser()
  return <AdminLiveChatPage agentName={user?.name || 'Staff'} />
}

export function StaffProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthUser())
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!user) return null

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Profile &amp; Password</h2>
        <p className="mt-1 text-sm text-slate-400">
          {user.email} · {user.jobTitle || user.role}
        </p>
      </div>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <label className="block text-xs text-slate-400">
          Display name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Mobile (for SMS reset codes)
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+2547…"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
            autoComplete="tel"
          />
        </label>
        <Button
          type="button"
          size="sm"
          onClick={async () => {
            setError('')
            try {
              const res = await updateProfile(name, phone)
              const token = loadAuthToken()
              const next = {
                ...user,
                name: res.user.name as string,
                phone: (res.user.phone as string) || '',
              }
              if (token) saveAuthSession(token, next)
              setUser(next)
              setMessage('Profile updated')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Update failed')
            }
          }}
        >
          Save profile
        </Button>
        {message && <p className="text-sm text-emerald-300">{message}</p>}
        {error && <p className="text-sm text-amber-200">{error}</p>}
      </div>
      <ChangePasswordForm user={user} onUpdated={setUser} />
      <TotpSetupPanel />
    </div>
  )
}

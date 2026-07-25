import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Building2,
  Briefcase,
  Home,
  Inbox,
  LogOut,
  ArrowLeft,
  Receipt,
  ShoppingBag,
  Download,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { CompanyMaterials } from '@/components/downloads/CompanyMaterials'
import {
  loginCustomer,
  fetchLeads,
  fetchInvoices,
  fetchActivity,
  fetchShop,
  updateLeadStatus,
  updateProfile,
} from '@/lib/cmsApi'
import {
  clearAuthSession,
  isStaffRole,
  loadAuthToken,
  loadAuthUser,
  saveAuthSession,
  type AuthUser,
} from '@/lib/auth'
import { leadStatusOptions } from '@/data/downloads'
import { cn } from '@/lib/utils'

const staffNav = [
  { to: '/staff', label: 'Overview', icon: Home, end: true },
  { to: '/staff/leads', label: 'Leads', icon: Inbox },
  { to: '/staff/careers', label: 'Careers', icon: Briefcase },
  { to: '/staff/clients', label: 'Clients', icon: Building2 },
  { to: '/staff/invoices', label: 'Invoices', icon: Receipt },
  { to: '/staff/pricing', label: 'Pricing packages', icon: ShoppingBag },
  { to: '/staff/materials', label: 'Company materials', icon: Download },
  { to: '/staff/profile', label: 'Profile', icon: User },
]

export function StaffLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const user = loadAuthUser()
    if (user && isStaffRole(user.role)) navigate('/staff', { replace: true })
  }, [navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const res = await loginCustomer({ email, password })
      if (!isStaffRole(res.user.role)) {
        setError('This portal is for employees only. Clients use Client login at /account.')
        return
      }
      saveAuthSession(res.token, res.user)
      navigate('/staff', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-surface-elevated/70 p-8 shadow-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
          Ellines Tech · Staff
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">Staff login</h1>
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
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
        />
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
        <Button type="submit" className="mt-5 w-full" icon>
          Enter staff workspace
        </Button>
        <p className="mt-4 text-center text-xs text-slate-500">
          Clients:{' '}
          <Link to="/account" className="text-brand-300">
            Client login
          </Link>
        </p>
      </form>
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

  const activeLabel = useMemo(() => {
    const hit = staffNav.find((n) =>
      n.end ? location.pathname === n.to : location.pathname.startsWith(n.to),
    )
    return hit?.label || 'Overview'
  }, [location.pathname])

  return (
    <RequireStaff>
      <div className="flex min-h-screen bg-[#050b14] text-slate-100">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-white/10 bg-[#071018] px-3 py-4 transition lg:static lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          )}
        >
          <div className="mb-5 px-2">
            <Logo variant="nav" link={false} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              Staff workspace
            </p>
            <p className="mt-2 truncate text-xs text-slate-400">
              {user?.name}
              {user?.jobTitle ? ` · ${user.jobTitle}` : ''}
            </p>
          </div>
          <div className="space-y-0.5">
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
          </div>
        </aside>

        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[#071018]/90 px-4 py-3 backdrop-blur">
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
                onClick={() => {
                  clearAuthSession()
                  navigate('/staff/login')
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">
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

  useEffect(() => {
    Promise.all([fetchLeads(), fetchInvoices(), fetchActivity()])
      .then(([leads, invoices]) => {
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
        <Button href="/staff/materials" size="sm" variant="secondary">
          Share company materials
        </Button>
        <Button href="/pricing" size="sm" variant="ghost">
          Public pricing
        </Button>
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
    }[]
  >([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState('')

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

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Leads & requests</h2>
      <p className="text-sm text-slate-400">Update status as you contact and qualify each lead.</p>
      {error && <p className="text-sm text-amber-200">{error}</p>}
      <ul className="space-y-2">
        {leads.slice(0, 120).map((l) => (
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
        {leads.length === 0 && !error && (
          <li className="text-sm text-slate-500">No leads yet.</li>
        )}
      </ul>
    </div>
  )
}

export function StaffClientsPage() {
  const [leads, setLeads] = useState<
    { email: string; name: string; company?: string; phone?: string; leads: number }[]
  >([])

  useEffect(() => {
    fetchLeads()
      .then((list) => {
        const map = new Map<
          string,
          { email: string; name: string; company?: string; phone?: string; leads: number }
        >()
        for (const l of list) {
          const email = String(l.email || '').toLowerCase()
          if (!email) continue
          const prev = map.get(email)
          if (prev) {
            prev.leads += 1
          } else {
            map.set(email, {
              email,
              name: l.name || email,
              company: l.company,
              phone: l.phone,
              leads: 1,
            })
          }
        }
        setLeads([...map.values()])
      })
      .catch(() => undefined)
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Clients</h2>
      <p className="text-sm text-slate-400">Unique contacts from live leads and purchase requests.</p>
      <ul className="space-y-2">
        {leads.map((c) => (
          <li key={c.email} className="rounded-xl border border-white/10 px-4 py-3 text-sm">
            <p className="text-white">{c.name}</p>
            <p className="text-slate-400">
              {c.email}
              {c.company ? ` · ${c.company}` : ''}
              {c.phone ? ` · ${c.phone}` : ''}
            </p>
            <p className="text-xs text-slate-600">{c.leads} request(s)</p>
          </li>
        ))}
        {leads.length === 0 && <li className="text-sm text-slate-500">No clients yet.</li>}
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

export function StaffProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthUser())
  const [name, setName] = useState(user?.name || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!user) return null

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="font-display text-2xl font-bold text-white">Profile</h2>
      <p className="text-sm text-slate-400">
        {user.email} · {user.jobTitle || user.role}
      </p>
      <label className="block text-xs text-slate-400">
        Display name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
        />
      </label>
      <Button
        type="button"
        size="sm"
        onClick={async () => {
          setError('')
          try {
            const res = await updateProfile(name)
            const token = loadAuthToken()
            const next = { ...user, name: res.user.name as string }
            if (token) saveAuthSession(token, next)
            setUser(next)
            setMessage('Profile updated')
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Update failed')
          }
        }}
      >
        Save name
      </Button>
      {message && <p className="text-sm text-emerald-300">{message}</p>}
      {error && <p className="text-sm text-amber-200">{error}</p>}
    </div>
  )
}

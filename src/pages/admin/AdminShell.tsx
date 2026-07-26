import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  AtSign,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CircleHelp,
  CreditCard,
  Database,
  FilePen,
  Globe,
  Home,
  Image,
  Inbox,
  KeyRound,
  Layers,
  LineChart,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  Palette,
  Puzzle,
  Quote,
  Radio,
  Receipt,
  ScrollText,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  User,
  Users,
  Zap,
  LogOut,
  ArrowLeft,
  Download,
  X,
} from 'lucide-react'
import { adminNavGroups } from '@/admin/nav'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { setAdminAuthed, setAdminApiKey, clearAdminApiKey } from '@/lib/engagementStore'
import { adminLogin, adminLogout, loginCustomer, logoutUser } from '@/lib/cmsApi'
import { clearAuthSession, isGodRole, loadAuthUser, saveAuthSession } from '@/lib/auth'
import { currentActor, hasGodMode } from '@/lib/adminAccess'
import { useLockViewportScroll } from '@/hooks/useLockViewportScroll'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Home,
  Activity,
  Package,
  Layers,
  Briefcase,
  Image,
  Building2,
  Inbox,
  Users,
  KeyRound,
  Star,
  Mail,
  BarChart3,
  LineChart,
  Globe,
  Radio,
  Receipt,
  Settings,
  Bell,
  MessageSquare,
  MessageCircle,
  Bot,
  Share2,
  AtSign,
  SlidersHorizontal,
  FilePen,
  CircleHelp,
  BookOpen,
  Quote,
  Palette,
  Shield,
  Puzzle,
  CreditCard,
  ScrollText,
  Database,
  Zap,
  User,
  ShoppingBag,
  Download,
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'owner' | 'account'>('owner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (hasGodMode()) navigate('/admin', { replace: true })
  }, [navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'owner') {
        // The password is checked at the edge; we only ever store the returned token.
        const { token } = await adminLogin(password.trim())
        setAdminApiKey(token)
        setAdminAuthed(true)
      } else {
        const res = await loginCustomer({ email: email.trim(), password })
        if (!isGodRole(res.user.role)) {
          setError(
            'That account is not a Super Admin. Staff sign in at /staff/login; clients at /account.',
          )
          return
        }
        saveAuthSession(res.token, res.user)
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-ui">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-surface-elevated/70 p-8 shadow-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
          Ellines Tech · God Mode
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">Admin access</h1>
        <p className="mt-3 text-sm text-slate-400">
          Owner key or a Super Admin account. Employees use{' '}
          <a href="/staff/login" className="text-brand-300">
            Staff login
          </a>
          . Clients use{' '}
          <a href="/account" className="text-brand-300">
            Client account
          </a>
          .
        </p>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {(
            [
              { id: 'owner', label: 'Owner key' },
              { id: 'account', label: 'Super Admin' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMode(tab.id)
                setError('')
              }}
              className={cn(
                'rounded-lg px-3 py-2 text-xs font-semibold transition',
                mode === tab.id
                  ? 'bg-brand-500/20 text-brand-200'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === 'account' && (
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Super Admin email"
            className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
            autoFocus
          />
        )}
        <PasswordInput
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'owner' ? 'Owner key' : 'Account password'}
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
          autoFocus={mode === 'owner'}
        />
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
        <Button type="submit" className="mt-5 w-full" icon disabled={busy}>
          {busy ? 'Verifying…' : 'Enter Admin Panel'}
        </Button>
        {mode === 'account' && (
          <p className="mt-4 text-center text-xs text-slate-500">
            <a
              href={`/account/reset?from=${encodeURIComponent('/admin/login')}`}
              className="text-brand-300"
            >
              Forgot password?
            </a>
          </p>
        )}
      </form>
    </div>
  )
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  if (!hasGodMode()) return <Navigate to="/admin/login" replace />
  return children
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const actor = currentActor()
  const authUser = loadAuthUser()

  useLockViewportScroll(true)

  const activeLabel = useMemo(() => {
    for (const g of adminNavGroups) {
      for (const item of g.items) {
        if (item.to === location.pathname) return item.label
      }
    }
    return 'Dashboard'
  }, [location.pathname])

  useEffect(() => {
    setMobileOpen(false)
    mainRef.current?.scrollTo({ top: 0 })
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <RequireAdmin>
      {/* fixed inset-0: shell is viewport-locked even if #root/body lack height */}
      <div className="fixed inset-0 z-0 flex overflow-hidden bg-[#050b14] font-ui text-slate-100">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex h-full min-h-0 w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-white/[0.08] bg-[#071018] transition-transform duration-200 ease-out lg:static lg:translate-x-0',
            mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full lg:translate-x-0',
          )}
        >
          <div className="shrink-0 border-b border-white/[0.08] px-4 pb-4 pt-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Logo variant="nav" link={false} />
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-400">
                  Admin Panel
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-brand-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-300 ring-1 ring-inset ring-brand-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden />
              God Mode
            </span>
            <p className="mt-2 truncate text-[11px] text-slate-500">
              {actor.role === 'owner' ? 'Owner key session' : `${actor.name} · Super Admin`}
            </p>
          </div>

          <nav
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 py-3 [scrollbar-gutter:stable]"
            aria-label="Admin navigation"
          >
            {adminNavGroups.map((group) => (
              <div key={group.title} className="mb-4 last:mb-1">
                <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = iconMap[item.icon] ?? Settings
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin'}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                            isActive
                              ? 'bg-brand-500/15 text-brand-100'
                              : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span
                                className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand-400"
                                aria-hidden
                              />
                            )}
                            <Icon
                              className={cn(
                                'h-4 w-4 shrink-0 transition-opacity',
                                isActive ? 'opacity-100 text-brand-300' : 'opacity-70 group-hover:opacity-100',
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="shrink-0 border-t border-white/[0.08] px-4 py-3">
            <p className="text-[10px] font-medium tracking-wide text-slate-500">
              Ellines Tech · Control Center
            </p>
          </div>
        </aside>

        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="z-20 flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#071018]/95 px-4 py-3 backdrop-blur-md sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 hover:text-white lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Dashboard
                </p>
                <h1 className="truncate font-display text-lg font-semibold tracking-tight text-white">
                  {activeLabel}
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-md bg-emerald-500/12 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/20 sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />
                {actor.role === 'owner' ? 'Owner' : 'Super Admin'}
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Site</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  // Revoke server-side first so a stolen token dies with the click.
                  if (actor.role === 'owner') await adminLogout()
                  else if (authUser) await logoutUser()
                  setAdminAuthed(false)
                  clearAdminApiKey()
                  if (authUser && isGodRole(authUser.role)) clearAuthSession()
                  navigate('/admin/login')
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </header>

          <main
            ref={mainRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth [scrollbar-gutter:stable]"
          >
            <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-7">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </RequireAdmin>
  )
}

import { useEffect, useMemo, useState } from 'react'
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
} from 'lucide-react'
import { adminNavGroups } from '@/admin/nav'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { PasswordInput } from '@/components/ui/PasswordInput'
import {
  isAdminAuthed,
  setAdminAuthed,
  verifyAdminPassword,
  setAdminApiKey,
  clearAdminApiKey,
} from '@/lib/engagementStore'
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
  ScrollText,
  Database,
  Zap,
  User,
  ShoppingBag,
  Download,
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminAuthed()) navigate('/admin', { replace: true })
  }, [navigate])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = password.trim()
    if (verifyAdminPassword(trimmed)) {
      setAdminAuthed(true)
      setAdminApiKey(trimmed)
      navigate('/admin', { replace: true })
    } else setError('Invalid password')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-surface-elevated/70 p-8 shadow-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
          Ellines Tech · Admin
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">Admin access</h1>
        <p className="mt-3 text-sm text-slate-400">
          Platform owner login. Employees use{' '}
          <a href="/staff/login" className="text-brand-300">
            Staff login
          </a>
          . Clients use{' '}
          <a href="/account" className="text-brand-300">
            Client account
          </a>
          .
        </p>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
          autoFocus
        />
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
        <Button type="submit" className="mt-5 w-full" icon>
          Enter Admin Panel
        </Button>
      </form>
    </div>
  )
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />
  return children
}

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeLabel = useMemo(() => {
    for (const g of adminNavGroups) {
      for (const item of g.items) {
        if (item.to === location.pathname) return item.label
      }
    }
    return 'Dashboard'
  }, [location.pathname])

  return (
    <RequireAdmin>
      <div className="flex min-h-screen bg-[#050b14] text-slate-100">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-white/10 bg-[#071018] px-3 py-4 transition lg:static lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          )}
        >
          <div className="mb-5 px-2">
            <Logo variant="nav" link={false} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              Admin Panel
            </p>
            <span className="mt-3 inline-flex rounded-full bg-brand-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-300">
              Admin
            </span>
          </div>

          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Manage
          </p>
          {adminNavGroups.map((group) => (
            <div key={group.title} className="mb-5">
              {group.title !== 'Manage' && (
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {group.title}
                </p>
              )}
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
                          'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition',
                          isActive
                            ? 'bg-brand-500/15 text-brand-200'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white',
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
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
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Dashboard</p>
                <h1 className="font-display text-lg font-semibold text-white">{activeLabel}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 sm:inline">
                ⚡ Admin
              </span>
              <Link
                to="/"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Site
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAdminAuthed(false)
                  clearAdminApiKey()
                  navigate('/admin/login')
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
    </RequireAdmin>
  )
}

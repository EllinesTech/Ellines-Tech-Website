import { useEffect, useState } from 'react'
import { Navigate, Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import {
  isAdminAuthed,
  setAdminAuthed,
  verifyAdminPassword,
} from '@/lib/engagementStore'
import { siteConfig } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { Shield, LayoutDashboard, MessageSquareText, Settings2, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminAuthed()) navigate('/admin', { replace: true })
  }, [navigate])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (verifyAdminPassword(password)) {
      setAdminAuthed(true)
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-surface-elevated/60 p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">God Mode</p>
            <h1 className="font-display text-xl font-bold text-white">Admin access</h1>
          </div>
        </div>
        <p className="mb-6 text-sm text-slate-400">
          Super admin controls for {siteConfig.name} engagement, knowledge, and site switches.
        </p>
        <label className="block text-sm text-slate-400">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
            autoFocus
          />
        </label>
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
        <Button type="submit" className="mt-6 w-full" icon>
          Enter dashboard
        </Button>
      </form>
    </div>
  )
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />
  return children
}

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/chat', label: 'Chat knowledge', icon: MessageSquareText, end: false },
  { to: '/admin/settings', label: 'Site controls', icon: Settings2, end: false },
]

export function AdminLayout() {
  const navigate = useNavigate()

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-slate-950">
        <div className="border-b border-white/10 bg-surface/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-400">
                God Mode
              </p>
              <p className="font-display text-lg font-semibold text-white">{siteConfig.name} Admin</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:text-white"
              >
                View site
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAdminAuthed(false)
                  navigate('/admin/login')
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
          <nav className="space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition',
                    isActive
                      ? 'bg-brand-500/15 text-brand-200'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </RequireAdmin>
  )
}

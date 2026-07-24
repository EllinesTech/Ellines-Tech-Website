import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { mainNavigation } from '@/data/navigation'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-2xl">
      <div className="section-container flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Logo onClick={() => setMobileOpen(false)} />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
          {mainNavigation.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    location.pathname.startsWith(item.href)
                      ? 'text-brand-300'
                      : 'text-slate-300 hover:text-white',
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Link>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-72 rounded-2xl border border-white/10 bg-surface-elevated/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                        >
                          <span className="block text-sm font-medium text-white">{child.label}</span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs text-slate-400">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'text-brand-300'
                    : 'text-slate-300 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Button href="/contact" variant="ghost" size="sm">
            Get in Touch
          </Button>
          <Button href="/contact#quote" size="sm" icon>
            Request a Quote
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white xl:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl xl:hidden">
          <nav className="section-container space-y-1 py-4" aria-label="Mobile navigation">
            {mainNavigation.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 space-y-1 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-brand-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button href="/contact" variant="secondary" className="w-full">
                Get in Touch
              </Button>
              <Button href="/contact#quote" className="w-full" icon>
                Request a Quote
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

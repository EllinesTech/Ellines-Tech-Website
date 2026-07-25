import { useEffect, useId, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import {
  primaryNavigation,
  moreNavigation,
  mainNavigation,
  getNavLinks,
  type NavItem,
  type NavGroup,
} from '@/data/navigation'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

function MegaMenuPanel({
  groups,
  href,
  onClose,
}: {
  groups: NavGroup[]
  href: string
  onClose: () => void
}) {
  return (
    <div className="w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <div className="max-h-[min(22rem,70vh)] overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          {groups.map((group) => (
            <div key={group.label} className="min-w-0">
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-400/90">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((child) => (
                  <li key={child.href}>
                    <Link
                      to={child.href}
                      className="block truncate rounded-lg px-2 py-1.5 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={onClose}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-3 py-2.5">
        <Link
          to={href}
          className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium text-brand-300 transition-colors hover:bg-white/5 hover:text-brand-200"
          onClick={onClose}
        >
          View all services
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}

function FlatDropdownPanel({
  item,
  onClose,
}: {
  item: NavItem
  onClose: () => void
}) {
  const links = getNavLinks(item)
  return (
    <div className="w-72 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
      {links.map((child) => (
        <Link
          key={child.href}
          to={child.href}
          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
          onClick={onClose}
        >
          <span className="block text-sm font-medium text-white">{child.label}</span>
          {child.description && (
            <span className="mt-0.5 block text-xs text-slate-400">{child.description}</span>
          )}
        </Link>
      ))}
    </div>
  )
}

function NavDropdown({
  item,
  open,
  onOpen,
  onClose,
}: {
  item: NavItem
  open: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const location = useLocation()
  const active = location.pathname.startsWith(item.href)
  const hasGroups = Boolean(item.groups?.length)
  const panelId = useId()

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
          active ? 'text-brand-300' : 'text-slate-300 hover:text-white',
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={open ? panelId : undefined}
        onFocus={onOpen}
      >
        {item.label}
        <ChevronDown className={cn('h-3.5 w-3.5 opacity-60 transition-transform', open && 'rotate-180')} />
      </Link>
      {open && (item.groups || item.children) && (
        <div id={panelId} className="absolute left-0 top-full z-50 pt-2" role="menu">
          {hasGroups && item.groups ? (
            <MegaMenuPanel groups={item.groups} href={item.href} onClose={onClose} />
          ) : (
            <FlatDropdownPanel item={item} onClose={onClose} />
          )}
        </div>
      )}
    </div>
  )
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: NavItem
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasSubmenu = Boolean(item.groups?.length || item.children?.length)

  if (!hasSubmenu) {
    return (
      <Link
        to={item.href}
        className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-white/5"
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          to={item.href}
          className="min-w-0 flex-1 rounded-lg px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-white/5"
          onClick={onNavigate}
        >
          {item.label}
        </Link>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.label} submenu`}
          onClick={() => setExpanded((v) => !v)}
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
        </button>
      </div>

      {expanded && item.groups && (
        <div className="ml-2 space-y-3 border-l border-white/10 pb-2 pl-3">
          {item.groups.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-400/90">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className="block rounded-lg px-2 py-1.5 text-sm text-slate-400 hover:text-brand-300"
                    onClick={onNavigate}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link
            to={item.href}
            className="block rounded-lg px-2 py-1.5 text-sm font-medium text-brand-300 hover:text-brand-200"
            onClick={onNavigate}
          >
            View all services →
          </Link>
        </div>
      )}

      {expanded && !item.groups && item.children && (
        <div className="ml-4 space-y-1 pb-2">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className="block rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-brand-300"
              onClick={onNavigate}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-slate-950/70 shadow-[0_1px_0_0_rgba(34,211,238,0.08)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-400/35 to-transparent" />
      <div className="section-container flex h-14 items-center gap-4 lg:h-16">
        <Logo onClick={() => setMobileOpen(false)} className="mr-auto lg:mr-0" />

        <nav
          className="ml-auto hidden min-w-0 items-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {primaryNavigation.map((item) =>
            item.children || item.groups ? (
              <NavDropdown
                key={item.label}
                item={item}
                open={openDropdown === item.label}
                onOpen={() => setOpenDropdown(item.label)}
                onClose={() => setOpenDropdown(null)}
              />
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'text-brand-300'
                    : 'text-slate-300 hover:text-white',
                )}
              >
                {item.label}
              </Link>
            ),
          )}

          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('More')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={cn(
                'flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                moreNavigation.some((i) => location.pathname.startsWith(i.href) && i.href !== '/')
                  ? 'text-brand-300'
                  : 'text-slate-300 hover:text-white',
              )}
              aria-expanded={openDropdown === 'More'}
            >
              More
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 opacity-60 transition-transform',
                  openDropdown === 'More' && 'rotate-180',
                )}
              />
            </button>
            {openDropdown === 'More' && (
              <div className="absolute right-0 top-full z-50 pt-2">
                <div className="w-56 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  {moreNavigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Link
            to="/account"
            className="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Client login
          </Link>
          <Button href="/request" size="sm" icon>
            Request a service
          </Button>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/5 bg-slate-950/98 backdrop-blur-2xl lg:hidden">
          <nav className="section-container space-y-1 py-4" aria-label="Mobile navigation">
            {mainNavigation.map((item) => (
              <MobileNavItem key={item.label} item={item} onNavigate={() => setMobileOpen(false)} />
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

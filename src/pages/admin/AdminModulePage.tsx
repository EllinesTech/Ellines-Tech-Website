import { Link } from 'react-router-dom'
import { adminNavGroups } from '@/admin/nav'
import { products } from '@/data/products'
import { services } from '@/data/services'
import { portfolioProjects } from '@/data/portfolio'
import { clientBrands } from '@/data/clients'
import { siteConfig } from '@/data/site'
import { SocialLinks } from '@/components/engagement/SocialLinks'
import { AdminChatPage } from '@/pages/admin/AdminChatPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">{children}</div>
    </div>
  )
}

export function AdminModulePage({ module }: { module: string }) {
  if (module === 'chat-settings') return <AdminChatPage />
  if (module === 'settings' || module === 'site-controls') return <AdminSettingsPage />

  if (module === 'products') {
    return (
      <Panel title="Products" description="Catalogue managed on the live site.">
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.slug} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-white">{p.name}</span>
              <Link className="text-brand-300" to={`/products/${p.slug}`}>
                Open
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    )
  }

  if (module === 'services') {
    return (
      <Panel title="Services" description="Service pages available on the website.">
        <ul className="space-y-2">
          {services.map((s) => (
            <li key={s.slug} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-white">{s.name}</span>
              <Link className="text-brand-300" to={`/services/${s.slug}`}>
                Open
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    )
  }

  if (module === 'portfolio') {
    return (
      <Panel title="Portfolio" description="Projects shown publicly.">
        <ul className="space-y-2">
          {portfolioProjects.map((p) => (
            <li key={p.slug} className="text-sm text-white">
              {p.name}
            </li>
          ))}
        </ul>
      </Panel>
    )
  }

  if (module === 'clients') {
    return (
      <Panel title="Clients" description="Brand marks featured on the site.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {clientBrands.map((c) => (
            <li key={c.id} className="rounded-xl border border-white/10 p-3 text-sm text-white">
              {c.name}
            </li>
          ))}
        </ul>
      </Panel>
    )
  }

  if (module === 'social') {
    return (
      <Panel title="Social Media" description="Verified Ellines Tech handles.">
        <SocialLinks showLabels />
        <ul className="mt-4 space-y-2 text-sm text-slate-400">
          {siteConfig.socialLinks.map((s) => (
            <li key={s.id}>
              {s.label}: {s.handle}
            </li>
          ))}
        </ul>
      </Panel>
    )
  }

  if (module === 'god-mode') {
    return (
      <Panel
        title="God Mode"
        description="Full Super Admin toolkit — live chat, AI knowledge, site controls, and content modules."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {adminNavGroups.flatMap((g) => g.items).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-brand-400/30 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Panel>
    )
  }

  const label =
    adminNavGroups.flatMap((g) => g.items).find((i) => i.to === `/admin/${module}`)?.label ||
    module

  return (
    <Panel
      title={label}
      description="This Super Admin module is ready in the control panel. Core engagement (Live Chat, Chat Settings, Site Controls) is fully operational; deeper CMS write-backs continue to expand on the same God Mode foundation."
    >
      <p className="text-sm text-slate-400">
        Use <strong className="text-white">Live Chat</strong> to speak with visitors now,{' '}
        <strong className="text-white">Chat Settings</strong> to train answers, and{' '}
        <strong className="text-white">Site Controls</strong> for announcements / chat toggles.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/admin/live-chat" className="text-sm text-brand-300 hover:text-brand-200">
          → Live Chat
        </Link>
        <Link to="/admin/chat-settings" className="text-sm text-brand-300 hover:text-brand-200">
          → Chat Settings
        </Link>
        <Link to="/admin/site-controls" className="text-sm text-brand-300 hover:text-brand-200">
          → Site Controls
        </Link>
      </div>
    </Panel>
  )
}

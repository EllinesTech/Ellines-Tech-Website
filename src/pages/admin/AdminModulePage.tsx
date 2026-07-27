import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { adminNavGroups } from '@/admin/nav'
import { testimonials as defaultTestimonials } from '@/data/content'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { AdminChatPage } from '@/pages/admin/AdminChatPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { AdminPagesEditor } from '@/pages/admin/AdminPagesEditor'
import { AdminResourcesEditor } from '@/pages/admin/AdminResourcesEditor'
import { AdminDownloadsEditor } from '@/pages/admin/AdminDownloadsEditor'
import { AdminCareersModule } from '@/pages/admin/AdminCareersModule'
import { AdminInvoicesModule } from '@/pages/admin/AdminInvoicesModule'
import { AdminReportsModule } from '@/pages/admin/AdminReportsModule'
import { AdminServicesModule } from '@/pages/admin/AdminServicesModule'
import { AdminPaymentsModule } from '@/pages/admin/AdminPaymentsModule'
import { AdminVisitorsModule } from '@/pages/admin/AdminVisitorsModule'
import { MaskedIpNotice, VisitorChips } from '@/components/admin/VisitorContext'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { TotpSetupPanel } from '@/components/auth/TotpSetupPanel'
import { loadAuthUser } from '@/lib/auth'
import { currentActor } from '@/lib/adminAccess'
import {
  OnlineUsersModule,
  PortfolioEditor,
  ProductsEditor,
  SiteProfileEditor,
} from '@/pages/admin/AdminCatalogEditors'
import {
  backupCms,
  bootstrapSuperAdmin,
  createAdminUser,
  fetchActivity,
  fetchAnalytics,
  fetchOpsStatus,
  fetchInvoices,
  fetchLeads,
  fetchNewsletter,
  createNotification,
  fetchNotifications,
  fetchReviews,
  deleteMediaItem,
  fetchMediaExtras,
  fetchShop,
  fetchSiteCopy,
  fetchSuperAdminStatus,
  fetchUsers,
  restoreCms,
  saveMediaItem,
  saveReviews,
  saveShop,
  saveSiteCopy,
  setUserActive,
  updateLeadStatus,
  updateUserRole,
  type CmsMediaItem,
  type CmsUser,
  type VisitorContext,
  type VisitorRecord,
} from '@/lib/cmsApi'
import {
  loadClientBrands,
  saveClientBrands,
  staticClientBrands,
  type CatalogClientBrand,
} from '@/lib/clientBrandsCatalog'
import { listLiveSessions } from '@/lib/liveChatApi'
import { starterPricingPackages } from '@/data/pricingPackages'
import { getSiteMediaLibrary, type SiteMediaItem } from '@/data/siteMediaLibrary'
import { leadStatusOptions } from '@/data/downloads'

function MediaAssetCard({
  item,
  onDelete,
}: {
  item: SiteMediaItem | CmsMediaItem
  onDelete?: () => void
}) {
  const [copied, setCopied] = useState(false)

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(item.src)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <li className="overflow-hidden rounded-xl border border-white/10">
      <img src={item.src} alt={item.label} className="h-28 w-full object-cover bg-slate-900" />
      <div className="flex items-start justify-between gap-2 px-2 py-1.5">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium capitalize text-slate-200">{item.label}</p>
          <p className="truncate text-[11px] text-slate-500">{item.src}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onClick={() => void copyUrl()}
            className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-brand-300 hover:border-brand-400/40 hover:text-white"
          >
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-rose-300"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </li>
  )
}

function SitePhotosModule() {
  const library = getSiteMediaLibrary()
  const banners = library.filter((i) => i.group === 'banners')
  const scenes = library.filter((i) => i.group === 'scenes')
  const packages = library.filter((i) => i.group === 'packages')
  const [extras, setExtras] = useState<CmsMediaItem[]>([])
  const [label, setLabel] = useState('')
  const [src, setSrc] = useState('')
  const [group, setGroup] = useState<CmsMediaItem['group']>('custom')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadExtras() {
    try {
      setExtras(await fetchMediaExtras())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load custom photos')
    }
  }

  useEffect(() => {
    void loadExtras()
  }, [])

  async function onAdd() {
    if (!src.trim()) {
      setError('Paste an image URL or site path first')
      return
    }
    try {
      const res = await saveMediaItem({
        label: label.trim() || 'Custom photo',
        src: src.trim(),
        group,
      })
      setExtras(res.media || [])
      setLabel('')
      setSrc('')
      setMessage('Photo added to library')
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  return (
    <Panel
      title="Site Photos"
      description="Browse built-in banners, scenes, and package posters — or add custom URLs for services and pricing."
    >
      <Err message={error} />
      <Msg message={message} />

      <div className="mb-6 space-y-3 rounded-xl border border-dashed border-brand-400/30 bg-brand-500/5 p-4">
        <p className="text-sm font-medium text-brand-200">Add photo by URL</p>
        <p className="text-xs text-slate-400">
          Paste a path like <code className="text-slate-300">/media/…</code> or a full https URL.
          Hosted file upload is not wired yet — use Site Photos paths or an external CDN.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
          />
          <input
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="URL or /media/… path"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white sm:col-span-2"
          />
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value as CmsMediaItem['group'])}
            className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
          >
            <option value="custom">custom</option>
            <option value="packages">packages</option>
            <option value="banners">banners</option>
            <option value="scenes">scenes</option>
          </select>
        </div>
        <Button type="button" onClick={() => void onAdd()}>
          Add to library
        </Button>
      </div>

      {extras.length > 0 ? (
        <>
          <p className="mb-3 text-sm text-slate-400">Custom library ({extras.length})</p>
          <ul className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((item) => (
              <MediaAssetCard
                key={item.id}
                item={item}
                onDelete={() => {
                  void deleteMediaItem(item.id)
                    .then((res) => {
                      setExtras(res.media || extras.filter((e) => e.id !== item.id))
                      setMessage('Removed from library')
                    })
                    .catch((e) => setError(e instanceof Error ? e.message : 'Delete failed'))
                }}
              />
            ))}
          </ul>
        </>
      ) : null}

      <p className="mb-3 text-sm text-slate-400">Banners</p>
      <ul className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((item) => (
          <MediaAssetCard key={item.id} item={item} />
        ))}
      </ul>
      <p className="mb-3 text-sm text-slate-400">Scenes</p>
      <ul className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {scenes.map((item) => (
          <MediaAssetCard key={item.id} item={item} />
        ))}
      </ul>
      <p className="mb-3 text-sm text-slate-400">
        Package posters ({packages.length}) — merch, graphics, stationery, and service photos
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <MediaAssetCard key={item.id} item={item} />
        ))}
      </ul>
    </Panel>
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="space-y-5">
      <div className="max-w-3xl">
        <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
        {children}
      </div>
    </div>
  )
}

function Err({ message }: { message: string }) {
  if (!message) return null
  return <p className="mb-3 text-sm text-amber-200">{message}</p>
}

function Msg({ message }: { message: string }) {
  if (!message) return null
  return <p className="mb-3 text-sm text-emerald-300">{message}</p>
}

type ShopProduct = {
  id: string
  name: string
  price: number
  currency: string
  category: string
  level?: string
  description: string
  status: string
  groupId?: string
  groupName?: string
  tierLabel?: string
  experienceBand?: string
  image?: string
}

function ActivityModule() {
  const [items, setItems] = useState<{ id: string; at: string; type?: string; message?: string }[]>(
    [],
  )
  const [error, setError] = useState('')
  useEffect(() => {
    fetchActivity()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])
  return (
    <Panel title="Activity Feed" description="Recent CMS, lead, and account events.">
      <Err message={error} />
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-sm text-slate-500">No activity yet.</li>}
        {items.map((a) => (
          <li key={a.id} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
            <p className="text-white">{a.message}</p>
            <p className="text-xs text-slate-500">
              {a.type} · {new Date(a.at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function LeadsModule() {
  const [leads, setLeads] = useState<
    {
      id: string
      name: string
      email: string
      phone?: string
      message?: string
      at: string
      intent?: string
      packageName?: string
      packagePrice?: string
      service?: string
      budget?: string
      timeline?: string
      status?: string
      company?: string
      visitor?: VisitorContext
    }[]
  >([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState('')

  async function load() {
    try {
      setLeads(await fetchLeads())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onStatus(id: string, status: string) {
    setSaving(id)
    try {
      await updateLeadStatus(id, status)
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Status update failed')
    } finally {
      setSaving('')
    }
  }

  return (
    <Panel
      title="Leads & purchase requests"
      description="Quotes, service requests, and package buy requests from /request and contact. Update status as you work them."
    >
      <Err message={error} />
      <ul className="space-y-3">
        {leads.length === 0 && <li className="text-sm text-slate-500">No leads yet.</li>}
        {leads.map((l) => (
          <li key={l.id} className="rounded-xl border border-white/10 p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-white">
                {l.name || 'Anonymous'} · {l.email}
              </p>
              {l.intent && (
                <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-200">
                  {l.intent}
                </span>
              )}
            </div>
            {(l.packageName || l.service) && (
              <p className="mt-1 text-brand-300">
                {l.packageName || l.service}
                {l.packagePrice ? ` · ${l.packagePrice}` : ''}
              </p>
            )}
            {l.company && <p className="text-slate-400">{l.company}</p>}
            {l.phone && <p className="text-slate-400">{l.phone}</p>}
            {(l.budget || l.timeline) && (
              <p className="text-xs text-slate-500">
                {[l.budget, l.timeline].filter(Boolean).join(' · ')}
              </p>
            )}
            {l.message && <p className="mt-1 text-slate-300">{l.message}</p>}
            {l.visitor && (
              <div className="mt-2">
                <VisitorChips visitor={l.visitor} />
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-500">
                Status
                <select
                  value={l.status || 'new'}
                  disabled={saving === l.id}
                  onChange={(e) => onStatus(l.id, e.target.value)}
                  className="ml-2 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
                >
                  {!leadStatusOptions.includes(
                    (l.status || 'new') as (typeof leadStatusOptions)[number],
                  ) && (
                    <option value={l.status || 'new'}>{l.status || 'new'}</option>
                  )}
                  {leadStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-xs text-slate-600">{new Date(l.at).toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function UsersModule() {
  const [users, setUsers] = useState<CmsUser[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('Marketing Manager')
  const [role, setRole] = useState<'admin' | 'staff'>('staff')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    try {
      setUsers(await fetchUsers())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Panel
      title="Users"
      description="Create employee accounts (staff/admin) for the Staff workspace at /staff. Clients self-register at /account for pricing & packages."
    >
      <Err message={error} />
      <Msg message={message} />
      <div className="mb-6 grid gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-2">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
        />
        <input
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
        />
        <PasswordInput
          placeholder="Password (6+)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
          autoComplete="new-password"
        />
        <select
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
        >
          <option value="Marketing Manager">Marketing Manager</option>
          <option value="Sales">Sales</option>
          <option value="Support">Support</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
          <option value="Content">Content</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
        >
          <option value="staff">Staff (employee)</option>
          <option value="admin">Admin (elevated staff)</option>
        </select>
        <Button
          type="button"
          onClick={async () => {
            try {
              await createAdminUser({ email, password, name, role, jobTitle })
              setMessage(`Staff account created — they log in at /staff/login`)
              setEmail('')
              setPassword('')
              setName('')
              await load()
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed')
            }
          }}
        >
          Create staff account
        </Button>
      </div>
      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm"
          >
            <div>
              <p className="text-white">
                {u.name} · {u.email}
              </p>
              <p className="text-xs text-slate-500">
                {u.role}
                {u.jobTitle ? ` · ${u.jobTitle}` : ''}
                {u.active === false ? ' · deactivated' : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={u.role}
                onChange={async (e) => {
                  await updateUserRole(u.id, e.target.value as CmsUser['role'])
                  await load()
                }}
                className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
              >
                <option value="customer">customer</option>
                <option value="staff">staff</option>
                <option value="admin">admin</option>
                <option value="super_admin">super_admin</option>
              </select>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={async () => {
                  await setUserActive(u.id, u.active === false)
                  await load()
                }}
              >
                {u.active === false ? 'Activate' : 'Deactivate'}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function ShopModule() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchShop()
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  async function persist(next: ShopProduct[], okMessage: string) {
    try {
      await saveShop(next)
      setProducts(next)
      setMessage(okMessage)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    }
  }

  return (
    <Panel
      title="Product Pricing"
      description="Each row is a buyable tier. Rows that share a Service group id appear as one card on /pricing with an in-card option selector."
    >
      <Err message={error} />
      <Msg message={message} />
      <ul className="space-y-3">
        {products.map((p, idx) => (
          <li key={p.id} className="space-y-2 rounded-xl border border-white/10 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={p.name}
                onChange={(e) => {
                  const next = [...products]
                  next[idx] = { ...p, name: e.target.value }
                  setProducts(next)
                }}
                className="min-w-[12rem] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="Package name"
              />
              <button
                type="button"
                className="text-xs text-rose-300"
                onClick={() => {
                  const next = products.filter((_, i) => i !== idx)
                  setProducts(next)
                }}
              >
                Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Service group id
                <input
                  value={p.groupId || ''}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, groupId: e.target.value }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="career_cover"
                />
              </label>
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Service card name
                <input
                  value={p.groupName || ''}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, groupName: e.target.value }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="Cover Letter"
                />
              </label>
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Tier label
                <input
                  value={p.tierLabel || ''}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, tierLabel: e.target.value }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="Student / 1–2 years"
                />
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Price
                <input
                  type="number"
                  value={p.price}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, price: Number(e.target.value) }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                />
              </label>
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Currency
                <input
                  value={p.currency || 'KES'}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, currency: e.target.value }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                />
              </label>
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Category
                <input
                  value={p.category}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, category: e.target.value }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                />
              </label>
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Level
                <input
                  value={p.level || ''}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, level: e.target.value }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="Student / Mid / …"
                />
              </label>
              <label className="text-[10px] uppercase tracking-wide text-slate-500">
                Status
                <select
                  value={p.status}
                  onChange={(e) => {
                    const next = [...products]
                    next[idx] = { ...p, status: e.target.value }
                    setProducts(next)
                  }}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>
            </div>
            <label className="block text-[10px] uppercase tracking-wide text-slate-500">
              Experience / pocket band
              <input
                value={p.experienceBand || ''}
                onChange={(e) => {
                  const next = [...products]
                  next[idx] = { ...p, experienceBand: e.target.value }
                  setProducts(next)
                }}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="e.g. 1–2 years experience"
              />
            </label>
            <MediaPicker
              value={p.image || ''}
              onChange={(url) => {
                const next = [...products]
                next[idx] = { ...p, image: url }
                setProducts(next)
              }}
              label="Package photo / poster"
            />
            <textarea
              value={p.description}
              onChange={(e) => {
                const next = [...products]
                next[idx] = { ...p, description: e.target.value }
                setProducts(next)
              }}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              placeholder="Short description"
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setProducts((list) => [
              ...list,
              {
                id: `price_${Date.now().toString(36)}`,
                name: 'New package',
                price: 0,
                currency: 'KES',
                category: 'Web',
                description: '',
                status: 'draft',
                groupId: `group_${Date.now().toString(36)}`,
                groupName: 'New service',
                tierLabel: 'Starter',
              },
            ])
          }
        >
          Add package
        </Button>
        <Button
          type="button"
          onClick={async () => {
            await persist(products, 'Product pricing saved — live on /pricing')
          }}
        >
          Save pricing
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={async () => {
            await persist(starterPricingPackages, 'Starter catalogue loaded and saved')
          }}
        >
          Load starter catalogue
        </Button>
        <Link to="/pricing" className="self-center text-sm text-brand-300">
          View /pricing →
        </Link>
      </div>
    </Panel>
  )
}

function AnalyticsModule({ title = 'Analytics' }: { title?: string }) {
  const [data, setData] = useState<{
    visitors?: { total: number; today: number; pages?: Record<string, number> }
    liveChats?: number
    waitingChats?: number
    onlineNow?: number
    leadsTotal?: number
    recentVisitors?: VisitorRecord[]
    canSeeIp?: boolean
  } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    function load() {
      fetchAnalytics()
        .then(setData)
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
    }
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [])
  const pages = Object.entries(data?.visitors?.pages || {}).sort((a, b) => b[1] - a[1])
  return (
    <Panel title={title} description="Live visit counts, presence, and chat demand (auto-refresh 15s).">
      <Err message={error} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-slate-500">Total visits</p>
          <p className="mt-1 text-2xl font-bold text-white">{data?.visitors?.total ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-slate-500">Today</p>
          <p className="mt-1 text-2xl font-bold text-white">{data?.visitors?.today ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-slate-500">Online now</p>
          <p className="mt-1 text-2xl font-bold text-white">{data?.onlineNow ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-slate-500">Live / waiting chats</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {data?.liveChats ?? 0} / {data?.waitingChats ?? 0}
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-1 text-sm text-slate-400">
        {pages.slice(0, 12).map(([path, count]) => (
          <li key={path} className="flex justify-between gap-3">
            <span className="truncate text-slate-300">{path}</span>
            <span>{count}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wider text-slate-500">Recent visitors</p>
          <MaskedIpNotice canSeeIp={Boolean(data?.canSeeIp)} />
        </div>
        <ul className="mt-2 space-y-2">
          {(data?.recentVisitors || []).slice(0, 8).map((v) => (
            <li key={v.sessionId} className="rounded-xl border border-white/10 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="truncate text-slate-200">{v.path}</span>
                <span className="text-xs text-slate-600">
                  {new Date(v.lastSeen).toLocaleTimeString()}
                </span>
              </div>
              <div className="mt-1.5">
                <VisitorChips visitor={v.visitor} location={v.location} />
              </div>
            </li>
          ))}
          {(data?.recentVisitors || []).length === 0 && (
            <li className="text-sm text-slate-500">No visitor sessions recorded yet.</li>
          )}
        </ul>
        <Link to="/admin/visitors" className="mt-3 inline-block text-sm text-brand-300">
          → Full visitor intelligence
        </Link>
      </div>
    </Panel>
  )
}

function ReviewsModule() {
  const [reviews, setReviews] = useState<
    { quote: string; name: string; role: string; id?: string }[]
  >([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
      .then((r) => {
        if (Array.isArray(r) && r.length) setReviews(r as typeof reviews)
        else
          setReviews(
            defaultTestimonials.map((t, i) => ({
              id: `rev_${i}`,
              quote: t.quote,
              name: t.name,
              role: t.role,
            })),
          )
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  return (
    <Panel title="Reviews & Testimonials" description="Manage quotes shown on the marketing site.">
      <Err message={error} />
      <Msg message={message} />
      <ul className="space-y-3">
        {reviews.map((r, idx) => (
          <li key={r.id || idx} className="space-y-2 rounded-xl border border-white/10 p-3">
            <textarea
              value={r.quote}
              rows={2}
              onChange={(e) => {
                const next = [...reviews]
                next[idx] = { ...r, quote: e.target.value }
                setReviews(next)
              }}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={r.name}
                onChange={(e) => {
                  const next = [...reviews]
                  next[idx] = { ...r, name: e.target.value }
                  setReviews(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="Name"
              />
              <input
                value={r.role}
                onChange={(e) => {
                  const next = [...reviews]
                  next[idx] = { ...r, role: e.target.value }
                  setReviews(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="Role / company"
              />
            </div>
            <button
              type="button"
              className="text-xs text-rose-300"
              onClick={() => setReviews(reviews.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setReviews((list) => [
              ...list,
              { id: `rev_${Date.now()}`, quote: '', name: '', role: '' },
            ])
          }
        >
          Add review
        </Button>
        <Button
          type="button"
          onClick={async () => {
            try {
              await saveReviews(reviews)
              setMessage('Reviews saved — live on Home')
              setError('')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed')
            }
          }}
        >
          Save reviews
        </Button>
      </div>
    </Panel>
  )
}

function NewsletterModule() {
  const [subs, setSubs] = useState<{ id: string; email: string; at: string }[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    fetchNewsletter()
      .then(setSubs)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  function exportCsv() {
    const rows = ['email,subscribed_at', ...subs.map((s) => `${s.email},${s.at}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Panel title="Newsletter" description="Email subscribers collected from the site.">
      <Err message={error} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-400">{subs.length} subscribers</p>
        <Button type="button" variant="secondary" size="sm" onClick={exportCsv} disabled={!subs.length}>
          Export CSV
        </Button>
      </div>
      <ul className="max-h-96 space-y-1 overflow-auto text-sm">
        {subs.map((s) => (
          <li key={s.id} className="flex justify-between gap-3 border-b border-white/5 py-1.5">
            <span className="text-white">{s.email}</span>
            <span className="text-xs text-slate-500">{new Date(s.at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function NotificationsModule() {
  const [items, setItems] = useState<{ id: string; title: string; body: string; at: string }[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    try {
      setItems(await fetchNotifications())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <Panel title="Notifications" description="System notices for admin and staff panels.">
      <Err message={error} />
      <Msg message={message} />
      <div className="mb-5 grid gap-2 rounded-xl border border-white/10 p-4 sm:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
        />
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
        />
        <Button
          type="button"
          onClick={async () => {
            if (!title.trim()) {
              setError('Title is required')
              return
            }
            try {
              await createNotification(title.trim(), body.trim())
              setTitle('')
              setBody('')
              setMessage('Notification posted')
              await load()
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed to post')
            }
          }}
        >
          Post notification
        </Button>
      </div>
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-sm text-slate-500">No notifications.</li>}
        {items.map((n) => (
          <li key={n.id} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
            <p className="text-white">{n.title}</p>
            <p className="text-slate-400">{n.body}</p>
            <p className="mt-1 text-[11px] text-slate-600">{new Date(n.at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function BackupModule() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')
  return (
    <Panel title="Backup & Restore" description="Snapshot pages, shop, reviews, leads, and copy.">
      <Err message={error} />
      <Msg message={message} />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={async () => {
            try {
              const res = await backupCms()
              setPreview(JSON.stringify(res.backup, null, 2).slice(0, 4000))
              setMessage('Backup saved to KV')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed')
            }
          }}
        >
          Create backup
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            try {
              await restoreCms()
              setMessage('Latest backup restored')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed')
            }
          }}
        >
          Restore latest
        </Button>
      </div>
      {preview && (
        <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-black/40 p-3 text-xs text-slate-400">
          {preview}
        </pre>
      )}
    </Panel>
  )
}

function FaqModule() {
  const [items, setItems] = useState<{ q: string; a: string }[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSiteCopy()
      .then((copy) => {
        const faq = (copy as { faq?: { q: string; a: string }[] }).faq
        if (faq?.length) setItems(faq)
        else
          setItems([
            {
              q: 'What services does Ellines Tech offer?',
              a: 'Software development, web & mobile apps, AI, design, digital marketing, and cyber security.',
            },
            {
              q: 'Do you work with startups?',
              a: 'Yes — we build right-sized solutions so early teams can ship without overbuilding.',
            },
          ])
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  return (
    <Panel title="FAQ Manager" description="Edit FAQs stored in CMS (used by /faq when published).">
      <Err message={error} />
      <Msg message={message} />
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="space-y-2 rounded-xl border border-white/10 p-3">
            <input
              value={item.q}
              onChange={(e) => {
                const next = [...items]
                next[idx] = { ...item, q: e.target.value }
                setItems(next)
              }}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              placeholder="Question"
            />
            <textarea
              value={item.a}
              rows={2}
              onChange={(e) => {
                const next = [...items]
                next[idx] = { ...item, a: e.target.value }
                setItems(next)
              }}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              placeholder="Answer"
            />
            <button
              type="button"
              className="text-xs text-rose-300"
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setItems((list) => [...list, { q: '', a: '' }])}
        >
          Add FAQ
        </Button>
        <Button
          type="button"
          onClick={async () => {
            try {
              const copy = await fetchSiteCopy()
              await saveSiteCopy({ ...copy, faq: items })
              setMessage('FAQ saved — live on /faq')
              setError('')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed')
            }
          }}
        >
          Save FAQ
        </Button>
      </div>
    </Panel>
  )
}

function ClientsCrmModule() {
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
  const [brands, setBrands] = useState<CatalogClientBrand[]>(() => staticClientBrands())
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([fetchLeads(), fetchInvoices(), loadClientBrands()])
      .then(([list, invoices, brandList]) => {
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
        setBrands(brandList)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  return (
    <div className="space-y-6">
      <Panel
        title="Client contacts"
        description="Unique emails from leads and invoices — live CRM view."
      >
        <Err message={error} />
        <ul className="space-y-2">
          {contacts.length === 0 && !error && (
            <li className="text-sm text-slate-500">No client contacts yet.</li>
          )}
          {contacts.map((c) => (
            <li key={c.email} className="rounded-xl border border-white/10 px-4 py-3 text-sm">
              <p className="font-medium text-white">{c.name}</p>
              <p className="text-slate-400">
                {c.email}
                {c.company ? ` · ${c.company}` : ''}
                {c.phone ? ` · ${c.phone}` : ''}
              </p>
              <p className="text-xs text-slate-600">
                {c.leads} lead(s) · {c.invoices} invoice(s)
                {c.unpaid ? ` · ${c.unpaid} unpaid/draft` : ''}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel
        title="Featured brand marks"
        description="Logos shown on /clients and Home. Saves to CMS site copy."
      >
        <Msg message={message} />
        <ul className="space-y-3">
          {brands.map((b, idx) => (
            <li key={b.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-2">
              <input
                value={b.name}
                onChange={(e) => {
                  const next = [...brands]
                  next[idx] = { ...b, name: e.target.value }
                  setBrands(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="Brand name"
              />
              <input
                value={b.logo}
                onChange={(e) => {
                  const next = [...brands]
                  next[idx] = { ...b, logo: e.target.value }
                  setBrands(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="/client-logos/…"
              />
              <input
                value={b.work}
                onChange={(e) => {
                  const next = [...brands]
                  next[idx] = { ...b, work: e.target.value }
                  setBrands(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white sm:col-span-2"
                placeholder="Work summary"
              />
              <div className="flex items-center justify-between gap-2 sm:col-span-2">
                <select
                  value={b.category}
                  onChange={(e) => {
                    const next = [...brands]
                    next[idx] = {
                      ...b,
                      category: e.target.value as CatalogClientBrand['category'],
                    }
                    setBrands(next)
                  }}
                  className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
                >
                  {(
                    [
                      'hospitality',
                      'healthcare',
                      'retail',
                      'events',
                      'services',
                      'group',
                    ] as const
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text-xs text-rose-300"
                  onClick={() => setBrands(brands.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setBrands((list) => [
                ...list,
                {
                  id: `brand_${Date.now().toString(36)}`,
                  name: 'New brand',
                  logo: '/client-logos/ellines-consultancy.png',
                  category: 'services',
                  work: '',
                },
              ])
            }
          >
            Add brand
          </Button>
          <Button
            type="button"
            onClick={async () => {
              try {
                await saveClientBrands(brands)
                setMessage('Brand marks saved — live on /clients & Home')
                setError('')
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Save failed')
              }
            }}
          >
            Save brand marks
          </Button>
          <Link to="/clients" className="self-center text-sm text-brand-300">
            View /clients →
          </Link>
        </div>
      </Panel>
    </div>
  )
}

function PermissionsModule() {
  const rows = [
    {
      lane: 'God Mode (/admin)',
      who: 'Owner key · super_admin accounts',
      can: 'Full CMS, users, settings, payments, backup, live chat, visitor IPs',
    },
    {
      lane: 'Admin (/staff)',
      who: 'admin CMS users',
      can: 'Everything staff can do, plus unmasked visitor IP / user agent',
    },
    {
      lane: 'Staff (/staff)',
      who: 'staff CMS users',
      can: 'Leads, clients, invoices, careers, live chat, pricing view, materials (visitor IPs masked)',
    },
    {
      lane: 'Client (/account)',
      who: 'customer role',
      can: 'Own requests, invoices, profile, materials, support links',
    },
  ]
  return (
    <div className="space-y-6">
      <Panel
        title="Permissions"
        description="How access lanes map to capabilities. Fine-grained job-title ACL is not enabled — titles are labels only."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-2 pr-3">Lane</th>
                <th className="py-2 pr-3">Who</th>
                <th className="py-2">Can access</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.lane} className="border-b border-white/5 align-top text-slate-300">
                  <td className="py-3 pr-3 font-medium text-white">{r.lane}</td>
                  <td className="py-3 pr-3">{r.who}</td>
                  <td className="py-3">{r.can}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/admin/users" className="mt-4 inline-block text-sm text-brand-300">
          → Manage users & roles
        </Link>
      </Panel>
    </div>
  )
}

function DesignStudioModule() {
  const [heroSub, setHeroSub] = useState('')
  const [groupTitle, setGroupTitle] = useState('')
  const [groupBody, setGroupBody] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSiteCopy()
      .then((copy) => {
        const home = (copy as { home?: Record<string, string> }).home || {}
        setHeroSub(home.heroSub || '')
        setGroupTitle(home.groupTitle || '')
        setGroupBody(home.groupBody || '')
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
  }, [])

  return (
    <div className="space-y-6">
      <Panel
        title="Design Studio"
        description="Quick brand messaging for the first viewport and group section. Full page copy lives in Page Editor."
      >
        <Err message={error} />
        <Msg message={message} />
        <p className="mb-3 text-xs text-slate-500">
          Fonts: Outfit (display) + DM Sans (body) · Accent: cyan brand scale on deep slate
        </p>
        <label className="mb-3 block text-xs text-slate-400">
          Home hero supporting line
          <textarea
            value={heroSub}
            onChange={(e) => setHeroSub(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="mb-3 block text-xs text-slate-400">
          Group section title
          <input
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="mb-3 block text-xs text-slate-400">
          Group section description
          <textarea
            value={groupBody}
            onChange={(e) => setGroupBody(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
          />
        </label>
        <Button
          type="button"
          onClick={async () => {
            try {
              const copy = (await fetchSiteCopy()) as { home?: Record<string, string> }
              await saveSiteCopy({
                ...copy,
                home: {
                  ...(copy.home || {}),
                  heroSub,
                  groupTitle,
                  groupBody,
                },
              })
              setMessage('Design copy saved — live on Home')
              setError('')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Save failed')
            }
          }}
        >
          Save design copy
        </Button>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/admin/pages" className="text-brand-300">
            → Page Editor
          </Link>
          <Link to="/admin/shop" className="text-brand-300">
            → Product Pricing
          </Link>
          <Link to="/admin/media" className="text-brand-300">
            → Site Photos
          </Link>
          <Link to="/admin/site-controls" className="text-brand-300">
            → Announcement banner
          </Link>
        </div>
      </Panel>
    </div>
  )
}

function MessagesModule() {
  const [waiting, setWaiting] = useState(0)
  const [live, setLive] = useState(0)
  const [notes, setNotes] = useState<{ id: string; title: string; body: string; at: string }[]>(
    [],
  )

  useEffect(() => {
    listLiveSessions()
      .then((sessions) => {
        setWaiting(sessions.filter((s) => s.status === 'waiting').length)
        setLive(sessions.filter((s) => s.status === 'live').length)
      })
      .catch(() => undefined)
    fetchNotifications()
      .then((n) => setNotes(n.slice(0, 6)))
      .catch(() => undefined)
  }, [])

  return (
    <div className="space-y-6">
      <Panel title="Messages" description="Visitor chat queue and recent system notices.">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Waiting chats</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{waiting}</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Live chats</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{live}</p>
          </div>
        </div>
        <Link to="/admin/live-chat" className="mt-4 inline-block text-sm text-brand-300">
          → Open Live Chat inbox
        </Link>
      </Panel>
      <Panel title="Recent notifications" description="Leads, invoices, and applications.">
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
              <p className="text-white">{n.title}</p>
              <p className="text-slate-400">{n.body}</p>
            </li>
          ))}
          {notes.length === 0 && <li className="text-sm text-slate-500">No notifications.</li>}
        </ul>
      </Panel>
    </div>
  )
}

function SecurityPasswordModule() {
  const actor = currentActor()
  const authUser = loadAuthUser()
  const [statusEmail, setStatusEmail] = useState('ellines.tech@gmail.com')
  const [exists, setExists] = useState<boolean | null>(null)
  const [bootstrapPassword, setBootstrapPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchSuperAdminStatus()
      .then((s) => {
        if (cancelled) return
        setStatusEmail(s.email)
        setExists(s.exists)
      })
      .catch(() => {
        if (!cancelled) setExists(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onBootstrap(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (bootstrapPassword !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (bootstrapPassword.length < 12) {
      setError('Super Admin password must be at least 12 characters')
      return
    }
    setBusy(true)
    try {
      const res = await bootstrapSuperAdmin(bootstrapPassword)
      setMessage(res.message)
      setStatusEmail(res.email)
      setExists(true)
      setBootstrapPassword('')
      setConfirm('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bootstrap failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel title="Security & Password" description="Three separate access lanes — do not mix them.">
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
        <li>
          <strong className="text-white">Owner key</strong> — server secret{' '}
          <code className="text-brand-300">ADMIN_API_KEY</code> (Cloudflare Pages /{' '}
          <code className="text-brand-300">.dev.vars</code>). Verified at the edge and exchanged for
          a 12-hour session token; never shipped in the browser bundle.
        </li>
        <li>
          <strong className="text-white">Super Admin</strong> — email + password for{' '}
          <code className="text-brand-300">{statusEmail}</code>. Also grants God Mode. Different
          from the Owner key.
        </li>
        <li>Staff (/staff) — employee accounts created under Users. Own email/password login.</li>
        <li>Clients (/account) — customers for pricing & packages. Public register/login.</li>
        <li>Roles: super_admin | admin | staff | customer · passwords PBKDF2-hashed in KV</li>
        <li>
          Password reset sends a one-time code by email (Resend) and SMS (Africa&apos;s Talking or
          Twilio) when a phone number is on the account.
        </li>
        <li>
          Two-factor authentication (TOTP) can be enabled below for this session. Owner-key 2FA is
          configured while signed in with the owner key; Super Admin / staff 2FA follows the account
          login.
        </li>
      </ul>

      <div id="change-password" className="mt-6 space-y-6">
        {authUser && actor.role !== 'owner' ? (
          <ChangePasswordForm user={authUser} />
        ) : (
          <p className="text-sm text-slate-500">
            Owner-key sessions have no account password. Use the bootstrap form below to set the
            Super Admin password, then sign in on the Super Admin tab — or use{' '}
            <Link to="/account/reset" className="text-brand-300">
              Forgot password
            </Link>{' '}
            once that account exists.
          </p>
        )}

        <TotpSetupPanel />

        {(actor.role === 'owner' || actor.role === 'super_admin') && (
          <form
            onSubmit={onBootstrap}
            className="space-y-4 rounded-2xl border border-brand-400/20 bg-brand-500/[0.04] p-5"
          >
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Bootstrap Super Admin
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {exists === false
                  ? `Create ${statusEmail} and set its first password (min 12 characters).`
                  : exists
                    ? `Reset the password for ${statusEmail}.`
                    : `Create or reset the password for ${statusEmail}.`}{' '}
                Optional env seed: <code className="text-brand-300">SUPER_ADMIN_BOOTSTRAP_PASSWORD</code>{' '}
                (remove after first use).
              </p>
            </div>
            <PasswordInput
              required
              minLength={12}
              value={bootstrapPassword}
              onChange={(e) => setBootstrapPassword(e.target.value)}
              placeholder="New Super Admin password"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
              autoComplete="new-password"
            />
            <PasswordInput
              required
              minLength={12}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-brand-400/40"
              autoComplete="new-password"
            />
            {error && <p className="text-sm text-rose-300">{error}</p>}
            {message && <p className="text-sm text-emerald-300">{message}</p>}
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? 'Saving…' : exists ? 'Reset Super Admin password' : 'Create Super Admin'}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link to="/admin/users" className="text-brand-300">
          → Users & roles
        </Link>
        <Link to="/admin/permissions" className="text-brand-300">
          → Permissions matrix
        </Link>
        <Link to="/account/reset" className="text-brand-300">
          → Forgot password
        </Link>
      </div>
    </Panel>
  )
}

function IntegrationsStatusModule() {
  const [ops, setOps] = useState<Awaited<ReturnType<typeof fetchOpsStatus>> | null>(null)
  const [payReady, setPayReady] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchOpsStatus(),
      fetch('/api/paystack/initialize')
        .then((r) => r.json())
        .then((d) => Boolean(d?.paystack?.ready))
        .catch(() => false),
    ])
      .then(([status, ready]) => {
        if (cancelled) return
        setOps(status)
        setPayReady(ready)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load status')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const rows = [
    {
      label: 'Resend email',
      ok: ops?.emailConfigured,
      detail: ops?.emailConfigured
        ? ops.resendFromSet
          ? 'API key + from address set'
          : 'API key set (from address defaulting)'
        : 'Missing RESEND_API_KEY',
    },
    {
      label: 'Lead / order notify',
      ok: ops?.leadsNotifySet,
      detail: ops?.leadsNotifySet ? 'LEADS/ORDERS notify set' : 'Using default tech@ fallback',
    },
    {
      label: 'SMS (Africa’s Talking)',
      ok: ops?.smsConfigured,
      detail: !ops?.smsConfigured
        ? 'Not configured — email OTP still works'
        : ops.smsSandbox
          ? 'Sandbox only (test numbers)'
          : 'Live SMS credentials set',
    },
    {
      label: 'Paystack checkout',
      ok: payReady === true || ops?.paystackSecretSet,
      detail:
        payReady === true
          ? 'Enabled and ready'
          : ops?.paystackSecretSet
            ? 'Secret set — enable in Payment methods if checkout fails'
            : 'Secret missing or Paystack disabled',
    },
    {
      label: 'Google Analytics',
      ok: true,
      detail: 'GA4 G-PZQ4SNSL56 (consent-gated)',
    },
  ]

  return (
    <Panel title="Integrations" description="Live readiness of email, SMS, payments, and analytics.">
      {error && <p className="mb-3 text-sm text-rose-300">{error}</p>}
      <ul className="space-y-2 text-sm">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-start justify-between gap-3 rounded-xl border border-white/10 px-3 py-2"
          >
            <span>
              <span className="font-medium text-white">{row.label}</span>
              <span className="mt-0.5 block text-xs text-slate-400">{row.detail}</span>
            </span>
            <span
              className={
                row.ok
                  ? 'shrink-0 text-xs font-semibold uppercase tracking-wide text-emerald-300'
                  : 'shrink-0 text-xs font-semibold uppercase tracking-wide text-amber-300'
              }
            >
              {ops || payReady !== null ? (row.ok ? 'Ready' : 'Check') : '…'}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-500">
        M-Pesa / PayPal remain config-only. Live chat and AI use /api/live-chat and /api/ai.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link to="/admin/email" className="text-brand-300">
          → Email Config
        </Link>
        <Link to="/admin/payments" className="text-brand-300">
          → Payment methods
        </Link>
        <Link to="/admin/leads" className="text-brand-300">
          → Leads
        </Link>
        <Link to="/admin/live-chat" className="text-brand-300">
          → Live Chat
        </Link>
      </div>
    </Panel>
  )
}

export function AdminModulePage({ module }: { module: string }) {
  if (module === 'chat-settings') return <AdminChatPage />
  if (module === 'settings' || module === 'site-controls') return <AdminSettingsPage />
  if (module === 'pages') return <AdminPagesEditor />
  if (module === 'resources') return <AdminResourcesEditor />
  if (module === 'downloads') return <AdminDownloadsEditor />
  if (module === 'careers') return <AdminCareersModule />
  if (module === 'invoices') return <AdminInvoicesModule />
  if (module === 'reports') return <AdminReportsModule />
  if (module === 'activity' || module === 'logs') return <ActivityModule />
  if (module === 'leads') return <LeadsModule />
  if (module === 'users') return <UsersModule />
  if (module === 'permissions') return <PermissionsModule />
  if (module === 'shop') return <ShopModule />
  if (module === 'visitors') return <AdminVisitorsModule />
  if (module === 'analytics') return <AnalyticsModule />

  if (module === 'online') {
    return <OnlineUsersModule />
  }
  if (module === 'reviews' || module === 'testimonials') return <ReviewsModule />
  if (module === 'newsletter') return <NewsletterModule />
  if (module === 'notifications') return <NotificationsModule />
  if (module === 'backup') return <BackupModule />
  if (module === 'faq') return <FaqModule />
  if (module === 'payments') return <AdminPaymentsModule />
  if (module === 'messages') {
    return <MessagesModule />
  }

  if (module === 'products') {
    return (
      <div className="space-y-8">
        <ProductsEditor />
        <ShopModule />
      </div>
    )
  }

  if (module === 'services') {
    return <AdminServicesModule />
  }

  if (module === 'portfolio') {
    return <PortfolioEditor />
  }

  if (module === 'clients') {
    return <ClientsCrmModule />
  }

  if (module === 'media') {
    return <SitePhotosModule />
  }

  if (module === 'social') {
    return <SiteProfileEditor mode="social" />
  }

  if (module === 'email') {
    return <SiteProfileEditor mode="email" />
  }

  if (module === 'integrations') {
    return <IntegrationsStatusModule />
  }

  if (module === 'profile') {
    return <SiteProfileEditor mode="both" />
  }

  if (module === 'design') {
    return <DesignStudioModule />
  }

  if (module === 'security') {
    return <SecurityPasswordModule />
  }

  if (module === 'god-mode') {
    return (
      <Panel
        title="Control Center"
        description="Full admin toolkit — pages, chat, users, shop, analytics, backup."
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
    <Panel title={label} description="Operational module — jump to the tools that drive the site.">
      <p className="text-sm text-slate-400">
        Use Leads for purchase requests, Live Chat for visitors, Product Pricing for packages, and
        Page Editor for content.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link to="/admin/leads" className="text-brand-300">
          → Leads
        </Link>
        <Link to="/admin/live-chat" className="text-brand-300">
          → Live Chat
        </Link>
        <Link to="/admin/shop" className="text-brand-300">
          → Product Pricing
        </Link>
        <Link to="/admin/pages" className="text-brand-300">
          → Page Editor
        </Link>
      </div>
    </Panel>
  )
}

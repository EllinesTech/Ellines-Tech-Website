import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { adminNavGroups } from '@/admin/nav'
import { products } from '@/data/products'
import { portfolioProjects } from '@/data/portfolio'
import { clientBrands } from '@/data/clients'
import { siteConfig } from '@/data/site'
import { testimonials as defaultTestimonials } from '@/data/content'
import { SocialLinks } from '@/components/engagement/SocialLinks'
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
import {
  backupCms,
  createAdminUser,
  fetchActivity,
  fetchAnalytics,
  fetchLeads,
  fetchNewsletter,
  fetchNotifications,
  fetchReviews,
  deleteMediaItem,
  fetchMediaExtras,
  fetchShop,
  fetchSiteCopy,
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
} from '@/lib/cmsApi'
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
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">{children}</div>
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
  } | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])
  const pages = Object.entries(data?.visitors?.pages || {}).sort((a, b) => b[1] - a[1])
  return (
    <Panel title={title} description="Visit counts and live chat demand.">
      <Err message={error} />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-slate-500">Total visits</p>
          <p className="mt-1 text-2xl font-bold text-white">{data?.visitors?.total ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs text-slate-500">Today</p>
          <p className="mt-1 text-2xl font-bold text-white">{data?.visitors?.today ?? '—'}</p>
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
              />
              <input
                value={r.role}
                onChange={(e) => {
                  const next = [...reviews]
                  next[idx] = { ...r, role: e.target.value }
                  setReviews(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              />
            </div>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        className="mt-4"
        onClick={async () => {
          try {
            await saveReviews(reviews)
            setMessage('Reviews saved')
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed')
          }
        }}
      >
        Save reviews
      </Button>
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
  return (
    <Panel title="Newsletter" description="Email subscribers collected from the site.">
      <Err message={error} />
      <p className="mb-3 text-sm text-slate-400">{subs.length} subscribers</p>
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
  useEffect(() => {
    fetchNotifications().then(setItems).catch(() => undefined)
  }, [])
  return (
    <Panel title="Notifications" description="System notices for the admin panel.">
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-sm text-slate-500">No notifications.</li>}
        {items.map((n) => (
          <li key={n.id} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
            <p className="text-white">{n.title}</p>
            <p className="text-slate-400">{n.body}</p>
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
              setMessage('FAQ saved')
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
    { email: string; name: string; company?: string; phone?: string; leads: number }[]
  >([])
  const [error, setError] = useState('')

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
            if (!prev.company && l.company) prev.company = l.company
            if (!prev.phone && l.phone) prev.phone = l.phone
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
        setContacts([...map.values()].sort((a, b) => b.leads - a.leads))
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  return (
    <div className="space-y-6">
      <Panel
        title="Client contacts"
        description="Unique emails from leads and purchase requests — live CRM view from cms:leads."
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
              <p className="text-xs text-slate-600">{c.leads} lead(s)</p>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Featured brand marks" description="Logos shown on the public Clients page.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {clientBrands.map((c) => (
            <li key={c.id} className="rounded-xl border border-white/10 p-3 text-sm text-white">
              {c.name}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
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
  if (module === 'users' || module === 'permissions') return <UsersModule />
  if (module === 'shop') return <ShopModule />
  if (module === 'analytics' || module === 'visitors')
    return (
      <AnalyticsModule title={module === 'visitors' ? 'Site Visitors' : 'Analytics'} />
    )
  if (module === 'online') {
    return (
      <div className="space-y-4">
        <AnalyticsModule title="Online / live demand" />
        <Link to="/admin/live-chat" className="inline-block text-sm text-brand-300">
          Open Live Chat →
        </Link>
      </div>
    )
  }
  if (module === 'reviews' || module === 'testimonials') return <ReviewsModule />
  if (module === 'newsletter') return <NewsletterModule />
  if (module === 'notifications') return <NotificationsModule />
  if (module === 'backup') return <BackupModule />
  if (module === 'faq') return <FaqModule />
  if (module === 'messages') {
    return (
      <Panel title="Messages" description="Visitor messages arrive through Live Chat.">
        <p className="text-sm text-slate-400">
          Human handoff and AI chat share one queue. Open Live Chat to reply in real time.
        </p>
        <Link to="/admin/live-chat" className="mt-3 inline-block text-sm text-brand-300">
          → Live Chat
        </Link>
      </Panel>
    )
  }

  if (module === 'products') {
    return (
      <div className="space-y-8">
        <Panel title="Flagship products" description="Marketing product pages on the live site.">
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
        <ShopModule />
      </div>
    )
  }

  if (module === 'services') {
    return <AdminServicesModule />
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
    return <ClientsCrmModule />
  }

  if (module === 'media') {
    return <SitePhotosModule />
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

  if (module === 'email' || module === 'integrations') {
    return (
      <Panel
        title={module === 'email' ? 'Email Config' : 'Integrations'}
        description="Live endpoints and channels wired into Ellines Tech."
      >
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Public email: {siteConfig.email}</li>
          <li>WhatsApp: {siteConfig.whatsapp}</li>
          <li>Service requests: /request → Leads inbox</li>
          <li>CMS API: /api/cms</li>
          <li>Live chat API: /api/live-chat</li>
          <li>AI assist API: /api/ai</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/admin/leads" className="text-brand-300">
            → Leads
          </Link>
          <Link to="/admin/live-chat" className="text-brand-300">
            → Live Chat
          </Link>
          <Link to="/request" className="text-brand-300">
            → Public request flow
          </Link>
        </div>
      </Panel>
    )
  }

  if (module === 'design') {
    return (
      <Panel title="Design Studio" description="Brand system and content surfaces you can edit live.">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Fonts: Outfit (display) + DM Sans (body)</li>
          <li>Accent: cyan brand scale on deep slate</li>
          <li>Edit Home/About copy → Page Editor</li>
          <li>Edit packages → Product Pricing</li>
          <li>Banners & scenes → Site Photos</li>
        </ul>
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
        </div>
      </Panel>
    )
  }

  if (module === 'security') {
    return (
      <Panel title="Security" description="Three separate access lanes — do not mix them.">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Admin panel — owner password (`EllinesGodMode2026` default). Override with matching
            `VITE_ADMIN_PASSWORD` (frontend build) and `ADMIN_API_KEY` (Pages Functions). Keep private.
          </li>
          <li>
            Staff (/staff) — employee accounts created here under Users. Own login.
          </li>
          <li>
            Clients (/account) — customers for pricing & packages. Public register/login.
          </li>
          <li>Roles: super_admin | admin | staff | customer · passwords PBKDF2-hashed in KV</li>
          <li>Rotate secrets in Cloudflare Pages environment variables</li>
        </ul>
        <Link to="/admin/users" className="mt-4 inline-block text-sm text-brand-300">
          → Users & roles
        </Link>
      </Panel>
    )
  }

  if (module === 'profile') {
    return (
      <Panel title="Profile" description="Signed-in admin session.">
        <p className="text-sm text-slate-300">Role: Admin</p>
        <p className="mt-2 text-sm text-slate-400">
          Staff employees use /staff with their own accounts. Clients use /account for pricing &
          packages.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
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

import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { adminNavGroups } from '@/admin/nav'
import { products } from '@/data/products'
import { services } from '@/data/services'
import { portfolioProjects } from '@/data/portfolio'
import { clientBrands } from '@/data/clients'
import { siteConfig } from '@/data/site'
import { testimonials as defaultTestimonials } from '@/data/content'
import { SocialLinks } from '@/components/engagement/SocialLinks'
import { Button } from '@/components/ui/Button'
import { AdminChatPage } from '@/pages/admin/AdminChatPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { AdminPagesEditor } from '@/pages/admin/AdminPagesEditor'
import {
  backupCms,
  createAdminUser,
  fetchActivity,
  fetchAnalytics,
  fetchLeads,
  fetchNewsletter,
  fetchNotifications,
  fetchReviews,
  fetchShop,
  fetchSiteCopy,
  fetchUsers,
  restoreCms,
  saveReviews,
  saveShop,
  saveSiteCopy,
  updateUserRole,
  type CmsUser,
} from '@/lib/cmsApi'
import { starterPricingPackages } from '@/data/pricingPackages'

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
  description: string
  status: string
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
    { id: string; name: string; email: string; phone?: string; message?: string; at: string }[]
  >([])
  const [error, setError] = useState('')
  useEffect(() => {
    fetchLeads()
      .then(setLeads)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])
  return (
    <Panel title="Leads" description="Inquiries captured from the contact form and website.">
      <Err message={error} />
      <ul className="space-y-3">
        {leads.length === 0 && <li className="text-sm text-slate-500">No leads yet.</li>}
        {leads.map((l) => (
          <li key={l.id} className="rounded-xl border border-white/10 p-3 text-sm">
            <p className="font-medium text-white">
              {l.name || 'Anonymous'} · {l.email}
            </p>
            {l.phone && <p className="text-slate-400">{l.phone}</p>}
            {l.message && <p className="mt-1 text-slate-300">{l.message}</p>}
            <p className="mt-1 text-xs text-slate-500">{new Date(l.at).toLocaleString()}</p>
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
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin')
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
      description="Admin and customer accounts. Customers can register on /account for the shop."
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
        />
        <input
          placeholder="Password (6+)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'super_admin')}
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
        >
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <Button
          type="button"
          onClick={async () => {
            try {
              await createAdminUser({ email, password, name, role })
              setMessage('Admin user created')
              setEmail('')
              setPassword('')
              setName('')
              await load()
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed')
            }
          }}
        >
          Create admin
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
              <p className="text-xs text-slate-500">{u.role}</p>
            </div>
            <select
              value={u.role}
              onChange={async (e) => {
                await updateUserRole(u.id, e.target.value as CmsUser['role'])
                await load()
              }}
              className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
            >
              <option value="customer">customer</option>
              <option value="admin">admin</option>
              <option value="super_admin">super_admin</option>
            </select>
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
      description="Add, edit, publish, or remove packages shown on /pricing. Changes save to the live site."
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
            <div className="grid gap-2 sm:grid-cols-4">
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
    <Panel title="Notifications" description="System notices for Super Admin.">
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

export function AdminModulePage({ module }: { module: string }) {
  if (module === 'chat-settings') return <AdminChatPage />
  if (module === 'settings' || module === 'site-controls') return <AdminSettingsPage />
  if (module === 'pages') return <AdminPagesEditor />
  if (module === 'activity' || module === 'logs') return <ActivityModule />
  if (module === 'leads') return <LeadsModule />
  if (module === 'users' || module === 'permissions') return <UsersModule />
  if (module === 'shop') return <ShopModule />
  if (module === 'analytics' || module === 'reports' || module === 'visitors')
    return <AnalyticsModule title={module === 'visitors' ? 'Site Visitors' : module === 'reports' ? 'Reports' : 'Analytics'} />
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
        <p className="mt-4 text-sm text-slate-400">
          To publish custom landing pages for campaigns, use{' '}
          <Link to="/admin/pages" className="text-brand-300">
            Page Editor
          </Link>
          .
        </p>
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

  if (module === 'media') {
    const banners = Object.entries(siteConfig.media.banners)
    const scenes = Object.entries(siteConfig.media.scenes)
    return (
      <Panel title="Site Photos" description="Banner and scene assets currently on the site.">
        <p className="mb-3 text-sm text-slate-400">Banners</p>
        <ul className="mb-6 grid gap-2 sm:grid-cols-2">
          {banners.map(([key, src]) => (
            <li key={key} className="overflow-hidden rounded-xl border border-white/10">
              <img src={src} alt={key} className="h-28 w-full object-cover" />
              <p className="px-2 py-1 text-xs text-slate-400">
                {key}: {src}
              </p>
            </li>
          ))}
        </ul>
        <p className="mb-3 text-sm text-slate-400">Scenes</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {scenes.map(([key, src]) => (
            <li key={key} className="overflow-hidden rounded-xl border border-white/10">
              <img src={src} alt={key} className="h-28 w-full object-cover" />
              <p className="px-2 py-1 text-xs text-slate-400">
                {key}: {src}
              </p>
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

  if (module === 'resources') {
    return (
      <Panel title="Resources" description="Public resources hub and custom CMS pages.">
        <Link to="/resources" className="text-sm text-brand-300">
          Open /resources →
        </Link>
        <p className="mt-3 text-sm text-slate-400">
          Add articles or landing pages via{' '}
          <Link to="/admin/pages" className="text-brand-300">
            Page Editor
          </Link>
          .
        </p>
      </Panel>
    )
  }

  if (module === 'email' || module === 'integrations') {
    return (
      <Panel
        title={module === 'email' ? 'Email Config' : 'Integrations'}
        description="Contact and messaging endpoints used by the site."
      >
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Public email: {siteConfig.email}</li>
          <li>WhatsApp: {siteConfig.whatsapp}</li>
          <li>CMS API: /api/cms</li>
          <li>Live chat API: /api/live-chat</li>
          <li>AI assist API: /api/ai</li>
        </ul>
      </Panel>
    )
  }

  if (module === 'design') {
    return (
      <Panel title="Design Studio" description="Brand tokens and visual system references.">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Brand cyan / sky on deep slate surfaces</li>
          <li>Display + body type from site CSS variables</li>
          <li>Edit Home/About copy in Page Editor → Home & About copy</li>
        </ul>
        <Link to="/admin/pages" className="mt-3 inline-block text-sm text-brand-300">
          → Page Editor
        </Link>
      </Panel>
    )
  }

  if (module === 'security') {
    return (
      <Panel title="Security" description="Admin access and session notes.">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>Super Admin login uses ADMIN_API_KEY / VITE_ADMIN_PASSWORD</li>
          <li>Customer passwords are PBKDF2-hashed in KV</li>
          <li>Rotate the admin key in Cloudflare Pages environment variables</li>
          <li>Do not share God Mode credentials publicly</li>
        </ul>
      </Panel>
    )
  }

  if (module === 'profile') {
    return (
      <Panel title="Profile" description="Signed-in Super Admin session.">
        <p className="text-sm text-slate-300">Role: Super Admin (God Mode)</p>
        <p className="mt-2 text-sm text-slate-400">
          Manage staff under Users. Customer shop accounts register at /account.
        </p>
      </Panel>
    )
  }

  if (module === 'god-mode') {
    return (
      <Panel
        title="God Mode"
        description="Full Super Admin toolkit — pages, chat, users, shop, analytics, backup."
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
    <Panel title={label} description="Module loaded.">
      <p className="text-sm text-slate-400">Use Page Editor, Live Chat, Users, and Shop for day-to-day ops.</p>
    </Panel>
  )
}

import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useSiteProfile } from '@/context/SiteProfileContext'
import {
  fetchCmsProducts,
  fetchPortfolio,
  fetchPresence,
  fetchSiteProfile,
  savePortfolio,
  saveProducts,
  saveSiteProfile,
  type CmsPortfolioProject,
  type CmsProduct,
  type PresenceEntry,
  type SiteProfile,
} from '@/lib/cmsApi'
import { MaskedIpNotice, VisitorChips } from '@/components/admin/VisitorContext'
import { productCategories } from '@/data/products'
import { portfolioCategories } from '@/data/portfolio'

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

export function ProductsEditor() {
  const [items, setItems] = useState<CmsProduct[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const categories = Object.keys(productCategories)

  useEffect(() => {
    fetchCmsProducts(false)
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  return (
    <div className="space-y-6">
      <Panel
        title="Flagship products"
        description="Marketing product pages on /products. Edits persist to KV and update the live site."
      >
        <Err message={error} />
        <Msg message={message} />
        <ul className="space-y-3">
          {items.map((p, idx) => (
            <li key={p.id || p.slug} className="space-y-2 rounded-xl border border-white/10 p-3">
              <div className="flex flex-wrap gap-2">
                <input
                  value={p.name}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...p, name: e.target.value }
                    setItems(next)
                  }}
                  className="min-w-[10rem] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                />
                <select
                  value={p.status}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...p, status: e.target.value as 'published' | 'draft' }
                    setItems(next)
                  }}
                  className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
                >
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                </select>
                <button
                  type="button"
                  className="text-xs text-rose-300"
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <input
                  value={p.slug}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...p, slug: e.target.value }
                    setItems(next)
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="slug"
                />
                <select
                  value={p.category}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...p, category: e.target.value }
                    setItems(next)
                  }}
                  className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  value={p.tagline}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...p, tagline: e.target.value }
                    setItems(next)
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="Tagline"
                />
              </div>
              <textarea
                value={p.description}
                rows={2}
                onChange={(e) => {
                  const next = [...items]
                  next[idx] = { ...p, description: e.target.value }
                  setItems(next)
                }}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              />
              <textarea
                value={(p.features || []).join('\n')}
                rows={3}
                onChange={(e) => {
                  const next = [...items]
                  next[idx] = {
                    ...p,
                    features: e.target.value
                      .split('\n')
                      .map((f) => f.trim())
                      .filter(Boolean),
                  }
                  setItems(next)
                }}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="Features (one per line)"
              />
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setItems((list) => [
                ...list,
                {
                  id: `prod_${Date.now().toString(36)}`,
                  slug: `new-product-${list.length + 1}`,
                  name: 'New product',
                  category: 'digital',
                  tagline: '',
                  description: '',
                  features: [],
                  status: 'draft',
                },
              ])
            }
          >
            Add product
          </Button>
          <Button
            type="button"
            onClick={async () => {
              try {
                await saveProducts(items)
                setMessage('Products saved — live on site')
                setError('')
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Save failed')
              }
            }}
          >
            Save products
          </Button>
          <Link to="/admin/shop" className="self-center text-sm text-brand-300">
            → Product Pricing (buyable tiers)
          </Link>
        </div>
      </Panel>
    </div>
  )
}

export function PortfolioEditor() {
  const [items, setItems] = useState<CmsPortfolioProject[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const categories = Object.keys(portfolioCategories)

  useEffect(() => {
    fetchPortfolio(false)
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  return (
    <Panel title="Portfolio" description="Projects shown on /portfolio. Saves persist to KV.">
      <Err message={error} />
      <Msg message={message} />
      <ul className="space-y-3">
        {items.map((p, idx) => (
          <li key={p.id || p.slug} className="space-y-2 rounded-xl border border-white/10 p-3">
            <div className="flex flex-wrap gap-2">
              <input
                value={p.name}
                onChange={(e) => {
                  const next = [...items]
                  next[idx] = { ...p, name: e.target.value }
                  setItems(next)
                }}
                className="min-w-[10rem] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              />
              <select
                value={p.status}
                onChange={(e) => {
                  const next = [...items]
                  next[idx] = { ...p, status: e.target.value as 'published' | 'draft' }
                  setItems(next)
                }}
                className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
              <button
                type="button"
                className="text-xs text-rose-300"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                value={p.slug}
                onChange={(e) => {
                  const next = [...items]
                  next[idx] = { ...p, slug: e.target.value }
                  setItems(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="slug"
              />
              <select
                value={p.category}
                onChange={(e) => {
                  const next = [...items]
                  next[idx] = { ...p, category: e.target.value }
                  setItems(next)
                }}
                className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                value={p.client || ''}
                onChange={(e) => {
                  const next = [...items]
                  next[idx] = { ...p, client: e.target.value }
                  setItems(next)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                placeholder="Client"
              />
            </div>
            <textarea
              value={p.description}
              rows={2}
              onChange={(e) => {
                const next = [...items]
                next[idx] = { ...p, description: e.target.value }
                setItems(next)
              }}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
            />
            <input
              value={(p.technologies || []).join(', ')}
              onChange={(e) => {
                const next = [...items]
                next[idx] = {
                  ...p,
                  technologies: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                }
                setItems(next)
              }}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              placeholder="Technologies (comma-separated)"
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            setItems((list) => [
              ...list,
              {
                id: `pf_${Date.now().toString(36)}`,
                slug: `project-${list.length + 1}`,
                name: 'New project',
                category: 'web',
                description: '',
                technologies: [],
                status: 'draft',
              },
            ])
          }
        >
          Add project
        </Button>
        <Button
          type="button"
          onClick={async () => {
            try {
              await savePortfolio(items)
              setMessage('Portfolio saved — live on site')
              setError('')
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Save failed')
            }
          }}
        >
          Save portfolio
        </Button>
      </div>
    </Panel>
  )
}

export function SiteProfileEditor({ mode }: { mode: 'social' | 'email' | 'both' }) {
  const { refresh } = useSiteProfile()
  const [profile, setProfile] = useState<SiteProfile | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSiteProfile()
      .then(setProfile)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  if (!profile) {
    return (
      <Panel title={mode === 'email' ? 'Email Config' : 'Social Media'} description="Loading…">
        <Err message={error} />
      </Panel>
    )
  }

  return (
    <Panel
      title={
        mode === 'email' ? 'Email & contact' : mode === 'social' ? 'Social Media' : 'Site profile'
      }
      description="Public contact details and social handles. Saves to KV and power footer, chat, and contact surfaces."
    >
      <Err message={error} />
      <Msg message={message} />
      {(mode === 'email' || mode === 'both') && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {(
            [
              ['email', 'Public email'],
              ['phone', 'Phone'],
              ['whatsapp', 'WhatsApp (digits / +)'],
              ['address', 'Address line (Nyeri & Nairobi)'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-xs text-slate-400">
              {label}
              <input
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
              />
            </label>
          ))}
        </div>
      )}
      {(mode === 'social' || mode === 'both') && (
        <>
          <ul className="space-y-3">
            {profile.socialLinks.map((s, idx) => (
              <li key={s.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-4">
                <input
                  value={s.label}
                  onChange={(e) => {
                    const socialLinks = [...profile.socialLinks]
                    socialLinks[idx] = { ...s, label: e.target.value }
                    setProfile({ ...profile, socialLinks })
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="Label"
                />
                <input
                  value={s.handle}
                  onChange={(e) => {
                    const socialLinks = [...profile.socialLinks]
                    socialLinks[idx] = { ...s, handle: e.target.value }
                    setProfile({ ...profile, socialLinks })
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="Handle"
                />
                <input
                  value={s.href}
                  onChange={(e) => {
                    const socialLinks = [...profile.socialLinks]
                    socialLinks[idx] = { ...s, href: e.target.value }
                    setProfile({ ...profile, socialLinks })
                  }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white sm:col-span-1"
                  placeholder="https://"
                />
                <button
                  type="button"
                  className="text-xs text-rose-300 sm:justify-self-end"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      socialLinks: profile.socialLinks.filter((_, i) => i !== idx),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={() =>
              setProfile({
                ...profile,
                socialLinks: [
                  ...profile.socialLinks,
                  {
                    id: `social_${Date.now().toString(36)}`,
                    label: 'New network',
                    handle: '',
                    href: 'https://',
                  },
                ],
              })
            }
          >
            Add social link
          </Button>
        </>
      )}
      <Button
        type="button"
        className="mt-4"
        onClick={async () => {
          try {
            const res = await saveSiteProfile(profile)
            setProfile((res.profile as SiteProfile) || profile)
            await refresh()
            setMessage('Saved — live across the site')
            setError('')
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed')
          }
        }}
      >
        Save profile
      </Button>
    </Panel>
  )
}

export function OnlineUsersModule() {
  const [online, setOnline] = useState<PresenceEntry[]>([])
  const [canSeeIp, setCanSeeIp] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    try {
      const data = await fetchPresence()
      setOnline(data.online)
      setCanSeeIp(data.canSeeIp)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 10000)
    return () => clearInterval(t)
  }, [])

  return (
    <Panel
      title="Online Users"
      description="Visitors active in the last 5 minutes, with network and device context (consent-based visit tracking)."
    >
      <Err message={error} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-400">{online.length} online now</p>
        <MaskedIpNotice canSeeIp={canSeeIp} />
      </div>
      <ul className="space-y-2">
        {online.length === 0 && (
          <li className="text-sm text-slate-500">No active visitors right now.</li>
        )}
        {online.map((p) => (
          <li key={p.sessionId} className="rounded-xl border border-white/10 px-3 py-2.5 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="truncate font-medium text-white">{p.path}</span>
              <span className="text-xs text-slate-500">{new Date(p.at).toLocaleTimeString()}</span>
            </div>
            <div className="mt-1.5">
              <VisitorChips visitor={p.visitor} location={p.location} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link to="/admin/visitors" className="text-brand-300">
          Visitor intelligence →
        </Link>
        <Link to="/admin/live-chat" className="text-brand-300">
          Open Live Chat →
        </Link>
      </div>
    </Panel>
  )
}

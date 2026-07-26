import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { saveServices, type CmsService } from '@/lib/cmsApi'
import {
  loadAdminServices,
  staticServicesAsCatalog,
  type CatalogService,
} from '@/lib/servicesCatalog'
import { serviceCategories, type ServiceCategory } from '@/data/services'

const categoryKeys = Object.keys(serviceCategories) as ServiceCategory[]

function emptyService(): CatalogService {
  const stamp = Date.now().toString(36)
  return {
    id: `svc_${stamp}`,
    slug: `new-service-${stamp}`,
    name: 'New service',
    category: 'consulting',
    description: '',
    offerings: [],
    image: '',
    startingPrice: null,
    pricingGroupId: '',
    status: 'draft',
  }
}

export function AdminServicesModule() {
  const [items, setItems] = useState<CatalogService[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    loadAdminServices()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load services'))
  }, [])

  async function persist(next: CatalogService[], ok: string) {
    try {
      const payload: CmsService[] = next.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        category: s.category,
        description: s.description,
        offerings: s.offerings,
        image: s.image || '',
        startingPrice: s.startingPrice ?? null,
        pricingGroupId: s.pricingGroupId || '',
        status: s.status,
      }))
      await saveServices(payload)
      setItems(next)
      setMessage(ok)
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const visible = items.filter((s) => {
    if (!filter.trim()) return true
    const q = filter.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Services catalogue</h2>
        <p className="mt-1 text-sm text-slate-400">
          Create, edit, unpublish, and attach photos. Changes save to CMS KV and power /services.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        {error ? <p className="mb-3 text-sm text-amber-200">{error}</p> : null}
        {message ? <p className="mb-3 text-sm text-emerald-300">{message}</p> : null}

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, slug, category…"
            className="min-w-[14rem] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setItems((list) => [emptyService(), ...list])}
          >
            Add service
          </Button>
          <Button type="button" onClick={() => void persist(items, 'Services saved — live on /services')}>
            Save all
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setItems(staticServicesAsCatalog())
              setMessage('Reset to code defaults (not saved yet)')
            }}
          >
            Reset to defaults
          </Button>
          <Link to="/services" className="self-center text-sm text-brand-300">
            View /services →
          </Link>
        </div>

        <ul className="space-y-4">
          {visible.map((s) => {
            const idx = items.findIndex((x) => x.id === s.id)
            if (idx < 0) return null
            return (
              <li key={s.id} className="space-y-3 rounded-xl border border-white/10 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={s.name}
                    onChange={(e) => {
                      const next = [...items]
                      next[idx] = { ...s, name: e.target.value }
                      setItems(next)
                    }}
                    className="min-w-[12rem] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                    placeholder="Service name"
                  />
                  <select
                    value={s.status}
                    onChange={(e) => {
                      const next = [...items]
                      next[idx] = {
                        ...s,
                        status: e.target.value === 'draft' ? 'draft' : 'published',
                      }
                      setItems(next)
                    }}
                    className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
                  >
                    <option value="published">published</option>
                    <option value="draft">draft / unpublished</option>
                  </select>
                  <button
                    type="button"
                    className="text-xs text-rose-300"
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-[10px] uppercase tracking-wide text-slate-500">
                    Slug
                    <input
                      value={s.slug}
                      onChange={(e) => {
                        const next = [...items]
                        next[idx] = {
                          ...s,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, '-')
                            .replace(/-+/g, '-'),
                        }
                        setItems(next)
                      }}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                    />
                  </label>
                  <label className="text-[10px] uppercase tracking-wide text-slate-500">
                    Category
                    <select
                      value={s.category}
                      onChange={(e) => {
                        const next = [...items]
                        next[idx] = { ...s, category: e.target.value as ServiceCategory }
                        setItems(next)
                      }}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white"
                    >
                      {categoryKeys.map((key) => (
                        <option key={key} value={key}>
                          {serviceCategories[key].label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[10px] uppercase tracking-wide text-slate-500">
                    Starting price (KES)
                    <input
                      type="number"
                      value={s.startingPrice ?? ''}
                      onChange={(e) => {
                        const next = [...items]
                        next[idx] = {
                          ...s,
                          startingPrice: e.target.value === '' ? null : Number(e.target.value),
                        }
                        setItems(next)
                      }}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                      placeholder="Optional"
                    />
                  </label>
                  <label className="text-[10px] uppercase tracking-wide text-slate-500">
                    Pricing group id
                    <input
                      value={s.pricingGroupId || ''}
                      onChange={(e) => {
                        const next = [...items]
                        next[idx] = { ...s, pricingGroupId: e.target.value }
                        setItems(next)
                      }}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                      placeholder="Matches shop groupId"
                    />
                  </label>
                </div>

                <textarea
                  value={s.description}
                  onChange={(e) => {
                    const next = [...items]
                    next[idx] = { ...s, description: e.target.value }
                    setItems(next)
                  }}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  placeholder="Short description"
                />

                <label className="block text-[10px] uppercase tracking-wide text-slate-500">
                  Offerings (one per line)
                  <textarea
                    value={s.offerings.join('\n')}
                    onChange={(e) => {
                      const next = [...items]
                      next[idx] = {
                        ...s,
                        offerings: e.target.value
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean),
                      }
                      setItems(next)
                    }}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
                  />
                </label>

                <MediaPicker
                  value={s.image || ''}
                  onChange={(url) => {
                    const next = [...items]
                    next[idx] = { ...s, image: url }
                    setItems(next)
                  }}
                  label="Service photo / poster"
                />

                <Link to={`/services/${s.slug}`} className="inline-block text-xs text-brand-300">
                  Preview →
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

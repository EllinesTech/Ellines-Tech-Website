import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  deletePage,
  ensurePage,
  fetchPages,
  fetchSiteCopy,
  savePage,
  saveSiteCopy,
  type CmsPage,
} from '@/lib/cmsApi'
import { clearRoutePagesCache } from '@/lib/routePages'
import {
  normalizeRoutePath,
  sitePageGroups,
  sitePages,
  slugForRoutePath,
  type SitePageEntry,
} from '@/data/sitePages'

type PageDraft = Partial<CmsPage>

const emptyPage = (): PageDraft => ({
  title: '',
  slug: '',
  path: '',
  mode: 'append',
  excerpt: '',
  body: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
})

function statusLabel(page: CmsPage | undefined) {
  if (!page) return 'No CMS record'
  return page.status === 'published' ? 'Published' : 'Draft'
}

function statusClass(page: CmsPage | undefined) {
  if (!page) return 'bg-white/5 text-slate-400'
  return page.status === 'published'
    ? 'bg-emerald-500/15 text-emerald-300'
    : 'bg-amber-500/15 text-amber-200'
}

export function AdminPagesEditor() {
  const [pages, setPages] = useState<CmsPage[]>([])
  const [draft, setDraft] = useState<PageDraft | null>(null)
  const [siteCopy, setSiteCopy] = useState<Record<string, unknown>>({})
  const [tab, setTab] = useState<'site' | 'custom' | 'core'>('site')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    try {
      setPages(await fetchPages())
      setSiteCopy(await fetchSiteCopy())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load CMS')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const byPath = useMemo(() => {
    const map = new Map<string, CmsPage>()
    for (const page of pages) {
      const path = normalizeRoutePath(page.path)
      if (path) map.set(path, page)
    }
    return map
  }, [pages])

  const customPages = useMemo(
    () => pages.filter((p) => !normalizeRoutePath(p.path)),
    [pages],
  )

  const filteredSitePages = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sitePages
    return sitePages.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [query])

  const routeDraft = draft ? Boolean(normalizeRoutePath(draft.path)) : false

  function openExisting(page: CmsPage) {
    setDraft({ ...page })
    setMessage('')
    setError('')
  }

  /** Creates the draft record on first open so a route with no CMS entry is editable. */
  async function openSitePage(entry: SitePageEntry) {
    const existing = byPath.get(entry.path)
    if (existing) {
      openExisting(existing)
      return
    }
    setBusy(true)
    try {
      const { page, created } = await ensurePage({
        path: entry.path,
        slug: slugForRoutePath(entry.path),
        title: entry.label,
        excerpt: entry.description,
        mode: 'append',
      })
      await load()
      setDraft({ ...page })
      setMessage(
        created
          ? `Draft created for ${entry.path} — add content and publish when ready.`
          : `Editing ${entry.path}`,
      )
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this page for editing')
    } finally {
      setBusy(false)
    }
  }

  function newCustomPage() {
    setDraft(emptyPage())
    setTab('custom')
    setMessage('')
    setError('')
  }

  async function onSavePage() {
    if (!draft) return
    if (!draft.title?.trim()) {
      setError('Title is required')
      return
    }
    if (!draft.slug?.trim() && !normalizeRoutePath(draft.path)) {
      setError('Give the page a slug or attach it to a site route')
      return
    }
    setBusy(true)
    try {
      const res = await savePage(draft)
      clearRoutePagesCache()
      setDraft({ ...res.page })
      setMessage(
        res.page.path
          ? `Saved ${res.page.path} (${res.page.status})`
          : `Saved /p/${res.page.slug} (${res.page.status})`,
      )
      setError('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  async function onDeletePage(page: CmsPage) {
    setBusy(true)
    try {
      await deletePage(page.id, page.slug)
      clearRoutePagesCache()
      if (draft?.id === page.id) setDraft(null)
      setMessage(`Deleted ${page.path || `/p/${page.slug}`}`)
      setError('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  async function onSaveCore() {
    try {
      await saveSiteCopy(siteCopy)
      setMessage('Core page copy saved')
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  function field(key: keyof CmsPage, label: string, placeholder = '') {
    return (
      <label key={key} className="block text-xs text-slate-400">
        {label}
        <input
          value={(draft?.[key] as string) || ''}
          placeholder={placeholder}
          onChange={(e) => {
            const value = e.target.value
            setDraft((d) => {
              if (!d) return d
              const autoSlug =
                key === 'title' && !d.id && !d.slug && !normalizeRoutePath(d.path)
                  ? {
                      slug: value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, ''),
                    }
                  : {}
              return { ...d, [key]: value, ...autoSlug }
            })
          }}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
        />
      </label>
    )
  }

  const editor = draft ? (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white">
            {draft.id ? 'Edit page' : 'New custom page'}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {routeDraft
              ? `Site route ${draft.path} · also readable at /p/${draft.slug}`
              : draft.slug
                ? `/p/${draft.slug}`
                : 'Give it a title to generate the slug'}
          </p>
        </div>
        <button
          type="button"
          className="text-xs text-slate-400 hover:text-white"
          onClick={() => setDraft(null)}
        >
          Close
        </button>
      </div>

      {field('title', 'Title')}
      {!routeDraft && field('slug', 'Slug (url path)', 'about-our-process')}
      {field('excerpt', 'Short excerpt')}
      {field('seoTitle', 'SEO title')}
      {field('seoDescription', 'SEO description')}

      {routeDraft && (
        <label className="block text-xs text-slate-400">
          How this content renders on {draft.path}
          <select
            value={draft.mode === 'replace' ? 'replace' : 'append'}
            onChange={(e) =>
              setDraft((d) => (d ? { ...d, mode: e.target.value as CmsPage['mode'] } : d))
            }
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option value="append">Add a section below the built-in page</option>
            <option value="replace">Replace the built-in page entirely</option>
          </select>
        </label>
      )}

      <label className="block text-xs text-slate-400">
        Body content
        <textarea
          value={draft.body || ''}
          onChange={(e) => setDraft((d) => (d ? { ...d, body: e.target.value } : d))}
          rows={10}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
          placeholder="Write page content. Use blank lines between paragraphs."
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={draft.status === 'published'}
          onChange={(e) =>
            setDraft((d) =>
              d ? { ...d, status: e.target.checked ? 'published' : 'draft' } : d,
            )
          }
        />
        Published (live on site)
      </label>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => void onSavePage()} disabled={busy} icon>
          Save page
        </Button>
        {draft.id && (
          <Link
            to={routeDraft ? (draft.path as string) : `/p/${draft.slug}`}
            className="self-center text-sm text-brand-300"
          >
            {draft.status === 'published' ? 'View live →' : 'Preview draft →'}
          </Link>
        )}
        {draft.id && (
          <button
            type="button"
            className="self-center text-sm text-rose-300"
            disabled={busy}
            onClick={() => void onDeletePage(draft as CmsPage)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
      Pick a page on the left to edit it, or create a new custom page. Site routes with no CMS
      record are created as a draft the moment you open them.
      <div className="mt-4">
        <Button type="button" variant="secondary" onClick={newCustomPage}>
          New custom page
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Page Editor</h2>
          <p className="mt-1 text-sm text-slate-400">
            Edit every site route — including pages that have no CMS record yet — plus custom
            pages at /p/:slug and core Home / About / Contact / Solutions copy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['site', 'Site pages'],
              ['custom', 'Custom pages'],
              ['core', 'Home, About, Contact & Solutions'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tab === key ? 'bg-brand-500/20 text-brand-200' : 'text-slate-400'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {message && <p className="text-sm text-emerald-300">{message}</p>}
      {error && <p className="text-sm text-amber-200">{error}</p>}

      {tab === 'site' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-white">All site pages</h3>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages…"
                className="w-44 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-white outline-none focus:border-brand-400/40"
              />
            </div>
            {sitePageGroups.map((group) => {
              const rows = filteredSitePages.filter((p) => p.group === group)
              if (rows.length === 0) return null
              return (
                <div key={group}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {group}
                  </p>
                  <ul className="space-y-2">
                    {rows.map((entry) => {
                      const record = byPath.get(entry.path)
                      return (
                        <li
                          key={entry.path}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-white">{entry.label}</p>
                            <p className="truncate text-xs text-slate-500">
                              {entry.path}
                              {entry.coreCopySection ? ' · core copy available' : ''}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2 text-xs">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass(record)}`}
                            >
                              {statusLabel(record)}
                            </span>
                            <button
                              type="button"
                              className="text-brand-300 disabled:opacity-50"
                              disabled={busy}
                              onClick={() => void openSitePage(entry)}
                            >
                              {record ? 'Edit' : 'Add content'}
                            </button>
                            <Link
                              to={entry.path}
                              className="text-slate-400 hover:text-white"
                            >
                              View
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
          {editor}
        </div>
      )}

      {tab === 'custom' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-white">Custom pages (/p/:slug)</h3>
              <Button type="button" size="sm" variant="secondary" onClick={newCustomPage}>
                New page
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {customPages.length === 0 && (
                <li className="text-sm text-slate-500">No custom pages yet — create one.</li>
              )}
              {customPages.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white">{p.title}</p>
                    <p className="truncate text-xs text-slate-500">/p/{p.slug}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass(p)}`}
                    >
                      {statusLabel(p)}
                    </span>
                    <button
                      type="button"
                      className="text-brand-300"
                      onClick={() => openExisting(p)}
                    >
                      Edit
                    </button>
                    <Link to={`/p/${p.slug}`} className="text-slate-400 hover:text-white">
                      View
                    </Link>
                    <button
                      type="button"
                      className="text-rose-300 disabled:opacity-50"
                      disabled={busy}
                      onClick={() => void onDeletePage(p)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {editor}
        </div>
      )}

      {tab === 'core' && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">Core website copy</h3>
          <p className="text-sm text-slate-400">
            These fields override Home and About messaging when set.
          </p>
          {(['home', 'about', 'contact', 'solutions'] as const).map((section) => {
            const block = (siteCopy[section] as Record<string, string>) || {}
            const fields =
              section === 'home'
                ? ['heroHeadline', 'heroSub', 'storyTitle', 'storyBody', 'groupTitle', 'groupBody']
                : section === 'about'
                  ? ['title', 'lead', 'groupTitle', 'groupBody']
                  : section === 'contact'
                    ? ['title', 'lead', 'formNote']
                    : ['title', 'lead']
            return (
              <div key={section} className="rounded-xl border border-white/10 p-4">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-300">
                  {section}
                </p>
                {fields.map((f) => (
                  <label key={f} className="mb-3 block text-xs text-slate-400">
                    {f}
                    <textarea
                      value={block[f] || ''}
                      rows={f.toLowerCase().includes('body') || f === 'lead' ? 3 : 2}
                      onChange={(e) =>
                        setSiteCopy((prev) => ({
                          ...prev,
                          [section]: { ...block, [f]: e.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
                    />
                  </label>
                ))}
              </div>
            )
          })}
          <Button type="button" onClick={() => void onSaveCore()} icon>
            Save core copy
          </Button>
        </div>
      )}
    </div>
  )
}

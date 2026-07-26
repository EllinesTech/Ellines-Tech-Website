import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  deletePage,
  fetchPages,
  fetchSiteCopy,
  savePage,
  saveSiteCopy,
  type CmsPage,
} from '@/lib/cmsApi'

const emptyPage = (): Partial<CmsPage> => ({
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
})

export function AdminPagesEditor() {
  const [pages, setPages] = useState<CmsPage[]>([])
  const [draft, setDraft] = useState<Partial<CmsPage>>(emptyPage())
  const [siteCopy, setSiteCopy] = useState<Record<string, unknown>>({})
  const [tab, setTab] = useState<'pages' | 'core'>('pages')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
    load()
  }, [])

  async function onSavePage() {
    try {
      const res = await savePage(draft)
      setMessage(`Saved /p/${res.page.slug}`)
      setDraft(emptyPage())
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function onSaveCore() {
    try {
      await saveSiteCopy(siteCopy)
      setMessage('Core page copy saved')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Page Editor</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create custom pages at /p/:slug, publish them live, and edit core Home / About / Contact /
            Solutions copy.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab('pages')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tab === 'pages' ? 'bg-brand-500/20 text-brand-200' : 'text-slate-400'}`}
          >
            Custom pages
          </button>
          <button
            type="button"
            onClick={() => setTab('core')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tab === 'core' ? 'bg-brand-500/20 text-brand-200' : 'text-slate-400'}`}
          >
            Home, About, Contact & Solutions
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-emerald-300">{message}</p>}
      {error && <p className="text-sm text-amber-200">{error}</p>}

      {tab === 'pages' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white">
              {draft.id ? 'Edit page' : 'Add new page'}
            </h3>
            {(
              [
                ['title', 'Title'],
                ['slug', 'Slug (url path)'],
                ['excerpt', 'Short excerpt'],
                ['seoTitle', 'SEO title'],
                ['seoDescription', 'SEO description'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-xs text-slate-400">
                {label}
                <input
                  value={(draft[key] as string) || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setDraft((d) => ({
                      ...d,
                      [key]: value,
                      ...(key === 'title' && !d.id && !d.slug
                        ? {
                            slug: value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-|-$/g, ''),
                          }
                        : {}),
                    }))
                  }}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
                />
              </label>
            ))}
            <label className="block text-xs text-slate-400">
              Body content
              <textarea
                value={draft.body || ''}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
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
                  setDraft((d) => ({
                    ...d,
                    status: e.target.checked ? 'published' : 'draft',
                  }))
                }
              />
              Published (live on site)
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={onSavePage} icon>
                Save page
              </Button>
              <Button type="button" variant="secondary" onClick={() => setDraft(emptyPage())}>
                Clear
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white">All pages</h3>
            <ul className="mt-4 space-y-2">
              {pages.length === 0 && (
                <li className="text-sm text-slate-500">No custom pages yet — create one.</li>
              )}
              {pages.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-white">{p.title}</p>
                    <p className="text-xs text-slate-500">
                      /p/{p.slug} · {p.status}
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      className="text-brand-300"
                      onClick={() => setDraft(p)}
                    >
                      Edit
                    </button>
                    {p.status === 'published' && (
                      <Link to={`/p/${p.slug}`} className="text-slate-400 hover:text-white">
                        View
                      </Link>
                    )}
                    <button
                      type="button"
                      className="text-rose-300"
                      onClick={async () => {
                        await deletePage(p.id, p.slug)
                        await load()
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
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
                {fields.map((field) => (
                  <label key={field} className="mb-3 block text-xs text-slate-400">
                    {field}
                    <textarea
                      value={block[field] || ''}
                      rows={field.toLowerCase().includes('body') || field === 'lead' ? 3 : 2}
                      onChange={(e) =>
                        setSiteCopy((prev) => ({
                          ...prev,
                          [section]: { ...block, [field]: e.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
                    />
                  </label>
                ))}
              </div>
            )
          })}
          <Button type="button" onClick={onSaveCore} icon>
            Save core copy
          </Button>
        </div>
      )}
    </div>
  )
}

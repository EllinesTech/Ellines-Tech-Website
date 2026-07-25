import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { knowledgeCategories, type KnowledgeCategory } from '@/data/knowledge'
import {
  deleteKnowledgeArticle,
  fetchKnowledge,
  saveKnowledgeArticle,
  type KnowledgeArticle,
} from '@/lib/cmsApi'

const emptyArticle = (): Partial<KnowledgeArticle> => ({
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: 'articles',
  tags: [],
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
  downloadUrl: '',
  htmlUrl: '',
})

export function AdminResourcesEditor() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [draft, setDraft] = useState<Partial<KnowledgeArticle>>(emptyArticle())
  const [tagsInput, setTagsInput] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      setArticles(await fetchKnowledge(false))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load Knowledge Hub')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onSave() {
    try {
      const res = await saveKnowledgeArticle({
        ...draft,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      })
      setMessage(`Saved /resources/${res.article.slug}`)
      setDraft(emptyArticle())
      setTagsInput('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  function editArticle(a: KnowledgeArticle) {
    setDraft(a)
    setTagsInput((a.tags || []).join(', '))
    setMessage('')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Knowledge Hub</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create, edit, and publish articles shown on{' '}
            <Link to="/resources" className="text-brand-300">
              /resources
            </Link>
            . Defaults seed automatically when the store is empty.
          </p>
        </div>
      </div>

      {message && <p className="text-sm text-emerald-300">{message}</p>}
      {error && <p className="text-sm text-amber-200">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">
            {draft.id ? 'Edit article' : 'Add new article'}
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
            Category
            <select
              value={draft.category || 'articles'}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  category: e.target.value as KnowledgeCategory,
                }))
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
            >
              {knowledgeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-slate-400">
            Tags (comma-separated)
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
              placeholder="ai, healthcare, tutorial"
            />
          </label>
          <label className="block text-xs text-slate-400">
            Download PDF URL (optional — for downloads category)
            <input
              value={draft.downloadUrl || ''}
              onChange={(e) => setDraft((d) => ({ ...d, downloadUrl: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
              placeholder="/downloads/ellines-tech-company-profile.pdf"
            />
          </label>
          <label className="block text-xs text-slate-400">
            HTML view URL (optional)
            <input
              value={draft.htmlUrl || ''}
              onChange={(e) => setDraft((d) => ({ ...d, htmlUrl: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
              placeholder="/downloads/ellines-tech-company-profile.html"
            />
          </label>
          <label className="block text-xs text-slate-400">
            Body content
            <textarea
              value={draft.body || ''}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              rows={10}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
              placeholder="Write article content. Use blank lines between paragraphs."
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
            Published (live on Knowledge Hub)
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onSave} icon>
              Save article
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDraft(emptyArticle())
                setTagsInput('')
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">All Knowledge Hub articles</h3>
          <ul className="mt-4 max-h-[36rem] space-y-2 overflow-y-auto">
            {articles.length === 0 && (
              <li className="text-sm text-slate-500">No articles yet — defaults will seed on first public load.</li>
            )}
            {articles.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{a.title}</p>
                  <p className="text-xs text-slate-500">
                    {a.category} · /resources/{a.slug} · {a.status}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 text-xs">
                  <button type="button" className="text-brand-300" onClick={() => editArticle(a)}>
                    Edit
                  </button>
                  {a.status === 'published' && (
                    <Link to={`/resources/${a.slug}`} className="text-slate-400 hover:text-white">
                      View
                    </Link>
                  )}
                  <button
                    type="button"
                    className="text-rose-300"
                    onClick={async () => {
                      await deleteKnowledgeArticle(a.id, a.slug)
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
    </div>
  )
}

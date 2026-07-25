import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { defaultDownloads, type DownloadResource } from '@/data/downloads'
import { deleteDownload, fetchDownloads, saveDownload } from '@/lib/cmsApi'

const empty = (): Partial<DownloadResource> => ({
  title: '',
  description: '',
  fileUrl: '/downloads/',
  htmlUrl: '',
  category: 'company',
  status: 'draft',
})

export function AdminDownloadsEditor() {
  const [items, setItems] = useState<DownloadResource[]>([])
  const [draft, setDraft] = useState<Partial<DownloadResource>>(empty())
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      const list = await fetchDownloads(false)
      setItems(list.length ? list : defaultDownloads)
      setError('')
    } catch (e) {
      setItems(defaultDownloads)
      setError(e instanceof Error ? e.message : 'Failed to load downloads')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onSave() {
    try {
      const res = await saveDownload(draft)
      setMessage(`Saved ${res.download.title}`)
      setDraft(empty())
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Company downloads</h2>
        <p className="mt-1 text-sm text-slate-400">
          Metadata for files in{' '}
          <code className="text-brand-300">/downloads/</code>. Clients see these on About,
          Resources, and Account. Place PDF/HTML files in{' '}
          <code className="text-brand-300">public/downloads/</code> then set the URL here.
        </p>
      </div>

      {message && <p className="text-sm text-emerald-300">{message}</p>}
      {error && <p className="text-sm text-amber-200">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="font-semibold text-white">{draft.id ? 'Edit download' : 'Add download'}</h3>
          {(
            [
              ['title', 'Title'],
              ['description', 'Description'],
              ['fileUrl', 'PDF / file URL'],
              ['htmlUrl', 'HTML view URL (optional)'],
              ['category', 'Category'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-xs text-slate-400">
              {label}
              <input
                value={(draft[key] as string) || ''}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
              />
            </label>
          ))}
          <label className="block text-xs text-slate-400">
            Status
            <select
              value={draft.status || 'draft'}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  status: e.target.value as DownloadResource['status'],
                }))
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="button" onClick={onSave}>
              Save download
            </Button>
            {draft.id && (
              <Button type="button" variant="ghost" onClick={() => setDraft(empty())}>
                Cancel edit
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-white">Published & drafts</h3>
          <ul className="space-y-2">
            {items.map((d) => (
              <li
                key={d.id}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{d.title}</p>
                    <p className="text-xs text-slate-500">
                      {d.status} · {d.fileUrl}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-brand-300"
                      onClick={() => {
                        setDraft(d)
                        setMessage('')
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs text-rose-300"
                      onClick={async () => {
                        if (!confirm(`Delete ${d.title}?`)) return
                        try {
                          await deleteDownload(d.id)
                          await load()
                        } catch (e) {
                          setError(e instanceof Error ? e.message : 'Delete failed')
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <a
                  href={d.fileUrl}
                  className="mt-1 inline-block text-xs text-slate-400 hover:text-brand-300"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open file
                </a>
              </li>
            ))}
          </ul>
          <p className="pt-2 text-xs text-slate-500">
            Also manage Knowledge Hub download articles in{' '}
            <Link to="/admin/resources" className="text-brand-300">
              Resources
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

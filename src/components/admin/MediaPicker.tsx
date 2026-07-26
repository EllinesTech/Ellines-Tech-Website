import { useEffect, useState } from 'react'
import { fetchMediaExtras, type CmsMediaItem } from '@/lib/cmsApi'
import { getSiteMediaLibrary, type SiteMediaItem } from '@/data/siteMediaLibrary'

type LibraryItem = SiteMediaItem | CmsMediaItem

export function MediaPicker({
  value,
  onChange,
  label = 'Image / poster URL',
}: {
  value: string
  onChange: (url: string) => void
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [library, setLibrary] = useState<LibraryItem[]>(() => getSiteMediaLibrary())

  useEffect(() => {
    if (!open) return
    fetchMediaExtras()
      .then((extras) => {
        const base = getSiteMediaLibrary()
        const seen = new Set(base.map((i) => i.src))
        const extraItems = extras.filter((e) => e.src && !seen.has(e.src))
        setLibrary([...extraItems, ...base])
      })
      .catch(() => setLibrary(getSiteMediaLibrary()))
  }, [open])

  return (
    <div className="space-y-2">
      <label className="block text-[10px] uppercase tracking-wide text-slate-500">
        {label}
        <div className="mt-1 flex gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white"
            placeholder="/media/posters/packages/… or https://…"
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-brand-300 hover:border-brand-400/40"
          >
            {open ? 'Hide library' : 'Pick photo'}
          </button>
        </div>
      </label>
      {value ? (
        <img
          src={value}
          alt=""
          className="h-16 w-28 rounded-lg border border-white/10 object-cover bg-slate-900"
        />
      ) : null}
      {open ? (
        <ul className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-white/10 p-2 sm:grid-cols-4">
          {library.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(item.src)
                  setOpen(false)
                }}
                className={`block w-full overflow-hidden rounded-lg border ${
                  value === item.src ? 'border-brand-400' : 'border-white/10'
                } hover:border-brand-400/50`}
                title={item.label}
              >
                <img src={item.src} alt={item.label} className="h-14 w-full object-cover bg-slate-900" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

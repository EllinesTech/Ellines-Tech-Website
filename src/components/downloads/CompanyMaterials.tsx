import { useEffect, useState } from 'react'
import { Download, FileText, ExternalLink } from 'lucide-react'
import { defaultDownloads, type DownloadResource } from '@/data/downloads'
import { fetchDownloads } from '@/lib/cmsApi'
import { cn } from '@/lib/utils'
import { useSiteFeatures } from '@/context/SiteFeaturesContext'

type Props = {
  className?: string
  title?: string
  description?: string
  compact?: boolean
}

export function CompanyMaterials({
  className,
  title = 'Company materials',
  description =
    'Download our company profile, brochure, pricing rate card, capabilities one-pager, service catalogue, engagement guide, and intro flyer.',
  compact = false,
}: Props) {
  const { settings } = useSiteFeatures()
  const [items, setItems] = useState<DownloadResource[]>(
    defaultDownloads.filter((d) => d.status === 'published'),
  )

  useEffect(() => {
    if (!settings.downloadsEnabled) return
    fetchDownloads(true)
      .then((list) => {
        const published = list.filter((d) => d.status === 'published')
        if (published.length) setItems(published)
      })
      .catch(() => undefined)
  }, [settings.downloadsEnabled])

  if (!settings.downloadsEnabled) return null

  return (
    <div className={cn(className)}>
      {!compact && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            Downloads
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          {description && <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>}
        </div>
      )}
      {compact && title && (
        <h2 className="mb-4 font-display text-lg font-semibold text-white">{title}</h2>
      )}
      <ul className={cn('grid gap-3', compact ? 'sm:grid-cols-1' : 'sm:grid-cols-2')}>
        {items.map((d) => (
          <li
            key={d.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-white">{d.title}</p>
              <p className="mt-1 text-sm text-slate-400">{d.description}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href={d.fileUrl}
                download
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-400/30 bg-brand-500/15 px-3 py-2 text-xs font-semibold text-brand-200 transition hover:bg-brand-500/25"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </a>
              {d.htmlUrl && (
                <a
                  href={d.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  <FileText className="h-3.5 w-3.5" /> View
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              )}
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-slate-500">No published downloads yet.</li>
        )}
      </ul>
    </div>
  )
}

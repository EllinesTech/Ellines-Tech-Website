import { useState } from 'react'
import { X } from 'lucide-react'
import { useSiteFeatures } from '@/context/SiteFeaturesContext'

export function AnnouncementBar() {
  const { settings } = useSiteFeatures()
  const [dismissed, setDismissed] = useState(false)
  if (!settings.announcement.trim() || dismissed) return null

  return (
    <div className="relative z-[60] border-b border-brand-400/20 bg-brand-500/10 px-4 py-2.5 text-center text-sm text-brand-100">
      <p className="mx-auto max-w-4xl pr-8">{settings.announcement}</p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-brand-200/80 hover:bg-white/5"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

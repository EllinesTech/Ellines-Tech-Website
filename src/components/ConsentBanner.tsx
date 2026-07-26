import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import {
  acceptAllConsent,
  loadConsent,
  rejectOptionalConsent,
  saveConsent,
  type ConsentPreferences,
} from '@/lib/consent'

export function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [functional, setFunctional] = useState(true)

  useEffect(() => {
    setOpen(!loadConsent())
  }, [])

  function closeWith(prefs: ConsentPreferences) {
    void prefs
    setOpen(false)
    setCustomize(false)
  }

  if (!open) return null

  return (
    <div
      className="no-print fixed inset-x-0 bottom-0 z-[80] p-3 print:hidden sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-5">
        <h2 id="consent-title" className="font-display text-base font-semibold text-white sm:text-lg">
          Cookies & personal data
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Ellines Tech (Nyeri &amp; Nairobi, Kenya) uses necessary cookies to run this site. With
          your consent we
          also use analytics and functional storage (including chat continuity) under the{' '}
          <strong className="font-medium text-slate-100">Kenya Data Protection Act, 2019</strong>.
          Read our{' '}
          <Link to="/privacy" className="text-brand-300 underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to="/cookies" className="text-brand-300 underline-offset-2 hover:underline">
            Cookie Policy
          </Link>
          .
        </p>

        {customize && (
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
            <label className="flex items-start gap-3 text-slate-300">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <span className="font-medium text-white">Necessary</span> — security, session, and
                consent preferences (always on).
              </span>
            </label>
            <label className="flex items-start gap-3 text-slate-300">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 accent-cyan-400"
              />
              <span>
                <span className="font-medium text-white">Analytics</span> — anonymised page visits to
                improve the site.
              </span>
            </label>
            <label className="flex items-start gap-3 text-slate-300">
              <input
                type="checkbox"
                checked={functional}
                onChange={(e) => setFunctional(e.target.checked)}
                className="mt-1 accent-cyan-400"
              />
              <span>
                <span className="font-medium text-white">Functional</span> — chat continuity and
                similar helpful features.
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => closeWith(acceptAllConsent())}
          >
            Accept all
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => closeWith(rejectOptionalConsent())}
          >
            Necessary only
          </Button>
          {customize ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => closeWith(saveConsent({ analytics, functional }))}
            >
              Save choices
            </Button>
          ) : (
            <Button type="button" size="sm" variant="ghost" onClick={() => setCustomize(true)}>
              Customize
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

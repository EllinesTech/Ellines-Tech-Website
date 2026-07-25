import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  defaultFeatureSettings,
  FEATURE_TOGGLE_META,
  type SiteFeatureSettings,
} from '@/lib/siteFeatures'
import { fetchSiteSettings, saveSiteSettings } from '@/lib/cmsApi'
import { useSiteFeatures } from '@/context/SiteFeaturesContext'
import { siteConfig } from '@/data/site'
import { SocialLinks } from '@/components/engagement/SocialLinks'

export function AdminSettingsPage() {
  const { setLocalSettings, refresh } = useSiteFeatures()
  const [settings, setSettings] = useState<SiteFeatureSettings>(defaultFeatureSettings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSiteSettings()
      .then((s) => {
        setSettings(s)
        setLocalSettings(s)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load settings'))
      .finally(() => setLoading(false))
  }, [setLocalSettings])

  async function persist() {
    setSaving(true)
    setError('')
    try {
      const res = await saveSiteSettings(settings)
      const next = (res.settings || settings) as SiteFeatureSettings
      setSettings(next)
      setLocalSettings(next)
      await refresh()
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed — owner session required')
    } finally {
      setSaving(false)
    }
  }

  function toggle(key: keyof SiteFeatureSettings, value: boolean | string) {
    setSettings((s) => ({ ...s, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Site controls</h1>
        <p className="mt-2 text-slate-400">
          Feature switches for {siteConfig.name}. Changes sync to KV and apply site-wide (not just
          this browser).
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading settings…</p>}
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="space-y-4 rounded-2xl border border-white/10 bg-surface-elevated/40 p-6">
        <h2 className="font-display text-lg font-semibold text-white">Feature modules</h2>
        <p className="text-sm text-slate-400">
          Turning a module off hides it from public navigation and blocks the public page. Admin /
          staff can still manage content (e.g. Careers listings) while the public surface is off.
        </p>
        <ul className="divide-y divide-white/5">
          {FEATURE_TOGGLE_META.map((item) => (
            <li key={item.key} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-200">{item.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(settings[item.key])}
                onChange={(e) => toggle(item.key, e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-cyan-400"
                aria-label={item.label}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-surface-elevated/40 p-6">
        <h2 className="font-display text-lg font-semibold text-white">Engagement</h2>
        <label className="flex items-center justify-between gap-4 text-sm text-slate-300">
          Always open (24/7 messaging)
          <input
            type="checkbox"
            checked={settings.alwaysOpen}
            onChange={(e) => toggle('alwaysOpen', e.target.checked)}
            className="h-4 w-4 accent-cyan-400"
          />
        </label>
        <label className="block text-sm text-slate-400">
          Site announcement (optional banner text)
          <textarea
            value={settings.announcement}
            onChange={(e) => toggle('announcement', e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
            placeholder="e.g. Now booking Q3 demos — chat us anytime."
          />
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="button" onClick={() => void persist()} disabled={saving} icon>
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save controls'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSettings(defaultFeatureSettings)
              setSaved(false)
            }}
          >
            Reset form
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-6">
        <h2 className="font-display text-lg font-semibold text-white">Verified social handles</h2>
        <p className="mt-2 text-sm text-slate-400">
          Live profiles confirmed online for Ellines Tech.
        </p>
        <SocialLinks className="mt-5" showLabels />
      </div>
    </div>
  )
}

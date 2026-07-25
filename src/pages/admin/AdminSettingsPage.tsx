import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  defaultRuntimeSettings,
  loadSettings,
  saveSettings,
  type SiteRuntimeSettings,
} from '@/lib/engagementStore'
import { siteConfig } from '@/data/site'
import { SocialLinks } from '@/components/engagement/SocialLinks'

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteRuntimeSettings>(() => loadSettings())
  const [saved, setSaved] = useState(false)

  function persist() {
    saveSettings(settings)
    setSaved(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Site controls</h1>
        <p className="mt-2 text-slate-400">
          Toggle engagement features and announcements for {siteConfig.name}.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-surface-elevated/40 p-6">
        <label className="flex items-center justify-between gap-4 text-sm text-slate-300">
          Customer chat enabled
          <input
            type="checkbox"
            checked={settings.chatEnabled}
            onChange={(e) => {
              setSettings((s) => ({ ...s, chatEnabled: e.target.checked }))
              setSaved(false)
            }}
            className="h-4 w-4 accent-cyan-400"
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm text-slate-300">
          Always open (24/7)
          <input
            type="checkbox"
            checked={settings.alwaysOpen}
            onChange={(e) => {
              setSettings((s) => ({ ...s, alwaysOpen: e.target.checked }))
              setSaved(false)
            }}
            className="h-4 w-4 accent-cyan-400"
          />
        </label>
        <label className="block text-sm text-slate-400">
          Site announcement (optional banner text)
          <textarea
            value={settings.announcement}
            onChange={(e) => {
              setSettings((s) => ({ ...s, announcement: e.target.value }))
              setSaved(false)
            }}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
            placeholder="e.g. Now booking Q3 demos — chat us anytime."
          />
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="button" onClick={persist} icon>
            {saved ? 'Saved' : 'Save controls'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSettings(defaultRuntimeSettings)
              saveSettings(defaultRuntimeSettings)
              setSaved(true)
            }}
          >
            Reset
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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchSiteSettings } from '@/lib/cmsApi'
import {
  defaultFeatureSettings,
  isPathEnabled,
  type SiteFeatureSettings,
} from '@/lib/siteFeatures'
import { saveSettings as saveLocalSettings } from '@/lib/engagementStore'

type SiteFeaturesContextValue = {
  settings: SiteFeatureSettings
  loading: boolean
  refresh: () => Promise<void>
  setLocalSettings: (next: SiteFeatureSettings) => void
  isEnabled: (pathname: string) => boolean
}

const SiteFeaturesContext = createContext<SiteFeaturesContextValue | null>(null)

export function SiteFeaturesProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteFeatureSettings>(defaultFeatureSettings)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const remote = await fetchSiteSettings()
      setSettings(remote)
      saveLocalSettings({
        chatEnabled: remote.chatEnabled,
        announcement: remote.announcement,
        alwaysOpen: remote.alwaysOpen,
      })
    } catch {
      /* keep defaults / last known */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const setLocalSettings = useCallback((next: SiteFeatureSettings) => {
    setSettings(next)
    saveLocalSettings({
      chatEnabled: next.chatEnabled,
      announcement: next.announcement,
      alwaysOpen: next.alwaysOpen,
    })
  }, [])

  const value = useMemo<SiteFeaturesContextValue>(
    () => ({
      settings,
      loading,
      refresh,
      setLocalSettings,
      isEnabled: (pathname: string) => isPathEnabled(pathname, settings),
    }),
    [settings, loading, refresh, setLocalSettings],
  )

  return <SiteFeaturesContext.Provider value={value}>{children}</SiteFeaturesContext.Provider>
}

export function useSiteFeatures() {
  const ctx = useContext(SiteFeaturesContext)
  if (!ctx) {
    return {
      settings: defaultFeatureSettings,
      loading: false,
      refresh: async () => undefined,
      setLocalSettings: () => undefined,
      isEnabled: () => true,
    } satisfies SiteFeaturesContextValue
  }
  return ctx
}

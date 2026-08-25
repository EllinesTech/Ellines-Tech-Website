import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { siteConfig } from '@/data/site'
import { fetchSiteProfile, type SiteProfile } from '@/lib/cmsApi'

const defaultProfile: SiteProfile = {
  email: siteConfig.email,
  phone: siteConfig.phone,
  whatsapp: siteConfig.whatsapp,
  address: siteConfig.address,
  socialLinks: siteConfig.socialLinks.map((s) => ({ ...s })),
}

type Ctx = {
  profile: SiteProfile
  refresh: () => Promise<void>
}

const SiteProfileContext = createContext<Ctx>({
  profile: defaultProfile,
  refresh: async () => undefined,
})

// Module-level cache so navigating between pages doesn't re-fetch profile
let profileCache: SiteProfile | null = null

export function SiteProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SiteProfile>(() => profileCache ?? defaultProfile)
  const fetched = useRef(false)

  async function refresh() {
    try {
      const next = await fetchSiteProfile()
      if (next) {
        profileCache = { ...defaultProfile, ...next }
        setProfile(profileCache)
      }
    } catch {
      /* keep defaults */
    }
  }

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    if (profileCache) {
      setProfile(profileCache)
      return
    }
    void refresh()
  }, [])

  return (
    <SiteProfileContext.Provider value={{ profile, refresh }}>{children}</SiteProfileContext.Provider>
  )
}

export function useSiteProfile() {
  return useContext(SiteProfileContext)
}

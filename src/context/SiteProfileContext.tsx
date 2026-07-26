import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
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

export function SiteProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SiteProfile>(defaultProfile)

  async function refresh() {
    try {
      const next = await fetchSiteProfile()
      if (next) setProfile({ ...defaultProfile, ...next })
    } catch {
      /* keep defaults */
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <SiteProfileContext.Provider value={{ profile, refresh }}>{children}</SiteProfileContext.Provider>
  )
}

export function useSiteProfile() {
  return useContext(SiteProfileContext)
}

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { trackVisit } from '@/lib/cmsApi'
import { hasAnalyticsConsent, loadConsent } from '@/lib/consent'

export function VisitTracker() {
  const location = useLocation()
  const [allowed, setAllowed] = useState(() => hasAnalyticsConsent())

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent())
    sync()
    window.addEventListener('et:consent', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('et:consent', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!allowed || !loadConsent()) return
    trackVisit(location.pathname + location.search)
  }, [location.pathname, location.search, allowed])

  return null
}

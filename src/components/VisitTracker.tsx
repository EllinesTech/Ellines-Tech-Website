import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { trackVisit } from '@/lib/cmsApi'
import { initAnalytics, trackPageView } from '@/lib/analytics'
import { hasAnalyticsConsent, loadConsent } from '@/lib/consent'

export function VisitTracker() {
  const location = useLocation()
  const [allowed, setAllowed] = useState(() => hasAnalyticsConsent())

  useEffect(() => {
    initAnalytics()
    const sync = () => {
      setAllowed(hasAnalyticsConsent())
      initAnalytics()
    }
    window.addEventListener('et:consent', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('et:consent', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!allowed || !loadConsent()) return
    const path = location.pathname + location.search
    trackVisit(path)
    trackPageView(path)
  }, [location.pathname, location.search, allowed])

  return null
}

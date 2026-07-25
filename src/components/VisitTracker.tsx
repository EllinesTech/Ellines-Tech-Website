import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackVisit } from '@/lib/cmsApi'

export function VisitTracker() {
  const location = useLocation()
  useEffect(() => {
    trackVisit(location.pathname + location.search)
  }, [location.pathname, location.search])
  return null
}

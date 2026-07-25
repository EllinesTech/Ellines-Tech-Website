import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll to hash targets after client-side navigation (e.g. /contact#quote). */
export function HashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(hash.replace(/^#/, ''))
    const run = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    requestAnimationFrame(() => setTimeout(run, 50))
  }, [pathname, hash])

  return null
}

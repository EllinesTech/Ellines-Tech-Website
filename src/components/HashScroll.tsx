import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToTopInstant() {
  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.style.scrollBehavior = prev
}

/** Instant scroll-to-top on route change; smooth hash scroll after page enter. */
export function HashScroll() {
  const { pathname, hash } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    const pathChanged = prevPath.current !== pathname
    prevPath.current = pathname

    if (!hash) {
      // Instant jump — avoid fighting html { scroll-behavior: smooth } mid-transition
      scrollToTopInstant()
      return
    }

    // Same-page hash: scroll soon. Cross-page: wait for page enter animation (~280ms).
    const delay = pathChanged ? 300 : 50
    const id = decodeURIComponent(hash.replace(/^#/, ''))
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, delay)

    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return null
}

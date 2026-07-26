import { useEffect } from 'react'

const LOCK_CLASS = 'app-shell-lock'

/**
 * Prevents document/body scroll while an app chrome (admin/staff) is mounted.
 * Independent pane scroll must live inside the shell — not on html/body.
 */
export function useLockViewportScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('root')

    html.classList.add(LOCK_CLASS)
    body.classList.add(LOCK_CLASS)
    root?.classList.add(LOCK_CLASS)

    return () => {
      html.classList.remove(LOCK_CLASS)
      body.classList.remove(LOCK_CLASS)
      root?.classList.remove(LOCK_CLASS)
    }
  }, [enabled])
}

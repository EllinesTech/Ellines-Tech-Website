import { useSyncExternalStore } from 'react'

const DISMISS_KEY = 'ellines.pwa.install.dismissed'
const DISMISS_MS = 1000 * 60 * 60 * 24 * 21 // 21 days

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export type PwaInstallState = 'installed' | 'installable' | 'ios' | 'unavailable'

type Store = {
  deferred: BeforeInstallPromptEvent | null
  installed: boolean
  dismissed: boolean
  ios: boolean
  ready: boolean
}

let store: Store = {
  deferred: null,
  installed: false,
  dismissed: false,
  ios: false,
  ready: false,
}

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function isIosDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    nav.standalone === true ||
    document.referrer.includes('android-app://')
  )
}

function readDismissed() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const until = Number(raw)
    if (!Number.isFinite(until)) return false
    if (Date.now() > until) {
      localStorage.removeItem(DISMISS_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

function patch(partial: Partial<Store>) {
  store = { ...store, ...partial }
  emit()
}

let listening = false

function ensureListeners() {
  if (typeof window === 'undefined' || listening) return
  listening = true

  patch({
    installed: isStandaloneDisplay(),
    dismissed: readDismissed(),
    ios: isIosDevice(),
    ready: true,
  })

  const onBip = (event: BeforeInstallPromptEvent) => {
    event.preventDefault()
    patch({ deferred: event })
  }
  const onInstalled = () => {
    patch({ installed: true, deferred: null })
  }
  const syncInstalled = () => {
    patch({ installed: isStandaloneDisplay() })
  }

  window.addEventListener('beforeinstallprompt', onBip)
  window.addEventListener('appinstalled', onInstalled)

  const mq = window.matchMedia('(display-mode: standalone)')
  mq.addEventListener?.('change', syncInstalled)
}

function subscribe(listener: () => void) {
  ensureListeners()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  ensureListeners()
  return store
}

function getServerSnapshot(): Store {
  return {
    deferred: null,
    installed: false,
    dismissed: false,
    ios: false,
    ready: false,
  }
}

export function usePwaInstall() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const state: PwaInstallState = snapshot.installed
    ? 'installed'
    : snapshot.deferred
      ? 'installable'
      : snapshot.ios
        ? 'ios'
        : 'unavailable'

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS))
    } catch {
      /* ignore */
    }
    patch({ dismissed: true })
  }

  const promptInstall = async () => {
    const deferred = store.deferred
    if (!deferred) return false
    await deferred.prompt()
    const choice = await deferred.userChoice
    patch({ deferred: null })
    if (choice.outcome === 'accepted') {
      patch({ installed: true })
      return true
    }
    return false
  }

  return {
    state,
    installed: snapshot.installed,
    dismissed: snapshot.dismissed,
    canPrompt: Boolean(snapshot.deferred),
    showBanner:
      snapshot.ready &&
      !snapshot.installed &&
      !snapshot.dismissed &&
      (Boolean(snapshot.deferred) || snapshot.ios),
    promptInstall,
    dismiss,
  }
}

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  // Avoid SW during Vite HMR — register after load in production builds.
  if (import.meta.env.DEV) return

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => undefined)
  })
}

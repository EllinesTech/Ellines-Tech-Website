/** Client consent for cookies & personal data — Kenya Data Protection Act, 2019 */

export type ConsentPreferences = {
  /** Essential cookies always on once banner is answered */
  necessary: true
  /** Visit analytics / product improvement */
  analytics: boolean
  /** Chat continuity & marketing-related storage */
  functional: boolean
  /** Timestamp ISO */
  updatedAt: string
  /** Version of policy accepted */
  version: string
}

export const CONSENT_STORAGE_KEY = 'et_consent_v1'
export const CONSENT_POLICY_VERSION = '2026-07-25'

export function loadConsent(): ConsentPreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentPreferences
    if (!parsed?.updatedAt || parsed.version !== CONSENT_POLICY_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function saveConsent( partial: Omit<ConsentPreferences, 'necessary' | 'updatedAt' | 'version'> & {
    analytics?: boolean
    functional?: boolean
  },
): ConsentPreferences {
  const next: ConsentPreferences = {
    necessary: true,
    analytics: Boolean(partial.analytics),
    functional: Boolean(partial.functional),
    updatedAt: new Date().toISOString(),
    version: CONSENT_POLICY_VERSION,
  }
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('et:consent', { detail: next }))
  return next
}

export function acceptAllConsent(): ConsentPreferences {
  return saveConsent({ analytics: true, functional: true })
}

export function rejectOptionalConsent(): ConsentPreferences {
  return saveConsent({ analytics: false, functional: false })
}

export function hasAnalyticsConsent(): boolean {
  return loadConsent()?.analytics === true
}

export function hasFunctionalConsent(): boolean {
  return loadConsent()?.functional === true
}

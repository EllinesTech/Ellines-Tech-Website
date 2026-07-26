import { useState } from 'react'

/**
 * Bot trap for public forms. The input is visually hidden and skipped by
 * keyboard navigation, so a real visitor never fills it — but naive form-filling
 * bots do. Submissions that carry a value are silently discarded by the API
 * (`honeypotTripped` in `functions/_shared/security.ts`).
 */
export function useHoneypot() {
  const [website, setWebsite] = useState('')

  const honeypot = (
    <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>
    </div>
  )

  return { website, honeypot }
}

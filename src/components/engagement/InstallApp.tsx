import { useState } from 'react'
import { Download, Check, Share, X, Smartphone } from 'lucide-react'
import { usePwaInstall, type PwaInstallState } from '@/hooks/usePwaInstall'
import { cn } from '@/lib/utils'

function labelFor(state: PwaInstallState) {
  if (state === 'installed') return 'App installed'
  if (state === 'installable') return 'Install app'
  if (state === 'ios') return 'Add to Home Screen'
  return 'Install app'
}

/** Compact control for header / footer / mobile menu. */
export function InstallAppButton({
  className,
  variant = 'ghost',
}: {
  className?: string
  variant?: 'ghost' | 'chip'
}) {
  const { state, promptInstall, installed } = usePwaInstall()
  const [iosOpen, setIosOpen] = useState(false)

  if (state === 'unavailable') return null

  const onClick = async () => {
    if (state === 'installed') return
    if (state === 'installable') {
      await promptInstall()
      return
    }
    if (state === 'ios') setIosOpen((v) => !v)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={installed}
        className={cn(
          'inline-flex items-center gap-2 text-sm font-medium transition-colors',
          variant === 'chip'
            ? 'rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-brand-400/30 hover:text-brand-200 disabled:cursor-default disabled:opacity-80'
            : 'rounded-lg px-3 py-2 text-slate-300 hover:bg-white/[0.04] hover:text-white disabled:cursor-default disabled:text-emerald-300/90 disabled:hover:bg-transparent',
        )}
        aria-expanded={state === 'ios' ? iosOpen : undefined}
        title={labelFor(state)}
      >
        {installed ? (
          <Check className="h-4 w-4 text-emerald-400" aria-hidden />
        ) : (
          <Download className="h-4 w-4" aria-hidden />
        )}
        {labelFor(state)}
      </button>

      {state === 'ios' && iosOpen && (
        <div
          role="dialog"
          aria-label="Install on iPhone or iPad"
          className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl border border-white/12 bg-slate-950/98 p-4 text-left shadow-2xl shadow-black/50 backdrop-blur-xl sm:left-auto sm:right-0"
        >
          <p className="font-display text-sm font-semibold text-white">Add Ellines Tech to Home Screen</p>
          <ol className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400">
            <li className="flex gap-2">
              <span className="font-mono text-brand-300">1</span>
              <span>
                Tap <Share className="mx-0.5 inline h-3.5 w-3.5 text-brand-300" aria-hidden /> Share in Safari
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-brand-300">2</span>
              <span>Scroll and choose Add to Home Screen</span>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-brand-300">3</span>
              <span>Confirm — open anytime like a native app</span>
            </li>
          </ol>
          <button
            type="button"
            className="mt-3 text-xs font-semibold text-brand-300 hover:text-brand-200"
            onClick={() => setIosOpen(false)}
          >
            Got it
          </button>
        </div>
      )}
    </div>
  )
}

/** Dismissible bottom prompt — only when installable or iOS, and not dismissed. */
export function InstallAppBanner() {
  const { state, showBanner, promptInstall, dismiss } = usePwaInstall()
  const [busy, setBusy] = useState(false)

  if (!showBanner) return null

  const onInstall = async () => {
    if (state !== 'installable') return
    setBusy(true)
    try {
      await promptInstall()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center p-3 print:hidden sm:p-4"
      role="region"
      aria-label="Install Ellines Tech app"
    >
      <div className="pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-white/12 bg-slate-950/95 p-3.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:items-center sm:p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-400/25 bg-brand-500/10 text-brand-200">
          <Smartphone className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-white">
            {state === 'ios' ? 'Keep Ellines Tech on your Home Screen' : 'Install the Ellines Tech app'}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
            {state === 'ios'
              ? 'Safari → Share → Add to Home Screen for one-tap access to pricing, requests, and support.'
              : 'Faster launch, home-screen icon, and a focused browsing experience.'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {state === 'installable' ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void onInstall()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-brand-400 disabled:opacity-60"
              >
                <Download className="h-3.5 w-3.5" aria-hidden />
                Install app
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-1.5 text-xs font-semibold text-slate-200">
                <Share className="h-3.5 w-3.5 text-brand-300" aria-hidden />
                Share → Add to Home Screen
              </span>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-300"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

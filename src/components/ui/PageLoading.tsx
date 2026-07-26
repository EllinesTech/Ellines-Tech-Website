export function PageLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="section-container section-padding" role="status" aria-live="polite">
      <div className="max-w-xl animate-pulse space-y-4">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-10 w-3/4 rounded-lg bg-white/10" />
        <div className="h-4 w-full rounded bg-white/[0.06]" />
        <div className="h-4 w-5/6 rounded bg-white/[0.06]" />
        <p className="sr-only">{label}</p>
      </div>
    </div>
  )
}

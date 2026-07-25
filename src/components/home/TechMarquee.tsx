import { technologies } from '@/data/site'

/** Infinite tech marquee — premium SaaS strip pattern */
export function TechMarquee() {
  const items = [...technologies, ...technologies]

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-surface/60 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-950 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-950 to-transparent sm:w-24" />
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap pr-10">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  )
}

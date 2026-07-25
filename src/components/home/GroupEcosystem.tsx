import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/data/site'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

interface GroupEcosystemProps {
  className?: string
  compact?: boolean
}

export function GroupEcosystem({ className, compact }: GroupEcosystemProps) {
  return (
    <section className={cn('section-padding border-t border-white/5', className)}>
      <div className="section-container">
        <SectionHeader
          eyebrow="Company group"
          title={siteConfig.group.name}
          description={siteConfig.group.description}
          align="center"
          className="mb-12 lg:mb-16"
        />

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {siteConfig.groupBrands.map((brand, i) => {
            const CardInner = (
              <>
                <div className="relative aspect-[16/11] overflow-hidden bg-gradient-to-br from-slate-900 via-surface to-slate-950">
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-t opacity-80',
                      brand.accent,
                    )}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                      src={brand.image}
                      alt=""
                      className="max-h-full max-w-[70%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-5 pt-16">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-200/90">
                        {brand.role}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
                        {brand.name}
                      </h3>
                    </div>
                    <img
                      src={brand.mark}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg bg-white/5 object-contain p-1 opacity-90 ring-1 ring-white/10"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className={cn('flex flex-1 flex-col p-5 sm:p-6', compact && 'p-4')}>
                  <span
                    className={cn(
                      'inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider',
                      brand.status === 'live'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-amber-500/15 text-amber-200',
                    )}
                  >
                    {brand.statusLabel}
                  </span>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {brand.description}
                  </p>
                  {brand.url ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 transition-colors group-hover:text-brand-200">
                      Visit {brand.name.replace('Ellines ', '')}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Website launching soon · Business operating now
                    </p>
                  )}
                </div>
              </>
            )

            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {brand.url ? (
                  <a
                    href={brand.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-elevated/40 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] transition-colors hover:border-brand-400/25"
                  >
                    {CardInner}
                  </a>
                ) : (
                  <div className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-elevated/40 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
                    {CardInner}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

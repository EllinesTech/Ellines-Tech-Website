import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { industries } from '@/data/industries'
import { siteConfig } from '@/data/site'

export function IndustriesPage() {
  return (
    <>
      <SEO
        title="Industries"
        description="Ellines Tech serves healthcare, education, government, finance, retail, and more across Africa."
        path="/industries"
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.growth}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-brand-500/12 blur-[110px]" />

        <div className="section-container relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Industries
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              Sectors we
              <span className="mt-1 block text-gradient">know deeply</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Domain expertise and purpose-built systems for the industries we serve across Kenya
              and the wider continent.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact#quote" size="lg" icon>
                Talk industry fit
              </Button>
              <Button href="/solutions" variant="secondary" size="lg">
                View solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.slug}
                id={industry.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.07 }}
                className="scroll-mt-28 border-t border-white/10 pt-7"
              >
                <p className="font-mono text-[11px] tracking-[0.14em] text-slate-600">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-3 font-display text-xl font-semibold text-white">
                  {industry.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {industry.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {industry.solutions.map((solution) => (
                    <li key={solution} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-500/20 bg-gradient-to-br from-brand-900/50 via-slate-950 to-sky-950/60 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                  Not listed?
                </p>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Don&apos;t see your industry?
                </h2>
                <p className="mt-4 text-slate-300">
                  We&apos;ve built for regulated, high-volume, and field-heavy operations. Describe
                  yours and we&apos;ll tell you honestly whether we&apos;re the right fit.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Talk to us
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg">
                  See portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

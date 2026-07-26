import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { MediaCard } from '@/components/ui/MediaCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { industries } from '@/data/industries'
import { industryImage } from '@/data/imagery'
import { siteConfig } from '@/data/site'
import { locationLine } from '@/data/locations'

const proofPoints = [
  { value: '12', label: 'Sectors served' },
  { value: '50+', label: 'Systems shipped' },
  { value: '24/7', label: 'Support coverage' },
  { value: '2', label: 'Kenyan offices' },
]

export function IndustriesPage() {
  return (
    <>
      <SEO
        title="Industries"
        description="Ellines Tech serves healthcare, education, government, finance, retail, and more across Africa."
        path="/industries"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.industriesHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
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
            <p className="mt-8 text-xs text-slate-500">
              Built and supported from {locationLine}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Proof strip — quick weight before the grid */}
      <section className="border-b border-white/5 bg-surface/40">
        <div className="section-container py-8 sm:py-10">
          <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
            {proofPoints.map((point, i) => (
              <motion.div
                key={point.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className={cn(
                  'px-1 sm:px-6 sm:first:pl-0',
                  i % 2 === 1 && 'border-l border-white/10',
                  i > 0 && 'sm:border-l sm:border-white/10',
                )}
              >
                <dt className="font-display text-3xl font-bold tracking-tight text-gradient sm:text-4xl">
                  {point.value}
                </dt>
                <dd className="mt-1.5 text-sm text-slate-500">{point.label}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Where we go deep"
            title="Twelve sectors, one delivery standard"
            description="Each of these comes with systems we have already built, deployed, and supported — not a capability slide."
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <div key={industry.slug} id={industry.slug} className="scroll-mt-28">
                <MediaCard
                  title={industry.name}
                  description={industry.description}
                  image={industryImage(industry.slug)}
                  aspect="photo"
                  index={i % 3}
                  badge={
                    <span className="rounded-lg bg-slate-950/65 px-2.5 py-1 font-mono text-[11px] tracking-[0.14em] text-brand-200 ring-1 ring-white/15 backdrop-blur-md">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  }
                >
                  <ul className="mt-5 space-y-2 border-t border-white/8 pt-5">
                    {industry.solutions.map((solution) => (
                      <li
                        key={solution}
                        className="flex items-center gap-2.5 text-sm text-slate-300"
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </MediaCard>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-8 text-sm text-slate-400"
          >
            <span>Working in one of these sectors?</span>
            <Link
              to="/success-stories"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-300 transition-colors hover:text-brand-200"
            >
              Read the outcomes we delivered
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <CtaPanel
            split
            eyebrow="Not listed?"
            title="Don't see your industry?"
            description="We've built for regulated, high-volume, and field-heavy operations. Describe yours and we'll tell you honestly whether we're the right fit."
            primary={{ label: 'Talk to us', href: '/contact#quote' }}
            secondary={{ label: 'See portfolio', href: '/portfolio' }}
          />
        </div>
      </section>
    </>
  )
}

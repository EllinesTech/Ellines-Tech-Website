import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers, Building2, Cpu, CloudCog } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/data/site'
import { useSiteCopy } from '@/hooks/useSiteCopy'

const solutionAreas = [
  {
    icon: Building2,
    title: 'Enterprise Solutions',
    description: 'ERP, CRM, and custom enterprise systems for large organizations.',
    href: '/products#business',
    image: siteConfig.media.scenes.workspace,
  },
  {
    icon: Cpu,
    title: 'Healthcare Technology',
    description: 'Hospital management, clinical AI, pharmacy, lab, and home care platforms.',
    href: '/products#healthcare',
    image: siteConfig.media.scenes.aboutTeam,
  },
  {
    icon: Layers,
    title: 'AI & Automation',
    description: 'AI assistants, chatbots, voice AI, OCR, and predictive analytics.',
    href: '/products#ai',
    image: siteConfig.media.scenes.aiVisual,
  },
  {
    icon: CloudCog,
    title: 'Cloud & Infrastructure',
    description: 'Cloud migration, DevOps, security, and managed infrastructure.',
    href: '/services/cyber-security',
    image: '/media/posters/packages/consult_tech_roadmap.jpg',
  },
]

export function SolutionsPage() {
  const { solutions: live } = useSiteCopy()

  return (
    <>
      <SEO
        title="Solutions"
        description="Enterprise, healthcare, AI, and cloud solutions from Ellines Tech."
        path="/solutions"
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.solutionsHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-55" />
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
              Solutions
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              {live.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">{live.lead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact#quote" size="lg" icon>
                Discuss a build
              </Button>
              <Button href="/products" variant="secondary" size="lg">
                Explore products
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-6 sm:grid-cols-2">
            {solutionAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <Link
                  to={area.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-surface-elevated/30 transition-colors hover:border-brand-500/30"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={area.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/25 text-brand-200 ring-1 ring-brand-400/35 backdrop-blur-md">
                      <area.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-brand-300">
                      {area.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                      {area.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                      Explore
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-500/20 bg-gradient-to-br from-brand-900/50 via-slate-950 to-sky-950/60 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                Custom builds
              </p>
              <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Need something built for your operation?
              </h2>
              <p className="mt-4 text-slate-300">
                We design bespoke systems around your industry, workflows, and constraints — not the
                other way around.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Discuss your needs
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  Browse services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

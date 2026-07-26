import { motion } from 'framer-motion'
import { Layers, Building2, Cpu, CloudCog, ArrowRight, ShieldCheck, Clock3, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { CtaPanel } from '@/components/ui/CtaPanel'
import { MediaBadge, MediaCard } from '@/components/ui/MediaCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProcessSection } from '@/components/home/ProcessSection'
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
    image: '/media/posters/packages/shop_ai_automation.jpg',
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

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Outcome-first scoping',
    body: 'Every engagement starts with a written plan — deliverables, timeline, and investment — before we write a line of code.',
  },
  {
    icon: Clock3,
    title: 'Ship in measurable stages',
    body: 'Demos you can react to, milestones you can track, and a clean handoff when the system goes live.',
  },
  {
    icon: Users,
    title: 'Built for African operations',
    body: 'Healthcare, education, finance, and field-heavy businesses — designed for connectivity, compliance, and real staff workflows.',
  },
]

export function SolutionsPage() {
  const { solutions: live } = useSiteCopy()

  return (
    <>
      <SEO
        title="Solutions"
        description="Enterprise, healthcare, AI, and cloud solutions from Ellines Tech — built for Kenyan and African organizations that need systems that ship."
        path="/solutions"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Solutions', path: '/solutions' },
        ]}
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
          <SectionHeader
            eyebrow="Solution areas"
            title="Four paths. One delivery standard."
            description="Pick the lane that matches your operation — or describe a custom build and we’ll map the stack."
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {solutionAreas.map((area, i) => (
              <MediaCard
                key={area.title}
                title={area.title}
                description={area.description}
                image={area.image}
                href={area.href}
                index={i % 2}
                cta="Explore"
                badge={
                  <MediaBadge>
                    <area.icon className="h-5 w-5" />
                  </MediaBadge>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5 bg-surface/35">
        <div className="section-container">
          <SectionHeader
            eyebrow="Why teams choose us"
            title="Trust signals buyers actually need"
            description="Clarity before kickoff, measurable progress during build, and support after launch."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {trustSignals.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
              </motion.article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <Link
              to="/industries"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-300 transition-colors hover:text-brand-200"
            >
              Browse industries we serve
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/success-stories"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-300 transition-colors hover:text-brand-200"
            >
              Read measured outcomes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ProcessSection ctaHref="/contact#quote" />

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <CtaPanel
            eyebrow="Custom builds"
            title="Need something built for your operation?"
            description="We design bespoke systems around your industry, workflows, and constraints — not the other way around."
            primary={{ label: 'Discuss your needs', href: '/contact#quote' }}
            secondary={{ label: 'Browse services', href: '/services' }}
          />
        </div>
      </section>
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { MediaCard } from '@/components/ui/MediaCard'
import { portfolioCategories } from '@/data/portfolio'
import { projectVisual } from '@/data/imagery'
import { siteConfig } from '@/data/site'
import { loadPublishedPortfolio, staticPortfolioAsCatalog, type CatalogProject } from '@/lib/portfolioCatalog'
import { cn } from '@/lib/utils'

export function PortfolioPage() {
  const [projects, setProjects] = useState<CatalogProject[]>(() => staticPortfolioAsCatalog())
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    void loadPublishedPortfolio().then(setProjects)
  }, [])

  const categories = useMemo(() => {
    const seen: string[] = []
    for (const project of projects) {
      if (!seen.includes(project.category)) seen.push(project.category)
    }
    return seen
  }, [projects])

  const visible =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      <SEO
        title="Portfolio"
        description="Explore Ellines Tech portfolio — healthcare, education, business, AI, brand, and web projects."
        path="/portfolio"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.portfolio}
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
              Portfolio
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              Projects that
              <span className="mt-1 block text-gradient">deliver results</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Products, platforms, and brand identities we designed and shipped — including AfyaVox,
              RV22, Juno4, Lmar, and client marks built at Ellines Tech.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact#quote" size="lg" icon>
                Start a project
              </Button>
              <Button href="/clients" variant="secondary" size="lg">
                View clients
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Selected work
          </h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Filter by discipline — every project below shipped to production and is still running.
          </p>

          {categories.length > 0 && (
            <nav
              className="mb-12 mt-8 flex flex-wrap gap-x-1 gap-y-1 border-b border-white/10"
              aria-label="Filter by category"
            >
              {['All', ...categories].map((cat) => {
                const active = activeCategory === cat
                const count =
                  cat === 'All'
                    ? projects.length
                    : projects.filter((p) => p.category === cat).length
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'relative -mb-px px-3 py-2.5 text-sm font-medium transition-colors',
                      active ? 'text-brand-200' : 'text-slate-400 hover:text-slate-200',
                    )}
                    aria-pressed={active}
                  >
                    {cat === 'All'
                      ? 'All'
                      : portfolioCategories[cat as keyof typeof portfolioCategories] || cat}
                    <span
                      className={cn(
                        'ml-1.5 text-[11px] tabular-nums',
                        active ? 'text-brand-400/80' : 'text-slate-600',
                      )}
                    >
                      {count}
                    </span>
                    {active && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-400" />
                    )}
                  </button>
                )
              })}
            </nav>
          )}

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((project, i) => {
              const visual = projectVisual(project)
              const showMarkChip = visual.fit === 'cover' && Boolean(project.logo)
              return (
                <div key={project.slug} id={project.slug} className="scroll-mt-28">
                  <MediaCard
                    title={project.name}
                    eyebrow={portfolioCategories[project.category] || project.category}
                    description={project.description}
                    image={visual.src}
                    imageFit={visual.fit}
                    index={i % 3}
                    badge={
                      showMarkChip ? (
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950/70 p-1.5 ring-1 ring-white/15 backdrop-blur-md">
                          <img
                            src={project.logo}
                            alt=""
                            className="max-h-full w-auto max-w-full object-contain"
                            loading="lazy"
                          />
                        </span>
                      ) : (
                        <span className="rounded-lg bg-slate-950/65 px-2.5 py-1 font-mono text-[11px] tracking-[0.14em] text-brand-200 ring-1 ring-white/15 backdrop-blur-md">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      )
                    }
                    overline={
                      project.client ? (
                        <span className="rounded-lg bg-slate-950/65 px-2.5 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-white/10 backdrop-blur-md">
                          {project.client}
                        </span>
                      ) : undefined
                    }
                  >
                    {project.results && project.results.length > 0 && (
                      <ul className="mt-5 space-y-2.5 border-t border-white/8 pt-5">
                        {project.results.map((result) => (
                          <li
                            key={result}
                            className="border-l border-brand-400/30 pl-3.5 text-sm font-medium leading-snug text-slate-200"
                          >
                            {result}
                          </li>
                        ))}
                      </ul>
                    )}

                    {project.technologies?.length > 0 && (
                      <div className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                        {project.technologies.map((tech, index) => (
                          <span key={tech} className="inline-flex items-center gap-2.5">
                            {tech}
                            {index < project.technologies.length - 1 && (
                              <span className="text-slate-700" aria-hidden>
                                /
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </MediaCard>
                </div>
              )
            })}
          </motion.div>

          {projects.length === 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-surface-elevated/40"
                >
                  <div className="aspect-[16/9] animate-pulse bg-white/[0.04]" />
                  <div className="space-y-3 p-6">
                    <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/[0.06]" />
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/[0.06]" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-white/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-500/20 bg-gradient-to-br from-brand-900/50 via-slate-950 to-sky-950/60 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                  Next build
                </p>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Your project could be next
                </h2>
                <p className="mt-4 text-slate-300">
                  Tell us the outcome you need and we&apos;ll come back with scope, timeline, and
                  price.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Start a project
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

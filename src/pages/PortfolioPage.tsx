import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { portfolioCategories } from '@/data/portfolio'
import { siteConfig } from '@/data/site'
import { loadPublishedPortfolio, type CatalogProject } from '@/lib/portfolioCatalog'
import { cn } from '@/lib/utils'

export function PortfolioPage() {
  const [projects, setProjects] = useState<CatalogProject[]>([])
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
          {categories.length > 0 && (
            <nav
              className="mb-12 flex flex-wrap gap-x-1 gap-y-1 border-b border-white/10"
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
            className="grid gap-x-12 gap-y-14 lg:grid-cols-2"
          >
            {visible.map((project, i) => {
              const mark = project.logo ?? project.image
              return (
                <article
                  key={project.slug}
                  id={project.slug}
                  className="scroll-mt-28 border-t border-white/10 pt-7"
                >
                  <div className="flex items-start gap-4">
                    {mark ? (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 via-surface to-slate-950 p-2">
                        <img
                          src={mark}
                          alt=""
                          className="max-h-full w-auto max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/8 font-mono text-xs text-slate-600">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-400">
                        {portfolioCategories[project.category] || project.category}
                        {project.client && (
                          <span className="ml-2 font-normal normal-case tracking-normal text-slate-500">
                            {project.client}
                          </span>
                        )}
                      </p>
                      <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {project.name}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 leading-relaxed text-slate-400">{project.description}</p>

                  {project.results && project.results.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {project.results.map((result) => (
                        <li
                          key={result}
                          className="border-l border-brand-400/30 pl-4 text-sm font-medium leading-snug text-slate-200"
                        >
                          {result}
                        </li>
                      ))}
                    </ul>
                  )}

                  {project.technologies?.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
                      {project.technologies.map((tech, index) => (
                        <span key={tech} className="inline-flex items-center gap-3">
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
                </article>
              )
            })}
          </motion.div>

          {projects.length === 0 && (
            <p className="text-sm text-slate-500">Loading projects…</p>
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

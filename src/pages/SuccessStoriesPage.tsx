import { motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { portfolioCategories, portfolioProjects } from '@/data/portfolio'
import { projectVisual } from '@/data/imagery'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

export function SuccessStoriesPage() {
  const stories = portfolioProjects.filter((p) => p.results)
  const outcomeCount = stories.reduce((total, s) => total + (s.results?.length || 0), 0)

  const summary = [
    { value: String(stories.length), label: 'Case studies' },
    { value: `${outcomeCount}+`, label: 'Measured outcomes' },
    { value: '6', label: 'Sectors represented' },
    { value: '24/7', label: 'Post-launch support' },
  ]

  return (
    <>
      <SEO
        title="Success Stories"
        description="Success stories and case studies from Ellines Tech clients across Africa."
        path="/success-stories"
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.solutionsAi}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-55" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-sky-600/12 blur-[110px]" />

        <div className="section-container relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Success stories
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              Results that speak
              <span className="mt-1 block text-gradient">for themselves</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Real outcomes from real projects — what changed for organizations after we shipped.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact#quote" size="lg" icon>
                Start your story
              </Button>
              <Button href="/portfolio" variant="secondary" size="lg">
                Full portfolio
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Summary strip */}
      <section className="border-b border-white/5 bg-surface/40">
        <div className="section-container py-8 sm:py-10">
          <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
            {summary.map((item, i) => (
              <motion.div
                key={item.label}
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
                  {item.value}
                </dt>
                <dd className="mt-1.5 text-sm text-slate-500">{item.label}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="space-y-20 lg:space-y-24">
            {stories.map((story, i) => {
              const visual = projectVisual(story)
              const flip = i % 2 === 1
              return (
                <motion.article
                  key={story.slug}
                  id={story.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="group grid scroll-mt-28 items-center gap-8 lg:grid-cols-12 lg:gap-14"
                >
                  <div className={cn('lg:col-span-6', flip && 'lg:order-2')}>
                    <Link
                      to={`/portfolio#${story.slug}`}
                      className={cn(
                        'relative block overflow-hidden rounded-[1.5rem] border border-white/10',
                        visual.fit === 'contain' &&
                          'bg-gradient-to-br from-slate-900 via-surface to-slate-950',
                      )}
                    >
                      <div className="aspect-[16/10]">
                        <img
                          src={visual.src}
                          alt={story.name}
                          className={cn(
                            'h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]',
                            visual.fit === 'contain'
                              ? 'object-contain p-10'
                              : 'object-cover object-center',
                          )}
                          loading="lazy"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-4 rounded-lg bg-slate-950/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/15 backdrop-blur-md">
                        {portfolioCategories[story.category]}
                      </span>
                    </Link>
                  </div>

                  <div className={cn('lg:col-span-6', flip && 'lg:order-1')}>
                    <span className="font-mono text-[11px] tracking-[0.14em] text-slate-600">
                      Case {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[2.1rem] lg:leading-tight">
                      {story.name}
                    </h2>
                    {story.client && <p className="mt-2 text-sm text-slate-500">{story.client}</p>}
                    <p className="mt-5 leading-relaxed text-slate-300">{story.description}</p>

                    {story.results && (
                      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        {story.results.map((result) => (
                          <div key={result} className="border-l border-brand-400/30 pl-4">
                            <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              <TrendingUp className="h-3.5 w-3.5 text-brand-400" />
                              Outcome
                            </dt>
                            <dd className="mt-2 font-display text-base font-semibold leading-snug text-white">
                              {result}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
                      {story.technologies.map((tech, index) => (
                        <span key={tech} className="inline-flex items-center gap-3">
                          {tech}
                          {index < story.technologies.length - 1 && (
                            <span className="text-slate-700" aria-hidden>
                              /
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/portfolio#${story.slug}`}
                      className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200"
                    >
                      View project
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <div className="mt-20 flex flex-col gap-3 border-t border-white/10 pt-10 sm:flex-row">
            <Button href="/portfolio" icon>
              View full portfolio
            </Button>
            <Button href="/contact#quote" variant="secondary">
              Start your project
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

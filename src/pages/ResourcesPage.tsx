import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  FileText,
  BookOpen,
  Download,
  HelpCircle,
  Newspaper,
  type LucideIcon,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { CompanyMaterials } from '@/components/downloads/CompanyMaterials'
import { Button } from '@/components/ui/Button'
import { MediaBadge, MediaCard } from '@/components/ui/MediaCard'
import { knowledgeCategoryImages } from '@/data/imagery'
import { siteConfig } from '@/data/site'
import {
  defaultKnowledgeArticles,
  knowledgeCategories,
  type KnowledgeArticle,
  type KnowledgeCategory,
} from '@/data/knowledge'
import { fetchKnowledge } from '@/lib/cmsApi'

const categoryIcons: Record<KnowledgeCategory, LucideIcon> = {
  articles: Newspaper,
  tutorials: BookOpen,
  'case-studies': FileText,
  'white-papers': FileText,
  documentation: BookOpen,
  downloads: Download,
  faqs: HelpCircle,
}

export function ResourcesPage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(
    defaultKnowledgeArticles.filter((a) => a.status === 'published'),
  )
  const [error, setError] = useState('')

  useEffect(() => {
    fetchKnowledge(true)
      .then((list) => {
        const published = list.filter((a) => a.status === 'published')
        setArticles(
          published.length
            ? published
            : defaultKnowledgeArticles.filter((a) => a.status === 'published'),
        )
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Could not load Knowledge Hub')
        setArticles(defaultKnowledgeArticles.filter((a) => a.status === 'published'))
      })
  }, [])

  const byCategory = useMemo(() => {
    const map = new Map<string, KnowledgeArticle[]>()
    for (const a of articles) {
      const key = a.category || 'articles'
      const list = map.get(key) || []
      list.push(a)
      map.set(key, list)
    }
    return map
  }, [articles])

  return (
    <>
      <SEO
        title="Knowledge Hub"
        description="Articles, tutorials, case studies, white papers, documentation, and FAQs from Ellines Tech."
        path="/resources"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
        ]}
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.resourcesHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-55" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand-500/12 blur-[100px]" />
        <div className="section-container relative py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Resource center
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
              Knowledge
              <span className="mt-1 block text-gradient">hub</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Articles, tutorials, case studies, documentation, and company materials — everything
              you need to understand how we work.
            </p>
          </motion.div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-white/8 pt-8">
            {knowledgeCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-300"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-white/5 bg-surface/40">
        <div className="section-container">
          <CompanyMaterials />
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          {error && (
            <p className="mb-10 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Showing offline defaults — {error}
            </p>
          )}

          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
              Browse by type
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Everything we publish, in one place
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              Written by the same people who build the systems — practical notes rather than
              vendor marketing.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {knowledgeCategories.map((section, i) => {
              const Icon = categoryIcons[section.id]
              const items = byCategory.get(section.id) || []
              return (
                <div key={section.id} id={section.id} className="scroll-mt-28">
                  <MediaCard
                    title={section.title}
                    description={section.description}
                    image={knowledgeCategoryImages[section.id]}
                    aspect="photo"
                    index={i % 3}
                    badge={
                      <MediaBadge>
                        <Icon className="h-5 w-5" />
                      </MediaBadge>
                    }
                    overline={
                      <span className="rounded-lg bg-slate-950/65 px-2.5 py-1 font-mono text-[11px] tabular-nums tracking-[0.12em] text-slate-200 ring-1 ring-white/10 backdrop-blur-md">
                        {String(items.length).padStart(2, '0')}
                      </span>
                    }
                  >
                    <ul className="mt-5 divide-y divide-white/8 border-t border-white/8">
                      {items.length === 0 && (
                        <li className="py-3 text-sm text-slate-600">No published items yet.</li>
                      )}
                      {items.map((item) => (
                        <li key={item.id}>
                          <Link
                            to={`/resources/${item.slug}`}
                            className="group/item flex items-center justify-between gap-4 py-3 text-sm text-slate-300 transition-colors hover:text-brand-200"
                          >
                            <span>{item.title}</span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-700 transition-all group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-brand-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </MediaCard>
                </div>
              )
            })}
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
                  Put it to work
                </p>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Reading is the easy part
                </h2>
                <p className="mt-4 text-slate-300">
                  Tell us what you&apos;re trying to build and we&apos;ll turn the theory into a
                  scoped plan — timeline, price, and deliverables in writing.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Send a brief
                </Button>
                <Button href="/success-stories" variant="secondary" size="lg">
                  See the outcomes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

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
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-60" />
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

          <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {knowledgeCategories.map((section) => {
              const Icon = categoryIcons[section.id]
              const items = byCategory.get(section.id) || []
              return (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-t border-white/10 pt-7"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-brand-400" />
                    <h2 className="font-display text-lg font-semibold text-white">
                      {section.title}
                    </h2>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {section.description}
                  </p>
                  <ul className="mt-5 divide-y divide-white/8 border-t border-white/8">
                    {items.length === 0 && (
                      <li className="py-3 text-sm text-slate-600">No published items yet.</li>
                    )}
                    {items.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={`/resources/${item.slug}`}
                          className="group flex items-center justify-between gap-4 py-3 text-sm text-slate-300 transition-colors hover:text-brand-200"
                        >
                          <span>{item.title}</span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-700 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

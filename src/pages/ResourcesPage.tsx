import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  BookOpen,
  Download,
  HelpCircle,
  Newspaper,
  type LucideIcon,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
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

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Resource Center"
            title="Knowledge Hub"
            description="Articles, tutorials, case studies, documentation, and more — everything you need to learn about our technology."
            align="center"
            className="mb-10"
          />

          <div className="mb-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <CompanyMaterials />
          </div>

          {error && (
            <p className="mb-8 text-center text-sm text-amber-200/90">
              Showing offline defaults — {error}
            </p>
          )}

          <div className="mb-14 flex flex-wrap justify-center gap-2">
            {knowledgeCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-brand-400/40 hover:text-brand-200"
              >
                {cat.title}
              </a>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {knowledgeCategories.map((section) => {
              const Icon = categoryIcons[section.id]
              const items = byCategory.get(section.id) || []
              return (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  <Card
                    title={section.title}
                    description={section.description}
                    icon={<Icon className="h-6 w-6" />}
                  >
                    <ul className="mt-4 space-y-2">
                      {items.length === 0 && (
                        <li className="text-sm text-slate-500">No published items yet.</li>
                      )}
                      {items.map((item) => (
                        <li key={item.id}>
                          <Link
                            to={`/resources/${item.slug}`}
                            className="text-sm text-slate-400 transition-colors hover:text-brand-300"
                          >
                            → {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

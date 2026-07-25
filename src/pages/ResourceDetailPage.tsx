import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import {
  getDefaultArticleBySlug,
  getKnowledgeCategory,
  type KnowledgeArticle,
} from '@/data/knowledge'
import { fetchKnowledgeArticle } from '@/lib/cmsApi'

export function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<KnowledgeArticle | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError('')
    fetchKnowledgeArticle(slug)
      .then((a) => {
        if (a.status !== 'published') throw new Error('Article not published')
        setArticle(a)
      })
      .catch(() => {
        const fallback = getDefaultArticleBySlug(slug)
        if (fallback) {
          setArticle(fallback)
          return
        }
        setArticle(null)
        setError('Article not found')
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <section className="section-padding">
        <div className="section-container text-slate-400">Loading…</div>
      </section>
    )
  }

  if (error || !article) {
    return (
      <section className="section-padding">
        <div className="section-container max-w-3xl text-center">
          <h1 className="font-display text-3xl font-bold text-white">Article not found</h1>
          <p className="mt-3 text-slate-400">{error || 'This Knowledge Hub item is unavailable.'}</p>
          <Button href="/resources" className="mt-6">
            Back to Knowledge Hub
          </Button>
        </div>
      </section>
    )
  }

  const category = getKnowledgeCategory(article.category)
  const paragraphs = article.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <SEO
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        path={`/resources/${article.slug}`}
      />
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <Link
            to="/resources"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brand-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Knowledge Hub
          </Link>

          {category && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              {category.title}
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-slate-300">{article.excerpt}</p>
          )}
          {article.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 space-y-5 text-slate-400 leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>

          {(article.downloadUrl || article.htmlUrl) && (
            <div className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-brand-400/20 bg-brand-500/10 p-5">
              <p className="w-full text-sm font-medium text-brand-100">Download this material</p>
              {article.downloadUrl && (
                <a
                  href={article.downloadUrl}
                  download
                  className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
                >
                  Download PDF
                </a>
              )}
              {article.htmlUrl && (
                <a
                  href={article.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  View printable HTML
                </a>
              )}
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8">
            <Button href="/contact" icon>
              Talk to Ellines Tech
            </Button>
            <Button href="/resources" variant="secondary">
              More resources
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Download, FileText } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { ArticleShell } from '@/components/layout/ArticleShell'
import {
  getDefaultArticleBySlug,
  getKnowledgeCategory,
  type KnowledgeArticle,
} from '@/data/knowledge'
import { fetchKnowledgeArticle } from '@/lib/cmsApi'

function formatUpdated(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

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
        <div className="section-container max-w-3xl">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
          <div className="mt-6 h-10 w-3/4 animate-pulse rounded-lg bg-white/8" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/5" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-white/5" />
        </div>
      </section>
    )
  }

  if (error || !article) {
    return (
      <section className="section-padding">
        <div className="section-container max-w-xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Article not found
          </h1>
          <p className="mt-4 text-slate-400">
            {error || 'This Knowledge Hub item is unavailable.'}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/resources" icon>
              Back to Knowledge Hub
            </Button>
            <Button href="/contact" variant="secondary">
              Ask us directly
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const category = getKnowledgeCategory(article.category)
  const updated = formatUpdated(article.updatedAt)
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
        type="article"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Resources', path: '/resources' },
          { name: article.title, path: `/resources/${article.slug}` },
        ]}
      />

      <ArticleShell
        eyebrow={category?.title}
        title={article.title}
        lead={article.excerpt}
        back={{ href: '/resources', label: 'Knowledge Hub' }}
        meta={
          (updated || article.tags?.length > 0) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500">
              {updated && <span>Updated {updated}</span>}
              {updated && article.tags?.length > 0 && (
                <span className="text-slate-700" aria-hidden>
                  /
                </span>
              )}
              {article.tags?.map((tag, i) => (
                <span key={tag} className="inline-flex items-center gap-3">
                  {tag}
                  {i < article.tags.length - 1 && (
                    <span className="text-slate-700" aria-hidden>
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
          )
        }
        footer={
          <>
            {(article.downloadUrl || article.htmlUrl) && (
              <div className="mt-12 rounded-2xl border border-brand-400/20 bg-gradient-to-br from-brand-500/[0.12] via-transparent to-transparent p-6">
                <p className="font-display text-lg font-semibold text-white">
                  Take this with you
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Download the material or open the printable version.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {article.downloadUrl && (
                    <Button href={article.downloadUrl} download>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  )}
                  {article.htmlUrl && (
                    <Button href={article.htmlUrl} variant="secondary" external>
                      <FileText className="h-4 w-4" />
                      Printable version
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="mt-12 border-t border-white/10 pt-10">
              <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                Want this applied to your business?
              </h2>
              <p className="mt-3 text-slate-400">
                We turn the thinking above into working systems — send a brief and we&apos;ll scope
                it with you.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" icon>
                  Talk to Ellines Tech
                </Button>
                <Button href="/resources" variant="secondary">
                  More resources
                </Button>
              </div>
            </div>
          </>
        }
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </ArticleShell>
    </>
  )
}

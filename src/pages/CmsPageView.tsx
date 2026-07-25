import { useEffect, useState } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { fetchPage, type CmsPage } from '@/lib/cmsApi'
import { useParams, Link } from 'react-router-dom'

export function CmsPageView() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState<CmsPage | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    fetchPage(slug)
      .then((p) => {
        if (p.status !== 'published') throw new Error('Page not published')
        setPage(p)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'))
  }, [slug])

  if (error) {
    return (
      <section className="section-padding">
        <div className="section-container text-center">
          <h1 className="font-display text-3xl font-bold text-white">Page not found</h1>
          <p className="mt-3 text-slate-400">{error}</p>
          <Button href="/" className="mt-6">
            Go home
          </Button>
        </div>
      </section>
    )
  }

  if (!page) {
    return (
      <section className="section-padding">
        <div className="section-container text-slate-400">Loading…</div>
      </section>
    )
  }

  const paragraphs = page.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <SEO
        title={page.seoTitle || page.title}
        description={page.seoDescription || page.excerpt}
        path={`/p/${page.slug}`}
      />
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            Ellines Tech
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            {page.title}
          </h1>
          {page.excerpt && <p className="mt-4 text-lg text-slate-300">{page.excerpt}</p>}
          <div className="mt-10 space-y-5 text-slate-400 leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <Link to="/contact" className="mt-10 inline-block text-sm font-semibold text-brand-300">
            Contact Ellines Tech →
          </Link>
        </div>
      </section>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { ArticleShell } from '@/components/layout/ArticleShell'
import { fetchPage, type CmsPage } from '@/lib/cmsApi'
import { isAdminAuthed } from '@/lib/engagementStore'
import { siteConfig } from '@/data/site'

export function CmsPageView() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState<CmsPage | null>(null)
  const [error, setError] = useState('')
  const canPreview = isAdminAuthed()

  useEffect(() => {
    if (!slug) return
    fetchPage(slug, canPreview)
      .then((p) => {
        if (p.status !== 'published' && !canPreview) throw new Error('Page not published')
        setPage(p)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'))
  }, [slug, canPreview])

  if (error) {
    return (
      <section className="section-padding">
        <div className="section-container max-w-xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Page not found
          </h1>
          <p className="mt-4 text-slate-400">{error}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/" icon>
              Go home
            </Button>
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!page) {
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
        type="article"
        noindex={page.status !== 'published'}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: page.title, path: `/p/${page.slug}` },
        ]}
        jsonLd={{
          '@type': 'Article',
          headline: page.seoTitle || page.title,
          description: page.seoDescription || page.excerpt,
          dateModified: page.updatedAt || undefined,
          author: { '@type': 'Organization', name: siteConfig.name },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            logo: {
              '@type': 'ImageObject',
              url: `${siteConfig.url}/logos/logo-mark.png`,
            },
          },
          mainEntityOfPage: `${siteConfig.url}/p/${page.slug}`,
        }}
      />

      {page.status !== 'published' && (
        <div className="border-b border-amber-400/25 bg-amber-500/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          Draft preview — not visible to visitors
        </div>
      )}

      <ArticleShell
        eyebrow={siteConfig.name}
        title={page.title}
        lead={page.excerpt}
        footer={
          <div className="mt-12 border-t border-white/10 pt-10">
            <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              Questions about this?
            </h2>
            <p className="mt-3 text-slate-400">
              We&apos;re available 24/7 — reach a real person by brief, email, or WhatsApp.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact#quote" icon>
                Contact Ellines Tech
              </Button>
              <Button href="/services" variant="secondary">
                Browse services
              </Button>
            </div>
          </div>
        }
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </ArticleShell>
    </>
  )
}

import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { ArticleShell } from '@/components/layout/ArticleShell'
import { siteConfig } from '@/data/site'
import { findRoutePage, loadPublishedRoutePages } from '@/lib/routePages'
import type { CmsPage } from '@/lib/cmsApi'

function toParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function DraftRibbon() {
  return (
    <div className="border-b border-amber-400/25 bg-amber-500/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
      Draft preview — not visible to visitors
    </div>
  )
}

/**
 * Renders CMS content attached to the current site route. Pages saved in
 * "append" mode add a section under the built-in page; "replace" mode swaps the
 * built-in page out entirely. Routes without a record render untouched.
 */
export function CmsRouteContent({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [pages, setPages] = useState<CmsPage[] | null>(null)

  useEffect(() => {
    let active = true
    // loadPublishedRoutePages is already cached — only fires a real fetch once
    // per session (or when the admin auth state changes). Re-calling on every
    // pathname change only hit the cache, but we can be even cheaper: load once
    // on mount and trust the in-memory cache for subsequent navigation.
    loadPublishedRoutePages().then((list) => {
      if (active) setPages(list)
    })
    return () => {
      active = false
    }
    // NOTE: intentionally omitting location.pathname — the cache is keyed by
    // admin state, not route. Re-fetching on every navigation was firing a new
    // API call on every page-to-page navigate because the old promise had already
    // resolved and the effect re-ran, bypassing the cache with a new Promise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const page = pages ? findRoutePage(pages, location.pathname) : undefined
  if (!page) return <>{children}</>

  const paragraphs = toParagraphs(page.body || '')
  const isDraft = page.status !== 'published'

  if (page.mode === 'replace') {
    return (
      <>
        <SEO
          title={page.seoTitle || page.title}
          description={page.seoDescription || page.excerpt}
          path={page.path || location.pathname}
        />
        {isDraft && <DraftRibbon />}
        <ArticleShell eyebrow={siteConfig.name} title={page.title} lead={page.excerpt}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </ArticleShell>
      </>
    )
  }

  return (
    <>
      {isDraft && <DraftRibbon />}
      {children}
      {(page.title || paragraphs.length > 0) && (
        <section className="section-padding border-t border-white/5">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {page.title}
            </h2>
            {page.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-slate-300/95">{page.excerpt}</p>
            )}
            <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.75] text-slate-300">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

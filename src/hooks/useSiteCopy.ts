import { useEffect, useState } from 'react'
import { fetchSiteCopy } from '@/lib/cmsApi'
import { aboutStory, homeCopy } from '@/data/content'
import { siteConfig } from '@/data/site'

type SiteCopy = {
  home?: Partial<{
    heroHeadline: string
    heroSub: string
    storyTitle: string
    storyBody: string
    groupTitle: string
    groupBody: string
  }>
  about?: Partial<{
    title: string
    lead: string
    groupTitle: string
    groupBody: string
  }>
  contact?: Partial<{
    title: string
    lead: string
    formNote: string
  }>
  solutions?: Partial<{
    title: string
    lead: string
  }>
  faq?: { q: string; a: string }[]
  clientBrands?: {
    id: string
    name: string
    logo: string
    category: string
    work: string
  }[]
}

// Module-level cache: fetched once per session, shared across all components
// that call useSiteCopy. Previously every consumer (HomePage, AboutPage, etc.)
// fired its own independent network request — this caused 3-5 redundant calls
// on pages that compose multiple hooks.
let siteCopyCache: SiteCopy | null = null
let siteCopyPromise: Promise<SiteCopy> | null = null

function loadSiteCopy(): Promise<SiteCopy> {
  if (siteCopyCache) return Promise.resolve(siteCopyCache)
  if (!siteCopyPromise) {
    siteCopyPromise = fetchSiteCopy()
      .then((data: unknown) => {
        siteCopyCache = (data as SiteCopy) || {}
        return siteCopyCache as SiteCopy
      })
      .catch(() => {
        siteCopyPromise = null // allow retry on next call
        return {} as SiteCopy
      })
  }
  return siteCopyPromise as Promise<SiteCopy>
}

export function useSiteCopy() {
  const [copy, setCopy] = useState<SiteCopy>(() => siteCopyCache ?? {})

  useEffect(() => {
    if (siteCopyCache) return // already loaded — no fetch needed
    let active = true
    loadSiteCopy().then((data) => {
      if (active) setCopy(data)
    })
    return () => {
      active = false
    }
  }, [])

  return {
    home: {
      storyTitle: copy.home?.storyTitle || homeCopy.storyTitle,
      storyBody: copy.home?.storyBody || homeCopy.storyBody,
      heroHeadline: copy.home?.heroHeadline,
      heroSub: copy.home?.heroSub,
      groupTitle: copy.home?.groupTitle || siteConfig.group.name,
      groupBody: copy.home?.groupBody || siteConfig.group.description,
    },
    about: {
      title: copy.about?.title || aboutStory.title,
      lead: copy.about?.lead || aboutStory.lead,
      groupTitle: copy.about?.groupTitle || siteConfig.group.name,
      groupBody: copy.about?.groupBody || siteConfig.group.description,
    },
    contact: {
      title: copy.contact?.title || "Let's build something great",
      lead:
        copy.contact?.lead ||
        'Project inquiries, demos, partnerships, or support — send a brief and a real person responds. We work with teams across Kenya, Africa, and beyond.',
      formNote: copy.contact?.formNote || '',
    },
    solutions: {
      title: copy.solutions?.title || 'Integrated technology solutions',
      lead:
        copy.solutions?.lead ||
        'Products, services, and engineering expertise combined to solve complex business problems end to end.',
    },
    faq: copy.faq,
    clientBrands: copy.clientBrands,
    raw: copy,
  }
}

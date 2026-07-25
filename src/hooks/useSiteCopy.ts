import { useEffect, useState } from 'react'
import { fetchSiteCopy } from '@/lib/cmsApi'
import { aboutStory, homeCopy } from '@/data/content'

type SiteCopy = {
  home?: Partial<{
    heroHeadline: string
    heroSub: string
    storyTitle: string
    storyBody: string
  }>
  about?: Partial<{
    title: string
    lead: string
  }>
  faq?: { q: string; a: string }[]
}

export function useSiteCopy() {
  const [copy, setCopy] = useState<SiteCopy>({})

  useEffect(() => {
    fetchSiteCopy()
      .then((data) => setCopy(data || {}))
      .catch(() => undefined)
  }, [])

  return {
    home: {
      storyTitle: copy.home?.storyTitle || homeCopy.storyTitle,
      storyBody: copy.home?.storyBody || homeCopy.storyBody,
      heroHeadline: copy.home?.heroHeadline,
      heroSub: copy.home?.heroSub,
    },
    about: {
      title: copy.about?.title || aboutStory.title,
      lead: copy.about?.lead || aboutStory.lead,
    },
    faq: copy.faq,
  }
}

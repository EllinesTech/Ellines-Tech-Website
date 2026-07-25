import { useEffect } from 'react'
import { siteConfig } from '@/data/site'

interface SEOProps {
  title?: string
  description?: string
  path?: string
  image?: string
  noindex?: boolean
  type?: 'website' | 'article'
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function SEO({
  title,
  description,
  path = '',
  image,
  noindex = false,
  type = 'website',
}: SEOProps) {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  const pageDescription = description ?? siteConfig.description
  const url = `${siteConfig.url}${path}`
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${siteConfig.url}${image}`
    : `${siteConfig.url}${siteConfig.logos.hero || siteConfig.media.techHero}`

  useEffect(() => {
    document.title = pageTitle
    setMeta('description', pageDescription)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setMeta('author', siteConfig.name)
    setMeta('og:title', pageTitle, true)
    setMeta('og:description', pageDescription, true)
    setMeta('og:url', url, true)
    setMeta('og:type', type, true)
    setMeta('og:site_name', siteConfig.name, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:locale', 'en_KE', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', pageTitle)
    setMeta('twitter:description', pageDescription)
    setMeta('twitter:image', ogImage)

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    setJsonLd('ld-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.logos.mark}`,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
      sameAs: Object.values(siteConfig.social || {}),
    })

    setJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      alternateName: ['EllinesTech', 'Ellines Technology'],
      url: siteConfig.url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/services?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    })
  }, [pageTitle, pageDescription, url, ogImage, noindex, type])

  return null
}

import { useEffect } from 'react'
import { siteConfig } from '@/data/site'
import { locationCities, locations, primaryLocation } from '@/data/locations'

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

const DEFAULT_OG_IMAGE = '/logos/logo-full-bg.png'

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
    : `${siteConfig.name} | ${siteConfig.tagline}`
  const pageDescription = description ?? siteConfig.description
  const url = `${siteConfig.url}${path || '/'}`
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${siteConfig.url}${image}`
    : `${siteConfig.url}${DEFAULT_OG_IMAGE}`

  useEffect(() => {
    document.title = pageTitle
    setMeta('description', pageDescription)
    setMeta(
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    )
    setMeta('author', siteConfig.name)
    setMeta('geo.region', 'KE')
    setMeta('geo.placename', locationCities.join('; '))
    setMeta('geo.position', `${primaryLocation.coords.lat};${primaryLocation.coords.lng}`)
    setMeta('ICBM', `${primaryLocation.coords.lat}, ${primaryLocation.coords.lng}`)
    setMeta('og:title', pageTitle, true)
    setMeta('og:description', pageDescription, true)
    setMeta('og:url', url, true)
    setMeta('og:type', type, true)
    setMeta('og:site_name', siteConfig.name, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:image:alt', `${siteConfig.name} — ${siteConfig.tagline}`, true)
    setMeta('og:locale', 'en_KE', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', pageTitle)
    setMeta('twitter:description', pageDescription)
    setMeta('twitter:image', ogImage)
    setMeta('twitter:image:alt', `${siteConfig.name} — ${siteConfig.tagline}`)

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
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      alternateName: ['EllinesTech', 'Ellines Technology'],
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.logos.mark}`,
      },
      image: `${siteConfig.url}/logos/logo-full-bg.png`,
      email: siteConfig.email,
      telephone: siteConfig.phone.replace(/\s+/g, ''),
      address: locations.map((loc) => ({
        '@type': 'PostalAddress',
        ...(loc.street ? { streetAddress: loc.street } : {}),
        addressLocality: loc.city,
        addressRegion: loc.region,
        addressCountry: loc.countryCode,
      })),
      location: locations.map((loc) => ({
        '@type': 'Place',
        name: `${siteConfig.name} — ${loc.city}`,
        address: {
          '@type': 'PostalAddress',
          ...(loc.street ? { streetAddress: loc.street } : {}),
          addressLocality: loc.city,
          addressRegion: loc.region,
          addressCountry: loc.countryCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: loc.coords.lat,
          longitude: loc.coords.lng,
        },
      })),
      areaServed: ['KE', 'Africa'],
      parentOrganization: {
        '@type': 'Organization',
        name: siteConfig.group.name,
        description: siteConfig.group.description,
        brand: siteConfig.groupBrands.map((brand) => ({
          '@type': 'Brand',
          name: brand.name,
          url: brand.url,
          description: brand.description,
        })),
      },
      sameAs: Object.values(siteConfig.social || {}),
    })

    setJsonLd('ld-local', {
      '@context': 'https://schema.org',
      '@graph': locations.map((loc) => ({
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}/#localbusiness-${loc.id}`,
        name: `${siteConfig.name} — ${loc.city}`,
        branchOf: { '@id': `${siteConfig.url}/#organization` },
        url: siteConfig.url,
        image: `${siteConfig.url}/logos/logo-full-bg.png`,
        email: siteConfig.email,
        telephone: siteConfig.phone.replace(/\s+/g, ''),
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          ...(loc.street ? { streetAddress: loc.street } : {}),
          addressLocality: loc.city,
          addressRegion: loc.region,
          addressCountry: loc.countryCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: loc.coords.lat,
          longitude: loc.coords.lng,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Kenya',
        },
        knowsAbout: [
          'Software development',
          'Web design',
          'IT consulting',
          'Artificial intelligence',
          'Digital marketing',
          'Cyber security',
          'Resume and CV services',
        ],
        parentOrganization: { '@id': `${siteConfig.url}/#organization` },
      })),
    })

    setJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: siteConfig.name,
      alternateName: ['EllinesTech', 'Ellines Technology'],
      url: siteConfig.url,
      publisher: { '@id': `${siteConfig.url}/#organization` },
      inLanguage: 'en-KE',
    })
  }, [pageTitle, pageDescription, url, ogImage, noindex, type])

  return null
}

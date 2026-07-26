/**
 * Single source of truth for Ellines Tech physical locations.
 *
 * Keep addresses, coordinates, map embeds, and maps links here so the Contact
 * page, Footer, structured data, invoices, and CMS defaults never drift apart.
 */

export interface OfficeLocation {
  id: 'nyeri' | 'nairobi'
  city: string
  /** Short badge copy — e.g. "Head office" */
  role: string
  /** Full one-line address as we are willing to publish it */
  address: string
  /** Street portion only, when we have one. Empty when we only publish the city. */
  street: string
  region: string
  country: string
  countryCode: string
  /** Honest one-liner about what happens at this location */
  note: string
  coords: { lat: number; lng: number }
  /** Degrees of longitude/latitude either side of the marker for the map frame */
  span: number
}

const BASE: OfficeLocation[] = [
  {
    id: 'nyeri',
    city: 'Nyeri',
    role: 'Head office',
    address: 'Square2 Street, Skt, Nyeri, Kenya',
    street: 'Square2 Street, Skt',
    region: 'Nyeri County',
    country: 'Kenya',
    countryCode: 'KE',
    note: 'Where the team builds day to day — walk-ins, workshops, and delivery.',
    coords: { lat: -0.4201, lng: 36.9476 },
    span: 0.035,
  },
  {
    id: 'nairobi',
    city: 'Nairobi',
    role: 'Nairobi presence',
    address: 'Nairobi, Kenya',
    street: '',
    region: 'Nairobi County',
    country: 'Kenya',
    countryCode: 'KE',
    note: 'Client meetings, pitches, and on-site sessions across Nairobi by appointment.',
    coords: { lat: -1.286389, lng: 36.817223 },
    span: 0.09,
  },
]

/** OpenStreetMap embed framed on the marker — matches the dark map treatment used site-wide. */
export function mapEmbedUrl(location: OfficeLocation): string {
  const { lat, lng } = location.coords
  const s = location.span
  const bbox = [lng - s, lat - s * 0.7, lng + s, lat + s * 0.7]
    .map((n) => n.toFixed(4))
    .join('%2C')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function directionsUrl(location: OfficeLocation): string {
  return mapsSearchUrl(`${location.address}`)
}

export const locations = BASE

export const primaryLocation = BASE[0]

/** "Nyeri" / "Nairobi" */
export const locationCities = BASE.map((l) => l.city)

/** "Nyeri & Nairobi, Kenya" — the short line used in footers, invoices, and meta copy. */
export const locationLine = `${locationCities.join(' & ')}, Kenya`

/** Sentence-length version for prose and SEO descriptions. */
export const locationSentence = `Ellines Tech operates from ${primaryLocation.address}, with a Nairobi presence for client meetings and on-site work.`

export function findLocation(id: OfficeLocation['id']): OfficeLocation {
  return BASE.find((l) => l.id === id) ?? BASE[0]
}

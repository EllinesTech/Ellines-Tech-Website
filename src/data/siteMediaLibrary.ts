import { packagePosterMap } from './posterMap'
import { siteConfig } from './site'

export type SiteMediaItem = {
  id: string
  label: string
  src: string
  group: 'banners' | 'scenes' | 'packages'
}

/** Browseable site photo library for Admin → Site Photos */
export function getSiteMediaLibrary(): SiteMediaItem[] {
  const banners = Object.entries(siteConfig.media.banners).map(([key, src]) => ({
    id: `banner_${key}`,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
    src,
    group: 'banners' as const,
  }))

  const scenes = Object.entries(siteConfig.media.scenes).map(([key, src]) => ({
    id: `scene_${key}`,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()),
    src,
    group: 'scenes' as const,
  }))

  const packages = Object.entries(packagePosterMap).map(([id, src]) => ({
    id,
    label: id.replace(/_/g, ' '),
    src,
    group: 'packages' as const,
  }))

  return [...banners, ...scenes, ...packages]
}

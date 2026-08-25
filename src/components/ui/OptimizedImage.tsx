import type { ImgHTMLAttributes } from 'react'

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  eager?: boolean
}

/**
 * Optimized image component with lazy loading by default
 * Use eager={true} for above-the-fold images only
 */
export function OptimizedImage({ 
  src, 
  alt, 
  eager = false, 
  className,
  ...props 
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      {...props}
    />
  )
}

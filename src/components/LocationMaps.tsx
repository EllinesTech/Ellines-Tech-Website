import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { directionsUrl, locations, mapEmbedUrl } from '@/data/locations'
import { siteConfig } from '@/data/site'

interface LocationMapsProps {
  /** `compact` trims the map height and copy for use inside denser pages. */
  variant?: 'default' | 'compact'
  className?: string
}

export function LocationMaps({ variant = 'default', className = '' }: LocationMapsProps) {
  const compact = variant === 'compact'

  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {locations.map((location, i) => (
        <motion.div
          key={location.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02] transition-colors hover:border-brand-500/30"
        >
          <div
            className={`relative overflow-hidden border-b border-white/8 ${
              compact ? 'h-40' : 'h-52 sm:h-56'
            }`}
          >
            <iframe
              title={`Map of ${siteConfig.name} — ${location.city}`}
              src={mapEmbedUrl(location)}
              className="h-full w-full grayscale invert-[0.92] contrast-[1.15]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/20" />
            <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-slate-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-300 backdrop-blur">
              {location.role}
            </span>
          </div>

          <div className={compact ? 'p-5' : 'p-5 sm:p-6'}>
            <h3
              className={`font-display font-bold text-white ${compact ? 'text-lg' : 'text-xl'}`}
            >
              {location.city}
            </h3>
            <p className="mt-2 flex items-start gap-2 text-sm text-slate-300">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span>{location.address}</span>
            </p>
            {!compact && (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">{location.note}</p>
            )}
            <a
              href={directionsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200 ${
                compact ? 'mt-4' : 'mt-5'
              }`}
            >
              Open {location.city} in Maps
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

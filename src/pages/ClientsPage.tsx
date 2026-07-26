import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { MediaCard } from '@/components/ui/MediaCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { clientSectors } from '@/data/clients'
import { siteConfig } from '@/data/site'
import {
  loadClientBrands,
  staticClientBrands,
  type CatalogClientBrand,
} from '@/lib/clientBrandsCatalog'

export function ClientsPage() {
  const [brands, setBrands] = useState<CatalogClientBrand[]>(() => staticClientBrands())

  useEffect(() => {
    void loadClientBrands().then(setBrands)
  }, [])

  return (
    <>
      <SEO
        title="Clients"
        description="Organizations and brands that trust Ellines Tech for software, AI, logos, and digital transformation."
        path="/clients"
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.banners.aboutHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-55" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-brand-500/12 blur-[110px]" />

        <div className="section-container relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Clients &amp; brands
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              Trusted by the teams
              <span className="mt-1 block text-gradient">we build with</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              From healthcare platforms to brand identities — businesses Ellines Tech has created
              for and worked alongside across Kenya and Africa.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact#quote" size="lg" icon>
                Become a client
              </Button>
              <Button href="/portfolio" variant="secondary" size="lg">
                View portfolio
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col items-center rounded-2xl border border-white/10 bg-surface-elevated/40 p-5 text-center transition-colors hover:border-brand-400/25 sm:p-6"
              >
                <div className="flex h-20 w-full items-center justify-center rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/5">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-14 w-auto max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold text-white sm:text-base">
                  {brand.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{brand.work}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <SectionHeader
            eyebrow="Sectors"
            title="Where we deliver"
            description={`${siteConfig.name} serves organizations across Africa — software, AI, and brand craft.`}
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clientSectors.map((sector, i) => (
              <MediaCard
                key={sector.name}
                title={sector.name}
                description={sector.description}
                image={sector.image}
                aspect="photo"
                index={i % 3}
                badge={
                  <span className="rounded-xl bg-slate-950/70 px-3 py-1.5 font-display text-lg font-bold tabular-nums text-brand-200 ring-1 ring-brand-400/25 backdrop-blur-md">
                    {sector.count}
                  </span>
                }
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/contact#quote" icon>
              Become a client
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { clientBrands, clientSectors } from '@/data/clients'
import { siteConfig } from '@/data/site'

export function ClientsPage() {
  return (
    <>
      <SEO
        title="Clients"
        description="Organizations and brands that trust Ellines Tech for software, AI, logos, and digital transformation."
        path="/clients"
      />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Clients & Brands"
            title="Trusted by organizations we build with"
            description="From healthcare platforms to brand identities — businesses Ellines Tech has created for and worked alongside."
            align="center"
            className="mb-14"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {clientBrands.map((brand, i) => (
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
            {clientSectors.map((sector) => (
              <div
                key={sector.name}
                className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-8 text-center"
              >
                <p className="font-display text-3xl font-bold text-brand-300">{sector.count}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  {sector.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{sector.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

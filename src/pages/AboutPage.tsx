import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/data/site'
import { Target, Eye, Heart, Users } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Mission',
    description:
      'Empower African businesses with world-class technology that drives growth, efficiency, and innovation.',
  },
  {
    icon: Eye,
    title: 'Vision',
    description:
      "Become Africa's most trusted technology partner — building the digital infrastructure of tomorrow.",
  },
  {
    icon: Heart,
    title: 'Values',
    description:
      'Integrity, excellence, innovation, and client success guide everything we do.',
  },
  {
    icon: Users,
    title: 'Team',
    description:
      'A passionate team of developers, designers, and strategists committed to delivering exceptional results.',
  },
]

export function AboutPage() {
  const { founder } = siteConfig

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Ellines Tech — founded by Elijah Mwangi M as part of Ellines Group — our mission, vision, and commitment to transforming Africa through technology."
        path="/about"
      />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="About Ellines Tech"
            title="Africa's Technology Partner"
            description="Ellines Tech is the software, AI, cloud, and digital transformation company of Ellines Group — building enterprise systems, healthcare platforms, and intelligent solutions for organizations across Africa."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                Ellines Tech is consolidating under{' '}
                <span className="text-slate-200">{siteConfig.url.replace('https://', '')}</span>
                {' '}
                — our official digital headquarters for products, services, and client engagement.
              </p>
              <p>
                Our product portfolio includes MedFlow Hospital Management System, AfyaVox AI Clinical
                Assistant, RV22 AI Assistant, and dozens of business solutions — each designed with
                African market needs in mind.
              </p>
              <p>
                From custom software development to cloud migration and AI implementation, we partner
                with clients at every stage of their digital transformation journey.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-6"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder — premium trust section */}
      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative lg:col-span-5"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/20 via-transparent to-sky-700/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface-elevated shadow-2xl shadow-black/40">
                <img
                  src={founder.images.primary}
                  alt={`${founder.name}, ${founder.role}`}
                  className="aspect-[4/5] w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent px-6 pb-6 pt-24">
                  <p className="font-display text-xl font-bold text-white">{founder.name}</p>
                  <p className="mt-1 text-sm font-medium text-brand-300">{founder.role}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="lg:col-span-7"
            >
              <SectionHeader
                eyebrow="Leadership"
                title="Founded by Elijah Mwangi M"
                description={founder.bio}
              />
              <p className="mt-6 max-w-xl text-slate-400 leading-relaxed">
                Ellines Tech is the technology arm of {siteConfig.group.name} — an ecosystem spanning
                software, publishing, and commerce. We build systems that scale with African
                organizations: healthcare platforms, AI assistants, cloud infrastructure, and custom
                enterprise software.
              </p>
              <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                {siteConfig.motto}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/contact" icon>
                  Work With Us
                </Button>
                <Button href="/products" variant="secondary">
                  Explore Products
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {founder.images.gallery.slice(0, 4).map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated"
              >
                <img
                  src={src}
                  alt={`${founder.name} — portrait ${i + 1}`}
                  className="aspect-[4/5] w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow="Ellines Group"
            title="Part of a Growing Ecosystem"
            description="Sister brands under Ellines Group — complementary ventures alongside Ellines Tech."
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-brand-500/25 bg-brand-500/5 p-6">
              <span className="inline-flex rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-300">
                This site
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">Ellines Tech</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Software development, AI, cloud, and digital transformation — our flagship technology
                company.
              </p>
              <p className="mt-4 text-sm text-brand-400">{siteConfig.url.replace('https://', '')}</p>
            </article>

            {siteConfig.sisterBrands.map((brand) => (
              <article
                key={brand.name}
                className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-6"
              >
                <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
                  {brand.status === 'live' ? 'Live' : 'Coming soon'}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{brand.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{brand.description}</p>
                {brand.url ? (
                  <a
                    href={brand.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
                  >
                    Visit site <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">Website in progress</p>
                )}
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button href="/contact" size="lg" icon>
              Work With Ellines Tech
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { GroupEcosystem } from '@/components/home/GroupEcosystem'
import { CompanyMaterials } from '@/components/downloads/CompanyMaterials'
import { LocationMaps } from '@/components/LocationMaps'
import { aboutStory } from '@/data/content'
import { locations } from '@/data/locations'
import { siteConfig } from '@/data/site'
import { useSiteCopy } from '@/hooks/useSiteCopy'
import { useSiteProfile } from '@/context/SiteProfileContext'
import { Target, Eye, Heart, Users } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Mission',
    description:
      'Empower businesses with world-class technology that drives growth, efficiency, and innovation.',
  },
  {
    icon: Eye,
    title: 'Vision',
    description:
      'Become a trusted technology partner — building digital infrastructure that scales with ambitious organizations.',
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
  const { about: liveAbout } = useSiteCopy()
  const { profile } = useSiteProfile()
  const waHref = `https://wa.me/${(profile.whatsapp || siteConfig.whatsapp).replace(/\D/g, '')}`

  return (
    <>
      <SEO
        title="About — IT Company in Kenya"
        description="About Ellines Tech — a software, web design, AI, and IT consulting company with offices in Nyeri and Nairobi, serving businesses across Kenya and Africa."
        path="/about"
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.banners.aboutHero}
          alt="About Ellines Tech"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/65" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="section-container relative py-20 sm:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              {aboutStory.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.75rem]">
              {liveAbout.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">{liveAbout.lead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact#quote" size="lg" icon>
                Start a project
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Browse services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-6 text-slate-400 leading-relaxed lg:col-span-6">
              {aboutStory.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
              <p>
                Visit us at{' '}
                <span className="text-slate-200">{siteConfig.url.replace('https://', '')}</span> —
                the digital headquarters of Ellines Tech, part of {siteConfig.group.name}.
              </p>
            </div>
            <div className="relative lg:col-span-6">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-500/20 via-transparent to-sky-700/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/40">
                <img
                  src={siteConfig.media.banners.aboutStory}
                  alt="Ellines Tech — who we are"
                  className="aspect-[5/4] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-brand-400" />
                  <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Execute story — from live about page */}
      <section className="relative overflow-hidden border-y border-white/5">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-full">
            <img
              src={siteConfig.media.banners.execute}
              alt="Ellines Tech executes ideas from start to finish"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-slate-950/80" />
          </div>
          <div className="section-padding bg-surface/60 px-6 sm:px-10 lg:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
              Ellines Tech
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-white sm:text-4xl">
              {aboutStory.executeTitle}
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-slate-400 leading-relaxed">
              {aboutStory.executeBody.map((paragraph) => (
                <p key={paragraph.slice(0, 28)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <Button href="/contact#quote" icon>
                Start a Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5 bg-surface/35">
        <div className="section-container">
          <SectionHeader
            eyebrow="Capabilities"
            title="What we stand behind"
            description="High-quality products and services drawn from how Ellines Tech serves clients today."
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {aboutStory.capabilities.map((item, i) => {
              const capabilityImages: Record<string, string> = {
                'Web Development': siteConfig.media.scenes.webDesign,
                'AI Development': siteConfig.media.scenes.aiVisual,
                'Startup IT Solutions': siteConfig.media.scenes.solutionsAi,
              }
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-surface-elevated/30"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={capabilityImages[item.title] || siteConfig.media.scenes.workspace}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founder */}
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
                title={`Founded by ${founder.name}`}
                description={founder.bio}
              />
              <p className="mt-6 max-w-xl text-slate-400 leading-relaxed">
                Ellines Tech is the technology arm of {siteConfig.group.name} — alongside Ellines
                Haven and Ellines Rattan (Furniture). We build systems that scale: healthcare
                platforms, AI assistants, cloud infrastructure, and custom enterprise software.
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

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            {founder.images.gallery.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
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

      <section className="section-padding border-t border-white/5 bg-surface/30">
        <div className="section-container">
          <SectionHeader
            eyebrow="Where we are"
            title={`Based in ${locations.map((l) => l.city).join(' and ')}`}
            description="A head office in Nyeri and a working presence in Nairobi — with remote-first delivery for clients across Kenya, Africa, and beyond."
          />
          <LocationMaps className="mt-12" variant="compact" />
        </div>
      </section>

      <GroupEcosystem title={liveAbout.groupTitle} description={liveAbout.groupBody} />

      <section className="section-padding border-t border-white/5 bg-surface/30">
        <div className="section-container">
          <CompanyMaterials />
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-slate-950 to-sky-950/90" />
            <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 opacity-20">
              <img
                src={siteConfig.logos.mark}
                alt=""
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                  Work with us
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Let&apos;s build the system your business runs on
                </h2>
                <p className="mt-4 max-w-xl text-lg text-slate-300">
                  Tell us the outcome you need. We&apos;ll come back with scope, timeline, and a
                  price — usually within a few hours.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/contact#quote" size="lg" icon>
                    Start a project
                  </Button>
                  <Button href={waHref} variant="secondary" size="lg" external>
                    WhatsApp us
                  </Button>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                  {siteConfig.emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="transition-colors hover:text-brand-300"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

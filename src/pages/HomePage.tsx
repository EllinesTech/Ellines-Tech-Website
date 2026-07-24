import { motion } from 'framer-motion'
import {
  Sparkles,
  Shield,
  Zap,
  Globe2,
  Brain,
  Cloud,
  Code2,
  Globe,
  Smartphone,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SEO } from '@/components/SEO'
import { HeroVisual } from '@/components/home/HeroVisual'
import { GroupEcosystem } from '@/components/home/GroupEcosystem'
import { products } from '@/data/products'
import { services, serviceCategories } from '@/data/services'
import { industries } from '@/data/industries'
import { portfolioProjects } from '@/data/portfolio'
import { siteConfig, technologies } from '@/data/site'

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Smartphone,
  Brain,
  Cloud,
  Shield,
  Lightbulb,
}

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '25+', label: 'Products & Solutions' },
  { value: '12', label: 'Industries Served' },
  { value: '3+', label: 'Years Building' },
]

const valueProps = [
  {
    icon: Sparkles,
    title: 'Perfect Business Solutions',
    description:
      'We provide perfect business solutions tailored to your unique needs, ensuring efficiency and effectiveness in every aspect of your operations.',
    image: '/founder/elijah-4.jpg',
  },
  {
    icon: Zap,
    title: 'Business Growth Planning',
    description:
      'Our business growth planning services help you strategize for the future, identifying opportunities and creating actionable plans to achieve your goals.',
    image: '/founder/elijah-5.jpg',
  },
  {
    icon: Shield,
    title: 'Strategic Development',
    description:
      'We specialize in comprehensive strategy development, guiding you through market challenges and positioning your business for long-term success.',
    image: '/founder/elijah-2.jpg',
  },
  {
    icon: Globe2,
    title: 'Expert Tech Services',
    description:
      'We provide expert tech services tailored to your needs, ensuring optimal performance and support for your business.',
    image: '/founder/elijah-1.jpg',
  },
]

const productVisuals = [
  '/founder/elijah-3.jpg',
  '/founder/elijah-1.jpg',
  '/founder/elijah-2.jpg',
  '/media/posters/ellines-rebranding.png',
]

export function HomePage() {
  const featuredProducts = products.filter((p) => p.highlights).slice(0, 4)
  const featuredServices = Object.entries(serviceCategories).slice(0, 6)
  const featuredPortfolio = portfolioProjects.slice(0, 6)
  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`

  return (
    <>
      <SEO />

      {/* Hero — brand typography + one product canvas (no 3D logo dump) */}
      <section className="relative overflow-hidden mesh-bg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-brand-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-sky-600/12 blur-[110px]" />

        <div className="section-container relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-14 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.32em] text-brand-300/90">
                {siteConfig.motto}
              </p>

              <h1 className="font-display text-[2.75rem] font-extrabold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.25rem] xl:text-[4.6rem]">
                <span className="block">Ellines</span>
                <span className="mt-1 block text-gradient">Tech</span>
              </h1>

              <p className="mt-7 max-w-md text-lg leading-relaxed text-slate-300/95 sm:text-xl">
                Software applications, mobile apps, and digital solutions — executed from start to
                finish for businesses that need technology built to last.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/contact#quote" size="lg" icon>
                  Start Your Project
                </Button>
                <Button href="/products" variant="secondary" size="lg">
                  Explore Products
                </Button>
              </div>

              <p className="mt-8 text-sm text-slate-500">
                Part of{' '}
                <span className="text-slate-400">{siteConfig.group.name}</span>
                {' · '}
                {siteConfig.url.replace('https://', '')}
              </p>
            </motion.div>

            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Tech trust strip */}
      <section className="overflow-hidden border-y border-white/5 bg-surface/50 py-5">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:justify-between">
            {technologies.slice(0, 8).map((tech) => (
              <span
                key={tech}
                className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/5 py-12 sm:py-14">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-4xl font-bold tracking-tight text-brand-300 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Storytelling — full-bleed founder visual */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <img
          src={siteConfig.founder.images.primary}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        <div className="section-container relative flex min-h-[70vh] items-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              About Our Company
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              We execute ideas from start to finish
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Based in Kenya, Ellines Tech crafts cutting-edge software and mobile apps for clients
              around the globe — with excellence, innovation, and client satisfaction at the core.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/about" icon>
                Our Story
              </Button>
              <Button href="/contact#quote" variant="secondary">
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why choose — media cards */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow="Why Ellines Tech"
            title="Why you should choose our services"
            description="From idea to deployment, we execute meticulously — quality, innovation, and results that align with your vision."
            align="center"
            className="mb-14"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-surface-elevated/30"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-400/30 backdrop-blur-md">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ellines Group — Tech, Haven, Rattan */}
      <GroupEcosystem className="bg-surface/35" />

      {/* Products */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Products"
              title="Our product ecosystem"
              description="Every Ellines Tech product has a dedicated platform — from hospital management to AI assistants."
            />
            <Button href="/products" variant="ghost" icon>
              View All Products
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <Card
                key={product.slug}
                title={product.name}
                description={product.tagline}
                href={`/products/${product.slug}`}
                tag={product.highlights?.[0]}
                image={productVisuals[i % productVisuals.length]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <SectionHeader
            eyebrow="Services"
            title="End-to-end technology services"
            description="From custom software to cloud migration — we cover every stage of your digital journey."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map(([key, cat]) => {
              const Icon = iconMap[cat.icon] ?? Code2
              const count = services.filter((s) => s.category === key).length
              return (
                <Link
                  key={key}
                  to={`/services#${key}`}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-surface-elevated/25 p-5 transition-all hover:border-brand-500/25 hover:bg-surface-elevated/50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 transition-colors group-hover:bg-brand-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white transition-colors group-hover:text-brand-300">
                      {cat.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">{cat.description}</p>
                    <p className="mt-2 text-xs font-medium text-brand-400">{count} offerings</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founder spotlight + gallery */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative lg:col-span-5"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/25 via-transparent to-sky-700/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/50">
                <img
                  src={siteConfig.founder.images.portrait}
                  alt={siteConfig.founder.name}
                  className="aspect-[4/5] w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
                Leadership · {siteConfig.group.name}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                {siteConfig.founder.name}
              </h2>
              <p className="mt-2 text-brand-300">{siteConfig.founder.role}</p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
                {siteConfig.founder.bio}
              </p>
              <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                {siteConfig.motto}
              </p>
              <div className="mt-8">
                <Button href="/about" icon>
                  Meet the Founder
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-3">
                {siteConfig.founder.images.gallery.slice(0, 4).map((src) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-xl border border-white/10"
                  >
                    <img
                      src={src}
                      alt=""
                      className="aspect-square w-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand poster moment */}
      <section className="relative overflow-hidden border-y border-white/5">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[420px]">
            <img
              src={siteConfig.media.rebrandPoster}
              alt="Ellines Tech brand"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/40 lg:to-slate-950/80" />
          </div>
          <div className="flex flex-col justify-center bg-surface/80 px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-400">
              Brand & craft
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Built for serious work
            </h2>
            <p className="mt-4 max-w-md text-slate-400 leading-relaxed">
              From healthcare platforms to AI assistants, we design and ship systems that teams rely
              on every day — with the polish of a modern product company and the pragmatism of an
              African-built engineering partner.
            </p>
            <Link
              to="/portfolio"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              See work that ships <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <SectionHeader
            eyebrow="Industries"
            title="Sectors we serve"
            description="Deep domain expertise across healthcare, education, finance, and more."
            className="mb-10"
          />
          <div className="flex flex-wrap gap-3">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                to={`/industries#${industry.slug}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-300"
              >
                {industry.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Portfolio"
              title="Projects that make an impact"
              description="Real results for healthcare, education, business, and AI clients."
            />
            <Button href="/portfolio" variant="ghost" icon>
              View Portfolio
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPortfolio.map((project, i) => (
              <Card
                key={project.slug}
                title={project.name}
                description={project.description}
                href={`/portfolio#${project.slug}`}
                tag={project.category}
                image={
                  i % 2 === 0
                    ? siteConfig.founder.images.gallery[i % 5]
                    : siteConfig.media.rebrandPoster
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-500/20">
            <img
              src={siteConfig.founder.images.secondary}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top opacity-35"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-brand-900/70 to-slate-950/95" />
            <div className="relative p-8 sm:p-12 lg:p-16">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Ready to transform your business?
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  We&apos;re here 24/7 for demos and services. Request a quote or WhatsApp us at{' '}
                  {siteConfig.phones[1]}.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button href="/contact#quote" size="lg" icon>
                    Request a Quote
                  </Button>
                  <Button href={waHref} variant="secondary" size="lg" external>
                    WhatsApp Us
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

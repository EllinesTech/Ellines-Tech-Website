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
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SEO } from '@/components/SEO'
import { products } from '@/data/products'
import { services, serviceCategories } from '@/data/services'
import { industries } from '@/data/industries'
import { portfolioProjects } from '@/data/portfolio'
import { siteConfig } from '@/data/site'

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
  { value: '100%', label: 'Client-Focused' },
]

const valueProps = [
  {
    icon: Sparkles,
    title: 'Innovation First',
    description: 'Cutting-edge AI, cloud, and software solutions built for African markets.',
  },
  {
    icon: Shield,
    title: 'Enterprise Grade',
    description: 'Secure, scalable systems trusted by healthcare, finance, and government.',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Agile development with rapid iteration and continuous deployment.',
  },
  {
    icon: Globe2,
    title: 'Africa-Focused',
    description: 'Solutions designed for local context — M-Pesa, offline-first, multilingual.',
  },
]

export function HomePage() {
  const featuredProducts = products.filter((p) => p.highlights).slice(0, 4)
  const featuredServices = Object.entries(serviceCategories).slice(0, 6)
  const featuredPortfolio = portfolioProjects.slice(0, 6)
  const waHref = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`

  return (
    <>
      <SEO />

      {/* Hero — brand-forward, one composition */}
      <section className="relative overflow-hidden mesh-bg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_55%)]" />
        <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl animate-pulse-slow" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-600/15 blur-3xl animate-pulse-slow" />

        <div className="section-container relative flex min-h-[calc(100svh-4.25rem)] flex-col justify-center py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                src={siteConfig.logos.markNav}
                alt=""
                width={72}
                height={72}
                className="mb-7 h-[4.5rem] w-[4.5rem] object-contain"
                fetchPriority="high"
              />
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.08]">
                <span className="block">
                  Ellines{' '}
                  <span className="text-gradient">Tech</span>
                </span>
                <span className="mt-3 block text-[0.68em] font-bold text-slate-100 sm:mt-4">
                  Building Digital Africa
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300/90">
                {siteConfig.tagline}. Enterprise software, AI, and cloud — engineered for African
                organizations.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/contact#quote" size="lg" icon>
                  Start Your Project
                </Button>
                <Button href="/products" variant="secondary" size="lg">
                  Explore Products
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-400/20 via-transparent to-sky-600/15 blur-3xl" />
              <div className="animate-float relative w-full max-w-lg">
                <img
                  src={siteConfig.logos.hero}
                  alt="Ellines Tech — Your Idea. Our Code."
                  className="relative z-10 mx-auto w-full object-contain drop-shadow-[0_20px_60px_rgba(14,165,233,0.25)]"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="relative z-10 mt-6 text-center font-display text-sm font-semibold uppercase tracking-[0.28em] text-slate-200 sm:text-base"
              >
                {siteConfig.motto}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-surface/30 py-10 sm:py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-brand-300 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow="Why Ellines Tech"
            title="Technology That Transforms Businesses"
            description="From healthcare to finance, we build solutions that solve real problems for African organizations."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-6 transition-colors hover:border-brand-500/30"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-sky-700/20 text-brand-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 py-12 sm:py-14">
        <div className="section-container">
          <div className="grid items-center gap-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-surface-elevated/80 to-surface/60 p-6 sm:grid-cols-[auto_1fr_auto] sm:gap-10 sm:p-8">
            <img
              src={siteConfig.founder.images.portrait}
              alt={siteConfig.founder.name}
              className="h-28 w-28 rounded-2xl object-cover object-top ring-1 ring-white/10 sm:h-32 sm:w-32"
              loading="lazy"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
                {siteConfig.group.name}
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
                {siteConfig.founder.name}
              </p>
              <p className="mt-1 text-sm text-brand-300">{siteConfig.founder.role}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
                Leading Ellines Tech alongside Ellines Haven and future ventures — technology built
                for African organizations.
              </p>
            </div>
            <Button href="/about" variant="secondary" icon className="self-start sm:self-center">
              Meet the Founder
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Products"
              title="Our Product Ecosystem"
              description="Every Ellines Tech product has a dedicated platform — from hospital management to AI assistants."
            />
            <Button href="/products" variant="ghost" icon>
              View All Products
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card
                key={product.slug}
                title={product.name}
                description={product.tagline}
                href={`/products/${product.slug}`}
                tag={product.highlights?.[0]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow="Services"
            title="End-to-End Technology Services"
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
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-surface-elevated/30 p-5 transition-all hover:border-brand-500/30 hover:bg-surface-elevated/60"
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

      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <SectionHeader
            eyebrow="Industries"
            title="Sectors We Serve"
            description="Deep domain expertise across healthcare, education, finance, and more."
            className="mb-10"
          />
          <div className="flex flex-wrap gap-3">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                to={`/industries#${industry.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-300"
              >
                {industry.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Portfolio"
              title="Projects That Make an Impact"
              description="Real results for healthcare, education, business, and AI clients."
            />
            <Button href="/portfolio" variant="ghost" icon>
              View Portfolio
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPortfolio.map((project) => (
              <Card
                key={project.slug}
                title={project.name}
                description={project.description}
                href={`/portfolio#${project.slug}`}
                tag={project.category}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-500/20 bg-gradient-to-br from-brand-900/50 via-surface-elevated to-surface p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="relative max-w-2xl">
              <img
                src={siteConfig.logos.mark}
                alt=""
                className="mb-6 h-12 w-auto object-contain opacity-90"
              />
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to Transform Your Business?
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Let&apos;s discuss your project. Book a meeting, request a quote, or reach out on
                WhatsApp.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Request a Quote
                </Button>
                <Button href={waHref} variant="secondary" size="lg" external>
                  WhatsApp Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

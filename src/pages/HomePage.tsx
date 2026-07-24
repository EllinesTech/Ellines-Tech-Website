import { motion } from 'framer-motion'
import { Sparkles, Shield, Zap, Globe2, Brain, Cloud, Code2, Globe, Smartphone, Lightbulb } from 'lucide-react'
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

  return (
    <>
      <SEO />

      <section className="relative overflow-hidden mesh-bg">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl animate-pulse-slow" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-600/15 blur-3xl animate-pulse-slow" />

        <div className="section-container relative section-padding pb-20 pt-10 sm:pt-16 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
                Ellines Tech
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                Building the Future of{' '}
                <span className="text-gradient">Digital Africa</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
                {siteConfig.tagline}. Software, AI, cloud, and digital transformation —
                powering businesses across the continent. Part of {siteConfig.group.name},
                founded by {siteConfig.founder.name}.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Start Your Project
                </Button>
                <Button href="/products" variant="secondary" size="lg">
                  Explore Products
                </Button>
              </div>
              <p className="mt-6 text-sm text-slate-500">
                Your Idea. Our Code.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/25 via-transparent to-sky-700/20 blur-3xl" />
              <div className="animate-float relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-brand-900/40 backdrop-blur-sm sm:p-12">
                <img
                  src={siteConfig.logos.hero}
                  alt="Ellines Tech"
                  className="relative z-10 mx-auto h-48 w-auto object-contain sm:h-64 lg:h-72"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-sm sm:p-5"
              >
                <p className="font-display text-2xl font-bold text-brand-300 sm:text-3xl">{stat.value}</p>
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
                transition={{ delay: i * 0.1 }}
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

      <section className="border-t border-white/5 py-10">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                {siteConfig.group.name}
              </p>
              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Ellines Tech ·{' '}
                <a
                  href={siteConfig.sisterBrands[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 underline-offset-2 hover:text-brand-300 hover:underline"
                >
                  Ellines Haven
                </a>
                {' '}· Rattan Furniture <span className="text-slate-500">(coming soon)</span>
              </p>
            </div>
            <Button href="/about" variant="ghost" size="sm" icon>
              About Ellines Tech
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
              <img src={siteConfig.logos.mark} alt="" className="mb-6 h-12 w-auto object-contain opacity-90" />
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to Transform Your Business?
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Let&apos;s discuss your project. Book a meeting, request a quote, or reach out on WhatsApp.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Request a Quote
                </Button>
                <Button
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`}
                  variant="secondary"
                  size="lg"
                  external
                >
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

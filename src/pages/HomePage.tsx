import { motion } from 'framer-motion'
import {
  Sparkles,
  Shield,
  Zap,
  Globe2,
  Brain,
  Code2,
  Palette,
  Megaphone,
  ArrowRight,
  FileText,
  Briefcase,
  FileCheck,
  Wrench,
  Shirt,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { MediaBadge, MediaCard } from '@/components/ui/MediaCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SEO } from '@/components/SEO'
import { HeroVisual } from '@/components/home/HeroVisual'
import { GroupEcosystem } from '@/components/home/GroupEcosystem'
import { serviceCategories } from '@/data/services'
import { industries } from '@/data/industries'
import { portfolioCategories } from '@/data/portfolio'
import { industryImage, productVisual, projectVisual } from '@/data/imagery'
import { homeCopy, testimonials as defaultTestimonials, valueProps as valuePropData } from '@/data/content'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'
import { useSiteCopy } from '@/hooks/useSiteCopy'
import { useSiteProfile } from '@/context/SiteProfileContext'
import { ProcessSection } from '@/components/home/ProcessSection'
import { TechMarquee } from '@/components/home/TechMarquee'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { fetchReviews } from '@/lib/cmsApi'
import {
  loadPublishedServices,
  serviceImage,
  staticServicesAsCatalog,
  type CatalogService,
} from '@/lib/servicesCatalog'
import {
  loadPublishedProducts,
  staticProductsAsCatalog,
  type CatalogProduct,
} from '@/lib/productsCatalog'
import {
  loadPublishedPortfolio,
  staticPortfolioAsCatalog,
  type CatalogProject,
} from '@/lib/portfolioCatalog'
import { loadClientBrands, staticClientBrands, type CatalogClientBrand } from '@/lib/clientBrandsCatalog'

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Palette,
  Brain,
  Megaphone,
  Shield,
  FileText,
  Briefcase,
  FileCheck,
  Wrench,
  Shirt,
}

const valueIconMap = {
  Sparkles,
  Zap,
  Shield,
  Globe2,
} as const

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '25+', label: 'Products & Solutions' },
  { value: '12', label: 'Industries Served' },
  { value: '3+', label: 'Years Building' },
]

const valueProps = valuePropData.map((item) => ({
  ...item,
  icon: valueIconMap[item.icon],
}))

export function HomePage() {
  const [services, setServices] = useState<CatalogService[]>(() => staticServicesAsCatalog())
  const [featuredProducts, setFeaturedProducts] = useState<CatalogProduct[]>(() =>
    staticProductsAsCatalog()
      .filter((p) => p.highlights && p.image)
      .slice(0, 4),
  )
  const [featuredPortfolio, setFeaturedPortfolio] = useState<CatalogProject[]>(() =>
    staticPortfolioAsCatalog().slice(0, 6),
  )
  const [brands, setBrands] = useState<CatalogClientBrand[]>(() => staticClientBrands())
  const [testimonials, setTestimonials] = useState<{ quote: string; name: string; role: string }[]>(
    () => defaultTestimonials.map((t) => ({ quote: t.quote, name: t.name, role: t.role })),
  )
  const { profile } = useSiteProfile()
  const waHref = `https://wa.me/${(profile.whatsapp || siteConfig.whatsapp).replace(/\D/g, '')}`
  const { home: liveHome } = useSiteCopy()

  useEffect(() => {
    void loadPublishedServices().then(setServices)
    void loadPublishedProducts().then((list) =>
      setFeaturedProducts(list.filter((p) => p.highlights && p.image).slice(0, 4)),
    )
    void loadPublishedPortfolio().then((list) => setFeaturedPortfolio(list.slice(0, 6)))
    void loadClientBrands().then(setBrands)
    void fetchReviews()
      .then((list) => {
        if (Array.isArray(list) && list.length) {
          setTestimonials(
            list.map((r) => ({
              quote: String((r as { quote?: string }).quote || ''),
              name: String((r as { name?: string }).name || ''),
              role: String((r as { role?: string }).role || ''),
            })),
          )
        }
      })
      .catch(() => undefined)
  }, [])

  return (
    <>
      <SEO
        description="Ellines Tech — Kenya IT company for software development, web design, AI, IT consulting, digital marketing, and career documents. Nyeri & Nairobi · Your Idea. Our Code."
        path="/"
      />

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
                {liveHome.heroSub ||
                  'Software applications, mobile apps, and digital solutions — executed from start to finish for businesses that need technology built to last.'}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/request" size="lg" icon>
                  Request a service
                </Button>
                <Button href="/pricing" variant="secondary" size="lg">
                  View pricing
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  24/7 support
                </span>
                <span>Kenya · Africa · Global</span>
                <span>Resume · Software · AI</span>
              </div>
            </motion.div>

            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Tech trust marquee */}
      <TechMarquee />

      {/* Stats */}
      <section className="border-b border-white/5 py-12 sm:py-14">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-y-8 sm:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'text-center sm:px-6 sm:text-left sm:first:pl-0',
                  i % 2 === 1 && 'border-l border-white/10',
                  i > 0 && 'sm:border-l sm:border-white/10',
                )}
              >
                <p className="font-display text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Storytelling — real workplace / team imagery from Ellines Tech */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <img
          src={siteConfig.media.banners.homeStory}
          alt="Ellines Tech — Your Idea. Our Code."
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/55" />
        <div className="section-container relative flex min-h-[70vh] items-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              {homeCopy.storyEyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {liveHome.storyTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">{liveHome.storyBody}</p>
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

      {/* Why choose — real scene photos, not logos */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow={homeCopy.whyEyebrow}
            title={homeCopy.whyTitle}
            description={homeCopy.whyBody}
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
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/25 text-brand-200 ring-1 ring-brand-400/35 backdrop-blur-md">
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
      <GroupEcosystem
        className="bg-surface/35"
        title={liveHome.groupTitle}
        description={liveHome.groupBody}
      />

      {/* Brands we built & worked with */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow="Brands & clients"
            title="Logos we created. Businesses we work with."
            description="Identity systems and digital work for brands across hospitality, healthcare, events, and services — plus Ellines Group ventures."
            align="center"
            className="mb-12"
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group flex flex-col items-center gap-3 text-center"
              >
                <div className="flex h-16 w-full items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-12 w-auto max-w-[85%] object-contain opacity-75 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                    loading="lazy"
                  />
                </div>
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors group-hover:text-slate-400">
                  {brand.name}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button href="/clients" variant="ghost" icon>
              View all clients
            </Button>
          </div>
        </div>
      </section>

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
            {featuredProducts.map((product) => {
              const visual = productVisual(product)
              return (
                <Card
                  key={product.slug}
                  title={product.name}
                  description={product.tagline}
                  href={`/products/${product.slug}`}
                  tag={product.highlights?.[0]}
                  image={visual.src}
                  imageFit={visual.fit}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Services"
              title="End-to-end technology services"
              description="Design, development, AI, marketing, and cyber security — open any service for full details."
            />
            <Button href="/services" variant="ghost" icon>
              View All Services
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, i) => {
              const cat = serviceCategories[service.category]
              const Icon = iconMap[cat.icon] ?? Code2
              return (
                <MediaCard
                  key={service.slug}
                  title={service.name}
                  eyebrow={cat.label}
                  description={service.description}
                  image={serviceImage(service)}
                  href={`/services/${service.slug}`}
                  index={i % 3}
                  cta="Explore service"
                  badge={
                    <MediaBadge>
                      <Icon className="h-5 w-5" />
                    </MediaBadge>
                  }
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Founder trust strip — full story lives on About */}
      <section className="border-t border-white/5 py-10 sm:py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start justify-between gap-6 rounded-[1.35rem] border border-white/10 bg-white/[0.02] px-5 py-5 sm:flex-row sm:items-center sm:px-7 sm:py-6"
          >
            <div className="flex items-center gap-4">
              <img
                src={siteConfig.founder.images.portrait}
                alt={siteConfig.founder.name}
                className="h-14 w-14 rounded-full object-cover object-top ring-2 ring-brand-400/25 sm:h-16 sm:w-16"
                loading="lazy"
              />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">
                  Leadership · {siteConfig.group.name}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-white">
                  {siteConfig.founder.name}
                </p>
                <p className="text-sm text-slate-400">{siteConfig.founder.role}</p>
              </div>
            </div>
            <Button href="/about" variant="secondary" icon>
              Meet the Founder
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Brand poster moment */}
      <section className="relative overflow-hidden border-y border-white/5">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[420px]">
            <img
              src={siteConfig.media.banners.homeCraft}
              alt="Ellines Tech software craft"
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

      {/* Testimonials from live Ellines Tech site */}
      <ProcessSection />

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow="Our feedbacks"
            title="What they are saying about us"
            description="Clients and partners across Kenya trust Ellines Tech for software, AI, and digital delivery."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((item, i) => (
              <motion.blockquote
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex h-full flex-col rounded-[1.35rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
              >
                <p className="flex-1 text-sm leading-relaxed text-slate-300">“{item.quote}”</p>
                <footer className="mt-5 border-t border-white/8 pt-4">
                  <p className="font-display text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-slate-500">
                    {item.role}
                  </p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeader
              eyebrow="Industries"
              title="Sectors we serve"
              description="Deep domain expertise across healthcare, education, finance, and more."
            />
            <Button href="/industries" variant="ghost" icon>
              All Industries
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {industries.slice(0, 6).map((industry, i) => (
              <motion.div
                key={industry.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: (i % 3) * 0.07, duration: 0.5 }}
              >
                <Link
                  to={`/industries#${industry.slug}`}
                  className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-[1.25rem] border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/35 sm:aspect-[3/2]"
                >
                  <img
                    src={industryImage(industry.slug)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
                  <div className="relative w-full p-4 sm:p-5">
                    <h3 className="font-display text-base font-semibold text-white transition-colors group-hover:text-brand-200 sm:text-lg">
                      {industry.name}
                    </h3>
                    <div className="hidden sm:block">
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                        {industry.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {industries.slice(6).map((industry) => (
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
            {featuredPortfolio.map((project) => {
              const visual = projectVisual(project)
              return (
                <Card
                  key={project.slug}
                  title={project.name}
                  description={project.description}
                  href={`/portfolio#${project.slug}`}
                  tag={portfolioCategories[project.category] || project.category}
                  image={visual.src}
                  imageFit={visual.fit}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA — gradient + brand mark (not founder) */}
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
                <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Ready to transform your business?
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  We&apos;re here 24/7 for demos and services. Request a quote or WhatsApp us at{' '}
                  {profile.whatsapp || siteConfig.phones[1]}.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button href="/request" size="lg" icon>
                    Request a service
                  </Button>
                  <Button href={waHref} variant="secondary" size="lg" external>
                    WhatsApp Us
                  </Button>
                </div>
                <div className="mt-10 max-w-md">
                  <p className="mb-3 text-sm font-medium text-slate-300">Product & delivery notes</p>
                  <NewsletterSignup />
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

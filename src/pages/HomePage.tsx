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
  ChevronDown,
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
import { CtaPanel } from '@/components/ui/CtaPanel'
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
        faqs={[
          {
            question: 'How fast can we start?',
            answer:
              'Most service requests get a scoped reply within a few hours. Smaller deliverables can begin the same week; larger builds get a written plan first.',
          },
          {
            question: 'Do you support after launch?',
            answer:
              'Yes — we stay available 24/7 for demos, fixes, and follow-up work. Support is part of how we ship, not an afterthought.',
          },
          {
            question: 'Who is Ellines Tech for?',
            answer:
              'Individuals, schools, clinics, SACCOs, and growing businesses — plus organizations that need software, AI, or brand systems built to last.',
          },
        ]}
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

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Button href="/request" size="lg" icon>
                  Request a service
                </Button>
                <Button href="/pricing" variant="secondary" size="lg">
                  View pricing
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Online 24/7 · Nyeri &amp; Nairobi
                </span>
              </motion.p>
            </motion.div>

            <HeroVisual />
          </div>

          <motion.a
            href="#home-continue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="group mx-auto mt-10 flex flex-col items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-brand-300 lg:mt-14"
            aria-label="Continue reading"
          >
            Explore
            <ChevronDown className="h-4 w-4 animate-bounce text-brand-400/70 transition-colors group-hover:text-brand-300" />
          </motion.a>
        </div>
      </section>

      {/* Tech trust marquee */}
      <div id="home-continue">
        <TechMarquee />
      </div>

      {/* Stats */}
      <section className="border-b border-white/5 py-14 sm:py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Storytelling — real workplace / team imagery from Ellines Tech */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <motion.img
          src={siteConfig.media.banners.homeStory}
          alt="Ellines Tech — Your Idea. Our Code."
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/55" />
        <div className="section-container relative flex min-h-[72vh] items-center py-20">
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
              <Button href="/request" variant="secondary">
                Start a project
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
                <div className="relative aspect-[3/2] overflow-hidden bg-slate-950">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
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
          <div className="relative min-h-[320px] bg-[#070b18] lg:min-h-[420px]">
            <img
              src={siteConfig.media.banners.homeCraft}
              alt="Ellines Tech software craft"
              className="absolute inset-0 h-full w-full object-contain object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/40 lg:to-slate-950/80" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center bg-surface/80 px-6 py-14 sm:px-10 lg:px-14 lg:py-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-400">
              Brand & craft
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Built for serious work
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-slate-400">
              From healthcare platforms to AI assistants, we design and ship systems that teams rely
              on every day — with the polish of a modern product company and the pragmatism of an
              African-built engineering partner.
            </p>
            <Link
              to="/portfolio"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200"
            >
              See work that ships <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mid-page bridge — keep scroll momentum toward proof + CTA */}
      <section className="border-b border-white/5 py-10 sm:py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-5 sm:flex-row sm:items-center sm:px-7"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">
                Next step
              </p>
              <p className="mt-1.5 font-display text-lg font-semibold text-white sm:text-xl">
                Pick a package — or send a brief and we&apos;ll scope it.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button href="/pricing" size="sm" icon>
                View pricing
              </Button>
              <Button href="/request" size="sm" variant="secondary">
                Request a service
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials from live Ellines Tech site */}
      <ProcessSection />

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <SectionHeader
            eyebrow="Client feedback"
            title="What teams say about working with us"
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
                  className="group relative flex aspect-[3/2] items-end overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/35"
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

      {/* FAQ teaser — answers buyer objections before the final CTA */}
      <section className="section-padding border-t border-white/5 bg-surface/35">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionHeader
                eyebrow="FAQ"
                title="Answers before you book a call"
                description="Clear expectations on timelines, support, and how we work — so you can decide with confidence."
              />
              <div className="mt-8">
                <Button href="/faq" variant="secondary" icon>
                  View all FAQs
                </Button>
              </div>
            </div>
            <div className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
              {[
                {
                  q: 'How fast can we start?',
                  a: 'Most service requests get a scoped reply within a few hours. Smaller deliverables can begin the same week; larger builds get a written plan first.',
                },
                {
                  q: 'Do you support after launch?',
                  a: 'Yes — we stay available 24/7 for demos, fixes, and follow-up work. Support is part of how we ship, not an afterthought.',
                },
                {
                  q: 'Who is Ellines Tech for?',
                  a: 'Individuals, schools, clinics, SACCOs, and growing businesses — plus organizations that need software, AI, or brand systems built to last.',
                },
              ].map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display font-semibold text-white transition-colors hover:text-brand-200">
                    {item.q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 group-open:rotate-90 group-open:text-brand-300" />
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — clear close with secondary contact paths */}
      <section className="section-padding border-t border-white/5">
        <div className="section-container space-y-8">
          <CtaPanel
            eyebrow="Start today"
            title="Ready to transform your business?"
            description={`We're here 24/7 for demos and services. Request a quote or WhatsApp us at ${profile.whatsapp || siteConfig.phones[1]}.`}
            primary={{ label: 'Request a service', href: '/request' }}
            secondary={{ label: 'WhatsApp us', href: waHref, external: true, variant: 'secondary' }}
            className="border-brand-500/25 from-brand-900/80 to-sky-950/90 p-8 sm:p-12 lg:p-14 [&_h2]:text-3xl sm:[&_h2]:text-4xl lg:[&_h2]:text-5xl"
          />
          <div className="grid gap-8 sm:grid-cols-2 sm:items-end">
            <div className="max-w-md">
              <p className="mb-3 text-sm font-medium text-slate-300">Product & delivery notes</p>
              <NewsletterSignup />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400 sm:justify-end">
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
      </section>
    </>
  )
}

import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { GroupEcosystem } from '@/components/home/GroupEcosystem'
import { siteConfig } from '@/data/site'
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

  return (
    <>
      <SEO
        title="About Us"
        description="Ellines Tech, based in Kenya, leads the IT industry with innovative solutions for global enterprises — software development, mobile apps, and digital transformation."
        path="/about"
      />

      {/* Media hero band — brand poster, not founder */}
      <section className="relative min-h-[48vh] overflow-hidden">
        <img
          src={siteConfig.media.rebrandPoster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50" />
        <div className="section-container relative flex min-h-[48vh] items-end pb-14 pt-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
              About Our Company
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Who we are
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Ellines Tech, based in Kenya, offers innovative IT solutions for global enterprises —
              combining technical skill and creativity for top-tier software development.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                With years of experience in the IT services industry,{' '}
                <span className="text-slate-200">Ellines Tech</span> specializes in crafting
                cutting-edge software applications and mobile apps for clients around the globe. We
                take pride in our unwavering commitment to excellence, innovation, and client
                satisfaction.
              </p>
              <p>
                Leveraging the latest technologies and industry best practices, our team of skilled
                professionals delivers tailor-made solutions that align with the unique needs and
                objectives of each client. From concept to deployment, we foster seamless
                collaboration and open communication throughout the development process, ensuring
                the delivery of high-quality, scalable, and user-friendly products.
              </p>
              <p>
                At Ellines Tech, we believe in turning visionary concepts into reality. With a proven
                track record of over three years, our dedicated team blends technical expertise with
                creative ingenuity — from the initial idea to final execution on{' '}
                <span className="text-slate-200">{siteConfig.url.replace('https://', '')}</span>.
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
                Haven and Ellines Rattan Furniture. We build systems that scale: healthcare
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

      <GroupEcosystem />

      <section className="section-padding border-t border-white/5">
        <div className="section-container text-center">
          <Button href="/contact" size="lg" icon>
            Work With Ellines Tech
          </Button>
        </div>
      </section>
    </>
  )
}

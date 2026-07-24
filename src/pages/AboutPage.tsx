import { ExternalLink } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/data/site'
import { Target, Eye, Heart, Users } from 'lucide-react'

const values = [
  { icon: Target, title: 'Mission', description: 'Empower African businesses with world-class technology that drives growth, efficiency, and innovation.' },
  { icon: Eye, title: 'Vision', description: 'Become Africa\'s most trusted technology partner — building the digital infrastructure of tomorrow.' },
  { icon: Heart, title: 'Values', description: 'Integrity, excellence, innovation, and client success guide everything we do.' },
  { icon: Users, title: 'Team', description: 'A passionate team of developers, designers, and strategists committed to delivering exceptional results.' },
]

export function AboutPage() {
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
                Ellines Tech is currently rebranding and consolidating under{' '}
                <span className="text-slate-200">{siteConfig.url.replace('https://', '')}</span>
                {' '}— our official digital headquarters for products, services, and client engagement.
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
                <div key={item.title} className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-6">
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

      <section className="section-padding border-t border-white/5 bg-surface/40">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Leadership"
                title="Founded by Elijah Mwangi M"
                description={`${siteConfig.founder.role}. Ellines Tech is the technology arm of ${siteConfig.group.name} — an ecosystem spanning software, publishing, and commerce.`}
              />
              <p className="mt-6 text-slate-400 leading-relaxed">
                {siteConfig.group.description} Ellines Tech remains the primary focus of this site:
                world-class software engineering, AI, and digital transformation for African organizations.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-brand-900/30 via-surface-elevated/80 to-surface p-8">
              <img src={siteConfig.logos.mark} alt="" className="mb-6 h-14 w-auto object-contain" />
              <p className="font-display text-2xl font-bold text-white">{siteConfig.founder.name}</p>
              <p className="mt-1 text-brand-300">{siteConfig.founder.role}</p>
              <p className="mt-4 text-sm text-slate-400">
                Building Ellines Tech as Africa&apos;s technology partner — Your Idea. Our Code.
              </p>
            </div>
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
                Software development, AI, cloud, and digital transformation — our flagship technology company.
              </p>
              <p className="mt-4 text-sm text-brand-400">{siteConfig.url.replace('https://', '')}</p>
            </article>

            {siteConfig.sisterBrands.map((brand) => (
              <article key={brand.name} className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-6">
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
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
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
            <Button href="/contact" size="lg" icon>Work With Ellines Tech</Button>
          </div>
        </div>
      </section>
    </>
  )
}

import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
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
      <SEO title="About Us" description="Learn about Ellines Tech — our mission, vision, and commitment to transforming Africa through technology." path="/about" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="About Ellines Tech"
            title="Africa's Technology Partner"
            description="Ellines Tech is a leading software development, AI, cloud, and digital transformation company based in Kenya. We build enterprise systems, healthcare platforms, and intelligent solutions for organizations across Africa."
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                Founded with a vision to bridge the technology gap in Africa, Ellines Tech has grown
                into a full-service technology company serving healthcare providers, educational
                institutions, financial organizations, government agencies, and businesses of all sizes.
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

          <div className="mt-16 text-center">
            <Button href="/contact" size="lg" icon>Work With Us</Button>
          </div>
        </div>
      </section>
    </>
  )
}

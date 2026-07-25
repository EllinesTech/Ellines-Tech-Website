import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Layers, Building2, Cpu, CloudCog } from 'lucide-react'

const solutionAreas = [
  {
    icon: Building2,
    title: 'Enterprise Solutions',
    description: 'ERP, CRM, and custom enterprise systems for large organizations.',
    href: '/products#business',
  },
  {
    icon: Cpu,
    title: 'Healthcare Technology',
    description: 'Hospital management, clinical AI, pharmacy, lab, and home care platforms.',
    href: '/products#healthcare',
  },
  {
    icon: Layers,
    title: 'AI & Automation',
    description: 'AI assistants, chatbots, voice AI, OCR, and predictive analytics.',
    href: '/products#ai',
  },
  {
    icon: CloudCog,
    title: 'Cloud & Infrastructure',
    description: 'Cloud migration, DevOps, security, and managed infrastructure.',
    href: '/services/cyber-security',
  },
]

export function SolutionsPage() {
  return (
    <>
      <SEO title="Solutions" description="Enterprise, healthcare, AI, and cloud solutions from Ellines Tech." path="/solutions" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Solutions"
            title="Integrated Technology Solutions"
            description="Comprehensive solutions combining our products, services, and expertise to solve complex business challenges."
            align="center"
            className="mb-16"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {solutionAreas.map((area) => (
              <Card
                key={area.title}
                title={area.title}
                description={area.description}
                href={area.href}
                icon={<area.icon className="h-6 w-6" />}
              />
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-surface-elevated/50 p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-white">Need a Custom Solution?</h3>
            <p className="mt-2 text-slate-400">We design bespoke solutions tailored to your industry and business requirements.</p>
            <Button href="/contact#quote" className="mt-6" icon>Discuss Your Needs</Button>
          </div>
        </div>
      </section>
    </>
  )
}

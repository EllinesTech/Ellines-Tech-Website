import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProcessSection } from '@/components/home/ProcessSection'
import { services, serviceCategories, type ServiceCategory } from '@/data/services'
import { Brain, Code2, FileText, Megaphone, Palette, Shield } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Palette,
  Brain,
  Megaphone,
  Shield,
  FileText,
}

export function ServicesPage() {
  const categories = Object.entries(serviceCategories) as [
    ServiceCategory,
    (typeof serviceCategories)[ServiceCategory],
  ][]

  return (
    <>
      <SEO
        title="Services"
        description="Logo design, web design, UI/UX, software development, AI automation, marketing, cyber security, and career documents from Ellines Tech."
        path="/services"
      />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.1),_transparent_55%)]" />
        <div className="section-container relative section-padding pb-14">
          <SectionHeader
            eyebrow="Our Services"
            title="Technology services built to ship"
            description="Design, development, AI, marketing, security, and career documents — scoped professionally with transparent pricing."
            align="center"
            className="mb-10"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/request" icon>
              Request a service
            </Button>
            <Button href="/pricing" variant="secondary">
              Product pricing
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="space-y-20">
            {categories.map(([key, cat]) => {
              const Icon = iconMap[cat.icon] ?? Code2
              const categoryServices = services.filter((s) => s.category === key)
              return (
                <div key={key} id={key} className="scroll-mt-24">
                  <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white">{cat.label}</h2>
                      <p className="mt-1 text-slate-400">{cat.description}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryServices.map((service) => (
                      <Card
                        key={service.slug}
                        title={service.name}
                        description={service.description}
                        href={`/services/${service.slug}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <ProcessSection />
    </>
  )
}

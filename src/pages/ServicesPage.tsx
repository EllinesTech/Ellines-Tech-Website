import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { services, serviceCategories, type ServiceCategory } from '@/data/services'
import {
  Brain, Cloud, Code2, Globe, Lightbulb, Shield, Smartphone,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Brain, Cloud, Shield, Lightbulb,
}

export function ServicesPage() {
  const categories = Object.entries(serviceCategories) as [ServiceCategory, typeof serviceCategories[ServiceCategory]][]

  return (
    <>
      <SEO title="Services" description="Software development, web, mobile, AI, cloud, cybersecurity, and IT consulting services from Ellines Tech." path="/services" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Our Services"
            title="Complete Technology Services"
            description="From ideation to deployment and beyond — we deliver end-to-end technology solutions tailored for African businesses."
            align="center"
            className="mb-16"
          />

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
    </>
  )
}

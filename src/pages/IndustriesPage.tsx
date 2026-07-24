import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { industries } from '@/data/industries'

export function IndustriesPage() {
  return (
    <>
      <SEO title="Industries" description="Ellines Tech serves healthcare, education, government, finance, retail, and more across Africa." path="/industries" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Industries"
            title="Sectors We Serve"
            description="Deep domain expertise and tailored solutions for every industry we work with."
            align="center"
            className="mb-16"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <div key={industry.slug} id={industry.slug} className="scroll-mt-24">
                <Card title={industry.name} description={industry.description}>
                  <ul className="mt-4 space-y-1.5">
                    {industry.solutions.map((solution) => (
                      <li key={solution} className="text-xs text-brand-400/80">• {solution}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

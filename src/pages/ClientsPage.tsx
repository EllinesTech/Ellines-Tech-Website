import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'

const clients = [
  { name: 'Healthcare Providers', count: '10+', description: 'Hospitals and clinics using MedFlow and AfyaVox' },
  { name: 'Educational Institutions', count: '15+', description: 'Schools and universities with management systems' },
  { name: 'Financial Organizations', count: '8+', description: 'SACCOs and fintech platforms' },
  { name: 'Businesses & SMEs', count: '25+', description: 'ERP, POS, and custom software clients' },
  { name: 'NGOs & Government', count: '5+', description: 'Program management and citizen services' },
]

export function ClientsPage() {
  return (
    <>
      <SEO title="Clients" description="Organizations that trust Ellines Tech for software, AI, and digital transformation." path="/clients" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Clients"
            title="Trusted by Leading Organizations"
            description="From healthcare to finance, organizations across Africa rely on Ellines Tech."
            align="center"
            className="mb-16"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div key={client.name} className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-8 text-center">
                <p className="font-display text-3xl font-bold text-brand-300">{client.count}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">{client.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{client.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-slate-500">
            Client logos and testimonials will be added as part of content integration phase.
          </p>
        </div>
      </section>
    </>
  )
}

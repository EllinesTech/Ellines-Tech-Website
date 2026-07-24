import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { FileText, BookOpen, Download, HelpCircle, Newspaper } from 'lucide-react'

const resourceSections = [
  {
    id: 'articles',
    icon: Newspaper,
    title: 'Articles',
    description: 'Insights on software development, AI, cloud, and digital transformation in Africa.',
    items: ['Building Scalable Healthcare Systems in Africa', 'AI Adoption for SMEs', 'Cloud Migration Best Practices'],
  },
  {
    id: 'tutorials',
    icon: BookOpen,
    title: 'Tutorials',
    description: 'Step-by-step guides for developers and IT professionals.',
    items: ['Getting Started with MedFlow API', 'Deploying on Cloudflare Pages', 'Flutter App Development Guide'],
  },
  {
    id: 'case-studies',
    icon: FileText,
    title: 'Case Studies',
    description: 'In-depth looks at how we solved real business challenges.',
    items: ['MedFlow: 40% Wait Time Reduction', 'RV22: 60% Support Ticket Reduction', 'School Management at Scale'],
  },
  {
    id: 'white-papers',
    icon: FileText,
    title: 'White Papers',
    description: 'Research and technical papers on industry trends.',
    items: ['Digital Health in East Africa', 'AI for Business Automation', 'Cybersecurity for SMEs'],
  },
  {
    id: 'documentation',
    icon: BookOpen,
    title: 'Product Documentation',
    description: 'Technical documentation for Ellines Tech products.',
    items: ['MedFlow Admin Guide', 'RV22 Integration Docs', 'API Reference'],
  },
  {
    id: 'downloads',
    icon: Download,
    title: 'Downloads',
    description: 'Brochures, product sheets, and media assets.',
    items: ['Company Profile PDF', 'MedFlow Product Sheet', 'Brand Assets'],
  },
  {
    id: 'faqs',
    icon: HelpCircle,
    title: 'FAQs',
    description: 'Answers to common questions about our products and services.',
    items: ['How do I request a demo?', 'What is your pricing model?', 'Do you offer support & maintenance?'],
  },
]

export function ResourcesPage() {
  return (
    <>
      <SEO title="Resources" description="Articles, tutorials, case studies, white papers, documentation, and FAQs from Ellines Tech." path="/resources" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Resource Center"
            title="Knowledge Hub"
            description="Articles, tutorials, case studies, documentation, and more — everything you need to learn about our technology."
            align="center"
            className="mb-16"
          />

          <div className="grid gap-8 sm:grid-cols-2">
            {resourceSections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <Card title={section.title} description={section.description} icon={<section.icon className="h-6 w-6" />}>
                  <ul className="mt-4 space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="text-sm text-slate-400 hover:text-brand-300 cursor-pointer transition-colors">
                        → {item}
                      </li>
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

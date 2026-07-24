import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Briefcase, GraduationCap, Users, Heart } from 'lucide-react'

const openings = [
  { title: 'Senior Full-Stack Developer', department: 'Engineering', type: 'Full-time', location: 'Nairobi / Remote' },
  { title: 'Flutter Mobile Developer', department: 'Engineering', type: 'Full-time', location: 'Nairobi' },
  { title: 'AI/ML Engineer', department: 'AI Lab', type: 'Full-time', location: 'Remote' },
  { title: 'UI/UX Designer', department: 'Design', type: 'Full-time', location: 'Nairobi' },
  { title: 'DevOps Engineer', department: 'Infrastructure', type: 'Full-time', location: 'Remote' },
  { title: 'Business Development Manager', department: 'Sales', type: 'Full-time', location: 'Nairobi' },
]

const benefits = [
  { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health coverage and wellness programs.' },
  { icon: GraduationCap, title: 'Learning & Growth', description: 'Training budget, conferences, and certification support.' },
  { icon: Users, title: 'Great Culture', description: 'Collaborative team, flexible hours, and modern workspace.' },
  { icon: Briefcase, title: 'Impactful Work', description: 'Build products that transform African businesses.' },
]

export function CareersPage() {
  return (
    <>
      <SEO title="Careers" description="Join Ellines Tech — open positions, internships, graduate programs, and company culture." path="/careers" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Careers"
            title="Build the Future With Us"
            description="Join a team of passionate technologists building Africa's digital infrastructure."
            align="center"
            className="mb-16"
          />

          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold text-white">Open Positions</h2>
          <div className="mt-6 space-y-4">
            {openings.map((job) => (
              <div key={job.title} className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-surface-elevated/30 p-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-display font-semibold text-white">{job.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{job.department} · {job.type} · {job.location}</p>
                </div>
                <Button href={`mailto:careers@ellinestech.co.ke?subject=Application: ${job.title}`} variant="outline" size="sm">
                  Apply Now
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-white">Internships & Graduate Programs</h3>
            <p className="mt-2 text-slate-400">We welcome interns and recent graduates passionate about technology in Africa.</p>
            <Button href="mailto:careers@ellinestech.co.ke?subject=Internship/Graduate Program" className="mt-6" icon>
              Express Interest
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

import { motion } from 'framer-motion'
import { MessageSquare, PenLine, Rocket, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'

const steps = [
  {
    icon: MessageSquare,
    title: 'Brief',
    body: 'Share goals, constraints, and success criteria through our request flow or chat.',
  },
  {
    icon: Search,
    title: 'Scope',
    body: 'We map the work, timeline, and investment — no vague retainers without a plan.',
  },
  {
    icon: PenLine,
    title: 'Build',
    body: 'Design and engineering in tight loops with demos you can actually react to.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    body: 'Ship to production, hand over clearly, and stay available 24/7 when you need us.',
  },
]

export function ProcessSection({
  ctaHref = '/request',
}: {
  ctaHref?: string
}) {
  return (
    <section className="section-padding border-t border-white/5 bg-surface/30">
      <div className="section-container">
        <SectionHeader
          eyebrow="How we work"
          title="A clear path from idea to shipped product"
          description="The same operating rhythm used by premium product studios — brief, scope, build, launch."
          align="center"
          className="mb-14"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="relative"
              >
                <p className="font-display text-4xl font-bold text-white/5">0{i + 1}</p>
                <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href={ctaHref} size="lg" icon>
            Start a request
          </Button>
        </div>
      </div>
    </section>
  )
}

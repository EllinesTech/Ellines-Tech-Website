import { motion } from 'framer-motion'
import { MessageSquare, PenLine, Rocket, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'

const steps = [
  {
    icon: MessageSquare,
    title: 'Tell us what you need',
    body: 'Share your goals and budget in 2 minutes — by form, chat, or WhatsApp. No long discovery calls required.',
  },
  {
    icon: Search,
    title: 'Get a clear scope & price',
    body: 'We respond within hours with a fixed price and timeline. No vague retainers, no surprise invoices.',
  },
  {
    icon: PenLine,
    title: 'We build it',
    body: 'Design and development with regular demos you can review and react to — you\'re always in control.',
  },
  {
    icon: Rocket,
    title: 'Launch & grow',
    body: 'Go live fast and start generating results. We stay available 24/7 for support, updates, and new features.',
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
          eyebrow="How it works"
          title="From idea to income — in 4 simple steps"
          description="No lengthy onboarding, no confusing processes. You describe what you need, we price it clearly, build it fast, and support it after launch."
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
            Get a free quote now
          </Button>
        </div>
      </div>
    </section>
  )
}

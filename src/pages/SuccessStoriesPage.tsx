import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { portfolioProjects } from '@/data/portfolio'

export function SuccessStoriesPage() {
  const stories = portfolioProjects.filter((p) => p.results)

  return (
    <>
      <SEO title="Success Stories" description="Success stories and case studies from Ellines Tech clients across Africa." path="/success-stories" />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Success Stories"
            title="Results That Speak for Themselves"
            description="Real outcomes from real projects — see how we've helped organizations transform with technology."
            align="center"
            className="mb-16"
          />

          <div className="space-y-8">
            {stories.map((story) => (
              <article key={story.slug} className="rounded-2xl border border-white/10 bg-surface-elevated/50 p-8">
                <h2 className="font-display text-2xl font-bold text-white">{story.name}</h2>
                <p className="mt-4 text-slate-400 leading-relaxed">{story.description}</p>
                {story.results && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {story.results.map((result) => (
                      <div key={result} className="rounded-xl bg-brand-500/10 px-4 py-3 text-sm font-medium text-brand-300">
                        ✓ {result}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/portfolio" variant="secondary" icon>View Full Portfolio</Button>
          </div>
        </div>
      </section>
    </>
  )
}

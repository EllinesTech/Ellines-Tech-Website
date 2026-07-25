import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { portfolioProjects, portfolioCategories } from '@/data/portfolio'

export function PortfolioPage() {
  return (
    <>
      <SEO
        title="Portfolio"
        description="Explore Ellines Tech portfolio — healthcare, education, business, AI, brand, and web projects."
        path="/portfolio"
      />

      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Portfolio"
            title="Projects That Deliver Results"
            description="Real-world products, platforms, and brand identities — including AfyaVox, RV22, Juno4, Lmar, and client marks we designed."
            align="center"
            className="mb-16"
          />

          <div className="grid gap-8">
            {portfolioProjects.map((project) => (
              <article
                key={project.slug}
                id={project.slug}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated/50"
              >
                <div className="flex flex-col sm:flex-row">
                  {(project.logo || project.image) && (
                    <div className="flex shrink-0 items-center justify-center border-b border-white/5 bg-gradient-to-br from-slate-900 via-surface to-slate-950 p-8 sm:w-52 sm:border-b-0 sm:border-r">
                      <img
                        src={project.logo ?? project.image}
                        alt=""
                        className="max-h-24 w-auto max-w-[10rem] object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
                          {portfolioCategories[project.category]}
                        </span>
                        <h2 className="mt-3 font-display text-2xl font-bold text-white">
                          {project.name}
                        </h2>
                        {project.client && (
                          <p className="mt-1 text-sm text-slate-500">Client: {project.client}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-slate-400 leading-relaxed">{project.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.results && (
                      <ul className="mt-6 space-y-2">
                        {project.results.map((result) => (
                          <li
                            key={result}
                            className="flex items-center gap-2 text-sm text-brand-300"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

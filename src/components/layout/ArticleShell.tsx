import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface ArticleShellProps {
  eyebrow?: string
  title: string
  lead?: string
  back?: { href: string; label: string }
  /** Small meta line under the lead — dates, tags, reading context. */
  meta?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

/** Shared reading layout for long-form pages (Knowledge Hub articles, CMS pages). */
export function ArticleShell({
  eyebrow,
  title,
  lead,
  back,
  meta,
  children,
  footer,
}: ArticleShellProps) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-500/12 blur-[100px]" />

        <div className="section-container relative max-w-3xl py-16 sm:py-20">
          {back && (
            <Link
              to={back.href}
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brand-300"
            >
              <ArrowLeft className="h-4 w-4" /> {back.label}
            </Link>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={back ? 'mt-8' : undefined}
          >
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
              {title}
            </h1>
            {lead && (
              <p className="mt-5 text-lg leading-relaxed text-slate-300/95">{lead}</p>
            )}
            {meta && <div className="mt-7">{meta}</div>}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-slate-300">{children}</div>
          {footer}
        </div>
      </section>
    </>
  )
}

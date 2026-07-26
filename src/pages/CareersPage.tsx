import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, Check, ChevronDown, GraduationCap, Heart, Upload, Users, X } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { FeatureGate } from '@/components/FeatureGate'
import { Button } from '@/components/ui/Button'
import { Field, fieldClass } from '@/components/ui/Field'
import { PrivacyConsentField } from '@/components/PrivacyConsentField'
import { fetchJobs, submitJobApplication, type JobPosting } from '@/lib/cmsApi'
import { locationLine } from '@/data/locations'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

const benefits = [
  { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health coverage and wellness programs.' },
  { icon: GraduationCap, title: 'Learning & Growth', description: 'Training budget, conferences, and certification support.' },
  { icon: Users, title: 'Great Culture', description: 'Collaborative team, flexible hours, and modern workspace.' },
  { icon: Briefcase, title: 'Impactful Work', description: 'Build products that transform African businesses.' },
]

const culture = [
  {
    image: '/media/posters/packages/shop_custom_software.jpg',
    caption: 'Pairing, not silos',
    detail: 'Engineers review each other’s work and ship in tight loops.',
  },
  {
    image: '/media/posters/packages/consult_it_fullday.jpg',
    caption: 'Close to the client',
    detail: 'You hear the problem first-hand instead of through a spec.',
  },
  {
    image: '/media/scenes/workspace.png',
    caption: 'Modern stack',
    detail: 'React, Python, Flutter, and cloud tooling we actually maintain.',
  },
]

const MAX_RESUME_BYTES = 900_000

const GENERAL_JOB: JobPosting = {
  id: 'general',
  title: 'General interest',
  department: 'Talent',
  type: 'Open application',
  location: 'Nyeri / Nairobi / Remote',
  description:
    "No perfect match right now? Share your background and we'll keep you in mind for future roles.",
  status: 'published',
  createdAt: '',
  updatedAt: '',
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

function ApplyForm({
  job,
  onClose,
  onSuccess,
}: {
  job: JobPosting
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [resumeName, setResumeName] = useState('')
  const [resumeMime, setResumeMime] = useState('')
  const [resumeData, setResumeData] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function onFile(file: File | null) {
    setError('')
    if (!file) {
      setResumeName('')
      setResumeMime('')
      setResumeData('')
      return
    }
    if (file.size > MAX_RESUME_BYTES) {
      setError('Resume must be under 900KB. Compress the PDF or share a portfolio / LinkedIn link instead.')
      return
    }
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]
    if (file.type && !allowed.includes(file.type) && !/\.(pdf|doc|docx|txt)$/i.test(file.name)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT resume.')
      return
    }
    try {
      const data = await readFileAsDataUrl(file)
      setResumeName(file.name)
      setResumeMime(file.type || 'application/octet-stream')
      setResumeData(data)
    } catch {
      setError('Could not read that file. Try another format.')
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await submitJobApplication({
        jobId: job.id,
        jobTitle: job.title,
        name,
        email,
        phone,
        coverLetter,
        portfolioUrl,
        linkedinUrl,
        resumeFileName: resumeName,
        resumeMime,
        resumeData,
      })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit application')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="rounded-2xl border border-brand-500/25 bg-surface-elevated/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">Apply</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {job.department} · {job.type} · {job.location}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="Close application form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="applicant-name">
          <input
            id="applicant-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            autoComplete="name"
          />
        </Field>
        <Field label="Email" htmlFor="applicant-email">
          <input
            id="applicant-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" htmlFor="applicant-phone" optional className="sm:col-span-2">
          <input
            id="applicant-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            autoComplete="tel"
            placeholder="+254…"
          />
        </Field>
        <Field
          label="Why are you interested?"
          htmlFor="applicant-cover"
          className="sm:col-span-2"
          hint="A short cover note beats a long one — tell us what you've built."
        >
          <textarea
            id="applicant-cover"
            required
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className={fieldClass}
            placeholder="Tell us about your background and why this role fits."
          />
        </Field>
        <Field label="Portfolio URL" htmlFor="applicant-portfolio" optional>
          <input
            id="applicant-portfolio"
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            className={fieldClass}
            placeholder="https://"
          />
        </Field>
        <Field label="LinkedIn" htmlFor="applicant-linkedin" optional>
          <input
            id="applicant-linkedin"
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className={fieldClass}
            placeholder="https://linkedin.com/in/…"
          />
        </Field>
        <div className="sm:col-span-2">
          <p className="text-[13px] font-medium text-slate-300">
            Resume / CV{' '}
            <span className="text-slate-600">— optional, max 900KB</span>
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,application/pdf"
            className="hidden"
            onChange={(e) => void onFile(e.target.files?.[0] || null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-4 text-sm text-slate-300 transition hover:border-brand-400/40 hover:text-white"
          >
            <Upload className="h-4 w-4 text-brand-400" />
            {resumeName || 'Upload PDF, DOC, or TXT'}
          </button>
          {resumeName && (
            <button
              type="button"
              onClick={() => void onFile(null)}
              className="mt-2 text-xs text-slate-500 hover:text-slate-300"
            >
              Remove file
            </button>
          )}
        </div>

        {error && (
          <p className="sm:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="sm:col-span-2">
          <PrivacyConsentField id="careersPrivacyConsent" />
        </div>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <Button type="submit" disabled={submitting} icon>
            {submitting ? 'Submitting…' : 'Submit application'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

function JobCard({
  job,
  active,
  expanded,
  onToggleExpand,
  onApply,
}: {
  job: JobPosting
  active: boolean
  expanded: boolean
  onToggleExpand: () => void
  onApply: () => void
}) {
  const hasLongDescription = Boolean(job.description && job.description.length > 120)

  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition',
        active ? 'border-brand-500/40 bg-brand-500/5' : 'border-white/10 bg-surface-elevated/30',
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {job.department} · {job.type} · {job.location}
          </p>
          {job.description && (
            <p className={cn('mt-2 text-sm text-slate-500', !expanded && 'line-clamp-2')}>
              {job.description}
            </p>
          )}
          {hasLongDescription && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-300 hover:text-brand-200"
            >
              {expanded ? 'Show less' : 'Read more'}
              <ChevronDown className={cn('h-3.5 w-3.5 transition', expanded && 'rotate-180')} />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant={active ? 'primary' : 'outline'}
          size="sm"
          className="shrink-0"
          onClick={onApply}
        >
          Apply Now
        </Button>
      </div>
    </div>
  )
}

function CareersContent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [activeJob, setActiveJob] = useState<JobPosting | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const deepLinked = useRef(false)

  useEffect(() => {
    fetchJobs(true)
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || deepLinked.current) return
    const jobParam = searchParams.get('job')
    if (!jobParam) return
    deepLinked.current = true
    if (jobParam === 'general') {
      setActiveJob(GENERAL_JOB)
      return
    }
    const match = jobs.find((j) => j.id === jobParam)
    if (match) setActiveJob(match)
  }, [loading, jobs, searchParams])

  useEffect(() => {
    if (activeJob && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeJob])

  function openApply(job: JobPosting) {
    setActiveJob(job)
    setDone(false)
    const next = new URLSearchParams(searchParams)
    next.set('job', job.id)
    setSearchParams(next, { replace: true })
  }

  function closeApply() {
    setActiveJob(null)
    const next = new URLSearchParams(searchParams)
    next.delete('job')
    setSearchParams(next, { replace: true })
  }

  if (done) {
    return (
      <section className="section-padding">
        <div className="section-container max-w-xl text-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15 text-brand-300"
          >
            <Check className="h-7 w-7" />
          </motion.div>
          <h1 className="mt-6 font-display text-3xl font-bold text-white">Application received</h1>
          <p className="mt-3 text-slate-400">
            Thanks for applying to Ellines Tech. Our talent team will review your materials and
            follow up if there&apos;s a fit.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => {
                setDone(false)
                closeApply()
              }}
              variant="secondary"
            >
              Back to openings
            </Button>
            <Button href="/" variant="outline">
              Home
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.workspace}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />

        <div className="section-container relative py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Careers
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
              Build the future
              <span className="mt-1 block text-gradient">with us</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Join a team of technologists building Africa&apos;s digital infrastructure — software,
              AI, and systems that businesses depend on every day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-surface/40">
        <div className="section-container py-12 sm:py-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border-l border-white/10 pl-5"
              >
                <item.icon className="h-5 w-5 text-brand-400" />
                <h3 className="mt-4 font-display font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Life here — the work, not stock-photo abstractions */}
      <section className="section-padding border-b border-white/5">
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
              Life at Ellines Tech
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Small team, real ownership
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              You will not be a ticket-taker here. Engineers and designers sit close to the
              clients, scope their own work, and see systems all the way from brief to production
              — across {locationLine} and remote.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {culture.map((item, i) => (
              <motion.figure
                key={item.caption}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="group relative overflow-hidden rounded-[1.35rem] border border-white/10"
              >
                <div className="aspect-[4/3] sm:aspect-[3/4]">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-base font-semibold text-white">{item.caption}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.detail}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Open positions
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Apply directly on this page — no email required. Upload a resume if you have one, or
            share your LinkedIn / portfolio.
          </p>

          <div className="mt-6 space-y-4">
            {loading && <p className="text-sm text-slate-500">Loading openings…</p>}
            {!loading && jobs.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-slate-400">
                  No open roles right now. You can still send a general interest application —
                  we&apos;ll reach out when something fits.
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="mt-4"
                  variant={activeJob?.id === 'general' ? 'primary' : 'outline'}
                  onClick={() => openApply(GENERAL_JOB)}
                >
                  Apply generally
                </Button>
              </div>
            )}
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                active={activeJob?.id === job.id}
                expanded={expandedId === job.id}
                onToggleExpand={() => setExpandedId((id) => (id === job.id ? null : job.id))}
                onApply={() => openApply(job)}
              />
            ))}
          </div>

          {!loading && jobs.length > 0 && (
            <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-200">Don&apos;t see your role?</p>
                <p className="mt-1 text-xs text-slate-500">
                  Send a general interest application and we&apos;ll keep you in the talent pool.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={activeJob?.id === 'general' ? 'primary' : 'secondary'}
                onClick={() => openApply(GENERAL_JOB)}
              >
                General application
              </Button>
            </div>
          )}

          <div ref={formRef} className="mt-10 scroll-mt-24">
            <AnimatePresence mode="wait">
              {activeJob && (
                <ApplyForm
                  key={activeJob.id}
                  job={activeJob}
                  onClose={closeApply}
                  onSuccess={() => setDone(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}

export function CareersPage() {
  return (
    <FeatureGate
      feature="careersEnabled"
      title="Careers unavailable"
      description="We're not accepting applications through the website right now. Please check back later or reach us via Contact."
    >
      <SEO
        title="Careers"
        description="Join Ellines Tech — open positions, internships, graduate programs, and company culture. Apply on-site."
        path="/careers"
      />
      <CareersContent />
    </FeatureGate>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  deleteJob,
  fetchApplications,
  fetchJobs,
  saveJob,
  updateApplicationStatus,
  type JobApplication,
  type JobPosting,
} from '@/lib/cmsApi'

const appStatuses = ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected', 'archived'] as const

const fieldClass =
  'mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40'

export function AdminCareersModule() {
  const [tab, setTab] = useState<'applications' | 'jobs'>('applications')
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState('')
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({})
  const [draft, setDraft] = useState({
    id: '',
    title: '',
    department: '',
    type: 'Full-time',
    location: 'Nairobi',
    description: '',
    status: 'published' as 'draft' | 'published',
  })

  async function load() {
    try {
      const [j, a] = await Promise.all([fetchJobs(false), fetchApplications()])
      setJobs(j)
      setApplications(a)
      setNotesDraft(Object.fromEntries(a.map((app) => [app.id, app.notes || ''])))
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load careers data')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filteredApps = useMemo(() => {
    if (statusFilter === 'all') return applications
    return applications.filter((a) => (a.status || 'new') === statusFilter)
  }, [applications, statusFilter])

  async function onStatus(id: string, status: string) {
    setSaving(id)
    try {
      await updateApplicationStatus(id, status, notesDraft[id])
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status, notes: notesDraft[id] || a.notes } : a)),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Status update failed')
    } finally {
      setSaving('')
    }
  }

  async function onSaveNotes(id: string, status: string) {
    setSaving(id)
    try {
      await updateApplicationStatus(id, status, notesDraft[id] || '')
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, notes: notesDraft[id] || '' } : a)),
      )
      setMessage('Notes saved')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save notes')
    } finally {
      setSaving('')
    }
  }

  async function onSaveJob(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await saveJob(draft)
      setMessage('Role saved')
      setDraft({
        id: '',
        title: '',
        department: '',
        type: 'Full-time',
        location: 'Nairobi',
        description: '',
        status: 'published',
      })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function onDeleteJob(id: string) {
    if (!confirm('Delete this role?')) return
    try {
      await deleteJob(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  function downloadResume(app: JobApplication) {
    if (!app.resumeData) return
    const a = document.createElement('a')
    a.href = app.resumeData
    a.download = app.resumeFileName || 'resume'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Careers</h1>
        <p className="mt-2 text-slate-400">
          Review applications and manage open roles. Public careers can be switched off under Site
          Controls — you can still manage listings here.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={tab === 'applications' ? 'primary' : 'secondary'}
          onClick={() => setTab('applications')}
        >
          Applications ({applications.length})
        </Button>
        <Button
          type="button"
          size="sm"
          variant={tab === 'jobs' ? 'primary' : 'secondary'}
          onClick={() => setTab('jobs')}
        >
          Open roles ({jobs.length})
        </Button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-brand-300">{message}</p>}

      {tab === 'applications' && (
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Filter
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
            >
              <option value="all">All statuses</option>
              {appStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <ul className="space-y-3">
            {filteredApps.length === 0 && (
              <li className="text-sm text-slate-500">No applications yet.</li>
            )}
            {filteredApps.map((app) => (
              <li key={app.id} className="rounded-xl border border-white/10 p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">
                    {app.name} · {app.email}
                  </p>
                  <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-200">
                    {app.jobTitle}
                  </span>
                </div>
                {app.phone && <p className="mt-1 text-slate-400">{app.phone}</p>}
                {(app.linkedinUrl || app.portfolioUrl) && (
                  <p className="mt-1 flex flex-wrap gap-3 text-xs">
                    {app.linkedinUrl && (
                      <a
                        href={app.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-300 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-300 hover:underline"
                      >
                        Portfolio
                      </a>
                    )}
                  </p>
                )}
                {app.coverLetter && (
                  <p className="mt-2 whitespace-pre-wrap text-slate-300">{app.coverLetter}</p>
                )}
                <label className="mt-3 block text-xs text-slate-500">
                  Internal notes
                  <textarea
                    rows={2}
                    value={notesDraft[app.id] ?? ''}
                    onChange={(e) =>
                      setNotesDraft((prev) => ({ ...prev, [app.id]: e.target.value }))
                    }
                    className={fieldClass}
                    placeholder="Interview feedback, next steps…"
                  />
                </label>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {app.resumeData && (
                    <button
                      type="button"
                      onClick={() => downloadResume(app)}
                      className="text-xs text-brand-300 hover:underline"
                    >
                      Download {app.resumeFileName || 'resume'}
                    </button>
                  )}
                  <label className="text-xs text-slate-500">
                    Status
                    <select
                      value={app.status || 'new'}
                      disabled={saving === app.id}
                      onChange={(e) => void onStatus(app.id, e.target.value)}
                      className="ml-2 rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
                    >
                      {!appStatuses.includes(app.status as (typeof appStatuses)[number]) && (
                        <option value={app.status}>{app.status}</option>
                      )}
                      {appStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    disabled={saving === app.id}
                    onClick={() => void onSaveNotes(app.id, app.status || 'new')}
                    className="text-xs text-brand-300 hover:underline disabled:opacity-50"
                  >
                    Save notes
                  </button>
                  <span className="text-xs text-slate-600">{new Date(app.at).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'jobs' && (
        <div className="space-y-6">
          <form
            onSubmit={onSaveJob}
            className="grid gap-3 rounded-2xl border border-white/10 bg-surface-elevated/40 p-5 sm:grid-cols-2"
          >
            <h2 className="font-display text-lg font-semibold text-white sm:col-span-2">
              {draft.id ? 'Edit role' : 'Add role'}
            </h2>
            <label className="text-sm text-slate-400">
              Title
              <input
                required
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="text-sm text-slate-400">
              Department
              <input
                value={draft.department}
                onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="text-sm text-slate-400">
              Type
              <input
                value={draft.type}
                onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="text-sm text-slate-400">
              Location
              <input
                value={draft.location}
                onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="text-sm text-slate-400 sm:col-span-2">
              Description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="text-sm text-slate-400">
              Status
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    status: e.target.value === 'published' ? 'published' : 'draft',
                  }))
                }
                className={fieldClass}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </label>
            <div className="flex items-end gap-2">
              <Button type="submit" size="sm" icon>
                Save role
              </Button>
            </div>
          </form>

          <ul className="space-y-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{job.title}</p>
                  <p className="text-xs text-slate-500">
                    {job.department} · {job.type} · {job.location} · {job.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setDraft({
                        id: job.id,
                        title: job.title,
                        department: job.department,
                        type: job.type,
                        location: job.location,
                        description: job.description || '',
                        status: job.status,
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => void onDeleteJob(job.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

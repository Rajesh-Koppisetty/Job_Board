import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { JobCard } from '@/components/JobCard'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import { jobApi, applicationApi } from '@/services/jobService'
import { useAuth } from '@/hooks/useAuth'
import { formatDate, formatJobType, formatSalary } from '@/utils/cn'

export function JobDetailPage() {
  const { id } = useParams()
  const { user, isRecruiter, isAdmin } = useAuth()
  const [job, setJob] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        const [jobRes, relatedRes] = await Promise.all([
          jobApi.getById(Number(id)),
          jobApi.getRelated(Number(id)),
        ])
        setJob(jobRes.data)
        setRelated(relatedRes.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const toggleSave = async () => {
    if (!user || !job) return
    if (job.saved) await jobApi.unsave(job.id)
    else await jobApi.save(job.id)
    setJob({ ...job, saved: !job.saved })
  }

  const handleApply = async () => {
    if (!user || !job) {
      window.location.href = '/login'
      return
    }
    setApplying(true)
    setMessage('')
    try {
      await applicationApi.apply({ jobId: job.id, coverLetter })
      setJob({ ...job, applied: true })
      setMessage('Application submitted successfully!')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <JobCardSkeleton />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Job not found</p>
        <Link to="/jobs"><Button className="mt-4">Browse Jobs</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{job.company.name}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge>{formatJobType(job.jobType)}</Badge>
                <Badge variant="secondary">{job.experienceLevel}</Badge>
                <Badge variant="outline">{job.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {job.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                )}
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />{formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />Posted {formatDate(job.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {user && !isRecruiter && !isAdmin && (
                <Button variant="outline" onClick={toggleSave}>
                  {job.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {job.saved ? 'Saved' : 'Save'}
                </Button>
              )}
              {(!user || (!isRecruiter && !isAdmin)) && (
                <Button
                  variant="gradient"
                  onClick={handleApply}
                  disabled={job.applied || applying}
                >
                  <Send className="h-4 w-4" />
                  {job.applied ? 'Applied' : applying ? 'Applying...' : 'Apply Now'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </Card>
            {job.requirements && (
              <Card>
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
              </Card>
            )}
          </div>

          <div>
            {user && !isRecruiter && !isAdmin && !job.applied && (
              <Card>
                <h3 className="font-semibold mb-3">Quick Apply</h3>
                <Textarea
                  placeholder="Cover letter (optional)"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="mb-3"
                />
                {message && (
                  <p className={`text-sm mb-3 ${message.includes('success') ? 'text-emerald-600' : 'text-destructive'}`}>
                    {message}
                  </p>
                )}
                <Button variant="gradient" className="w-full" onClick={handleApply} disabled={applying}>
                  Submit Application
                </Button>
              </Card>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
            <div className="grid gap-4">
              {related.map((j, i) => (
                <JobCard key={j.id} job={j} index={i} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

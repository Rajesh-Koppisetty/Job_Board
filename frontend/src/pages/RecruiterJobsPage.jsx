import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import { recruiterApi } from '@/services/jobService'
import { formatJobType } from '@/utils/cn'

export function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    recruiterApi.getJobs().then(({ data }) => {
      setJobs(data.content)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return
    await recruiterApi.deleteJob(id)
    load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Job Postings</h1>
          <Link to="/recruiter/jobs/new">
            <Button variant="gradient"><Plus className="h-4 w-4" /> New Job</Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground mb-4">No jobs posted yet</p>
            <Link to="/recruiter/jobs/new">
              <Button variant="gradient">Post Your First Job</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company.name}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge>{formatJobType(job.jobType)}</Badge>
                      <Badge variant="outline">{job.status}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/recruiter/jobs/${job.id}/edit`}>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { JobCard } from '@/components/JobCard'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { jobApi } from '@/services/jobService'

export function SavedJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobApi.getSaved().then(({ data }) => {
      setJobs(data.content)
      setLoading(false)
    })
  }, [])

  const handleSave = async (id) => {
    await jobApi.unsave(id)
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-8">Saved Jobs</h1>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground mb-4">No saved jobs yet</p>
            <Link to="/jobs" className="text-primary hover:underline">Browse jobs</Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={{ ...job, saved: true }} index={i} onSave={handleSave} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

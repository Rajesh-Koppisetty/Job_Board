import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import { applicationApi } from '@/services/jobService'
import { formatDate } from '@/utils/cn'

export function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applicationApi.getMine().then(({ data }) => {
      setApplications(data.content)
      setLoading(false)
    })
  }, [])

  const statusVariant = (status) => {
    if (status === 'OFFERED' || status === 'SHORTLISTED') return 'success'
    if (status === 'REJECTED') return 'destructive'
    if (status === 'PENDING') return 'warning'
    return 'secondary'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-8">My Applications</h1>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : applications.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted-foreground mb-4">No applications yet</p>
            <Link to="/jobs" className="text-primary hover:underline">Browse jobs</Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <Link to={`/jobs/${app.jobId}`} className="font-semibold hover:text-primary">
                        {app.jobTitle}
                      </Link>
                      <p className="text-sm text-muted-foreground">{app.companyName}</p>
                      <p className="text-xs text-muted-foreground mt-1">Applied {formatDate(app.appliedAt)}</p>
                    </div>
                    <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

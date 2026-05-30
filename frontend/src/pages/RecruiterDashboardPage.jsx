import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Users, FileText, Clock, Plus, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { recruiterApi } from '@/services/jobService'

export function RecruiterDashboardPage() {
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])

  const loadDashboardData = async () => {
    const [dash, apps] = await Promise.all([
      recruiterApi.getDashboard(),
      recruiterApi.getApplications(0, 10),
    ])
    setStats(dash.data)
    setApplications(apps.data.content)
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await recruiterApi.updateApplicationStatus(appId, newStatus)
      // Locally update the status in the list
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      )
      // Reload stats to keep counter badges updated
      const dash = await recruiterApi.getDashboard()
      setStats(dash.data)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const statCards = stats
    ? [
        { icon: Briefcase, label: 'Total Jobs', value: stats.totalJobs },
        { icon: Briefcase, label: 'Active Jobs', value: stats.activeJobs },
        { icon: FileText, label: 'Applications', value: stats.totalApplications },
        { icon: Clock, label: 'Pending', value: stats.pendingApplications },
      ]
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">Manage jobs and applicants</p>
          </div>
          <div className="flex gap-2">
            <Link to="/recruiter/jobs/new">
              <Button variant="gradient"><Plus className="h-4 w-4" /> Post Job</Button>
            </Link>
            <Link to="/recruiter/jobs">
              <Button variant="outline">Manage Jobs</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                  <card.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-border bg-secondary/20 gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="font-semibold text-base">{app.applicantName}</p>
                        <p className="text-xs text-muted-foreground">({app.applicantEmail})</p>
                      </div>
                      <p className="text-sm text-foreground/80">
                        Applied for <span className="text-primary font-medium">{app.jobTitle}</span>
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1.5">
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" /> View Resume
                          </a>
                        )}
                      </div>
                      {app.coverLetter && (
                        <div className="text-xs text-muted-foreground mt-2 bg-background/60 p-3 rounded-lg border border-border italic max-w-2xl">
                          "{app.coverLetter}"
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto self-start md:self-center">
                      <div className="w-full md:w-36">
                        <Select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={
                            app.status === 'PENDING'
                              ? 'border-yellow-500/50 focus-visible:ring-yellow-500'
                              : app.status === 'REJECTED'
                              ? 'border-red-500/50 focus-visible:ring-red-500'
                              : app.status === 'SHORTLISTED' || app.status === 'OFFERED'
                              ? 'border-emerald-500/50 focus-visible:ring-emerald-500'
                              : 'border-blue-500/50 focus-visible:ring-blue-500'
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWING">Reviewing</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="OFFERED">Offered</option>
                          <option value="REJECTED">Rejected</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

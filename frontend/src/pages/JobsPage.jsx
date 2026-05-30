import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/JobCard'
import { JobCardSkeleton } from '@/components/ui/skeleton'
import { jobApi } from '@/services/jobService'
import { useAuth } from '@/hooks/useAuth'

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isRecruiter, isAdmin } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [jobType, setJobType] = useState((searchParams.get('jobType')) || '')
  const [experienceLevel, setExperienceLevel] = useState(
    (searchParams.get('experienceLevel')) || ''
  )

  const fetchJobs = async (p = 0) => {
    setLoading(true)
    try {
      const { data } = await jobApi.search({
        keyword: keyword || undefined,
        location: location || undefined,
        jobType: jobType || undefined,
        experienceLevel: experienceLevel || undefined,
        page: p,
        size: 12,
      })
      setJobs(data.content)
      setTotalPages(data.totalPages)
      setPage(p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(0)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (location) params.set('location', location)
    if (jobType) params.set('jobType', jobType)
    if (experienceLevel) params.set('experienceLevel', experienceLevel)
    setSearchParams(params)
    fetchJobs(0)
  }

  const handleSave = async (id, saved) => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (saved) await jobApi.unsave(id)
    else await jobApi.save(id)
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, saved: !saved } : j)))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
        <p className="text-muted-foreground mb-8">Discover your next opportunity</p>
      </motion.div>

      <div className="glass rounded-xl p-4 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Keywords"
              className="pl-9"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <Select value={jobType} onChange={(e) => setJobType(e.target.value | '')}>
            <option value="">All Types</option>
            {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'HYBRID', 'INTERNSHIP'].map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </Select>
          <Select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value | '')}>
            <option value="">All Levels</option>
            {['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </Select>
        </div>
        <Button onClick={handleSearch} variant="gradient">
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No jobs found. Try adjusting your filters.</div>
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} onSave={(!user || (!isRecruiter && !isAdmin)) ? handleSave : undefined} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" disabled={page === 0} onClick={() => fetchJobs(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button variant="outline" disabled={page >= totalPages - 1} onClick={() => fetchJobs(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

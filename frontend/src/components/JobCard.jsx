import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn, formatDate, formatJobType, formatSalary } from '@/utils/cn'



export function JobCard({ job, onSave, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="group hover:shadow-2xl hover:border-primary/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link to={`/jobs/${job.id}`} className="block">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-muted-foreground mt-1">{job.company.name}</p>
            </Link>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{formatJobType(job.jobType)}</Badge>
              <Badge variant="outline">{job.experienceLevel}</Badge>
              {job.status !== 'ACTIVE' && <Badge variant="warning">{job.status}</Badge>}
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSave(job.id, !!job.saved)}
              className={cn(job.saved && 'text-primary')}
            >
              {job.saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

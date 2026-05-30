import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Bookmark, FileText, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { applicationApi, jobApi } from '@/services/jobService'

export function UserDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ applications: 0, saved: 0 })

  useEffect(() => {
    const load = async () => {
      const [apps, saved] = await Promise.all([
        applicationApi.getMine(0, 1),
        jobApi.getSaved(0, 1),
      ])
      setStats({
        applications: apps.data.totalElements,
        saved: saved.data.totalElements,
      })
    }
    load()
  }, [])

  const cards = [
    { icon: FileText, label: 'Applications', value: stats.applications, link: '/applications', color: 'text-primary' },
    { icon: Bookmark, label: 'Saved Jobs', value: stats.saved, link: '/saved', color: 'text-accent' },
    { icon: User, label: 'Profile', value: 'Edit', link: '/profile', color: 'text-emerald-500' },
    { icon: Briefcase, label: 'Browse Jobs', value: 'Explore', link: '/jobs', color: 'text-amber-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mb-8">Track your job search progress</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={card.link}>
                <Card className="hover:scale-105 transition-transform cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/jobs">
            <Button variant="gradient" size="lg">Find New Opportunities</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

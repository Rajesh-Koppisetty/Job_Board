import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { notificationApi } from '@/services/jobService'
import { formatDate } from '@/utils/cn'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    notificationApi.getAll().then(({ data }) => setNotifications(data.content))
  }, [])

  const markRead = async (id) => {
    await notificationApi.markRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>
        {notifications.length === 0 ? (
          <Card className="text-center py-12 text-muted-foreground">No notifications</Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-colors ${!n.read ? 'border-primary/40 bg-primary/5' : ''}`}
                  onClick={() => !n.read && markRead(n.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDate(n.createdAt)}
                    </span>
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

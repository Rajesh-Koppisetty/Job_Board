import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function DashboardRedirect() {
  const { user, isAdmin, isRecruiter } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />
  if (isRecruiter) return <Navigate to="/recruiter/dashboard" replace />
  return <Navigate to="/dashboard/user" replace />
}

import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/layouts/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { JobsPage } from '@/pages/JobsPage'
import { JobDetailPage } from '@/pages/JobDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { UserDashboardPage } from '@/pages/UserDashboardPage'
import { RecruiterDashboardPage } from '@/pages/RecruiterDashboardPage'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ApplicationsPage } from '@/pages/ApplicationsPage'
import { SavedJobsPage } from '@/pages/SavedJobsPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { RecruiterJobsPage } from '@/pages/RecruiterJobsPage'
import { PostJobPage } from '@/pages/PostJobPage'
import { DashboardRedirect } from '@/pages/DashboardRedirect'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardRedirect />} />
          <Route path="dashboard/user" element={<UserDashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="saved" element={<SavedJobsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ROLE_RECRUITER', 'ROLE_ADMIN']} />}>
          <Route path="recruiter/dashboard" element={<RecruiterDashboardPage />} />
          <Route path="recruiter/jobs" element={<RecruiterJobsPage />} />
          <Route path="recruiter/jobs/new" element={<PostJobPage />} />
          <Route path="recruiter/jobs/:id/edit" element={<PostJobPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ROLE_ADMIN']} />}>
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

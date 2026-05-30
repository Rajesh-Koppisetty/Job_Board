import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-muted-foreground max-w-md">
              AI-powered job board connecting top talent with leading companies worldwide.
              Find your dream job or hire the best candidates.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-primary">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Recruiters</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/register" className="hover:text-primary">Post a Job</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-primary">Recruiter Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TalentFlow. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

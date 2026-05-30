import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recruiterApi } from '@/services/jobService'

export function PostJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [companies, setCompanies] = useState([])
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [companyForm, setCompanyForm] = useState({ name: '', description: '', website: '', location: '' })
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    status: 'ACTIVE',
    companyId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    recruiterApi.getCompanies().then(({ data }) => {
      setCompanies(data)
      if (data.length > 0 && !form.companyId) {
        setForm((f) => ({ ...f, companyId: String(data[0].id) }))
      }
    })
  }, [])

  useEffect(() => {
    if (isEdit && id) {
      recruiterApi.getJobs().then(({ data }) => {
        const job = data.content.find((j) => j.id === Number(id))
        if (job) {
          setForm({
            title: job.title,
            description: job.description,
            requirements: job.requirements || '',
            salaryMin: job.salaryMin?.toString() || '',
            salaryMax: job.salaryMax?.toString() || '',
            location: job.location || '',
            jobType: job.jobType,
            experienceLevel: job.experienceLevel,
            status: job.status,
            companyId: String(job.company.id),
          })
        }
      })
    }
  }, [id, isEdit])

  const createCompany = async () => {
    const { data } = await recruiterApi.createCompany(companyForm)
    setCompanies([...companies, data])
    setForm({ ...form, companyId: String(data.id) })
    setShowCompanyForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        companyId: Number(form.companyId),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      }
      if (isEdit && id) {
        await recruiterApi.updateJob(Number(id), payload)
      } else {
        await recruiterApi.createJob(payload)
      }
      navigate('/recruiter/jobs')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-8">{isEdit ? 'Edit Job' : 'Post a Job'}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Company</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowCompanyForm(!showCompanyForm)}>
                    {showCompanyForm ? 'Cancel' : '+ Add Company'}
                  </Button>
                </div>
                {showCompanyForm ? (
                  <div className="space-y-3 p-4 rounded-lg bg-secondary/50 mb-4">
                    <Input placeholder="Company name" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
                    <Input placeholder="Website" value={companyForm.website} onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })} />
                    <Input placeholder="Location" value={companyForm.location} onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })} />
                    <Textarea placeholder="Description" value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} />
                    <Button type="button" variant="outline" onClick={createCompany}>Create Company</Button>
                  </div>
                ) : (
                  <Select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} required>
                    <option value="">Select company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                )}
              </div>

              <Input placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <Textarea placeholder="Requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
              <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Min salary" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
                <Input type="number" placeholder="Max salary" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                  {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'HYBRID', 'INTERNSHIP'].map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </Select>
                <Select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                  {['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </Select>
              </div>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="CLOSED">Closed</option>
              </Select>

              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

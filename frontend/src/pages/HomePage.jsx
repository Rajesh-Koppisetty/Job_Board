import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Building2, 
  ArrowRight, 
  Code2, 
  Palette, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  GraduationCap,
  Star,
  CheckCircle2,
  ChevronRight,
  Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'

const stats = [
  { icon: Briefcase, label: 'Active Jobs', value: '12,500+' },
  { icon: Users, label: 'Top Talent', value: '85,000+' },
  { icon: Building2, label: 'Verified Employers', value: '3,200+' },
  { icon: TrendingUp, label: 'Successful Hires', value: '18,400+' },
]

const categories = [
  { icon: Code2, title: 'Tech & Engineering', count: '4,280+ active jobs' },
  { icon: Layers, title: 'AI & Data Science', count: '1,420+ active jobs' },
  { icon: Palette, title: 'Design & Creative', count: '1,850+ active jobs' },
  { icon: ShieldCheck, title: 'Product & Project', count: '980+ active jobs' },
  { icon: BarChart3, title: 'Marketing & Sales', count: '1,240+ active jobs' },
  { icon: GraduationCap, title: 'Graduate & Interns', count: '640+ active jobs' },
]

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Senior Frontend Engineer',
    company: 'Stripe',
    text: 'TalentFlow completely streamlined my job search. Within 5 days of updating my profile, I got matched with three elite companies and secured an offer.',
    stars: 5,
  },
  {
    name: 'David Vance',
    role: 'VP of Engineering',
    company: 'Vercel',
    text: 'The candidate matching is exceptionally fast. Being able to screen, manage, and approve applicant stages in one unified dashboard saved us dozens of hours.',
    stars: 5,
  },
  {
    name: 'Amara Patel',
    role: 'Product Designer',
    company: 'Airbnb',
    text: 'I loved the real-time application tracking. I knew exactly when my resume was reviewed, when I was shortlisted, and when the interview was scheduled.',
    stars: 5,
  },
]

export function HomePage() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [activeTab, setActiveTab] = useState('seeker') // 'seeker' | 'employer'
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (location) params.set('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  const handleQuickSearch = (kw) => {
    const params = new URLSearchParams()
    params.set('keyword', kw)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute top-20 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.08, 1, 1.08] }}
            transition={{ duration: 14, repeat: Infinity }}
            className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full glass border border-white/10 text-xs font-semibold text-primary mb-6 shadow-sm shadow-primary/5">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              Next-Gen AI-Powered Job Matchmaker
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Accelerate Your <span className="gradient-text">Dream Career</span>
              <br />with Intelligent Flow
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover verified high-impact opportunities. Enjoy real-time tracking, clean recruiter matching, and smooth candidate workflow pipelines.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            onSubmit={handleSearch}
            className="glass rounded-2xl p-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 shadow-2xl border border-white/20"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Job title, keywords, skills..."
                className="pl-11 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="w-px bg-border hidden md:block my-2" />
            <div className="flex-1 relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Location (e.g. Remote, New York)"
                className="pl-11 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" variant="gradient" size="lg" className="md:w-auto h-12 px-8 font-semibold">
              Search Jobs
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </motion.form>

          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-5 text-sm text-muted-foreground"
          >
            <span>Popular Searches:</span>
            {['React', 'Remote', 'Product Manager', 'AI Engineer', 'Python'].map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="px-3 py-1 bg-secondary/50 border border-border rounded-full hover:border-primary hover:text-primary transition-all duration-200"
              >
                {term}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Logotypes */}
      <section className="py-10 border-y border-border/60 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-bold mb-6">
            TRUSTED BY ELITE WORLD CLASS TEAMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {['Vercel', 'Stripe', 'Airbnb', 'Linear', 'Supabase', 'Netflix'].map((name) => (
              <span
                key={name}
                className="text-xl font-black tracking-wider text-muted-foreground hover:text-primary cursor-default transition-colors duration-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center py-8 hover:scale-[1.03] transition-all duration-300 border-border/80 shadow-md">
                  <div className="p-3 bg-primary/5 rounded-full inline-block mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-extrabold text-foreground">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-secondary/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Explore Categories</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find open positions categorized across industry standard technology and operations departments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleQuickSearch(cat.title.split(' ')[0])}
                className="cursor-pointer"
              >
                <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="flex items-center gap-4 py-6">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                      <cat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{cat.count}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">How TalentFlow Works</h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
            Discover a highly coordinated and fully automated flow designed for both hiring and applying
          </p>

          {/* Switch Tab Buttons */}
          <div className="inline-flex p-1 bg-secondary rounded-xl mb-12 border border-border shadow-inner">
            <button
              onClick={() => setActiveTab('seeker')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'seeker'
                  ? 'bg-white dark:bg-slate-900 shadow-md text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'employer'
                  ? 'bg-white dark:bg-slate-900 shadow-md text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              For Recruiters
            </button>
          </div>

          {/* Workflow Content */}
          <div className="grid md:grid-cols-4 gap-6 text-left">
            <AnimatePresence mode="wait">
              {activeTab === 'seeker' ? (
                <>
                  {[
                    { step: '01', title: 'Upload Profile', desc: 'Create your account and complete your profile with credentials.' },
                    { step: '02', title: 'Discover Jobs', desc: 'Browse highly descriptive opportunities with instant filters.' },
                    { step: '03', title: 'Quick Apply', desc: 'Submit customized cover letters and resumes with a single tap.' },
                    { step: '04', title: 'Track Progress', desc: 'Receive real-time dashboard updates as recruiters review your profile.' },
                  ].map((step, i) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-5 rounded-xl border border-border bg-secondary/15 flex flex-col justify-between h-48 hover:border-primary/30 transition-colors"
                    >
                      <div className="text-3xl font-extrabold text-primary/35">{step.step}</div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { step: '01', title: 'Define Roles', desc: 'Post description, salaries, and requirements in minutes.' },
                    { step: '02', title: 'Receive Candidates', desc: 'Applicants are fed directly into your dashboard inboxes.' },
                    { step: '03', title: 'Screen Profiles', desc: 'View complete applicant profiles, emails, cover letters, and resumes.' },
                    { step: '04', title: 'Update Status', desc: 'Approve or reject candidates with one click and notify them instantly.' },
                  ].map((step, i) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-5 rounded-xl border border-border bg-secondary/15 flex flex-col justify-between h-48 hover:border-primary/30 transition-colors"
                    >
                      <div className="text-3xl font-extrabold text-accent/35">{step.step}</div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Social Proof (Testimonials) */}
      <section className="py-20 bg-secondary/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Success Stories</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Read how job seekers and companies found success using our smart AI matching platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full flex flex-col justify-between p-6 hover:shadow-lg transition-shadow border-border/75">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {Array.from({ length: test.stars }).map((_, idx) => (
                        <Star key={idx} className="h-4.5 w-4.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm italic leading-relaxed">
                      "{test.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/80">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm">
                      {test.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{test.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {test.role} · <span className="text-primary font-medium">{test.company}</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Seeker CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/20 p-8 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-xl inline-block">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Looking for a Career Change?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create a profile, upload your resume, and let elite tech organizations find you. Apply seamlessly with matching details.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary" /> One-click apply for active listings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary" /> Real-time tracking of approval stages
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Button onClick={() => navigate('/register')} variant="gradient" className="font-semibold">
                    Get Started as Seeker
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Recruiter CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-transparent to-transparent border-accent/20 p-8 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-accent/10 rounded-xl inline-block">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Hiring Elite Global Talent?</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Post your open listings today. Harness unified workspaces to manage, track, review, and approve applications.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-accent" /> Custom dashboard stats and logs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-accent" /> Clean applicant screening layouts
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Button onClick={() => navigate('/register')} variant="outline" className="border-accent/40 text-accent hover:bg-accent/5 font-semibold">
                    Get Started as Recruiter
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

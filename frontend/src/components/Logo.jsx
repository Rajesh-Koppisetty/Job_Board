import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 font-bold text-xl group ${className}`}>
      <motion.div
        whileHover={{ rotate: 10, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="flex items-center justify-center shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all duration-300 rounded-lg overflow-hidden"
      >
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
          <path
            d="M9 10H23M16 10V22M12 16H20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 22H21"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <span className="gradient-text tracking-wide group-hover:opacity-90 transition-opacity font-extrabold text-2xl">
        TalentFlow
      </span>
    </Link>
  )
}

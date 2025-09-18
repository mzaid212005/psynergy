'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

export default function PrivacyDemoPage() {
  const improvements = [
    {
      title: 'Patient Privacy Protection',
      description: 'Individual patient names and details are now completely hidden from institute view',
      icon: EyeSlashIcon,
      color: 'from-red-500 to-pink-500',
      status: 'implemented',
      details: [
        'No personal information visible to institute admins',
        'Only aggregated, anonymized data shown',
        'USN and names completely removed from institute dashboards',
        'Privacy-first approach for all institute analytics'
      ]
    },
    {
      title: 'Department-wise Analytics',
      description: 'Comprehensive analytics broken down by academic departments',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-500',
      status: 'enhanced',
      details: [
        'Computer Science, Mechanical, Electronics, Civil, Information Science, Biotechnology',
        'Average mood scores per department',
        'Risk distribution by department',
        'Session completion rates',
        'Trend analysis (improving/stable/declining)'
      ]
    },
    {
      title: 'Fixed PDF Downloads',
      description: 'PDF generation now works properly with enhanced error handling',
      icon: DocumentArrowDownIcon,
      color: 'from-green-500 to-emerald-500',
      status: 'fixed',
      details: [
        'Institute reports with anonymized data only',
        'Department-wise breakdown in PDFs',
        'Monthly trend analysis',
        'Professional formatting with privacy notices',
        'Error handling for failed downloads'
      ]
    },
    {
      title: 'Home Page Routing',
      description: 'Starting page now opens correctly with proper navigation',
      icon: HomeIcon,
      color: 'from-purple-500 to-pink-500',
      status: 'working',
      details: [
        'Landing page loads correctly',
        'Navigation works across all pages',
        'Role-based redirects function properly',
        'Modern navigation system implemented'
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-800'
      case 'enhanced': return 'bg-blue-100 text-blue-800'
      case 'fixed': return 'bg-yellow-100 text-yellow-800'
      case 'working': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
      case 'enhanced':
      case 'fixed':
      case 'working':
        return CheckCircleIcon
      default:
        return ExclamationTriangleIcon
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy & Functionality Improvements
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            All requested improvements have been successfully implemented to ensure patient privacy, 
            enhance analytics, fix PDF downloads, and improve navigation.
          </p>
        </motion.div>

        {/* Improvements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {improvements.map((improvement, index) => {
            const StatusIcon = getStatusIcon(improvement.status)
            return (
              <motion.div
                key={improvement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${improvement.color} rounded-lg flex items-center justify-center`}>
                    <improvement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-5 h-5 text-green-600" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(improvement.status)}`}>
                      {improvement.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {improvement.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {improvement.description}
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Key Features:
                  </h4>
                  <ul className="space-y-1">
                    {improvement.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Test Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Test the Improvements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home Page</span>
              </motion.button>
            </Link>
            
            <Link href="/admin/analytics">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Analytics</span>
              </motion.button>
            </Link>
            
            <Link href="/admin/moods">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <EyeSlashIcon className="w-4 h-4" />
                <span>Mood Monitor</span>
              </motion.button>
            </Link>
            
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Login</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Privacy-First Approach
          </h2>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            All institute dashboards now show only aggregated, anonymized data. Individual patient 
            information is completely protected and only visible to authorized healthcare providers 
            with proper patient consent.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

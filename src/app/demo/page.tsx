'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  SparklesIcon,
  ArrowRightIcon,
  UserIcon,
  HeartIcon,
  AcademicCapIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function DemoPage() {
  const newPages = [
    {
      title: 'New Student Dashboard',
      description: 'Modern, card-based layout with animated elements',
      href: '/dashboard-new',
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-cyan-500',
      features: ['Animated stats cards', 'Quick mood check', 'Recent activity feed', 'Floating action buttons']
    },
    {
      title: 'New Doctor Dashboard',
      description: 'Professional interface for patient management',
      href: '/doctor-new',
      icon: HeartIcon,
      color: 'from-green-500 to-emerald-500',
      features: ['Patient overview', 'Today\'s schedule', 'Risk indicators', 'Quick actions']
    },
    {
      title: 'New Login Experience',
      description: 'Split-screen design with role selection',
      href: '/auth/login-new',
      icon: UserIcon,
      color: 'from-purple-500 to-pink-500',
      features: ['Role-based quick login', 'Demo credentials', 'Animated background', 'Modern form design']
    },
    {
      title: 'New Patient Management',
      description: 'Enhanced USN search and patient linking',
      href: '/doctor/patients-new',
      icon: ShieldCheckIcon,
      color: 'from-orange-500 to-red-500',
      features: ['USN-based search', 'Patient linking system', 'Treatment suggestions', 'Modal interfaces']
    }
  ]

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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            New Modern Interface
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Experience the completely redesigned Psynergy interface with modern layouts, 
            smooth animations, and improved user experience.
          </p>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              What's New?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-red-600">
                  ❌ Old Interface Issues
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Basic card layouts</li>
                  <li>• Limited animations</li>
                  <li>• Standard navigation</li>
                  <li>• Simple forms</li>
                  <li>• Basic color schemes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-green-600">
                  ✅ New Modern Design
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Animated gradient cards</li>
                  <li>• Smooth micro-interactions</li>
                  <li>• Top navigation bar</li>
                  <li>• Split-screen layouts</li>
                  <li>• Modern color palettes</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New Pages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {newPages.map((page, index) => (
            <motion.div
              key={page.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${page.color} rounded-lg flex items-center justify-center`}>
                    <page.icon className="w-6 h-6 text-white" />
                  </div>
                  <Link href={page.href}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-lg transition-colors duration-200"
                    >
                      <ArrowRightIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </motion.button>
                  </Link>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {page.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {page.description}
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Key Features:
                  </h4>
                  <ul className="space-y-1">
                    {page.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={page.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full mt-6 bg-gradient-to-r ${page.color} text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2`}
                  >
                    <span>Try New Interface</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              Navigation Improvements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Old Sidebar Navigation
                </h3>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 h-32 flex items-center justify-center">
                  <span className="text-slate-500 dark:text-slate-400">Traditional sidebar layout</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  New Top Navigation
                </h3>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 h-32 flex items-center justify-center">
                  <span className="text-slate-700 dark:text-slate-300">Modern top bar with search</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience the New Interface?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start with any of the new pages above or try the complete workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login-new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                >
                  Try New Login
                </motion.button>
              </Link>
              <Link href="/dashboard-new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Try New Dashboard
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export function ModernNavigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = [
      { name: 'Dashboard', href: '/dashboard-new', icon: HomeIcon },
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ]

    if (user.role === 'student') {
      return [
        { name: 'Dashboard', href: '/dashboard-new', icon: HomeIcon },
        { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
        { name: 'Mood Tracker', href: '/mood', icon: HeartIcon },
        { name: 'Book Session', href: '/book-counseling', icon: CalendarDaysIcon },
        { name: 'Resources', href: '/resources', icon: BookOpenIcon },
        { name: 'Community', href: '/community', icon: UserGroupIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
      ]
    }

    if (user.role === 'doctor') {
      return [
        { name: 'Dashboard', href: '/doctor-new', icon: HomeIcon },
        { name: 'Patients', href: '/doctor/patients', icon: UserGroupIcon },
        { name: 'Schedule', href: '/doctor/slots', icon: CalendarDaysIcon },
        { name: 'Analytics', href: '/doctor/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
      ]
    }

    if (user.role === 'institute' || user.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
        { name: 'Mood Monitor', href: '/admin/moods', icon: HeartIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
      ]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Psynergy
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden sm:block relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-200"
                />
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <BellIcon className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <UserCircleIcon className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user?.name || 'Guest'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.role || 'Not logged in'}
                    </p>
                  </div>
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {isOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </motion.div>
                    </Link>
                  )
                })}
                
                {user && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Sign Out</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  )
}

// Floating Action Button for quick actions
export function FloatingActionButton() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const quickActions = user.role === 'student' 
    ? [
        { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, color: 'bg-blue-500' },
        { name: 'Log Mood', href: '/mood', icon: HeartIcon, color: 'bg-pink-500' },
        { name: 'Book Session', href: '/book-counseling', icon: CalendarDaysIcon, color: 'bg-green-500' },
      ]
    : user.role === 'doctor'
    ? [
        { name: 'Patients', href: '/doctor/patients', icon: UserGroupIcon, color: 'bg-blue-500' },
        { name: 'Schedule', href: '/doctor/slots', icon: CalendarDaysIcon, color: 'bg-green-500' },
      ]
    : []

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <div className={`${action.color} p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-200"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Bars3Icon className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  )
}

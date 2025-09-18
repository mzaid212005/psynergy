'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  SparklesIcon,
  FaceSmileIcon,
  AcademicCapIcon,
  StarIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function DashboardPage() {
  const { user: authUser } = useAuth()
  const router = useRouter()

  // Redirect doctors and institute admins to their proper dashboards
  useEffect(() => {
    if (authUser) {
      if (authUser.role === 'doctor') {
        router.push('/doctor')
        return
      }
      if (authUser.role === 'institute' || authUser.role === 'admin') {
        router.push('/admin')
        return
      }
    }
  }, [authUser, router])

  // Fallback user data for demo purposes
  const user = authUser || {
    name: 'Student User',
    college: 'RV College of Engineering',
    usn: '1RV21CS099',
    preferredLanguage: 'English'
  }

  // Don't render if user should be redirected
  if (authUser && (authUser.role === 'doctor' || authUser.role === 'institute' || authUser.role === 'admin')) {
    return null
  }

  const quickActions = [
    {
      title: 'AI Support Chat',
      description: 'Get instant help from our AI counselor',
      icon: ChatBubbleLeftRightIcon,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      href: '/chat',
      emoji: '🤖'
    },
    {
      title: 'Book Counseling',
      description: 'Schedule a session with a professional',
      icon: CalendarDaysIcon,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      href: '/book-counseling',
      emoji: '📅'
    },
    {
      title: 'Mental Health Resources',
      description: 'Access guides, videos, and exercises',
      icon: BookOpenIcon,
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      href: '/resources',
      emoji: '📚'
    },
    {
      title: 'Peer Support',
      description: 'Connect with fellow students',
      icon: UsersIcon,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      href: '/community',
      emoji: '👥'
    },
    {
      title: 'Mood Tracker',
      description: 'Log your daily mood and feelings',
      icon: FaceSmileIcon,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      href: '/mood',
      emoji: '😊'
    },
    {
      title: 'Learning Hub',
      description: 'Enhance your mental wellness knowledge',
      icon: AcademicCapIcon,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      href: '/learning',
      emoji: '🎓'
    }
  ]

  const recentActivity = [
    { type: 'assessment', title: 'Completed PHQ-9 Assessment', time: '2 hours ago', status: 'completed' },
    { type: 'chat', title: 'AI Support Session', time: '1 day ago', status: 'completed' },
    { type: 'resource', title: 'Viewed: Managing Exam Stress', time: '3 days ago', status: 'viewed' },
    { type: 'appointment', title: 'Counseling Session Scheduled', time: '5 days ago', status: 'upcoming' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 shadow-lg"
              >
                <HeartIcon className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Psynergy ✨
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back, {user.name}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              >
                <BellIcon className="h-6 w-6" />
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-gradient-to-r from-red-400 to-pink-400 ring-2 ring-white dark:ring-gray-800"
                />
              </motion.button>
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
              >
                <Cog6ToothIcon className="h-6 w-6" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 border-4 border-white/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -left-10 w-32 h-32 border-4 border-white/20 rounded-full"
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
              >
                <SunIcon className="w-8 h-8 text-yellow-300" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="text-3xl font-bold mb-3"
              >
                Welcome back, {user.name}! ✨
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-white/90 mb-6 text-lg"
              >
                Ready to continue your mental wellness journey? Every step counts! 🌟
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="flex flex-wrap gap-4 text-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30"
                >
                  <span className="font-medium">🏫 College:</span> {user.college}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30"
                >
                  <span className="font-medium">🎓 USN:</span> {user.usn}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30"
                >
                  <span className="font-medium">🌍 Language:</span> {user.preferredLanguage}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mb-16"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🚀 Quick Actions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Choose your next step towards better mental wellness
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 2 + index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  bounce: 0.3
                }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-pointer"
              >
                <Link href={action.href}>
                  <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="relative p-8">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <span className="text-3xl">{action.emoji}</span>
                      </motion.div>

                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {action.title}
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {action.description}
                      </p>

                      <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        className={`h-1 bg-gradient-to-r ${action.gradient} rounded-full transition-all duration-300`}
                      />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-500' :
                        activity.status === 'upcoming' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Wellness Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wellness Score</h3>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="75, 100"
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">75</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Good mental health status</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sessions this month</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Resources accessed</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Community posts</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">3</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
  FaceSmileIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function NewDashboard() {
  const { user: authUser } = useAuth()
  const router = useRouter()
  
  // Redirect non-students
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

  const user = authUser || {
    name: 'Student User',
    college: 'RV College of Engineering',
    usn: '1RV21CS099',
    email: 'student@example.com'
  }

  const quickActions = [
    {
      title: 'Start AI Chat',
      description: 'Get instant mental health support',
      icon: ChatBubbleLeftRightIcon,
      href: '/chat',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Log Mood',
      description: 'Track your daily feelings',
      icon: HeartIcon,
      href: '/mood',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
    },
    {
      title: 'Book Session',
      description: 'Schedule counseling appointment',
      icon: CalendarDaysIcon,
      href: '/book-counseling',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Browse Resources',
      description: 'Access mental health guides',
      icon: BookOpenIcon,
      href: '/resources',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ]

  const stats = [
    { label: 'Days Active', value: '12', icon: ChartBarIcon, color: 'text-blue-600' },
    { label: 'Mood Entries', value: '8', icon: FaceSmileIcon, color: 'text-green-600' },
    { label: 'Sessions Booked', value: '3', icon: CalendarDaysIcon, color: 'text-purple-600' },
    { label: 'Resources Read', value: '15', icon: BookOpenIcon, color: 'text-orange-600' }
  ]

  const recentActivity = [
    { type: 'mood', title: 'Logged mood: Happy', time: '2 hours ago', status: 'positive' },
    { type: 'chat', title: 'AI Chat Session', time: '1 day ago', status: 'completed' },
    { type: 'resource', title: 'Read: Stress Management', time: '2 days ago', status: 'completed' },
    { type: 'appointment', title: 'Counseling Session', time: '3 days ago', status: 'completed' }
  ]

  if (authUser && (authUser.role === 'doctor' || authUser.role === 'institute' || authUser.role === 'admin')) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome back, {user.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  How are you feeling today? Let's check in on your mental wellness.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={action.href}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                    <div className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-lg flex items-center justify-center mb-4 transition-colors duration-200`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      Get started
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity & Mood Check */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'positive' ? 'bg-green-500' :
                      activity.status === 'completed' ? 'bg-blue-500' : 'bg-slate-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Mood Check */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                Quick Mood Check
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                How are you feeling right now?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['😊', '😐', '😔', '😰'].map((emoji, index) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 text-2xl bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              <Link href="/mood">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Detailed Mood Log
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowRightIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

export default function NewDoctorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPatients: 24,
    highRiskPatients: 3,
    appointmentsToday: 5,
    averageMoodThisWeek: 6.8
  })

  const recentPatients = [
    { name: 'Arjun Patel', mood: 4.2, trend: 'declining', risk: 'high', lastSeen: '2 hours ago' },
    { name: 'Priya Sharma', mood: 7.1, trend: 'improving', risk: 'low', lastSeen: '1 day ago' },
    { name: 'Rahul Kumar', mood: 5.8, trend: 'stable', risk: 'medium', lastSeen: '2 days ago' },
    { name: 'Anita Singh', mood: 3.9, trend: 'declining', risk: 'high', lastSeen: '3 hours ago' }
  ]

  const quickActions = [
    {
      title: 'Patient Management',
      description: 'Search and manage your patients',
      icon: UserGroupIcon,
      href: '/doctor/patients',
      color: 'bg-blue-600'
    },
    {
      title: 'Create Slots',
      description: 'Set up counseling availability',
      icon: CalendarDaysIcon,
      href: '/doctor/slots',
      color: 'bg-green-600'
    },
    {
      title: 'View Analytics',
      description: 'Patient progress insights',
      icon: ChartBarIcon,
      href: '/doctor/analytics',
      color: 'bg-purple-600'
    },
    {
      title: 'Generate Reports',
      description: 'Download patient reports',
      icon: DocumentTextIcon,
      href: '/doctor/reports',
      color: 'bg-orange-600'
    }
  ]

  const upcomingAppointments = [
    { patient: 'Arjun Patel', time: '10:00 AM', type: 'Individual Session', urgent: true },
    { patient: 'Priya Sharma', time: '11:30 AM', type: 'Follow-up', urgent: false },
    { patient: 'Rahul Kumar', time: '2:00 PM', type: 'Group Therapy', urgent: false },
    { patient: 'Anita Singh', time: '3:30 PM', type: 'Crisis Intervention', urgent: true }
  ]

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
                  Welcome, {user?.name || 'Doctor'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {user?.specialization && `${user.specialization} • `}
                  {user?.experience && `${user.experience} experience`}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Monitor your patients' mental health progress and provide care.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <HeartIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Patients</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPatients}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">High Risk</p>
                <p className="text-3xl font-bold text-red-600">{stats.highRiskPatients}</p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today's Sessions</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.appointmentsToday}</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Mood</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.averageMoodThisWeek}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
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
              >
                <Link href={action.href}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                      Access
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Patients & Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Patients
                </h3>
                <Link href="/doctor/patients" className="text-sm text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentPatients.map((patient, index) => (
                  <motion.div
                    key={patient.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        patient.risk === 'high' ? 'bg-red-500' :
                        patient.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {patient.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Mood: {patient.mood}/10 • {patient.lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {patient.trend === 'improving' ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                      ) : patient.trend === 'declining' ? (
                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Today's Schedule
                </h3>
                <Link href="/doctor/appointments" className="text-sm text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`p-3 rounded-lg border-l-4 ${
                      appointment.urgent 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {appointment.patient}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {appointment.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {appointment.time}
                        </p>
                        {appointment.urgent && (
                          <span className="text-xs text-red-600 font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

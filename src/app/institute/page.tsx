'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  UsersIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  BellIcon,
  AcademicCapIcon,
  HeartIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { generateComprehensiveReport } from '@/lib/pdf-generator'
import { motion } from 'framer-motion'

interface InstituteStats {
  totalStudents: number
  totalDoctors: number
  totalSessions: number
  highRiskStudents: number
  mediumRiskStudents: number
  lowRiskStudents: number
  averageMoodScore: number
  totalBookings: number
  pendingBookings: number
  completedSessions: number
  cancelledSessions: number
}

interface RecentActivity {
  id: string
  type: 'booking' | 'mood_entry' | 'session' | 'alert'
  message: string
  timestamp: string
  priority: 'low' | 'medium' | 'high'
}

export default function InstituteDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<InstituteStats>({
    totalStudents: 0,
    totalDoctors: 0,
    totalSessions: 0,
    highRiskStudents: 0,
    mediumRiskStudents: 0,
    lowRiskStudents: 0,
    averageMoodScore: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedSessions: 0,
    cancelledSessions: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    loadInstituteData()
  }, [])

  const loadInstituteData = () => {
    // Load patient mood data
    const patientData = JSON.parse(localStorage.getItem('patientMoodData') || '[]')
    const bookings = JSON.parse(localStorage.getItem('studentBookings') || '[]')
    const doctorSlots = JSON.parse(localStorage.getItem('doctorSlots') || '[]')

    // Calculate statistics
    const highRisk = patientData.filter((p: any) => p.riskLevel === 'high').length
    const mediumRisk = patientData.filter((p: any) => p.riskLevel === 'medium').length
    const lowRisk = patientData.filter((p: any) => p.riskLevel === 'low').length
    const avgMood = patientData.length > 0 
      ? patientData.reduce((sum: number, p: any) => sum + p.averageMood, 0) / patientData.length 
      : 0

    const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length
    const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled').length

    setStats({
      totalStudents: patientData.length,
      totalDoctors: 3, // Mock data - in real app, fetch from API
      totalSessions: doctorSlots.length,
      highRiskStudents: highRisk,
      mediumRiskStudents: mediumRisk,
      lowRiskStudents: lowRisk,
      averageMoodScore: avgMood,
      totalBookings: bookings.length,
      pendingBookings: confirmedBookings,
      completedSessions: doctorSlots.filter((s: any) => s.status === 'booked').length,
      cancelledSessions: cancelledBookings
    })

    // Generate recent activity
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'alert',
        message: `${highRisk} students identified as high-risk`,
        timestamp: new Date().toISOString(),
        priority: highRisk > 0 ? 'high' : 'low'
      },
      {
        id: '2',
        type: 'booking',
        message: `${confirmedBookings} new counseling sessions booked today`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium'
      },
      {
        id: '3',
        type: 'session',
        message: `${doctorSlots.length} counseling slots available this week`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        priority: 'low'
      }
    ]

    setRecentActivity(activities)
  }

  const downloadComprehensiveReport = () => {
    const patientData = JSON.parse(localStorage.getItem('patientMoodData') || '[]')
    const bookings = JSON.parse(localStorage.getItem('studentBookings') || '[]')
    generateComprehensiveReport(patientData, bookings)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return CalendarDaysIcon
      case 'mood_entry': return HeartIcon
      case 'session': return ClockIcon
      case 'alert': return ExclamationTriangleIcon
      default: return BellIcon
    }
  }

  if (!user || user.role !== 'institute') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Institute administrator credentials required.
            </p>
            <Button asChild>
              <a href="/auth/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Institute Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back, {user.name} • {user.instituteName}
              </p>
            </div>
            <Button
              onClick={downloadComprehensiveReport}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Download Report</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Doctors</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDoctors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <HeartIcon className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Mood Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageMoodScore.toFixed(1)}/10
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

     
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link href="/admin/analytics" className="block">
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Student Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive student insights</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DocumentArrowDownIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Reports</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generate comprehensive reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">High Risk</span>
                  </div>
                  <span className="text-sm font-bold">{stats.highRiskStudents} students</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Medium Risk</span>
                  </div>
                  <span className="text-sm font-bold">{stats.mediumRiskStudents} students</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Low Risk</span>
                  </div>
                  <span className="text-sm font-bold">{stats.lowRiskStudents} students</span>
                </div>
              </div>
              
              {stats.highRiskStudents > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">
                      Immediate attention required for {stats.highRiskStudents} high-risk students
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Sessions</span>
                  <span className="text-sm font-bold">{stats.pendingBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed Sessions</span>
                  <span className="text-sm font-bold">{stats.completedSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cancelled Sessions</span>
                  <span className="text-sm font-bold">{stats.cancelledSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available Slots</span>
                  <span className="text-sm font-bold">{stats.totalSessions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No recent activity to display
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type)
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center p-3 rounded-lg ${getPriorityColor(activity.priority)}`}
                    >
                      <IconComponent className="h-5 w-5 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs opacity-75">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    
  )
}

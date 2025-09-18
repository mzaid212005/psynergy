'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { generateComprehensiveReport, generateInstituteReport } from '@/lib/pdf-generator'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AnalyticsData {
  totalStudents: number
  activeStudents: number
  totalSessions: number
  completedSessions: number
  averageMoodScore: number
  riskDistribution: {
    high: number
    medium: number
    low: number
  }
  monthlyTrends: {
    month: string
    moodScore: number
    sessions: number
    students: number
  }[]
  departmentStats: {
    department: string
    students: number
    averageMood: number
    riskLevel: 'high' | 'medium' | 'low'
    activeSessions: number
    completionRate: number
    trend: 'improving' | 'stable' | 'declining'
  }[]
}

export default function StudentAnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    activeStudents: 0,
    totalSessions: 0,
    completedSessions: 0,
    averageMoodScore: 0,
    riskDistribution: { high: 0, medium: 0, low: 0 },
    monthlyTrends: [],
    departmentStats: []
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = () => {
    // Load data from localStorage
    const patientData = JSON.parse(localStorage.getItem('patientMoodData') || '[]')
    const bookings = JSON.parse(localStorage.getItem('studentBookings') || '[]')
    const slots = JSON.parse(localStorage.getItem('doctorSlots') || '[]')

    // Calculate analytics
    const totalStudents = patientData.length
    const activeStudents = patientData.filter((p: any) => 
      new Date(p.lastEntry) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length

    const highRisk = patientData.filter((p: any) => p.riskLevel === 'high').length
    const mediumRisk = patientData.filter((p: any) => p.riskLevel === 'medium').length
    const lowRisk = patientData.filter((p: any) => p.riskLevel === 'low').length

    const avgMood = totalStudents > 0 
      ? patientData.reduce((sum: number, p: any) => sum + p.averageMood, 0) / totalStudents 
      : 0

    // Mock monthly trends data
    const monthlyTrends = [
      { month: 'Jan', moodScore: 6.2, sessions: 45, students: 120 },
      { month: 'Feb', moodScore: 6.5, sessions: 52, students: 135 },
      { month: 'Mar', moodScore: 6.1, sessions: 48, students: 142 },
      { month: 'Apr', moodScore: 5.8, sessions: 61, students: 156 },
      { month: 'May', moodScore: 6.3, sessions: 58, students: 148 },
      { month: 'Jun', moodScore: 6.7, sessions: 43, students: 132 }
    ]

    // Enhanced department stats with more detailed analytics
    const departmentStats = [
      {
        department: 'Computer Science',
        students: 45,
        averageMood: 6.2,
        riskLevel: 'medium' as const,
        activeSessions: 28,
        completionRate: 85,
        trend: 'improving'
      },
      {
        department: 'Mechanical Engineering',
        students: 38,
        averageMood: 6.8,
        riskLevel: 'low' as const,
        activeSessions: 22,
        completionRate: 92,
        trend: 'stable'
      },
      {
        department: 'Electronics & Communication',
        students: 42,
        averageMood: 5.9,
        riskLevel: 'medium' as const,
        activeSessions: 31,
        completionRate: 78,
        trend: 'declining'
      },
      {
        department: 'Civil Engineering',
        students: 35,
        averageMood: 7.1,
        riskLevel: 'low' as const,
        activeSessions: 18,
        completionRate: 94,
        trend: 'improving'
      },
      {
        department: 'Information Science',
        students: 28,
        averageMood: 5.4,
        riskLevel: 'high' as const,
        activeSessions: 25,
        completionRate: 72,
        trend: 'declining'
      },
      {
        department: 'Biotechnology',
        students: 22,
        averageMood: 6.5,
        riskLevel: 'low' as const,
        activeSessions: 15,
        completionRate: 88,
        trend: 'stable'
      }
    ]

    setAnalytics({
      totalStudents,
      activeStudents,
      totalSessions: bookings.length,
      completedSessions: bookings.filter((b: any) => b.status === 'confirmed').length,
      averageMoodScore: avgMood,
      riskDistribution: { high: highRisk, medium: mediumRisk, low: lowRisk },
      monthlyTrends,
      departmentStats
    })
  }

  const downloadReport = async () => {
    try {
      // Create anonymized data for institute report (no personal details)
      const anonymizedData = {
        instituteName: user?.instituteName || 'RV College of Engineering',
        reportDate: new Date().toLocaleDateString(),
        totalStudents: analytics.totalStudents,
        activeStudents: analytics.activeStudents,
        averageMoodScore: analytics.averageMoodScore,
        riskDistribution: analytics.riskDistribution,
        departmentStats: analytics.departmentStats,
        monthlyTrends: analytics.monthlyTrends,
        totalSessions: analytics.totalSessions,
        completedSessions: analytics.completedSessions
      }

      await generateInstituteReport(anonymizedData)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error generating PDF report. Please try again.')
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
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
                Student Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Comprehensive analytics and insights for student mental health
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={downloadReport}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Download Report
              </Button>
              <Link href="/institute">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.activeStudents}</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalSessions}</p>
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
                    {analytics.averageMoodScore.toFixed(1)}/10
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">High Risk</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.riskDistribution.high} students</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Medium Risk</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.riskDistribution.medium} students</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Low Risk</span>
                  </div>
                  <span className="text-sm font-bold">{analytics.riskDistribution.low} students</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.monthlyTrends.slice(-3).map((trend, index) => (
                  <div key={trend.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{trend.month}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-600">Mood: {trend.moodScore}</span>
                      <span className="text-xs text-gray-600">Sessions: {trend.sessions}</span>
                      <span className="text-xs text-gray-600">Students: {trend.students}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Department</th>
                    <th className="text-left py-3 px-4 font-medium">Students</th>
                    <th className="text-left py-3 px-4 font-medium">Avg Mood</th>
                    <th className="text-left py-3 px-4 font-medium">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.departmentStats.map((dept, index) => (
                    <motion.tr
                      key={dept.department}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4 font-medium">{dept.department}</td>
                      <td className="py-3 px-4">{dept.students}</td>
                      <td className="py-3 px-4">{dept.averageMood.toFixed(1)}/10</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(dept.riskLevel)}`}>
                          {dept.riskLevel.charAt(0).toUpperCase() + dept.riskLevel.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

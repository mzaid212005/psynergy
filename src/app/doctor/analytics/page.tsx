'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

// Sample analytics data
const analyticsData = {
  overview: {
    totalPatients: 45,
    activePatients: 32,
    completedSessions: 156,
    averageImprovement: 78
  },
  moodTrends: [
    { month: 'Jan', average: 6.2, sessions: 12 },
    { month: 'Feb', average: 6.8, sessions: 15 },
    { month: 'Mar', average: 7.1, sessions: 18 },
    { month: 'Apr', average: 7.4, sessions: 22 },
    { month: 'May', average: 7.8, sessions: 25 },
    { month: 'Jun', average: 8.1, sessions: 28 }
  ],
  riskDistribution: {
    low: 28,
    medium: 12,
    high: 5
  },
  recentPatients: [
    { id: 1, name: 'Zaid Ahmed', lastSession: '2024-01-15', improvement: '+15%', risk: 'low' },
    { id: 2, name: 'Priya Sharma', lastSession: '2024-01-14', improvement: '+8%', risk: 'medium' },
    { id: 3, name: 'Arjun Patel', lastSession: '2024-01-13', improvement: '+22%', risk: 'low' },
    { id: 4, name: 'Sneha Reddy', lastSession: '2024-01-12', improvement: '-3%', risk: 'high' },
    { id: 5, name: 'Rahul Kumar', lastSession: '2024-01-11', improvement: '+12%', risk: 'medium' }
  ]
}

export default function DoctorAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [isExporting, setIsExporting] = useState(false)

  const exportReport = async () => {
    setIsExporting(true)

    try {
      // Create a comprehensive analytics report
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeframe: selectedTimeframe,
        overview: analyticsData.overview,
        moodTrends: analyticsData.moodTrends,
        riskDistribution: analyticsData.riskDistribution,
        recentPatients: analyticsData.recentPatients.map(patient => ({
          ...patient,
          // Remove sensitive data for export
          name: patient.name.split(' ').map(n => n[0]).join('') + '***'
        }))
      }

      // Create downloadable JSON report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `patient-analytics-report-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Also create a CSV version for easy analysis
      const csvData = [
        ['Metric', 'Value'],
        ['Total Patients', analyticsData.overview.totalPatients],
        ['Active Patients', analyticsData.overview.activePatients],
        ['Completed Sessions', analyticsData.overview.completedSessions],
        ['Average Improvement', `${analyticsData.overview.averageImprovement}%`],
        [''],
        ['Risk Distribution', ''],
        ['Low Risk', analyticsData.riskDistribution.low],
        ['Medium Risk', analyticsData.riskDistribution.medium],
        ['High Risk', analyticsData.riskDistribution.high],
        [''],
        ['Mood Trends', ''],
        ...analyticsData.moodTrends.map(trend => [trend.month, `${trend.average}/10 (${trend.sessions} sessions)`])
      ]

      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const csvBlob = new Blob([csvContent], { type: 'text/csv' })
      const csvUrl = URL.createObjectURL(csvBlob)
      const csvLink = document.createElement('a')
      csvLink.href = csvUrl
      csvLink.download = `patient-analytics-summary-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(csvLink)
      csvLink.click()
      document.body.removeChild(csvLink)
      URL.revokeObjectURL(csvUrl)

    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getImprovementIcon = (improvement: string) => {
    return improvement.startsWith('+') ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/doctor-new">
              <Button variant="outline" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Patient Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive insights into patient progress and outcomes
              </p>
            </div>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            onClick={exportReport}
            disabled={isExporting}
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </motion.div>

        {/* Timeframe Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-2 mb-6"
        >
          {[
            { key: '1month', label: '1 Month' },
            { key: '3months', label: '3 Months' },
            { key: '6months', label: '6 Months' },
            { key: '1year', label: '1 Year' }
          ].map((timeframe) => (
            <Button
              key={timeframe.key}
              variant={selectedTimeframe === timeframe.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe.key)}
            >
              {timeframe.label}
            </Button>
          ))}
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.totalPatients}
                  </p>
                </div>
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active Patients</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.activePatients}
                  </p>
                </div>
                <CalendarDaysIcon className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.completedSessions}
                  </p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Avg Improvement</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.overview.averageImprovement}%
                  </p>
                </div>
                <ArrowTrendingUpIcon className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                  <span>Mood Trends Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.moodTrends.map((trend, index) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-8">
                          {trend.month}
                        </span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-32">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(trend.average / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {trend.average}/10
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {trend.sessions} sessions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                  <span>Risk Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Risk</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {analyticsData.riskDistribution.low}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium Risk</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {analyticsData.riskDistribution.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Risk</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {analyticsData.riskDistribution.high}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Patient Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{patient.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Last session: {patient.lastSession}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getImprovementIcon(patient.improvement)}
                        <span className={`text-sm font-medium ${
                          patient.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {patient.improvement}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.risk)}`}>
                        {patient.risk} risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

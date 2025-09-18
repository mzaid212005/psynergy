'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsOverview } from '@/components/features/analytics-overview'
import { AlertsPanel } from '@/components/features/alerts-panel'
import { MentalHealthDashboard } from '@/components/features/mental-health-dashboard'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface DashboardData {
  overview: any
  trends: any[]
  alerts: any[]
  performance: any
  mentalHealthOverview: any
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [unreadAlerts, setUnreadAlerts] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics?includeAlerts=true')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      
      const data = await response.json()
      setDashboardData(data)
      setUnreadAlerts(data.alerts?.length || 0)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAlertsRead = async (alertIds?: string[]) => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertIds,
          markAllRead: !alertIds
        })
      })

      if (!response.ok) throw new Error('Failed to update alerts')
      
      const data = await response.json()
      setUnreadAlerts(data.unreadCount)
      fetchDashboardData() // Refresh data
      toast.success('Alerts updated successfully')
    } catch (error) {
      console.error('Error updating alerts:', error)
      toast.error('Failed to update alerts')
    }
  }

  const exportReport = async (reportType: string, format: string = 'json') => {
    try {
      const response = await fetch(`/api/analytics?reportType=${reportType}&format=${format}`, {
        method: 'PATCH'
      })

      if (!response.ok) throw new Error('Failed to export report')

      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      toast.success('Report exported successfully')
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Failed to export report')
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'mental_health', name: 'Mental Health', icon: UserGroupIcon },
    { id: 'usage', name: 'Usage Analytics', icon: ArrowTrendingUpIcon },
    { id: 'performance', name: 'Performance', icon: Cog6ToothIcon },
    { id: 'alerts', name: 'Alerts', icon: BellIcon, badge: unreadAlerts },
    { id: 'reports', name: 'Reports', icon: DocumentArrowDownIcon }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Institute Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Psynergy Mental Health Platform - College Administration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <Button
                onClick={fetchDashboardData}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                Refresh
              </Button>
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Back to App</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      {dashboardData && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {dashboardData.overview.totalUsers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dashboardData.overview.activeUsers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dashboardData.overview.assessmentsCompleted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {dashboardData.overview.appointmentsScheduled}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Appointments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {dashboardData.performance.systemHealth.uptime}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {dashboardData.performance.interventionMetrics.crisisInterventions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Crisis Alerts</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  unreadAlerts > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {unreadAlerts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Unread Alerts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-red-900/20 dark:text-red-300">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && dashboardData && (
            <AnalyticsOverview 
              data={dashboardData} 
              onRefresh={fetchDashboardData}
            />
          )}

          {activeTab === 'mental_health' && (
            <MentalHealthDashboard />
          )}

          {activeTab === 'usage' && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Usage Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Detailed usage patterns and user behavior analytics coming soon.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'performance' && dashboardData && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Performance Metrics
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  System performance monitoring and optimization tools coming soon.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'alerts' && (
            <AlertsPanel
              onMarkRead={handleMarkAlertsRead}
              onRefresh={fetchDashboardData}
            />
          )}

          {activeTab === 'reports' && (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Reports Generator
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automated report generation and export functionality coming soon.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  )
}

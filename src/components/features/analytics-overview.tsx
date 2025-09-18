'use client'

import { motion } from 'framer-motion'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AnalyticsOverviewProps {
  data: any
  onRefresh: () => void
}

export function AnalyticsOverview({ data, onRefresh }: AnalyticsOverviewProps) {
  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    } else if (change < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    }
    return null
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400'
    if (change < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const metricCards = [
    {
      title: 'Total Users',
      value: data.overview.totalUsers.toLocaleString(),
      icon: UserGroupIcon,
      color: 'blue',
      trend: data.trends.find((t: any) => t.metric === 'active_users')?.change || 0
    },
    {
      title: 'Active Users',
      value: data.overview.activeUsers.toLocaleString(),
      icon: UserGroupIcon,
      color: 'green',
      trend: data.trends.find((t: any) => t.metric === 'active_users')?.change || 0
    },
    {
      title: 'Assessments Completed',
      value: data.overview.assessmentsCompleted.toLocaleString(),
      icon: ClipboardDocumentCheckIcon,
      color: 'purple',
      trend: data.trends.find((t: any) => t.metric === 'assessments')?.change || 0
    },
    {
      title: 'Appointments Scheduled',
      value: data.overview.appointmentsScheduled.toLocaleString(),
      icon: CalendarDaysIcon,
      color: 'orange',
      trend: data.trends.find((t: any) => t.metric === 'appointments')?.change || 0
    },
    {
      title: 'Resources Accessed',
      value: data.overview.resourcesAccessed?.toLocaleString() || '0',
      icon: BookOpenIcon,
      color: 'teal',
      trend: 8.5
    },
    {
      title: 'Forum Posts',
      value: data.overview.forumPosts?.toLocaleString() || '0',
      icon: ChatBubbleLeftRightIcon,
      color: 'indigo',
      trend: 12.3
    },
    {
      title: 'Risk Alerts',
      value: data.overview.riskAlerts.toLocaleString(),
      icon: ExclamationTriangleIcon,
      color: 'red',
      trend: data.trends.find((t: any) => t.metric === 'crisis_alerts')?.change || 0
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metric.value}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                          {formatChange(metric.trend)}
                        </span>
                        <span className="text-sm text-gray-500">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.alerts.slice(0, 5).map((alert: any, index: number) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className={`p-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
                    alert.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' :
                    alert.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    <ExclamationTriangleIcon className={`h-4 w-4 ${
                      alert.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                      alert.severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                      alert.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mental Health Overview */}
      {data.mentalHealthOverview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.mentalHealthOverview.riskFactors.map((factor: any, index: number) => (
                  <motion.div
                    key={factor.factor}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {factor.factor}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Trend: {factor.trend}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${factor.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {factor.percentage}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Intervention Success */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Intervention Success Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.mentalHealthOverview.interventionSuccess).map(([key, value]: [string, any], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {value.sessions} sessions • {value.satisfaction}/5 rating
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${value.effectiveness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {value.effectiveness}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Performance Summary */}
      {data.performance && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.performance.systemHealth.uptime}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.performance.systemHealth.responseTime}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.performance.userEngagement.dailyActiveUsers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Daily Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {data.performance.interventionMetrics.crisisInterventions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Crisis Interventions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

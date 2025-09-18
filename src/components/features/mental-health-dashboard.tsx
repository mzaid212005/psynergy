'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  HeartIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface MentalHealthData {
  assessmentResults: any
  riskFactors: any[]
  interventionSuccess: any
  departmentBreakdown: any[]
}

export function MentalHealthDashboard() {
  const [data, setData] = useState<MentalHealthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    fetchMentalHealthData()
  }, [selectedDepartment])

  const fetchMentalHealthData = async () => {
    try {
      setIsLoading(true)
      const params = selectedDepartment ? `?department=${selectedDepartment}` : ''
      const response = await fetch(`/api/analytics?type=mental_health${params}`)
      if (!response.ok) throw new Error('Failed to fetch mental health data')
      
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching mental health data:', error)
      toast.error('Failed to load mental health data')
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />
    } else if (trend === 'decreasing') {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />
    }
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'increasing') return 'text-red-600 dark:text-red-400'
    if (trend === 'decreasing') return 'text-green-600 dark:text-green-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load data
          </h3>
          <Button onClick={fetchMentalHealthData}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mental Health Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/analytics">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
                Detailed Analytics
              </Button>
            </Link>
            <Link href="/admin/moods">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700">
                <HeartIcon className="w-4 h-4 mr-2" />
                Mood Monitoring
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Crisis intervention tools coming soon')}
            >
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              Crisis Alerts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Mental Health Analytics</CardTitle>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Medicine">Medicine</option>
              <option value="Arts & Sciences">Arts & Sciences</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>
        </CardHeader>
      </Card>

      {/* Assessment Results Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Depression Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <HeartIcon className="h-5 w-5 text-blue-600" />
              <span>Depression Levels</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.assessmentResults.depression).map(([level, percentage]: [string, any]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {level}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          level === 'severe' ? 'bg-red-600' :
                          level === 'moderate' ? 'bg-orange-600' :
                          level === 'mild' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anxiety Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
              <span>Anxiety Levels</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.assessmentResults.anxiety).map(([level, percentage]: [string, any]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {level}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          level === 'severe' ? 'bg-red-600' :
                          level === 'moderate' ? 'bg-orange-600' :
                          level === 'mild' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stress Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
              <span>Stress Levels</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.assessmentResults.stress).map(([level, percentage]: [string, any]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {level}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          level === 'critical' ? 'bg-red-600' :
                          level === 'high' ? 'bg-orange-600' :
                          level === 'moderate' ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.riskFactors.map((factor, index) => (
              <motion.div
                key={factor.factor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {factor.factor}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(factor.trend)}
                    <span className={`text-xs font-medium ${getTrendColor(factor.trend)}`}>
                      {factor.trend}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {factor.percentage}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <AcademicCapIcon className="h-5 w-5" />
            <span>Department Risk Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.departmentBreakdown.map((dept, index) => (
              <motion.div
                key={dept.department}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {dept.department}
                  </h4>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {dept.students.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    students
                  </div>
                  <div className="space-y-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(dept.riskLevel)}`}>
                      {dept.riskLevel} risk
                    </span>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Avg Stress: {dept.avgStress}/10
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intervention Success Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Intervention Effectiveness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(data.interventionSuccess).map(([intervention, metrics]: [string, any]) => (
              <div key={intervention} className="text-center">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 capitalize">
                  {intervention.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics.sessions}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Sessions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {metrics.satisfaction}/5
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {metrics.effectiveness}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Effectiveness</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                🎯 Priority Actions
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Increase counselor availability for Engineering and Medicine departments</li>
                <li>• Develop targeted stress management programs for high-risk students</li>
                <li>• Implement early intervention protocols for academic pressure</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                ✅ Successful Strategies
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Counseling sessions show highest effectiveness (89%)</li>
                <li>• AI chatbot provides accessible 24/7 support</li>
                <li>• Peer support platform reduces social isolation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

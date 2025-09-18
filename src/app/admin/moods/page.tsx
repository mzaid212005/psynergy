'use client'

import { useState, useEffect } from 'react'
import { 
  FaceSmileIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { generatePatientMoodReport } from '@/lib/pdf-generator'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Patient {
  id: string
  name: string
  email: string
  college: string
  usn: string
  department: string
  averageMood: number
  riskLevel: 'high' | 'medium' | 'low'
  lastEntry: string
  totalEntries: number
  recentMoods: number[]
}

export default function AdminMoodMonitoringPage() {
  const { user } = useAuth()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [aggregateData, setAggregateData] = useState({
    totalStudents: 0,
    riskDistribution: { high: 0, medium: 0, low: 0 },
    departmentBreakdown: [] as Array<{
      department: string
      totalStudents: number
      averageMood: number
      riskDistribution: { high: number, medium: number, low: number }
    }>,
    moodTrends: [] as Array<{
      date: string
      averageMood: number
      totalEntries: number
    }>
  })
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'semester'>('month')

  useEffect(() => {
    loadAggregateData()
  }, [])


  const loadAggregateData = () => {
    // Create anonymized aggregate data for institute view
    const aggregatedData = {
      totalStudents: 210,
      riskDistribution: {
        high: 28,
        medium: 89,
        low: 93
      },
      departmentBreakdown: [
        {
          department: 'Computer Science',
          totalStudents: 45,
          averageMood: 6.2,
          riskDistribution: { high: 8, medium: 22, low: 15 }
        },
        {
          department: 'Mechanical Engineering',
          totalStudents: 38,
          averageMood: 6.8,
          riskDistribution: { high: 4, medium: 15, low: 19 }
        },
        {
          department: 'Electronics & Communication',
          totalStudents: 42,
          averageMood: 5.9,
          riskDistribution: { high: 9, medium: 18, low: 15 }
        },
        {
          department: 'Civil Engineering',
          totalStudents: 35,
          averageMood: 7.1,
          riskDistribution: { high: 3, medium: 12, low: 20 }
        },
        {
          department: 'Information Science',
          totalStudents: 28,
          averageMood: 5.4,
          riskDistribution: { high: 7, medium: 14, low: 7 }
        },
        {
          department: 'Biotechnology',
          totalStudents: 22,
          averageMood: 6.5,
          riskDistribution: { high: 2, medium: 8, low: 12 }
        }
      ],
      moodTrends: [
        { date: '2024-01-01', averageMood: 6.1, totalEntries: 145 },
        { date: '2024-01-08', averageMood: 6.3, totalEntries: 152 },
        { date: '2024-01-15', averageMood: 5.9, totalEntries: 148 },
        { date: '2024-01-22', averageMood: 6.0, totalEntries: 156 },
        { date: '2024-01-29', averageMood: 6.4, totalEntries: 162 }
      ]
    }

    setAggregateData(aggregatedData)
  }

  const getFilteredDepartments = () => {
    if (filterDepartment === 'all') {
      return aggregateData.departmentBreakdown
    }
    return aggregateData.departmentBreakdown.filter(dept => dept.department === filterDepartment)
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMoodEmoji = (mood: number) => {
    if (mood <= 3) return '😢'
    if (mood <= 5) return '😐'
    if (mood <= 7) return '🙂'
    return '😊'
  }

  const downloadAggregateReport = () => {
    // Generate anonymized institute report
    const reportData = {
      instituteName: user?.instituteName || 'RV College of Engineering',
      reportDate: new Date().toLocaleDateString(),
      ...aggregateData
    }
    // This would call a new function for aggregate reports
    console.log('Generating aggregate report:', reportData)
    alert('Aggregate report generation feature coming soon!')
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

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedPatient(null)}
                className="flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Patients</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedPatient.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedPatient.department} • {selectedPatient.usn}
                </p>
              </div>
            </div>
            <Button
              onClick={() => downloadPatientReport(selectedPatient)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Download Report</span>
            </Button>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Mood</p>
                    <p className="text-2xl font-bold">{selectedPatient.averageMood.toFixed(1)}/10</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Risk Level</p>
                    <Badge className={getRiskBadgeColor(selectedPatient.riskLevel)}>
                      {selectedPatient.riskLevel.charAt(0).toUpperCase() + selectedPatient.riskLevel.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
                    <p className="text-lg font-semibold">{selectedPatient.totalEntries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Mood Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {selectedPatient.recentMoods.map((mood, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl">{getMoodEmoji(mood)}</div>
                      <div className="text-xs text-gray-600">{mood}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-sm">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">College</p>
                    <p className="text-sm">{selectedPatient.college}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Entry</p>
                    <p className="text-sm">{new Date(selectedPatient.lastEntry).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
                Student Mood Monitoring
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitor and track student mental health across the institution
              </p>
            </div>
            <Link href="/institute">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filterRisk === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('all')}
              size="sm"
            >
              All Students
            </Button>
            <Button
              variant={filterRisk === 'high' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('high')}
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              High Risk
            </Button>
            <Button
              variant={filterRisk === 'medium' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('medium')}
              size="sm"
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              Medium Risk
            </Button>
            <Button
              variant={filterRisk === 'low' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('low')}
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Low Risk
            </Button>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, USN, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

      
      </div>
    </div>
  )
}

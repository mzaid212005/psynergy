'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  HeartIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  StarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface PatientSummary {
  id: string
  name: string
  lastMoodEntry: string
  averageMood: number
  riskLevel: 'low' | 'medium' | 'high'
  recentTrend: 'improving' | 'stable' | 'declining'
  lastAppointment: string
  nextAppointment?: string
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<PatientSummary[]>([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRiskPatients: 0,
    appointmentsToday: 0,
    averageMoodThisWeek: 0
  })

  useEffect(() => {
    loadDoctorData()
  }, [])

  const loadDoctorData = () => {
    // Load real patient data from localStorage or API
    const storedPatientData = localStorage.getItem('doctorPatientData')
    const mockPatients: PatientSummary[] = storedPatientData ? JSON.parse(storedPatientData) : [
      {
        id: '1',
        name: 'Priya Sharma',
        lastMoodEntry: '2024-01-15',
        averageMood: 3.2,
        riskLevel: 'high',
        recentTrend: 'declining',
        lastAppointment: '2024-01-10',
        nextAppointment: '2024-01-20'
      },
      {
        id: '2',
        name: 'Rahul Kumar',
        lastMoodEntry: '2024-01-15',
        averageMood: 6.8,
        riskLevel: 'low',
        recentTrend: 'improving',
        lastAppointment: '2024-01-12',
        nextAppointment: '2024-01-22'
      },
      {
        id: '3',
        name: 'Ananya Patel',
        lastMoodEntry: '2024-01-14',
        averageMood: 4.5,
        riskLevel: 'medium',
        recentTrend: 'stable',
        lastAppointment: '2024-01-08',
        nextAppointment: '2024-01-18'
      },
      {
        id: '4',
        name: 'Vikram Singh',
        lastMoodEntry: '2024-01-15',
        averageMood: 7.2,
        riskLevel: 'low',
        recentTrend: 'stable',
        lastAppointment: '2024-01-11',
        nextAppointment: '2024-01-25'
      },
      {
        id: '5',
        name: 'Sneha Reddy',
        lastMoodEntry: '2024-01-13',
        averageMood: 3.8,
        riskLevel: 'high',
        recentTrend: 'declining',
        lastAppointment: '2024-01-09',
        nextAppointment: '2024-01-19'
      }
    ]

    setPatients(mockPatients)
    setStats({
      totalPatients: mockPatients.length,
      highRiskPatients: mockPatients.filter(p => p.riskLevel === 'high').length,
      appointmentsToday: 3,
      averageMoodThisWeek: 5.1
    })
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
      case 'declining': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Access denied. Doctor credentials required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <HeartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Doctor Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user.name}. Monitor your patients' mental health progress.
          </p>
          {user.specialization && (
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Specialization: {user.specialization}</span>
              {user.experience && <span>Experience: {user.experience}</span>}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                Active patients under care
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highRiskPatients}</div>
              <p className="text-xs text-muted-foreground">
                Patients requiring attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointmentsToday}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Mood This Week</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageMoodThisWeek.toFixed(1)}/10</div>
              <p className="text-xs text-muted-foreground">
                Across all patients
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link href="/doctor/moods" className="block">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Patient Moods</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">View detailed mood analytics</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link href="/doctor/appointments" className="block">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                    <CalendarDaysIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Appointments</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Manage your schedule</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Link href="/resources" className="block">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                    <HeartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Resources</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Treatment resources</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Patient Overview</span>
              <Button asChild size="sm">
                <Link href="/doctor/moods">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{patient.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Last mood: {new Date(patient.lastMoodEntry).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {patient.averageMood.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Avg Mood</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getTrendIcon(patient.recentTrend)}
                      <span className="text-sm capitalize">{patient.recentTrend}</span>
                    </div>

                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel.toUpperCase()}
                    </span>

                    {patient.nextAppointment && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(patient.nextAppointment).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

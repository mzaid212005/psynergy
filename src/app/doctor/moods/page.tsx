'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  FaceSmileIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { generatePatientMoodReport, generateComprehensiveReport } from '@/lib/pdf-generator'

interface PatientMoodData {
  id: string
  name: string
  college: string
  usn: string
  recentMoods: {
    date: string
    mood: number
    energy: number
    stress: number
    sleep: number
    notes: string
    symptoms: string[]
  }[]
  averageMood: number
  riskLevel: 'low' | 'medium' | 'high'
  trend: 'improving' | 'stable' | 'declining'
  lastEntry: string
}

const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '🤗', '😁', '🥳', '🌟']
const moodLabels = ['Very Low', 'Low', 'Poor', 'Below Average', 'Average', 'Good', 'Very Good', 'Great', 'Excellent', 'Amazing']

export default function DoctorMoodsPage() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<PatientMoodData[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientMoodData | null>(null)
  const [filterRisk, setFilterRisk] = useState<string>('all')

  useEffect(() => {
    loadPatientMoodData()
  }, [])

  const loadPatientMoodData = () => {
    // Load real patient data from localStorage or API
    const storedMoodData = localStorage.getItem('patientMoodData')
    const mockPatients: PatientMoodData[] = storedMoodData ? JSON.parse(storedMoodData) : [
      {
        id: '1',
        name: 'Priya Sharma',
        college: 'IIT Delhi',
        usn: 'CS21001',
        recentMoods: [
          {
            date: '2024-01-15',
            mood: 3,
            energy: 2,
            stress: 8,
            sleep: 4,
            notes: 'Feeling overwhelmed with exams approaching. Having trouble sleeping.',
            symptoms: ['Anxiety', 'Sleep Issues', 'Concentration Issues']
          },
          {
            date: '2024-01-14',
            mood: 4,
            energy: 3,
            stress: 7,
            sleep: 5,
            notes: 'Slightly better today but still anxious about studies.',
            symptoms: ['Anxiety', 'Fatigue']
          },
          {
            date: '2024-01-13',
            mood: 2,
            energy: 2,
            stress: 9,
            sleep: 3,
            notes: 'Very difficult day. Panic attack during lecture.',
            symptoms: ['Anxiety', 'Sleep Issues', 'Concentration Issues', 'Sadness']
          }
        ],
        averageMood: 3.2,
        riskLevel: 'high',
        trend: 'declining',
        lastEntry: '2024-01-15'
      },
      {
        id: '2',
        name: 'Rahul Kumar',
        college: 'NIT Trichy',
        usn: 'ME21045',
        recentMoods: [
          {
            date: '2024-01-15',
            mood: 7,
            energy: 7,
            stress: 4,
            sleep: 8,
            notes: 'Good day! Completed my project successfully.',
            symptoms: []
          },
          {
            date: '2024-01-14',
            mood: 6,
            energy: 6,
            stress: 5,
            sleep: 7,
            notes: 'Working on project, feeling motivated.',
            symptoms: []
          },
          {
            date: '2024-01-13',
            mood: 7,
            energy: 8,
            stress: 3,
            sleep: 8,
            notes: 'Great day with friends. Feeling positive.',
            symptoms: []
          }
        ],
        averageMood: 6.8,
        riskLevel: 'low',
        trend: 'improving',
        lastEntry: '2024-01-15'
      },
      {
        id: '3',
        name: 'Ananya Patel',
        college: 'BITS Pilani',
        usn: 'EC21078',
        recentMoods: [
          {
            date: '2024-01-14',
            mood: 5,
            energy: 4,
            stress: 6,
            sleep: 6,
            notes: 'Average day. Some stress about upcoming presentations.',
            symptoms: ['Anxiety']
          },
          {
            date: '2024-01-13',
            mood: 4,
            energy: 4,
            stress: 7,
            sleep: 5,
            notes: 'Feeling a bit down. Missing home.',
            symptoms: ['Sadness', 'Anxiety']
          },
          {
            date: '2024-01-12',
            mood: 5,
            energy: 5,
            stress: 5,
            sleep: 6,
            notes: 'Okay day. Talked to family which helped.',
            symptoms: []
          }
        ],
        averageMood: 4.5,
        riskLevel: 'medium',
        trend: 'stable',
        lastEntry: '2024-01-14'
      }
    ]

    setPatients(mockPatients)
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

  const filteredPatients = filterRisk === 'all' 
    ? patients 
    : patients.filter(p => p.riskLevel === filterRisk)

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Access denied. Doctor credentials required.</p>
        </div>
      </div>
    )
  }

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
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
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedPatient.college} • {selectedPatient.usn}
                </p>
              </div>
            </div>
            <Button
              onClick={() => generatePatientMoodReport(selectedPatient)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Download Report</span>
            </Button>
          </div>

          {/* Patient Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedPatient.averageMood.toFixed(1)}/10</div>
                <p className="text-xs text-muted-foreground">
                  {moodLabels[Math.round(selectedPatient.averageMood) - 1]}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              </CardHeader>
              <CardContent>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedPatient.riskLevel)}`}>
                  {selectedPatient.riskLevel.toUpperCase()}
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(selectedPatient.trend)}
                  <span className="capitalize">{selectedPatient.trend}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {new Date(selectedPatient.lastEntry).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mood Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Mood Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPatient.recentMoods.map((entry, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{moodEmojis[entry.mood - 1]}</div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {moodLabels[entry.mood - 1]} ({entry.mood}/10)
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div>Energy: {entry.energy}/10</div>
                        <div>Stress: {entry.stress}/10</div>
                        <div>Sleep: {entry.sleep}/10</div>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <div className="mb-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <strong>Notes:</strong> {entry.notes}
                      </div>
                    )}
                    
                    {entry.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Symptoms:</span>
                        {entry.symptoms.map((symptom) => (
                          <span
                            key={symptom}
                            className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs rounded"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Patient Mood Monitoring
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor and analyze your patients' mental health progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                const bookings = JSON.parse(localStorage.getItem('studentBookings') || '[]')
                generateComprehensiveReport(patients, bookings)
              }}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Download Report</span>
            </Button>
            <Link href="/doctor">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={filterRisk === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterRisk('all')}
            size="sm"
          >
            All Patients
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

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-gray-500">{patient.college}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                    {patient.riskLevel.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Mood</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{moodEmojis[Math.round(patient.averageMood) - 1]}</span>
                      <span className="font-semibold">{patient.averageMood.toFixed(1)}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Trend</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(patient.trend)}
                      <span className="text-sm capitalize">{patient.trend}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Last Entry</span>
                    <span className="text-sm">{new Date(patient.lastEntry).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No patients found for the selected filter.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserPlusIcon,
  CheckCircleIcon,
  UserGroupIcon,
  HeartIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  email: string
  usn: string
  college: string
  department: string
  year: number
  phone?: string
}

interface LinkedPatient extends Student {
  linkedDate: string
  averageMood: number
  riskLevel: 'high' | 'medium' | 'low'
  lastEntry: string
  totalEntries: number
  recentMoods: number[]
  doctorNotes: string
  suggestions: string[]
  nextAppointment?: string
}

export default function LinkStudentsPage() {
  const { user, login } = useAuth()
  const [linkedStudents, setLinkedStudents] = useState<LinkedPatient[]>([])
  const [isLinking, setIsLinking] = useState(false)

  const studentsToLink: Student[] = [
    {
      id: '5',
      name: 'Zaid Ahmed',
      email: 'zaid.ahmed@student.com',
      usn: '1RV21CS005',
      college: 'RV College of Engineering',
      department: 'Computer Science',
      year: 2,
      phone: '+91 9876543214'
    },
    {
      id: '6',
      name: 'Ananya Krishnan',
      email: 'ananya.krishnan@student.com',
      usn: '1RV21IS006',
      college: 'RV College of Engineering',
      department: 'Information Science',
      year: 3,
      phone: '+91 9876543215'
    },
    {
      id: '7',
      name: 'Mohammed Farhan',
      email: 'mohammed.farhan@student.com',
      usn: '1RV21EC007',
      college: 'RV College of Engineering',
      department: 'Electronics',
      year: 2,
      phone: '+91 9876543216'
    },
    {
      id: '8',
      name: 'Kavya Nair',
      email: 'kavya.nair@student.com',
      usn: '1RV21BT008',
      college: 'RV College of Engineering',
      department: 'Biotechnology',
      year: 4,
      phone: '+91 9876543217'
    },
    {
      id: '9',
      name: 'Rohan Singh',
      email: 'rohan.singh@student.com',
      usn: '1RV21CE009',
      college: 'RV College of Engineering',
      department: 'Civil Engineering',
      year: 3,
      phone: '+91 9876543218'
    },
    {
      id: '10',
      name: 'Aisha Khan',
      email: 'aisha.khan@student.com',
      usn: '1RV21CS010',
      college: 'RV College of Engineering',
      department: 'Computer Science',
      year: 1,
      phone: '+91 9876543219'
    }
  ]

  useEffect(() => {
    loadLinkedPatients()
  }, [])

  const loadLinkedPatients = () => {
    const stored = localStorage.getItem('doctorLinkedPatients')
    if (stored) {
      setLinkedStudents(JSON.parse(stored))
    }
  }

  const loginAsDrPriya = async () => {
    try {
      await login('priya@doctor.com', 'password123')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const linkAllStudents = async () => {
    if (!user || user.role !== 'doctor') {
      alert('Please login as Dr. Priya first!')
      return
    }

    setIsLinking(true)
    const existingPatients = JSON.parse(localStorage.getItem('doctorLinkedPatients') || '[]')
    const newLinkedPatients: LinkedPatient[] = []

    for (const student of studentsToLink) {
      // Check if already linked
      if (existingPatients.some((p: LinkedPatient) => p.usn === student.usn)) {
        continue
      }

      // Create linked patient with realistic mood data
      const linkedPatient: LinkedPatient = {
        ...student,
        linkedDate: new Date().toISOString(),
        averageMood: Math.random() * 4 + 4, // Random mood between 4-8
        riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        lastEntry: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        totalEntries: Math.floor(Math.random() * 20) + 5,
        recentMoods: Array.from({ length: 7 }, () => Math.floor(Math.random() * 6) + 3),
        doctorNotes: '',
        suggestions: [],
        nextAppointment: undefined
      }

      newLinkedPatients.push(linkedPatient)
      
      // Simulate linking delay
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    const allPatients = [...existingPatients, ...newLinkedPatients]
    localStorage.setItem('doctorLinkedPatients', JSON.stringify(allPatients))
    setLinkedStudents(allPatients)
    setIsLinking(false)

    alert(`✅ Successfully linked ${newLinkedPatients.length} students to Dr. Priya!`)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Computer Science': 'from-blue-500 to-cyan-500',
      'Information Science': 'from-purple-500 to-pink-500',
      'Electronics': 'from-green-500 to-emerald-500',
      'Biotechnology': 'from-orange-500 to-red-500',
      'Civil Engineering': 'from-gray-500 to-slate-500',
      'Mechanical Engineering': 'from-indigo-500 to-blue-500'
    }
    return colors[department] || 'from-gray-500 to-slate-500'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <UserPlusIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Link Students to Dr. Priya
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Automatically link Zaid Ahmed and other sample students to Dr. Priya's patient list
          </p>
        </motion.div>

        {/* Login Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              {user && user.role === 'doctor' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        ✅ Logged in as Dr. {user.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Ready to link students to your patient list
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={linkAllStudents}
                    disabled={isLinking}
                    className="bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    {isLinking ? 'Linking Students...' : 'Link All Students'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Please login as Dr. Priya first
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        You need to be logged in as a doctor to link students
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={loginAsDrPriya}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Login as Dr. Priya
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Students to Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserGroupIcon className="w-6 h-6 mr-2" />
                Students to Link ({studentsToLink.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentsToLink.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getDepartmentColor(student.department)} rounded-lg flex items-center justify-center`}>
                        <AcademicCapIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        Year {student.year}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {student.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      USN: {student.usn}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {student.department}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {student.email}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Currently Linked Students */}
        {linkedStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HeartIcon className="w-6 h-6 mr-2" />
                  Currently Linked Patients ({linkedStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {linkedStudents.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getDepartmentColor(patient.department)} rounded-lg flex items-center justify-center`}>
                          <AcademicCapIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(patient.riskLevel)}`}>
                          {patient.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        USN: {patient.usn}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {patient.department}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Avg Mood: {patient.averageMood.toFixed(1)}/10
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Linked: {new Date(patient.linkedDate).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link href="/doctor/patients">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <UserGroupIcon className="w-4 h-4 mr-2" />
                View Patient Management
              </Button>
            </Link>
            
            <Link href="/final-test">
              <Button variant="outline" className="w-full">
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                Back to Final Test
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

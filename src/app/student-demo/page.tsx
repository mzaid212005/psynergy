'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function StudentDemoPage() {
  const [copiedUSN, setCopiedUSN] = useState('')

  const allStudents = [
    {
      id: '1',
      name: 'Arjun Patel',
      usn: '1RV21CS001',
      department: 'Computer Science',
      year: 3,
      email: 'arjun.patel@student.com',
      phone: '+91 9876543210',
      status: 'Available for linking'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      usn: '1RV21CS002',
      department: 'Computer Science',
      year: 3,
      email: 'priya.sharma@student.com',
      phone: '+91 9876543211',
      status: 'Available for linking'
    },
    {
      id: '3',
      name: 'Rahul Kumar',
      usn: '1RV21ME003',
      department: 'Mechanical Engineering',
      year: 2,
      email: 'rahul.kumar@student.com',
      phone: '+91 9876543212',
      status: 'Available for linking'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      usn: '1RV21EC004',
      department: 'Electronics',
      year: 4,
      email: 'sneha.reddy@student.com',
      phone: '+91 9876543213',
      status: 'Available for linking'
    },
    {
      id: '5',
      name: 'Zaid Ahmed',
      usn: '1RV21CS005',
      department: 'Computer Science',
      year: 2,
      email: 'zaid.ahmed@student.com',
      phone: '+91 9876543214',
      status: '⭐ Featured Student'
    },
    {
      id: '6',
      name: 'Ananya Krishnan',
      usn: '1RV21IS006',
      department: 'Information Science',
      year: 3,
      email: 'ananya.krishnan@student.com',
      phone: '+91 9876543215',
      status: 'Available for linking'
    },
    {
      id: '7',
      name: 'Mohammed Farhan',
      usn: '1RV21EC007',
      department: 'Electronics',
      year: 2,
      email: 'mohammed.farhan@student.com',
      phone: '+91 9876543216',
      status: 'Available for linking'
    },
    {
      id: '8',
      name: 'Kavya Nair',
      usn: '1RV21BT008',
      department: 'Biotechnology',
      year: 4,
      email: 'kavya.nair@student.com',
      phone: '+91 9876543217',
      status: 'Available for linking'
    },
    {
      id: '9',
      name: 'Rohan Singh',
      usn: '1RV21CE009',
      department: 'Civil Engineering',
      year: 3,
      email: 'rohan.singh@student.com',
      phone: '+91 9876543218',
      status: 'Available for linking'
    },
    {
      id: '10',
      name: 'Aisha Khan',
      usn: '1RV21CS010',
      department: 'Computer Science',
      year: 1,
      email: 'aisha.khan@student.com',
      phone: '+91 9876543219',
      status: 'Available for linking'
    }
  ]

  const copyUSN = (usn: string) => {
    navigator.clipboard.writeText(usn)
    setCopiedUSN(usn)
    setTimeout(() => setCopiedUSN(''), 2000)
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

  const getStatusColor = (status: string) => {
    if (status.includes('Featured')) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-green-100 text-green-800 border-green-200'
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Student Database Demo
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Complete list of students available for linking to Dr. Priya. Click on any USN to copy it for testing.
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-300">
                <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
                How to Link Students to Dr. Priya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Login as Dr. Priya</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Use: priya@doctor.com / password123
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Go to Patient Management</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Navigate to /doctor/patients page
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Search & Link</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Search by USN or name, then click "Link Patient"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <AcademicCapIcon className="w-6 h-6 mr-2" />
                  Available Students ({allStudents.length})
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Click USN to copy
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 ${
                      student.status.includes('Featured') ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getDepartmentColor(student.department)} rounded-lg flex items-center justify-center`}>
                        <AcademicCapIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(student.status)}`}>
                        Year {student.year}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {student.name}
                      {student.status.includes('Featured') && <span className="ml-2">⭐</span>}
                    </h3>
                    
                    <button
                      onClick={() => copyUSN(student.usn)}
                      className="w-full text-left mb-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {student.usn}
                      </span>
                      {copiedUSN === student.usn ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ClipboardDocumentIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {student.department}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {student.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {student.phone}
                    </p>
                    
                    <div className={`mt-3 text-xs px-2 py-1 rounded-full border ${getStatusColor(student.status)} text-center`}>
                      {student.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/link-students">
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600">
                <UserGroupIcon className="w-4 h-4 mr-2" />
                Auto-Link All Students
              </Button>
            </Link>
            
            <Link href="/doctor/patients">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                Manual Patient Search
              </Button>
            </Link>
            
            <Link href="/final-test">
              <Button variant="outline" className="w-full">
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                Back to Tests
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Featured Student Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Featured Student: Zaid 
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                USN: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">1RV21CS005</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Computer Science student, Year 2. Ready to be linked to Dr. Priya's patient management system 
                for mental health monitoring and support.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

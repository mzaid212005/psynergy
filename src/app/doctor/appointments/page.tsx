'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Appointment {
  id: string
  patientName: string
  patientId: string
  date: string
  time: string
  type: 'video' | 'phone' | 'in-person'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  reason: string
  priority: 'low' | 'medium' | 'high'
  notes?: string
}

export default function DoctorAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all')

  useEffect(() => {
    // Mock appointments data
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'Priya Sharma',
        patientId: 'P001',
        date: '2024-01-15',
        time: '10:00 AM',
        type: 'video',
        status: 'scheduled',
        reason: 'Anxiety counseling session',
        priority: 'high',
        notes: 'Follow-up on panic attacks'
      },
      {
        id: '2',
        patientName: 'Rahul Kumar',
        patientId: 'P002',
        date: '2024-01-15',
        time: '11:30 AM',
        type: 'phone',
        status: 'scheduled',
        reason: 'Depression check-in',
        priority: 'medium'
      },
      {
        id: '3',
        patientName: 'Anita Patel',
        patientId: 'P003',
        date: '2024-01-15',
        time: '2:00 PM',
        type: 'in-person',
        status: 'completed',
        reason: 'Initial consultation',
        priority: 'low',
        notes: 'Referred by college counselor'
      },
      {
        id: '4',
        patientName: 'Vikram Singh',
        patientId: 'P004',
        date: '2024-01-16',
        time: '9:00 AM',
        type: 'video',
        status: 'scheduled',
        reason: 'Stress management',
        priority: 'medium'
      }
    ]
    setAppointments(mockAppointments)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'no-show': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCameraIcon className="h-4 w-4" />
      case 'phone': return <PhoneIcon className="h-4 w-4" />
      case 'in-person': return <UserIcon className="h-4 w-4" />
      default: return <CalendarDaysIcon className="h-4 w-4" />
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const today = new Date().toISOString().split('T')[0]
    switch (filter) {
      case 'today': return appointment.date === today
      case 'upcoming': return appointment.date >= today && appointment.status === 'scheduled'
      case 'completed': return appointment.status === 'completed'
      default: return true
    }
  })

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Access Denied
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This page is only accessible to doctors.
              </p>
              <Link href="/auth/login">
                <Button>Login as Doctor</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <CalendarDaysIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Appointments
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your patient appointments and schedule
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
              {[
                { key: 'all', label: 'All' },
                { key: 'today', label: 'Today' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'completed', label: 'Completed' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {appointment.patientName}
                          </h3>
                          <Badge className={getPriorityColor(appointment.priority)}>
                            {appointment.priority} priority
                          </Badge>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center space-x-1">
                            <CalendarDaysIcon className="h-4 w-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(appointment.type)}
                            <span className="capitalize">{appointment.type}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {appointment.reason}
                        </p>
                        
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            Notes: {appointment.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button size="sm" variant="outline">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'You have no appointments scheduled.'
                    : `No ${filter} appointments found.`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

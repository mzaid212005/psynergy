'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  XMarkIcon,
  CheckIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Appointment } from '@/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/appointments?userId=current_user')
      if (!response.ok) throw new Error('Failed to fetch appointments')
      
      const data = await response.json()
      setAppointments(data.appointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load appointments')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          status: 'cancelled'
        })
      })

      if (!response.ok) throw new Error('Failed to cancel appointment')
      
      toast.success('Appointment cancelled successfully')
      fetchAppointments()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Failed to cancel appointment')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(timeString)
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'no-show':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.timeSlot.startTime)
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate > now && appointment.status !== 'cancelled'
      case 'past':
        return appointmentDate < now || appointment.status === 'completed'
      case 'cancelled':
        return appointment.status === 'cancelled'
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-600">
                <CalendarDaysIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Appointments</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your counseling sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/appointments">
                <Button variant="outline" size="sm">Book New</Button>
              </Link>
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'upcoming', label: 'Upcoming', count: appointments.filter(a => new Date(a.timeSlot.startTime) > new Date() && a.status !== 'cancelled').length },
                { key: 'past', label: 'Past', count: appointments.filter(a => new Date(a.timeSlot.startTime) < new Date() || a.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length },
                { key: 'all', label: 'All', count: appointments.length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {filter === 'upcoming' 
                  ? "You don't have any upcoming appointments."
                  : `No ${filter} appointments to show.`
                }
              </p>
              {filter === 'upcoming' && (
                <Link href="/appointments">
                  <Button>Book Your First Appointment</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {appointment.isAnonymous ? 'Anonymous Session' : 'Counseling Session'}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              {appointment.isAnonymous && (
                                <div className="flex items-center space-x-1">
                                  <EyeSlashIcon className="h-3 w-3 text-gray-500" />
                                  <span className="text-xs text-gray-500">Anonymous</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {formatDate(appointment.timeSlot.startTime)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {formatTime(appointment.timeSlot.startTime)} - {formatTime(appointment.timeSlot.endTime)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              Campus Counseling Center
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              Type: {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                            </span>
                          </div>
                        </div>

                        {appointment.reason && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Reason:</span> {appointment.reason}
                            </p>
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-4">
                        {appointment.status === 'scheduled' && new Date(appointment.timeSlot.startTime) > new Date() && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                        
                        {appointment.status === 'completed' && (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <CheckIcon className="h-4 w-4" />
                            <span className="text-sm">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

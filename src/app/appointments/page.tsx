'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { Counselor, TimeSlot } from '@/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentBooking } from '@/components/features/appointment-booking'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AppointmentsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([])
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null)
  const [showBooking, setShowBooking] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    specialization: '',
    language: '',
    emergency: false
  })

  useEffect(() => {
    fetchCounselors()
  }, [filters])

  const fetchCounselors = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (filters.specialization) params.append('specialization', filters.specialization)
      if (filters.language) params.append('language', filters.language)
      if (filters.emergency) params.append('emergency', 'true')

      const response = await fetch(`/api/counselors?${params}`)
      if (!response.ok) throw new Error('Failed to fetch counselors')
      
      const data = await response.json()
      setCounselors(data.counselors)
    } catch (error) {
      console.error('Error fetching counselors:', error)
      toast.error('Failed to load counselors')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAppointment = (counselor: Counselor) => {
    setSelectedCounselor(counselor)
    setShowBooking(true)
  }

  const handleBookingComplete = () => {
    setShowBooking(false)
    setSelectedCounselor(null)
    toast.success('Appointment booked successfully!')
  }

  const formatNextAvailable = (dateString: string | null) => {
    if (!dateString) return 'No availability'
    
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const specializations = [
    'Depression', 'Anxiety', 'Academic Stress', 'Family Issues',
    'Relationship Problems', 'Career Counseling', 'Trauma Therapy',
    'Substance Abuse', 'Eating Disorders', 'Crisis Intervention'
  ]

  const languages = [
    'English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Malayalam',
    'Marathi', 'Gujarati', 'Bengali', 'Punjabi'
  ]

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
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Book Counseling</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Schedule confidential sessions with professional counselors</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="sm">AI Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Crisis Support:</strong> If you're in immediate danger, call Emergency: 112 or Suicide Prevention: 91529-87821
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFilters(prev => ({ ...prev, emergency: true }))}
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              Emergency Counselors
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Find the Right Counselor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialization
                  </label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Languages</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() => setFilters({ specialization: '', language: '', emergency: false })}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Counselors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : counselors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No counselors found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your filters or check back later for availability.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor, index) => (
              <motion.div
                key={counselor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {counselor.name}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {counselor.rating} • {counselor.experience} years
                          </span>
                        </div>
                      </div>
                      {counselor.specializations.includes('Crisis Intervention') && (
                        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                          Emergency
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {counselor.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Next: {formatNextAvailable(counselor.nextAvailableSlot)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Specializations:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {counselor.specializations.slice(0, 3).map(spec => (
                          <span
                            key={spec}
                            className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                        {counselor.specializations.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{counselor.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Languages:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {counselor.languages.join(', ')}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleBookAppointment(counselor)}
                      className="w-full"
                      disabled={!counselor.isAvailable || counselor.availableSlotsCount === 0}
                    >
                      {counselor.availableSlotsCount === 0 ? 'No Availability' : 'Book Appointment'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && selectedCounselor && (
          <AppointmentBooking
            counselor={selectedCounselor}
            isOpen={showBooking}
            onClose={() => setShowBooking(false)}
            onComplete={handleBookingComplete}
          />
        )}
      </main>
    </div>
  )
}

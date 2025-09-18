'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'

interface CounselingSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number
  type: 'individual' | 'group' | 'emergency'
  maxStudents: number
  currentBookings: number
  status: 'available' | 'booked' | 'cancelled'
  notes?: string
  doctorName: string
  doctorId: string
}

interface Booking {
  id: string
  slotId: string
  studentId: string
  studentName: string
  studentEmail: string
  reason: string
  urgency: 'low' | 'medium' | 'high'
  bookedAt: string
  status: 'confirmed' | 'cancelled'
}

export default function BookCounselingPage() {
  const { user } = useAuth()
  const [availableSlots, setAvailableSlots] = useState<CounselingSlot[]>([])
  const [myBookings, setMyBookings] = useState<Booking[]>([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<CounselingSlot | null>(null)
  const [bookingForm, setBookingForm] = useState({
    reason: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    additionalNotes: ''
  })

  useEffect(() => {
    loadAvailableSlots()
    loadMyBookings()
  }, [])

  const loadAvailableSlots = () => {
    // Load slots from localStorage (in real app, this would be from API)
    const storedSlots = localStorage.getItem('doctorSlots')
    if (storedSlots) {
      const allSlots = JSON.parse(storedSlots)
      const available = allSlots
        .filter((slot: CounselingSlot) => 
          slot.status === 'available' && 
          slot.currentBookings < slot.maxStudents &&
          new Date(slot.date + 'T' + slot.startTime) > new Date()
        )
        .map((slot: any) => ({
          ...slot,
          doctorName: 'Dr. Priya Sharma', // In real app, fetch from doctor data
          doctorId: 'doc_priya_001'
        }))
      setAvailableSlots(available)
    }
  }

  const loadMyBookings = () => {
    if (!user) return
    
    const storedBookings = localStorage.getItem('studentBookings')
    if (storedBookings) {
      const allBookings = JSON.parse(storedBookings)
      const userBookings = allBookings.filter((booking: Booking) => booking.studentId === user.id)
      setMyBookings(userBookings)
    }
  }

  const bookSlot = () => {
    if (!selectedSlot || !user) return

    if (!bookingForm.reason.trim()) {
      alert('Please provide a reason for the counseling session')
      return
    }

    const booking: Booking = {
      id: 'booking_' + Date.now(),
      slotId: selectedSlot.id,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      reason: bookingForm.reason,
      urgency: bookingForm.urgency,
      bookedAt: new Date().toISOString(),
      status: 'confirmed'
    }

    // Save booking
    const existingBookings = JSON.parse(localStorage.getItem('studentBookings') || '[]')
    const updatedBookings = [...existingBookings, booking]
    localStorage.setItem('studentBookings', JSON.stringify(updatedBookings))

    // Update slot booking count
    const storedSlots = JSON.parse(localStorage.getItem('doctorSlots') || '[]')
    const updatedSlots = storedSlots.map((slot: CounselingSlot) => {
      if (slot.id === selectedSlot.id) {
        return {
          ...slot,
          currentBookings: slot.currentBookings + 1,
          status: slot.currentBookings + 1 >= slot.maxStudents ? 'booked' : 'available'
        }
      }
      return slot
    })
    localStorage.setItem('doctorSlots', JSON.stringify(updatedSlots))

    // Send notification to doctor
    sendNotificationToDoctor(booking, selectedSlot)

    // Reset form and close modal
    setBookingForm({ reason: '', urgency: 'medium', additionalNotes: '' })
    setShowBookingModal(false)
    setSelectedSlot(null)
    
    // Reload data
    loadAvailableSlots()
    loadMyBookings()

    alert('Booking confirmed! You will receive a confirmation email shortly.')
  }

  const sendNotificationToDoctor = (booking: Booking, slot: CounselingSlot) => {
    // In real app, this would send actual notifications
    const notification = {
      id: 'notif_' + Date.now(),
      type: 'new_booking',
      doctorId: slot.doctorId,
      message: `New booking from ${booking.studentName} for ${slot.date} at ${slot.startTime}`,
      booking: booking,
      slot: slot,
      timestamp: new Date().toISOString(),
      read: false
    }

    const existingNotifications = JSON.parse(localStorage.getItem('doctorNotifications') || '[]')
    const updatedNotifications = [notification, ...existingNotifications]
    localStorage.setItem('doctorNotifications', JSON.stringify(updatedNotifications))
  }

  const cancelBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    const booking = myBookings.find(b => b.id === bookingId)
    if (!booking) return

    // Update booking status
    const existingBookings = JSON.parse(localStorage.getItem('studentBookings') || '[]')
    const updatedBookings = existingBookings.map((b: Booking) => 
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    )
    localStorage.setItem('studentBookings', JSON.stringify(updatedBookings))

    // Update slot availability
    const storedSlots = JSON.parse(localStorage.getItem('doctorSlots') || '[]')
    const updatedSlots = storedSlots.map((slot: CounselingSlot) => {
      if (slot.id === booking.slotId) {
        return {
          ...slot,
          currentBookings: Math.max(0, slot.currentBookings - 1),
          status: 'available'
        }
      }
      return slot
    })
    localStorage.setItem('doctorSlots', JSON.stringify(updatedSlots))

    loadAvailableSlots()
    loadMyBookings()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-purple-100 text-purple-800'
      case 'group': return 'bg-orange-100 text-orange-800'
      case 'emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Please Log In
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You need to be logged in to book counseling sessions.
            </p>
            <Button asChild>
              <a href="/auth/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Counseling Session
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Schedule a session with our professional counselors
          </p>
        </div>

        {/* My Bookings */}
        {myBookings.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>My Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBookings
                  .filter(booking => booking.status === 'confirmed')
                  .map((booking) => {
                    const slot = availableSlots.find(s => s.id === booking.slotId)
                    if (!slot) return null
                    
                    return (
                      <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {formatDate(slot.date)} at {formatTime(slot.startTime)}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              with {slot.doctorName} • {booking.reason}
                            </p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getUrgencyColor(booking.urgency)}`}>
                              {booking.urgency.charAt(0).toUpperCase() + booking.urgency.slice(1)} Priority
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Available Counseling Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {availableSlots.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No available slots
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please check back later for new counseling slots.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableSlots
                  .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime())
                  .map((slot) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {formatDate(slot.date)}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {slot.doctorName}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(slot.type)}`}>
                            {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {slot.maxStudents - slot.currentBookings} spots left
                          </span>
                        </div>
                      </div>
                      
                      {slot.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {slot.notes}
                        </p>
                      )}
                      
                      <Button
                        onClick={() => {
                          setSelectedSlot(slot)
                          setShowBookingModal(true)
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Book Session
                      </Button>
                    </motion.div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Modal */}
        {showBookingModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Book Counseling Session
              </h2>

              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(selectedSlot.date)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)} with {selectedSlot.doctorName}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getTypeColor(selectedSlot.type)}`}>
                  {selectedSlot.type.charAt(0).toUpperCase() + selectedSlot.type.slice(1)} Session
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason for Counseling *
                  </label>
                  <textarea
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Please describe what you'd like to discuss in this session..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={bookingForm.urgency}
                    onChange={(e) => setBookingForm({...bookingForm, urgency: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low - General support</option>
                    <option value="medium">Medium - Moderate concern</option>
                    <option value="high">High - Urgent support needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={bookingForm.additionalNotes}
                    onChange={(e) => setBookingForm({...bookingForm, additionalNotes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBookingModal(false)
                    setSelectedSlot(null)
                    setBookingForm({ reason: '', urgency: 'medium', additionalNotes: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={bookSlot}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

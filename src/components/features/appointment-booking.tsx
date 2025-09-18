'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  ShieldCheckIcon,
  UserIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Counselor, TimeSlot } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { appointmentTypes, appointmentReasons, reminderOptions } from '@/data/counselors'
import toast from 'react-hot-toast'

interface AppointmentBookingProps {
  counselor: Counselor
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function AppointmentBooking({ 
  counselor, 
  isOpen, 
  onClose, 
  onComplete 
}: AppointmentBookingProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'individual',
    isAnonymous: false,
    reason: '',
    notes: '',
    reminderPreference: 60
  })

  // Get next 14 days for date selection
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends for regular appointments
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    
    return dates
  }

  const fetchAvailableSlots = async (date: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/counselors?counselorId=${counselor.id}&date=${date}`)
      if (!response.ok) throw new Error('Failed to fetch slots')
      
      const data = await response.json()
      setAvailableSlots(data.availableSlots || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
      toast.error('Failed to load available time slots')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setStep(2)
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setStep(3)
  }

  const handleBooking = async () => {
    if (!selectedSlot) return

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          counselorId: counselor.id,
          timeSlotId: selectedSlot.id,
          type: formData.type,
          isAnonymous: formData.isAnonymous,
          reason: formData.reason,
          notes: formData.notes,
          reminderPreference: formData.reminderPreference,
          userId: 'current_user' // TODO: Get from auth context
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to book appointment')
      }

      const data = await response.json()
      toast.success('Appointment booked successfully!')
      onComplete()
      
    } catch (error: any) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Failed to book appointment')
    } finally {
      setIsLoading(false)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl">Book Appointment</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                with {counselor.name}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent>
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`w-8 h-0.5 ${
                        step > stepNumber ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Select Date */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Select a Date
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getAvailableDates().map((date) => (
                      <button
                        key={date}
                        onClick={() => handleDateSelect(date)}
                        className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(date)}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Time */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Select Time
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                      Change Date
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(selectedDate)}
                  </p>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-8">
                      <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">
                        No available slots for this date
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot)}
                          className="p-3 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatTime(slot.startTime)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(slot.endTime)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Appointment Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Appointment Details
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                      Change Time
                    </Button>
                  </div>

                  {/* Selected Date & Time */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                      <CalendarDaysIcon className="h-5 w-5" />
                      <span className="font-medium">
                        {formatDate(selectedDate)} at {selectedSlot && formatTime(selectedSlot.startTime)}
                      </span>
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Appointment Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {appointmentTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} ({type.duration} min)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Anonymous Option */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <label htmlFor="anonymous" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Anonymous Session
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your identity will not be recorded or shared
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for Appointment
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a reason (optional)</option>
                      {appointmentReasons.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Any specific concerns or topics you'd like to discuss..."
                    />
                  </div>

                  {/* Reminder Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reminder Preference
                    </label>
                    <select
                      value={formData.reminderPreference}
                      onChange={(e) => setFormData(prev => ({ ...prev, reminderPreference: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {reminderOptions.map(option => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={() => setStep(4)}>
                      Review & Confirm
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Confirm Your Appointment
                  </h3>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Counselor:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{counselor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Date & Time:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedDate)} at {selectedSlot && formatTime(selectedSlot.startTime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Type:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointmentTypes.find(t => t.id === formData.type)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Location:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{counselor.location}</span>
                    </div>
                    {formData.isAnonymous && (
                      <div className="flex items-center space-x-2">
                        <EyeSlashIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">Anonymous Session</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Confidentiality Assured
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          All sessions are completely confidential and follow professional ethics guidelines.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleBooking}
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Booking...</span>
                        </div>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

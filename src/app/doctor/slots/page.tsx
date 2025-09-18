'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface CounselingSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number // in minutes
  type: 'individual' | 'group' | 'emergency'
  maxStudents: number
  currentBookings: number
  status: 'available' | 'booked' | 'cancelled'
  notes?: string
  createdAt: string
}

export default function DoctorSlotsPage() {
  const [slots, setSlots] = useState<CounselingSlot[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSlot, setEditingSlot] = useState<CounselingSlot | null>(null)
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
    type: 'individual' as 'individual' | 'group' | 'emergency',
    maxStudents: 1,
    notes: ''
  })

  useEffect(() => {
    loadSlots()
  }, [])

  const loadSlots = () => {
    const storedSlots = localStorage.getItem('doctorSlots')
    if (storedSlots) {
      setSlots(JSON.parse(storedSlots))
    }
  }

  const saveSlots = (updatedSlots: CounselingSlot[]) => {
    localStorage.setItem('doctorSlots', JSON.stringify(updatedSlots))
    setSlots(updatedSlots)
  }

  const createSlot = () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      alert('Please fill in all required fields')
      return
    }

    const startTime = new Date(`${newSlot.date}T${newSlot.startTime}`)
    const endTime = new Date(`${newSlot.date}T${newSlot.endTime}`)
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

    if (duration <= 0) {
      alert('End time must be after start time')
      return
    }

    const slot: CounselingSlot = {
      id: 'slot_' + Date.now(),
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      duration,
      type: newSlot.type,
      maxStudents: newSlot.maxStudents,
      currentBookings: 0,
      status: 'available',
      notes: newSlot.notes,
      createdAt: new Date().toISOString()
    }

    const updatedSlots = [...slots, slot]
    saveSlots(updatedSlots)
    setShowCreateModal(false)
    setNewSlot({
      date: '',
      startTime: '',
      endTime: '',
      type: 'individual',
      maxStudents: 1,
      notes: ''
    })
  }

  const deleteSlot = (slotId: string) => {
    if (confirm('Are you sure you want to delete this slot?')) {
      const updatedSlots = slots.filter(slot => slot.id !== slotId)
      saveSlots(updatedSlots)
    }
  }

  const toggleSlotStatus = (slotId: string) => {
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: slot.status === 'available' ? 'cancelled' : 'available' as 'available' | 'booked' | 'cancelled'
        }
      }
      return slot
    })
    saveSlots(updatedSlots)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'booked': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Counseling Slots Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create and manage your counseling availability
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Slot
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Slots</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{slots.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {slots.filter(slot => slot.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Booked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {slots.filter(slot => slot.status === 'booked').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XMarkIcon className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {slots.filter(slot => slot.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Slots List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Counseling Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {slots.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No slots created yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first counseling slot to start accepting student bookings
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create First Slot
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {slots
                  .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime())
                  .map((slot) => (
                    <motion.div
                      key={slot.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatDate(slot.date)}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                              {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(slot.type)}`}>
                              {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </div>
                            <div>
                              Duration: {slot.duration} minutes
                            </div>
                            <div>
                              Capacity: {slot.currentBookings}/{slot.maxStudents}
                            </div>
                          </div>
                          
                          {slot.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              Notes: {slot.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSlotStatus(slot.id)}
                            className={slot.status === 'available' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {slot.status === 'available' ? 'Cancel' : 'Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingSlot(slot)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSlot(slot.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Slot Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Create New Counseling Slot
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session Type
                  </label>
                  <select
                    value={newSlot.type}
                    onChange={(e) => setNewSlot({...newSlot, type: e.target.value as 'individual' | 'group' | 'emergency'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="individual">Individual Session</option>
                    <option value="group">Group Session</option>
                    <option value="emergency">Emergency Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Students
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSlot.maxStudents}
                    onChange={(e) => setNewSlot({...newSlot, maxStudents: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newSlot.notes}
                    onChange={(e) => setNewSlot({...newSlot, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Any special instructions or notes for this session..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createSlot}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Slot
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

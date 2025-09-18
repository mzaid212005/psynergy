'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  UserPlusIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  EyeIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { generatePatientMoodReport, generateComprehensiveReport, generateEnhancedPatientReport } from '@/lib/pdf-generator'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedCard, AnimatedStatsCard, FloatingActionButton } from '@/components/ui/animated-card'
import { PulsingDots, SpinningLoader } from '@/components/ui/loading-animations'

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

interface Suggestion {
  id: string
  text: string
  category: 'lifestyle' | 'therapy' | 'medication' | 'emergency'
  priority: 'low' | 'medium' | 'high'
  dateAdded: string
}

export default function DoctorPatientsPage() {
  const { user } = useAuth()
  const [searchUSN, setSearchUSN] = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [linkedPatients, setLinkedPatients] = useState<LinkedPatient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<LinkedPatient | null>(null)
  const [showSuggestionForm, setShowSuggestionForm] = useState(false)
  const [newSuggestion, setNewSuggestion] = useState('')
  const [suggestionCategory, setSuggestionCategory] = useState<'lifestyle' | 'therapy' | 'medication' | 'emergency'>('lifestyle')
  const [suggestionPriority, setSuggestionPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [doctorNotes, setDoctorNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  useEffect(() => {
    loadLinkedPatients()
  }, [])

  const loadLinkedPatients = () => {
    const stored = localStorage.getItem('doctorLinkedPatients')
    if (stored) {
      setLinkedPatients(JSON.parse(stored))
    }
  }

  const saveLinkedPatients = (patients: LinkedPatient[]) => {
    localStorage.setItem('doctorLinkedPatients', JSON.stringify(patients))
    setLinkedPatients(patients)
  }

  const searchStudentByUSN = () => {
    if (!searchUSN.trim()) {
      alert('Please enter a USN or student name to search')
      return
    }

    console.log('Searching for:', searchUSN) // Debug log

    // Mock student database - in real app, this would be an API call
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Arjun Patel',
        email: 'arjun.patel@student.com',
        usn: '1RV21CS001',
        college: 'RV College of Engineering',
        department: 'Computer Science',
        year: 3,
        phone: '+91 9876543210'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya.sharma@student.com',
        usn: '1RV21CS002',
        college: 'RV College of Engineering',
        department: 'Computer Science',
        year: 3,
        phone: '+91 9876543211'
      },
      {
        id: '3',
        name: 'Rahul Kumar',
        email: 'rahul.kumar@student.com',
        usn: '1RV21ME003',
        college: 'RV College of Engineering',
        department: 'Mechanical Engineering',
        year: 2,
        phone: '+91 9876543212'
      },
      {
        id: '4',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@student.com',
        usn: '1RV21EC004',
        college: 'RV College of Engineering',
        department: 'Electronics',
        year: 4,
        phone: '+91 9876543213'
      },
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

    const results = mockStudents.filter(student =>
      student.usn.toLowerCase().includes(searchUSN.toLowerCase()) ||
      student.name.toLowerCase().includes(searchUSN.toLowerCase())
    )

    console.log('Search results:', results) // Debug log
    setSearchResults(results)

    if (results.length === 0) {
      alert(`No students found for "${searchUSN}". Try searching for: 1RV21CS001, Arjun, Priya, etc.`)
    }
  }

  const linkPatient = (student: Student) => {
    // Check if already linked
    if (linkedPatients.some(p => p.usn === student.usn)) {
      alert('Student is already linked to your patient list')
      return
    }

    // Create linked patient with mock mood data
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

    const updatedPatients = [...linkedPatients, linkedPatient]
    saveLinkedPatients(updatedPatients)
    setSearchResults([])
    setSearchUSN('')

    // Success feedback
    alert(`✅ Successfully linked ${student.name} (${student.usn}) to your patient list!`)
    console.log('Patient linked successfully:', linkedPatient)
  }

  const addSuggestion = () => {
    if (!selectedPatient || !newSuggestion.trim()) return

    const suggestion: Suggestion = {
      id: Date.now().toString(),
      text: newSuggestion,
      category: suggestionCategory,
      priority: suggestionPriority,
      dateAdded: new Date().toISOString()
    }

    const updatedPatients = linkedPatients.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, suggestions: [...patient.suggestions, suggestion] }
        : patient
    )

    saveLinkedPatients(updatedPatients)
    setSelectedPatient({ ...selectedPatient, suggestions: [...selectedPatient.suggestions, suggestion] })
    setNewSuggestion('')
    setShowSuggestionForm(false)
  }

  const updateDoctorNotes = () => {
    if (!selectedPatient) return

    const updatedPatients = linkedPatients.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, doctorNotes }
        : patient
    )

    saveLinkedPatients(updatedPatients)
    setSelectedPatient({ ...selectedPatient, doctorNotes })
    setIsEditingNotes(false)
  }

  const removeSuggestion = (suggestionId: string) => {
    if (!selectedPatient) return

    const updatedSuggestions = selectedPatient.suggestions.filter(s => s.id !== suggestionId)
    const updatedPatients = linkedPatients.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, suggestions: updatedSuggestions }
        : patient
    )

    saveLinkedPatients(updatedPatients)
    setSelectedPatient({ ...selectedPatient, suggestions: updatedSuggestions })
  }

  const downloadPatientReport = (patient: LinkedPatient) => {
    generateEnhancedPatientReport({ ...patient, doctorName: user?.name })
  }

  const downloadOverallReport = () => {
    const bookings = JSON.parse(localStorage.getItem('studentBookings') || '[]')
    generateComprehensiveReport(linkedPatients, bookings)
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSuggestionColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800'
      case 'medication': return 'bg-purple-100 text-purple-800'
      case 'therapy': return 'bg-blue-100 text-blue-800'
      case 'lifestyle': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Doctor credentials required.
            </p>
            <Button asChild>
              <a href="/auth/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedPatient.usn} • {selectedPatient.department}
                </p>
              </div>
            </div>
            <Button
              onClick={() => downloadPatientReport(selectedPatient)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Download Report</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Average Mood</p>
                    <p className="text-2xl font-bold">{selectedPatient.averageMood.toFixed(1)}/10</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <Badge className={getRiskBadgeColor(selectedPatient.riskLevel)}>
                      {selectedPatient.riskLevel.charAt(0).toUpperCase() + selectedPatient.riskLevel.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Entries</p>
                    <p className="font-semibold">{selectedPatient.totalEntries}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Entry</p>
                    <p className="font-semibold">{new Date(selectedPatient.lastEntry).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Linked Since</p>
                    <p className="font-semibold">{new Date(selectedPatient.linkedDate).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Doctor Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Doctor Notes</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDoctorNotes(selectedPatient.doctorNotes)
                        setIsEditingNotes(true)
                      }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <div className="space-y-3">
                      <textarea
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={4}
                        placeholder="Enter your notes about this patient..."
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={updateDoctorNotes}>
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedPatient.doctorNotes || 'No notes added yet. Click edit to add notes.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Suggestions and Mood Trend */}
            <div className="lg:col-span-2 space-y-6">
              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Treatment Suggestions</CardTitle>
                    <Button
                      onClick={() => setShowSuggestionForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Add Suggestion
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showSuggestionForm && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Suggestion</label>
                          <textarea
                            value={newSuggestion}
                            onChange={(e) => setNewSuggestion(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            rows={3}
                            placeholder="Enter your suggestion..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                              value={suggestionCategory}
                              onChange={(e) => setSuggestionCategory(e.target.value as any)}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="lifestyle">Lifestyle</option>
                              <option value="therapy">Therapy</option>
                              <option value="medication">Medication</option>
                              <option value="emergency">Emergency</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Priority</label>
                            <select
                              value={suggestionPriority}
                              onChange={(e) => setSuggestionPriority(e.target.value as any)}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={addSuggestion}>Add Suggestion</Button>
                          <Button variant="outline" onClick={() => setShowSuggestionForm(false)}>Cancel</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {selectedPatient.suggestions.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No suggestions added yet.</p>
                    ) : (
                      selectedPatient.suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="flex items-start justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span>{getPriorityIcon(suggestion.priority)}</span>
                              <Badge className={getSuggestionColor(suggestion.category)}>
                                {suggestion.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(suggestion.dateAdded).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{suggestion.text}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSuggestion(suggestion.id)}
                            className="ml-2"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Mood Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Mood Trend (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {selectedPatient.recentMoods.map((mood, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl mb-2">
                          {mood <= 3 ? '😢' : mood <= 5 ? '😐' : mood <= 7 ? '🙂' : '😊'}
                        </div>
                        <div className="text-sm font-medium">{mood}/10</div>
                        <div className="text-xs text-gray-500">Day {index + 1}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Patient Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Search and link students to monitor their mental health progress
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={downloadOverallReport}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>Download Overall Report</span>
              </Button>
              <Link href="/doctor">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Student by USN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchUSN}
                  onChange={(e) => setSearchUSN(e.target.value)}
                  placeholder="Enter student USN or name (e.g., 1RV21CS001)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && searchStudentByUSN()}
                />
              </div>
              <Button onClick={searchStudentByUSN} className="px-6">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((student) => (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.usn}</p>
                            <p className="text-sm text-gray-600">{student.department} • Year {student.year}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                          <Button
                            onClick={() => linkPatient(student)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <UserPlusIcon className="h-4 w-4 mr-1" />
                            Link
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Linked Patients */}
        <Card>
          <CardHeader>
            <CardTitle>My Linked Patients ({linkedPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {linkedPatients.length === 0 ? (
              <div className="text-center py-8">
                <UserPlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No patients linked yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Search for students by USN to start monitoring their mental health.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {linkedPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <p className="text-sm text-gray-600">{patient.usn}</p>
                            <p className="text-sm text-gray-600">{patient.department}</p>
                          </div>
                          <Badge className={getRiskBadgeColor(patient.riskLevel)}>
                            {patient.riskLevel}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Mood:</span>
                            <span className="font-medium">{patient.averageMood.toFixed(1)}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Entries:</span>
                            <span className="font-medium">{patient.totalEntries}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Suggestions:</span>
                            <span className="font-medium">{patient.suggestions.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Linked:</span>
                            <span className="font-medium text-xs">
                              {new Date(patient.linkedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600">Recent:</span>
                            {patient.recentMoods.slice(-3).map((mood, idx) => (
                              <span key={idx} className="text-lg">
                                {mood <= 3 ? '😢' : mood <= 5 ? '😐' : mood <= 7 ? '🙂' : '😊'}
                              </span>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              downloadPatientReport(patient)
                            }}
                          >
                            <DocumentArrowDownIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

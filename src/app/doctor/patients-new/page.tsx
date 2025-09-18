'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Student {
  id: string
  name: string
  email: string
  usn: string
  college: string
  department: string
  year: number
  phone: string
}

interface LinkedPatient extends Student {
  linkedDate: string
  averageMood: number
  riskLevel: 'low' | 'medium' | 'high'
  lastEntry: string
  totalEntries: number
  recentMoods: number[]
  doctorNotes: string
  suggestions: Suggestion[]
  nextAppointment?: string
}

interface Suggestion {
  id: string
  text: string
  category: 'lifestyle' | 'therapy' | 'medication' | 'emergency'
  priority: 'low' | 'medium' | 'high'
  dateAdded: string
}

export default function NewPatientManagement() {
  const [searchUSN, setSearchUSN] = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [linkedPatients, setLinkedPatients] = useState<LinkedPatient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<LinkedPatient | null>(null)
  const [showAddSuggestion, setShowAddSuggestion] = useState(false)
  const [newSuggestion, setNewSuggestion] = useState('')
  const [suggestionCategory, setSuggestionCategory] = useState<Suggestion['category']>('lifestyle')
  const [suggestionPriority, setSuggestionPriority] = useState<Suggestion['priority']>('medium')

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
    if (!searchUSN.trim()) return

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
      }
    ]

    const results = mockStudents.filter(student => 
      student.usn.toLowerCase().includes(searchUSN.toLowerCase()) ||
      student.name.toLowerCase().includes(searchUSN.toLowerCase())
    )

    setSearchResults(results)
  }

  const linkPatient = (student: Student) => {
    if (linkedPatients.some(p => p.usn === student.usn)) {
      alert('Student is already linked to your patient list')
      return
    }

    const linkedPatient: LinkedPatient = {
      ...student,
      linkedDate: new Date().toISOString(),
      averageMood: Math.random() * 4 + 4,
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
    setNewSuggestion('')
    setShowAddSuggestion(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Patient Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Search for students by USN and manage your patient list
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Search Students
              </h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchUSN}
                    onChange={(e) => setSearchUSN(e.target.value)}
                    placeholder="Enter USN or name..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && searchStudentByUSN()}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={searchStudentByUSN}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Search Student
                </motion.button>
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-3"
                  >
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Search Results
                    </h3>
                    {searchResults.map((student) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {student.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {student.usn} • {student.department}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Year {student.year} • {student.email}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => linkPatient(student)}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-200"
                          >
                            <UserPlusIcon className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Patient List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  My Patients ({linkedPatients.length})
                </h2>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Click on a patient to view details
                </div>
              </div>

              {linkedPatients.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlusIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No patients linked yet. Search for students to add them to your patient list.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {linkedPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedPatient(patient)}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {patient.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {patient.usn}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(patient.riskLevel)}`}>
                          {patient.riskLevel} risk
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Avg Mood:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {patient.averageMood.toFixed(1)}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Entries:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {patient.totalEntries}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Last Entry:</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {new Date(patient.lastEntry).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Patient Detail Modal */}
        <AnimatePresence>
          {selectedPatient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setSelectedPatient(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedPatient.name}
                  </h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">USN:</span>
                      <p className="font-medium text-slate-900 dark:text-white">{selectedPatient.usn}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Department:</span>
                      <p className="font-medium text-slate-900 dark:text-white">{selectedPatient.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Email:</span>
                      <p className="font-medium text-slate-900 dark:text-white">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Phone:</span>
                      <p className="font-medium text-slate-900 dark:text-white">{selectedPatient.phone}</p>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Treatment Suggestions
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddSuggestion(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {selectedPatient.suggestions.length === 0 ? (
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        No suggestions added yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedPatient.suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-sm text-slate-900 dark:text-white">
                                {suggestion.text}
                              </p>
                              <div className="flex space-x-2">
                                <span className={`px-2 py-1 rounded text-xs ${getRiskColor(suggestion.priority)}`}>
                                  {suggestion.priority}
                                </span>
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                                  {suggestion.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Suggestion Modal */}
        <AnimatePresence>
          {showAddSuggestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowAddSuggestion(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Add Treatment Suggestion
                </h3>
                
                <div className="space-y-4">
                  <textarea
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    placeholder="Enter treatment suggestion..."
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    rows={3}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={suggestionCategory}
                      onChange={(e) => setSuggestionCategory(e.target.value as Suggestion['category'])}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="lifestyle">Lifestyle</option>
                      <option value="therapy">Therapy</option>
                      <option value="medication">Medication</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    
                    <select
                      value={suggestionPriority}
                      onChange={(e) => setSuggestionPriority(e.target.value as Suggestion['priority'])}
                      className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addSuggestion}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Add Suggestion
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddSuggestion(false)}
                      className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

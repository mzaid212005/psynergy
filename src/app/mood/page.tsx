'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaceSmileIcon,
  FaceFrownIcon,
  HeartIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PlusIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface MoodEntry {
  id: string
  date: string
  mood: number // 1-10 scale
  energy: number // 1-10 scale
  stress: number // 1-10 scale
  sleep: number // 1-10 scale
  notes: string
  activities: string[]
  symptoms: string[]
}

const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '🤗', '😁', '🥳', '🌟']
const moodLabels = ['Very Low', 'Low', 'Poor', 'Below Average', 'Average', 'Good', 'Very Good', 'Great', 'Excellent', 'Amazing']

const activities = [
  'Exercise', 'Study', 'Social Time', 'Family Time', 'Hobbies', 'Work', 'Rest', 'Meditation', 'Music', 'Reading'
]

const symptoms = [
  'Anxiety', 'Sadness', 'Irritability', 'Fatigue', 'Concentration Issues', 'Appetite Changes', 'Sleep Issues', 'Headache'
]

export default function MoodLogPage() {
  const { user } = useAuth()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<Partial<MoodEntry>>({
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    notes: '',
    activities: [],
    symptoms: []
  })

  useEffect(() => {
    loadMoodEntries()
  }, [])

  const loadMoodEntries = () => {
    // Load from localStorage for demo
    const stored = localStorage.getItem(`mood_entries_${user?.id}`)
    if (stored) {
      setMoodEntries(JSON.parse(stored))
    }
  }

  const saveMoodEntry = () => {
    if (!user) return

    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentEntry.mood || 5,
      energy: currentEntry.energy || 5,
      stress: currentEntry.stress || 5,
      sleep: currentEntry.sleep || 5,
      notes: currentEntry.notes || '',
      activities: currentEntry.activities || [],
      symptoms: currentEntry.symptoms || []
    }

    const updatedEntries = [entry, ...moodEntries]
    setMoodEntries(updatedEntries)
    localStorage.setItem(`mood_entries_${user.id}`, JSON.stringify(updatedEntries))
    
    setShowForm(false)
    setCurrentEntry({
      mood: 5,
      energy: 5,
      stress: 5,
      sleep: 5,
      notes: '',
      activities: [],
      symptoms: []
    })
    
    toast.success('Mood entry saved successfully!')
  }

  const toggleActivity = (activity: string) => {
    const activities = currentEntry.activities || []
    const updated = activities.includes(activity)
      ? activities.filter(a => a !== activity)
      : [...activities, activity]
    setCurrentEntry({ ...currentEntry, activities: updated })
  }

  const toggleSymptom = (symptom: string) => {
    const symptoms = currentEntry.symptoms || []
    const updated = symptoms.includes(symptom)
      ? symptoms.filter(s => s !== symptom)
      : [...symptoms, symptom]
    setCurrentEntry({ ...currentEntry, symptoms: updated })
  }

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0
    return moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length
  }

  const getRecentTrend = () => {
    if (moodEntries.length < 2) return 'neutral'
    const recent = moodEntries.slice(0, 3)
    const older = moodEntries.slice(3, 6)
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length
    const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + entry.mood, 0) / older.length : recentAvg
    
    if (recentAvg > olderAvg + 0.5) return 'improving'
    if (recentAvg < olderAvg - 0.5) return 'declining'
    return 'stable'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Please log in to access mood logging.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mood Journal
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your daily mood and mental well-being
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Log Mood</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
              <FaceSmileIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getAverageMood().toFixed(1)}/10
              </div>
              <p className="text-xs text-muted-foreground">
                {moodLabels[Math.round(getAverageMood()) - 1] || 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moodEntries.length}</div>
              <p className="text-xs text-muted-foreground">
                Mood logs recorded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trend</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {getRecentTrend()}
              </div>
              <p className="text-xs text-muted-foreground">
                Recent mood pattern
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mood Entry Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Log Your Mood
              </h2>

              {/* Mood Scale */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Overall Mood (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      onClick={() => setCurrentEntry({ ...currentEntry, mood: value })}
                      className={`w-12 h-12 rounded-full text-2xl transition-all ${
                        currentEntry.mood === value
                          ? 'bg-blue-500 text-white scale-110'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {moodEmojis[value - 1]}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {moodLabels[(currentEntry.mood || 5) - 1]}
                </p>
              </div>

              {/* Other Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Energy Level
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEntry.energy || 5}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, energy: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-500">{currentEntry.energy}/10</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stress Level
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEntry.stress || 5}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, stress: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-500">{currentEntry.stress}/10</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sleep Quality
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEntry.sleep || 5}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, sleep: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-500">{currentEntry.sleep}/10</div>
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Activities Today
                </label>
                <div className="flex flex-wrap gap-2">
                  {activities.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        currentEntry.activities?.includes(activity)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Symptoms (if any)
                </label>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        currentEntry.symptoms?.includes(symptom)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={currentEntry.notes || ''}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
                  placeholder="How are you feeling today? Any thoughts or observations..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveMoodEntry}>
                  Save Entry
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Recent Entries */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Entries
          </h2>
          {moodEntries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FaceSmileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No mood entries yet. Start by logging your first mood!
                </p>
              </CardContent>
            </Card>
          ) : (
            moodEntries.slice(0, 10).map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{moodEmojis[entry.mood - 1]}</div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {moodLabels[entry.mood - 1]} ({entry.mood}/10)
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                      <div>Energy: {entry.energy}/10</div>
                      <div>Stress: {entry.stress}/10</div>
                      <div>Sleep: {entry.sleep}/10</div>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      {entry.notes}
                    </div>
                  )}
                  {(entry.activities.length > 0 || entry.symptoms.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {entry.activities.map((activity) => (
                        <span
                          key={activity}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded"
                        >
                          {activity}
                        </span>
                      ))}
                      {entry.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs rounded"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

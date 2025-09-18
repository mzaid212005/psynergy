'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      moodReminders: true,
      appointmentReminders: true,
      weeklyReports: false
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsOptOut: false
    },
    preferences: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      moodReminderTime: '20:00'
    }
  })

  useEffect(() => {
    setMounted(true)
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    localStorage.setItem('userSettings', JSON.stringify(newSettings))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  const handlePrivacyChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  const handlePreferenceChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16" />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ShieldCheckIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Please log in to access settings.
            </p>
            <Button asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account preferences and privacy settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {user.role}
                  </p>
                  {user.usn && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      USN: {user.usn}
                    </p>
                  )}
                  {user.department && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user.department}
                    </p>
                  )}
                </div>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PaintBrushIcon className="w-5 h-5 mr-2" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-900 dark:text-white">
                        Theme
                      </label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {['light', 'dark', 'system'].map((themeOption) => (
                          <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                              theme === themeOption
                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                          >
                            {themeOption}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BellIcon className="w-5 h-5 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-900 dark:text-white">
                          Data Sharing
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Share anonymized data for research
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyChange('dataSharing', !settings.privacy.dataSharing)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacy.dataSharing ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-900 dark:text-white">
                          Analytics Opt-out
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Opt out of usage analytics
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrivacyChange('analyticsOptOut', !settings.privacy.analyticsOptOut)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacy.analyticsOptOut ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacy.analyticsOptOut ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GlobeAltIcon className="w-5 h-5 mr-2" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-900 dark:text-white">
                        Language
                      </label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="kn">Kannada</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-900 dark:text-white">
                        Mood Reminder Time
                      </label>
                      <input
                        type="time"
                        value={settings.preferences.moodReminderTime}
                        onChange={(e) => handlePreferenceChange('moodReminderTime', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

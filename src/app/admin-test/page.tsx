'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  HeartIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

export default function AdminTestPage() {
  const { user, login } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const loginAsAdmin = async () => {
    setIsLoggingIn(true)
    try {
      await login('admin@rvcoe.edu.in', 'admin123')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Institute Administrator Access
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Login as institute administrator to access mood monitoring and analytics
          </p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="w-6 h-6 mr-2" />
                Current Login Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        ✅ Logged in as {user.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Role: {user.role} | Email: {user.email}
                      </p>
                    </div>
                  </div>
                  {user.role === 'institute' || user.role === 'admin' ? (
                    <div className="text-green-600 font-semibold">
                      ✅ Admin Access Granted
                    </div>
                  ) : (
                    <div className="text-yellow-600 font-semibold">
                      ⚠️ Need Admin Role
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Not logged in
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Please login as institute administrator to continue
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={loginAsAdmin}
                    disabled={isLoggingIn}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {isLoggingIn ? 'Logging in...' : 'Login as Admin'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-300">
                Institute Administrator Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email</h3>
                  <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">
                    admin@rvcoe.edu.in
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Password</h3>
                  <p className="font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded border">
                    admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        {user && (user.role === 'institute' || user.role === 'admin') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HeartIcon className="w-6 h-6 mr-2" />
                  Admin Dashboard Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/admin/moods">
                    <Button className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700">
                      <HeartIcon className="w-4 h-4 mr-2" />
                      Mood Monitoring
                    </Button>
                  </Link>
                  
                  <Link href="/admin/analytics">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <ChartBarIcon className="w-4 h-4 mr-2" />
                      Analytics Dashboard
                    </Button>
                  </Link>
                  
                  <Link href="/admin">
                    <Button variant="outline" className="w-full">
                      <ArrowRightIcon className="w-4 h-4 mr-2" />
                      Main Admin Panel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>How to Access Mood Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Login as Administrator</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Use the credentials above or click "Login as Admin" button
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Access Mood Monitoring</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click "Mood Monitoring" button above or navigate to /admin/moods
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">View Aggregated Data</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      See anonymized mood data, department breakdowns, and risk assessments
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alternative Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Alternative Access Methods
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Manual Login Page
                  </Button>
                </Link>
                <Link href="/final-test">
                  <Button variant="outline" className="w-full">
                    System Test Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

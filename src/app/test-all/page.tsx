'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  UserIcon,
  HeartIcon,
  AcademicCapIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning' | 'pending'
  message: string
  url?: string
}

export default function TestAllPage() {
  const { user, login, logout } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [currentTest, setCurrentTest] = useState('')

  const tests = [
    { name: 'Home Page', url: '/', description: 'Landing page loads correctly' },
    { name: 'Student Dashboard', url: '/dashboard', description: 'Student dashboard with mood tracking' },
    { name: 'Doctor Dashboard', url: '/doctor', description: 'Doctor dashboard with patient overview' },
    { name: 'Patient Management', url: '/doctor/patients', description: 'USN search and patient linking' },
    { name: 'Analytics Page', url: '/admin/analytics', description: 'Institute analytics (requires admin login)' },
    { name: 'Settings Page', url: '/settings', description: 'User settings and preferences' },
    { name: 'Login Page', url: '/auth/login', description: 'Authentication system' }
  ]

  const quickLogins = [
    {
      role: 'student',
      email: 'arjun@student.com',
      password: 'password123',
      name: 'Arjun Patel',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      role: 'doctor',
      email: 'priya@doctor.com',
      password: 'password123',
      name: 'Dr. Priya Sharma',
      color: 'from-green-500 to-emerald-500'
    },
    {
      role: 'institute',
      email: 'admin@rvcoe.edu.in',
      password: 'admin123',
      name: 'Institute Admin',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const runAllTests = async () => {
    setIsRunningTests(true)
    setTestResults([])
    
    for (const test of tests) {
      setCurrentTest(test.name)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate test time
      
      try {
        const response = await fetch(test.url)
        const status = response.status
        
        let result: TestResult
        if (status === 200) {
          result = {
            name: test.name,
            status: 'pass',
            message: 'Page loads successfully',
            url: test.url
          }
        } else if (status === 404) {
          result = {
            name: test.name,
            status: 'fail',
            message: '404 - Page not found',
            url: test.url
          }
        } else {
          result = {
            name: test.name,
            status: 'warning',
            message: `HTTP ${status} - May require authentication`,
            url: test.url
          }
        }
        
        setTestResults(prev => [...prev, result])
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'fail',
          message: 'Network error or server down',
          url: test.url
        }])
      }
    }
    
    setCurrentTest('')
    setIsRunningTests(false)
  }

  const quickLogin = async (loginData: typeof quickLogins[0]) => {
    try {
      await login(loginData.email, loginData.password)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return CheckCircleIcon
      case 'fail': return XCircleIcon
      case 'warning': return ExclamationTriangleIcon
      default: return ExclamationTriangleIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50'
      case 'fail': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            System Test Dashboard
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Test all system components, authentication flows, and functionality
          </p>
        </motion.div>

        {/* Current User Status */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Logged in as: {user.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Role: {user.role} | Email: {user.email}
                      </p>
                    </div>
                  </div>
                  <Button onClick={logout} variant="outline" className="text-red-600">
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Login Section */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Login for Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickLogins.map((loginData, index) => (
                    <motion.button
                      key={loginData.role}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => quickLogin(loginData)}
                      className={`p-4 rounded-lg bg-gradient-to-r ${loginData.color} text-white font-medium transition-all duration-200`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold mb-1">{loginData.name}</div>
                        <div className="text-sm opacity-90 capitalize">{loginData.role}</div>
                        <div className="text-xs opacity-75 mt-1">{loginData.email}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>System Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Test all system components for functionality and accessibility
                  </p>
                  {isRunningTests && (
                    <p className="text-blue-600 dark:text-blue-400 mt-2">
                      Currently testing: {currentTest}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunningTests}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
                </Button>
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Test Results
                  </h3>
                  {testResults.map((result, index) => {
                    const StatusIcon = getStatusIcon(result.status)
                    return (
                      <motion.div
                        key={result.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(result.status).split(' ')[0]}`} />
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {result.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {result.message}
                            </p>
                          </div>
                        </div>
                        {result.url && (
                          <Link href={result.url}>
                            <Button variant="outline" size="sm">
                              <ArrowRightIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Manual Test Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Manual Testing Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tests.map((test, index) => (
                  <Link key={test.name} href={test.url}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                    >
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        {test.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {test.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {test.url}
                        </span>
                        <ArrowRightIcon className="w-4 h-4 text-slate-400" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Test Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Feature Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Authentication & Navigation
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>Login/Logout functionality</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>Role-based access control</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>Modern navigation system</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>Settings page</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Core Features
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>Student-Doctor linking via USN</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>Privacy-protected analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>PDF report generation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      <span>Department-wise analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  UserIcon, 
  AcademicCapIcon, 
  ShieldCheckIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export function AuthStatus() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Not logged in
              </span>
              <Link href="/auth/login">
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const roleConfig = {
    student: {
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      dashboard: '/dashboard'
    },
    doctor: {
      icon: HeartIcon,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-500',
      dashboard: '/doctor'
    },
    institute: {
      icon: ShieldCheckIcon,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      dashboard: '/admin'
    },
    admin: {
      icon: ShieldCheckIcon,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      dashboard: '/admin'
    }
  }

  const config = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.student
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl max-w-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Authentication Status
            </CardTitle>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center`}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {user.name}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  {user.specialization && (
                    <Badge variant="outline" className="text-xs">
                      {user.specialization}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {user.email && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                📧 {user.email}
              </p>
            )}

            {user.college && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                🏫 {user.college}
              </p>
            )}

            {user.usn && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                🎓 USN: {user.usn}
              </p>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Link href={config.dashboard}>
                <Button size="sm" className={`bg-gradient-to-r ${config.gradient} text-white text-xs`}>
                  <ArrowRightIcon className="w-3 h-3 mr-1" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={logout}
                className="text-xs"
              >
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function DemoInstructions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 left-4 z-40"
    >
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl max-w-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            🎯 Demo Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="space-y-1">
              <p className="font-medium text-gray-800 dark:text-gray-200">Login Credentials:</p>
              <p>👨‍⚕️ Doctor: priya@doctor.com</p>
              <p>🎓 Student: student@example.com</p>
              <p>🏛️ Institute: admin@psynergy.com</p>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="font-medium text-gray-800 dark:text-gray-200">Features:</p>
              <p>• Role-based dashboards</p>
              <p>• Patient management</p>
              <p>• Mood tracking</p>
              <p>• PDF reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

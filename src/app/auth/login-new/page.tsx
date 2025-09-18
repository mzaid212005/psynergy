'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  SparklesIcon,
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function NewLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'student' | 'doctor' | 'institute'>('student')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const roleOptions = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access mental health support',
      icon: '🎓',
      email: 'student@example.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage patient care',
      icon: '👨‍⚕️',
      email: 'priya@doctor.com',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'institute',
      title: 'Institute',
      description: 'Administrative access',
      icon: '🏛️',
      email: 'admin@psynergy.com',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const quickLogin = (role: typeof selectedRole) => {
    const roleData = roleOptions.find(r => r.id === role)
    if (roleData) {
      setEmail(roleData.email)
      setPassword('demo123')
      setSelectedRole(role)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Psynergy</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Your Mental Health
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Companion
              </span>
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Comprehensive digital psychological intervention system designed for Indian college students.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="w-5 h-5 text-yellow-300" />
                <span>AI-powered mental health support</span>
              </div>
              <div className="flex items-center space-x-3">
                <HeartIcon className="w-5 h-5 text-pink-300" />
                <span>Professional counseling services</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-blue-300" />
                <span>Peer support community</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 right-32 w-24 h-24 bg-white/10 rounded-xl backdrop-blur-sm"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to continue your mental wellness journey
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-3">
              {roleOptions.map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => quickLogin(role.id as any)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{role.icon}</div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white">
                    {role.title}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              <strong>Demo Mode:</strong> Use any password with the demo emails above.
              <br />
              Click on role cards for quick access.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export type UserRole = 'student' | 'doctor' | 'admin' | 'institute'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  college?: string
  department?: string
  usn?: string
  specialization?: string // For doctors
  experience?: string // For doctors
  qualification?: string // For doctors
  instituteName?: string // For institute admins
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check localStorage for user session
      const storedUser = localStorage.getItem('psynergy_user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call - In real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data based on email domain/pattern
      let userData: User
      
      // Predefined doctor account
      if (email === 'priya@doctor.com' || email === 'priya@psynergy.com') {
        userData = {
          id: 'doc_priya_001',
          email,
          name: 'Dr. Priya Sharma',
          role: 'doctor',
          specialization: 'Clinical Psychology',
          experience: '8 years',
          qualification: 'MD Psychiatry, PhD Clinical Psychology'
        }
      } else if (email.includes('doctor') || email.includes('dr.')) {
        userData = {
          id: 'doc_' + Date.now(),
          email,
          name: 'Dr. ' + email.split('@')[0].replace('doctor', '').replace('dr.', ''),
          role: 'doctor',
          specialization: 'Clinical Psychology'
        }
      } else if (email === 'admin@psynergy.com' || email === 'institute@psynergy.com') {
        userData = {
          id: 'inst_admin_001',
          email,
          name: 'Institute Administrator',
          role: 'institute',
          instituteName: 'RV College of Engineering',
          department: 'Student Affairs',
          position: 'Director of Student Mental Health'
        }
      } else if (email.includes('admin') || email.includes('institute')) {
        userData = {
          id: 'inst_' + Date.now(),
          email,
          name: email.split('@')[0].replace('admin', '').replace('institute', '') + ' Admin',
          role: 'institute',
          instituteName: 'Sample College'
        }
      } else {
        userData = {
          id: 'std_' + Date.now(),
          email,
          name: email.split('@')[0],
          role: 'student',
          college: 'Sample College',
          department: 'Computer Science',
          usn: 'CS21001'
        }
      }

      setUser(userData)
      localStorage.setItem('psynergy_user', JSON.stringify(userData))
      
      toast.success(`Welcome back, ${userData.name}!`)
      
      // Redirect based on role
      switch (userData.role) {
        case 'doctor':
          router.push('/doctor')
          break
        case 'institute':
          router.push('/admin')
          break
        case 'student':
        default:
          router.push('/dashboard')
          break
      }
    } catch (error) {
      toast.error('Invalid credentials. Please try again.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newUser: User = {
        id: 'std_' + Date.now(),
        email: userData.email,
        name: userData.firstName + ' ' + userData.lastName,
        role: 'student',
        college: userData.college,
        department: userData.department,
        usn: userData.usn
      }

      setUser(newUser)
      localStorage.setItem('psynergy_user', JSON.stringify(newUser))
      
      toast.success('Registration successful! Welcome to Psynergy!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('psynergy_user')
    toast.success('Logged out successfully')
    router.push('/')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('psynergy_user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

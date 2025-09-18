import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validation utilities
export const validateUSN = (usn: string): boolean => {
  // USN format: 1XY21MCA099 (example)
  const usnRegex = /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{3}[0-9]{3}$/
  return usnRegex.test(usn.toUpperCase())
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

// Date utilities
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Assessment scoring utilities
export const calculatePHQ9Score = (responses: number[]): {
  score: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
} => {
  const score = responses.reduce((sum, response) => sum + response, 0)
  
  let severity: 'minimal' | 'mild' | 'moderate' | 'severe'
  if (score <= 4) severity = 'minimal'
  else if (score <= 9) severity = 'mild'
  else if (score <= 14) severity = 'moderate'
  else severity = 'severe'
  
  return { score, severity }
}

export const calculateGAD7Score = (responses: number[]): {
  score: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
} => {
  const score = responses.reduce((sum, response) => sum + response, 0)
  
  let severity: 'minimal' | 'mild' | 'moderate' | 'severe'
  if (score <= 4) severity = 'minimal'
  else if (score <= 9) severity = 'mild'
  else if (score <= 14) severity = 'moderate'
  else severity = 'severe'
  
  return { score, severity }
}

// Risk assessment utilities
export const assessRiskLevel = (
  phq9Score?: number,
  gad7Score?: number,
  keywords?: string[]
): 'low' | 'medium' | 'high' | 'critical' => {
  const highRiskKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living',
    'better off dead', 'harm myself', 'self-harm'
  ]
  
  const mediumRiskKeywords = [
    'hopeless', 'worthless', 'can\'t cope', 'overwhelming',
    'panic', 'anxiety attack', 'depressed'
  ]
  
  // Check for critical keywords
  if (keywords?.some(keyword => 
    highRiskKeywords.some(risk => keyword.toLowerCase().includes(risk))
  )) {
    return 'critical'
  }
  
  // Check assessment scores
  if (phq9Score && phq9Score >= 15) return 'high'
  if (gad7Score && gad7Score >= 15) return 'high'
  
  if (phq9Score && phq9Score >= 10) return 'medium'
  if (gad7Score && gad7Score >= 10) return 'medium'
  
  // Check for medium risk keywords
  if (keywords?.some(keyword => 
    mediumRiskKeywords.some(risk => keyword.toLowerCase().includes(risk))
  )) {
    return 'medium'
  }
  
  return 'low'
}

// Color utilities for themes
export const getThemeColors = (theme: 'light' | 'dark') => {
  return {
    primary: theme === 'light' ? '#0ea5e9' : '#38bdf8',
    secondary: theme === 'light' ? '#64748b' : '#94a3b8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: theme === 'light' ? '#ffffff' : '#0f172a',
    foreground: theme === 'light' ? '#0f172a' : '#f8fafc',
  }
}

// Local storage utilities
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Handle storage errors silently
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      // Handle storage errors silently
    }
  },
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

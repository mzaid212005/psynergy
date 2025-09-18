'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationProps {
  notification: Notification
  onClose: (id: string) => void
}

function NotificationItem({ notification, onClose }: NotificationProps) {
  const { id, type, title, message, duration = 5000, action } = notification

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const typeConfig = {
    success: {
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-200'
    },
    error: {
      icon: XCircleIcon,
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200'
    },
    info: {
      icon: InformationCircleIcon,
      gradient: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200'
    }
  }

  const config = typeConfig[type]
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      className={`relative overflow-hidden rounded-xl border ${config.borderColor} ${config.bgColor} p-4 shadow-lg backdrop-blur-lg`}
    >
      {/* Animated gradient border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10 rounded-xl`} />
      
      <div className="relative flex items-start space-x-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center`}
        >
          <IconComponent className="w-5 h-5 text-white" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`text-sm font-semibold ${config.textColor}`}
          >
            {title}
          </motion.h4>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={`text-sm ${config.textColor} opacity-80 mt-1`}
          >
            {message}
          </motion.p>
          
          {action && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onClick={action.onClick}
              className={`mt-2 text-xs font-medium bg-gradient-to-r ${config.gradient} text-white px-3 py-1 rounded-full hover:shadow-lg transition-shadow duration-200`}
            >
              {action.label}
            </motion.button>
          )}
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClose(id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full ${config.textColor} opacity-60 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center`}
        >
          <XMarkIcon className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress bar for timed notifications */}
      {duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${config.gradient} rounded-b-xl`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  )
}

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Global notification function
  useEffect(() => {
    (window as any).showNotification = addNotification
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export function FloatingNotification({ 
  children, 
  type = 'info',
  position = 'bottom-right'
}: {
  children: React.ReactNode
  type?: NotificationType
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const typeConfig = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-pink-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-purple-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0, y: 50 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className={`fixed ${positionClasses[position]} z-50`}
    >
      <div className={`bg-gradient-to-r ${typeConfig[type]} text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-lg flex items-center space-x-2`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <SparklesIcon className="w-5 h-5" />
        </motion.div>
        <span className="font-medium">{children}</span>
      </div>
    </motion.div>
  )
}

// Helper functions for easy use
export const showSuccess = (title: string, message: string, action?: Notification['action']) => {
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification({ type: 'success', title, message, action })
  }
}

export const showError = (title: string, message: string, action?: Notification['action']) => {
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification({ type: 'error', title, message, action })
  }
}

export const showWarning = (title: string, message: string, action?: Notification['action']) => {
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification({ type: 'warning', title, message, action })
  }
}

export const showInfo = (title: string, message: string, action?: Notification['action']) => {
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification({ type: 'info', title, message, action })
  }
}

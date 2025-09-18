'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  gradient?: string
  hover?: boolean
  title?: string
  icon?: ReactNode
  emoji?: string
}

export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0, 
  gradient = 'from-purple-500 to-pink-500',
  hover = true,
  title,
  icon,
  emoji
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.6,
        type: "spring",
        bounce: 0.3
      }}
      whileHover={hover ? { 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={hover ? { scale: 0.95 } : {}}
      className={`group cursor-pointer ${className}`}
    >
      <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="relative p-6">
          {title && (
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center space-x-3">
                {emoji && (
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <span className="text-2xl">{emoji}</span>
                  </motion.div>
                )}
                {icon && (
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    {icon}
                  </motion.div>
                )}
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {title}
                </CardTitle>
              </div>
            </CardHeader>
          )}
          
          {children}
          
          {/* Hover effect */}
          <motion.div
            className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} transition-all duration-300`}
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AnimatedStatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  gradient = 'from-blue-500 to-purple-500',
  delay = 0 
}: {
  title: string
  value: string | number
  icon: ReactNode
  trend?: 'up' | 'down' | 'stable'
  gradient?: string
  delay?: number
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {title}
              </p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.2, duration: 0.5 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {value}
              </motion.p>
              {trend && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.4, duration: 0.5 }}
                  className={`text-sm ${trendColors[trend]} mt-1`}
                >
                  {trend === 'up' && '↗ Improving'}
                  {trend === 'down' && '↘ Declining'}
                  {trend === 'stable' && '→ Stable'}
                </motion.p>
              )}
            </div>
            
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
            >
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function FloatingActionButton({ 
  onClick, 
  icon, 
  gradient = 'from-purple-500 to-pink-500',
  className = ''
}: {
  onClick: () => void
  icon: ReactNode
  gradient?: string
  className?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r ${gradient} rounded-full shadow-2xl flex items-center justify-center text-white z-50 ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", bounce: 0.5 }}
    >
      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  )
}

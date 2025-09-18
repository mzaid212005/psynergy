'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientBackgroundProps {
  children: ReactNode
  variant?: 'default' | 'purple' | 'blue' | 'green' | 'pink' | 'rainbow'
  animated?: boolean
  className?: string
}

export function GradientBackground({ 
  children, 
  variant = 'default', 
  animated = true,
  className = ''
}: GradientBackgroundProps) {
  const variants = {
    default: 'from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900',
    purple: 'from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900',
    blue: 'from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-teal-900',
    green: 'from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900',
    pink: 'from-pink-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-pink-900 dark:to-orange-900',
    rainbow: 'from-purple-50 via-pink-50 via-blue-50 via-cyan-50 to-green-50 dark:from-gray-900 dark:via-purple-900 dark:via-blue-900 dark:via-cyan-900 dark:to-green-900'
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${variants[variant]} relative overflow-hidden ${className}`}>
      {animated && (
        <>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"
            />
            <motion.div
              animate={{
                x: [0, -150, 0],
                y: [0, 100, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/3 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 blur-xl"
            />
            <motion.div
              animate={{
                x: [0, 80, 0],
                y: [0, -80, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl"
            />
            
            {/* Floating Particles */}
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.5,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export function GlassCard({ 
  children, 
  className = '',
  blur = 'lg'
}: { 
  children: ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  return (
    <div className={`bg-white/80 dark:bg-gray-800/80 ${blurClasses[blur]} border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  )
}

export function NeonGlow({ 
  children, 
  color = 'purple',
  intensity = 'medium'
}: { 
  children: ReactNode
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'yellow'
  intensity?: 'low' | 'medium' | 'high'
}) {
  const colors = {
    purple: 'shadow-purple-500/50',
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    pink: 'shadow-pink-500/50',
    yellow: 'shadow-yellow-500/50'
  }

  const intensities = {
    low: 'shadow-lg',
    medium: 'shadow-xl',
    high: 'shadow-2xl'
  }

  return (
    <div className={`${intensities[intensity]} ${colors[color]} transition-shadow duration-300 hover:shadow-2xl hover:${colors[color]}`}>
      {children}
    </div>
  )
}

export function AnimatedGradientText({ 
  children, 
  className = '',
  gradient = 'from-purple-600 via-pink-600 to-blue-600'
}: { 
  children: ReactNode
  className?: string
  gradient?: string
}) {
  return (
    <motion.span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.span>
  )
}

export function FloatingIcons({ icons }: { icons: ReactNode[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute text-purple-300 opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  )
}

export function PulsingOrb({ 
  size = 'md',
  color = 'purple',
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'purple' | 'blue' | 'green' | 'pink'
  className?: string
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colors = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500'
  }

  return (
    <motion.div
      className={`${sizes[size]} bg-gradient-to-r ${colors[color]} rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

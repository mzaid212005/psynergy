'use client'

import { motion } from 'framer-motion'
import { SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'

export function PulsingDots() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function SpinningLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-purple-200 border-t-purple-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}

export function HeartbeatLoader() {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <HeartIcon className="w-8 h-8 text-red-500" />
    </motion.div>
  )
}

export function WaveLoader() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          animate={{
            scaleY: [1, 2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
            }}
            className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
          />
        </motion.div>
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <SparklesIcon className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
        >
          Loading Psynergy
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <PulsingDots />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-300 mt-4"
        >
          Preparing your mental wellness journey...
        </motion.p>
      </div>
    </div>
  )
}

export function ButtonLoader({ children, loading, ...props }: any) {
  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
      disabled={loading}
      className={`relative overflow-hidden ${props.className}`}
      {...props}
    >
      <motion.div
        initial={false}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <SpinningLoader size="sm" />
        </motion.div>
      )}
    </motion.button>
  )
}

export function ProgressBar({ progress, gradient = 'from-purple-500 to-pink-500' }: { 
  progress: number
  gradient?: string 
}) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  )
}

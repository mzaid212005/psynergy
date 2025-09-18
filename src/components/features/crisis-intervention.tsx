'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExclamationTriangleIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CrisisInterventionProps {
  isVisible: boolean
  onClose: () => void
  riskLevel: 'high' | 'critical'
  crisisResources?: {
    emergency: string
    suicide_prevention: string
    shrestha: string
    message: string
  }
}

export function CrisisIntervention({ 
  isVisible, 
  onClose, 
  riskLevel, 
  crisisResources 
}: CrisisInterventionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userResponded, setUserResponded] = useState(false)

  const crisisSteps = [
    {
      title: "You're Not Alone",
      content: "I'm concerned about you right now. What you're feeling is valid, and there are people who want to help.",
      action: "I'm here with you"
    },
    {
      title: "Immediate Safety",
      content: "Are you in a safe place right now? If you're having thoughts of hurting yourself, please reach out for immediate help.",
      action: "I'm safe for now"
    },
    {
      title: "Professional Support",
      content: "Speaking with a trained professional can provide immediate support. They're available 24/7 and understand what you're going through.",
      action: "I'll consider calling"
    },
    {
      title: "Stay Connected",
      content: "Please don't isolate yourself. Reach out to someone you trust - a friend, family member, or counselor.",
      action: "I'll reach out to someone"
    }
  ]

  useEffect(() => {
    if (isVisible && riskLevel === 'critical') {
      // Auto-advance through crisis intervention steps
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < crisisSteps.length - 1) {
            return prev + 1
          }
          clearInterval(timer)
          return prev
        })
      }, 8000) // 8 seconds per step

      return () => clearInterval(timer)
    }
  }, [isVisible, riskLevel])

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self')
  }

  const handleUserResponse = (positive: boolean) => {
    setUserResponded(true)
    if (positive && currentStep < crisisSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-lg"
        >
          <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
            <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                    {riskLevel === 'critical' ? (
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-red-800 dark:text-red-200">
                      {riskLevel === 'critical' ? 'Crisis Support' : 'Mental Health Support'}
                    </CardTitle>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Immediate help is available
                    </p>
                  </div>
                </div>
                {riskLevel !== 'critical' && (
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {riskLevel === 'critical' ? (
                <div className="space-y-6">
                  {/* Crisis Intervention Steps */}
                  <div className="space-y-4">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        {crisisSteps[currentStep].title}
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                        {crisisSteps[currentStep].content}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUserResponse(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {crisisSteps[currentStep].action}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserResponse(false)}
                        >
                          I need more help
                        </Button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Immediate Help Available:
                    </h4>
                    
                    <div className="grid gap-3">
                      <Button
                        onClick={() => handleEmergencyCall('112')}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        Emergency Services: 112
                      </Button>
                      
                      <Button
                        onClick={() => handleEmergencyCall(crisisResources?.suicide_prevention || '91529-87821')}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        size="lg"
                      >
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        Suicide Prevention: {crisisResources?.suicide_prevention || '91529-87821'}
                      </Button>
                      
                      <Button
                        onClick={() => handleEmergencyCall(crisisResources?.shrestha || '7892707757')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                        shrestha Helpline: {crisisResources?.shrestha || '7892707757'}
                      </Button>
                    </div>
                  </div>

                  {/* Reassurance Message */}
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {crisisResources?.message || "You matter, and your life has value. These feelings can change with proper support. Please reach out - trained professionals are ready to help you through this difficult time."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    I notice you might be experiencing significant distress. While this isn't an emergency, 
                    it's important to take care of your mental health.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => window.open('/appointments', '_blank')}
                      className="w-full"
                    >
                      Schedule Counseling Session
                    </Button>
                    
                    <Button
                      onClick={() => handleEmergencyCall(crisisResources?.shrestha || '7892707757')}
                      variant="outline"
                      className="w-full"
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Call shrestha Helpline: {crisisResources?.shrestha || '7892707757'}
                    </Button>
                    
                    <Button
                      onClick={() => window.open('/resources', '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      View Coping Resources
                    </Button>
                  </div>
                </div>
              )}

              {/* Progress Indicator for Crisis Steps */}
              {riskLevel === 'critical' && (
                <div className="mt-6">
                  <div className="flex justify-center space-x-2">
                    {crisisSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index <= currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

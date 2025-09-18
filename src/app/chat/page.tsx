'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperAirplaneIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ClipboardDocumentListIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { ChatMessage, AssessmentResult } from '@/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { AssessmentModal } from '@/components/features/assessment-modal'
import { CrisisIntervention } from '@/components/features/crisis-intervention'
import { useChat } from '@/hooks/use-chat'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [assessmentType, setAssessmentType] = useState<'PHQ9' | 'GAD7' | 'STUDENT_STRESS'>('PHQ9')
  const [showCrisisIntervention, setShowCrisisIntervention] = useState(false)
  const [crisisResources, setCrisisResources] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const initialMessages: ChatMessage[] = [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm Psynergy AI, your mental health support companion. I'm here to listen, support, and help you navigate any challenges you're facing.

I can help you with:
🧠 Emotional support and active listening
📋 Mental health assessments (PHQ-9, GAD-7)
🌱 Coping strategies and mindfulness exercises
🏥 Connecting you with professional resources

Everything we discuss is confidential. How are you feeling today?`,
      timestamp: new Date().toISOString(),
      metadata: { riskLevel: 'low' }
    }
  ]

  const {
    messages,
    isLoading,
    error,
    riskLevel,
    sendMessage: sendChatMessage,
    addSystemMessage,
    updateAssessmentResult,
    triggerAssessment
  } = useChat({
    initialMessages,
    userLanguage: 'en', // TODO: Get from user preferences
    userId: 'current_user', // TODO: Get from auth context
    onRiskDetected: (level) => {
      if (level === 'critical' || level === 'high') {
        setShowCrisisIntervention(true)
      }
    },
    onAssessmentTriggered: (type) => {
      setAssessmentType(type as 'PHQ9' | 'GAD7' | 'STUDENT_STRESS')
      setShowAssessmentModal(true)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    await sendChatMessage(inputMessage)
    setInputMessage('')
  }

  const handleAssessmentComplete = (result: AssessmentResult) => {
    updateAssessmentResult(result)
    setShowAssessmentModal(false)

    // Show crisis intervention if needed
    if (result.requiresProfessionalHelp && result.severity === 'severe') {
      setShowCrisisIntervention(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startAssessment = (type: 'PHQ9' | 'GAD7' | 'STUDENT_STRESS') => {
    setAssessmentType(type)
    setShowAssessmentModal(true)
    triggerAssessment(type)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-600">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Psynergy AI Support</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Confidential mental health companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startAssessment('PHQ9')}
              >
                <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                Depression
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startAssessment('GAD7')}
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Anxiety
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startAssessment('STUDENT_STRESS')}
              >
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                Stress
              </Button>
            </div>
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Crisis Intervention Modal */}
      <CrisisIntervention
        isVisible={showCrisisIntervention}
        onClose={() => setShowCrisisIntervention(false)}
        riskLevel={riskLevel === 'critical' ? 'critical' : 'high'}
        crisisResources={crisisResources}
      />

      {/* Assessment Modal */}
      <AssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        assessmentType={assessmentType}
        onComplete={handleAssessmentComplete}
      />

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' 
                        ? 'text-blue-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                    {message.metadata?.riskLevel && message.metadata.riskLevel !== 'low' && (
                      <div className={`mt-2 text-xs px-2 py-1 rounded ${
                        message.metadata.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                        message.metadata.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        Risk Level: {message.metadata.riskLevel}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This conversation is confidential. In crisis situations, please contact emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

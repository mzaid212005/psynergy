'use client'

import { useState, useCallback, useRef } from 'react'
import { ChatMessage, AssessmentResult } from '@/types'
import toast from 'react-hot-toast'

interface UseChatOptions {
  initialMessages?: ChatMessage[]
  userLanguage?: string
  userId?: string
  onRiskDetected?: (level: 'low' | 'medium' | 'high' | 'critical') => void
  onAssessmentTriggered?: (type: string) => void
}

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastAssessment: AssessmentResult | null
}

export function useChat({
  initialMessages = [],
  userLanguage = 'en',
  userId = 'anonymous',
  onRiskDetected,
  onAssessmentTriggered
}: UseChatOptions = {}) {
  const [state, setState] = useState<ChatState>({
    messages: initialMessages,
    isLoading: false,
    error: null,
    riskLevel: 'low',
    lastAssessment: null
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    }

    const newMessages = [...state.messages, userMessage]
    
    setState(prev => ({
      ...prev,
      messages: newMessages,
      isLoading: true,
      error: null
    }))

    try {
      abortControllerRef.current = new AbortController()
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          userLanguage,
          userId
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, data.message],
        isLoading: false,
        riskLevel: data.riskAssessment?.level || 'low'
      }))

      // Handle risk detection
      if (data.riskAssessment?.level && onRiskDetected) {
        onRiskDetected(data.riskAssessment.level)
      }

      // Handle crisis situations
      if (data.requiresEscalation) {
        toast.error('Crisis detected - Please seek immediate help', {
          duration: 10000,
          icon: '🆘'
        })
      } else if (data.riskAssessment?.level === 'high') {
        toast('High stress detected - Consider professional support', {
          icon: '⚠️',
          duration: 6000
        })
      }

      // Check for assessment triggers
      const assessmentKeywords = ['assessment', 'questionnaire', 'phq', 'gad', 'depression', 'anxiety']
      if (assessmentKeywords.some(keyword => 
        data.message.content.toLowerCase().includes(keyword)
      )) {
        if (onAssessmentTriggered) {
          onAssessmentTriggered('PHQ9') // Default to depression assessment
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        return // Request was cancelled, don't show error
      }

      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again or contact campus counseling services if you need immediate support.',
        timestamp: new Date().toISOString(),
        metadata: { riskLevel: 'low' }
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error.message
      }))

      toast.error('Failed to send message. Please try again.')
    }
  }, [state.messages, state.isLoading, userLanguage, userId, onRiskDetected, onAssessmentTriggered])

  const addSystemMessage = useCallback((content: string, metadata?: any) => {
    const systemMessage: ChatMessage = {
      id: `system_${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      metadata: { riskLevel: 'low', ...metadata }
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, systemMessage]
    }))
  }, [])

  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: initialMessages,
      error: null,
      riskLevel: 'low'
    }))
  }, [initialMessages])

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = state.messages
      .filter(msg => msg.role === 'user')
      .pop()

    if (lastUserMessage) {
      // Remove the last assistant message if it was an error
      const messagesWithoutLastAssistant = state.messages.filter((msg, index) => {
        if (msg.role === 'assistant' && index === state.messages.length - 1) {
          return !msg.content.includes('trouble responding')
        }
        return true
      })

      setState(prev => ({
        ...prev,
        messages: messagesWithoutLastAssistant,
        error: null
      }))

      sendMessage(lastUserMessage.content)
    }
  }, [state.messages, sendMessage])

  const updateAssessmentResult = useCallback((result: AssessmentResult) => {
    setState(prev => ({
      ...prev,
      lastAssessment: result
    }))

    // Add assessment completion message
    const completionMessage = `Assessment completed! Your ${result.type} score is ${result.score} (${result.severity}). ${
      result.requiresProfessionalHelp 
        ? 'I recommend speaking with a mental health professional for additional support.' 
        : 'Continue taking care of your mental health with the suggested strategies.'
    }`

    addSystemMessage(completionMessage, {
      riskLevel: result.severity === 'severe' ? 'high' : 'medium',
      assessmentResult: result
    })
  }, [addSystemMessage])

  const triggerAssessment = useCallback((type: 'PHQ9' | 'GAD7' | 'STUDENT_STRESS') => {
    const assessmentMessages = {
      PHQ9: "I'd like to help you with a depression screening (PHQ-9). This brief questionnaire will help us understand how you've been feeling over the past 2 weeks. Would you like to proceed?",
      GAD7: "I'd like to help you with an anxiety screening (GAD-7). This questionnaire will help us understand any anxiety you may have experienced over the past 2 weeks. Would you like to proceed?",
      STUDENT_STRESS: "I'd like to help you assess your current stress levels with our student stress questionnaire. This will help us understand academic and college-related stressors. Would you like to proceed?"
    }

    addSystemMessage(assessmentMessages[type], {
      riskLevel: 'medium',
      assessmentTriggered: true,
      assessmentType: type
    })

    if (onAssessmentTriggered) {
      onAssessmentTriggered(type)
    }
  }, [addSystemMessage, onAssessmentTriggered])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    riskLevel: state.riskLevel,
    lastAssessment: state.lastAssessment,
    sendMessage,
    addSystemMessage,
    clearMessages,
    retryLastMessage,
    updateAssessmentResult,
    triggerAssessment
  }
}

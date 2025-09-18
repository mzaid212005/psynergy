'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'
import { AssessmentQuestion, AssessmentResult } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  assessmentType: 'PHQ9' | 'GAD7' | 'STUDENT_STRESS'
  onComplete: (result: AssessmentResult) => void
}

export function AssessmentModal({ 
  isOpen, 
  onClose, 
  assessmentType, 
  onComplete 
}: AssessmentModalProps) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchQuestions()
    }
  }, [isOpen, assessmentType])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/assessment?type=${assessmentType}`)
      if (!response.ok) throw new Error('Failed to fetch questions')
      
      const data = await response.json()
      setQuestions(data.questions)
      setResponses(new Array(data.questions.length).fill(-1))
      setCurrentQuestion(0)
      setShowResult(false)
      setResult(null)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponse = (value: number) => {
    const newResponses = [...responses]
    newResponses[currentQuestion] = value
    setResponses(newResponses)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitAssessment()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitAssessment = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: assessmentType,
          responses: responses,
          userId: 'current_user' // TODO: Get from auth context
        })
      })

      if (!response.ok) throw new Error('Failed to submit assessment')
      
      const data = await response.json()
      setResult(data.result)
      setShowResult(true)
      onComplete(data.result)
    } catch (error) {
      console.error('Error submitting assessment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAssessmentTitle = () => {
    switch (assessmentType) {
      case 'PHQ9':
        return 'Depression Assessment (PHQ-9)'
      case 'GAD7':
        return 'Anxiety Assessment (GAD-7)'
      case 'STUDENT_STRESS':
        return 'Student Stress Assessment'
      default:
        return 'Mental Health Assessment'
    }
  }

  const getAssessmentDescription = () => {
    switch (assessmentType) {
      case 'PHQ9':
        return 'This questionnaire helps assess symptoms of depression over the past 2 weeks.'
      case 'GAD7':
        return 'This questionnaire helps assess symptoms of anxiety over the past 2 weeks.'
      case 'STUDENT_STRESS':
        return 'This assessment helps evaluate stress levels related to academic and college life.'
      default:
        return 'This assessment will help us understand your current mental health status.'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minimal':
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'mild':
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'severe':
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl">{getAssessmentTitle()}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {getAssessmentDescription()}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
              </div>
            ) : showResult && result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result Summary */}
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity === 'minimal' || result.severity === 'low' ? (
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                    )}
                    Score: {result.score} - {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                  </div>
                </div>

                {/* Professional Help Alert */}
                {result.requiresProfessionalHelp && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <InformationCircleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-800 dark:text-orange-200">
                          Professional Support Recommended
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                          Based on your responses, we recommend speaking with a mental health professional. 
                          This doesn't mean anything is wrong with you - it's a positive step toward better wellbeing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={() => window.open('/appointments', '_blank')}
                    className="flex-1"
                    disabled={!result.requiresProfessionalHelp}
                  >
                    Book Counseling Session
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/resources', '_blank')}
                    className="flex-1"
                  >
                    View Resources
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </motion.div>
            ) : questions.length > 0 ? (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Question */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {questions[currentQuestion]?.text}
                  </h3>
                  
                  <div className="space-y-3">
                    {questions[currentQuestion]?.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleResponse(index)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          responses[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            responses[currentQuestion] === index
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {responses[currentQuestion] === index && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextQuestion}
                    disabled={responses[currentQuestion] === -1}
                  >
                    {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">No questions available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

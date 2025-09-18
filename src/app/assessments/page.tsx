'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ClipboardDocumentCheckIcon, HeartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const assessments = [
  {
    id: 'phq9',
    title: 'PHQ-9 Depression Assessment',
    description: 'A 9-question screening tool for depression symptoms over the past two weeks.',
    duration: '5-7 minutes',
    icon: HeartIcon,
    color: 'blue',
    questions: 9,
    type: 'Depression Screening'
  },
  {
    id: 'gad7',
    title: 'GAD-7 Anxiety Assessment',
    description: 'A 7-question tool to screen for generalized anxiety disorder symptoms.',
    duration: '3-5 minutes',
    icon: ExclamationTriangleIcon,
    color: 'yellow',
    questions: 7,
    type: 'Anxiety Screening'
  },
  {
    id: 'stress',
    title: 'Student Stress Assessment',
    description: 'Evaluate academic, social, and personal stress levels specific to college life.',
    duration: '8-10 minutes',
    icon: ClipboardDocumentCheckIcon,
    color: 'purple',
    questions: 15,
    type: 'Stress Evaluation'
  }
]

export default function AssessmentsPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          border: 'border-yellow-200 dark:border-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        }
      case 'purple':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/20',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800',
          button: 'bg-purple-600 hover:bg-purple-700'
        }
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/20',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700'
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mental Health Assessments
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Take scientifically validated assessments to better understand your mental health. 
            These tools help identify symptoms and guide you toward appropriate support.
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {assessments.map((assessment) => {
            const colors = getColorClasses(assessment.color)
            const IconComponent = assessment.icon

            return (
              <Card key={assessment.id} className={`hover:shadow-lg transition-all duration-300 ${colors.border}`}>
                <CardHeader>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg} mb-4`}>
                    <IconComponent className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <CardTitle className="text-xl">{assessment.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    {assessment.type} • {assessment.questions} questions • {assessment.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {assessment.description}
                  </p>
                  <Button 
                    className={`w-full text-white ${colors.button}`}
                    onClick={() => setSelectedAssessment(assessment.id)}
                  >
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Important Notice
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                These assessments are screening tools and not diagnostic instruments. Results should not replace 
                professional medical advice, diagnosis, or treatment. If you're experiencing severe symptoms or 
                thoughts of self-harm, please seek immediate professional help or contact emergency services.
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Resources */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Need immediate help? Contact our crisis support team 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/chat">Chat with AI Counselor</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/support">Crisis Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/appointments">Book Professional Session</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

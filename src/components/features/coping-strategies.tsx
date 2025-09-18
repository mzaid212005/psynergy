'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartIcon, 
  PlayIcon, 
  PauseIcon,
  ArrowPathIcon,
  SparklesIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CopingStrategy {
  id: string
  title: string
  description: string
  type: 'breathing' | 'mindfulness' | 'grounding' | 'relaxation'
  duration: number // in minutes
  steps: string[]
  icon: any
}

const COPING_STRATEGIES: CopingStrategy[] = [
  {
    id: 'box_breathing',
    title: '4-7-8 Breathing',
    description: 'A calming breathing technique to reduce anxiety and promote relaxation',
    type: 'breathing',
    duration: 5,
    icon: HeartIcon,
    steps: [
      'Sit comfortably with your back straight',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat this cycle 3-4 times'
    ]
  },
  {
    id: 'grounding_5_4_3_2_1',
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to ground yourself in the present moment',
    type: 'grounding',
    duration: 3,
    icon: SparklesIcon,
    steps: [
      'Name 5 things you can see around you',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Take a deep breath and notice how you feel'
    ]
  },
  {
    id: 'progressive_relaxation',
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and relax muscle groups to reduce physical tension',
    type: 'relaxation',
    duration: 10,
    icon: SunIcon,
    steps: [
      'Lie down or sit comfortably',
      'Start with your toes - tense for 5 seconds, then relax',
      'Move to your calves - tense and relax',
      'Continue with thighs, abdomen, hands, arms',
      'Tense your shoulders, then relax',
      'Finally, tense your face muscles, then relax',
      'Notice the difference between tension and relaxation'
    ]
  },
  {
    id: 'mindful_observation',
    title: 'Mindful Observation',
    description: 'Focus your attention on a single object to calm racing thoughts',
    type: 'mindfulness',
    duration: 5,
    icon: ArrowPathIcon,
    steps: [
      'Choose an object in your environment',
      'Look at it as if seeing it for the first time',
      'Notice its color, texture, shape, and size',
      'Observe how light reflects off its surface',
      'If your mind wanders, gently return focus to the object',
      'Continue for 3-5 minutes'
    ]
  }
]

interface CopingStrategiesProps {
  onStrategySelect?: (strategy: CopingStrategy) => void
  selectedType?: 'breathing' | 'mindfulness' | 'grounding' | 'relaxation' | 'all'
}

export function CopingStrategies({ 
  onStrategySelect, 
  selectedType = 'all' 
}: CopingStrategiesProps) {
  const [activeStrategy, setActiveStrategy] = useState<CopingStrategy | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const filteredStrategies = selectedType === 'all' 
    ? COPING_STRATEGIES 
    : COPING_STRATEGIES.filter(strategy => strategy.type === selectedType)

  const startStrategy = (strategy: CopingStrategy) => {
    setActiveStrategy(strategy)
    setCurrentStep(0)
    setIsActive(true)
    onStrategySelect?.(strategy)
  }

  const nextStep = () => {
    if (activeStrategy && currentStep < activeStrategy.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeStrategy()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeStrategy = () => {
    setIsActive(false)
    setActiveStrategy(null)
    setCurrentStep(0)
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breathing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'mindfulness':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'grounding':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'relaxation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  if (activeStrategy && isActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <activeStrategy.icon className="h-6 w-6 text-blue-600" />
                <span>{activeStrategy.title}</span>
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Step {currentStep + 1} of {activeStrategy.steps.length}
              </p>
            </div>
            <Button variant="ghost" onClick={completeStrategy}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / activeStrategy.steps.length) * 100}%` }}
            />
          </div>

          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center py-8"
          >
            <p className="text-lg text-gray-900 dark:text-white mb-6">
              {activeStrategy.steps[currentStep]}
            </p>
            
            {activeStrategy.type === 'breathing' && (
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center"
                >
                  <HeartIcon className="h-8 w-8 text-blue-600" />
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={nextStep}>
              {currentStep === activeStrategy.steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Coping Strategies
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Try these evidence-based techniques to manage stress and anxiety
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStrategies.map((strategy) => (
          <Card 
            key={strategy.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => startStrategy(strategy)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <strategy.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {strategy.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {strategy.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(strategy.type)}`}>
                      {strategy.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {strategy.duration} min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

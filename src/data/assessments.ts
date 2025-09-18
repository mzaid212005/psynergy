import { AssessmentQuestion } from '@/types'

// PHQ-9 Depression Assessment Questions
export const PHQ9_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'phq9_1',
    text: 'Little interest or pleasure in doing things',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_2', 
    text: 'Feeling down, depressed, or hopeless',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_3',
    text: 'Trouble falling or staying asleep, or sleeping too much',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_4',
    text: 'Feeling tired or having little energy',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_5',
    text: 'Poor appetite or overeating',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_6',
    text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_7',
    text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_8',
    text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'phq9_9',
    text: 'Thoughts that you would be better off dead, or of hurting yourself',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'depression',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  }
]

// GAD-7 Anxiety Assessment Questions
export const GAD7_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'gad7_1',
    text: 'Feeling nervous, anxious, or on edge',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'gad7_2',
    text: 'Not being able to stop or control worrying',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'gad7_3',
    text: 'Worrying too much about different things',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'gad7_4',
    text: 'Trouble relaxing',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'gad7_5',
    text: 'Being so restless that it is hard to sit still',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'gad7_6',
    text: 'Becoming easily annoyed or irritable',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  },
  {
    id: 'gad7_7',
    text: 'Feeling afraid, as if something awful might happen',
    type: 'scale',
    scaleMin: 0,
    scaleMax: 3,
    category: 'anxiety',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
  }
]

// Student-specific stress assessment
export const STUDENT_STRESS_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'stress_1',
    text: 'How often do you feel overwhelmed by academic workload?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    category: 'stress',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'stress_2',
    text: 'How often do you worry about your future career prospects?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    category: 'stress',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'stress_3',
    text: 'How often do you feel pressure from family expectations?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    category: 'stress',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'stress_4',
    text: 'How often do you have trouble sleeping due to stress?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    category: 'stress',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'stress_5',
    text: 'How often do you feel isolated or lonely?',
    type: 'scale',
    scaleMin: 1,
    scaleMax: 5,
    category: 'stress',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
]

// Assessment scoring and interpretation
export const ASSESSMENT_SCORING = {
  PHQ9: {
    minimal: { min: 0, max: 4, description: 'Minimal depression', color: 'green' },
    mild: { min: 5, max: 9, description: 'Mild depression', color: 'yellow' },
    moderate: { min: 10, max: 14, description: 'Moderate depression', color: 'orange' },
    severe: { min: 15, max: 27, description: 'Severe depression', color: 'red' }
  },
  GAD7: {
    minimal: { min: 0, max: 4, description: 'Minimal anxiety', color: 'green' },
    mild: { min: 5, max: 9, description: 'Mild anxiety', color: 'yellow' },
    moderate: { min: 10, max: 14, description: 'Moderate anxiety', color: 'orange' },
    severe: { min: 15, max: 21, description: 'Severe anxiety', color: 'red' }
  },
  STUDENT_STRESS: {
    low: { min: 5, max: 10, description: 'Low stress levels', color: 'green' },
    moderate: { min: 11, max: 15, description: 'Moderate stress levels', color: 'yellow' },
    high: { min: 16, max: 20, description: 'High stress levels', color: 'orange' },
    severe: { min: 21, max: 25, description: 'Severe stress levels', color: 'red' }
  }
}

// Recommendations based on assessment results
export const ASSESSMENT_RECOMMENDATIONS = {
  PHQ9: {
    minimal: [
      'Continue maintaining good mental health habits',
      'Practice regular self-care and stress management',
      'Stay connected with friends and family',
      'Consider mindfulness or meditation practices'
    ],
    mild: [
      'Monitor your mood and symptoms regularly',
      'Engage in regular physical activity',
      'Practice stress reduction techniques',
      'Consider talking to a counselor if symptoms persist',
      'Maintain a regular sleep schedule'
    ],
    moderate: [
      'Strongly consider professional counseling or therapy',
      'Discuss symptoms with a healthcare provider',
      'Implement structured daily routines',
      'Engage in regular exercise and social activities',
      'Consider joining a support group'
    ],
    severe: [
      'Seek immediate professional help from a mental health provider',
      'Contact your campus counseling center',
      'Consider medication evaluation with a psychiatrist',
      'Inform trusted friends or family about your situation',
      'Create a safety plan with professional guidance'
    ]
  },
  GAD7: {
    minimal: [
      'Continue current coping strategies',
      'Practice relaxation techniques regularly',
      'Maintain healthy lifestyle habits',
      'Stay socially connected'
    ],
    mild: [
      'Learn and practice anxiety management techniques',
      'Consider mindfulness or meditation',
      'Regular exercise can help reduce anxiety',
      'Talk to someone you trust about your worries'
    ],
    moderate: [
      'Consider professional counseling for anxiety management',
      'Learn cognitive-behavioral techniques',
      'Practice deep breathing and progressive muscle relaxation',
      'Limit caffeine and alcohol consumption'
    ],
    severe: [
      'Seek professional help immediately',
      'Contact campus counseling services',
      'Consider medication evaluation',
      'Develop coping strategies with a therapist',
      'Build a strong support network'
    ]
  }
}

export function getAssessmentQuestions(type: 'PHQ9' | 'GAD7' | 'STUDENT_STRESS') {
  switch (type) {
    case 'PHQ9':
      return PHQ9_QUESTIONS
    case 'GAD7':
      return GAD7_QUESTIONS
    case 'STUDENT_STRESS':
      return STUDENT_STRESS_QUESTIONS
    default:
      return []
  }
}

export function calculateAssessmentScore(
  type: 'PHQ9' | 'GAD7' | 'STUDENT_STRESS',
  responses: number[]
) {
  const total = responses.reduce((sum, response) => sum + response, 0)
  const scoring = ASSESSMENT_SCORING[type]
  
  let severity: string = 'minimal'
  for (const [key, range] of Object.entries(scoring)) {
    if (total >= range.min && total <= range.max) {
      severity = key
      break
    }
  }
  
  return {
    score: total,
    severity,
    description: scoring[severity as keyof typeof scoring].description,
    color: scoring[severity as keyof typeof scoring].color,
    recommendations: ASSESSMENT_RECOMMENDATIONS[type]?.[severity as keyof typeof ASSESSMENT_RECOMMENDATIONS[typeof type]] || []
  }
}

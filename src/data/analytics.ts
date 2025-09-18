import { AnalyticsData, Alert } from '@/types'

// Mock analytics data for demonstration
export const analyticsData: AnalyticsData = {
  totalUsers: 2847,
  activeUsers: 1523,
  assessmentsCompleted: 892,
  appointmentsScheduled: 456,
  resourcesAccessed: 3421,
  forumPosts: 234,
  riskAlerts: 12,
  trends: [
    {
      period: '2024-01',
      metric: 'active_users',
      value: 1523,
      change: 12.5
    },
    {
      period: '2024-01',
      metric: 'assessments',
      value: 892,
      change: 8.3
    },
    {
      period: '2024-01',
      metric: 'appointments',
      value: 456,
      change: 15.7
    },
    {
      period: '2024-01',
      metric: 'crisis_alerts',
      value: 12,
      change: -23.1
    }
  ]
}

// Mental health trends and insights
export const mentalHealthTrends = {
  assessmentResults: {
    depression: {
      minimal: 45,
      mild: 32,
      moderate: 18,
      severe: 5
    },
    anxiety: {
      minimal: 38,
      mild: 35,
      moderate: 22,
      severe: 5
    },
    stress: {
      low: 25,
      moderate: 45,
      high: 25,
      critical: 5
    }
  },
  riskFactors: [
    { factor: 'Academic Pressure', percentage: 78, trend: 'increasing' },
    { factor: 'Family Expectations', percentage: 65, trend: 'stable' },
    { factor: 'Financial Stress', percentage: 42, trend: 'increasing' },
    { factor: 'Social Isolation', percentage: 38, trend: 'decreasing' },
    { factor: 'Career Uncertainty', percentage: 55, trend: 'increasing' },
    { factor: 'Relationship Issues', percentage: 28, trend: 'stable' }
  ],
  interventionSuccess: {
    aiChatbot: { sessions: 1247, satisfaction: 4.2, effectiveness: 78 },
    counseling: { sessions: 456, satisfaction: 4.7, effectiveness: 89 },
    peerSupport: { interactions: 892, satisfaction: 4.1, effectiveness: 72 },
    resources: { accessed: 3421, completion: 65, helpfulness: 4.3 }
  }
}

// Usage patterns and demographics
export const usagePatterns = {
  timeOfDay: [
    { hour: 0, usage: 5 }, { hour: 1, usage: 3 }, { hour: 2, usage: 2 },
    { hour: 3, usage: 1 }, { hour: 4, usage: 1 }, { hour: 5, usage: 2 },
    { hour: 6, usage: 8 }, { hour: 7, usage: 15 }, { hour: 8, usage: 25 },
    { hour: 9, usage: 35 }, { hour: 10, usage: 45 }, { hour: 11, usage: 52 },
    { hour: 12, usage: 48 }, { hour: 13, usage: 42 }, { hour: 14, usage: 55 },
    { hour: 15, usage: 62 }, { hour: 16, usage: 58 }, { hour: 17, usage: 65 },
    { hour: 18, usage: 72 }, { hour: 19, usage: 68 }, { hour: 20, usage: 75 },
    { hour: 21, usage: 82 }, { hour: 22, usage: 78 }, { hour: 23, usage: 45 }
  ],
  dayOfWeek: [
    { day: 'Monday', usage: 85, stress: 'high' },
    { day: 'Tuesday', usage: 78, stress: 'high' },
    { day: 'Wednesday', usage: 72, stress: 'medium' },
    { day: 'Thursday', usage: 68, stress: 'medium' },
    { day: 'Friday', usage: 55, stress: 'low' },
    { day: 'Saturday', usage: 35, stress: 'low' },
    { day: 'Sunday', usage: 45, stress: 'medium' }
  ],
  demographics: {
    yearOfStudy: [
      { year: '1st Year', count: 892, percentage: 31.3 },
      { year: '2nd Year', count: 756, percentage: 26.6 },
      { year: '3rd Year', count: 623, percentage: 21.9 },
      { year: '4th Year', count: 576, percentage: 20.2 }
    ],
    gender: [
      { gender: 'Female', count: 1523, percentage: 53.5 },
      { gender: 'Male', count: 1198, percentage: 42.1 },
      { gender: 'Non-binary', count: 89, percentage: 3.1 },
      { gender: 'Prefer not to say', count: 37, percentage: 1.3 }
    ],
    language: [
      { language: 'English', count: 2145, percentage: 75.4 },
      { language: 'Hindi', count: 456, percentage: 16.0 },
      { language: 'Kannada', count: 123, percentage: 4.3 },
      { language: 'Tamil', count: 89, percentage: 3.1 },
      { language: 'Telugu', count: 34, percentage: 1.2 }
    ]
  }
}

// System alerts and notifications
export const systemAlerts: Alert[] = [
  {
    id: 'alert_1',
    type: 'high_risk_user',
    severity: 'critical',
    message: 'Student showing severe depression symptoms - immediate intervention recommended',
    userId: 'user_789',
    isRead: false,
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'alert_2',
    type: 'system_issue',
    severity: 'medium',
    message: 'AI chatbot response time increased by 15% - investigating performance issues',
    isRead: false,
    createdAt: '2024-01-20T12:15:00Z'
  },
  {
    id: 'alert_3',
    type: 'content_moderation',
    severity: 'high',
    message: 'Forum post flagged for crisis content - requires immediate review',
    userId: 'user_456',
    isRead: false,
    createdAt: '2024-01-20T11:45:00Z'
  },
  {
    id: 'alert_4',
    type: 'appointment_reminder',
    severity: 'low',
    message: '15 students have upcoming appointments today - reminder notifications sent',
    isRead: true,
    createdAt: '2024-01-20T09:00:00Z'
  },
  {
    id: 'alert_5',
    type: 'high_risk_user',
    severity: 'high',
    message: 'Increased anxiety levels detected in 23 students this week',
    isRead: true,
    createdAt: '2024-01-19T16:20:00Z'
  }
]

// Performance metrics
export const performanceMetrics = {
  systemHealth: {
    uptime: 99.8,
    responseTime: 245, // milliseconds
    errorRate: 0.12,
    activeConnections: 1523
  },
  userEngagement: {
    dailyActiveUsers: 892,
    averageSessionDuration: 18.5, // minutes
    bounceRate: 12.3,
    returnUserRate: 67.8
  },
  interventionMetrics: {
    crisisInterventions: 12,
    successfulReferrals: 89,
    followUpCompliance: 78.5,
    emergencyContacts: 3
  }
}

// Predictive analytics and risk assessment
export const predictiveAnalytics = {
  riskPrediction: {
    highRiskStudents: 45,
    mediumRiskStudents: 123,
    lowRiskStudents: 2679,
    riskFactorWeights: {
      assessmentScores: 0.35,
      chatbotInteractions: 0.25,
      forumActivity: 0.15,
      appointmentHistory: 0.15,
      resourceUsage: 0.10
    }
  },
  trendForecasting: {
    expectedGrowth: {
      nextMonth: { users: 15.2, usage: 12.8 },
      nextQuarter: { users: 45.6, usage: 38.4 },
      nextYear: { users: 180.3, usage: 156.7 }
    },
    seasonalPatterns: {
      examPeriods: { stressIncrease: 45, usageSpike: 78 },
      holidays: { usageDecrease: 35, wellnessIncrease: 23 },
      semesterStart: { anxietyIncrease: 32, newUserSpike: 89 }
    }
  }
}

// Resource utilization and effectiveness
export const resourceEffectiveness = {
  mostAccessedResources: [
    { id: 'depression_understanding', title: 'Understanding Depression', views: 1247, rating: 4.6 },
    { id: 'anxiety_management', title: 'Managing Anxiety', views: 1089, rating: 4.5 },
    { id: 'stress_management_guide', title: 'Academic Stress Management', views: 892, rating: 4.7 },
    { id: 'mindfulness_meditation', title: 'Mindfulness and Meditation', views: 756, rating: 4.4 }
  ],
  completionRates: {
    articles: 78.5,
    videos: 65.2,
    exercises: 82.1,
    assessments: 91.3
  },
  userFeedback: {
    helpfulness: 4.3,
    clarity: 4.1,
    relevance: 4.5,
    accessibility: 4.2
  }
}

// College-specific insights
export const collegeInsights = {
  departmentBreakdown: [
    { department: 'Engineering', students: 1247, riskLevel: 'medium', avgStress: 6.8 },
    { department: 'Medicine', students: 456, riskLevel: 'high', avgStress: 7.5 },
    { department: 'Arts & Sciences', students: 623, riskLevel: 'low', avgStress: 5.2 },
    { department: 'Commerce', students: 521, riskLevel: 'medium', avgStress: 6.1 }
  ],
  campusEvents: [
    { event: 'Mental Health Awareness Week', impact: 'positive', participation: 78 },
    { event: 'Exam Period', impact: 'negative', stressIncrease: 45 },
    { event: 'Counselor Training Workshop', impact: 'positive', effectiveness: 89 },
    { event: 'Peer Support Launch', impact: 'positive', engagement: 67 }
  ],
  interventionSuccess: {
    earlyIntervention: 89.2,
    crisisResponse: 94.7,
    followUpCompliance: 78.5,
    studentSatisfaction: 4.4
  }
}

// Helper functions for analytics
export function calculateTrendPercentage(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 20) return 'critical'
  if (score >= 15) return 'high'
  if (score >= 10) return 'medium'
  return 'low'
}

export function getAlertsByType(type: string): Alert[] {
  return systemAlerts.filter(alert => alert.type === type)
}

export function getUnreadAlerts(): Alert[] {
  return systemAlerts.filter(alert => !alert.isRead)
}

export function getCriticalAlerts(): Alert[] {
  return systemAlerts.filter(alert => alert.severity === 'critical' && !alert.isRead)
}

export function generateWeeklyReport() {
  return {
    summary: {
      totalUsers: analyticsData.totalUsers,
      activeUsers: analyticsData.activeUsers,
      newAlerts: getUnreadAlerts().length,
      criticalIssues: getCriticalAlerts().length
    },
    trends: analyticsData.trends,
    topConcerns: mentalHealthTrends.riskFactors.slice(0, 3),
    interventions: performanceMetrics.interventionMetrics,
    recommendations: [
      'Increase counselor availability during peak hours (6-10 PM)',
      'Develop targeted resources for academic pressure management',
      'Enhance crisis detection algorithms based on recent patterns',
      'Expand peer support program to handle growing demand'
    ]
  }
}

export function generateMonthlyReport() {
  return {
    executiveSummary: {
      userGrowth: 15.2,
      engagementIncrease: 12.8,
      crisisInterventions: 12,
      successRate: 89.2
    },
    detailedMetrics: {
      demographics: usagePatterns.demographics,
      mentalHealth: mentalHealthTrends,
      systemPerformance: performanceMetrics,
      resourceEffectiveness
    },
    insights: collegeInsights,
    actionItems: [
      'Implement predictive analytics for early intervention',
      'Expand multilingual support based on user demographics',
      'Develop department-specific mental health programs',
      'Enhance crisis response protocols'
    ]
  }
}

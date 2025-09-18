// User and Authentication Types
export interface User {
  id: string
  email: string
  fullName: string
  collegeName: string
  usn: string
  yearOfStudy: string
  preferredLanguage: string
  phoneNumber?: string
  gender?: string
  pronouns?: string
  role: 'student' | 'counselor' | 'admin' | 'doctor' | 'institute'
  isVerified: boolean
  createdAt: string
  updatedAt: string
  dateOfBirth?: string
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  medicalHistory?: string[]
  specialization?: string // For doctors
  experience?: string // For doctors
  qualification?: string // For doctors
  instituteName?: string // For institute admins
}

export interface College {
  id: string
  name: string
  location: string
  type: 'engineering' | 'medical' | 'arts' | 'commerce' | 'other'
  isActive: boolean
}

// Registration Form Types
export interface RegistrationFormData {
  fullName: string
  collegeName: string
  usn: string
  yearOfStudy: string
  email: string
  phoneNumber?: string
  preferredLanguage: string
  password: string
  confirmPassword: string
  gender?: string
  pronouns?: string
  agreeToTerms: boolean
}

// Language Support
export interface Language {
  code: string
  name: string
  nativeName: string
  isActive: boolean
}

// Mental Health Assessment Types
export interface AssessmentQuestion {
  id: string
  text: string
  type: 'scale' | 'multiple_choice' | 'yes_no'
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  category: 'depression' | 'anxiety' | 'stress' | 'general'
}

export interface AssessmentResponse {
  questionId: string
  value: number | string
}

export interface AssessmentResult {
  id: string
  userId: string
  type: 'PHQ9' | 'GAD7' | 'STUDENT_STRESS' | 'custom'
  score: number
  maxScore: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
  interpretation: string
  recommendations: string[]
  requiresProfessionalHelp: boolean
  completedAt: string
  createdAt: string
}

// Counseling and Appointments
export interface Counselor {
  id: string
  name: string
  specializations: string[]
  languages: string[]
  availability: TimeSlot[]
  rating: number
  experience: number
  isAvailable: boolean
  location: string
  availableSlotsCount?: number
  nextAvailableSlot?: string | null
  title?: string
  qualifications?: string[]
  yearsOfExperience?: number
  bio?: string
  profilePictureUrl?: string
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isBooked: boolean
  date: string
}

export interface Appointment {
  id: string
  userId: string
  counselorId: string
  timeSlot: TimeSlot
  type: 'individual' | 'group' | 'emergency'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  isAnonymous: boolean
  reason?: string
  notes: string
  reminderPreference?: number
  createdAt: string
  updatedAt?: string
}

// Resources and Content
export interface Resource {
  id: string
  title: string
  description: string
  content: string
  type: 'article' | 'video' | 'audio' | 'exercise' | 'guide'
  category: string
  tags: string[]
  language: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// Peer Support and Community
export interface ForumPost {
  id: string
  userId: string
  title: string
  content: string
  category: string
  isAnonymous: boolean
  tags: string[]
  upvotes: number
  downvotes: number
  replies: ForumReply[]
  isModerated: boolean
  createdAt: string
  updatedAt: string
}

export interface ForumReply {
  id: string
  postId: string
  userId: string
  content: string
  isAnonymous: boolean
  upvotes: number
  downvotes: number
  createdAt: string
}

// Analytics and Admin Dashboard Types
export interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  assessmentsCompleted: number
  appointmentsScheduled: number
  resourcesAccessed: number
  forumPosts: number
  riskAlerts: number
  trends: TrendData[]
}

export interface TrendData {
  period: string
  metric: string
  value: number
  change: number
}

export interface Alert {
  id: string
  type: 'high_risk_user' | 'system_issue' | 'content_moderation' | 'appointment_reminder'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  userId?: string
  isRead: boolean
  createdAt: string
}

export interface DashboardMetrics {
  userEngagement: {
    dailyActiveUsers: number
    averageSessionDuration: number
    bounceRate: number
    returnUserRate: number
  }
  systemHealth: {
    uptime: number
    responseTime: number
    errorRate: number
    activeConnections: number
  }
  interventionMetrics: {
    crisisInterventions: number
    successfulReferrals: number
    followUpCompliance: number
    emergencyContacts: number
  }
}

// AI Chatbot Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    riskLevel?: 'low' | 'medium' | 'high' | 'critical'
    suggestedActions?: string[]
    assessmentTriggered?: boolean
  }
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  status: 'active' | 'ended' | 'escalated'
  riskAssessment?: {
    level: 'low' | 'medium' | 'high' | 'critical'
    factors: string[]
    recommendedActions: string[]
  }
  createdAt: string
  updatedAt: string
}

// Analytics and Admin Types
export interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  assessmentsCompleted: number
  appointmentsScheduled: number
  resourcesAccessed: number
  forumPosts: number
  riskAlerts: number
  trends: {
    period: string
    metric: string
    value: number
    change: number
  }[]
}

export interface Alert {
  id: string
  type: 'high_risk_user' | 'system_issue' | 'content_moderation' | 'appointment_reminder'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  userId?: string
  isRead: boolean
  createdAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

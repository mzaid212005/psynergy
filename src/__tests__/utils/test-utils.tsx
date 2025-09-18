import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Custom matchers for testing
export const expectToBeAccessible = async (container: HTMLElement) => {
  // Check for basic accessibility requirements
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const images = container.querySelectorAll('img')
  const buttons = container.querySelectorAll('button')
  const links = container.querySelectorAll('a')
  const inputs = container.querySelectorAll('input, textarea, select')

  // Check images have alt text
  images.forEach(img => {
    expect(img).toHaveAttribute('alt')
  })

  // Check buttons have accessible names
  buttons.forEach(button => {
    const hasText = button.textContent?.trim()
    const hasAriaLabel = button.getAttribute('aria-label')
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby')
    
    expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBeTruthy()
  })

  // Check links have accessible names
  links.forEach(link => {
    const hasText = link.textContent?.trim()
    const hasAriaLabel = link.getAttribute('aria-label')
    const hasAriaLabelledBy = link.getAttribute('aria-labelledby')
    
    expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBeTruthy()
  })

  // Check form inputs have labels
  inputs.forEach(input => {
    const hasLabel = container.querySelector(`label[for="${input.id}"]`)
    const hasAriaLabel = input.getAttribute('aria-label')
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby')
    const hasPlaceholder = input.getAttribute('placeholder')
    
    expect(hasLabel || hasAriaLabel || hasAriaLabelledBy || hasPlaceholder).toBeTruthy()
  })
}

// Mock data generators
export const mockUser = {
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  usn: '1AB21CS001',
  college: 'Test Engineering College',
  yearOfStudy: '2nd Year',
  gender: 'Male',
  language: 'en',
  theme: 'light'
}

export const mockAssessmentResult = {
  score: 8,
  severity: 'mild' as const,
  recommendations: [
    'Consider speaking with a counselor',
    'Practice stress management techniques',
    'Maintain regular sleep schedule'
  ]
}

export const mockChatMessage = {
  id: 'msg-1',
  role: 'user' as const,
  content: 'I am feeling stressed about exams',
  timestamp: new Date().toISOString()
}

export const mockAIResponse = {
  message: 'I understand you\'re feeling stressed about exams. Here are some strategies...',
  riskLevel: 'low' as const
}

export const mockAppointment = {
  id: 'apt-1',
  counselorId: 'counselor-1',
  date: '2024-02-15',
  time: '10:00',
  type: 'individual' as const,
  isAnonymous: false,
  status: 'scheduled' as const,
  notes: 'First session'
}

export const mockCounselor = {
  id: 'counselor-1',
  name: 'Dr. Sarah Johnson',
  specializations: ['Depression', 'Anxiety', 'Academic Stress'],
  languages: ['English', 'Hindi'],
  rating: 4.8,
  experience: 8,
  isAvailable: true,
  nextAvailable: '2024-02-15T10:00:00Z'
}

export const mockResource = {
  id: 'resource-1',
  title: 'Understanding Depression',
  description: 'A comprehensive guide to understanding and managing depression',
  category: 'Mental Health',
  type: 'article' as const,
  difficulty: 'beginner' as const,
  duration: 15,
  tags: ['depression', 'mental health', 'self-help'],
  content: 'This is the content of the resource...',
  rating: 4.6,
  views: 1247
}

export const mockForumPost = {
  id: 'post-1',
  userId: 'user-1',
  title: 'Dealing with exam anxiety',
  content: 'I need advice on managing exam stress...',
  category: 'Academic Stress',
  isAnonymous: false,
  tags: ['exam anxiety', 'stress', 'coping'],
  upvotes: 15,
  downvotes: 1,
  replies: [],
  isModerated: true,
  createdAt: '2024-01-20T10:30:00Z',
  updatedAt: '2024-01-20T10:30:00Z'
}

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response))
  })
}

export const mockFetchError = (error: string) => {
  global.fetch = jest.fn().mockRejectedValue(new Error(error))
}

// Accessibility testing helpers
export const checkColorContrast = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element)
  const backgroundColor = styles.backgroundColor
  const color = styles.color
  
  // Basic check - in a real implementation, you'd use a proper contrast ratio calculator
  expect(backgroundColor).not.toBe(color)
}

export const checkFocusManagement = async (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  expect(focusableElements.length).toBeGreaterThan(0)
  
  // Check that elements can receive focus
  for (const element of Array.from(focusableElements)) {
    if (element instanceof HTMLElement) {
      element.focus()
      expect(document.activeElement).toBe(element)
    }
  }
}

// Performance testing helpers
export const measureRenderTime = (renderFn: () => void) => {
  const start = performance.now()
  renderFn()
  const end = performance.now()
  return end - start
}

// Error boundary for testing
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong.</div>
    }

    return this.props.children
  }
}

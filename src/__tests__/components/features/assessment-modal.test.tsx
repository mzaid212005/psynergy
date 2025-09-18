import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AssessmentModal } from '@/components/features/assessment-modal'

// Mock the assessments data
jest.mock('@/data/assessments', () => ({
  getAssessmentQuestions: jest.fn(() => [
    {
      id: 'q1',
      text: 'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'q2',
      text: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    }
  ]),
  calculateAssessmentScore: jest.fn(() => ({
    score: 5,
    severity: 'mild',
    recommendations: ['Consider speaking with a counselor', 'Practice stress management techniques']
  }))
}))

describe('AssessmentModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onComplete: jest.fn(),
    assessmentType: 'phq9' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('renders assessment modal when open', () => {
    render(<AssessmentModal {...defaultProps} />)
    
    expect(screen.getByText('PHQ-9 Depression Assessment')).toBeInTheDocument()
    expect(screen.getByText(/Over the last 2 weeks.*little interest/)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<AssessmentModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('PHQ-9 Depression Assessment')).not.toBeInTheDocument()
  })

  it('displays correct title for different assessment types', () => {
    const { rerender } = render(<AssessmentModal {...defaultProps} assessmentType="gad7" />)
    expect(screen.getByText('GAD-7 Anxiety Assessment')).toBeInTheDocument()

    rerender(<AssessmentModal {...defaultProps} assessmentType="stress" />)
    expect(screen.getByText('Student Stress Assessment')).toBeInTheDocument()
  })

  it('allows user to select answers', () => {
    render(<AssessmentModal {...defaultProps} />)
    
    const firstOption = screen.getByLabelText('Not at all')
    fireEvent.click(firstOption)
    
    expect(firstOption).toBeChecked()
  })

  it('enables next button after answering current question', () => {
    render(<AssessmentModal {...defaultProps} />)
    
    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
    
    const firstOption = screen.getByLabelText('Not at all')
    fireEvent.click(firstOption)
    
    expect(nextButton).not.toBeDisabled()
  })

  it('progresses through questions', () => {
    render(<AssessmentModal {...defaultProps} />)
    
    // Answer first question
    fireEvent.click(screen.getByLabelText('Not at all'))
    fireEvent.click(screen.getByText('Next'))
    
    // Should show second question
    expect(screen.getByText(/feeling down, depressed, or hopeless/)).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    render(<AssessmentModal {...defaultProps} />)
    
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    
    // Answer first question and go to next
    fireEvent.click(screen.getByLabelText('Not at all'))
    fireEvent.click(screen.getByText('Next'))
    
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  })

  it('allows going back to previous questions', () => {
    render(<AssessmentModal {...defaultProps} />)
    
    // Answer first question and go to next
    fireEvent.click(screen.getByLabelText('Not at all'))
    fireEvent.click(screen.getByText('Next'))
    
    // Go back
    fireEvent.click(screen.getByText('Previous'))
    
    expect(screen.getByText(/little interest or pleasure/)).toBeInTheDocument()
  })

  it('submits assessment and shows results', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        score: 5,
        severity: 'mild',
        recommendations: ['Consider speaking with a counselor']
      })
    })

    render(<AssessmentModal {...defaultProps} />)
    
    // Answer all questions
    fireEvent.click(screen.getByLabelText('Not at all'))
    fireEvent.click(screen.getByText('Next'))
    
    fireEvent.click(screen.getByLabelText('Several days'))
    fireEvent.click(screen.getByText('Submit Assessment'))
    
    await waitFor(() => {
      expect(screen.getByText('Assessment Results')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Mild Depression')).toBeInTheDocument()
    expect(screen.getByText('Score: 5/27')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockRejectedValueOnce(new Error('API Error'))

    render(<AssessmentModal {...defaultProps} />)
    
    // Answer all questions
    fireEvent.click(screen.getByLabelText('Not at all'))
    fireEvent.click(screen.getByText('Next'))
    
    fireEvent.click(screen.getByLabelText('Several days'))
    fireEvent.click(screen.getByText('Submit Assessment'))
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to submit assessment/)).toBeInTheDocument()
    })
  })

  it('calls onComplete when assessment is finished', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        score: 5,
        severity: 'mild',
        recommendations: ['Consider speaking with a counselor']
      })
    })

    render(<AssessmentModal {...defaultProps} />)
    
    // Complete assessment
    fireEvent.click(screen.getByLabelText('Not at all'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByLabelText('Several days'))
    fireEvent.click(screen.getByText('Submit Assessment'))
    
    await waitFor(() => {
      expect(screen.getByText('Done')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Done'))
    expect(defaultProps.onComplete).toHaveBeenCalledWith({
      score: 5,
      severity: 'mild',
      recommendations: ['Consider speaking with a counselor']
    })
  })

  it('calls onClose when modal is closed', () => {
    render(<AssessmentModal {...defaultProps} />)
    
    fireEvent.click(screen.getByLabelText('Close'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<AssessmentModal {...defaultProps} />)
    
    // Answer all questions
    fireEvent.click(screen.getByLabelText('Not at all'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByLabelText('Several days'))
    fireEvent.click(screen.getByText('Submit Assessment'))
    
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
  })

  it('displays recommendations in results', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        score: 15,
        severity: 'moderate',
        recommendations: [
          'Consider speaking with a counselor',
          'Practice stress management techniques',
          'Maintain regular sleep schedule'
        ]
      })
    })

    render(<AssessmentModal {...defaultProps} />)
    
    // Complete assessment
    fireEvent.click(screen.getByLabelText('Nearly every day'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByLabelText('More than half the days'))
    fireEvent.click(screen.getByText('Submit Assessment'))
    
    await waitFor(() => {
      expect(screen.getByText('Consider speaking with a counselor')).toBeInTheDocument()
      expect(screen.getByText('Practice stress management techniques')).toBeInTheDocument()
      expect(screen.getByText('Maintain regular sleep schedule')).toBeInTheDocument()
    })
  })

  it('shows appropriate severity colors', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        score: 20,
        severity: 'severe',
        recommendations: ['Seek immediate professional help']
      })
    })

    render(<AssessmentModal {...defaultProps} />)
    
    // Complete assessment
    fireEvent.click(screen.getByLabelText('Nearly every day'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByLabelText('Nearly every day'))
    fireEvent.click(screen.getByText('Submit Assessment'))
    
    await waitFor(() => {
      const severityElement = screen.getByText('Severe Depression')
      expect(severityElement).toHaveClass('text-red-800')
    })
  })
})

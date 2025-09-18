import { GET, POST } from '@/app/api/assessment/route'
import { NextRequest } from 'next/server'

// Mock the assessments module
jest.mock('@/data/assessments', () => ({
  getAssessmentQuestions: jest.fn(),
  calculateAssessmentScore: jest.fn()
}))

describe('/api/assessment', () => {
  const mockGetAssessmentQuestions = require('@/data/assessments').getAssessmentQuestions
  const mockCalculateAssessmentScore = require('@/data/assessments').calculateAssessmentScore

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/assessment', () => {
    it('returns PHQ-9 questions', async () => {
      const mockQuestions = [
        {
          id: 'q1',
          text: 'Little interest or pleasure in doing things',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' }
          ]
        }
      ]

      mockGetAssessmentQuestions.mockReturnValue(mockQuestions)

      const request = new NextRequest('http://localhost:3000/api/assessment?type=phq9')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('questions', mockQuestions)
      expect(data).toHaveProperty('type', 'phq9')
      expect(mockGetAssessmentQuestions).toHaveBeenCalledWith('phq9')
    })

    it('returns GAD-7 questions', async () => {
      const mockQuestions = [
        {
          id: 'q1',
          text: 'Feeling nervous, anxious, or on edge',
          options: [
            { value: 0, label: 'Not at all' },
            { value: 1, label: 'Several days' }
          ]
        }
      ]

      mockGetAssessmentQuestions.mockReturnValue(mockQuestions)

      const request = new NextRequest('http://localhost:3000/api/assessment?type=gad7')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('questions', mockQuestions)
      expect(data).toHaveProperty('type', 'gad7')
      expect(mockGetAssessmentQuestions).toHaveBeenCalledWith('gad7')
    })

    it('defaults to PHQ-9 when no type specified', async () => {
      const mockQuestions = []
      mockGetAssessmentQuestions.mockReturnValue(mockQuestions)

      const request = new NextRequest('http://localhost:3000/api/assessment')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('type', 'phq9')
      expect(mockGetAssessmentQuestions).toHaveBeenCalledWith('phq9')
    })

    it('handles invalid assessment type', async () => {
      mockGetAssessmentQuestions.mockReturnValue([])

      const request = new NextRequest('http://localhost:3000/api/assessment?type=invalid')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('type', 'invalid')
      expect(mockGetAssessmentQuestions).toHaveBeenCalledWith('invalid')
    })
  })

  describe('POST /api/assessment', () => {
    it('calculates assessment score successfully', async () => {
      const mockResult = {
        score: 8,
        severity: 'mild',
        recommendations: [
          'Consider speaking with a counselor',
          'Practice stress management techniques'
        ]
      }

      mockCalculateAssessmentScore.mockReturnValue(mockResult)

      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: JSON.stringify({
          type: 'phq9',
          responses: [
            { questionId: 'q1', value: 1 },
            { questionId: 'q2', value: 2 }
          ]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult)
      expect(mockCalculateAssessmentScore).toHaveBeenCalledWith('phq9', [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: 2 }
      ])
    })

    it('returns 400 for missing type', async () => {
      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: JSON.stringify({
          responses: [
            { questionId: 'q1', value: 1 }
          ]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Assessment type and responses are required')
    })

    it('returns 400 for missing responses', async () => {
      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: JSON.stringify({
          type: 'phq9'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Assessment type and responses are required')
    })

    it('returns 400 for empty responses array', async () => {
      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: JSON.stringify({
          type: 'phq9',
          responses: []
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Assessment type and responses are required')
    })

    it('handles calculation errors', async () => {
      mockCalculateAssessmentScore.mockImplementation(() => {
        throw new Error('Calculation error')
      })

      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: JSON.stringify({
          type: 'phq9',
          responses: [
            { questionId: 'q1', value: 1 }
          ]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error', 'Failed to calculate assessment score')
    })

    it('handles malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error', 'Failed to calculate assessment score')
    })

    it('handles different assessment types', async () => {
      const mockResult = {
        score: 12,
        severity: 'moderate',
        recommendations: ['Consider anxiety management techniques']
      }

      mockCalculateAssessmentScore.mockReturnValue(mockResult)

      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: JSON.stringify({
          type: 'gad7',
          responses: [
            { questionId: 'q1', value: 2 },
            { questionId: 'q2', value: 1 }
          ]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockResult)
      expect(mockCalculateAssessmentScore).toHaveBeenCalledWith('gad7', [
        { questionId: 'q1', value: 2 },
        { questionId: 'q2', value: 1 }
      ])
    })

    it('validates response format', async () => {
      const mockResult = {
        score: 5,
        severity: 'mild',
        recommendations: ['Practice relaxation techniques']
      }

      mockCalculateAssessmentScore.mockReturnValue(mockResult)

      const request = new NextRequest('http://localhost:3000/api/assessment', {
        method: 'POST',
        body: JSON.stringify({
          type: 'stress',
          responses: [
            { questionId: 'q1', value: 1 },
            { questionId: 'q2', value: 2 },
            { questionId: 'q3', value: 0 }
          ]
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      
      expect(response.status).toBe(200)
      expect(mockCalculateAssessmentScore).toHaveBeenCalledWith('stress', [
        { questionId: 'q1', value: 1 },
        { questionId: 'q2', value: 2 },
        { questionId: 'q3', value: 0 }
      ])
    })
  })
})

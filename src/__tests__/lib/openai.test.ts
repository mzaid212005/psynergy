import { generateAIResponse, assessRiskLevel, getCrisisResources } from '@/lib/openai'

// Mock OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}))

describe('OpenAI Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock fetch for crisis resources
    global.fetch = jest.fn()
  })

  describe('assessRiskLevel', () => {
    it('detects high risk keywords', () => {
      const highRiskMessages = [
        'I want to kill myself',
        'I am thinking about suicide',
        'I want to end it all',
        'I am going to hurt myself',
        'Life is not worth living'
      ]

      highRiskMessages.forEach(message => {
        expect(assessRiskLevel(message)).toBe('high')
      })
    })

    it('detects medium risk keywords', () => {
      const mediumRiskMessages = [
        'I feel hopeless',
        'I am very depressed',
        'I have severe anxiety',
        'I feel worthless',
        'I cannot cope anymore'
      ]

      mediumRiskMessages.forEach(message => {
        expect(assessRiskLevel(message)).toBe('medium')
      })
    })

    it('detects low risk for normal messages', () => {
      const lowRiskMessages = [
        'I am feeling a bit stressed about exams',
        'I need help with time management',
        'I am worried about my grades',
        'I feel nervous about presentations'
      ]

      lowRiskMessages.forEach(message => {
        expect(assessRiskLevel(message)).toBe('low')
      })
    })

    it('handles empty or undefined messages', () => {
      expect(assessRiskLevel('')).toBe('low')
      expect(assessRiskLevel(undefined as any)).toBe('low')
      expect(assessRiskLevel(null as any)).toBe('low')
    })

    it('is case insensitive', () => {
      expect(assessRiskLevel('I WANT TO KILL MYSELF')).toBe('high')
      expect(assessRiskLevel('i feel hopeless')).toBe('medium')
      expect(assessRiskLevel('I Feel Depressed')).toBe('medium')
    })
  })

  describe('getCrisisResources', () => {
    it('returns crisis resources for English', () => {
      const resources = getCrisisResources('en')
      
      expect(resources).toHaveProperty('helplines')
      expect(resources).toHaveProperty('emergency')
      expect(resources).toHaveProperty('message')
      expect(resources.helplines).toContain('91529-87821')
      expect(resources.emergency).toBe('112')
    })

    it('returns crisis resources for Hindi', () => {
      const resources = getCrisisResources('hi')
      
      expect(resources).toHaveProperty('helplines')
      expect(resources).toHaveProperty('emergency')
      expect(resources).toHaveProperty('message')
      expect(resources.helplines).toContain('91529-87821')
      expect(resources.emergency).toBe('112')
    })

    it('falls back to English for unsupported languages', () => {
      const resources = getCrisisResources('unsupported')
      
      expect(resources).toHaveProperty('helplines')
      expect(resources).toHaveProperty('emergency')
      expect(resources).toHaveProperty('message')
      expect(typeof resources.message).toBe('string')
    })

    it('includes campus counseling information', () => {
      const resources = getCrisisResources('en')
      
      expect(resources).toHaveProperty('campus')
      expect(resources.campus).toContain('Available 24/7')
    })
  })

  describe('generateAIResponse', () => {
    const mockOpenAI = require('openai').OpenAI

    beforeEach(() => {
      mockOpenAI.mockClear()
    })

    it('generates response for normal conversation', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'I understand you\'re feeling stressed about exams. Here are some strategies that might help...'
          }
        }]
      }

      const mockCreate = jest.fn().mockResolvedValue(mockResponse)
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const messages = [
        { role: 'user', content: 'I am stressed about my upcoming exams' }
      ]

      const response = await generateAIResponse(messages, 'en')

      expect(response).toHaveProperty('message')
      expect(response).toHaveProperty('riskLevel', 'low')
      expect(response.message).toContain('strategies')
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('mental health support')
            })
          ])
        })
      )
    })

    it('handles high risk situations', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'I\'m very concerned about what you\'ve shared. Your safety is the top priority right now.'
          }
        }]
      }

      const mockCreate = jest.fn().mockResolvedValue(mockResponse)
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const messages = [
        { role: 'user', content: 'I want to kill myself' }
      ]

      const response = await generateAIResponse(messages, 'en')

      expect(response).toHaveProperty('riskLevel', 'high')
      expect(response).toHaveProperty('crisisResources')
      expect(response.crisisResources).toHaveProperty('helplines')
      expect(response.crisisResources?.helplines).toContain('91529-87821')
    })

    it('handles API errors gracefully', async () => {
      const mockCreate = jest.fn().mockRejectedValue(new Error('API Error'))
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const messages = [
        { role: 'user', content: 'Hello' }
      ]

      const response = await generateAIResponse(messages, 'en')

      expect(response).toHaveProperty('message')
      expect(response.message).toContain('experiencing technical difficulties')
      expect(response).toHaveProperty('riskLevel', 'low')
    })

    it('includes appropriate system prompt for mental health context', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'I understand your concerns about academic pressure.'
          }
        }]
      }

      const mockCreate = jest.fn().mockResolvedValue(mockResponse)
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const messages = [
        { role: 'user', content: 'I feel overwhelmed by studies' }
      ]

      await generateAIResponse(messages, 'en')

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringMatching(/mental health support.*Indian college students/s)
            })
          ])
        })
      )
    })

    it('handles different languages', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'मैं समझ सकता हूं कि आप परीक्षा को लेकर चिंतित हैं।'
          }
        }]
      }

      const mockCreate = jest.fn().mockResolvedValue(mockResponse)
      mockOpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: mockCreate
          }
        }
      }))

      const messages = [
        { role: 'user', content: 'मुझे परीक्षा की चिंता है' }
      ]

      await generateAIResponse(messages, 'hi')

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('Hindi')
            })
          ])
        })
      )
    })
  })
})

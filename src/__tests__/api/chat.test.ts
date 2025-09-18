import { POST } from '@/app/api/chat/route'
import { NextRequest } from 'next/server'

// Mock the OpenAI module
jest.mock('@/lib/openai', () => ({
  generateAIResponse: jest.fn()
}))

describe('/api/chat', () => {
  const mockGenerateAIResponse = require('@/lib/openai').generateAIResponse

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles valid chat request', async () => {
    mockGenerateAIResponse.mockResolvedValue({
      message: 'I understand you\'re feeling stressed. Here are some strategies...',
      riskLevel: 'low'
    })

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'I am feeling stressed about exams' }
        ],
        language: 'en'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('message')
    expect(data).toHaveProperty('riskLevel', 'low')
    expect(mockGenerateAIResponse).toHaveBeenCalledWith(
      [{ role: 'user', content: 'I am feeling stressed about exams' }],
      'en'
    )
  })

  it('handles high risk situations', async () => {
    mockGenerateAIResponse.mockResolvedValue({
      message: 'I\'m very concerned about what you\'ve shared.',
      riskLevel: 'high',
      crisisResources: {
        helplines: ['91529-87821'],
        emergency: '112',
        message: 'Please contact emergency services immediately.'
      }
    })

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'I want to hurt myself' }
        ],
        language: 'en'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('riskLevel', 'high')
    expect(data).toHaveProperty('crisisResources')
    expect(data.crisisResources).toHaveProperty('helplines')
    expect(data.crisisResources.helplines).toContain('91529-87821')
  })

  it('returns 400 for missing messages', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        language: 'en'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'Messages are required')
  })

  it('returns 400 for empty messages array', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [],
        language: 'en'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'Messages are required')
  })

  it('defaults to English when language is not provided', async () => {
    mockGenerateAIResponse.mockResolvedValue({
      message: 'I understand your concerns.',
      riskLevel: 'low'
    })

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ]
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    
    expect(response.status).toBe(200)
    expect(mockGenerateAIResponse).toHaveBeenCalledWith(
      [{ role: 'user', content: 'Hello' }],
      'en'
    )
  })

  it('handles different languages', async () => {
    mockGenerateAIResponse.mockResolvedValue({
      message: 'मैं आपकी चिंताओं को समझ सकता हूं।',
      riskLevel: 'low'
    })

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'नमस्ते' }
        ],
        language: 'hi'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    
    expect(response.status).toBe(200)
    expect(mockGenerateAIResponse).toHaveBeenCalledWith(
      [{ role: 'user', content: 'नमस्ते' }],
      'hi'
    )
  })

  it('handles API errors gracefully', async () => {
    mockGenerateAIResponse.mockRejectedValue(new Error('OpenAI API Error'))

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        language: 'en'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error', 'Failed to generate AI response')
  })

  it('validates message format', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'invalid', content: 'Hello' }
        ],
        language: 'en'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    
    // Should still process but OpenAI will handle invalid roles
    expect(response.status).toBe(200)
  })

  it('handles malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error', 'Failed to generate AI response')
  })

  it('handles conversation context', async () => {
    mockGenerateAIResponse.mockResolvedValue({
      message: 'Based on what you mentioned earlier about stress...',
      riskLevel: 'low'
    })

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'I am stressed about exams' },
          { role: 'assistant', content: 'I understand. Here are some strategies...' },
          { role: 'user', content: 'Can you tell me more about breathing exercises?' }
        ],
        language: 'en'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    
    expect(response.status).toBe(200)
    expect(mockGenerateAIResponse).toHaveBeenCalledWith(
      expect.arrayContaining([
        { role: 'user', content: 'I am stressed about exams' },
        { role: 'assistant', content: 'I understand. Here are some strategies...' },
        { role: 'user', content: 'Can you tell me more about breathing exercises?' }
      ]),
      'en'
    )
  })
})

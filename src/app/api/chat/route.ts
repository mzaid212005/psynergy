import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, assessRiskLevel, getCrisisResources } from '@/lib/openai'
import { ChatMessage } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, userLanguage = 'en', userId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Get the latest user message for risk assessment
    const latestUserMessage = messages
      .filter((msg: ChatMessage) => msg.role === 'user')
      .pop()

    if (!latestUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      )
    }

    // Assess risk level based on the latest message
    const riskAssessment = assessRiskLevel(latestUserMessage.content)
    
    // Generate AI response
    const aiResponse = await generateAIResponse(
      messages,
      userLanguage,
      riskAssessment.level
    )

    // Create response message
    const responseMessage: ChatMessage = {
      id: `ai_${Date.now()}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        riskLevel: riskAssessment.level,
        suggestedActions: riskAssessment.recommendedActions,
        language: userLanguage
      }
    }

    // If critical risk, include crisis resources
    let crisisResources = null
    if (riskAssessment.level === 'critical') {
      crisisResources = getCrisisResources(userLanguage)
    }

    // TODO: Save conversation to database
    // await saveConversation(userId, messages, responseMessage, riskAssessment)

    return NextResponse.json({
      message: responseMessage,
      riskAssessment,
      crisisResources,
      requiresEscalation: riskAssessment.requiresImmediateAttention
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        message: {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact campus counseling services if you need immediate support.',
          timestamp: new Date().toISOString(),
          metadata: {
            riskLevel: 'low',
            language: 'en'
          }
        }
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'Psynergy Chat API',
    timestamp: new Date().toISOString()
  })
}

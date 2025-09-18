import { NextRequest, NextResponse } from 'next/server'
import { calculateAssessmentScore, getAssessmentQuestions } from '@/data/assessments'
import { AssessmentResult } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, responses, userId } = body

    if (!type || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Assessment type and responses are required' },
        { status: 400 }
      )
    }

    // Validate assessment type
    const validTypes = ['PHQ9', 'GAD7', 'STUDENT_STRESS']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid assessment type' },
        { status: 400 }
      )
    }

    // Calculate score and get recommendations
    const result = calculateAssessmentScore(type, responses)
    
    // Determine if professional help is required
    const requiresProfessionalHelp = 
      (type === 'PHQ9' && result.score >= 10) ||
      (type === 'GAD7' && result.score >= 10) ||
      (type === 'STUDENT_STRESS' && result.score >= 16)

    // Create assessment result
    const assessmentResult: AssessmentResult = {
      id: `assessment_${Date.now()}`,
      userId: userId || 'anonymous',
      type: type as 'PHQ-9' | 'GAD-7' | 'custom',
      score: result.score,
      severity: result.severity as 'minimal' | 'mild' | 'moderate' | 'severe',
      recommendations: result.recommendations,
      requiresProfessionalHelp,
      createdAt: new Date().toISOString()
    }

    // TODO: Save assessment result to database
    // await saveAssessmentResult(assessmentResult)

    return NextResponse.json({
      result: assessmentResult,
      interpretation: {
        description: result.description,
        color: result.color,
        recommendations: result.recommendations
      }
    })

  } catch (error) {
    console.error('Assessment API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to process assessment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type) {
      return NextResponse.json(
        { error: 'Assessment type is required' },
        { status: 400 }
      )
    }

    const questions = getAssessmentQuestions(type as 'PHQ9' | 'GAD7' | 'STUDENT_STRESS')
    
    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Invalid assessment type' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      type,
      questions,
      totalQuestions: questions.length
    })

  } catch (error) {
    console.error('Assessment questions API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch assessment questions' },
      { status: 500 }
    )
  }
}

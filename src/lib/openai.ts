import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    riskLevel?: 'low' | 'medium' | 'high' | 'critical'
    suggestedActions?: string[]
    assessmentTriggered?: boolean
    language?: string
  }
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical'
  factors: string[]
  recommendedActions: string[]
  requiresImmediateAttention: boolean
}

// System prompts for different scenarios
const SYSTEM_PROMPTS = {
  initial: `You are Psynergy AI, a compassionate and professional mental health support assistant designed specifically for Indian college students. Your role is to provide psychological first aid, emotional support, and guidance while maintaining cultural sensitivity.

Key Guidelines:
1. Always be empathetic, non-judgmental, and supportive
2. Use simple, clear language appropriate for college students
3. Be culturally sensitive to Indian contexts (family pressure, academic stress, cultural expectations)
4. Never provide medical diagnoses or replace professional therapy
5. Always encourage professional help when needed
6. Maintain confidentiality and privacy
7. Be aware of crisis situations and escalate appropriately

Your capabilities:
- Provide emotional support and active listening
- Offer evidence-based coping strategies
- Guide users through breathing exercises and mindfulness
- Conduct mental health screenings (PHQ-9, GAD-7)
- Recognize crisis situations and provide appropriate resources
- Suggest campus resources and professional help

Remember: You're here to support, not diagnose. Always prioritize user safety.`,

  crisis: `CRISIS MODE ACTIVATED. The user may be in immediate danger. Your priority is:
1. Keep them talking and engaged
2. Express genuine concern and care
3. Avoid minimizing their feelings
4. Provide immediate crisis resources
5. Encourage them to reach out to emergency services or trusted individuals
6. Stay with them until they're connected to appropriate help

Crisis Resources for India:
- National Suicide Prevention Helpline: 91529-87821
- shrestha Mental Health Helpline: 7892707757
- Emergency Services: 112

Be gentle, supportive, and persistent in encouraging immediate professional help.`,

  assessment: `You are conducting a mental health screening. Be professional yet warm:
1. Explain the purpose and confidentiality of the assessment
2. Ask questions clearly and wait for responses
3. Provide context for why each question matters
4. Reassure that there are no right or wrong answers
5. Explain what the results mean in simple terms
6. Always follow up with appropriate recommendations

Remember: Assessments are tools for understanding, not for diagnosis.`
}

// High-risk keywords that trigger crisis protocols
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
  'harm myself', 'self-harm', 'cutting', 'overdose', 'jump off', 'hang myself',
  'no point in living', 'want to die', 'planning to hurt myself'
]

const HIGH_RISK_KEYWORDS = [
  'hopeless', 'worthless', 'can\'t cope', 'overwhelming', 'unbearable',
  'trapped', 'burden', 'alone', 'isolated', 'desperate', 'panic attack'
]

export function assessRiskLevel(message: string): RiskAssessment {
  const lowerMessage = message.toLowerCase()
  
  // Check for crisis keywords
  const hasCrisisKeywords = CRISIS_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  )
  
  if (hasCrisisKeywords) {
    return {
      level: 'critical',
      factors: ['Suicidal ideation or self-harm mentioned'],
      recommendedActions: [
        'Immediate crisis intervention required',
        'Contact emergency services: 112',
        'National Suicide Prevention Helpline: 91529-87821',
        'Stay with user until professional help is obtained'
      ],
      requiresImmediateAttention: true
    }
  }
  
  // Check for high-risk keywords
  const hasHighRiskKeywords = HIGH_RISK_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  )
  
  if (hasHighRiskKeywords) {
    return {
      level: 'high',
      factors: ['Severe emotional distress indicators'],
      recommendedActions: [
        'Encourage professional counseling',
        'Provide coping strategies',
        'Monitor closely for escalation',
        'Suggest campus counseling services'
      ],
      requiresImmediateAttention: false
    }
  }
  
  // Check for medium-risk indicators
  const mediumRiskKeywords = ['stressed', 'anxious', 'depressed', 'worried', 'scared']
  const hasMediumRiskKeywords = mediumRiskKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  )
  
  if (hasMediumRiskKeywords) {
    return {
      level: 'medium',
      factors: ['Moderate emotional distress'],
      recommendedActions: [
        'Provide emotional support',
        'Suggest coping strategies',
        'Monitor for changes',
        'Consider professional support if symptoms persist'
      ],
      requiresImmediateAttention: false
    }
  }
  
  return {
    level: 'low',
    factors: ['No immediate risk indicators'],
    recommendedActions: [
      'Continue supportive conversation',
      'Provide general wellness resources'
    ],
    requiresImmediateAttention: false
  }
}

export async function generateAIResponse(
  messages: ChatMessage[],
  userLanguage: string = 'en',
  riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
): Promise<string> {
  try {
    // Select appropriate system prompt based on risk level
    let systemPrompt = SYSTEM_PROMPTS.initial
    if (riskLevel === 'critical') {
      systemPrompt = SYSTEM_PROMPTS.crisis
    }
    
    // Add language instruction if not English
    if (userLanguage !== 'en') {
      systemPrompt += `\n\nIMPORTANT: Respond in the user's preferred language. The user's language preference is: ${userLanguage}`
    }
    
    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })
    
    return completion.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now. Please try again or contact a counselor directly.'
    
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback responses based on risk level
    if (riskLevel === 'critical') {
      return `I'm very concerned about you right now. Please reach out for immediate help:
      
🆘 Emergency: 112
📞 Suicide Prevention: 91529-87821
💬 shrestha Helpline: 7892707757

You don't have to go through this alone. There are people who want to help you.`
    }
    
    return `I'm here to support you, but I'm having technical difficulties right now. Please don't hesitate to reach out to:

📞 Campus Counseling Center
💬 shrestha Mental Health Helpline: 7892707757
🌐 Or try chatting with me again in a moment

Your wellbeing matters, and help is available.`
  }
}

// Multilingual crisis resources
export const CRISIS_RESOURCES = {
  en: {
    emergency: '112',
    suicide_prevention: '91529-87821',
    shrestha: '7892707757',
    message: 'If you\'re in crisis, please reach out for immediate help. You\'re not alone.'
  },
  hi: {
    emergency: '112',
    suicide_prevention: '91529-87821', 
    shrestha: '7892707757',
    message: 'यदि आप संकट में हैं, तो कृपया तुरंत सहायता के लिए संपर्क करें। आप अकेले नहीं हैं।'
  },
  kn: {
    emergency: '112',
    suicide_prevention: '91529-87821',
    shrestha: '7892707757', 
    message: 'ನೀವು ಬಿಕ್ಕಟ್ಟಿನಲ್ಲಿದ್ದರೆ, ದಯವಿಟ್ಟು ತಕ್ಷಣದ ಸಹಾಯಕ್ಕಾಗಿ ಸಂಪರ್ಕಿಸಿ। ನೀವು ಒಬ್ಬಂಟಿಗರಲ್ಲ.'
  }
}

export function getCrisisResources(language: string = 'en') {
  return CRISIS_RESOURCES[language as keyof typeof CRISIS_RESOURCES] || CRISIS_RESOURCES.en
}

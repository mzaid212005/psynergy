import { NextRequest, NextResponse } from 'next/server'
import { 
  getCounselorsWithAvailability, 
  getCounselorsBySpecialization, 
  getCounselorsByLanguage,
  getAvailableSlots,
  emergencyCounselors
} from '@/data/counselors'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get('specialization')
    const language = searchParams.get('language')
    const date = searchParams.get('date')
    const counselorId = searchParams.get('counselorId')
    const emergency = searchParams.get('emergency')

    // Get available slots for a specific counselor and date
    if (counselorId && date) {
      const slots = getAvailableSlots(counselorId, date)
      return NextResponse.json({
        counselorId,
        date,
        availableSlots: slots,
        total: slots.length
      })
    }

    // Get emergency counselors
    if (emergency === 'true') {
      return NextResponse.json({
        counselors: emergencyCounselors,
        total: emergencyCounselors.length,
        type: 'emergency'
      })
    }

    // Get all counselors with availability
    let counselors = getCounselorsWithAvailability()

    // Filter by specialization
    if (specialization) {
      counselors = getCounselorsBySpecialization(specialization)
    }

    // Filter by language
    if (language) {
      counselors = getCounselorsByLanguage(language)
    }

    // Add availability summary for each counselor
    const counselorsWithSummary = counselors.map(counselor => {
      const availableSlots = counselor.availability.filter(slot => !slot.isBooked)
      const nextAvailable = availableSlots.length > 0 
        ? availableSlots[0].startTime 
        : null

      return {
        ...counselor,
        availableSlotsCount: availableSlots.length,
        nextAvailableSlot: nextAvailable,
        // Don't send full availability array unless specifically requested
        availability: undefined
      }
    })

    return NextResponse.json({
      counselors: counselorsWithSummary,
      total: counselorsWithSummary.length,
      filters: {
        specialization,
        language,
        date
      }
    })

  } catch (error) {
    console.error('Get counselors error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch counselors' },
      { status: 500 }
    )
  }
}

// Get detailed counselor information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { counselorId, includeAvailability = false } = body

    if (!counselorId) {
      return NextResponse.json(
        { error: 'Counselor ID is required' },
        { status: 400 }
      )
    }

    const counselors = getCounselorsWithAvailability()
    const counselor = counselors.find(c => c.id === counselorId)

    if (!counselor) {
      return NextResponse.json(
        { error: 'Counselor not found' },
        { status: 404 }
      )
    }

    // Prepare response
    const response: any = {
      ...counselor
    }

    if (!includeAvailability) {
      // Remove availability to reduce payload size
      delete response.availability
    } else {
      // Group availability by date for easier frontend consumption
      const availabilityByDate: { [date: string]: any[] } = {}
      
      counselor.availability.forEach(slot => {
        if (!availabilityByDate[slot.date]) {
          availabilityByDate[slot.date] = []
        }
        availabilityByDate[slot.date].push(slot)
      })

      response.availabilityByDate = availabilityByDate
    }

    return NextResponse.json({
      counselor: response
    })

  } catch (error) {
    console.error('Get counselor details error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch counselor details' },
      { status: 500 }
    )
  }
}

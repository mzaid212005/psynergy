import { NextRequest, NextResponse } from 'next/server'
import { Appointment } from '@/types'
import { getCounselorsWithAvailability } from '@/data/counselors'

// Mock database - in production, this would be a real database
let appointments: Appointment[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      counselorId, 
      timeSlotId, 
      type, 
      isAnonymous, 
      reason, 
      notes, 
      reminderPreference,
      userId 
    } = body

    // Validate required fields
    if (!counselorId || !timeSlotId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get counselors with availability
    const counselors = getCounselorsWithAvailability()
    const counselor = counselors.find(c => c.id === counselorId)
    
    if (!counselor) {
      return NextResponse.json(
        { error: 'Counselor not found' },
        { status: 404 }
      )
    }

    // Find the time slot
    const timeSlot = counselor.availability.find(slot => slot.id === timeSlotId)
    
    if (!timeSlot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      )
    }

    if (timeSlot.isBooked) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }

    // Create new appointment
    const appointment: Appointment = {
      id: `appointment_${Date.now()}`,
      userId: isAnonymous ? 'anonymous' : (userId || 'current_user'),
      counselorId,
      timeSlot,
      type: type as 'individual' | 'group' | 'emergency',
      status: 'scheduled',
      isAnonymous,
      notes: notes || '',
      createdAt: new Date().toISOString()
    }

    // Add to appointments array (in production, save to database)
    appointments.push(appointment)

    // Mark time slot as booked
    timeSlot.isBooked = true

    // TODO: Send confirmation email/SMS
    // TODO: Schedule reminder notifications
    // TODO: Update counselor's calendar

    return NextResponse.json({
      appointment,
      message: 'Appointment booked successfully',
      confirmationNumber: appointment.id
    })

  } catch (error) {
    console.error('Appointment booking error:', error)
    
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const counselorId = searchParams.get('counselorId')
    const status = searchParams.get('status')

    let filteredAppointments = appointments

    // Filter by user ID
    if (userId) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.userId === userId
      )
    }

    // Filter by counselor ID
    if (counselorId) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.counselorId === counselorId
      )
    }

    // Filter by status
    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.status === status
      )
    }

    return NextResponse.json({
      appointments: filteredAppointments,
      total: filteredAppointments.length
    })

  } catch (error) {
    console.error('Get appointments error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, status, notes } = body

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Update appointment
    if (status) {
      appointments[appointmentIndex].status = status
    }
    
    if (notes !== undefined) {
      appointments[appointmentIndex].notes = notes
    }

    // If cancelling, free up the time slot
    if (status === 'cancelled') {
      const appointment = appointments[appointmentIndex]
      appointment.timeSlot.isBooked = false
    }

    return NextResponse.json({
      appointment: appointments[appointmentIndex],
      message: 'Appointment updated successfully'
    })

  } catch (error) {
    console.error('Update appointment error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Free up the time slot
    const appointment = appointments[appointmentIndex]
    appointment.timeSlot.isBooked = false

    // Remove appointment
    appointments.splice(appointmentIndex, 1)

    return NextResponse.json({
      message: 'Appointment cancelled successfully'
    })

  } catch (error) {
    console.error('Cancel appointment error:', error)
    
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}

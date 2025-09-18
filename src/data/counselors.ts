import { Counselor, TimeSlot } from '@/types'

// Sample counselor data with availability
export const counselors: Counselor[] = [
  {
    id: 'counselor_1',
    name: 'Dr. Priya Sharma',
    title: 'Dr.',
    specializations: ['Depression', 'Anxiety', 'Academic Stress', 'Family Issues'],
    languages: ['English', 'Hindi', 'Punjabi'],
    availability: [],
    rating: 4.8,
    experience: 8,
    isAvailable: true,
    location: 'Campus Counseling Center - Room 101',
    qualifications: ['PhD in Clinical Psychology', 'Certified CBT Practitioner'],
    yearsOfExperience: 8,
    bio: 'Dr. Priya Sharma is a compassionate and experienced clinical psychologist dedicated to helping students navigate their mental health challenges. She specializes in cognitive-behavioral therapy (CBT) and has a passion for working with young adults.',
    profilePictureUrl: '/counselors/priya-sharma.jpg'
  },
  {
    id: 'counselor_2',
    name: 'Dr. Rajesh Kumar',
    title: 'Dr.',
    specializations: ['Anxiety Disorders', 'Panic Attacks', 'Social Anxiety', 'Career Counseling'],
    languages: ['English', 'Hindi', 'Bengali'],
    availability: [],
    rating: 4.9,
    experience: 12,
    isAvailable: true,
    location: 'Campus Counseling Center - Room 102',
    qualifications: ['MD in Psychiatry', 'Licensed Professional Counselor'],
    yearsOfExperience: 12,
    bio: 'Dr. Rajesh Kumar is a board-certified psychiatrist with over a decade of experience in helping individuals overcome anxiety and stress-related disorders. He is also a skilled career counselor, guiding students towards a fulfilling professional life.',
    profilePictureUrl: '/counselors/rajesh-kumar.jpg'
  },
  {
    id: 'counselor_3',
    name: 'Dr. Meera Nair',
    title: 'Dr.',
    specializations: ['Trauma Therapy', 'PTSD', 'Relationship Issues', 'Self-Esteem'],
    languages: ['English', 'Malayalam', 'Tamil'],
    availability: [],
    rating: 4.7,
    experience: 10,
    isAvailable: true,
    location: 'Campus Counseling Center - Room 103',
    qualifications: ['PhD in Counseling Psychology', 'Certified Trauma Professional'],
    yearsOfExperience: 10,
    bio: 'Dr. Meera Nair is a trauma-informed therapist who provides a safe and supportive space for students to heal and grow. She has extensive experience in helping individuals overcome trauma and build healthier relationships.',
    profilePictureUrl: '/counselors/meera-nair.jpg'
  },
  {
    id: 'counselor_4',
    name: 'Dr. Arjun Patel',
    title: 'Dr.',
    specializations: ['Substance Abuse', 'Addiction Recovery', 'Behavioral Issues', 'Anger Management'],
    languages: ['English', 'Gujarati', 'Hindi'],
    availability: [],
    rating: 4.6,
    experience: 15,
    isAvailable: true,
    location: 'Campus Counseling Center - Room 104',
    qualifications: ['Licensed Clinical Social Worker', 'Certified Addiction Counselor'],
    yearsOfExperience: 15,
    bio: 'Dr. Arjun Patel is a dedicated and experienced counselor specializing in addiction and recovery. He is committed to helping students break free from substance abuse and develop healthier coping mechanisms.',
    profilePictureUrl: '/counselors/arjun-patel.jpg'
  },
  {
    id: 'counselor_5',
    name: 'Dr. Kavitha Reddy',
    title: 'Dr.',
    specializations: ['Eating Disorders', 'Body Image', 'Women\'s Issues', 'Cultural Identity'],
    languages: ['English', 'Telugu', 'Kannada'],
    availability: [],
    rating: 4.8,
    experience: 7,
    isAvailable: true,
    location: 'Campus Counseling Center - Room 105',
    qualifications: ['PhD in Clinical Psychology', 'Certified Eating Disorder Specialist'],
    yearsOfExperience: 7,
    bio: 'Dr. Kavitha Reddy is a compassionate psychologist who specializes in helping students with eating disorders and body image concerns. She is also passionate about supporting women and addressing cultural identity issues.',
    profilePictureUrl: '/counselors/kavitha-reddy.jpg'
  },
  {
    id: 'counselor_6',
    name: 'Dr. Vikram Singh',
    title: 'Dr.',
    specializations: ['Crisis Intervention', 'Suicidal Ideation', 'Emergency Support', 'Risk Assessment'],
    languages: ['English', 'Hindi', 'Punjabi'],
    availability: [],
    rating: 4.9,
    experience: 20,
    isAvailable: true,
    location: 'Campus Counseling Center - Emergency Wing',
    qualifications: ['MD in Psychiatry', 'Certified Crisis Intervention Specialist'],
    yearsOfExperience: 20,
    bio: 'Dr. Vikram Singh is a highly experienced psychiatrist and crisis intervention specialist. He is dedicated to providing immediate support to students in crisis and ensuring their safety and well-being.',
    profilePictureUrl: '/counselors/vikram-singh.jpg'
  }
]

// Generate time slots for the next 30 days
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = new Date()
  
  for (let day = 1; day <= 30; day++) {
    const date = new Date(today)
    date.setDate(today.getDate() + day)
    
    // Skip weekends for regular appointments
    if (date.getDay() === 0 || date.getDay() === 6) continue
    
    // Morning slots: 9:00 AM - 12:00 PM
    for (let hour = 9; hour < 12; hour++) {
      const startTime = new Date(date)
      startTime.setHours(hour, 0, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setHours(hour + 1, 0, 0, 0)
      
      slots.push({
        id: `slot_${date.toISOString().split('T')[0]}_${hour}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isBooked: Math.random() > 0.7, // 30% chance of being booked
        date: date.toISOString().split('T')[0]
      })
    }
    
    // Afternoon slots: 2:00 PM - 6:00 PM
    for (let hour = 14; hour < 18; hour++) {
      const startTime = new Date(date)
      startTime.setHours(hour, 0, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setHours(hour + 1, 0, 0, 0)
      
      slots.push({
        id: `slot_${date.toISOString().split('T')[0]}_${hour}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isBooked: Math.random() > 0.6, // 40% chance of being booked
        date: date.toISOString().split('T')[0]
      })
    }
  }
  
  return slots
}

// Assign time slots to counselors
export function getCounselorsWithAvailability(): Counselor[] {
  const timeSlots = generateTimeSlots()
  
  return counselors.map(counselor => ({
    ...counselor,
    availability: timeSlots.filter(() => Math.random() > 0.3) // Each counselor gets ~70% of slots
  }))
}

// Emergency counselors available 24/7
export const emergencyCounselors = counselors.filter(c => 
  c.specializations.includes('Crisis Intervention') || 
  c.specializations.includes('Emergency Support')
)

// Get counselors by specialization
export function getCounselorsBySpecialization(specialization: string): Counselor[] {
  return counselors.filter(counselor =>
    counselor.specializations.some(spec => 
      spec.toLowerCase().includes(specialization.toLowerCase())
    )
  )
}

// Get counselors by language
export function getCounselorsByLanguage(language: string): Counselor[] {
  return counselors.filter(counselor =>
    counselor.languages.some(lang => 
      lang.toLowerCase().includes(language.toLowerCase())
    )
  )
}

// Get available time slots for a specific counselor and date
export function getAvailableSlots(counselorId: string, date: string): TimeSlot[] {
  const counselor = counselors.find(c => c.id === counselorId)
  if (!counselor) return []
  
  return counselor.availability.filter(slot => 
    slot.date === date && !slot.isBooked
  )
}

// Appointment types
export const appointmentTypes = [
  {
    id: 'individual',
    name: 'Individual Counseling',
    description: 'One-on-one session with a counselor',
    duration: 60,
    isAnonymous: false
  },
  {
    id: 'group',
    name: 'Group Therapy',
    description: 'Small group session with peers',
    duration: 90,
    isAnonymous: false
  },
  {
    id: 'emergency',
    name: 'Emergency Support',
    description: 'Immediate crisis intervention',
    duration: 45,
    isAnonymous: true
  },
  {
    id: 'anonymous',
    name: 'Anonymous Consultation',
    description: 'Confidential session without identity disclosure',
    duration: 60,
    isAnonymous: true
  }
]

// Common reasons for appointments
export const appointmentReasons = [
  'Academic Stress',
  'Anxiety',
  'Depression',
  'Family Issues',
  'Relationship Problems',
  'Career Concerns',
  'Social Anxiety',
  'Panic Attacks',
  'Sleep Issues',
  'Eating Concerns',
  'Substance Use',
  'Trauma/PTSD',
  'Self-Esteem Issues',
  'Cultural Identity',
  'Financial Stress',
  'Homesickness',
  'Exam Anxiety',
  'Peer Pressure',
  'Identity Issues',
  'Crisis Support',
  'Other'
]

// Reminder preferences
export const reminderOptions = [
  { id: 'none', label: 'No reminders', value: 0 },
  { id: '1hour', label: '1 hour before', value: 60 },
  { id: '2hours', label: '2 hours before', value: 120 },
  { id: '1day', label: '1 day before', value: 1440 },
  { id: '2days', label: '2 days before', value: 2880 }
]

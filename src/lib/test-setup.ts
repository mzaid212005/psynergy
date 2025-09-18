// Test utilities and setup
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  collegeName: 'Test College',
  usn: '1TC21CS001',
  yearOfStudy: 'Second Year',
  preferredLanguage: 'en',
  role: 'student' as const,
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockColleges = [
  {
    id: '1',
    name: 'Test Engineering College',
    location: 'Test City, Test State',
    type: 'engineering' as const,
    isActive: true,
  },
  {
    id: '2',
    name: 'Test Medical College',
    location: 'Test City, Test State',
    type: 'medical' as const,
    isActive: true,
  },
]

export const mockRegistrationData = {
  fullName: 'John Doe',
  collegeName: 'Test Engineering College',
  usn: '1TC21CS001',
  yearOfStudy: 'Second Year',
  email: 'john.doe@example.com',
  phoneNumber: '9876543210',
  preferredLanguage: 'en',
  password: 'SecurePassword123!',
  confirmPassword: 'SecurePassword123!',
  gender: 'Male',
  pronouns: 'He/Him',
  agreeToTerms: true,
}

// Utility functions for testing
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const generateMockUSN = (collegeCode: string = 'TC', year: string = '21', course: string = 'CS', rollNumber: string = '001') => {
  return `1${collegeCode}${year}${course}${rollNumber}`
}

export const isValidTestEnvironment = () => {
  return process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
}

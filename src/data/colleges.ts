import { College } from '@/types'

export const colleges: College[] = [
  // Karnataka Colleges
  {
    id: '1',
    name: 'Indian Institute of Science (IISc), Bangalore',
    location: 'Bangalore, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '2',
    name: 'National Institute of Technology Karnataka (NITK), Surathkal',
    location: 'Surathkal, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '3',
    name: 'Bangalore Institute of Technology (BIT)',
    location: 'Bangalore, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '4',
    name: 'RV College of Engineering (RVCE)',
    location: 'Bangalore, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '5',
    name: 'PES University',
    location: 'Bangalore, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '6',
    name: 'Manipal Institute of Technology (MIT)',
    location: 'Manipal, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '7',
    name: 'JSS Science and Technology University',
    location: 'Mysuru, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '8',
    name: 'Visvesvaraya Technological University (VTU)',
    location: 'Belagavi, Karnataka',
    type: 'engineering',
    isActive: true,
  },
  
  // Tamil Nadu Colleges
  {
    id: '9',
    name: 'Indian Institute of Technology Madras (IIT Madras)',
    location: 'Chennai, Tamil Nadu',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '10',
    name: 'Anna University',
    location: 'Chennai, Tamil Nadu',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '11',
    name: 'Vellore Institute of Technology (VIT)',
    location: 'Vellore, Tamil Nadu',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '12',
    name: 'SRM Institute of Science and Technology',
    location: 'Chennai, Tamil Nadu',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '13',
    name: 'Thiagarajar College of Engineering',
    location: 'Madurai, Tamil Nadu',
    type: 'engineering',
    isActive: true,
  },
  
  // Maharashtra Colleges
  {
    id: '14',
    name: 'Indian Institute of Technology Bombay (IIT Bombay)',
    location: 'Mumbai, Maharashtra',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '15',
    name: 'College of Engineering Pune (COEP)',
    location: 'Pune, Maharashtra',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '16',
    name: 'Pune Institute of Computer Technology (PICT)',
    location: 'Pune, Maharashtra',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '17',
    name: 'Veermata Jijabai Technological Institute (VJTI)',
    location: 'Mumbai, Maharashtra',
    type: 'engineering',
    isActive: true,
  },
  
  // Delhi Colleges
  {
    id: '18',
    name: 'Indian Institute of Technology Delhi (IIT Delhi)',
    location: 'New Delhi, Delhi',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '19',
    name: 'Delhi Technological University (DTU)',
    location: 'New Delhi, Delhi',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '20',
    name: 'Netaji Subhas University of Technology (NSUT)',
    location: 'New Delhi, Delhi',
    type: 'engineering',
    isActive: true,
  },
  
  // West Bengal Colleges
  {
    id: '21',
    name: 'Indian Institute of Technology Kharagpur (IIT Kharagpur)',
    location: 'Kharagpur, West Bengal',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '22',
    name: 'Jadavpur University',
    location: 'Kolkata, West Bengal',
    type: 'engineering',
    isActive: true,
  },
  {
    id: '23',
    name: 'Indian Institute of Engineering Science and Technology (IIEST)',
    location: 'Shibpur, West Bengal',
    type: 'engineering',
    isActive: true,
  },
  
  // Medical Colleges
  {
    id: '24',
    name: 'All India Institute of Medical Sciences (AIIMS), Delhi',
    location: 'New Delhi, Delhi',
    type: 'medical',
    isActive: true,
  },
  {
    id: '25',
    name: 'Christian Medical College (CMC), Vellore',
    location: 'Vellore, Tamil Nadu',
    type: 'medical',
    isActive: true,
  },
  {
    id: '26',
    name: 'Kasturba Medical College (KMC), Manipal',
    location: 'Manipal, Karnataka',
    type: 'medical',
    isActive: true,
  },
  
  // Arts and Commerce Colleges
  {
    id: '27',
    name: 'St. Xavier\'s College, Mumbai',
    location: 'Mumbai, Maharashtra',
    type: 'arts',
    isActive: true,
  },
  {
    id: '28',
    name: 'Lady Shri Ram College for Women',
    location: 'New Delhi, Delhi',
    type: 'arts',
    isActive: true,
  },
  {
    id: '29',
    name: 'Loyola College, Chennai',
    location: 'Chennai, Tamil Nadu',
    type: 'arts',
    isActive: true,
  },
  {
    id: '30',
    name: 'Shri Ram College of Commerce (SRCC)',
    location: 'New Delhi, Delhi',
    type: 'commerce',
    isActive: true,
  },
]

export const getCollegesByState = (state: string): College[] => {
  return colleges.filter(college => 
    college.location.toLowerCase().includes(state.toLowerCase())
  )
}

export const getCollegesByType = (type: College['type']): College[] => {
  return colleges.filter(college => college.type === type)
}

export const searchColleges = (query: string): College[] => {
  const lowercaseQuery = query.toLowerCase()
  return colleges.filter(college =>
    college.name.toLowerCase().includes(lowercaseQuery) ||
    college.location.toLowerCase().includes(lowercaseQuery)
  )
}

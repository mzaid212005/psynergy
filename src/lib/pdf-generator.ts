import jsPDF from 'jspdf'

interface InstituteAnalytics {
  instituteName: string
  reportDate: string
  totalStudents: number
  activeStudents: number
  averageMoodScore: number
  riskDistribution: {
    high: number
    medium: number
    low: number
  }
  departmentStats: {
    department: string
    students: number
    averageMood: number
    riskLevel: 'high' | 'medium' | 'low'
    activeSessions: number
    completionRate: number
    trend: 'improving' | 'stable' | 'declining'
  }[]
  monthlyTrends: {
    month: string
    moodScore: number
    sessions: number
    students: number
  }[]
  totalSessions: number
  completedSessions: number
}

interface PatientMoodData {
  id: string
  name: string
  college: string
  usn: string
  recentMoods: Array<{
    date: string
    mood: number
    energy: number
    stress: number
    sleep: number
    notes?: string
    symptoms?: string[]
  }>
  averageMood: number
  riskLevel: 'low' | 'medium' | 'high'
  trend: 'improving' | 'stable' | 'declining'
  lastEntry: string
}

interface Booking {
  id: string
  slotId: string
  studentId: string
  studentName: string
  studentEmail: string
  reason: string
  urgency: 'low' | 'medium' | 'high'
  bookedAt: string
  status: 'confirmed' | 'cancelled'
}

export const generatePatientMoodReport = (patient: PatientMoodData): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Patient Mood Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Patient Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Patient Information', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Name: ${patient.name}`, 20, yPosition)
  yPosition += 7
  doc.text(`College: ${patient.college}`, 20, yPosition)
  yPosition += 7
  doc.text(`USN: ${patient.usn}`, 20, yPosition)
  yPosition += 7
  doc.text(`Last Entry: ${new Date(patient.lastEntry).toLocaleDateString()}`, 20, yPosition)
  yPosition += 15

  // Summary Statistics
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary Statistics', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Average Mood: ${patient.averageMood.toFixed(1)}/10`, 20, yPosition)
  yPosition += 7
  doc.text(`Risk Level: ${patient.riskLevel.toUpperCase()}`, 20, yPosition)
  yPosition += 7
  doc.text(`Trend: ${patient.trend.charAt(0).toUpperCase() + patient.trend.slice(1)}`, 20, yPosition)
  yPosition += 7
  doc.text(`Total Entries: ${patient.recentMoods.length}`, 20, yPosition)
  yPosition += 15

  // Risk Level Color Coding
  const riskColor = patient.riskLevel === 'high' ? [255, 0, 0] : 
                   patient.riskLevel === 'medium' ? [255, 165, 0] : [0, 128, 0]
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(`RISK ASSESSMENT: ${patient.riskLevel.toUpperCase()}`, 20, yPosition)
  doc.setTextColor(0, 0, 0) // Reset to black
  yPosition += 15

  // Mood Entries
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Recent Mood Entries', 20, yPosition)
  yPosition += 10

  // Table headers
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Date', 20, yPosition)
  doc.text('Mood', 60, yPosition)
  doc.text('Energy', 85, yPosition)
  doc.text('Stress', 115, yPosition)
  doc.text('Sleep', 145, yPosition)
  doc.text('Notes', 170, yPosition)
  yPosition += 7

  // Draw line under headers
  doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2)
  yPosition += 3

  // Mood entries
  doc.setFont('helvetica', 'normal')
  patient.recentMoods
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15) // Limit to 15 most recent entries
    .forEach((entry) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }

      const date = new Date(entry.date).toLocaleDateString()
      doc.text(date, 20, yPosition)
      doc.text(entry.mood.toString(), 60, yPosition)
      doc.text(entry.energy.toString(), 85, yPosition)
      doc.text(entry.stress.toString(), 115, yPosition)
      doc.text(entry.sleep.toString(), 145, yPosition)
      
      // Truncate notes if too long
      const notes = entry.notes ? (entry.notes.length > 25 ? entry.notes.substring(0, 25) + '...' : entry.notes) : '-'
      doc.text(notes, 170, yPosition)
      
      yPosition += 7
    })

  // Symptoms Analysis
  if (yPosition > pageHeight - 50) {
    doc.addPage()
    yPosition = 20
  }

  yPosition += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Symptoms Analysis', 20, yPosition)
  yPosition += 10

  // Collect all symptoms
  const allSymptoms: string[] = []
  patient.recentMoods.forEach(entry => {
    if (entry.symptoms) {
      allSymptoms.push(...entry.symptoms)
    }
  })

  // Count symptom frequency
  const symptomCounts: { [key: string]: number } = {}
  allSymptoms.forEach(symptom => {
    symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
  })

  // Display top symptoms
  const topSymptoms = Object.entries(symptomCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  if (topSymptoms.length > 0) {
    topSymptoms.forEach(([symptom, count]) => {
      doc.text(`${symptom}: ${count} occurrences`, 20, yPosition)
      yPosition += 7
    })
  } else {
    doc.text('No symptoms reported', 20, yPosition)
  }

  // Footer
  yPosition = pageHeight - 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Generated on ${new Date().toLocaleDateString()} by Psynergy Mental Health Platform`, pageWidth / 2, yPosition, { align: 'center' })

  // Save the PDF
  doc.save(`${patient.name.replace(/\s+/g, '_')}_mood_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateBookingReport = (bookings: Booking[]): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Counseling Bookings Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Summary
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Bookings: ${bookings.length}`, 20, yPosition)
  yPosition += 7
  doc.text(`Confirmed: ${bookings.filter(b => b.status === 'confirmed').length}`, 20, yPosition)
  yPosition += 7
  doc.text(`Cancelled: ${bookings.filter(b => b.status === 'cancelled').length}`, 20, yPosition)
  yPosition += 7
  doc.text(`High Priority: ${bookings.filter(b => b.urgency === 'high').length}`, 20, yPosition)
  yPosition += 15

  // Bookings List
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Booking Details', 20, yPosition)
  yPosition += 10

  // Table headers
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Date', 20, yPosition)
  doc.text('Student', 60, yPosition)
  doc.text('Urgency', 120, yPosition)
  doc.text('Status', 155, yPosition)
  yPosition += 7

  // Draw line under headers
  doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2)
  yPosition += 3

  // Booking entries
  doc.setFont('helvetica', 'normal')
  bookings
    .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
    .forEach((booking) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = 20
      }

      const date = new Date(booking.bookedAt).toLocaleDateString()
      doc.text(date, 20, yPosition)
      doc.text(booking.studentName, 60, yPosition)
      doc.text(booking.urgency.toUpperCase(), 120, yPosition)
      doc.text(booking.status.toUpperCase(), 155, yPosition)
      
      yPosition += 7

      // Add reason on next line if space allows
      if (yPosition < pageHeight - 40) {
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        const reason = booking.reason.length > 80 ? booking.reason.substring(0, 80) + '...' : booking.reason
        doc.text(`Reason: ${reason}`, 25, yPosition)
        yPosition += 5
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
      }
      
      yPosition += 3
    })

  // Footer
  yPosition = pageHeight - 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Generated on ${new Date().toLocaleDateString()} by Psynergy Mental Health Platform`, pageWidth / 2, yPosition, { align: 'center' })

  // Save the PDF
  doc.save(`counseling_bookings_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateComprehensiveReport = (patients: PatientMoodData[], bookings: Booking[]): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Comprehensive Mental Health Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Overall Statistics
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Overall Statistics', 20, yPosition)
  yPosition += 10

  const highRiskPatients = patients.filter(p => p.riskLevel === 'high').length
  const mediumRiskPatients = patients.filter(p => p.riskLevel === 'medium').length
  const lowRiskPatients = patients.filter(p => p.riskLevel === 'low').length
  const averageOverallMood = patients.reduce((sum, p) => sum + p.averageMood, 0) / patients.length

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Patients: ${patients.length}`, 20, yPosition)
  yPosition += 7
  doc.text(`High Risk Patients: ${highRiskPatients}`, 20, yPosition)
  yPosition += 7
  doc.text(`Medium Risk Patients: ${mediumRiskPatients}`, 20, yPosition)
  yPosition += 7
  doc.text(`Low Risk Patients: ${lowRiskPatients}`, 20, yPosition)
  yPosition += 7
  doc.text(`Average Mood Score: ${averageOverallMood.toFixed(1)}/10`, 20, yPosition)
  yPosition += 7
  doc.text(`Total Bookings: ${bookings.length}`, 20, yPosition)
  yPosition += 15

  // Risk Distribution
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Risk Distribution', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`High Risk: ${((highRiskPatients / patients.length) * 100).toFixed(1)}%`, 20, yPosition)
  yPosition += 7
  doc.text(`Medium Risk: ${((mediumRiskPatients / patients.length) * 100).toFixed(1)}%`, 20, yPosition)
  yPosition += 7
  doc.text(`Low Risk: ${((lowRiskPatients / patients.length) * 100).toFixed(1)}%`, 20, yPosition)
  yPosition += 15

  // Recommendations
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Recommendations', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  if (highRiskPatients > 0) {
    doc.text(`• Immediate attention needed for ${highRiskPatients} high-risk patients`, 20, yPosition)
    yPosition += 7
  }
  
  if (averageOverallMood < 5) {
    doc.text('• Overall mood scores indicate need for increased support services', 20, yPosition)
    yPosition += 7
  }
  
  doc.text('• Regular monitoring and follow-up sessions recommended', 20, yPosition)
  yPosition += 7
  doc.text('• Consider group therapy sessions for common issues', 20, yPosition)

  // Footer
  yPosition = pageHeight - 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Generated on ${new Date().toLocaleDateString()} by Psynergy Mental Health Platform`, pageWidth / 2, yPosition, { align: 'center' })

  // Save the PDF
  doc.save(`comprehensive_mental_health_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Enhanced patient report for doctor patient management
export const generateEnhancedPatientReport = (patient: any): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Enhanced Patient Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Patient Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Patient Information', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Name: ${patient.name}`, 20, yPosition)
  yPosition += 7
  doc.text(`USN: ${patient.usn}`, 20, yPosition)
  yPosition += 7
  doc.text(`College: ${patient.college}`, 20, yPosition)
  yPosition += 7
  doc.text(`Department: ${patient.department}`, 20, yPosition)
  yPosition += 7
  doc.text(`Email: ${patient.email}`, 20, yPosition)
  yPosition += 7
  if (patient.phone) {
    doc.text(`Phone: ${patient.phone}`, 20, yPosition)
    yPosition += 7
  }
  doc.text(`Linked Since: ${new Date(patient.linkedDate).toLocaleDateString()}`, 20, yPosition)
  yPosition += 15

  // Mental Health Summary
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Mental Health Summary', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Average Mood Score: ${patient.averageMood.toFixed(1)}/10`, 20, yPosition)
  yPosition += 7
  doc.text(`Risk Level: ${patient.riskLevel.toUpperCase()}`, 20, yPosition)
  yPosition += 7
  doc.text(`Total Mood Entries: ${patient.totalEntries}`, 20, yPosition)
  yPosition += 7
  doc.text(`Last Entry: ${new Date(patient.lastEntry).toLocaleDateString()}`, 20, yPosition)
  yPosition += 15

  // Recent Mood Trend
  if (patient.recentMoods && patient.recentMoods.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Recent Mood Trend (Last 7 Days)', 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    patient.recentMoods.forEach((mood: number, index: number) => {
      const moodDescription = mood <= 3 ? 'Poor' : mood <= 5 ? 'Fair' : mood <= 7 ? 'Good' : 'Excellent'
      doc.text(`Day ${index + 1}: ${mood}/10 (${moodDescription})`, 20, yPosition)
      yPosition += 7
    })
    yPosition += 10
  }

  // Doctor Notes
  if (patient.doctorNotes) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Doctor Notes', 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const notes = doc.splitTextToSize(patient.doctorNotes, 170)
    doc.text(notes, 20, yPosition)
    yPosition += notes.length * 7 + 10
  }

  // Treatment Suggestions
  if (patient.suggestions && patient.suggestions.length > 0) {
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Treatment Suggestions', 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    patient.suggestions.forEach((suggestion: any, index: number) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      const priorityIcon = suggestion.priority === 'high' ? '🔴' :
                          suggestion.priority === 'medium' ? '🟡' : '🟢'

      doc.setFont('helvetica', 'bold')
      doc.text(`${index + 1}. [${suggestion.category.toUpperCase()}] ${priorityIcon}`, 20, yPosition)
      yPosition += 7

      doc.setFont('helvetica', 'normal')
      const suggestionText = doc.splitTextToSize(suggestion.text, 170)
      doc.text(suggestionText, 25, yPosition)
      yPosition += suggestionText.length * 7

      doc.setFontSize(10)
      doc.text(`Added: ${new Date(suggestion.dateAdded).toLocaleDateString()} | Priority: ${suggestion.priority}`, 25, yPosition)
      yPosition += 10
      doc.setFontSize(12)
    })
  }

  // Recommendations
  if (yPosition > 200) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('General Recommendations', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  const recommendations = [
    '• Continue regular mood tracking and monitoring',
    '• Maintain consistent sleep schedule (7-9 hours)',
    '• Engage in regular physical activities',
    '• Practice stress management techniques',
    '• Attend scheduled counseling sessions',
    '• Reach out for support when needed'
  ]

  recommendations.forEach(rec => {
    doc.text(rec, 20, yPosition)
    yPosition += 7
  })

  // Footer
  yPosition += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Report generated on ${new Date().toLocaleDateString()} by Dr. ${patient.doctorName || 'Psynergy System'}`, 20, yPosition)

  // Save the PDF
  doc.save(`${patient.name}_enhanced_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateInstituteReport = async (analytics: InstituteAnalytics): Promise<void> => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Institute Mental Health Analytics Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Institute Information
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Institute Information', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Institution: ${analytics.instituteName}`, 20, yPosition)
  yPosition += 7
  doc.text(`Report Date: ${analytics.reportDate}`, 20, yPosition)
  yPosition += 7
  doc.text(`Report Period: Academic Year 2024-25`, 20, yPosition)
  yPosition += 15

  // Overall Statistics
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Overall Statistics', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Students Enrolled: ${analytics.totalStudents}`, 20, yPosition)
  yPosition += 7
  doc.text(`Active Students (Last 7 days): ${analytics.activeStudents}`, 20, yPosition)
  yPosition += 7
  doc.text(`Average Mood Score: ${analytics.averageMoodScore.toFixed(1)}/10`, 20, yPosition)
  yPosition += 7
  doc.text(`Total Counseling Sessions: ${analytics.totalSessions}`, 20, yPosition)
  yPosition += 7
  doc.text(`Completed Sessions: ${analytics.completedSessions}`, 20, yPosition)
  yPosition += 7
  doc.text(`Session Completion Rate: ${((analytics.completedSessions / analytics.totalSessions) * 100).toFixed(1)}%`, 20, yPosition)
  yPosition += 15

  // Risk Distribution
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Risk Distribution', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`High Risk Students: ${analytics.riskDistribution.high} (${((analytics.riskDistribution.high / analytics.totalStudents) * 100).toFixed(1)}%)`, 20, yPosition)
  yPosition += 7
  doc.text(`Medium Risk Students: ${analytics.riskDistribution.medium} (${((analytics.riskDistribution.medium / analytics.totalStudents) * 100).toFixed(1)}%)`, 20, yPosition)
  yPosition += 7
  doc.text(`Low Risk Students: ${analytics.riskDistribution.low} (${((analytics.riskDistribution.low / analytics.totalStudents) * 100).toFixed(1)}%)`, 20, yPosition)
  yPosition += 20

  // Department-wise Analytics
  if (yPosition > 200) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Department-wise Analytics', 20, yPosition)
  yPosition += 15

  // Table headers
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Department', 20, yPosition)
  doc.text('Students', 80, yPosition)
  doc.text('Avg Mood', 120, yPosition)
  doc.text('Risk Level', 150, yPosition)
  doc.text('Sessions', 180, yPosition)
  yPosition += 5

  // Draw line under headers
  doc.line(20, yPosition, 200, yPosition)
  yPosition += 5

  // Department data
  doc.setFont('helvetica', 'normal')
  analytics.departmentStats.forEach(dept => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }

    doc.text(dept.department, 20, yPosition)
    doc.text(dept.students.toString(), 80, yPosition)
    doc.text(dept.averageMood.toFixed(1), 120, yPosition)
    doc.text(dept.riskLevel.toUpperCase(), 150, yPosition)
    doc.text(dept.activeSessions.toString(), 180, yPosition)
    yPosition += 7
  })

  yPosition += 10

  // Monthly Trends
  if (yPosition > 200) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Monthly Trends', 20, yPosition)
  yPosition += 15

  // Monthly trends table
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Month', 20, yPosition)
  doc.text('Avg Mood', 60, yPosition)
  doc.text('Sessions', 100, yPosition)
  doc.text('Active Students', 140, yPosition)
  yPosition += 5

  doc.line(20, yPosition, 180, yPosition)
  yPosition += 5

  doc.setFont('helvetica', 'normal')
  analytics.monthlyTrends.forEach(trend => {
    doc.text(trend.month, 20, yPosition)
    doc.text(trend.moodScore.toFixed(1), 60, yPosition)
    doc.text(trend.sessions.toString(), 100, yPosition)
    doc.text(trend.students.toString(), 140, yPosition)
    yPosition += 7
  })

  yPosition += 15

  // Recommendations
  if (yPosition > 200) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Institutional Recommendations', 20, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  const recommendations = [
    '• Increase mental health awareness programs in high-risk departments',
    '• Implement peer support programs across all departments',
    '• Enhance counseling services during exam periods',
    '• Conduct regular mental health workshops for faculty',
    '• Establish department-specific stress management programs',
    '• Monitor and support students with declining mood trends',
    '• Strengthen collaboration between academic and counseling departments'
  ]

  recommendations.forEach(rec => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
    doc.text(rec, 20, yPosition)
    yPosition += 7
  })

  // Privacy Notice
  yPosition += 15
  if (yPosition > 250) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text('Privacy Notice: This report contains only aggregated, anonymized data.', 20, yPosition)
  yPosition += 5
  doc.text('No individual student information is included to maintain confidentiality.', 20, yPosition)

  // Footer
  yPosition += 15
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text(`Generated by Psynergy Mental Health System on ${new Date().toLocaleDateString()}`, 20, yPosition)

  // Save the PDF
  const fileName = `${analytics.instituteName.replace(/\s+/g, '_')}_Mental_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

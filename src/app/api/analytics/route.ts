import { NextRequest, NextResponse } from 'next/server'
import { 
  analyticsData,
  mentalHealthTrends,
  usagePatterns,
  systemAlerts,
  performanceMetrics,
  predictiveAnalytics,
  resourceEffectiveness,
  collegeInsights,
  generateWeeklyReport,
  generateMonthlyReport,
  getUnreadAlerts,
  getCriticalAlerts
} from '@/data/analytics'

// Get analytics data with filtering options
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const period = searchParams.get('period') || 'current'
    const department = searchParams.get('department')
    const includeAlerts = searchParams.get('includeAlerts') === 'true'

    // Return specific analytics type
    switch (type) {
      case 'overview':
        return NextResponse.json({
          summary: {
            totalUsers: analyticsData.totalUsers,
            activeUsers: analyticsData.activeUsers,
            assessmentsCompleted: analyticsData.assessmentsCompleted,
            appointmentsScheduled: analyticsData.appointmentsScheduled,
            resourcesAccessed: analyticsData.resourcesAccessed,
            forumPosts: analyticsData.forumPosts,
            riskAlerts: analyticsData.riskAlerts
          },
          trends: analyticsData.trends,
          alerts: includeAlerts ? getUnreadAlerts() : []
        })

      case 'mental_health':
        return NextResponse.json({
          assessmentResults: mentalHealthTrends.assessmentResults,
          riskFactors: mentalHealthTrends.riskFactors,
          interventionSuccess: mentalHealthTrends.interventionSuccess,
          departmentBreakdown: department 
            ? collegeInsights.departmentBreakdown.filter(d => d.department === department)
            : collegeInsights.departmentBreakdown
        })

      case 'usage_patterns':
        return NextResponse.json({
          timeOfDay: usagePatterns.timeOfDay,
          dayOfWeek: usagePatterns.dayOfWeek,
          demographics: usagePatterns.demographics,
          peakUsageHours: usagePatterns.timeOfDay
            .filter(hour => hour.usage > 60)
            .map(hour => hour.hour)
        })

      case 'alerts':
        const alertType = searchParams.get('alertType')
        const severity = searchParams.get('severity')
        
        let filteredAlerts = [...systemAlerts]
        
        if (alertType) {
          filteredAlerts = filteredAlerts.filter(alert => alert.type === alertType)
        }
        
        if (severity) {
          filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity)
        }

        return NextResponse.json({
          alerts: filteredAlerts,
          summary: {
            total: systemAlerts.length,
            unread: getUnreadAlerts().length,
            critical: getCriticalAlerts().length,
            byType: {
              high_risk_user: systemAlerts.filter(a => a.type === 'high_risk_user').length,
              system_issue: systemAlerts.filter(a => a.type === 'system_issue').length,
              content_moderation: systemAlerts.filter(a => a.type === 'content_moderation').length,
              appointment_reminder: systemAlerts.filter(a => a.type === 'appointment_reminder').length
            }
          }
        })

      case 'performance':
        return NextResponse.json({
          systemHealth: performanceMetrics.systemHealth,
          userEngagement: performanceMetrics.userEngagement,
          interventionMetrics: performanceMetrics.interventionMetrics,
          resourceEffectiveness: {
            mostAccessed: resourceEffectiveness.mostAccessedResources,
            completionRates: resourceEffectiveness.completionRates,
            userFeedback: resourceEffectiveness.userFeedback
          }
        })

      case 'predictive':
        return NextResponse.json({
          riskPrediction: predictiveAnalytics.riskPrediction,
          trendForecasting: predictiveAnalytics.trendForecasting,
          recommendations: [
            'Increase counselor availability during peak hours (6-10 PM)',
            'Develop targeted resources for academic pressure management',
            'Enhance crisis detection algorithms based on recent patterns',
            'Expand peer support program to handle growing demand'
          ]
        })

      case 'reports':
        const reportType = searchParams.get('reportType') || 'weekly'
        
        if (reportType === 'weekly') {
          return NextResponse.json({
            report: generateWeeklyReport(),
            generatedAt: new Date().toISOString(),
            type: 'weekly'
          })
        } else if (reportType === 'monthly') {
          return NextResponse.json({
            report: generateMonthlyReport(),
            generatedAt: new Date().toISOString(),
            type: 'monthly'
          })
        }
        break

      case 'college_insights':
        return NextResponse.json({
          departmentBreakdown: collegeInsights.departmentBreakdown,
          campusEvents: collegeInsights.campusEvents,
          interventionSuccess: collegeInsights.interventionSuccess,
          recommendations: [
            'Implement department-specific mental health programs',
            'Schedule more counselors during exam periods',
            'Expand peer support program based on success metrics',
            'Develop targeted interventions for high-risk departments'
          ]
        })

      default:
        // Return comprehensive dashboard data
        return NextResponse.json({
          overview: {
            totalUsers: analyticsData.totalUsers,
            activeUsers: analyticsData.activeUsers,
            assessmentsCompleted: analyticsData.assessmentsCompleted,
            appointmentsScheduled: analyticsData.appointmentsScheduled,
            riskAlerts: analyticsData.riskAlerts
          },
          trends: analyticsData.trends,
          alerts: getUnreadAlerts().slice(0, 5), // Latest 5 unread alerts
          performance: performanceMetrics,
          mentalHealthOverview: {
            riskFactors: mentalHealthTrends.riskFactors.slice(0, 3),
            interventionSuccess: mentalHealthTrends.interventionSuccess
          }
        })
    }

  } catch (error) {
    console.error('Get analytics error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// Update analytics data (for real-time updates)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data, userId } = body

    // Handle different types of analytics updates
    switch (type) {
      case 'user_activity':
        // Update user activity metrics
        // In production, this would update the database
        console.log('User activity recorded:', { userId, activity: data })
        break

      case 'assessment_completion':
        // Record assessment completion
        analyticsData.assessmentsCompleted += 1
        console.log('Assessment completed:', { userId, results: data })
        break

      case 'crisis_alert':
        // Create new crisis alert
        const newAlert = {
          id: `alert_${Date.now()}`,
          type: 'high_risk_user' as const,
          severity: data.severity || 'high' as const,
          message: data.message,
          userId,
          isRead: false,
          createdAt: new Date().toISOString()
        }
        systemAlerts.unshift(newAlert)
        console.log('Crisis alert created:', newAlert)
        break

      case 'appointment_scheduled':
        // Record appointment scheduling
        analyticsData.appointmentsScheduled += 1
        console.log('Appointment scheduled:', { userId, appointmentData: data })
        break

      case 'resource_access':
        // Record resource access
        analyticsData.resourcesAccessed += 1
        console.log('Resource accessed:', { userId, resourceId: data.resourceId })
        break

      case 'forum_activity':
        // Record forum activity
        if (data.action === 'post_created') {
          analyticsData.forumPosts += 1
        }
        console.log('Forum activity:', { userId, action: data.action })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: 'Analytics data updated successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Update analytics error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update analytics data' },
      { status: 500 }
    )
  }
}

// Mark alerts as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertIds, markAllRead } = body

    if (markAllRead) {
      // Mark all alerts as read
      systemAlerts.forEach(alert => {
        alert.isRead = true
      })
    } else if (alertIds && Array.isArray(alertIds)) {
      // Mark specific alerts as read
      alertIds.forEach(alertId => {
        const alert = systemAlerts.find(a => a.id === alertId)
        if (alert) {
          alert.isRead = true
        }
      })
    }

    return NextResponse.json({
      message: 'Alerts updated successfully',
      unreadCount: getUnreadAlerts().length
    })

  } catch (error) {
    console.error('Update alerts error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update alerts' },
      { status: 500 }
    )
  }
}

// Export analytics data (for reports)
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const reportType = searchParams.get('reportType') || 'comprehensive'

    let reportData
    
    switch (reportType) {
      case 'weekly':
        reportData = generateWeeklyReport()
        break
      case 'monthly':
        reportData = generateMonthlyReport()
        break
      case 'comprehensive':
        reportData = {
          overview: analyticsData,
          mentalHealth: mentalHealthTrends,
          usage: usagePatterns,
          performance: performanceMetrics,
          insights: collegeInsights,
          generatedAt: new Date().toISOString()
        }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        )
    }

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvData = Object.entries(reportData)
        .map(([key, value]) => `${key},${JSON.stringify(value)}`)
        .join('\n')
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${reportType}_report_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    return NextResponse.json({
      report: reportData,
      format,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Export analytics error:', error)
    
    return NextResponse.json(
      { error: 'Failed to export analytics data' },
      { status: 500 }
    )
  }
}

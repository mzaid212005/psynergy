'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  BellIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface Alert {
  id: string
  type: 'high_risk_user' | 'system_issue' | 'content_moderation' | 'appointment_reminder'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  userId?: string
  isRead: boolean
  createdAt: string
}

interface AlertsPanelProps {
  onMarkRead: (alertIds?: string[]) => void
  onRefresh: () => void
}

export function AlertsPanel({ onMarkRead, onRefresh }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    isRead: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])

  useEffect(() => {
    fetchAlerts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [alerts, filters, searchQuery])

  const fetchAlerts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/analytics?type=alerts')
      if (!response.ok) throw new Error('Failed to fetch alerts')
      
      const data = await response.json()
      setAlerts(data.alerts)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Failed to load alerts')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...alerts]

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(alert => alert.type === filters.type)
    }

    // Apply severity filter
    if (filters.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity)
    }

    // Apply read status filter
    if (filters.isRead) {
      const isRead = filters.isRead === 'read'
      filtered = filtered.filter(alert => alert.isRead === isRead)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort by creation date (newest first) and severity
    filtered.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
      if (severityDiff !== 0) return severityDiff
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    setFilteredAlerts(filtered)
  }

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await onMarkRead([alertId])
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ))
      toast.success('Alert marked as read')
    } catch (error) {
      toast.error('Failed to mark alert as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await onMarkRead()
      setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
      toast.success('All alerts marked as read')
    } catch (error) {
      toast.error('Failed to mark alerts as read')
    }
  }

  const handleBulkMarkAsRead = async () => {
    if (selectedAlerts.length === 0) return
    
    try {
      await onMarkRead(selectedAlerts)
      setAlerts(prev => prev.map(alert => 
        selectedAlerts.includes(alert.id) ? { ...alert, isRead: true } : alert
      ))
      setSelectedAlerts([])
      toast.success(`${selectedAlerts.length} alerts marked as read`)
    } catch (error) {
      toast.error('Failed to mark alerts as read')
    }
  }

  const toggleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    )
  }

  const selectAllVisible = () => {
    const visibleUnreadIds = filteredAlerts
      .filter(alert => !alert.isRead)
      .map(alert => alert.id)
    setSelectedAlerts(visibleUnreadIds)
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high_risk_user':
        return '🚨'
      case 'system_issue':
        return '⚠️'
      case 'content_moderation':
        return '🛡️'
      case 'appointment_reminder':
        return '📅'
      default:
        return '🔔'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const unreadCount = alerts.filter(alert => !alert.isRead).length

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {alerts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {unreadCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Unread</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Critical</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {alerts.filter(a => a.type === 'high_risk_user').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">High Risk Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle className="text-lg">Alert Management</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedAlerts.length > 0 && (
                <Button
                  onClick={handleBulkMarkAsRead}
                  size="sm"
                  variant="outline"
                >
                  Mark {selectedAlerts.length} as Read
                </Button>
              )}
              <Button
                onClick={selectAllVisible}
                size="sm"
                variant="outline"
              >
                Select All Unread
              </Button>
              <Button
                onClick={handleMarkAllAsRead}
                size="sm"
                variant="outline"
              >
                Mark All as Read
              </Button>
              <Button
                onClick={() => { fetchAlerts(); onRefresh(); }}
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="high_risk_user">High Risk User</option>
              <option value="system_issue">System Issue</option>
              <option value="content_moderation">Content Moderation</option>
              <option value="appointment_reminder">Appointment Reminder</option>
            </select>

            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.isRead}
              onChange={(e) => setFilters(prev => ({ ...prev, isRead: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Alerts List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No alerts found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchQuery || filters.type || filters.severity || filters.isRead
                  ? 'Try adjusting your filters'
                  : 'All caught up! No new alerts at this time.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border transition-all ${
                    alert.isRead 
                      ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                      : 'bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.includes(alert.id)}
                      onChange={() => toggleSelectAlert(alert.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    <div className="text-2xl">
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`text-sm font-medium ${
                            alert.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                          }`}>
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {alert.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>{formatTimeAgo(alert.createdAt)}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!alert.isRead && (
                            <Button
                              onClick={() => handleMarkAsRead(alert.id)}
                              size="sm"
                              variant="outline"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

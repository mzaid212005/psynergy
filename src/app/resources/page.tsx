'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  TagIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { Resource } from '@/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResourceCard } from '@/components/features/resource-card'
import { ResourceFilters } from '@/components/features/resource-filters'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface ResourceMetadata {
  categories: any[]
  tags: string[]
  difficultyLevels: any[]
  contentTypes: any[]
  totalResources: number
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [metadata, setMetadata] = useState<ResourceMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    tag: '',
    difficulty: '',
    type: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    fetchMetadata()
    fetchResources()
  }, [])

  useEffect(() => {
    fetchResources()
  }, [filters, searchQuery, pagination.page])

  const fetchMetadata = async () => {
    try {
      const response = await fetch('/api/resources?metadata=true')
      if (!response.ok) throw new Error('Failed to fetch metadata')
      
      const data = await response.json()
      setMetadata(data)
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  }

  const fetchResources = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      if (searchQuery) params.append('search', searchQuery)
      if (filters.category) params.append('category', filters.category)
      if (filters.tag) params.append('tag', filters.tag)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      if (filters.type) params.append('type', filters.type)

      const response = await fetch(`/api/resources?${params}`)
      if (!response.ok) throw new Error('Failed to fetch resources')
      
      const data = await response.json()
      setResources(data.resources)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error('Failed to load resources')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchResources()
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      tag: '',
      difficulty: '',
      type: ''
    })
    setSearchQuery('')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄'
      case 'video': return '🎥'
      case 'audio': return '🎧'
      case 'exercise': return '💪'
      case 'guide': return '📋'
      default: return '📄'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                <BookOpenIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Resource Hub</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mental health resources and educational content
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="sm">AI Support</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, topics, or keywords..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Filters */}
          {showFilters && metadata && (
            <ResourceFilters
              metadata={metadata}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
            />
          )}

          {/* Active Filters Display */}
          {(filters.category || filters.tag || filters.difficulty || filters.type || searchQuery) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  Search: "{searchQuery}"
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  Category: {filters.category}
                </span>
              )}
              {filters.tag && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  Tag: {filters.tag}
                </span>
              )}
              {filters.difficulty && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                  Level: {filters.difficulty}
                </span>
              )}
              {filters.type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                  Type: {filters.type}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isLoading ? 'Loading...' : `Showing ${resources.length} of ${pagination.total} resources`}
          </p>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/resources/${resource.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty}
                          </span>
                        </div>
                        {resource.duration && (
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                            <ClockIcon className="h-4 w-4" />
                            <span className="text-xs">{resource.duration}m</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {resource.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {resource.category}
                          </span>
                        </div>

                        {resource.tags.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <TagIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {resource.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {resource.tags.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{resource.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i
                  if (pageNum > pagination.totalPages) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

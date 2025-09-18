'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  ClockIcon,
  TagIcon,
  AcademicCapIcon,
  ShareIcon,
  BookmarkIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import { Resource } from '@/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ResourceCard } from '@/components/features/resource-card'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ResourceDetailPage() {
  const params = useParams()
  const resourceId = params.id as string
  
  const [resource, setResource] = useState<Resource | null>(null)
  const [relatedResources, setRelatedResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (resourceId) {
      fetchResource()
    }
  }, [resourceId])

  const fetchResource = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          trackView: true
        })
      })

      if (!response.ok) throw new Error('Failed to fetch resource')
      
      const data = await response.json()
      setResource(data.resource)
      setRelatedResources(data.relatedResources)
    } catch (error) {
      console.error('Error fetching resource:', error)
      toast.error('Failed to load resource')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && resource) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.description,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
    // TODO: Save bookmark to user preferences
  }

  const handlePrint = () => {
    window.print()
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Resource Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/resources">
            <Button>Back to Resources</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/resources">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Resource Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{getTypeIcon(resource.type)}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                  <span className="text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                    {resource.type}
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {resource.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {resource.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 ml-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Resource Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {resource.category}
              </span>
            </div>
            
            {resource.duration && (
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {resource.duration} minutes
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Published: {formatDate(resource.createdAt)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Language: {resource.language === 'en' ? 'English' : resource.language}
              </span>
            </div>
          </div>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="flex items-start space-x-2 mb-8">
              <TagIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Resource Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: resource.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h3>').replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-6 mb-4">') 
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedResources.map((relatedResource) => (
                <Link key={relatedResource.id} href={`/resources/${relatedResource.id}`}>
                  <ResourceCard resource={relatedResource} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Top */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top
          </Button>
        </div>
      </main>
    </div>
  )
}

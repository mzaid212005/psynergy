'use client'

import { Resource } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { ClockIcon, TagIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface ResourceCardProps {
  resource: Resource
  onClick?: () => void
}

export function ResourceCard({ resource, onClick }: ResourceCardProps) {
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
    <Card 
      className="h-full hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
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
  )
}

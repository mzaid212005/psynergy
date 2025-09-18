'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ResourceFiltersProps {
  metadata: {
    categories: any[]
    tags: string[]
    difficultyLevels: any[]
    contentTypes: any[]
  }
  filters: {
    category: string
    tag: string
    difficulty: string
    type: string
  }
  onFilterChange: (filters: any) => void
  onClear: () => void
}

export function ResourceFilters({ 
  metadata, 
  filters, 
  onFilterChange, 
  onClear 
}: ResourceFiltersProps) {
  const handleFilterUpdate = (key: string, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterUpdate('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {metadata.categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterUpdate('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Levels</option>
              {metadata.difficultyLevels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterUpdate('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              {metadata.contentTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Popular Tags
            </label>
            <select
              value={filters.tag}
              onChange={(e) => handleFilterUpdate('tag', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Tags</option>
              {metadata.tags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popular Tags as Buttons */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Filters:
          </p>
          <div className="flex flex-wrap gap-2">
            {metadata.tags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => handleFilterUpdate('tag', filters.tag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.tag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClear}>
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

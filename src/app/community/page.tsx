'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  FireIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { ForumPost } from '@/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreatePostModal } from '@/components/features/create-post-modal'
import { CommunityGuidelines } from '@/components/features/community-guidelines'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface ForumMetadata {
  categories: any[]
  totalPosts: number
  totalReplies: number
  activeUsers: number
  moderationStats: any
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [metadata, setMetadata] = useState<ForumMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'recent'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    fetchMetadata()
    fetchPosts()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [filters, searchQuery, pagination.page])

  const fetchMetadata = async () => {
    try {
      const response = await fetch('/api/forum?metadata=true')
      if (!response.ok) throw new Error('Failed to fetch metadata')
      
      const data = await response.json()
      setMetadata(data)
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy
      })

      if (searchQuery) params.append('search', searchQuery)
      if (filters.category) params.append('category', filters.category)

      const response = await fetch(`/api/forum?${params}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      setPosts(data.posts)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load community posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchPosts()
  }

  const handlePostCreated = () => {
    setShowCreatePost(false)
    fetchPosts()
    toast.success('Post created successfully!')
  }

  const handleVote = async (postId: string, action: 'upvote' | 'downvote') => {
    try {
      const response = await fetch('/api/forum', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action,
          userId: 'current_user' // TODO: Get from auth context
        })
      })

      if (!response.ok) throw new Error('Failed to vote')
      
      fetchPosts() // Refresh posts to show updated votes
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to vote on post')
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getCategoryColor = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Academic Stress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Mental Health': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Relationships': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'Family Issues': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Personal Growth': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
      'Wellness': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'Crisis Support': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Success Stories': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
    }
    return categoryMap[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-pink-600 to-purple-600">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Community Support</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with peers and share your experiences
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowGuidelines(true)}
                variant="outline"
                size="sm"
              >
                Guidelines
              </Button>
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Community Stats */}
      {metadata && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metadata.totalPosts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metadata.totalReplies}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Replies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metadata.activeUsers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metadata.categories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Create Post Button */}
              <Button
                onClick={() => setShowCreatePost(true)}
                className="w-full"
                size="lg"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Post
              </Button>

              {/* Categories */}
              {metadata && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.category === ''
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {metadata.categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          filters.category === category.id
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span className="text-sm">{category.name}</span>
                          </span>
                          <span className="text-xs text-gray-500">{category.postCount}</span>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Community Guidelines Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <HeartIcon className="h-5 w-5 text-red-500" />
                    <span>Community Guidelines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Help us maintain a safe and supportive environment for everyone.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGuidelines(true)}
                    className="w-full"
                  >
                    Read Full Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
                <div className="flex space-x-2">
                  {[
                    { key: 'recent', label: 'Recent', icon: ClockIcon },
                    { key: 'popular', label: 'Popular', icon: FireIcon },
                    { key: 'replies', label: 'Most Replies', icon: ChatBubbleBottomCenterTextIcon }
                  ].map(option => (
                    <button
                      key={option.key}
                      onClick={() => setFilters(prev => ({ ...prev, sortBy: option.key }))}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.sortBy === option.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <option.icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts List */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Be the first to start a conversation in this community!
                  </p>
                  <Button onClick={() => setShowCreatePost(true)}>
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/community/post/${post.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                                  {post.category}
                                </span>
                                {post.isAnonymous && (
                                  <div className="flex items-center space-x-1">
                                    <EyeSlashIcon className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs text-gray-500">Anonymous</span>
                                  </div>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(post.createdAt)}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {post.title}
                              </h3>
                              
                              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                                {post.content}
                              </p>

                              {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {post.tags.slice(0, 4).map(tag => (
                                    <span
                                      key={tag}
                                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {post.tags.length > 4 && (
                                    <span className="text-xs text-gray-500">
                                      +{post.tags.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleVote(post.id, 'upvote')
                                  }}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
                                >
                                  <span>👍</span>
                                  <span className="text-sm">{post.upvotes}</span>
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleVote(post.id, 'downvote')
                                  }}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                                >
                                  <span>👎</span>
                                  <span className="text-sm">{post.downvotes}</span>
                                </button>
                              </div>
                              
                              <div className="flex items-center space-x-1 text-gray-500">
                                <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                                <span className="text-sm">{(post as any).replyCount || 0} replies</span>
                              </div>
                            </div>
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
          </div>
        </div>

        {/* Modals */}
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
          categories={metadata?.categories || []}
        />

        <CommunityGuidelines
          isOpen={showGuidelines}
          onClose={() => setShowGuidelines(false)}
        />
      </main>
    </div>
  )
}

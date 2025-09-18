'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon,
  ShareIcon,
  ClockIcon,
  UserIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
  HandThumbDownIcon as HandThumbDownIconSolid
} from '@heroicons/react/24/solid'
import { ForumPost, ForumReply } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CommunityPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [post, setPost] = useState<ForumPost | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [isAnonymousReply, setIsAnonymousReply] = useState(false)

  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchReplies()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/forum?postId=${postId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Post not found')
          router.push('/community')
          return
        }
        throw new Error('Failed to fetch post')
      }
      
      const data = await response.json()
      setPost(data.post)
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load post')
      router.push('/community')
    }
  }

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/forum/replies?postId=${postId}`)
      if (!response.ok) throw new Error('Failed to fetch replies')
      
      const data = await response.json()
      setReplies(data.replies || [])
    } catch (error) {
      console.error('Error fetching replies:', error)
      toast.error('Failed to load replies')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (action: 'upvote' | 'downvote') => {
    if (!post) return
    
    try {
      const response = await fetch('/api/forum', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          action,
          userId: 'current_user' // TODO: Get from auth context
        })
      })

      if (!response.ok) throw new Error('Failed to vote')
      
      fetchPost() // Refresh post to show updated votes
      toast.success(`${action === 'upvote' ? 'Upvoted' : 'Downvoted'} successfully`)
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to vote on post')
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !post) return

    try {
      setIsSubmittingReply(true)
      
      const response = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          content: replyContent.trim(),
          isAnonymous: isAnonymousReply,
          userId: 'current_user' // TODO: Get from auth context
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.crisisDetected) {
          toast.error('Your reply contains content that suggests you may need immediate support. Please contact our crisis helpline.')
          return
        }
        throw new Error(data.error || 'Failed to post reply')
      }

      setReplyContent('')
      setIsAnonymousReply(false)
      fetchReplies()
      toast.success('Reply posted successfully!')

    } catch (error: any) {
      console.error('Error posting reply:', error)
      toast.error(error.message || 'Failed to post reply')
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Mental Health': 'bg-blue-100 text-blue-800 border-blue-200',
      'Academic Stress': 'bg-purple-100 text-purple-800 border-purple-200',
      'Relationships': 'bg-pink-100 text-pink-800 border-pink-200',
      'Career Guidance': 'bg-green-100 text-green-800 border-green-200',
      'General Support': 'bg-gray-100 text-gray-800 border-gray-200',
      'Crisis Support': 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/community">
              <Button>
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/community">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Community</span>
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <FlagIcon className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                      {post.isAnonymous && (
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <EyeSlashIcon className="w-3 h-3" />
                          <span>Anonymous</span>
                        </Badge>
                      )}
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h1>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{post.isAnonymous ? 'Anonymous' : 'Student'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                        <span>{replies.length} replies</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('upvote')}
                      className="flex items-center space-x-2"
                    >
                      <HandThumbUpIcon className="w-4 h-4" />
                      <span>{post.upvotes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('downvote')}
                      className="flex items-center space-x-2"
                    >
                      <HandThumbDownIcon className="w-4 h-4" />
                      <span>{post.downvotes}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                  <span>Add a Reply</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReplySubmit} className="space-y-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your thoughts or support..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    rows={4}
                    required
                  />
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isAnonymousReply}
                        onChange={(e) => setIsAnonymousReply(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Post anonymously
                      </span>
                    </label>
                    
                    <Button
                      type="submit"
                      disabled={isSubmittingReply || !replyContent.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Replies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                  <span>Replies ({replies.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {replies.length === 0 ? (
                  <div className="text-center py-8">
                    <ChatBubbleBottomCenterTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No replies yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Be the first to share your thoughts on this post!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {replies.map((reply, index) => (
                      <motion.div
                        key={reply.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {reply.isAnonymous ? 'Anonymous' : 'Student'}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(reply.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <HandThumbUpIcon className="w-4 h-4 mr-1" />
                              {reply.upvotes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <HandThumbDownIcon className="w-4 h-4 mr-1" />
                              {reply.downvotes}
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { 
  forumPosts, 
  forumReplies,
  forumCategories,
  getPostsByCategory,
  getPostsByTag,
  searchPosts,
  getRepliesForPost,
  detectCrisisContent,
  moderationKeywords
} from '@/data/forum'
import { ForumPost, ForumReply } from '@/types'

// Get forum posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'recent'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const includeReplies = searchParams.get('includeReplies') === 'true'
    const metadata = searchParams.get('metadata') === 'true'

    // Get individual post by ID
    if (postId) {
      const post = forumPosts.find(p => p.id === postId)
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      // Include replies if requested
      const postWithReplies = includeReplies
        ? { ...post, replies: getRepliesForPost(postId) }
        : post

      return NextResponse.json({ post: postWithReplies })
    }

    // Return metadata (categories, tags, etc.)
    if (metadata) {
      return NextResponse.json({
        categories: forumCategories,
        totalPosts: forumPosts.length,
        totalReplies: forumReplies.length,
        activeUsers: 150, // Mock data
        moderationStats: {
          postsModerated: 12,
          crisisInterventions: 3,
          communityReports: 5
        }
      })
    }

    let filteredPosts = [...forumPosts]

    // Apply filters
    if (category) {
      filteredPosts = getPostsByCategory(category)
    } else if (tag) {
      filteredPosts = getPostsByTag(tag)
    } else if (search) {
      filteredPosts = searchPosts(search)
    }

    // Sort posts
    switch (sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
        break
      case 'recent':
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'replies':
        filteredPosts.sort((a, b) => b.replies.length - a.replies.length)
        break
      default:
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    // Include replies if requested
    const postsWithReplies = includeReplies 
      ? paginatedPosts.map(post => ({
          ...post,
          replies: getRepliesForPost(post.id)
        }))
      : paginatedPosts.map(post => ({
          ...post,
          replyCount: getRepliesForPost(post.id).length
        }))

    return NextResponse.json({
      posts: postsWithReplies,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit),
        hasNext: endIndex < filteredPosts.length,
        hasPrev: page > 1
      },
      filters: {
        category,
        tag,
        search,
        sortBy
      }
    })

  } catch (error) {
    console.error('Get forum posts error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    )
  }
}

// Create new forum post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      content, 
      category, 
      tags, 
      isAnonymous,
      userId 
    } = body

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for crisis content
    const containsCrisisContent = detectCrisisContent(content) || detectCrisisContent(title)
    
    if (containsCrisisContent) {
      // Flag for immediate moderation and crisis intervention
      console.log('Crisis content detected in forum post')
      
      // TODO: Trigger crisis intervention protocol
      // - Notify moderators immediately
      // - Send crisis resources to user
      // - Potentially auto-hide post pending review
      
      return NextResponse.json({
        error: 'Your post contains content that suggests you may need immediate support. Please contact our crisis helpline at 91529-87821 or emergency services at 112.',
        crisisDetected: true,
        resources: {
          crisis_helpline: '91529-87821',
          emergency: '112',
          campus_counseling: 'Available 24/7'
        }
      }, { status: 400 })
    }

    // Check for inappropriate content
    const hasInappropriateContent = moderationKeywords.slice(10).some(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase()) ||
      title.toLowerCase().includes(keyword.toLowerCase())
    )

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      userId: isAnonymous ? `anonymous_${Date.now()}` : (userId || 'current_user'),
      title,
      content,
      category,
      isAnonymous: isAnonymous || false,
      tags: tags || [],
      upvotes: 0,
      downvotes: 0,
      replies: [],
      isModerated: !hasInappropriateContent, // Auto-approve if no inappropriate content
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to posts array (in production, save to database)
    forumPosts.unshift(newPost)

    // If flagged for moderation, notify moderators
    if (hasInappropriateContent) {
      console.log('Post flagged for moderation:', newPost.id)
      // TODO: Notify moderators
    }

    return NextResponse.json({
      post: newPost,
      message: hasInappropriateContent 
        ? 'Post submitted for moderation review'
        : 'Post created successfully',
      requiresModeration: hasInappropriateContent
    })

  } catch (error) {
    console.error('Create forum post error:', error)
    
    return NextResponse.json(
      { error: 'Failed to create forum post' },
      { status: 500 }
    )
  }
}

// Update post (vote, edit, moderate)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, action, userId, content, moderatorId } = body

    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const postIndex = forumPosts.findIndex(post => post.id === postId)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const post = forumPosts[postIndex]

    switch (action) {
      case 'upvote':
        post.upvotes += 1
        break
        
      case 'downvote':
        post.downvotes += 1
        break
        
      case 'edit':
        if (post.userId !== userId && !moderatorId) {
          return NextResponse.json(
            { error: 'Unauthorized to edit this post' },
            { status: 403 }
          )
        }
        if (content) {
          post.content = content
          post.updatedAt = new Date().toISOString()
        }
        break
        
      case 'moderate':
        if (!moderatorId) {
          return NextResponse.json(
            { error: 'Moderator access required' },
            { status: 403 }
          )
        }
        post.isModerated = true
        break
        
      case 'hide':
        if (!moderatorId) {
          return NextResponse.json(
            { error: 'Moderator access required' },
            { status: 403 }
          )
        }
        // Remove from public view
        forumPosts.splice(postIndex, 1)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      post: forumPosts[postIndex],
      message: `Post ${action} successful`
    })

  } catch (error) {
    console.error('Update forum post error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update forum post' },
      { status: 500 }
    )
  }
}

// Delete post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const userId = searchParams.get('userId')
    const moderatorId = searchParams.get('moderatorId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const postIndex = forumPosts.findIndex(post => post.id === postId)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const post = forumPosts[postIndex]

    // Check permissions
    if (post.userId !== userId && !moderatorId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      )
    }

    // Remove post and associated replies
    forumPosts.splice(postIndex, 1)
    
    // Remove replies
    const replyIndices = []
    for (let i = forumReplies.length - 1; i >= 0; i--) {
      if (forumReplies[i].postId === postId) {
        replyIndices.push(i)
      }
    }
    replyIndices.forEach(index => forumReplies.splice(index, 1))

    return NextResponse.json({
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Delete forum post error:', error)
    
    return NextResponse.json(
      { error: 'Failed to delete forum post' },
      { status: 500 }
    )
  }
}

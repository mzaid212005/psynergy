import { NextRequest, NextResponse } from 'next/server'
import { forumReplies, detectCrisisContent, moderationKeywords } from '@/data/forum'
import { ForumReply } from '@/types'

// Get replies for a specific post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'recent'

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    let replies = forumReplies.filter(reply => reply.postId === postId)

    // Sort replies
    switch (sortBy) {
      case 'popular':
        replies.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
        break
      case 'recent':
        replies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      default:
        replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReplies = replies.slice(startIndex, endIndex)

    return NextResponse.json({
      replies: paginatedReplies,
      pagination: {
        page,
        limit,
        total: replies.length,
        totalPages: Math.ceil(replies.length / limit),
        hasNext: endIndex < replies.length,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Get forum replies error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch forum replies' },
      { status: 500 }
    )
  }
}

// Create new reply
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, content, isAnonymous, userId } = body

    // Validate required fields
    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for crisis content
    const containsCrisisContent = detectCrisisContent(content)
    
    if (containsCrisisContent) {
      console.log('Crisis content detected in forum reply')
      
      return NextResponse.json({
        error: 'Your reply contains content that suggests you may need immediate support. Please contact our crisis helpline at 91529-87821 or emergency services at 112.',
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
      content.toLowerCase().includes(keyword.toLowerCase())
    )

    const newReply: ForumReply = {
      id: `reply_${Date.now()}`,
      postId,
      userId: isAnonymous ? `anonymous_${Date.now()}` : (userId || 'current_user'),
      content,
      isAnonymous: isAnonymous || false,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString()
    }

    // Add to replies array (in production, save to database)
    forumReplies.push(newReply)

    // If flagged for moderation, notify moderators
    if (hasInappropriateContent) {
      console.log('Reply flagged for moderation:', newReply.id)
      // TODO: Notify moderators
    }

    return NextResponse.json({
      reply: newReply,
      message: hasInappropriateContent 
        ? 'Reply submitted for moderation review'
        : 'Reply created successfully',
      requiresModeration: hasInappropriateContent
    })

  } catch (error) {
    console.error('Create forum reply error:', error)
    
    return NextResponse.json(
      { error: 'Failed to create forum reply' },
      { status: 500 }
    )
  }
}

// Update reply (vote, edit, moderate)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { replyId, action, userId, content, moderatorId } = body

    if (!replyId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const replyIndex = forumReplies.findIndex(reply => reply.id === replyId)
    
    if (replyIndex === -1) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      )
    }

    const reply = forumReplies[replyIndex]

    switch (action) {
      case 'upvote':
        reply.upvotes += 1
        break
        
      case 'downvote':
        reply.downvotes += 1
        break
        
      case 'edit':
        if (reply.userId !== userId && !moderatorId) {
          return NextResponse.json(
            { error: 'Unauthorized to edit this reply' },
            { status: 403 }
          )
        }
        if (content) {
          reply.content = content
        }
        break
        
      case 'hide':
        if (!moderatorId) {
          return NextResponse.json(
            { error: 'Moderator access required' },
            { status: 403 }
          )
        }
        // Remove from public view
        forumReplies.splice(replyIndex, 1)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      reply: forumReplies[replyIndex],
      message: `Reply ${action} successful`
    })

  } catch (error) {
    console.error('Update forum reply error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update forum reply' },
      { status: 500 }
    )
  }
}

// Delete reply
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const replyId = searchParams.get('replyId')
    const userId = searchParams.get('userId')
    const moderatorId = searchParams.get('moderatorId')

    if (!replyId) {
      return NextResponse.json(
        { error: 'Reply ID is required' },
        { status: 400 }
      )
    }

    const replyIndex = forumReplies.findIndex(reply => reply.id === replyId)
    
    if (replyIndex === -1) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      )
    }

    const reply = forumReplies[replyIndex]

    // Check permissions
    if (reply.userId !== userId && !moderatorId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this reply' },
        { status: 403 }
      )
    }

    // Remove reply
    forumReplies.splice(replyIndex, 1)

    return NextResponse.json({
      message: 'Reply deleted successfully'
    })

  } catch (error) {
    console.error('Delete forum reply error:', error)
    
    return NextResponse.json(
      { error: 'Failed to delete forum reply' },
      { status: 500 }
    )
  }
}

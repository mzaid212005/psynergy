import { NextRequest, NextResponse } from 'next/server'
import { 
  resources, 
  getResourcesByCategory, 
  getResourcesByTag, 
  getResourcesByDifficulty,
  getResourcesByType,
  searchResources,
  getRecommendedResources,
  resourceCategories,
  popularTags,
  difficultyLevels,
  contentTypes
} from '@/data/resources'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const difficulty = searchParams.get('difficulty')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const recommended = searchParams.get('recommended')
    const metadata = searchParams.get('metadata')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Return metadata (categories, tags, etc.)
    if (metadata === 'true') {
      return NextResponse.json({
        categories: resourceCategories,
        tags: popularTags,
        difficultyLevels,
        contentTypes,
        totalResources: resources.length
      })
    }

    let filteredResources = resources

    // Apply filters
    if (category) {
      filteredResources = getResourcesByCategory(category)
    } else if (tag) {
      filteredResources = getResourcesByTag(tag)
    } else if (difficulty) {
      filteredResources = getResourcesByDifficulty(difficulty)
    } else if (type) {
      filteredResources = getResourcesByType(type)
    } else if (search) {
      filteredResources = searchResources(search)
    } else if (recommended === 'true') {
      // TODO: Get user interests from auth context
      const userInterests = ['anxiety', 'stress', 'academic']
      const userLevel = 'beginner'
      filteredResources = getRecommendedResources(userInterests, userLevel)
    }

    // Sort by creation date (newest first)
    filteredResources.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResources = filteredResources.slice(startIndex, endIndex)

    // For list view, don't include full content to reduce payload
    const resourcesForList = paginatedResources.map(resource => ({
      ...resource,
      content: undefined, // Remove content for list view
      contentPreview: resource.content.substring(0, 200) + '...'
    }))

    return NextResponse.json({
      resources: resourcesForList,
      pagination: {
        page,
        limit,
        total: filteredResources.length,
        totalPages: Math.ceil(filteredResources.length / limit),
        hasNext: endIndex < filteredResources.length,
        hasPrev: page > 1
      },
      filters: {
        category,
        tag,
        difficulty,
        type,
        search
      }
    })

  } catch (error) {
    console.error('Get resources error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

// Get specific resource by ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resourceId, trackView = false } = body

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    const resource = resources.find(r => r.id === resourceId)

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // TODO: Track resource view for analytics
    if (trackView) {
      // Log resource view event
      console.log(`Resource viewed: ${resourceId}`)
    }

    // Get related resources (same category or tags)
    const relatedResources = resources
      .filter(r => 
        r.id !== resourceId && (
          r.category === resource.category ||
          r.tags.some(tag => resource.tags.includes(tag))
        )
      )
      .slice(0, 4)
      .map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        type: r.type,
        category: r.category,
        difficulty: r.difficulty,
        duration: r.duration
      }))

    return NextResponse.json({
      resource,
      relatedResources
    })

  } catch (error) {
    console.error('Get resource details error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch resource details' },
      { status: 500 }
    )
  }
}

// Create new resource (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      content, 
      type, 
      category, 
      tags, 
      language, 
      difficulty, 
      duration 
    } = body

    // TODO: Verify admin permissions
    // const user = await getAuthenticatedUser(request)
    // if (user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    // Validate required fields
    if (!title || !description || !content || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newResource = {
      id: `resource_${Date.now()}`,
      title,
      description,
      content,
      type,
      category,
      tags: tags || [],
      language: language || 'en',
      difficulty: difficulty || 'beginner',
      duration: duration || 10,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // TODO: Save to database
    resources.push(newResource)

    return NextResponse.json({
      resource: newResource,
      message: 'Resource created successfully'
    })

  } catch (error) {
    console.error('Create resource error:', error)
    
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}

// Update existing resource (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { resourceId, updates } = body

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    // TODO: Verify admin permissions
    
    const resourceIndex = resources.findIndex(r => r.id === resourceId)
    
    if (resourceIndex === -1) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Update resource
    resources[resourceIndex] = {
      ...resources[resourceIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      resource: resources[resourceIndex],
      message: 'Resource updated successfully'
    })

  } catch (error) {
    console.error('Update resource error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

// Delete resource (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('resourceId')

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      )
    }

    // TODO: Verify admin permissions

    const resourceIndex = resources.findIndex(r => r.id === resourceId)
    
    if (resourceIndex === -1) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Remove resource
    resources.splice(resourceIndex, 1)

    return NextResponse.json({
      message: 'Resource deleted successfully'
    })

  } catch (error) {
    console.error('Delete resource error:', error)
    
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}

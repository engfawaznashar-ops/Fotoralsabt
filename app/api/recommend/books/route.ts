/**
 * Book Recommendations API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { recommendBooks, recommendBooksByTopic, recommendSimilarBooks } from '@/lib/ai/recommendations/recommendBooks'
import type { UserProfile } from '@/lib/ai/shared/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const bookId = searchParams.get('similarTo')
    const topic = searchParams.get('topic')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '5')
    const excludeIds = searchParams.get('exclude')?.split(',') || []

    // Get similar books
    if (bookId) {
      const similar = await recommendSimilarBooks(bookId, limit)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'similar',
          basedOn: bookId,
          recommendations: similar,
          count: similar.length
        })
      )
    }

    // Get books by topic
    if (topic) {
      const topicBooks = await recommendBooksByTopic(topic, limit)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'topic',
          topic,
          recommendations: topicBooks,
          count: topicBooks.length
        })
      )
    }

    // Get personalized recommendations
    const userProfile: Partial<UserProfile> = {
      userId: userId || 'anonymous',
      favoriteTopics: [],
      engagementScore: 50
    }

    const recommendations = await recommendBooks(userProfile, {
      limit,
      excludeIds,
      category: category || undefined
    })

    return NextResponse.json(
      createAPIResponse(true, {
        type: 'personalized',
        userId: userId || 'anonymous',
        category: category || 'all',
        recommendations: recommendations.items,
        algorithm: recommendations.algorithm,
        confidence: recommendations.confidence,
        generatedAt: recommendations.generatedAt
      })
    )

  } catch (error) {
    console.error('Book recommendations error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'RECOMMENDATION_ERROR',
        message: 'Failed to generate book recommendations',
        messageAr: 'فشل في توليد توصيات الكتب'
      }),
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, options = {} } = body

    if (!userProfile) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_PROFILE',
          message: 'User profile is required',
          messageAr: 'ملف المستخدم مطلوب'
        }),
        { status: 400 }
      )
    }

    const recommendations = await recommendBooks(userProfile, {
      limit: options.limit || 5,
      excludeIds: options.excludeIds || [],
      category: options.category
    })

    return NextResponse.json(
      createAPIResponse(true, {
        recommendations: recommendations.items,
        algorithm: recommendations.algorithm,
        confidence: recommendations.confidence,
        basedOn: recommendations.basedOn,
        generatedAt: recommendations.generatedAt
      })
    )

  } catch (error) {
    console.error('Book recommendations error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'RECOMMENDATION_ERROR',
        message: 'Failed to generate book recommendations',
        messageAr: 'فشل في توليد توصيات الكتب'
      }),
      { status: 500 }
    )
  }
}




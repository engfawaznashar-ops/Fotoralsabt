/**
 * Speaker Recommendations API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { recommendSpeakers, recommendSpeakersByTopic, recommendSimilarSpeakers } from '@/lib/ai/recommendations/recommendSpeakers'
import type { UserProfile } from '@/lib/ai/shared/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const speakerId = searchParams.get('similarTo')
    const topic = searchParams.get('topic')
    const limit = parseInt(searchParams.get('limit') || '5')
    const excludeIds = searchParams.get('exclude')?.split(',') || []

    // Get similar speakers
    if (speakerId) {
      const similar = await recommendSimilarSpeakers(speakerId, limit)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'similar',
          basedOn: speakerId,
          recommendations: similar,
          count: similar.length
        })
      )
    }

    // Get speakers by topic
    if (topic) {
      const topicSpeakers = await recommendSpeakersByTopic(topic, limit)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'topic',
          topic,
          recommendations: topicSpeakers,
          count: topicSpeakers.length
        })
      )
    }

    // Get personalized recommendations
    const userProfile: Partial<UserProfile> = {
      userId: userId || 'anonymous',
      favoriteTopics: [],
      engagementScore: 50
    }

    const recommendations = await recommendSpeakers(userProfile, {
      limit,
      excludeIds
    })

    return NextResponse.json(
      createAPIResponse(true, {
        type: 'personalized',
        userId: userId || 'anonymous',
        recommendations: recommendations.items,
        algorithm: recommendations.algorithm,
        confidence: recommendations.confidence,
        generatedAt: recommendations.generatedAt
      })
    )

  } catch (error) {
    console.error('Speaker recommendations error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'RECOMMENDATION_ERROR',
        message: 'Failed to generate speaker recommendations',
        messageAr: 'فشل في توليد توصيات المتحدثين'
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

    const recommendations = await recommendSpeakers(userProfile, {
      limit: options.limit || 5,
      excludeIds: options.excludeIds || []
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
    console.error('Speaker recommendations error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'RECOMMENDATION_ERROR',
        message: 'Failed to generate speaker recommendations',
        messageAr: 'فشل في توليد توصيات المتحدثين'
      }),
      { status: 500 }
    )
  }
}




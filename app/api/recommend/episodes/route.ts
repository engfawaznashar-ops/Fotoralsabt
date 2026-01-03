/**
 * Episode Recommendations API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { recommendEpisodes, recommendSimilarEpisodes } from '@/lib/ai/recommendations/recommendEpisodes'
import type { UserProfile } from '@/lib/ai/shared/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const episodeId = searchParams.get('similarTo')
    const limit = parseInt(searchParams.get('limit') || '5')
    const excludeIds = searchParams.get('exclude')?.split(',') || []

    // Get similar episodes
    if (episodeId) {
      const similar = await recommendSimilarEpisodes(episodeId, limit)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'similar',
          basedOn: episodeId,
          recommendations: similar,
          count: similar.length
        })
      )
    }

    // Get personalized recommendations
    const userProfile: Partial<UserProfile> = {
      userId: userId || 'anonymous',
      favoriteTopics: [],
      engagementScore: 50
    }

    const recommendations = await recommendEpisodes(userProfile, {
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
    console.error('Episode recommendations error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'RECOMMENDATION_ERROR',
        message: 'Failed to generate episode recommendations',
        messageAr: 'فشل في توليد توصيات الحلقات'
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

    const recommendations = await recommendEpisodes(userProfile, {
      limit: options.limit || 5,
      excludeIds: options.excludeIds || [],
      basedOn: options.basedOn || 'mixed'
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
    console.error('Episode recommendations error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'RECOMMENDATION_ERROR',
        message: 'Failed to generate episode recommendations',
        messageAr: 'فشل في توليد توصيات الحلقات'
      }),
      { status: 500 }
    )
  }
}




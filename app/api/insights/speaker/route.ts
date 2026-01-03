/**
 * Speaker Insights API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { getSpeakerInsights, compareSpeakers } from '@/lib/ai/insights/getSpeakerInsights'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const speakerId = searchParams.get('speakerId')
    const compareIds = searchParams.get('compare')?.split(',')

    // Compare multiple speakers
    if (compareIds && compareIds.length > 1) {
      const comparison = await compareSpeakers(compareIds)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'comparison',
          speakerIds: compareIds,
          comparison
        })
      )
    }

    // Get single speaker insights
    if (!speakerId) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_SPEAKER_ID',
          message: 'Speaker ID is required',
          messageAr: 'معرف المتحدث مطلوب'
        }),
        { status: 400 }
      )
    }

    const insights = await getSpeakerInsights(speakerId)

    if (!insights) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'SPEAKER_NOT_FOUND',
          message: 'Speaker not found or no insights available',
          messageAr: 'المتحدث غير موجود أو لا توجد رؤى متاحة'
        }),
        { status: 404 }
      )
    }

    return NextResponse.json(
      createAPIResponse(true, {
        speakerId,
        insights: {
          name: insights.name,
          topTopics: insights.topTopics,
          impactScores: insights.impactScores,
          frequentBooks: insights.frequentBooks,
          appearanceStats: insights.appearanceStats,
          aiPersona: insights.aiPersona,
          aiPersonaDescription: insights.aiPersonaDescription
        }
      })
    )

  } catch (error) {
    console.error('Speaker insights error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'INSIGHTS_ERROR',
        message: 'Failed to generate speaker insights',
        messageAr: 'فشل في توليد رؤى المتحدث'
      }),
      { status: 500 }
    )
  }
}




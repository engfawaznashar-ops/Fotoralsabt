/**
 * Episode Insights API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { getEpisodeInsights, compareEpisodeInsights } from '@/lib/ai/insights/getEpisodeInsights'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const episodeId = searchParams.get('episodeId')
    const compareIds = searchParams.get('compare')?.split(',')

    // Compare multiple episodes
    if (compareIds && compareIds.length > 1) {
      const comparison = await compareEpisodeInsights(compareIds)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'comparison',
          episodeIds: compareIds,
          comparison
        })
      )
    }

    // Get single episode insights
    if (!episodeId) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_EPISODE_ID',
          message: 'Episode ID is required',
          messageAr: 'معرف الحلقة مطلوب'
        }),
        { status: 400 }
      )
    }

    const insights = await getEpisodeInsights(episodeId)

    if (!insights) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'EPISODE_NOT_FOUND',
          message: 'Episode not found or no insights available',
          messageAr: 'الحلقة غير موجودة أو لا توجد رؤى متاحة'
        }),
        { status: 404 }
      )
    }

    return NextResponse.json(
      createAPIResponse(true, {
        episodeId,
        insights: {
          mood: insights.mood,
          moodAr: insights.moodAr,
          topIdeas: insights.topIdeas,
          mostImpactfulSpeaker: insights.mostImpactfulSpeaker,
          mostMentionedBook: insights.mostMentionedBook,
          summary: insights.summary,
          summaryAr: insights.summaryAr,
          keyTakeaways: insights.keyTakeaways,
          keyTakeawaysAr: insights.keyTakeawaysAr,
          statistics: insights.statistics
        }
      })
    )

  } catch (error) {
    console.error('Episode insights error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'INSIGHTS_ERROR',
        message: 'Failed to generate episode insights',
        messageAr: 'فشل في توليد رؤى الحلقة'
      }),
      { status: 500 }
    )
  }
}




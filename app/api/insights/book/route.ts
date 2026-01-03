/**
 * Book Insights API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse } from '@/lib/ai/shared/utils'
import { getBookInsights, getBookStats, getBooksByCategory, compareBooks } from '@/lib/ai/insights/getBookInsights'
import type { BookCategoryType } from '@/lib/ai/shared/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')
    const compareIds = searchParams.get('compare')?.split(',')
    const category = searchParams.get('category') as BookCategoryType | null
    const statsOnly = searchParams.get('statsOnly') === 'true'

    // Get books by category
    if (category) {
      const books = await getBooksByCategory(category)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'category',
          category,
          books,
          count: books.length
        })
      )
    }

    // Compare multiple books
    if (compareIds && compareIds.length > 1) {
      const comparison = await compareBooks(compareIds)

      return NextResponse.json(
        createAPIResponse(true, {
          type: 'comparison',
          bookIds: compareIds,
          comparison
        })
      )
    }

    // Get single book insights
    if (!bookId) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_BOOK_ID',
          message: 'Book ID is required',
          messageAr: 'معرف الكتاب مطلوب'
        }),
        { status: 400 }
      )
    }

    // Stats only mode
    if (statsOnly) {
      const stats = await getBookStats(bookId)

      if (!stats) {
        return NextResponse.json(
          createAPIResponse(false, undefined, {
            code: 'BOOK_NOT_FOUND',
            message: 'Book not found',
            messageAr: 'الكتاب غير موجود'
          }),
          { status: 404 }
        )
      }

      return NextResponse.json(
        createAPIResponse(true, {
          bookId,
          stats
        })
      )
    }

    // Full insights
    const insights = await getBookInsights(bookId)

    if (!insights) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'BOOK_NOT_FOUND',
          message: 'Book not found or no insights available',
          messageAr: 'الكتاب غير موجود أو لا توجد رؤى متاحة'
        }),
        { status: 404 }
      )
    }

    return NextResponse.json(
      createAPIResponse(true, {
        bookId,
        insights: {
          title: insights.title,
          author: insights.author,
          category: insights.category,
          rating: insights.rating,
          aiSummary: insights.aiSummary,
          aiSummaryAr: insights.aiSummaryAr,
          discussedInEpisodes: insights.discussedInEpisodes,
          relatedSpeakers: insights.relatedSpeakers,
          topQuotes: insights.topQuotes,
          // Extended fields for book details page
          keyIdeas: insights.keyIdeas,
          whyImportant: insights.whyImportant,
          bestEpisode: insights.bestEpisode,
          relatedConcepts: insights.relatedConcepts,
          toneAnalysis: insights.toneAnalysis,
          audienceFit: insights.audienceFit,
        }
      })
    )

  } catch (error) {
    console.error('Book insights error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'INSIGHTS_ERROR',
        message: 'Failed to generate book insights',
        messageAr: 'فشل في توليد رؤى الكتاب'
      }),
      { status: 500 }
    )
  }
}


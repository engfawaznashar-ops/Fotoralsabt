import { NextRequest, NextResponse } from 'next/server'
import { searchBooks, lookupBookByISBN } from '@/lib/books/providers'
import { generateBookIntelligence, translateToArabic } from '@/lib/books/bookIntelligence'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/books/lookup
 * البحث عن كتاب وإثراء بياناته بالذكاء الاصطناعي
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { isbn, title, author } = body

    if (!isbn && !title) {
      return NextResponse.json(
        { error: 'يجب توفير ISBN أو العنوان على الأقل' },
        { status: 400 }
      )
    }

    // البحث عن الكتاب
    let bookMetadata
    if (isbn) {
      bookMetadata = await lookupBookByISBN(isbn)
    } else {
      const results = await searchBooks({ title, author })
      bookMetadata = results[0] || null
    }

    if (!bookMetadata) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الكتاب' },
        { status: 404 }
      )
    }

    // ترجمة العنوان والوصف للعربية إذا لزم
    if (!bookMetadata.titleAr || bookMetadata.titleAr === bookMetadata.titleEn) {
      bookMetadata.titleAr = await translateToArabic(bookMetadata.title, 'title')
    }

    if (bookMetadata.description && !bookMetadata.descriptionAr) {
      bookMetadata.descriptionAr = await translateToArabic(
        bookMetadata.description.substring(0, 500), 
        'description'
      )
    }

    // توليد ذكاء الكتاب
    const intelligence = await generateBookIntelligence(
      bookMetadata.titleAr || bookMetadata.title,
      bookMetadata.authors[0] || author || 'غير معروف',
      bookMetadata.descriptionAr || bookMetadata.description
    )

    // دمج البيانات
    const enrichedBook = {
      ...bookMetadata,
      titleAr: bookMetadata.titleAr,
      descriptionAr: bookMetadata.descriptionAr,
      aiSummaryAr: intelligence.summaryAr,
      aiKeyTakeaways: intelligence.keyTakeaways,
      aiForWho: intelligence.forWho,
      aiSimilarBooks: intelligence.similarBooks,
      aiKnowledgeTags: intelligence.knowledgeTags
    }

    return NextResponse.json({
      success: true,
      data: enrichedBook
    })
  } catch (error) {
    console.error('Book lookup error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء البحث عن الكتاب' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/books/lookup?isbn=...
 * البحث السريع بـISBN
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isbn = searchParams.get('isbn')
    const title = searchParams.get('title')
    const author = searchParams.get('author')

    if (!isbn && !title) {
      return NextResponse.json(
        { error: 'يجب توفير ISBN أو العنوان' },
        { status: 400 }
      )
    }

    const results = await searchBooks({ isbn: isbn || undefined, title: title || undefined, author: author || undefined })

    return NextResponse.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Book search error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء البحث' },
      { status: 500 }
    )
  }
}


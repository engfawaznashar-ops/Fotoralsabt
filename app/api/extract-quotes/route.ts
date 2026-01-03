import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractQuotes } from '@/lib/ai/extractQuotes'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { episodeId, transcript } = body

    if (!episodeId || !transcript) {
      return NextResponse.json(
        { error: 'معرف الحلقة والنص مطلوبان' },
        { status: 400 }
      )
    }

    // Verify episode exists
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'الحلقة غير موجودة' },
        { status: 404 }
      )
    }

    // Extract quotes using AI
    const extractedQuotes = await extractQuotes(transcript)

    // Create quotes and link to episode
    const createdQuotes = []
    for (const quoteData of extractedQuotes) {
      // Find speaker if mentioned
      let speakerId: string | undefined
      if (quoteData.speakerName) {
        const speaker = await prisma.speaker.findFirst({
          where: { name: quoteData.speakerName },
        })
        speakerId = speaker?.id
      }

      // Find book if mentioned
      let bookId: string | undefined
      if (quoteData.bookTitle) {
        const book = await prisma.book.findFirst({
          where: { title: quoteData.bookTitle },
        })
        bookId = book?.id
      }

      // Create quote
      const quote = await prisma.quote.create({
        data: {
          text: quoteData.text,
          episodeId,
          speakerId,
          bookId,
        },
      })

      createdQuotes.push(quote)
    }

    return NextResponse.json({
      success: true,
      quotes: createdQuotes,
      count: createdQuotes.length,
      message: `تم استخراج ${createdQuotes.length} اقتباسات بنجاح`,
    })
  } catch (error) {
    console.error('Error extracting quotes:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استخراج الاقتباسات' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const speakerId = searchParams.get('speakerId')
    const bookId = searchParams.get('bookId')
    const episodeId = searchParams.get('episodeId')

    const where: Record<string, string> = {}
    if (speakerId) where.speakerId = speakerId
    if (bookId) where.bookId = bookId
    if (episodeId) where.episodeId = episodeId

    const quotes = await prisma.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        episode: true,
        speaker: true,
        book: true,
      },
    })

    return NextResponse.json({ quotes })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الاقتباسات' },
      { status: 500 }
    )
  }
}




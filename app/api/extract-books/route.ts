import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractBooks } from '@/lib/ai/extractBooks'

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

    // Extract books using AI
    const extractedBooks = await extractBooks(transcript)

    // Create books and link to episode
    const createdBooks = []
    for (const bookData of extractedBooks) {
      // Check if book already exists
      let book = await prisma.book.findFirst({
        where: { title: bookData.title },
      })

      if (!book) {
        book = await prisma.book.create({
          data: {
            title: bookData.title,
            author: bookData.author,
            description: bookData.description,
          },
        })
      }

      // Link book to episode
      await prisma.bookEpisode.upsert({
        where: {
          episodeId_bookId: {
            episodeId,
            bookId: book.id,
          },
        },
        update: {},
        create: {
          episodeId,
          bookId: book.id,
        },
      })

      createdBooks.push(book)
    }

    return NextResponse.json({
      success: true,
      books: createdBooks,
      count: createdBooks.length,
      message: `تم استخراج ${createdBooks.length} كتب بنجاح`,
    })
  } catch (error) {
    console.error('Error extracting books:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استخراج الكتب' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        episodes: {
          include: { episode: true },
        },
        speakers: {
          include: { speaker: true },
        },
        quotes: true,
      },
    })

    return NextResponse.json({ books })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الكتب' },
      { status: 500 }
    )
  }
}




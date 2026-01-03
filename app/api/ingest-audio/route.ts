import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { summarizeEpisode } from '@/lib/ai/summarize'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, audioUrl } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: 'عنوان الحلقة والتاريخ مطلوبان' },
        { status: 400 }
      )
    }

    // Create episode in database
    const episode = await prisma.episode.create({
      data: {
        title,
        date: new Date(date),
        audioUrl,
      },
    })

    // Generate AI summary if audio URL is provided
    if (audioUrl) {
      const aiResult = await summarizeEpisode(audioUrl)
      
      if (aiResult) {
        await prisma.episode.update({
          where: { id: episode.id },
          data: {
            summaryAI: aiResult.summary,
            topicsAI: aiResult.topics.join(','),
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      episode,
      message: 'تم إنشاء الحلقة بنجاح',
    })
  } catch (error) {
    console.error('Error ingesting audio:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const episodes = await prisma.episode.findMany({
      orderBy: { date: 'desc' },
      take: 10,
      include: {
        books: {
          include: { book: true },
        },
        speakers: {
          include: { speaker: true },
        },
        quotes: true,
      },
    })

    return NextResponse.json({ episodes })
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الحلقات' },
      { status: 500 }
    )
  }
}




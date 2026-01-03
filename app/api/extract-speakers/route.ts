import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { extractSpeakers } from '@/lib/ai/extractSpeakers'

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

    // Extract speakers using AI
    const extractedSpeakers = await extractSpeakers(transcript)

    // Create speakers and link to episode
    const createdSpeakers = []
    for (const speakerData of extractedSpeakers) {
      // Check if speaker already exists
      let speaker = await prisma.speaker.findFirst({
        where: { name: speakerData.name },
      })

      if (!speaker) {
        speaker = await prisma.speaker.create({
          data: {
            name: speakerData.name,
            bioAI: speakerData.bio,
            sentiment: speakerData.sentiment,
          },
        })
      } else {
        // Update speaker with new AI-generated info if better
        speaker = await prisma.speaker.update({
          where: { id: speaker.id },
          data: {
            bioAI: speakerData.bio || speaker.bioAI,
            sentiment: speakerData.sentiment || speaker.sentiment,
          },
        })
      }

      // Link speaker to episode
      await prisma.speakerEpisode.upsert({
        where: {
          episodeId_speakerId: {
            episodeId,
            speakerId: speaker.id,
          },
        },
        update: {},
        create: {
          episodeId,
          speakerId: speaker.id,
        },
      })

      createdSpeakers.push(speaker)
    }

    return NextResponse.json({
      success: true,
      speakers: createdSpeakers,
      count: createdSpeakers.length,
      message: `تم استخراج ${createdSpeakers.length} متحدثين بنجاح`,
    })
  } catch (error) {
    console.error('Error extracting speakers:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استخراج المتحدثين' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        episodes: {
          include: { episode: true },
        },
        books: {
          include: { book: true },
        },
        quotes: true,
      },
    })

    return NextResponse.json({ speakers })
  } catch (error) {
    console.error('Error fetching speakers:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المتحدثين' },
      { status: 500 }
    )
  }
}




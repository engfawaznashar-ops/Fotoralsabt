/**
 * Episode Analysis API Endpoint
 * Full AI pipeline for analyzing podcast episodes
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAPIResponse, generateId } from '@/lib/ai/shared/utils'
import type { AnalyzeEpisodeRequest, EpisodeAnalysis } from '@/lib/ai/shared/types'

// Import AI services
import { transcribeAudio } from '@/lib/ai/audio/transcribeAudio'
import { detectChaptersFromTranscript } from '@/lib/ai/audio/splitAudio'
import { extractTopics } from '@/lib/ai/extractors/extractTopics'
import { extractBooks } from '@/lib/ai/extractors/extractBooks'
import { extractSpeakers } from '@/lib/ai/extractors/extractSpeakers'
import { extractQuotes } from '@/lib/ai/extractors/extractQuotes'
import { extractHighlights } from '@/lib/ai/extractors/extractHighlights'
import { extractSentiment } from '@/lib/ai/extractors/extractSentiment'
import { extractChapterTimestamps } from '@/lib/ai/extractors/extractChapterTimestamps'
import { buildGraphFromAnalysis } from '@/lib/ai/graph/buildGraph'
import { generateEmbedding } from '@/lib/ai/embeddings/generateEmbeddings'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body: AnalyzeEpisodeRequest = await request.json()

    if (!body.episodeId || !body.audioUrl) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'MISSING_PARAMS',
          message: 'Missing episodeId or audioUrl',
          messageAr: 'معرف الحلقة أو رابط الصوت مفقود'
        }),
        { status: 400 }
      )
    }

    // Check if episode exists
    let episode = await prisma.episode.findUnique({
      where: { id: body.episodeId }
    })

    if (!episode) {
      // Create new episode
      episode = await prisma.episode.create({
        data: {
          id: body.episodeId,
          title: body.title || `Episode ${body.episodeId}`,
          date: new Date(),
          audioUrl: body.audioUrl
        }
      })
    }

    // Check if already analyzed and not forcing reanalysis
    if (episode.summaryAI && !body.forceReanalyze) {
      return NextResponse.json(
        createAPIResponse(true, {
          episodeId: episode.id,
          status: 'already_analyzed',
          message: 'Episode already analyzed. Use forceReanalyze=true to re-analyze.',
          messageAr: 'الحلقة محللة مسبقاً. استخدم forceReanalyze=true لإعادة التحليل.'
        })
      )
    }

    // Step 1: Transcribe audio
    console.log('Step 1: Transcribing audio...')
    const transcription = await transcribeAudio(body.audioUrl)

    if (!transcription.success || !transcription.data) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'TRANSCRIPTION_FAILED',
          message: transcription.error || 'Failed to transcribe audio',
          messageAr: 'فشل في تحويل الصوت إلى نص'
        }),
        { status: 500 }
      )
    }

    const transcript = transcription.data

    // Step 2: Extract all data in parallel
    console.log('Step 2: Extracting data...')
    const [
      topics,
      books,
      speakers,
      quotes,
      highlights,
      sentiment,
      chapters
    ] = await Promise.all([
      extractTopics(transcript),
      extractBooks(transcript),
      extractSpeakers(transcript),
      extractQuotes(transcript),
      extractHighlights(transcript),
      extractSentiment(transcript.text),
      extractChapterTimestamps(transcript)
    ])

    // Step 3: Generate summary
    console.log('Step 3: Generating summary...')
    const { summarize } = await import('@/lib/ai/shared/llm')
    const summary = await summarize(transcript.text, 100)

    // Step 4: Build analysis result
    const analysis: EpisodeAnalysis = {
      episodeId: body.episodeId,
      title: episode.title,
      transcript,
      topics,
      books,
      speakers,
      quotes,
      highlights,
      sentiment,
      chapters,
      summary,
      aiMood: sentiment.overall,
      duration: Math.floor(transcript.segments.slice(-1)[0]?.end || 0),
      analyzedAt: new Date()
    }

    // Step 5: Save to database
    console.log('Step 5: Saving to database...')
    await prisma.episode.update({
      where: { id: body.episodeId },
      data: {
        summaryAI: summary,
        topicsAI: topics.map(t => t.nameAr).join(','),
        aiMood: sentiment.overall
      }
    })

    // Save books
    for (const book of books) {
      const existingBook = await prisma.book.findFirst({
        where: { title: book.title }
      })

      let bookId = existingBook?.id

      if (!existingBook) {
        const newBook = await prisma.book.create({
          data: {
            title: book.title,
            author: book.author,
            description: book.context,
            category: book.category
          }
        })
        bookId = newBook.id
      }

      // Create book-episode relation
      await prisma.bookEpisode.create({
        data: {
          episodeId: body.episodeId,
          bookId: bookId!
        }
      }).catch(() => {}) // Ignore if already exists
    }

    // Save speakers
    for (const speaker of speakers) {
      const existingSpeaker = await prisma.speaker.findFirst({
        where: { name: speaker.name }
      })

      let speakerId = existingSpeaker?.id

      if (!existingSpeaker) {
        const newSpeaker = await prisma.speaker.create({
          data: {
            name: speaker.name,
            sentiment: speaker.sentiment
          }
        })
        speakerId = newSpeaker.id
      }

      // Create speaker-episode relation
      await prisma.speakerEpisode.create({
        data: {
          episodeId: body.episodeId,
          speakerId: speakerId!
        }
      }).catch(() => {}) // Ignore if already exists
    }

    // Save quotes
    for (const quote of quotes) {
      await prisma.quote.create({
        data: {
          text: quote.textAr,
          episodeId: body.episodeId
        }
      }).catch(() => {}) // Ignore duplicates
    }

    // Step 6: Generate embeddings
    console.log('Step 6: Generating embeddings...')
    const contentForEmbedding = `${episode.title} ${summary} ${topics.map(t => t.nameAr).join(' ')}`
    await generateEmbedding(contentForEmbedding)

    // Step 7: Build knowledge graph
    console.log('Step 7: Building knowledge graph...')
    const graph = buildGraphFromAnalysis(analysis)

    const processingTime = Date.now() - startTime

    return NextResponse.json(
      createAPIResponse(true, {
        episodeId: body.episodeId,
        status: 'analyzed',
        analysis: {
          summary,
          mood: sentiment.overall,
          topicsCount: topics.length,
          booksCount: books.length,
          speakersCount: speakers.length,
          quotesCount: quotes.length,
          chaptersCount: chapters.length,
          highlightsCount: highlights.length
        },
        topics: topics.slice(0, 5).map(t => t.nameAr),
        books: books.slice(0, 3).map(b => ({ title: b.title, author: b.author })),
        speakers: speakers.slice(0, 3).map(s => s.name),
        chapters: chapters.slice(0, 5),
        graph: {
          nodeCount: graph.nodes.length,
          edgeCount: graph.edges.length
        },
        processingTime: `${processingTime}ms`
      })
    )

  } catch (error) {
    console.error('Episode analysis error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'ANALYSIS_ERROR',
        message: error instanceof Error ? error.message : 'Analysis failed',
        messageAr: 'فشل في تحليل الحلقة'
      }),
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const episodeId = searchParams.get('episodeId')

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

  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        books: { include: { book: true } },
        speakers: { include: { speaker: true } },
        quotes: true
      }
    })

    if (!episode) {
      return NextResponse.json(
        createAPIResponse(false, undefined, {
          code: 'EPISODE_NOT_FOUND',
          message: 'Episode not found',
          messageAr: 'الحلقة غير موجودة'
        }),
        { status: 404 }
      )
    }

    return NextResponse.json(
      createAPIResponse(true, {
        episodeId: episode.id,
        title: episode.title,
        date: episode.date,
        audioUrl: episode.audioUrl,
        summary: episode.summaryAI,
        topics: episode.topicsAI?.split(','),
        mood: episode.aiMood,
        books: episode.books.map(b => ({
          id: b.book.id,
          title: b.book.title,
          author: b.book.author
        })),
        speakers: episode.speakers.map(s => ({
          id: s.speaker.id,
          name: s.speaker.name
        })),
        quotesCount: episode.quotes.length,
        isAnalyzed: !!episode.summaryAI
      })
    )

  } catch (error) {
    console.error('Get episode error:', error)
    return NextResponse.json(
      createAPIResponse(false, undefined, {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch episode',
        messageAr: 'فشل في جلب الحلقة'
      }),
      { status: 500 }
    )
  }
}


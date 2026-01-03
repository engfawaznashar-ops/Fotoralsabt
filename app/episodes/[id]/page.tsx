/**
 * Episode Details Page
 * Fetches episode data server-side and renders with all AI-powered sections
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import {
  EpisodeHero,
  EpisodeInsightsSection,
  EpisodeChapters,
  EpisodeBooksSection,
  EpisodeSpeakersSection,
  EpisodeQuotesSection,
  EpisodeKnowledgeGraph,
  EpisodeRecommendations,
} from './components'
import {
  fetchEpisodeInsights,
  fetchEpisodeGraph,
  fetchSimilarEpisodes,
  parseChapters,
  type EpisodePageData,
  type FullEpisode,
  type EpisodeBook,
  type EpisodeSpeaker,
  type EpisodeQuote,
} from '@/lib/api/episodes'

// ============================================
// TYPES
// ============================================

interface EpisodePageProps {
  params: Promise<{ id: string }>
}

// ============================================
// DATA FETCHING
// ============================================

async function getEpisodeData(episodeId: string): Promise<EpisodePageData | null> {
  try {
    // Fetch episode with relations from Prisma
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        books: {
          include: {
            book: true,
          },
        },
        speakers: {
          include: {
            speaker: true,
          },
        },
        quotes: {
          include: {
            speaker: true,
            book: true,
          },
        },
      },
    })

    if (!episode) {
      return null
    }

    // Transform data to match our types
    const fullEpisode: FullEpisode = {
      id: episode.id,
      title: episode.title,
      date: episode.date,
      audioUrl: episode.audioUrl,
      summaryAI: episode.summaryAI,
      topicsAI: episode.topicsAI,
      aiMood: episode.aiMood,
      duration: episode.duration,
      episodeNumber: episode.episodeNumber,
      chaptersJson: episode.chaptersJson,
      highlightsJson: episode.highlightsJson,
      createdAt: episode.createdAt,
      updatedAt: episode.updatedAt,
    }

    const books: EpisodeBook[] = episode.books.map((be) => ({
      id: be.book.id,
      title: be.book.title,
      author: be.book.author,
      aiCoverUrl: be.book.aiCoverUrl,
      description: be.book.description,
      category: be.book.category,
      rating: be.book.rating,
    }))

    const speakers: EpisodeSpeaker[] = episode.speakers.map((se) => ({
      id: se.speaker.id,
      name: se.speaker.name,
      avatarAI: se.speaker.avatarAI,
      bioAI: se.speaker.bioAI,
      aiPersona: se.speaker.aiPersona,
      aiTopTopic: se.speaker.aiTopTopic,
      episodeCount: se.speaker.episodeCount,
    }))

    const quotes: EpisodeQuote[] = episode.quotes.map((q) => ({
      id: q.id,
      text: q.text,
      speakerName: q.speaker?.name || null,
      bookTitle: q.book?.title || null,
    }))

    // Fetch AI-powered data in parallel
    const [insights, graph, recommendations] = await Promise.all([
      fetchEpisodeInsights(episodeId),
      fetchEpisodeGraph(episodeId),
      fetchSimilarEpisodes(episodeId, 4),
    ])

    return {
      episode: fullEpisode,
      books,
      speakers,
      quotes,
      insights,
      graph,
      recommendations,
    }
  } catch (error) {
    console.error('Error fetching episode data:', error)
    return null
  }
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { id } = await params
  
  const episode = await prisma.episode.findUnique({
    where: { id },
    select: {
      title: true,
      summaryAI: true,
      episodeNumber: true,
    },
  })

  if (!episode) {
    return {
      title: 'حلقة غير موجودة | فطور السبت',
    }
  }

  const episodeTitle = episode.episodeNumber 
    ? `الحلقة ${episode.episodeNumber}: ${episode.title}`
    : episode.title

  return {
    title: `${episodeTitle} | فطور السبت`,
    description: episode.summaryAI || `استمع إلى ${episode.title} - بودكاست فطور السبت`,
    openGraph: {
      title: episodeTitle,
      description: episode.summaryAI || `استمع إلى ${episode.title}`,
      type: 'article',
    },
  }
}

// ============================================
// PAGE COMPONENT
// ============================================

export default async function EpisodeDetailsPage({ params }: EpisodePageProps) {
  const { id } = await params
  const data = await getEpisodeData(id)

  if (!data) {
    notFound()
  }

  const { episode, books, speakers, quotes, insights, graph, recommendations } = data
  const chapters = parseChapters(episode.chaptersJson)

  return (
    <main className="min-h-screen bg-brand-sand">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Audio Player */}
      <EpisodeHero 
        episode={episode} 
        speakers={speakers}
      />

      {/* AI Insights Section */}
      {insights && (
        <EpisodeInsightsSection insights={insights} />
      )}

      {/* Chapters Timeline */}
      {chapters.length > 0 && (
        <EpisodeChapters 
          chapters={chapters}
          totalDuration={episode.duration || 0}
        />
      )}

      {/* Books Section */}
      {books.length > 0 && (
        <EpisodeBooksSection books={books} />
      )}

      {/* Speakers Section */}
      {speakers.length > 0 && (
        <EpisodeSpeakersSection speakers={speakers} />
      )}

      {/* Quotes Section */}
      {quotes.length > 0 && (
        <EpisodeQuotesSection quotes={quotes} />
      )}

      {/* Knowledge Graph */}
      {graph && graph.nodes.length > 0 && (
        <EpisodeKnowledgeGraph 
          graph={graph} 
          episodeTitle={episode.title}
        />
      )}

      {/* Similar Episodes */}
      {recommendations.length > 0 && (
        <EpisodeRecommendations 
          recommendations={recommendations}
          currentEpisodeId={episode.id}
        />
      )}

      {/* Footer */}
      <Footer />
    </main>
  )
}


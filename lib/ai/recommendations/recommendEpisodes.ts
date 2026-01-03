/**
 * Episode Recommendation Service
 */

import type { RecommendationResult, RecommendedItem, UserProfile } from '../shared/types'
import { generateEmbedding, cosineSimilarity } from '../embeddings/generateEmbeddings'
import { prisma } from '@/lib/db'
import { generateId } from '../shared/utils'

export interface RecommendEpisodesOptions {
  limit?: number
  excludeIds?: string[]
  basedOn?: 'history' | 'topics' | 'speakers' | 'mixed'
}

/**
 * Recommend episodes based on user profile
 */
export async function recommendEpisodes(
  userProfile: Partial<UserProfile>,
  options: RecommendEpisodesOptions = {}
): Promise<RecommendationResult> {
  const {
    limit = 5,
    excludeIds = [],
    basedOn = 'mixed'
  } = options

  try {
    // Fetch all episodes
    const episodes = await prisma.episode.findMany({
      where: {
        id: { notIn: excludeIds }
      },
      include: {
        speakers: { include: { speaker: true } },
        books: { include: { book: true } }
      }
    })

    const recommendations: RecommendedItem[] = []

    // Build user preference string
    const userPreferences = buildUserPreferenceString(userProfile)
    const userEmbedding = await generateEmbedding(userPreferences)

    for (const episode of episodes) {
      // Build episode content string
      const episodeContent = buildEpisodeContentString(episode)
      const episodeEmbedding = await generateEmbedding(episodeContent)

      // Calculate similarity score
      const score = cosineSimilarity(userEmbedding.embedding, episodeEmbedding.embedding)

      // Calculate additional factors
      const recencyBonus = calculateRecencyBonus(episode.date)
      const topicMatchBonus = calculateTopicMatchBonus(episode, userProfile.favoriteTopics || [])

      const finalScore = score * 0.6 + recencyBonus * 0.2 + topicMatchBonus * 0.2

      recommendations.push({
        id: episode.id,
        type: 'episode',
        title: episode.title,
        titleAr: episode.title,
        score: Math.round(finalScore * 100) / 100,
        reason: generateRecommendationReason(episode, userProfile),
        reasonAr: generateRecommendationReasonAr(episode, userProfile),
        metadata: {
          date: episode.date,
          speakers: episode.speakers.map(s => s.speaker.name),
          books: episode.books.map(b => b.book.title)
        }
      })
    }

    // Sort by score and limit
    recommendations.sort((a, b) => b.score - a.score)
    const topRecommendations = recommendations.slice(0, limit)

    return {
      items: topRecommendations,
      algorithm: 'content-based-filtering',
      confidence: 0.8,
      basedOn: userProfile.favoriteTopics?.map(t => t.topic) || [],
      generatedAt: new Date()
    }

  } catch (error) {
    console.error('Episode recommendation error:', error)
    return {
      items: [],
      algorithm: 'content-based-filtering',
      confidence: 0,
      basedOn: [],
      generatedAt: new Date()
    }
  }
}

/**
 * Recommend similar episodes
 */
export async function recommendSimilarEpisodes(
  episodeId: string,
  limit: number = 5
): Promise<RecommendedItem[]> {
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        speakers: { include: { speaker: true } },
        books: { include: { book: true } }
      }
    })

    if (!episode) return []

    const otherEpisodes = await prisma.episode.findMany({
      where: { id: { not: episodeId } },
      include: {
        speakers: { include: { speaker: true } },
        books: { include: { book: true } }
      }
    })

    const sourceContent = buildEpisodeContentString(episode)
    const sourceEmbedding = await generateEmbedding(sourceContent)

    const similarities: RecommendedItem[] = []

    for (const other of otherEpisodes) {
      const otherContent = buildEpisodeContentString(other)
      const otherEmbedding = await generateEmbedding(otherContent)
      const score = cosineSimilarity(sourceEmbedding.embedding, otherEmbedding.embedding)

      similarities.push({
        id: other.id,
        type: 'episode',
        title: other.title,
        titleAr: other.title,
        score: Math.round(score * 100) / 100,
        reason: `Similar to "${episode.title}"`,
        reasonAr: `مشابه لحلقة "${episode.title}"`
      })
    }

    similarities.sort((a, b) => b.score - a.score)
    return similarities.slice(0, limit)

  } catch (error) {
    console.error('Similar episodes error:', error)
    return []
  }
}

// Helper functions
function buildUserPreferenceString(profile: Partial<UserProfile>): string {
  const parts: string[] = []

  if (profile.favoriteTopics) {
    parts.push(...profile.favoriteTopics.map(t => t.topic))
  }

  if (profile.preferredMood) {
    parts.push(profile.preferredMood)
  }

  if (profile.preferences?.preferredDuration) {
    parts.push(`مدة ${profile.preferences.preferredDuration}`)
  }

  return parts.join(' ')
}

function buildEpisodeContentString(episode: any): string {
  const parts = [episode.title]

  if (episode.summaryAI) parts.push(episode.summaryAI)
  if (episode.topicsAI) parts.push(episode.topicsAI)

  if (episode.speakers) {
    parts.push(...episode.speakers.map((s: any) => s.speaker.name))
  }

  if (episode.books) {
    parts.push(...episode.books.map((b: any) => b.book.title))
  }

  return parts.join(' ')
}

function calculateRecencyBonus(date: Date): number {
  const daysSincePublish = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(0, 1 - daysSincePublish / 365) // Decay over 1 year
}

function calculateTopicMatchBonus(episode: any, favoriteTopics: { topic: string }[]): number {
  if (!episode.topicsAI || favoriteTopics.length === 0) return 0

  const episodeTopics = episode.topicsAI.toLowerCase().split(',').map((t: string) => t.trim())
  const userTopics = favoriteTopics.map(t => t.topic.toLowerCase())

  let matches = 0
  for (const userTopic of userTopics) {
    if (episodeTopics.some((et: string) => et.includes(userTopic) || userTopic.includes(et))) {
      matches++
    }
  }

  return matches / Math.max(userTopics.length, 1)
}

function generateRecommendationReason(episode: any, profile: Partial<UserProfile>): string {
  if (profile.favoriteTopics && profile.favoriteTopics.length > 0) {
    return `Based on your interest in ${profile.favoriteTopics[0].topic}`
  }
  return 'Recommended for you'
}

function generateRecommendationReasonAr(episode: any, profile: Partial<UserProfile>): string {
  if (profile.favoriteTopics && profile.favoriteTopics.length > 0) {
    return `بناءً على اهتمامك بـ ${profile.favoriteTopics[0].topic}`
  }
  return 'مقترح لك'
}

export default recommendEpisodes


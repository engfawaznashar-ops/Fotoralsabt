/**
 * Speaker Recommendation Service
 */

import type { RecommendationResult, RecommendedItem, UserProfile } from '../shared/types'
import { generateEmbedding, cosineSimilarity } from '../embeddings/generateEmbeddings'
import { prisma } from '@/lib/db'

export interface RecommendSpeakersOptions {
  limit?: number
  excludeIds?: string[]
}

/**
 * Recommend speakers based on user profile
 */
export async function recommendSpeakers(
  userProfile: Partial<UserProfile>,
  options: RecommendSpeakersOptions = {}
): Promise<RecommendationResult> {
  const {
    limit = 5,
    excludeIds = []
  } = options

  try {
    // Fetch all speakers
    const speakers = await prisma.speaker.findMany({
      where: {
        id: { notIn: excludeIds }
      },
      include: {
        episodes: { include: { episode: true } },
        books: { include: { book: true } }
      }
    })

    const recommendations: RecommendedItem[] = []

    // Build user preference string
    const userPreferences = buildSpeakerPreferenceString(userProfile)
    const userEmbedding = await generateEmbedding(userPreferences)

    for (const speaker of speakers) {
      // Build speaker content string
      const speakerContent = buildSpeakerContentString(speaker)
      const speakerEmbedding = await generateEmbedding(speakerContent)

      // Calculate similarity score
      const score = cosineSimilarity(userEmbedding.embedding, speakerEmbedding.embedding)

      // Calculate activity bonus
      const activityBonus = Math.min(speaker.episodes.length / 20, 0.3)

      const finalScore = score * 0.7 + activityBonus

      recommendations.push({
        id: speaker.id,
        type: 'speaker',
        title: speaker.name,
        titleAr: speaker.name,
        score: Math.round(finalScore * 100) / 100,
        reason: generateSpeakerReasonEn(speaker, userProfile),
        reasonAr: generateSpeakerReasonAr(speaker, userProfile),
        metadata: {
          episodeCount: speaker.episodes.length,
          booksCount: speaker.books.length,
          persona: speaker.aiPersona
        }
      })
    }

    // Sort by score and limit
    recommendations.sort((a, b) => b.score - a.score)
    const topRecommendations = recommendations.slice(0, limit)

    return {
      items: topRecommendations,
      algorithm: 'content-based-filtering',
      confidence: 0.7,
      basedOn: userProfile.favoriteTopics?.map(t => t.topic) || [],
      generatedAt: new Date()
    }

  } catch (error) {
    console.error('Speaker recommendation error:', error)
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
 * Recommend speakers by topic expertise
 */
export async function recommendSpeakersByTopic(
  topic: string,
  limit: number = 5
): Promise<RecommendedItem[]> {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        episodes: { include: { episode: true } }
      }
    })

    const topicEmbedding = await generateEmbedding(topic)
    const recommendations: RecommendedItem[] = []

    for (const speaker of speakers) {
      const speakerContent = `${speaker.name} ${speaker.bioAI || ''} ${speaker.aiTopTopic || ''}`
      const speakerEmbedding = await generateEmbedding(speakerContent)
      const score = cosineSimilarity(topicEmbedding.embedding, speakerEmbedding.embedding)

      recommendations.push({
        id: speaker.id,
        type: 'speaker',
        title: speaker.name,
        titleAr: speaker.name,
        score: Math.round(score * 100) / 100,
        reason: `Expert in "${topic}"`,
        reasonAr: `خبير في "${topic}"`
      })
    }

    recommendations.sort((a, b) => b.score - a.score)
    return recommendations.slice(0, limit)

  } catch (error) {
    console.error('Topic speakers error:', error)
    return []
  }
}

/**
 * Recommend similar speakers
 */
export async function recommendSimilarSpeakers(
  speakerId: string,
  limit: number = 5
): Promise<RecommendedItem[]> {
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id: speakerId }
    })

    if (!speaker) return []

    const otherSpeakers = await prisma.speaker.findMany({
      where: { id: { not: speakerId } }
    })

    const sourceContent = `${speaker.name} ${speaker.bioAI || ''} ${speaker.aiPersona || ''} ${speaker.aiTopTopic || ''}`
    const sourceEmbedding = await generateEmbedding(sourceContent)

    const similarities: RecommendedItem[] = []

    for (const other of otherSpeakers) {
      const otherContent = `${other.name} ${other.bioAI || ''} ${other.aiPersona || ''} ${other.aiTopTopic || ''}`
      const otherEmbedding = await generateEmbedding(otherContent)
      const score = cosineSimilarity(sourceEmbedding.embedding, otherEmbedding.embedding)

      similarities.push({
        id: other.id,
        type: 'speaker',
        title: other.name,
        titleAr: other.name,
        score: Math.round(score * 100) / 100,
        reason: `Similar to ${speaker.name}`,
        reasonAr: `مشابه لـ ${speaker.name}`
      })
    }

    similarities.sort((a, b) => b.score - a.score)
    return similarities.slice(0, limit)

  } catch (error) {
    console.error('Similar speakers error:', error)
    return []
  }
}

// Helper functions
function buildSpeakerPreferenceString(profile: Partial<UserProfile>): string {
  const parts: string[] = []

  if (profile.favoriteTopics) {
    parts.push(...profile.favoriteTopics.map(t => t.topic))
  }

  if (profile.preferredTone) {
    parts.push(profile.preferredTone)
  }

  return parts.join(' ') || 'قيادة تحفيز تعليم'
}

function buildSpeakerContentString(speaker: any): string {
  const parts = [speaker.name]

  if (speaker.bioAI) parts.push(speaker.bioAI)
  if (speaker.aiPersona) parts.push(speaker.aiPersona)
  if (speaker.aiTopTopic) parts.push(speaker.aiTopTopic)

  // Add episode topics
  for (const ep of speaker.episodes) {
    if (ep.episode.topicsAI) {
      parts.push(ep.episode.topicsAI)
    }
  }

  return parts.join(' ')
}

function generateSpeakerReasonEn(speaker: any, profile: Partial<UserProfile>): string {
  if (speaker.aiTopTopic) {
    return `Expert in ${speaker.aiTopTopic}`
  }
  if (speaker.aiPersona) {
    return `${speaker.aiPersona} speaker`
  }
  return 'Recommended based on your preferences'
}

function generateSpeakerReasonAr(speaker: any, profile: Partial<UserProfile>): string {
  if (speaker.aiTopTopic) {
    return `خبير في ${speaker.aiTopTopic}`
  }
  if (speaker.aiPersona) {
    return `متحدث ${speaker.aiPersona}`
  }
  return 'مقترح بناءً على تفضيلاتك'
}

export default recommendSpeakers


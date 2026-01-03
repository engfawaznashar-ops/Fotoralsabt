/**
 * Book Recommendation Service
 */

import type { RecommendationResult, RecommendedItem, UserProfile, TopicPreference } from '../shared/types'
import { generateEmbedding, cosineSimilarity } from '../embeddings/generateEmbeddings'
import { prisma } from '@/lib/db'

export interface RecommendBooksOptions {
  limit?: number
  excludeIds?: string[]
  category?: string
}

/**
 * Recommend books based on user profile
 */
export async function recommendBooks(
  userProfile: Partial<UserProfile>,
  options: RecommendBooksOptions = {}
): Promise<RecommendationResult> {
  const {
    limit = 5,
    excludeIds = [],
    category
  } = options

  try {
    // Fetch all books
    const whereClause: any = {
      id: { notIn: excludeIds }
    }
    if (category) {
      whereClause.category = category
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      include: {
        episodes: { include: { episode: true } }
      }
    })

    const recommendations: RecommendedItem[] = []

    // Build user preference string
    const userPreferences = buildBookPreferenceString(userProfile)
    const userEmbedding = await generateEmbedding(userPreferences)

    for (const book of books) {
      // Build book content string
      const bookContent = `${book.title} ${book.author || ''} ${book.description || ''} ${book.category || ''}`
      const bookEmbedding = await generateEmbedding(bookContent)

      // Calculate similarity score
      const score = cosineSimilarity(userEmbedding.embedding, bookEmbedding.embedding)

      // Calculate popularity bonus (more episodes = more discussed)
      const popularityBonus = Math.min(book.episodes.length / 10, 0.3)

      const finalScore = score * 0.7 + popularityBonus

      recommendations.push({
        id: book.id,
        type: 'book',
        title: book.title,
        titleAr: book.title,
        score: Math.round(finalScore * 100) / 100,
        reason: generateBookReasonEn(book, userProfile),
        reasonAr: generateBookReasonAr(book, userProfile),
        metadata: {
          author: book.author,
          category: book.category,
          episodeCount: book.episodes.length
        }
      })
    }

    // Sort by score and limit
    recommendations.sort((a, b) => b.score - a.score)
    const topRecommendations = recommendations.slice(0, limit)

    return {
      items: topRecommendations,
      algorithm: 'content-based-filtering',
      confidence: 0.75,
      basedOn: userProfile.favoriteTopics?.map(t => t.topic) || [],
      generatedAt: new Date()
    }

  } catch (error) {
    console.error('Book recommendation error:', error)
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
 * Recommend books by topic
 */
export async function recommendBooksByTopic(
  topic: string,
  limit: number = 5
): Promise<RecommendedItem[]> {
  try {
    const books = await prisma.book.findMany({
      include: {
        episodes: { include: { episode: true } }
      }
    })

    const topicEmbedding = await generateEmbedding(topic)
    const recommendations: RecommendedItem[] = []

    for (const book of books) {
      const bookContent = `${book.title} ${book.author || ''} ${book.description || ''}`
      const bookEmbedding = await generateEmbedding(bookContent)
      const score = cosineSimilarity(topicEmbedding.embedding, bookEmbedding.embedding)

      recommendations.push({
        id: book.id,
        type: 'book',
        title: book.title,
        titleAr: book.title,
        score: Math.round(score * 100) / 100,
        reason: `Related to "${topic}"`,
        reasonAr: `متعلق بـ "${topic}"`
      })
    }

    recommendations.sort((a, b) => b.score - a.score)
    return recommendations.slice(0, limit)

  } catch (error) {
    console.error('Topic books error:', error)
    return []
  }
}

/**
 * Recommend similar books
 */
export async function recommendSimilarBooks(
  bookId: string,
  limit: number = 5
): Promise<RecommendedItem[]> {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    })

    if (!book) return []

    const otherBooks = await prisma.book.findMany({
      where: { id: { not: bookId } }
    })

    const sourceContent = `${book.title} ${book.author || ''} ${book.description || ''} ${book.category || ''}`
    const sourceEmbedding = await generateEmbedding(sourceContent)

    const similarities: RecommendedItem[] = []

    for (const other of otherBooks) {
      const otherContent = `${other.title} ${other.author || ''} ${other.description || ''} ${other.category || ''}`
      const otherEmbedding = await generateEmbedding(otherContent)
      const score = cosineSimilarity(sourceEmbedding.embedding, otherEmbedding.embedding)

      similarities.push({
        id: other.id,
        type: 'book',
        title: other.title,
        titleAr: other.title,
        score: Math.round(score * 100) / 100,
        reason: `Similar to "${book.title}"`,
        reasonAr: `مشابه لكتاب "${book.title}"`
      })
    }

    similarities.sort((a, b) => b.score - a.score)
    return similarities.slice(0, limit)

  } catch (error) {
    console.error('Similar books error:', error)
    return []
  }
}

// Helper functions
function buildBookPreferenceString(profile: Partial<UserProfile>): string {
  const parts: string[] = []

  if (profile.favoriteTopics) {
    parts.push(...profile.favoriteTopics.map(t => t.topic))
  }

  return parts.join(' ') || 'تنمية ذاتية قيادة نجاح'
}

function generateBookReasonEn(book: any, profile: Partial<UserProfile>): string {
  if (profile.favoriteTopics && profile.favoriteTopics.length > 0) {
    return `Matches your interest in ${profile.favoriteTopics[0].topic}`
  }
  if (book.category) {
    return `Popular in ${book.category}`
  }
  return 'Recommended based on your preferences'
}

function generateBookReasonAr(book: any, profile: Partial<UserProfile>): string {
  if (profile.favoriteTopics && profile.favoriteTopics.length > 0) {
    return `يناسب اهتمامك بـ ${profile.favoriteTopics[0].topic}`
  }
  if (book.category) {
    return `شائع في ${book.category}`
  }
  return 'مقترح بناءً على تفضيلاتك'
}

export default recommendBooks


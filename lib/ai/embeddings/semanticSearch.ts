/**
 * Semantic Search Service
 * Performs semantic similarity search using embeddings
 */

import type { SemanticSearchResult } from '../shared/types'
import { generateEmbedding, cosineSimilarity } from './generateEmbeddings'
import { prisma } from '@/lib/db'

export interface SearchOptions {
  limit?: number
  threshold?: number
  types?: ('episode' | 'book' | 'speaker' | 'quote')[]
}

// In-memory vector store (for demo purposes)
// In production, use pgvector or Pinecone
const vectorStore: Map<string, {
  id: string
  type: string
  content: string
  embedding: number[]
  metadata: Record<string, unknown>
}> = new Map()

/**
 * Semantic search across all content
 */
export async function semanticSearch(
  query: string,
  options: SearchOptions = {}
): Promise<SemanticSearchResult[]> {
  const {
    limit = 10,
    threshold = 0.5,
    types
  } = options

  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query)

  // Search in vector store
  const results: SemanticSearchResult[] = []

  for (const [key, item] of vectorStore.entries()) {
    // Filter by type if specified
    if (types && types.length > 0 && !types.includes(item.type as any)) {
      continue
    }

    // Calculate similarity
    const score = cosineSimilarity(queryEmbedding.embedding, item.embedding)

    if (score >= threshold) {
      results.push({
        id: item.id,
        score,
        content: item.content,
        metadata: item.metadata
      })
    }
  }

  // Sort by score and limit
  results.sort((a, b) => b.score - a.score)
  return results.slice(0, limit)
}

/**
 * Search episodes by content similarity
 */
export async function searchEpisodes(
  query: string,
  limit: number = 10
): Promise<{
  id: string
  title: string
  score: number
  snippet: string
}[]> {
  try {
    // Fetch episodes from database
    const episodes = await prisma.episode.findMany({
      select: {
        id: true,
        title: true,
        summaryAI: true
      }
    })

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query)

    // Calculate similarities
    const results: { id: string; title: string; score: number; snippet: string }[] = []

    for (const episode of episodes) {
      const content = `${episode.title} ${episode.summaryAI || ''}`
      const episodeEmbedding = await generateEmbedding(content)
      const score = cosineSimilarity(queryEmbedding.embedding, episodeEmbedding.embedding)

      results.push({
        id: episode.id,
        title: episode.title,
        score,
        snippet: episode.summaryAI?.slice(0, 200) || ''
      })
    }

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, limit)

  } catch (error) {
    console.error('Episode search error:', error)
    return []
  }
}

/**
 * Search books by content similarity
 */
export async function searchBooks(
  query: string,
  limit: number = 10
): Promise<{
  id: string
  title: string
  author: string
  score: number
}[]> {
  try {
    // Fetch books from database
    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        description: true
      }
    })

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query)

    // Calculate similarities
    const results: { id: string; title: string; author: string; score: number }[] = []

    for (const book of books) {
      const content = `${book.title} ${book.author || ''} ${book.description || ''}`
      const bookEmbedding = await generateEmbedding(content)
      const score = cosineSimilarity(queryEmbedding.embedding, bookEmbedding.embedding)

      results.push({
        id: book.id,
        title: book.title,
        author: book.author || '',
        score
      })
    }

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, limit)

  } catch (error) {
    console.error('Book search error:', error)
    return []
  }
}

/**
 * Search quotes by semantic similarity
 */
export async function searchQuotes(
  query: string,
  limit: number = 10
): Promise<{
  id: string
  text: string
  speaker?: string
  score: number
}[]> {
  try {
    // Fetch quotes from database
    const quotes = await prisma.quote.findMany({
      select: {
        id: true,
        text: true,
        speaker: {
          select: { name: true }
        }
      }
    })

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query)

    // Calculate similarities
    const results: { id: string; text: string; speaker?: string; score: number }[] = []

    for (const quote of quotes) {
      const quoteEmbedding = await generateEmbedding(quote.text)
      const score = cosineSimilarity(queryEmbedding.embedding, quoteEmbedding.embedding)

      results.push({
        id: quote.id,
        text: quote.text,
        speaker: quote.speaker?.name,
        score
      })
    }

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, limit)

  } catch (error) {
    console.error('Quote search error:', error)
    return []
  }
}

/**
 * Find similar content to a specific item
 */
export async function findSimilar(
  type: 'episode' | 'book' | 'speaker' | 'quote',
  id: string,
  limit: number = 5
): Promise<SemanticSearchResult[]> {
  // Get the item's content
  let content = ''

  try {
    switch (type) {
      case 'episode':
        const episode = await prisma.episode.findUnique({ where: { id } })
        content = `${episode?.title || ''} ${episode?.summaryAI || ''}`
        break
      case 'book':
        const book = await prisma.book.findUnique({ where: { id } })
        content = `${book?.title || ''} ${book?.author || ''} ${book?.description || ''}`
        break
      case 'speaker':
        const speaker = await prisma.speaker.findUnique({ where: { id } })
        content = `${speaker?.name || ''} ${speaker?.bioAI || ''}`
        break
      case 'quote':
        const quote = await prisma.quote.findUnique({ where: { id } })
        content = quote?.text || ''
        break
    }

    if (!content) return []

    // Perform semantic search excluding the original item
    const results = await semanticSearch(content, { limit: limit + 1 })
    return results.filter(r => r.id !== id).slice(0, limit)

  } catch (error) {
    console.error('Find similar error:', error)
    return []
  }
}

/**
 * Add content to vector store
 */
export async function indexContent(
  id: string,
  type: 'episode' | 'book' | 'speaker' | 'quote',
  content: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const embedding = await generateEmbedding(content)

  vectorStore.set(`${type}:${id}`, {
    id,
    type,
    content,
    embedding: embedding.embedding,
    metadata
  })
}

/**
 * Remove content from vector store
 */
export function removeFromIndex(
  id: string,
  type: 'episode' | 'book' | 'speaker' | 'quote'
): void {
  vectorStore.delete(`${type}:${id}`)
}

/**
 * Clear entire vector store
 */
export function clearIndex(): void {
  vectorStore.clear()
}

/**
 * Get vector store statistics
 */
export function getIndexStats(): {
  totalItems: number
  itemsByType: Record<string, number>
} {
  const itemsByType: Record<string, number> = {}

  for (const item of vectorStore.values()) {
    itemsByType[item.type] = (itemsByType[item.type] || 0) + 1
  }

  return {
    totalItems: vectorStore.size,
    itemsByType
  }
}

export default semanticSearch


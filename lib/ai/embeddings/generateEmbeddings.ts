/**
 * Embedding Generation Service
 * Generates vector embeddings for text
 */

import OpenAI from 'openai'
import type { EmbeddingResult } from '../shared/types'
import { withRetry, batchArray, chunkText } from '../shared/utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Embedding models
export type EmbeddingModel = 
  | 'text-embedding-3-small'
  | 'text-embedding-3-large'
  | 'text-embedding-ada-002'

export interface EmbeddingOptions {
  model?: EmbeddingModel
  dimensions?: number
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {}
): Promise<EmbeddingResult> {
  const {
    model = 'text-embedding-3-small',
    dimensions
  } = options

  return withRetry(async () => {
    const params: OpenAI.Embeddings.EmbeddingCreateParams = {
      model,
      input: text
    }

    if (dimensions && model.includes('3-')) {
      params.dimensions = dimensions
    }

    const response = await openai.embeddings.create(params)

    return {
      embedding: response.data[0].embedding,
      model: response.model,
      dimensions: response.data[0].embedding.length
    }
  })
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(
  texts: string[],
  options: EmbeddingOptions = {}
): Promise<EmbeddingResult[]> {
  const {
    model = 'text-embedding-3-small',
    dimensions
  } = options

  // Process in batches (OpenAI allows up to 2048 inputs per request)
  const batchSize = 100
  const batches = batchArray(texts, batchSize)
  const results: EmbeddingResult[] = []

  for (const batch of batches) {
    const batchResults = await withRetry(async () => {
      const params: OpenAI.Embeddings.EmbeddingCreateParams = {
        model,
        input: batch
      }

      if (dimensions && model.includes('3-')) {
        params.dimensions = dimensions
      }

      const response = await openai.embeddings.create(params)

      return response.data.map(item => ({
        embedding: item.embedding,
        model: response.model,
        dimensions: item.embedding.length
      }))
    })

    results.push(...batchResults)
  }

  return results
}

/**
 * Generate embedding for long text by chunking
 */
export async function generateEmbeddingForLongText(
  text: string,
  options: EmbeddingOptions & { chunkSize?: number; overlap?: number } = {}
): Promise<{ embedding: number[]; chunks: EmbeddingResult[] }> {
  const { chunkSize = 500, overlap = 50, ...embeddingOptions } = options

  // Split text into chunks
  const chunks = chunkText(text, chunkSize, overlap)

  // Generate embeddings for each chunk
  const chunkEmbeddings = await generateEmbeddings(chunks, embeddingOptions)

  // Average the embeddings
  const embedding = averageEmbeddings(chunkEmbeddings.map(e => e.embedding))

  return {
    embedding,
    chunks: chunkEmbeddings
  }
}

/**
 * Average multiple embeddings into one
 */
export function averageEmbeddings(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return []
  if (embeddings.length === 1) return embeddings[0]

  const dimensions = embeddings[0].length
  const averaged = new Array(dimensions).fill(0)

  for (const embedding of embeddings) {
    for (let i = 0; i < dimensions; i++) {
      averaged[i] += embedding[i]
    }
  }

  for (let i = 0; i < dimensions; i++) {
    averaged[i] /= embeddings.length
  }

  return averaged
}

/**
 * Normalize embedding vector
 */
export function normalizeEmbedding(embedding: number[]): number[] {
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  )

  if (magnitude === 0) return embedding

  return embedding.map(val => val / magnitude)
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same dimensions')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Find most similar embeddings
 */
export function findMostSimilar(
  queryEmbedding: number[],
  embeddings: { id: string; embedding: number[] }[],
  topK: number = 10
): { id: string; score: number }[] {
  const similarities = embeddings.map(item => ({
    id: item.id,
    score: cosineSimilarity(queryEmbedding, item.embedding)
  }))

  similarities.sort((a, b) => b.score - a.score)

  return similarities.slice(0, topK)
}

/**
 * Reduce embedding dimensions using PCA (simplified)
 * In production, use a proper PCA library
 */
export function reduceEmbeddingDimensions(
  embedding: number[],
  targetDimensions: number
): number[] {
  if (embedding.length <= targetDimensions) {
    return embedding
  }

  // Simple dimension reduction by averaging groups
  const groupSize = Math.ceil(embedding.length / targetDimensions)
  const reduced: number[] = []

  for (let i = 0; i < targetDimensions; i++) {
    const start = i * groupSize
    const end = Math.min(start + groupSize, embedding.length)
    const group = embedding.slice(start, end)
    const avg = group.reduce((a, b) => a + b, 0) / group.length
    reduced.push(avg)
  }

  return reduced
}

/**
 * Store embedding in database (placeholder)
 * In production, use pgvector or a vector database
 */
export async function storeEmbedding(
  id: string,
  type: 'episode' | 'book' | 'speaker' | 'quote' | 'concept',
  embedding: number[],
  metadata?: Record<string, unknown>
): Promise<void> {
  // In production, this would store in pgvector or Pinecone
  console.log(`Storing embedding for ${type}:${id} (${embedding.length} dimensions)`)
  
  // Placeholder: store in a simple JSON structure
  // await prisma.embedding.create({
  //   data: {
  //     entityId: id,
  //     entityType: type,
  //     vector: embedding,
  //     metadata: metadata ? JSON.stringify(metadata) : null
  //   }
  // })
}

/**
 * Retrieve embedding from database (placeholder)
 */
export async function getEmbedding(
  id: string,
  type: 'episode' | 'book' | 'speaker' | 'quote' | 'concept'
): Promise<number[] | null> {
  // In production, this would retrieve from pgvector or Pinecone
  console.log(`Retrieving embedding for ${type}:${id}`)
  return null
}

export default generateEmbedding




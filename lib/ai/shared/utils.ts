/**
 * Shared utility functions for AI services
 */

// ID generation without external dependencies

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format seconds to time string (MM:SS or HH:MM:SS)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Parse time string to seconds
 */
export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':').map(Number)
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  return parts[0] || 0
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Clean and normalize Arabic text
 */
export function normalizeArabicText(text: string): string {
  return text
    .replace(/[\u064B-\u065F]/g, '') // Remove tashkeel
    .replace(/[أإآ]/g, 'ا') // Normalize alef
    .replace(/ة/g, 'ه') // Normalize ta marbuta
    .replace(/ى/g, 'ي') // Normalize alef maksura
    .trim()
}

/**
 * Extract Arabic words from text
 */
export function extractArabicWords(text: string): string[] {
  const arabicWordPattern = /[\u0600-\u06FF]+/g
  return text.match(arabicWordPattern) || []
}

/**
 * Calculate text similarity using Jaccard index
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(normalizeArabicText(text1).split(/\s+/))
  const words2 = new Set(normalizeArabicText(text2).split(/\s+/))
  
  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

/**
 * Chunk text into smaller pieces
 */
export function chunkText(text: string, chunkSize: number, overlap: number = 0): string[] {
  const chunks: string[] = []
  const words = text.split(/\s+/)
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.length > 0) {
      chunks.push(chunk)
    }
  }
  
  return chunks
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        await sleep(delay)
      }
    }
  }
  
  throw lastError
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Parse JSON safely with error handling
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Extract JSON from LLM response that might contain markdown
 */
export function extractJSONFromResponse(response: string): string {
  // Try to find JSON in code blocks
  const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim()
  }
  
  // Try to find JSON object/array directly
  const jsonMatch = response.match(/[\[{][\s\S]*[\]}]/)
  if (jsonMatch) {
    return jsonMatch[0]
  }
  
  return response
}

/**
 * Validate required environment variables
 */
export function validateEnvVars(vars: string[]): void {
  const missing = vars.filter(v => !process.env[v])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

/**
 * Create API response wrapper
 */
export function createAPIResponse<T>(
  success: boolean,
  data?: T,
  error?: { code: string; message: string; messageAr: string }
) {
  return {
    success,
    data,
    error,
    meta: {
      requestId: generateId(),
      processingTime: 0,
      version: '1.0.0',
      timestamp: new Date()
    }
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
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
 * Batch array into chunks
 */
export function batchArray<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = []
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize))
  }
  return batches
}

/**
 * Map AI mood to Arabic
 */
export function getMoodArabic(mood: string): string {
  const moodMap: Record<string, string> = {
    'motivational': 'تحفيزي',
    'educational': 'معرفي',
    'discussive': 'نقاشي',
    'analytical': 'تحليلي',
    'inspiring': 'ملهم',
    'neutral': 'حيادي'
  }
  return moodMap[mood.toLowerCase()] || mood
}

/**
 * Map AI persona to Arabic
 */
export function getPersonaArabic(persona: string): string {
  const personaMap: Record<string, string> = {
    'analytical': 'تحليلي',
    'motivational': 'تحفيزي',
    'leadership': 'قيادي',
    'technical': 'تقني',
    'creative': 'إبداعي',
    'strategic': 'استراتيجي'
  }
  return personaMap[persona.toLowerCase()] || persona
}


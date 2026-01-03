/**
 * Book API Client Functions
 * Typed fetchers for Book-related API calls
 */

import type { 
  GraphNode, 
  GraphEdge, 
  APIResponse 
} from '@/lib/ai/shared/types'

// Base URL for API routes
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface BookPageData {
  book: FullBook
  episodes: BookEpisode[]
  speakers: BookSpeaker[]
  quotes: BookQuote[]
  insights: BookInsightsData | null
  graph: GraphData | null
  recommendations: RecommendedBook[]
}

export interface FullBook {
  id: string
  title: string
  author: string | null
  aiCoverUrl: string | null
  description: string | null
  category: string | null
  rating: number | null
  aiSummary: string | null
  createdAt: Date
  updatedAt: Date
}

export interface BookEpisode {
  id: string
  title: string
  date: Date | string
  episodeNumber: number | null
  duration: number | null
  aiMood: string | null
  summaryAI: string | null
  highlightsJson: string | null
}

export interface BookSpeaker {
  id: string
  name: string
  avatarAI: string | null
  bioAI: string | null
  aiPersona: string | null
  aiTopTopic: string | null
  episodeCount: number | null
  mentionCount: number
}

export interface BookQuote {
  id: string
  text: string
  speakerId: string | null
  speakerName: string | null
  episodeId: string | null
  episodeTitle: string | null
  episodeNumber: number | null
  timestamp?: string
}

export interface BookInsightsData {
  bookId: string
  title: string
  author: string
  keyIdeas: string[]
  whyImportant: string
  bestEpisode: {
    id: string
    title: string
    episodeNumber: number | null
  } | null
  relatedConcepts: string[]
  toneAnalysis: string
  audienceFit: string
  aiSummary: string
  aiSummaryAr: string
  discussedInEpisodes: Array<{
    id: string
    title: string
    titleAr: string
    date: Date | string
    relevance?: number
  }>
  relatedSpeakers: Array<{
    id: string
    name: string
    relevance?: number
  }>
  topQuotes: Array<{
    id: string
    text: string
    textAr: string
    speaker?: string
    timestamp: number
    episodeId?: string
    impact: number
    themes: string[]
  }>
  category: string
  rating: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  centralNode?: GraphNode
}

export interface RecommendedBook {
  id: string
  title: string
  titleAr: string
  author: string
  category: string | null
  rating: number | null
  score: number
  reason: string
  reasonAr: string
}

// ============================================
// API FETCHERS
// ============================================

/**
 * Fetch book insights from AI API
 */
export async function fetchBookInsights(
  bookId: string
): Promise<BookInsightsData | null> {
  try {
    const response = await fetch(`${API_BASE}/api/insights/book?bookId=${bookId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error('Failed to fetch book insights:', response.status)
      return null
    }

    const result: APIResponse<{ bookId: string; insights: BookInsightsData }> = await response.json()
    
    if (result.success && result.data) {
      return result.data.insights
    }
    
    return null
  } catch (error) {
    console.error('Error fetching book insights:', error)
    return null
  }
}

/**
 * Fetch book graph data (related nodes and edges)
 */
export async function fetchBookGraph(
  bookId: string
): Promise<GraphData | null> {
  try {
    const response = await fetch(`${API_BASE}/api/graph/node?nodeId=${bookId}&type=book`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error('Failed to fetch book graph:', response.status)
      return null
    }

    const result: APIResponse<GraphData> = await response.json()
    
    if (result.success && result.data) {
      return result.data
    }
    
    return null
  } catch (error) {
    console.error('Error fetching book graph:', error)
    return null
  }
}

/**
 * Fetch similar book recommendations
 */
export async function fetchSimilarBooks(
  bookId: string,
  limit: number = 4
): Promise<RecommendedBook[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/recommend/books?similarTo=${bookId}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      console.error('Failed to fetch similar books:', response.status)
      return []
    }

    const result: APIResponse<{ recommendations: RecommendedBook[] }> = await response.json()
    
    if (result.success && result.data) {
      return result.data.recommendations
    }
    
    return []
  } catch (error) {
    console.error('Error fetching similar books:', error)
    return []
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get category color based on category name
 */
export function getCategoryColor(category: string | null): string {
  const categoryColors: Record<string, string> = {
    'تنمية ذاتية': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'قيادة': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'علم نفس': 'bg-purple-100 text-purple-700 border-purple-200',
    'أعمال': 'bg-blue-100 text-blue-700 border-blue-200',
    'تقنية': 'bg-slate-100 text-slate-700 border-slate-200',
    'فلسفة': 'bg-amber-100 text-amber-700 border-amber-200',
    'تاريخ': 'bg-orange-100 text-orange-700 border-orange-200',
    'إنتاجية': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  }
  return categoryColors[category || ''] || 'bg-gray-100 text-gray-700 border-gray-200'
}

/**
 * Format rating to stars display
 */
export function formatRating(rating: number | null): { full: number; half: boolean; empty: number } {
  if (!rating) return { full: 0, half: false, empty: 5 }
  
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  
  return { full, half, empty }
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format date to Arabic locale string
 */
export function formatDateAr(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get mood color based on Arabic mood type
 */
export function getMoodColor(mood: string | null): string {
  const moodColors: Record<string, string> = {
    'تحفيزي': 'bg-orange-100 text-orange-700',
    'معرفي': 'bg-blue-100 text-blue-700',
    'نقاشي': 'bg-purple-100 text-purple-700',
    'تحليلي': 'bg-teal-100 text-teal-700',
    'ملهم': 'bg-amber-100 text-amber-700',
    'هادئ': 'bg-green-100 text-green-700',
  }
  return moodColors[mood || ''] || 'bg-gray-100 text-gray-700'
}

/**
 * Get persona badge color
 */
export function getPersonaColor(persona: string | null): string {
  const personaColors: Record<string, string> = {
    'تحليلي': 'bg-teal-100 text-teal-700',
    'تحفيزي': 'bg-orange-100 text-orange-700',
    'قيادي': 'bg-indigo-100 text-indigo-700',
    'تقني': 'bg-slate-100 text-slate-700',
    'إبداعي': 'bg-pink-100 text-pink-700',
    'استراتيجي': 'bg-violet-100 text-violet-700',
  }
  return personaColors[persona || ''] || 'bg-gray-100 text-gray-700'
}




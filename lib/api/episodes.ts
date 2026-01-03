/**
 * Episode API Client Functions
 * Typed fetchers for Episode-related API calls
 */

import type { 
  EpisodeInsights, 
  GraphNode, 
  GraphEdge, 
  RecommendedItem,
  APIResponse 
} from '@/lib/ai/shared/types'

// Base URL for API routes
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface EpisodePageData {
  episode: FullEpisode
  books: EpisodeBook[]
  speakers: EpisodeSpeaker[]
  quotes: EpisodeQuote[]
  insights: EpisodeInsightsData | null
  graph: GraphData | null
  recommendations: RecommendedEpisode[]
}

export interface FullEpisode {
  id: string
  title: string
  date: Date | string
  audioUrl: string | null
  summaryAI: string | null
  topicsAI: string | null
  aiMood: string | null
  duration: number | null
  episodeNumber: number | null
  chaptersJson: string | null
  highlightsJson: string | null
  createdAt: Date
  updatedAt: Date
}

export interface EpisodeBook {
  id: string
  title: string
  author: string | null
  aiCoverUrl: string | null
  description: string | null
  category: string | null
  rating: number | null
}

export interface EpisodeSpeaker {
  id: string
  name: string
  avatarAI: string | null
  bioAI: string | null
  aiPersona: string | null
  aiTopTopic: string | null
  episodeCount: number | null
}

export interface EpisodeQuote {
  id: string
  text: string
  speakerName: string | null
  bookTitle: string | null
}

export interface EpisodeChapter {
  id: string
  time: string
  timeSeconds: number
  title: string
  titleAr: string
  topics?: string[]
}

export interface EpisodeHighlight {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  timestamp?: number
  importance: number
}

export interface EpisodeInsightsData {
  episodeId: string
  mood: string
  moodAr: string
  topIdeas: Array<{
    idea: string
    ideaAr: string
    importance: number
    relatedTo: string[]
  }>
  mostImpactfulSpeaker: {
    id: string
    name: string
    relevance?: number
  } | null
  mostMentionedBook: {
    id: string
    title: string
    author: string
    mentionCount: number
  } | null
  summary: string
  summaryAr: string
  keyTakeaways: string[]
  keyTakeawaysAr: string[]
  statistics: {
    totalDuration: number
    speakerCount: number
    booksMentioned: number
    quotesExtracted: number
    topicsDiscussed: number
  }
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  centralNode?: GraphNode
}

export interface RecommendedEpisode {
  id: string
  title: string
  titleAr: string
  score: number
  reason: string
  reasonAr: string
  metadata?: {
    date?: string
    speakers?: string[]
    duration?: number
    episodeNumber?: number
  }
}

// ============================================
// API FETCHERS
// ============================================

/**
 * Fetch episode insights from AI API
 */
export async function fetchEpisodeInsights(
  episodeId: string
): Promise<EpisodeInsightsData | null> {
  try {
    const response = await fetch(`${API_BASE}/api/insights/episode?episodeId=${episodeId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      console.error('Failed to fetch episode insights:', response.status)
      return null
    }

    const result: APIResponse<{ episodeId: string; insights: EpisodeInsightsData }> = await response.json()
    
    if (result.success && result.data) {
      return result.data.insights
    }
    
    return null
  } catch (error) {
    console.error('Error fetching episode insights:', error)
    return null
  }
}

/**
 * Fetch episode graph data (related nodes and edges)
 */
export async function fetchEpisodeGraph(
  episodeId: string
): Promise<GraphData | null> {
  try {
    const response = await fetch(`${API_BASE}/api/graph/node?nodeId=${episodeId}&nodeType=episode`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error('Failed to fetch episode graph:', response.status)
      return null
    }

    const result: APIResponse<GraphData> = await response.json()
    
    if (result.success && result.data) {
      return result.data
    }
    
    return null
  } catch (error) {
    console.error('Error fetching episode graph:', error)
    return null
  }
}

/**
 * Fetch similar episode recommendations
 */
export async function fetchSimilarEpisodes(
  episodeId: string,
  limit: number = 4
): Promise<RecommendedEpisode[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/recommend/episodes?similarTo=${episodeId}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      console.error('Failed to fetch similar episodes:', response.status)
      return []
    }

    const result: APIResponse<{ recommendations: RecommendedEpisode[] }> = await response.json()
    
    if (result.success && result.data) {
      return result.data.recommendations
    }
    
    return []
  } catch (error) {
    console.error('Error fetching similar episodes:', error)
    return []
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parse chapters JSON safely
 */
export function parseChapters(chaptersJson: string | null): EpisodeChapter[] {
  if (!chaptersJson) return []
  
  try {
    const parsed = JSON.parse(chaptersJson)
    if (Array.isArray(parsed)) {
      return parsed.map((ch, index) => ({
        id: ch.id || `chapter-${index}`,
        time: ch.time || '00:00',
        timeSeconds: ch.timeSeconds || 0,
        title: ch.title || ch.titleAr || '',
        titleAr: ch.titleAr || ch.title || '',
        topics: ch.topics || []
      }))
    }
    return []
  } catch {
    return []
  }
}

/**
 * Parse highlights JSON safely
 */
export function parseHighlights(highlightsJson: string | null): EpisodeHighlight[] {
  if (!highlightsJson) return []
  
  try {
    const parsed = JSON.parse(highlightsJson)
    if (Array.isArray(parsed)) {
      return parsed.map((hl, index) => ({
        id: hl.id || `highlight-${index}`,
        title: hl.title || '',
        titleAr: hl.titleAr || hl.title || '',
        description: hl.description || '',
        descriptionAr: hl.descriptionAr || hl.description || '',
        timestamp: hl.timestamp,
        importance: hl.importance || 50
      }))
    }
    return []
  } catch {
    return []
  }
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
    'تحفيزي': 'bg-orange-100 text-orange-700 border-orange-200',
    'معرفي': 'bg-blue-100 text-blue-700 border-blue-200',
    'نقاشي': 'bg-purple-100 text-purple-700 border-purple-200',
    'تحليلي': 'bg-teal-100 text-teal-700 border-teal-200',
    'ملهم': 'bg-amber-100 text-amber-700 border-amber-200',
    'هادئ': 'bg-green-100 text-green-700 border-green-200',
  }
  return moodColors[mood || ''] || 'bg-gray-100 text-gray-700 border-gray-200'
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




// Episode Types
export interface Episode {
  id: string
  title: string
  date: Date | string
  audioUrl?: string
  summaryAI?: string
  topicsAI?: string
  aiMood?: AIMood
  duration?: number
  episodeNumber?: number
  books?: BookEpisode[]
  speakers?: SpeakerEpisode[]
  quotes?: Quote[]
  chapters?: EpisodeChapter[]
  keyBullets?: string[]
  createdAt?: Date
}

export interface EpisodeChapter {
  time: string
  timeSeconds: number
  label: string
}

export type AIMood = 'تحفيزي' | 'معرفي' | 'نقاشي' | 'تحليلي' | 'ملهم' | 'هادئ'

// Book Types
export interface Book {
  id: string
  title: string
  author?: string
  aiCoverUrl?: string
  description?: string
  rating?: number
  category?: BookCategory
  mentionedInEpisode?: string
  mentionedAtTime?: string
  episodes?: BookEpisode[]
  speakers?: SpeakerBook[]
  quotes?: Quote[]
}

export type BookCategory = 'تنمية ذاتية' | 'قيادة' | 'علم نفس' | 'أعمال' | 'تقنية' | 'فلسفة' | 'تاريخ' | 'إنتاجية'

// Speaker Types
export interface Speaker {
  id: string
  name: string
  avatarAI?: string
  bioAI?: string
  sentiment?: string
  aiPersona?: AIPersona
  episodeCount?: number
  booksCount?: number
  aiTopTopic?: string
  aiInsight?: string
  twitterHandle?: string // Twitter/X handle (without @)
  aiInsightsBullets?: string[] // 2-3 short insight bullets
  books?: SpeakerBook[]
  episodes?: SpeakerEpisode[]
  quotes?: Quote[]
}

export type AIPersona = 'تحليلي' | 'تحفيزي' | 'قيادي' | 'تقني' | 'إبداعي' | 'استراتيجي'

// Quote Types
export interface Quote {
  id: string
  text: string
  episodeId?: string
  episode?: Episode
  speakerId?: string
  speaker?: Speaker
  speakerName?: string
  bookId?: string
  book?: Book
  bookTitle?: string
  episodeTitle?: string
  episodeNumber?: number
  engagement?: number
  aiAnalysis?: QuoteAnalysis
}

export interface QuoteAnalysis {
  explanation: string
  theme: string
  relatedConcepts: string[]
}

// Relation Types
export interface BookEpisode {
  id: string
  episodeId: string
  episode?: Episode
  bookId: string
  book?: Book
}

export interface SpeakerEpisode {
  id: string
  episodeId: string
  episode?: Episode
  speakerId: string
  speaker?: Speaker
}

export interface SpeakerBook {
  id: string
  speakerId: string
  speaker?: Speaker
  bookId: string
  book?: Book
}

// Knowledge Graph Types
export interface ConceptNode {
  id: number
  x: number
  y: number
  label: string
  size: number
  color: string
  description?: string
  relatedBooks?: string[]
  relatedSpeakers?: string[]
}

export interface ConceptLink {
  source: number
  target: number
}

export interface ConceptAnalysis {
  explanation: string
  recommendedBook: {
    title: string
    author: string
  }
  quote: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Search Types
export interface SearchResult {
  type: 'episode' | 'book' | 'speaker' | 'quote'
  id: string
  title: string
  subtitle?: string
  relevance?: number
}

export interface SearchFilters {
  type?: ('episode' | 'book' | 'speaker' | 'quote')[]
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

// AI Types
export interface AISummaryResult {
  summary: string
  topics: string[]
  keyPoints: string[]
}

export interface AIExtractedBook {
  title: string
  author?: string
  description?: string
}

export interface AIExtractedSpeaker {
  name: string
  bio?: string
  sentiment?: string
  role?: string
}

export interface AIExtractedQuote {
  text: string
  speakerName?: string
  bookTitle?: string
  context?: string
}

// User Persona Types
export interface UserPersonaResult {
  persona: string
  interests: string[]
  recommendedTopics: string[]
  engagementLevel: 'high' | 'medium' | 'low'
}

// Reading Coach Types
export interface ReadingPlan {
  weekNumber: number
  days: ReadingDay[]
  totalBooks: number
  estimatedTime: string
}

export interface ReadingDay {
  day: string
  book: string
  chapter?: string
  duration: string
  notes?: string
}

// Episode Insights Types
export interface EpisodeInsights {
  topBook: {
    title: string
    author: string
  }
  topSpeaker: {
    name: string
    topic: string
  }
  mainIdea: string
  mood: AIMood
  keyTakeaways: string[]
}

// Roaming Mode Types
export interface RoamingStep {
  type: 'book' | 'speaker' | 'concept' | 'episode' | 'quote'
  id: string
  title: string
  description: string
  connection: string
}

// Weekly Digest Types
export interface WeeklyDigestData {
  bookOfWeek: Book
  speakerOfWeek: Speaker
  ideaOfWeek: string
  books: Book[]
  speakers: Speaker[]
  quotes: Quote[]
}

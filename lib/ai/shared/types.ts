/**
 * AI Backend Types for فطور السبت Platform
 * Complete type definitions for all AI services
 */

// ============================================
// ANALYSIS TYPES
// ============================================

export interface EpisodeAnalysis {
  episodeId: string
  title: string
  transcript: TranscriptData
  topics: TopicData[]
  books: BookData[]
  speakers: SpeakerData[]
  quotes: QuoteData[]
  highlights: HighlightData[]
  sentiment: SentimentData
  chapters: ChapterData[]
  summary: string
  aiMood: AIMoodType
  duration: number
  analyzedAt: Date
}

export interface SpeakerAnalysis {
  speakerId: string
  name: string
  topTopics: TopicData[]
  impactScore: number
  toneAnalysis: ToneAnalysis
  frequentBooks: BookMention[]
  episodeAppearances: EpisodeAppearance[]
  quotes: QuoteData[]
  aiPersona: AIPersonaType
}

export interface BookAnalysis {
  bookId: string
  title: string
  author: string
  aiSummary: string
  relatedEpisodes: EpisodeReference[]
  relatedSpeakers: SpeakerReference[]
  topQuotes: QuoteData[]
  mentionCount: number
  averageRelevance: number
  category: BookCategoryType
}

// ============================================
// DATA TYPES
// ============================================

export interface TranscriptData {
  text: string
  segments: TranscriptSegment[]
  language: string
  confidence: number
}

export interface TranscriptSegment {
  id: number
  start: number
  end: number
  text: string
  speaker?: string
  confidence: number
}

export interface TopicData {
  id: string
  name: string
  nameAr: string
  confidence: number
  relevance: number
  mentions: number
  relatedConcepts: string[]
}

export interface BookData {
  id: string
  title: string
  titleAr: string
  author: string
  authorAr?: string
  mentionedAt: number[] // timestamps in seconds
  relevance: number
  context: string
  category?: BookCategoryType
}

export interface SpeakerData {
  id: string
  name: string
  speakingTime: number // in seconds
  segments: [number, number][] // [start, end] pairs
  sentiment: string
  confidence: number
}

export interface QuoteData {
  id: string
  text: string
  textAr: string
  speaker?: string
  timestamp: number
  episodeId?: string
  bookId?: string
  impact: number // 0-100
  themes: string[]
}

export interface HighlightData {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  timestamp?: number
  importance: number
  relatedTopics: string[]
}

export interface SentimentData {
  overall: AIMoodType
  confidence: number
  breakdown: {
    positive: number
    negative: number
    neutral: number
  }
  dominantEmotions: EmotionScore[]
  toneAnalysis: ToneAnalysis
}

export interface EmotionScore {
  emotion: string
  emotionAr: string
  score: number
}

export interface ToneAnalysis {
  primary: ToneType
  secondary?: ToneType
  confidence: number
  description: string
  descriptionAr: string
}

export interface ChapterData {
  id: string
  time: string
  timeSeconds: number
  title: string
  titleAr: string
  description?: string
  topics: string[]
}

// ============================================
// KNOWLEDGE GRAPH TYPES
// ============================================

export interface GraphNode {
  id: string
  type: NodeType
  label: string
  labelAr: string
  properties: Record<string, unknown>
  x?: number
  y?: number
  size?: number
  color?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: EdgeType
  weight: number
  label?: string
  properties?: Record<string, unknown>
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  metadata: {
    nodeCount: number
    edgeCount: number
    lastUpdated: Date
    version: string
  }
}

export interface GraphQueryResult {
  node: GraphNode
  neighbors: GraphNode[]
  edges: GraphEdge[]
  relatedBooks: BookData[]
  relatedEpisodes: EpisodeReference[]
  relatedSpeakers: SpeakerReference[]
}

// ============================================
// RECOMMENDATION TYPES
// ============================================

export interface RecommendationResult {
  items: RecommendedItem[]
  algorithm: string
  confidence: number
  basedOn: string[]
  generatedAt: Date
}

export interface RecommendedItem {
  id: string
  type: 'episode' | 'book' | 'speaker' | 'quote' | 'topic'
  title: string
  titleAr: string
  score: number
  reason: string
  reasonAr: string
  metadata?: Record<string, unknown>
}

export interface UserProfile {
  userId: string
  favoriteTopics: TopicPreference[]
  preferredTone: ToneType
  preferredMood: AIMoodType
  listeningHistory: ListeningHistoryItem[]
  averageWatchDuration: number
  engagementScore: number
  lastActive: Date
  preferences: UserPreferences
}

export interface TopicPreference {
  topic: string
  topicAr: string
  affinity: number
  interactionCount: number
}

export interface ListeningHistoryItem {
  episodeId: string
  listenedAt: Date
  duration: number
  completed: boolean
  rating?: number
}

export interface UserPreferences {
  language: 'ar' | 'en'
  notificationsEnabled: boolean
  autoPlay: boolean
  preferredDuration: 'short' | 'medium' | 'long'
}

// ============================================
// INSIGHTS TYPES
// ============================================

export interface EpisodeInsights {
  episodeId: string
  mood: AIMoodType
  moodAr: string
  topIdeas: IdeaInsight[]
  mostImpactfulSpeaker: SpeakerReference
  mostMentionedBook: BookReference
  summary: string
  summaryAr: string
  keyTakeaways: string[]
  keyTakeawaysAr: string[]
  statistics: EpisodeStats
}

export interface SpeakerInsights {
  speakerId: string
  name: string
  topTopics: TopicInsight[]
  impactScores: ImpactScores
  frequentBooks: BookMention[]
  appearanceStats: AppearanceStats
  aiPersona: AIPersonaType
  aiPersonaDescription: string
}

export interface BookInsights {
  bookId: string
  title: string
  author: string
  discussedInEpisodes: EpisodeReference[]
  relatedSpeakers: SpeakerReference[]
  topQuotes: QuoteData[]
  aiSummary: string
  aiSummaryAr: string
  category: BookCategoryType
  rating: number
}

export interface IdeaInsight {
  idea: string
  ideaAr: string
  importance: number
  relatedTo: string[]
}

export interface TopicInsight {
  topic: string
  topicAr: string
  frequency: number
  depth: number
  recentEpisodes: string[]
}

export interface ImpactScores {
  overall: number
  engagement: number
  expertise: number
  clarity: number
}

export interface AppearanceStats {
  totalEpisodes: number
  totalSpeakingTime: number
  averageDuration: number
  lastAppearance: Date
}

export interface EpisodeStats {
  totalDuration: number
  speakerCount: number
  booksMentioned: number
  quotesExtracted: number
  topicsDiscussed: number
}

// ============================================
// REFERENCE TYPES
// ============================================

export interface EpisodeReference {
  id: string
  title: string
  titleAr: string
  date: Date
  relevance?: number
}

export interface SpeakerReference {
  id: string
  name: string
  role?: string
  relevance?: number
}

export interface BookReference {
  id: string
  title: string
  author: string
  mentionCount: number
}

export interface BookMention {
  bookId: string
  title: string
  author: string
  mentionCount: number
  lastMentioned: Date
}

export interface EpisodeAppearance {
  episodeId: string
  title: string
  date: Date
  speakingTime: number
  topics: string[]
}

// ============================================
// ENUM TYPES
// ============================================

export type AIMoodType = 
  | 'تحفيزي'    // Motivational
  | 'معرفي'     // Educational
  | 'نقاشي'     // Discussive
  | 'تحليلي'    // Analytical
  | 'ملهم'      // Inspiring
  | 'حيادي'     // Neutral

export type AIPersonaType =
  | 'تحليلي'    // Analytical
  | 'تحفيزي'    // Motivational
  | 'قيادي'     // Leadership
  | 'تقني'      // Technical
  | 'إبداعي'    // Creative
  | 'استراتيجي'  // Strategic

export type ToneType =
  | 'formal'
  | 'informal'
  | 'academic'
  | 'conversational'
  | 'inspirational'
  | 'analytical'

export type BookCategoryType =
  | 'تنمية ذاتية'
  | 'قيادة'
  | 'علم نفس'
  | 'أعمال'
  | 'تقنية'
  | 'فلسفة'
  | 'تاريخ'
  | 'إنتاجية'

export type NodeType =
  | 'episode'
  | 'book'
  | 'speaker'
  | 'quote'
  | 'concept'
  | 'topic'

export type EdgeType =
  | 'mentions'
  | 'discusses'
  | 'authored'
  | 'speaks_about'
  | 'related_to'
  | 'quoted_in'
  | 'appears_in'

// ============================================
// API TYPES
// ============================================

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: APIError
  meta?: APIMeta
}

export interface APIError {
  code: string
  message: string
  messageAr: string
  details?: Record<string, unknown>
}

export interface APIMeta {
  requestId: string
  processingTime: number
  version: string
  timestamp: Date
}

export interface AnalyzeEpisodeRequest {
  episodeId: string
  audioUrl: string
  title?: string
  forceReanalyze?: boolean
}

export interface AnalyzeConceptRequest {
  concept: string
  depth?: 'shallow' | 'deep'
  includeRelated?: boolean
}

export interface RecommendRequest {
  userId?: string
  type: 'episodes' | 'books' | 'speakers'
  limit?: number
  basedOn?: string[]
  excludeIds?: string[]
}

export interface GraphRequest {
  nodeId?: string
  nodeType?: NodeType
  depth?: number
  limit?: number
}

// ============================================
// LLM TYPES
// ============================================

export interface LLMConfig {
  provider: 'openai' | 'gemini'
  model: string
  temperature: number
  maxTokens: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface LLMResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason: string
}

export interface EmbeddingResult {
  embedding: number[]
  model: string
  dimensions: number
}

export interface SemanticSearchResult {
  id: string
  score: number
  content: string
  metadata: Record<string, unknown>
}




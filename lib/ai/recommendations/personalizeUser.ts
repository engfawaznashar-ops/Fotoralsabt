/**
 * User Personalization Service
 * Builds AI-driven user profiles based on interactions
 */

import type { UserProfile, TopicPreference, AIMoodType, ToneType, ListeningHistoryItem } from '../shared/types'
import { openaiLLM } from '../shared/llm'
import { extractJSONFromResponse, generateId } from '../shared/utils'
import { prisma } from '@/lib/db'

export interface PersonalizationData {
  episodesWatched: string[]
  booksViewed: string[]
  speakersFollowed: string[]
  quotesSaved: string[]
  searchQueries: string[]
  timeSpentPerEpisode: { episodeId: string; duration: number }[]
}

/**
 * Build user profile from interaction data
 */
export async function buildUserProfile(
  userId: string,
  data: PersonalizationData
): Promise<UserProfile> {
  // Analyze favorite topics
  const favoriteTopics = await analyzeFavoriteTopics(data)

  // Determine preferred tone
  const preferredTone = await determinePreferredTone(data)

  // Determine preferred mood
  const preferredMood = await determinePreferredMood(data)

  // Calculate average watch duration
  const averageWatchDuration = calculateAverageWatchDuration(data.timeSpentPerEpisode)

  // Build listening history
  const listeningHistory: ListeningHistoryItem[] = data.episodesWatched.map(episodeId => {
    const timeData = data.timeSpentPerEpisode.find(t => t.episodeId === episodeId)
    return {
      episodeId,
      listenedAt: new Date(),
      duration: timeData?.duration || 0,
      completed: (timeData?.duration || 0) > 0.8 * 45 * 60 // 80% of avg episode
    }
  })

  // Calculate engagement score
  const engagementScore = calculateEngagementScore(data)

  return {
    userId,
    favoriteTopics,
    preferredTone,
    preferredMood,
    listeningHistory,
    averageWatchDuration,
    engagementScore,
    lastActive: new Date(),
    preferences: {
      language: 'ar',
      notificationsEnabled: true,
      autoPlay: true,
      preferredDuration: categorizePreferredDuration(averageWatchDuration)
    }
  }
}

/**
 * Analyze favorite topics from user data
 */
async function analyzeFavoriteTopics(data: PersonalizationData): Promise<TopicPreference[]> {
  try {
    // Get topics from watched episodes
    const episodes = await prisma.episode.findMany({
      where: { id: { in: data.episodesWatched } },
      select: { topicsAI: true }
    })

    // Get topics from viewed books
    const books = await prisma.book.findMany({
      where: { id: { in: data.booksViewed } },
      select: { category: true }
    })

    // Count topic occurrences
    const topicCounts: Record<string, number> = {}

    for (const episode of episodes) {
      if (episode.topicsAI) {
        const topics = episode.topicsAI.split(',').map(t => t.trim())
        for (const topic of topics) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1
        }
      }
    }

    for (const book of books) {
      if (book.category) {
        topicCounts[book.category] = (topicCounts[book.category] || 0) + 1
      }
    }

    // Add weight from search queries
    for (const query of data.searchQueries) {
      const words = query.split(' ')
      for (const word of words) {
        if (word.length > 2) {
          topicCounts[word] = (topicCounts[word] || 0) + 0.5
        }
      }
    }

    // Convert to TopicPreference array
    const totalInteractions = Object.values(topicCounts).reduce((a, b) => a + b, 0)

    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({
        topic,
        topicAr: topic,
        affinity: count / totalInteractions,
        interactionCount: count
      }))

  } catch (error) {
    console.error('Topic analysis error:', error)
    return []
  }
}

/**
 * Determine preferred tone from content consumption
 */
async function determinePreferredTone(data: PersonalizationData): Promise<ToneType> {
  try {
    const episodes = await prisma.episode.findMany({
      where: { id: { in: data.episodesWatched.slice(0, 20) } },
      select: { summaryAI: true, title: true }
    })

    if (episodes.length === 0) return 'conversational'

    const content = episodes.map(e => `${e.title} ${e.summaryAI || ''}`).join('\n')

    const prompt = `بناءً على المحتوى التالي، حدد النبرة المفضلة للمستخدم:

${content.slice(0, 3000)}

الخيارات: formal, informal, academic, conversational, inspirational, analytical

أجب بكلمة واحدة فقط.`

    const response = await openaiLLM.generateText(prompt)
    const tone = response.content.trim().toLowerCase()

    const validTones: ToneType[] = ['formal', 'informal', 'academic', 'conversational', 'inspirational', 'analytical']
    return validTones.includes(tone as ToneType) ? tone as ToneType : 'conversational'

  } catch (error) {
    console.error('Tone determination error:', error)
    return 'conversational'
  }
}

/**
 * Determine preferred mood from content consumption
 */
async function determinePreferredMood(data: PersonalizationData): Promise<AIMoodType> {
  try {
    const episodes = await prisma.episode.findMany({
      where: { id: { in: data.episodesWatched.slice(0, 20) } },
      select: { aiMood: true }
    })

    if (episodes.length === 0) return 'معرفي'

    // Count mood occurrences
    const moodCounts: Record<string, number> = {}
    for (const episode of episodes) {
      const mood = episode.aiMood || 'حيادي'
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    }

    // Find most common mood
    let maxMood: AIMoodType = 'معرفي'
    let maxCount = 0

    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > maxCount) {
        maxCount = count
        maxMood = mood as AIMoodType
      }
    }

    return maxMood

  } catch (error) {
    console.error('Mood determination error:', error)
    return 'معرفي'
  }
}

/**
 * Calculate average watch duration
 */
function calculateAverageWatchDuration(
  timeData: { episodeId: string; duration: number }[]
): number {
  if (timeData.length === 0) return 0

  const totalDuration = timeData.reduce((sum, t) => sum + t.duration, 0)
  return totalDuration / timeData.length
}

/**
 * Calculate engagement score (0-100)
 */
function calculateEngagementScore(data: PersonalizationData): number {
  let score = 0

  // Episodes watched (up to 30 points)
  score += Math.min(data.episodesWatched.length * 3, 30)

  // Books viewed (up to 20 points)
  score += Math.min(data.booksViewed.length * 4, 20)

  // Speakers followed (up to 15 points)
  score += Math.min(data.speakersFollowed.length * 5, 15)

  // Quotes saved (up to 15 points)
  score += Math.min(data.quotesSaved.length * 3, 15)

  // Search activity (up to 20 points)
  score += Math.min(data.searchQueries.length * 2, 20)

  return Math.min(score, 100)
}

/**
 * Categorize preferred duration
 */
function categorizePreferredDuration(avgDuration: number): 'short' | 'medium' | 'long' {
  const avgMinutes = avgDuration / 60

  if (avgMinutes < 20) return 'short'
  if (avgMinutes < 45) return 'medium'
  return 'long'
}

/**
 * Update user profile with new interaction
 */
export async function updateUserProfile(
  currentProfile: UserProfile,
  newInteraction: {
    type: 'episode' | 'book' | 'speaker' | 'quote' | 'search'
    id: string
    duration?: number
  }
): Promise<UserProfile> {
  const updatedProfile = { ...currentProfile }

  switch (newInteraction.type) {
    case 'episode':
      if (!updatedProfile.listeningHistory.find(h => h.episodeId === newInteraction.id)) {
        updatedProfile.listeningHistory.push({
          episodeId: newInteraction.id,
          listenedAt: new Date(),
          duration: newInteraction.duration || 0,
          completed: (newInteraction.duration || 0) > 2400 // 40 minutes
        })
      }
      break
    // Add other interaction types as needed
  }

  updatedProfile.lastActive = new Date()
  updatedProfile.engagementScore = Math.min(
    updatedProfile.engagementScore + 1,
    100
  )

  return updatedProfile
}

/**
 * Get personalized content summary
 */
export async function getPersonalizedSummary(
  profile: UserProfile
): Promise<{
  topTopics: string[]
  recommendedCategories: string[]
  engagementLevel: string
  suggestion: string
}> {
  const topTopics = profile.favoriteTopics.slice(0, 3).map(t => t.topic)

  let engagementLevel: string
  if (profile.engagementScore >= 70) {
    engagementLevel = 'مستخدم نشط جداً'
  } else if (profile.engagementScore >= 40) {
    engagementLevel = 'مستخدم نشط'
  } else {
    engagementLevel = 'مستخدم جديد'
  }

  const suggestion = generatePersonalizedSuggestion(profile)

  return {
    topTopics,
    recommendedCategories: topTopics,
    engagementLevel,
    suggestion
  }
}

function generatePersonalizedSuggestion(profile: UserProfile): string {
  if (profile.engagementScore < 20) {
    return 'استمع لحلقتك الأولى واكتشف محتوى فطور السبت!'
  }

  if (profile.favoriteTopics.length > 0) {
    return `بناءً على اهتمامك بـ ${profile.favoriteTopics[0].topic}، لدينا حلقات جديدة ستعجبك.`
  }

  return 'استمر في الاستماع لاكتشاف المزيد من المحتوى المميز.'
}

export default buildUserProfile


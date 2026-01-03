/**
 * Episode Insights Service
 * Generates AI-powered insights for episodes
 */

import type { EpisodeInsights, AIMoodType, IdeaInsight, EpisodeStats } from '../shared/types'
import { openaiLLM } from '../shared/llm'
import { extractJSONFromResponse, getMoodArabic } from '../shared/utils'
import { prisma } from '@/lib/db'

/**
 * Get comprehensive insights for an episode
 */
export async function getEpisodeInsights(episodeId: string): Promise<EpisodeInsights | null> {
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        speakers: { include: { speaker: true } },
        books: { include: { book: true } },
        quotes: { include: { speaker: true } }
      }
    })

    if (!episode) return null

    // Get mood
    const mood = (episode.aiMood as AIMoodType) || 'معرفي'
    const moodAr = getMoodArabic(mood) || mood

    // Extract top ideas
    const topIdeas = await extractTopIdeas(episode)

    // Find most impactful speaker
    const mostImpactfulSpeaker = findMostImpactfulSpeaker(episode)

    // Find most mentioned book
    const mostMentionedBook = findMostMentionedBook(episode)

    // Generate summary
    const summary = episode.summaryAI || await generateEpisodeSummary(episode)

    // Generate key takeaways
    const keyTakeaways = await generateKeyTakeaways(episode)

    // Calculate statistics
    const statistics = calculateEpisodeStats(episode)

    return {
      episodeId,
      mood,
      moodAr,
      topIdeas,
      mostImpactfulSpeaker,
      mostMentionedBook,
      summary,
      summaryAr: summary,
      keyTakeaways,
      keyTakeawaysAr: keyTakeaways,
      statistics
    }

  } catch (error) {
    console.error('Episode insights error:', error)
    return null
  }
}

/**
 * Extract top ideas from episode
 */
async function extractTopIdeas(episode: any): Promise<IdeaInsight[]> {
  const content = `${episode.title} ${episode.summaryAI || ''} ${episode.topicsAI || ''}`

  const prompt = `استخرج أهم 3 أفكار رئيسية من هذا المحتوى:

${content}

أجب بصيغة JSON:
{
  "ideas": [
    {
      "idea": "الفكرة",
      "ideaAr": "الفكرة بالعربية",
      "importance": 90,
      "relatedTo": ["موضوع1", "موضوع2"]
    }
  ]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)
    return result.ideas || []

  } catch (error) {
    console.error('Top ideas extraction error:', error)
    return []
  }
}

/**
 * Find most impactful speaker
 */
function findMostImpactfulSpeaker(episode: any): { id: string; name: string; relevance?: number } {
  if (!episode.speakers || episode.speakers.length === 0) {
    return { id: '', name: 'غير محدد' }
  }

  // For now, return first speaker
  // In production, calculate based on speaking time, quotes, etc.
  const speaker = episode.speakers[0].speaker
  return {
    id: speaker.id,
    name: speaker.name,
    relevance: 0.9
  }
}

/**
 * Find most mentioned book
 */
function findMostMentionedBook(episode: any): { id: string; title: string; author: string; mentionCount: number } {
  if (!episode.books || episode.books.length === 0) {
    return { id: '', title: 'غير محدد', author: '', mentionCount: 0 }
  }

  // For now, return first book
  const book = episode.books[0].book
  return {
    id: book.id,
    title: book.title,
    author: book.author || '',
    mentionCount: 1
  }
}

/**
 * Generate episode summary using AI
 */
async function generateEpisodeSummary(episode: any): Promise<string> {
  const content = `العنوان: ${episode.title}
المواضيع: ${episode.topicsAI || 'غير محدد'}
المتحدثون: ${episode.speakers?.map((s: any) => s.speaker.name).join(', ') || 'غير محدد'}
الكتب: ${episode.books?.map((b: any) => b.book.title).join(', ') || 'غير محدد'}`

  const prompt = `اكتب ملخصاً مختصراً (50 كلمة كحد أقصى) لهذه الحلقة:

${content}

الملخص:`

  try {
    const response = await openaiLLM.generateText(prompt)
    return response.content.trim()

  } catch (error) {
    console.error('Summary generation error:', error)
    return episode.title
  }
}

/**
 * Generate key takeaways
 */
async function generateKeyTakeaways(episode: any): Promise<string[]> {
  const content = `${episode.title} ${episode.summaryAI || ''} ${episode.topicsAI || ''}`

  const prompt = `استخرج 3-5 نقاط عملية يمكن للمستمع تطبيقها من هذه الحلقة:

${content}

أجب بقائمة JSON:
["نقطة1", "نقطة2", "نقطة3"]`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    return JSON.parse(json) || []

  } catch (error) {
    console.error('Takeaways generation error:', error)
    return []
  }
}

/**
 * Calculate episode statistics
 */
function calculateEpisodeStats(episode: any): EpisodeStats {
  return {
    totalDuration: 45 * 60, // Default 45 minutes in seconds
    speakerCount: episode.speakers?.length || 0,
    booksMentioned: episode.books?.length || 0,
    quotesExtracted: episode.quotes?.length || 0,
    topicsDiscussed: episode.topicsAI?.split(',').length || 0
  }
}

/**
 * Compare episodes by insights
 */
export async function compareEpisodeInsights(
  episodeIds: string[]
): Promise<{
  commonTopics: string[]
  uniqueTopics: Record<string, string[]>
  moodDistribution: Record<string, number>
}> {
  try {
    const episodes = await prisma.episode.findMany({
      where: { id: { in: episodeIds } },
      select: {
        id: true,
        topicsAI: true,
        aiMood: true
      }
    })

    // Extract all topics
    const episodeTopics: Record<string, string[]> = {}
    const allTopics: string[] = []

    for (const episode of episodes) {
      const topics = episode.topicsAI?.split(',').map(t => t.trim()) || []
      episodeTopics[episode.id] = topics
      allTopics.push(...topics)
    }

    // Find common topics
    const topicCounts: Record<string, number> = {}
    for (const topic of allTopics) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1
    }

    const commonTopics = Object.entries(topicCounts)
      .filter(([_, count]) => count === episodes.length)
      .map(([topic]) => topic)

    // Find unique topics per episode
    const uniqueTopics: Record<string, string[]> = {}
    for (const [episodeId, topics] of Object.entries(episodeTopics)) {
      uniqueTopics[episodeId] = topics.filter(t => topicCounts[t] === 1)
    }

    // Mood distribution
    const moodDistribution: Record<string, number> = {}
    for (const episode of episodes) {
      const mood = episode.aiMood || 'حيادي'
      moodDistribution[mood] = (moodDistribution[mood] || 0) + 1
    }

    return { commonTopics, uniqueTopics, moodDistribution }

  } catch (error) {
    console.error('Episode comparison error:', error)
    return { commonTopics: [], uniqueTopics: {}, moodDistribution: {} }
  }
}

export default getEpisodeInsights


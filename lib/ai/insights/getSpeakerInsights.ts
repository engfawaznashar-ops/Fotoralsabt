/**
 * Speaker Insights Service
 * Generates AI-powered insights for speakers
 */

import type { SpeakerInsights, TopicInsight, ImpactScores, AppearanceStats, AIPersonaType, BookMention } from '../shared/types'
import { openaiLLM } from '../shared/llm'
import { extractJSONFromResponse, getPersonaArabic } from '../shared/utils'
import { prisma } from '@/lib/db'

/**
 * Get comprehensive insights for a speaker
 */
export async function getSpeakerInsights(speakerId: string): Promise<SpeakerInsights | null> {
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id: speakerId },
      include: {
        episodes: { 
          include: { 
            episode: {
              include: {
                books: { include: { book: true } }
              }
            }
          }
        },
        books: { include: { book: true } },
        quotes: true
      }
    })

    if (!speaker) return null

    // Get top topics
    const topTopics = await analyzeTopTopics(speaker)

    // Calculate impact scores
    const impactScores = calculateImpactScores(speaker)

    // Get frequent books
    const frequentBooks = getFrequentBooks(speaker)

    // Get appearance stats
    const appearanceStats = calculateAppearanceStats(speaker)

    // Determine AI persona
    const aiPersona = (speaker.aiPersona as AIPersonaType) || await determinePersona(speaker)

    // Generate persona description
    const aiPersonaDescription = await generatePersonaDescription(speaker, aiPersona)

    return {
      speakerId,
      name: speaker.name,
      topTopics,
      impactScores,
      frequentBooks,
      appearanceStats,
      aiPersona,
      aiPersonaDescription
    }

  } catch (error) {
    console.error('Speaker insights error:', error)
    return null
  }
}

/**
 * Analyze top topics for a speaker
 */
async function analyzeTopTopics(speaker: any): Promise<TopicInsight[]> {
  const topicCounts: Record<string, { count: number; recentEpisodes: string[] }> = {}

  for (const ep of speaker.episodes) {
    const topics = ep.episode.topicsAI?.split(',').map((t: string) => t.trim()) || []
    
    for (const topic of topics) {
      if (!topicCounts[topic]) {
        topicCounts[topic] = { count: 0, recentEpisodes: [] }
      }
      topicCounts[topic].count++
      topicCounts[topic].recentEpisodes.push(ep.episode.id)
    }
  }

  const totalEpisodes = speaker.episodes.length || 1

  return Object.entries(topicCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([topic, data]) => ({
      topic,
      topicAr: topic,
      frequency: data.count,
      depth: data.count / totalEpisodes, // How often this topic appears
      recentEpisodes: data.recentEpisodes.slice(0, 3)
    }))
}

/**
 * Calculate impact scores for a speaker
 */
function calculateImpactScores(speaker: any): ImpactScores {
  const episodeCount = speaker.episodes.length
  const quoteCount = speaker.quotes.length
  const bookCount = speaker.books.length

  // Normalize scores to 0-100
  const overall = Math.min(
    (episodeCount * 5 + quoteCount * 10 + bookCount * 8),
    100
  )

  const engagement = Math.min(quoteCount * 15, 100)
  const expertise = Math.min(bookCount * 12 + episodeCount * 3, 100)
  const clarity = 70 + Math.random() * 20 // Placeholder

  return {
    overall: Math.round(overall),
    engagement: Math.round(engagement),
    expertise: Math.round(expertise),
    clarity: Math.round(clarity)
  }
}

/**
 * Get books frequently mentioned by speaker
 */
function getFrequentBooks(speaker: any): BookMention[] {
  const bookCounts: Record<string, { book: any; count: number; lastMentioned: Date }> = {}

  for (const ep of speaker.episodes) {
    for (const bookEp of ep.episode.books) {
      const bookId = bookEp.book.id
      if (!bookCounts[bookId]) {
        bookCounts[bookId] = { book: bookEp.book, count: 0, lastMentioned: ep.episode.date }
      }
      bookCounts[bookId].count++
      if (ep.episode.date > bookCounts[bookId].lastMentioned) {
        bookCounts[bookId].lastMentioned = ep.episode.date
      }
    }
  }

  return Object.values(bookCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(data => ({
      bookId: data.book.id,
      title: data.book.title,
      author: data.book.author || '',
      mentionCount: data.count,
      lastMentioned: data.lastMentioned
    }))
}

/**
 * Calculate appearance statistics
 */
function calculateAppearanceStats(speaker: any): AppearanceStats {
  const episodes = speaker.episodes

  const totalEpisodes = episodes.length
  const totalSpeakingTime = speaker.episodeCount * 45 * 60 // Estimate
  const averageDuration = totalEpisodes > 0 ? totalSpeakingTime / totalEpisodes : 0

  // Find last appearance
  let lastAppearance = new Date(0)
  for (const ep of episodes) {
    if (ep.episode.date > lastAppearance) {
      lastAppearance = ep.episode.date
    }
  }

  return {
    totalEpisodes,
    totalSpeakingTime,
    averageDuration,
    lastAppearance
  }
}

/**
 * Determine speaker persona using AI
 */
async function determinePersona(speaker: any): Promise<AIPersonaType> {
  const content = `
    الاسم: ${speaker.name}
    السيرة: ${speaker.bioAI || 'غير متوفرة'}
    عدد الحلقات: ${speaker.episodes.length}
    المواضيع: ${speaker.aiTopTopic || 'متنوعة'}
  `

  const prompt = `بناءً على المعلومات التالية، حدد شخصية المتحدث:

${content}

الخيارات: تحليلي، تحفيزي، قيادي، تقني، إبداعي، استراتيجي

أجب بكلمة واحدة فقط.`

  try {
    const response = await openaiLLM.generateText(prompt)
    const persona = response.content.trim()
    
    const validPersonas: AIPersonaType[] = ['تحليلي', 'تحفيزي', 'قيادي', 'تقني', 'إبداعي', 'استراتيجي']
    return validPersonas.includes(persona as AIPersonaType) ? persona as AIPersonaType : 'تحليلي'

  } catch (error) {
    return 'تحليلي'
  }
}

/**
 * Generate persona description
 */
async function generatePersonaDescription(speaker: any, persona: AIPersonaType): Promise<string> {
  const descriptions: Record<AIPersonaType, string> = {
    'تحليلي': `${speaker.name} متحدث تحليلي يركز على الأرقام والحقائق والتحليل المنطقي للأفكار.`,
    'تحفيزي': `${speaker.name} متحدث تحفيزي يبث الطاقة الإيجابية ويشجع على اتخاذ الخطوات العملية.`,
    'قيادي': `${speaker.name} متحدث قيادي يوجه النقاش ويقدم رؤى استراتيجية واضحة.`,
    'تقني': `${speaker.name} متحدث تقني يركز على التفاصيل والجوانب العملية والتقنية.`,
    'إبداعي': `${speaker.name} متحدث إبداعي يطرح أفكاراً جديدة ومبتكرة ويفكر خارج الصندوق.`,
    'استراتيجي': `${speaker.name} متحدث استراتيجي يفكر بشكل شامل وطويل المدى ويربط الأفكار ببعضها.`
  }

  return descriptions[persona] || `${speaker.name} متحدث متميز في مجاله.`
}

/**
 * Compare multiple speakers
 */
export async function compareSpeakers(speakerIds: string[]): Promise<{
  comparison: {
    speakerId: string
    name: string
    topTopic: string
    impactScore: number
    episodeCount: number
  }[]
  commonTopics: string[]
}> {
  const insights = await Promise.all(
    speakerIds.map(id => getSpeakerInsights(id))
  )

  const validInsights = insights.filter((i): i is SpeakerInsights => i !== null)

  const comparison = validInsights.map(insight => ({
    speakerId: insight.speakerId,
    name: insight.name,
    topTopic: insight.topTopics[0]?.topic || 'غير محدد',
    impactScore: insight.impactScores.overall,
    episodeCount: insight.appearanceStats.totalEpisodes
  }))

  // Find common topics
  const allTopics = validInsights.flatMap(i => i.topTopics.map(t => t.topic))
  const topicCounts: Record<string, number> = {}
  for (const topic of allTopics) {
    topicCounts[topic] = (topicCounts[topic] || 0) + 1
  }

  const commonTopics = Object.entries(topicCounts)
    .filter(([_, count]) => count === validInsights.length)
    .map(([topic]) => topic)

  return { comparison, commonTopics }
}

export default getSpeakerInsights


/**
 * Topic Extraction Service
 * Extracts topics and themes from transcripts
 */

import { openaiLLM } from '../shared/llm'
import type { TopicData, TranscriptData } from '../shared/types'
import { generateId, extractJSONFromResponse } from '../shared/utils'

export interface ExtractTopicsOptions {
  maxTopics?: number
  minConfidence?: number
  language?: 'ar' | 'en'
}

/**
 * Extract topics from transcript text
 */
export async function extractTopics(
  transcript: TranscriptData | string,
  options: ExtractTopicsOptions = {}
): Promise<TopicData[]> {
  const {
    maxTopics = 10,
    minConfidence = 0.5,
    language = 'ar'
  } = options

  const text = typeof transcript === 'string' 
    ? transcript 
    : transcript.text

  const prompt = `تحليل النص التالي واستخراج المواضيع والأفكار الرئيسية المذكورة فيه.

النص:
${text.slice(0, 8000)} ${text.length > 8000 ? '...' : ''}

استخرج أهم ${maxTopics} مواضيع مع:
- اسم الموضوع بالعربية
- درجة الثقة (0-1)
- مدى الصلة بالنص (0-1)
- عدد المرات التي ذُكر فيها
- المفاهيم المرتبطة

أجب بصيغة JSON فقط:
{
  "topics": [
    {
      "name": "اسم الموضوع",
      "nameAr": "اسم الموضوع",
      "confidence": 0.9,
      "relevance": 0.85,
      "mentions": 5,
      "relatedConcepts": ["مفهوم1", "مفهوم2"]
    }
  ]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    return result.topics
      .filter((topic: TopicData) => topic.confidence >= minConfidence)
      .slice(0, maxTopics)
      .map((topic: any) => ({
        id: generateId(),
        name: topic.name,
        nameAr: topic.nameAr || topic.name,
        confidence: topic.confidence,
        relevance: topic.relevance,
        mentions: topic.mentions || 1,
        relatedConcepts: topic.relatedConcepts || []
      }))

  } catch (error) {
    console.error('Topic extraction error:', error)
    return []
  }
}

/**
 * Categorize topics into broader themes
 */
export async function categorizeTopics(topics: TopicData[]): Promise<Record<string, TopicData[]>> {
  if (topics.length === 0) return {}

  const prompt = `صنف المواضيع التالية إلى فئات رئيسية:

المواضيع:
${topics.map(t => t.nameAr).join('\n')}

الفئات المتاحة:
- تنمية ذاتية
- قيادة وإدارة
- علم نفس
- أعمال وريادة
- تقنية وابتكار
- فلسفة وتفكير
- صحة ورفاهية
- علاقات وتواصل
- أخرى

أجب بصيغة JSON:
{
  "categories": {
    "اسم الفئة": ["موضوع1", "موضوع2"]
  }
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    // Map topic names back to full topic objects
    const categorized: Record<string, TopicData[]> = {}
    
    for (const [category, topicNames] of Object.entries(result.categories)) {
      categorized[category] = (topicNames as string[])
        .map(name => topics.find(t => t.nameAr === name || t.name === name))
        .filter((t): t is TopicData => t !== undefined)
    }

    return categorized

  } catch (error) {
    console.error('Topic categorization error:', error)
    return { 'أخرى': topics }
  }
}

/**
 * Find related topics based on semantic similarity
 */
export async function findRelatedTopics(
  topic: string,
  allTopics: TopicData[]
): Promise<TopicData[]> {
  const prompt = `من بين المواضيع التالية، ما هي الأكثر ارتباطاً بـ "${topic}"؟

المواضيع:
${allTopics.map(t => t.nameAr).join('\n')}

رتب المواضيع حسب درجة الارتباط (الأعلى أولاً).
أجب بصيغة JSON:
{
  "related": ["موضوع1", "موضوع2", "موضوع3"]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    return result.related
      .map((name: string) => allTopics.find(t => t.nameAr === name || t.name === name))
      .filter((t: TopicData | undefined): t is TopicData => t !== undefined)

  } catch (error) {
    console.error('Related topics error:', error)
    return []
  }
}

/**
 * Extract topic trends over multiple episodes
 */
export async function analyzeTopicTrends(
  episodeTopics: { episodeId: string; date: Date; topics: TopicData[] }[]
): Promise<{ topic: string; frequency: number; trend: 'rising' | 'stable' | 'declining' }[]> {
  // Calculate frequency for each topic
  const topicFrequency: Record<string, { count: number; recentCount: number }> = {}

  const recentCutoff = new Date()
  recentCutoff.setMonth(recentCutoff.getMonth() - 1)

  for (const ep of episodeTopics) {
    const isRecent = ep.date > recentCutoff

    for (const topic of ep.topics) {
      if (!topicFrequency[topic.nameAr]) {
        topicFrequency[topic.nameAr] = { count: 0, recentCount: 0 }
      }
      topicFrequency[topic.nameAr].count++
      if (isRecent) {
        topicFrequency[topic.nameAr].recentCount++
      }
    }
  }

  // Calculate trends
  return Object.entries(topicFrequency)
    .map(([topic, freq]) => {
      const expectedRecent = freq.count * 0.25 // Assuming last month = 25% of total
      let trend: 'rising' | 'stable' | 'declining' = 'stable'

      if (freq.recentCount > expectedRecent * 1.5) {
        trend = 'rising'
      } else if (freq.recentCount < expectedRecent * 0.5) {
        trend = 'declining'
      }

      return { topic, frequency: freq.count, trend }
    })
    .sort((a, b) => b.frequency - a.frequency)
}

export default extractTopics




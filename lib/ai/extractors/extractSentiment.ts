/**
 * Sentiment Analysis Service
 * Analyzes tone and sentiment of transcripts
 */

import { openaiLLM } from '../shared/llm'
import type { SentimentData, AIMoodType, ToneType, EmotionScore, ToneAnalysis } from '../shared/types'
import { extractJSONFromResponse } from '../shared/utils'

export interface SentimentAnalysisOptions {
  detailed?: boolean
  includeEmotions?: boolean
  segmentLevel?: boolean
}

/**
 * Analyze sentiment and tone of transcript
 */
export async function extractSentiment(
  text: string,
  options: SentimentAnalysisOptions = {}
): Promise<SentimentData> {
  const {
    detailed = true,
    includeEmotions = true
  } = options

  const prompt = `تحليل النبرة والمشاعر في النص التالي:

النص:
${text.slice(0, 6000)} ${text.length > 6000 ? '...' : ''}

حدد:
1. المزاج العام:
   - تحفيزي: يحفز ويشجع على العمل
   - معرفي: تعليمي ومعلوماتي
   - نقاشي: يطرح أفكاراً للنقاش
   - تحليلي: يحلل ويفسر
   - ملهم: يلهم ويبث الأمل
   - حيادي: موضوعي دون نبرة واضحة

2. توزيع المشاعر:
   - نسبة الإيجابية (0-100)
   - نسبة السلبية (0-100)
   - نسبة الحياد (0-100)

3. المشاعر السائدة (إن وجدت):
   - الحماس، الأمل، الفضول، القلق، الحزن، إلخ

4. تحليل النبرة:
   - رسمي / غير رسمي
   - أكاديمي / محادثة
   - ملهم / تحليلي

أجب بصيغة JSON:
{
  "overall": "المزاج العام",
  "confidence": 0.85,
  "breakdown": {
    "positive": 60,
    "negative": 10,
    "neutral": 30
  },
  "emotions": [
    { "emotion": "enthusiasm", "emotionAr": "الحماس", "score": 0.7 }
  ],
  "toneAnalysis": {
    "primary": "conversational",
    "secondary": "inspirational",
    "confidence": 0.8,
    "description": "وصف النبرة",
    "descriptionAr": "وصف النبرة بالعربية"
  }
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    const sentimentData: SentimentData = {
      overall: result.overall as AIMoodType,
      confidence: result.confidence || 0.7,
      breakdown: {
        positive: result.breakdown?.positive || 50,
        negative: result.breakdown?.negative || 10,
        neutral: result.breakdown?.neutral || 40
      },
      dominantEmotions: includeEmotions ? (result.emotions || []) : [],
      toneAnalysis: result.toneAnalysis || {
        primary: 'conversational' as ToneType,
        confidence: 0.5,
        description: 'Standard conversational tone',
        descriptionAr: 'نبرة محادثة عادية'
      }
    }

    return sentimentData

  } catch (error) {
    console.error('Sentiment extraction error:', error)
    return {
      overall: 'حيادي',
      confidence: 0.5,
      breakdown: { positive: 33, negative: 33, neutral: 34 },
      dominantEmotions: [],
      toneAnalysis: {
        primary: 'conversational',
        confidence: 0.5,
        description: 'Unable to determine tone',
        descriptionAr: 'لم يتم تحديد النبرة'
      }
    }
  }
}

/**
 * Analyze sentiment at segment level
 */
export async function analyzeSegmentSentiments(
  segments: { id: number; text: string }[]
): Promise<{ id: number; sentiment: AIMoodType; confidence: number }[]> {
  const results: { id: number; sentiment: AIMoodType; confidence: number }[] = []

  // Process in batches for efficiency
  const batchSize = 5
  for (let i = 0; i < segments.length; i += batchSize) {
    const batch = segments.slice(i, i + batchSize)
    
    const prompt = `تحليل مزاج كل جزء من النصوص التالية:

${batch.map((s, idx) => `[${s.id}] ${s.text}`).join('\n\n')}

أجب بصيغة JSON:
{
  "results": [
    { "id": 0, "sentiment": "تحفيزي", "confidence": 0.8 }
  ]
}`

    try {
      const response = await openaiLLM.generateText(prompt)
      const json = extractJSONFromResponse(response.content)
      const parsed = JSON.parse(json)
      results.push(...parsed.results)
    } catch (error) {
      // Fallback to neutral for failed segments
      results.push(...batch.map(s => ({
        id: s.id,
        sentiment: 'حيادي' as AIMoodType,
        confidence: 0.5
      })))
    }
  }

  return results
}

/**
 * Get mood color for visualization
 */
export function getMoodColor(mood: AIMoodType): string {
  const colorMap: Record<AIMoodType, string> = {
    'تحفيزي': '#F2C94C',  // Yellow
    'معرفي': '#2F80ED',   // Blue
    'نقاشي': '#F2994A',   // Orange
    'تحليلي': '#6FCF97',  // Green
    'ملهم': '#9B51E0',    // Purple
    'حيادي': '#828282'    // Gray
  }
  return colorMap[mood] || '#828282'
}

/**
 * Get mood description
 */
export function getMoodDescription(mood: AIMoodType): { ar: string; en: string } {
  const descriptions: Record<AIMoodType, { ar: string; en: string }> = {
    'تحفيزي': {
      ar: 'محتوى يحفز على اتخاذ إجراءات ويشجع على التغيير الإيجابي',
      en: 'Content that motivates action and encourages positive change'
    },
    'معرفي': {
      ar: 'محتوى تعليمي غني بالمعلومات والحقائق',
      en: 'Educational content rich with information and facts'
    },
    'نقاشي': {
      ar: 'محتوى يطرح أفكاراً متنوعة ويدعو للتفكير',
      en: 'Content that presents diverse ideas and invites reflection'
    },
    'تحليلي': {
      ar: 'محتوى يحلل ويفسر الأفكار بعمق',
      en: 'Content that analyzes and interprets ideas in depth'
    },
    'ملهم': {
      ar: 'محتوى يبث الأمل والإلهام',
      en: 'Content that inspires hope and motivation'
    },
    'حيادي': {
      ar: 'محتوى موضوعي ومتوازن',
      en: 'Objective and balanced content'
    }
  }
  return descriptions[mood] || descriptions['حيادي']
}

/**
 * Calculate sentiment trend over segments
 */
export function calculateSentimentTrend(
  segmentSentiments: { id: number; sentiment: AIMoodType; confidence: number }[]
): { trend: 'improving' | 'declining' | 'stable'; description: string } {
  if (segmentSentiments.length < 3) {
    return { trend: 'stable', description: 'لا توجد بيانات كافية' }
  }

  const positiveScores: Record<AIMoodType, number> = {
    'تحفيزي': 5,
    'ملهم': 5,
    'معرفي': 4,
    'تحليلي': 3,
    'نقاشي': 3,
    'حيادي': 2
  }

  const firstHalf = segmentSentiments.slice(0, Math.floor(segmentSentiments.length / 2))
  const secondHalf = segmentSentiments.slice(Math.floor(segmentSentiments.length / 2))

  const firstAvg = firstHalf.reduce((sum, s) => sum + positiveScores[s.sentiment], 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, s) => sum + positiveScores[s.sentiment], 0) / secondHalf.length

  const diff = secondAvg - firstAvg

  if (diff > 0.5) {
    return { trend: 'improving', description: 'تحسن في المزاج العام نحو نهاية الحلقة' }
  } else if (diff < -0.5) {
    return { trend: 'declining', description: 'انخفاض في المزاج الإيجابي نحو نهاية الحلقة' }
  } else {
    return { trend: 'stable', description: 'مزاج مستقر طوال الحلقة' }
  }
}

export default extractSentiment




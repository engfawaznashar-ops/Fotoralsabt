/**
 * Highlights Extraction Service
 * Extracts key insights and highlights from transcripts
 */

import { openaiLLM } from '../shared/llm'
import type { HighlightData, TranscriptData } from '../shared/types'
import { generateId, extractJSONFromResponse } from '../shared/utils'

export interface ExtractHighlightsOptions {
  maxHighlights?: number
  minImportance?: number
  language?: 'ar' | 'en'
}

/**
 * Extract key highlights and insights from transcript
 */
export async function extractHighlights(
  transcript: TranscriptData | string,
  options: ExtractHighlightsOptions = {}
): Promise<HighlightData[]> {
  const {
    maxHighlights = 10,
    minImportance = 60,
    language = 'ar'
  } = options

  const text = typeof transcript === 'string' 
    ? transcript 
    : transcript.text

  const prompt = `تحليل النص التالي واستخراج أهم ${maxHighlights} نقاط رئيسية وأفكار محورية.

النص:
${text.slice(0, 8000)} ${text.length > 8000 ? '...' : ''}

لكل نقطة/فكرة:
- عنوان قصير (3-7 كلمات)
- وصف مختصر (جملة أو جملتين)
- تقييم الأهمية (0-100)
- المواضيع المرتبطة

النقاط يجب أن تكون:
- قابلة للتطبيق أو التعلم منها
- مميزة وغير متكررة
- ذات قيمة للمستمع

أجب بصيغة JSON فقط:
{
  "highlights": [
    {
      "title": "عنوان النقطة",
      "titleAr": "عنوان النقطة بالعربية",
      "description": "وصف مختصر",
      "descriptionAr": "وصف مختصر بالعربية",
      "importance": 85,
      "relatedTopics": ["موضوع1", "موضوع2"]
    }
  ]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    const highlights: HighlightData[] = result.highlights
      .filter((h: any) => h.importance >= minImportance)
      .slice(0, maxHighlights)
      .map((h: any) => ({
        id: generateId(),
        title: h.title,
        titleAr: h.titleAr || h.title,
        description: h.description,
        descriptionAr: h.descriptionAr || h.description,
        importance: h.importance,
        relatedTopics: h.relatedTopics || []
      }))

    return highlights

  } catch (error) {
    console.error('Highlights extraction error:', error)
    return []
  }
}

/**
 * Generate key takeaways from highlights
 */
export async function generateTakeaways(
  highlights: HighlightData[],
  maxTakeaways: number = 5
): Promise<string[]> {
  const prompt = `بناءً على النقاط الرئيسية التالية، اكتب ${maxTakeaways} نقاط عملية يمكن للمستمع تطبيقها:

النقاط:
${highlights.map(h => `- ${h.titleAr}: ${h.descriptionAr}`).join('\n')}

اكتب كل نقطة عملية بصيغة فعل أمر (مثل: "ابدأ بـ..."، "طبّق..."، "تعلّم...")
أجب بقائمة JSON فقط:
["نقطة1", "نقطة2", "نقطة3"]`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    return JSON.parse(json)

  } catch (error) {
    console.error('Takeaways generation error:', error)
    return highlights.slice(0, maxTakeaways).map(h => h.titleAr)
  }
}

/**
 * Rank highlights by importance and relevance
 */
export function rankHighlights(highlights: HighlightData[]): HighlightData[] {
  return [...highlights].sort((a, b) => b.importance - a.importance)
}

/**
 * Group highlights by topic
 */
export function groupHighlightsByTopic(
  highlights: HighlightData[]
): Record<string, HighlightData[]> {
  const grouped: Record<string, HighlightData[]> = {}

  for (const highlight of highlights) {
    for (const topic of highlight.relatedTopics) {
      if (!grouped[topic]) {
        grouped[topic] = []
      }
      grouped[topic].push(highlight)
    }
  }

  return grouped
}

/**
 * Generate summary from highlights
 */
export async function generateHighlightsSummary(
  highlights: HighlightData[],
  maxWords: number = 100
): Promise<string> {
  const prompt = `اكتب ملخصاً مختصراً (${maxWords} كلمة كحد أقصى) يجمع النقاط الرئيسية التالية:

${highlights.map(h => `- ${h.titleAr}`).join('\n')}

الملخص يجب أن يكون:
- سلس ومترابط
- يغطي جميع النقاط المهمة
- مكتوب بالعربية الفصحى`

  try {
    const response = await openaiLLM.generateText(prompt)
    return response.content.trim()

  } catch (error) {
    console.error('Summary generation error:', error)
    return highlights.map(h => h.titleAr).join('، ')
  }
}

export default extractHighlights




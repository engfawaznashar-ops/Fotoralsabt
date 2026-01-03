/**
 * Quote Extraction Service
 * Extracts impactful quotes from transcripts
 */

import { openaiLLM } from '../shared/llm'
import type { QuoteData, TranscriptData } from '../shared/types'
import { generateId, extractJSONFromResponse, formatTime } from '../shared/utils'

export interface ExtractQuotesOptions {
  maxQuotes?: number
  minImpact?: number
  includeSpeaker?: boolean
  includeTimestamp?: boolean
}

/**
 * Extract impactful quotes from transcript
 */
export async function extractQuotes(
  transcript: TranscriptData | string,
  options: ExtractQuotesOptions = {}
): Promise<QuoteData[]> {
  const {
    maxQuotes = 10,
    minImpact = 50,
    includeSpeaker = true,
    includeTimestamp = true
  } = options

  const text = typeof transcript === 'string' 
    ? transcript 
    : transcript.text

  const segments = typeof transcript === 'object' 
    ? transcript.segments 
    : []

  const prompt = `تحليل النص التالي واستخراج أهم الاقتباسات والجمل المؤثرة.

النص:
${text.slice(0, 8000)} ${text.length > 8000 ? '...' : ''}

استخرج ${maxQuotes} اقتباسات مميزة:
- اقتباسات ملهمة أو حكيمة
- جمل تحتوي على أفكار قوية
- عبارات قابلة للمشاركة

لكل اقتباس:
- النص الكامل بالعربية
- المتحدث (إن أمكن تحديده)
- تقييم الأثر (0-100)
- المواضيع المرتبطة

أجب بصيغة JSON فقط:
{
  "quotes": [
    {
      "text": "نص الاقتباس",
      "textAr": "نص الاقتباس بالعربية",
      "speaker": "اسم المتحدث",
      "impact": 85,
      "themes": ["موضوع1", "موضوع2"]
    }
  ]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    const quotes: QuoteData[] = result.quotes
      .filter((quote: any) => quote.impact >= minImpact)
      .slice(0, maxQuotes)
      .map((quote: any) => ({
        id: generateId(),
        text: quote.text,
        textAr: quote.textAr || quote.text,
        speaker: includeSpeaker ? quote.speaker : undefined,
        timestamp: includeTimestamp ? findQuoteTimestamp(segments, quote.text) : 0,
        impact: quote.impact,
        themes: quote.themes || []
      }))

    return quotes

  } catch (error) {
    console.error('Quote extraction error:', error)
    return []
  }
}

/**
 * Find timestamp for a quote in transcript segments
 */
function findQuoteTimestamp(
  segments: { start: number; end: number; text: string }[],
  quoteText: string
): number {
  // Normalize texts for comparison
  const normalizedQuote = quoteText.replace(/\s+/g, ' ').trim().toLowerCase()

  for (const segment of segments) {
    const normalizedSegment = segment.text.replace(/\s+/g, ' ').trim().toLowerCase()
    
    // Check if segment contains significant portion of the quote
    const quoteWords = normalizedQuote.split(' ')
    const matchCount = quoteWords.filter(word => 
      normalizedSegment.includes(word)
    ).length

    if (matchCount / quoteWords.length >= 0.7) {
      return Math.floor(segment.start)
    }
  }

  return 0
}

/**
 * Rank quotes by various criteria
 */
export function rankQuotes(
  quotes: QuoteData[],
  criteria: 'impact' | 'length' | 'shareability' = 'impact'
): QuoteData[] {
  const sorted = [...quotes]

  switch (criteria) {
    case 'impact':
      sorted.sort((a, b) => b.impact - a.impact)
      break
    case 'length':
      sorted.sort((a, b) => a.text.length - b.text.length) // Shorter first
      break
    case 'shareability':
      // Prefer quotes that are 50-150 characters (ideal for social media)
      sorted.sort((a, b) => {
        const idealLength = 100
        const aDiff = Math.abs(a.text.length - idealLength)
        const bDiff = Math.abs(b.text.length - idealLength)
        return aDiff - bDiff
      })
      break
  }

  return sorted
}

/**
 * Generate quote card text (for social sharing)
 */
export function generateQuoteCard(quote: QuoteData, episodeTitle?: string): string {
  let card = `"${quote.textAr}"`

  if (quote.speaker) {
    card += `\n\n— ${quote.speaker}`
  }

  if (episodeTitle) {
    card += `\n📻 ${episodeTitle}`
  }

  card += '\n\n#فطور_السبت'

  return card
}

/**
 * Find similar quotes based on themes
 */
export async function findSimilarQuotes(
  quote: QuoteData,
  allQuotes: QuoteData[]
): Promise<QuoteData[]> {
  if (allQuotes.length <= 1) return []

  const prompt = `من بين الاقتباسات التالية، ما هي الأكثر تشابهاً مع:
"${quote.textAr}"

الاقتباسات:
${allQuotes.filter(q => q.id !== quote.id).map(q => q.textAr).join('\n')}

رتب الاقتباسات حسب درجة التشابه في المعنى.
أجب بقائمة من 3 اقتباسات فقط:
["اقتباس1", "اقتباس2", "اقتباس3"]`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const similarTexts = JSON.parse(json)

    return similarTexts
      .map((text: string) => allQuotes.find(q => q.textAr === text || q.text === text))
      .filter((q: QuoteData | undefined): q is QuoteData => q !== undefined)

  } catch (error) {
    console.error('Similar quotes error:', error)
    return []
  }
}

/**
 * Analyze quote themes
 */
export async function analyzeQuoteThemes(quote: QuoteData): Promise<{
  mainTheme: string
  subThemes: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  applicationContext: string
}> {
  const prompt = `تحليل الاقتباس التالي:
"${quote.textAr}"

حدد:
1. الموضوع الرئيسي
2. المواضيع الفرعية
3. النبرة (إيجابية، سلبية، حيادية)
4. سياق التطبيق (متى يمكن استخدام هذا الاقتباس)

أجب بصيغة JSON:
{
  "mainTheme": "الموضوع الرئيسي",
  "subThemes": ["موضوع1", "موضوع2"],
  "sentiment": "positive/negative/neutral",
  "applicationContext": "سياق التطبيق"
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    return JSON.parse(json)

  } catch (error) {
    console.error('Quote theme analysis error:', error)
    return {
      mainTheme: quote.themes[0] || 'عام',
      subThemes: quote.themes.slice(1),
      sentiment: 'neutral',
      applicationContext: 'سياق عام'
    }
  }
}

/**
 * Validate quote authenticity (check if it's actually in the transcript)
 */
export function validateQuoteInTranscript(
  quote: QuoteData,
  transcript: TranscriptData
): { valid: boolean; matchPercentage: number } {
  const quoteWords = quote.text.toLowerCase().split(/\s+/)
  const transcriptText = transcript.text.toLowerCase()

  let matchedWords = 0
  for (const word of quoteWords) {
    if (transcriptText.includes(word)) {
      matchedWords++
    }
  }

  const matchPercentage = (matchedWords / quoteWords.length) * 100

  return {
    valid: matchPercentage >= 80,
    matchPercentage: Math.round(matchPercentage)
  }
}

export default extractQuotes




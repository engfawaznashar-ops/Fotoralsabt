/**
 * Speaker Extraction Service
 * Extracts and analyzes speakers from transcripts
 */

import { openaiLLM } from '../shared/llm'
import type { SpeakerData, TranscriptData, AIPersonaType } from '../shared/types'
import { generateId, extractJSONFromResponse } from '../shared/utils'

export interface ExtractSpeakersOptions {
  knownSpeakers?: string[]
  maxSpeakers?: number
  includeTimestamps?: boolean
}

/**
 * Extract speakers from transcript
 */
export async function extractSpeakers(
  transcript: TranscriptData | string,
  options: ExtractSpeakersOptions = {}
): Promise<SpeakerData[]> {
  const {
    knownSpeakers = [],
    maxSpeakers = 10,
    includeTimestamps = true
  } = options

  const text = typeof transcript === 'string' 
    ? transcript 
    : transcript.text

  const segments = typeof transcript === 'object' 
    ? transcript.segments 
    : []

  const prompt = `تحليل النص التالي وتحديد المتحدثين المختلفين فيه.

النص:
${text.slice(0, 8000)} ${text.length > 8000 ? '...' : ''}

${knownSpeakers.length > 0 ? `المتحدثون المعروفون: ${knownSpeakers.join(', ')}` : ''}

لكل متحدث، حدد:
- الاسم (إذا ذُكر) أو وصف تمييزي
- تقدير وقت التحدث بالثواني
- النبرة العامة (تحفيزي، تحليلي، نقاشي، إلخ)

أجب بصيغة JSON فقط:
{
  "speakers": [
    {
      "name": "اسم المتحدث",
      "speakingTime": 1200,
      "sentiment": "تحفيزي",
      "confidence": 0.9
    }
  ]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    const speakers: SpeakerData[] = result.speakers
      .slice(0, maxSpeakers)
      .map((speaker: any) => ({
        id: generateId(),
        name: speaker.name,
        speakingTime: speaker.speakingTime || 0,
        segments: includeTimestamps ? findSpeakerSegments(segments, speaker.name) : [],
        sentiment: speaker.sentiment || 'حيادي',
        confidence: speaker.confidence || 0.7
      }))

    return speakers

  } catch (error) {
    console.error('Speaker extraction error:', error)
    return []
  }
}

/**
 * Find transcript segments for a specific speaker
 */
function findSpeakerSegments(
  segments: { start: number; end: number; text: string; speaker?: string }[],
  speakerName: string
): [number, number][] {
  return segments
    .filter(seg => seg.speaker === speakerName)
    .map(seg => [seg.start, seg.end] as [number, number])
}

/**
 * Identify speaker from audio characteristics
 * Note: This requires speaker diarization which is complex
 */
export async function identifySpeakerFromAudio(
  audioUrl: string,
  knownSpeakers: { name: string; voiceProfile?: string }[]
): Promise<{ speaker: string; confidence: number }[]> {
  // In production, this would use:
  // 1. Speaker diarization (e.g., pyannote.audio)
  // 2. Voice embedding comparison
  // For now, return placeholder

  return knownSpeakers.map(s => ({
    speaker: s.name,
    confidence: 0.8
  }))
}

/**
 * Analyze speaker persona using their speech patterns
 */
export async function analyzeSpeakerPersona(
  speakerSegments: string[],
  speakerName: string
): Promise<{ persona: AIPersonaType; description: string }> {
  const text = speakerSegments.join('\n')

  const prompt = `تحليل أسلوب كلام ${speakerName} من النصوص التالية وتحديد شخصيته كمتحدث.

النصوص:
${text.slice(0, 4000)}

الشخصيات المتاحة:
- تحليلي: يركز على الأرقام والحقائق والتحليل المنطقي
- تحفيزي: يحفز ويشجع ويبث الطاقة الإيجابية
- قيادي: يوجه ويقود ويحدد الاتجاهات
- تقني: يركز على الجوانب التقنية والتفاصيل
- إبداعي: يطرح أفكاراً جديدة ومبتكرة
- استراتيجي: يفكر بشكل شامل وطويل المدى

أجب بصيغة JSON:
{
  "persona": "الشخصية",
  "description": "وصف مختصر لأسلوب المتحدث"
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    return {
      persona: result.persona as AIPersonaType,
      description: result.description
    }

  } catch (error) {
    console.error('Persona analysis error:', error)
    return {
      persona: 'تحليلي',
      description: 'لم يتم تحديد الشخصية'
    }
  }
}

/**
 * Calculate speaker statistics
 */
export function calculateSpeakerStats(speaker: SpeakerData, totalDuration: number): {
  speakingPercentage: number
  averageSegmentLength: number
  segmentCount: number
} {
  const speakingPercentage = (speaker.speakingTime / totalDuration) * 100
  const segmentCount = speaker.segments.length
  const averageSegmentLength = segmentCount > 0 
    ? speaker.speakingTime / segmentCount 
    : 0

  return {
    speakingPercentage: Math.round(speakingPercentage * 10) / 10,
    averageSegmentLength: Math.round(averageSegmentLength),
    segmentCount
  }
}

/**
 * Compare speakers based on various metrics
 */
export function compareSpeakers(speakers: SpeakerData[]): {
  mostActive: SpeakerData | null
  longestSegments: SpeakerData | null
  sentimentDistribution: Record<string, number>
} {
  if (speakers.length === 0) {
    return {
      mostActive: null,
      longestSegments: null,
      sentimentDistribution: {}
    }
  }

  // Find most active speaker
  const mostActive = speakers.reduce((prev, curr) => 
    curr.speakingTime > prev.speakingTime ? curr : prev
  )

  // Find speaker with longest average segments
  const speakersWithStats = speakers.map(s => ({
    ...s,
    avgSegmentLength: s.segments.length > 0 
      ? s.speakingTime / s.segments.length 
      : 0
  }))

  const longestSegments = speakersWithStats.reduce((prev, curr) =>
    curr.avgSegmentLength > prev.avgSegmentLength ? curr : prev
  )

  // Calculate sentiment distribution
  const sentimentDistribution: Record<string, number> = {}
  for (const speaker of speakers) {
    const sentiment = speaker.sentiment
    sentimentDistribution[sentiment] = (sentimentDistribution[sentiment] || 0) + 1
  }

  return {
    mostActive,
    longestSegments,
    sentimentDistribution
  }
}

/**
 * Merge duplicate speaker entries
 */
export function mergeDuplicateSpeakers(speakers: SpeakerData[]): SpeakerData[] {
  const speakerMap = new Map<string, SpeakerData>()

  for (const speaker of speakers) {
    const normalizedName = speaker.name.trim().toLowerCase()
    
    if (speakerMap.has(normalizedName)) {
      const existing = speakerMap.get(normalizedName)!
      existing.speakingTime += speaker.speakingTime
      existing.segments.push(...speaker.segments)
      existing.confidence = Math.max(existing.confidence, speaker.confidence)
    } else {
      speakerMap.set(normalizedName, { ...speaker })
    }
  }

  return Array.from(speakerMap.values())
}

export default extractSpeakers




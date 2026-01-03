/**
 * Chapter Timestamps Extraction Service
 * Generates chapter markers from transcripts
 */

import { openaiLLM } from '../shared/llm'
import type { ChapterData, TranscriptData } from '../shared/types'
import { generateId, extractJSONFromResponse, formatTime, parseTime } from '../shared/utils'

export interface ExtractChaptersOptions {
  minChapters?: number
  maxChapters?: number
  minChapterDuration?: number // in seconds
  includeDescription?: boolean
}

/**
 * Extract chapter timestamps from transcript
 */
export async function extractChapterTimestamps(
  transcript: TranscriptData | string,
  options: ExtractChaptersOptions = {}
): Promise<ChapterData[]> {
  const {
    minChapters = 3,
    maxChapters = 10,
    minChapterDuration = 120, // 2 minutes minimum
    includeDescription = true
  } = options

  const text = typeof transcript === 'string' 
    ? transcript 
    : transcript.text

  const segments = typeof transcript === 'object' 
    ? transcript.segments 
    : []

  // Include timestamps if available
  const textWithTimestamps = segments.length > 0
    ? segments.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n')
    : text

  const prompt = `تحليل النص التالي وتحديد الفصول/المحاور الرئيسية مع أوقاتها.

النص:
${textWithTimestamps.slice(0, 10000)} ${textWithTimestamps.length > 10000 ? '...' : ''}

قم بتحديد ${minChapters} إلى ${maxChapters} فصول رئيسية:
- يجب أن يكون كل فصل ${Math.floor(minChapterDuration / 60)} دقائق على الأقل
- ابدأ دائماً بفصل "مقدمة" عند 00:00
- حدد نقاط التحول في الموضوع
- استخدم عناوين وصفية قصيرة

أجب بصيغة JSON فقط:
{
  "chapters": [
    {
      "time": "00:00",
      "timeSeconds": 0,
      "title": "مقدمة",
      "titleAr": "مقدمة",
      "description": "وصف مختصر للفصل",
      "topics": ["موضوع1", "موضوع2"]
    }
  ]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    const chapters: ChapterData[] = result.chapters.map((ch: any) => ({
      id: generateId(),
      time: ch.time,
      timeSeconds: ch.timeSeconds || parseTime(ch.time),
      title: ch.title,
      titleAr: ch.titleAr || ch.title,
      description: includeDescription ? ch.description : undefined,
      topics: ch.topics || []
    }))

    // Sort by time
    chapters.sort((a, b) => a.timeSeconds - b.timeSeconds)

    // Ensure we have an intro chapter
    if (chapters.length > 0 && chapters[0].timeSeconds !== 0) {
      chapters.unshift({
        id: generateId(),
        time: '00:00',
        timeSeconds: 0,
        title: 'مقدمة',
        titleAr: 'مقدمة',
        topics: []
      })
    }

    return chapters

  } catch (error) {
    console.error('Chapter extraction error:', error)
    return createFallbackChapters(segments.length > 0 ? segments[segments.length - 1].end : 3600)
  }
}

/**
 * Create fallback chapters based on duration
 */
function createFallbackChapters(totalDuration: number): ChapterData[] {
  const chapters: ChapterData[] = [
    {
      id: generateId(),
      time: '00:00',
      timeSeconds: 0,
      title: 'مقدمة',
      titleAr: 'مقدمة',
      topics: []
    }
  ]

  // Add chapter every 10 minutes
  const interval = 600
  let chapterNum = 1

  for (let time = interval; time < totalDuration - 120; time += interval) {
    chapters.push({
      id: generateId(),
      time: formatTime(time),
      timeSeconds: time,
      title: `المحور ${chapterNum}`,
      titleAr: `المحور ${chapterNum}`,
      topics: []
    })
    chapterNum++
  }

  return chapters
}

/**
 * Refine chapter titles using content analysis
 */
export async function refineChapterTitles(
  chapters: ChapterData[],
  transcript: TranscriptData
): Promise<ChapterData[]> {
  const refinedChapters: ChapterData[] = []

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i]
    const nextChapter = chapters[i + 1]

    // Get text for this chapter
    const startTime = chapter.timeSeconds
    const endTime = nextChapter ? nextChapter.timeSeconds : transcript.segments[transcript.segments.length - 1]?.end || startTime + 600

    const chapterText = transcript.segments
      .filter(s => s.start >= startTime && s.start < endTime)
      .map(s => s.text)
      .join(' ')

    if (chapterText.length < 50) {
      refinedChapters.push(chapter)
      continue
    }

    const prompt = `بناءً على النص التالي، اقترح عنواناً مختصراً ووصفياً (3-7 كلمات) لهذا الفصل:

النص:
${chapterText.slice(0, 2000)}

العنوان الحالي: ${chapter.titleAr}

أجب بصيغة JSON:
{
  "title": "العنوان الجديد",
  "topics": ["موضوع1", "موضوع2"]
}`

    try {
      const response = await openaiLLM.generateText(prompt)
      const json = extractJSONFromResponse(response.content)
      const result = JSON.parse(json)

      refinedChapters.push({
        ...chapter,
        title: result.title,
        titleAr: result.title,
        topics: result.topics || chapter.topics
      })
    } catch {
      refinedChapters.push(chapter)
    }
  }

  return refinedChapters
}

/**
 * Merge short chapters
 */
export function mergeShortChapters(
  chapters: ChapterData[],
  minDuration: number = 120
): ChapterData[] {
  if (chapters.length <= 1) return chapters

  const merged: ChapterData[] = [chapters[0]]

  for (let i = 1; i < chapters.length; i++) {
    const current = chapters[i]
    const last = merged[merged.length - 1]
    const duration = current.timeSeconds - last.timeSeconds

    if (duration < minDuration) {
      // Merge with previous chapter
      last.topics = [...new Set([...last.topics, ...current.topics])]
    } else {
      merged.push(current)
    }
  }

  return merged
}

/**
 * Generate chapter summary
 */
export async function generateChapterSummary(
  chapter: ChapterData,
  chapterText: string
): Promise<string> {
  const prompt = `اكتب ملخصاً مختصراً (جملة أو جملتين) لهذا الفصل:

عنوان الفصل: ${chapter.titleAr}
النص:
${chapterText.slice(0, 2000)}`

  try {
    const response = await openaiLLM.generateText(prompt)
    return response.content.trim()
  } catch {
    return chapter.titleAr
  }
}

/**
 * Format chapters for YouTube description
 */
export function formatChaptersForYouTube(chapters: ChapterData[]): string {
  return chapters
    .map(ch => `${ch.time} ${ch.titleAr}`)
    .join('\n')
}

/**
 * Format chapters for podcast apps
 */
export function formatChaptersForPodcast(chapters: ChapterData[]): {
  title: string
  startTime: number
  endTime?: number
}[] {
  return chapters.map((ch, idx) => ({
    title: ch.titleAr,
    startTime: ch.timeSeconds,
    endTime: chapters[idx + 1]?.timeSeconds
  }))
}

export default extractChapterTimestamps




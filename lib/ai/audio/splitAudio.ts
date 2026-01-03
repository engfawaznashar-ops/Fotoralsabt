/**
 * Audio Splitting and Chapter Detection Service
 */

import type { ChapterData, TranscriptData } from '../shared/types'
import { generateId, formatTime, parseTime } from '../shared/utils'

export interface AudioChunk {
  id: string
  startTime: number
  endTime: number
  duration: number
  url?: string
  transcript?: string
}

export interface SilenceSegment {
  start: number
  end: number
  duration: number
}

export interface SplitAudioOptions {
  maxChunkDuration?: number // in seconds
  minChunkDuration?: number
  silenceThreshold?: number // in dB
  minSilenceDuration?: number // in seconds
}

/**
 * Split audio into chunks based on duration
 * Note: This is a stub - in production, use FFmpeg or similar
 */
export async function splitAudioByDuration(
  audioUrl: string,
  chunkDuration: number = 600 // 10 minutes
): Promise<AudioChunk[]> {
  // In production, this would:
  // 1. Download the audio file
  // 2. Use FFmpeg to split into chunks
  // 3. Upload chunks to storage
  // 4. Return URLs

  // For now, return placeholder chunks
  const totalDuration = 3600 // Assume 1 hour
  const chunks: AudioChunk[] = []

  for (let start = 0; start < totalDuration; start += chunkDuration) {
    const end = Math.min(start + chunkDuration, totalDuration)
    chunks.push({
      id: generateId(),
      startTime: start,
      endTime: end,
      duration: end - start,
      url: `${audioUrl}?start=${start}&end=${end}`
    })
  }

  return chunks
}

/**
 * Detect silence segments in audio
 * Note: This is a stub - in production, use audio analysis library
 */
export async function detectSilence(
  audioUrl: string,
  options: SplitAudioOptions = {}
): Promise<SilenceSegment[]> {
  const {
    silenceThreshold = -40, // dB
    minSilenceDuration = 1.5 // seconds
  } = options

  // In production, this would analyze audio waveform
  // For now, return mock silence segments
  return [
    { start: 0, end: 2, duration: 2 },
    { start: 330, end: 335, duration: 5 }, // 5:30
    { start: 920, end: 925, duration: 5 }, // 15:20
    { start: 1510, end: 1515, duration: 5 }, // 25:10
    { start: 2145, end: 2150, duration: 5 }, // 35:45
    { start: 2520, end: 2525, duration: 5 }  // 42:00
  ]
}

/**
 * Split audio at silence points
 */
export async function splitAudioAtSilence(
  audioUrl: string,
  options: SplitAudioOptions = {}
): Promise<AudioChunk[]> {
  const {
    maxChunkDuration = 1200, // 20 minutes max
    minChunkDuration = 120   // 2 minutes min
  } = options

  const silenceSegments = await detectSilence(audioUrl, options)
  const chunks: AudioChunk[] = []

  let chunkStart = 0

  for (const silence of silenceSegments) {
    const chunkDuration = silence.start - chunkStart

    // Check if we should split at this silence
    if (chunkDuration >= minChunkDuration) {
      if (chunkDuration <= maxChunkDuration) {
        // Good chunk size, split here
        chunks.push({
          id: generateId(),
          startTime: chunkStart,
          endTime: silence.start,
          duration: chunkDuration
        })
        chunkStart = silence.end
      } else if (chunks.length > 0) {
        // Chunk too long, but we have previous chunks
        // Keep accumulating until we find a better split point
      }
    }
  }

  // Add final chunk
  const finalDuration = 3600 - chunkStart // Assuming 1 hour total
  if (finalDuration > 0) {
    chunks.push({
      id: generateId(),
      startTime: chunkStart,
      endTime: 3600,
      duration: finalDuration
    })
  }

  return chunks
}

/**
 * Detect chapters using transcript content
 */
export async function detectChaptersFromTranscript(
  transcript: TranscriptData
): Promise<ChapterData[]> {
  // Import LLM dynamically to avoid circular dependency
  const { openaiLLM } = await import('../shared/llm')

  const prompt = `تحليل هذا النص المكتوب من حلقة بودكاست وتحديد الفصول/المحاور الرئيسية.

  النص:
  ${transcript.segments.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n')}

  قم بتحديد 4-8 فصول رئيسية مع الوقت والعنوان.
  أجب بصيغة JSON:
  {
    "chapters": [
      {
        "time": "00:00",
        "timeSeconds": 0,
        "title": "مقدمة",
        "topics": ["موضوع1", "موضوع2"]
      }
    ]
  }`

  try {
    const response = await openaiLLM.generateText(prompt)
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      return result.chapters.map((ch: any, idx: number) => ({
        id: generateId(),
        time: ch.time,
        timeSeconds: ch.timeSeconds || parseTime(ch.time),
        title: ch.title,
        titleAr: ch.title,
        description: ch.description,
        topics: ch.topics || []
      }))
    }
  } catch (error) {
    console.error('Chapter detection error:', error)
  }

  // Fallback: create chapters based on time
  return createDefaultChapters(Math.floor(transcript.segments.slice(-1)[0]?.end || 3600))
}

/**
 * Create default chapters based on duration
 */
export function createDefaultChapters(totalDuration: number): ChapterData[] {
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

  for (let time = interval; time < totalDuration; time += interval) {
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
 * Merge adjacent audio chunks
 */
export function mergeChunks(chunks: AudioChunk[]): AudioChunk[] {
  if (chunks.length <= 1) return chunks

  const merged: AudioChunk[] = []
  let current = { ...chunks[0] }

  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i]
    
    // If chunks are adjacent (within 1 second), merge them
    if (chunk.startTime - current.endTime <= 1) {
      current.endTime = chunk.endTime
      current.duration = current.endTime - current.startTime
    } else {
      merged.push(current)
      current = { ...chunk }
    }
  }

  merged.push(current)
  return merged
}

/**
 * Calculate audio duration from URL
 * Note: This is a stub - in production, use audio metadata
 */
export async function getAudioDuration(audioUrl: string): Promise<number> {
  // In production, this would:
  // 1. Fetch audio metadata using FFprobe or similar
  // 2. Return actual duration

  // For now, return placeholder
  return 3600 // 1 hour
}

export default {
  splitAudioByDuration,
  splitAudioAtSilence,
  detectSilence,
  detectChaptersFromTranscript,
  createDefaultChapters,
  mergeChunks,
  getAudioDuration
}




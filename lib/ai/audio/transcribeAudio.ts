/**
 * Audio Transcription Service using OpenAI Whisper
 */

import OpenAI from 'openai'
import type { TranscriptData, TranscriptSegment } from '../shared/types'
import { generateId, formatTime, withRetry } from '../shared/utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface TranscriptionOptions {
  language?: string
  prompt?: string
  responseFormat?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
  temperature?: number
  timestampGranularities?: ('word' | 'segment')[]
}

export interface TranscriptionResult {
  success: boolean
  data?: TranscriptData
  error?: string
  processingTime: number
}

/**
 * Transcribe audio file using OpenAI Whisper API
 */
export async function transcribeAudio(
  audioUrl: string,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  const startTime = Date.now()

  try {
    // Fetch audio file
    const audioResponse = await fetch(audioUrl)
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`)
    }

    const audioBuffer = await audioResponse.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })
    const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' })

    // Transcribe using Whisper
    const transcription = await withRetry(async () => {
      return openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: options.language || 'ar',
        response_format: 'verbose_json',
        timestamp_granularities: options.timestampGranularities || ['segment'],
        prompt: options.prompt,
        temperature: options.temperature || 0
      })
    })

    // Parse segments from response
    const segments: TranscriptSegment[] = (transcription as any).segments?.map((seg: any, index: number) => ({
      id: index,
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
      confidence: seg.avg_logprob ? Math.exp(seg.avg_logprob) : 0.9
    })) || []

    // Calculate overall confidence
    const avgConfidence = segments.length > 0
      ? segments.reduce((sum, seg) => sum + seg.confidence, 0) / segments.length
      : 0.9

    const transcriptData: TranscriptData = {
      text: transcription.text,
      segments,
      language: (transcription as any).language || 'ar',
      confidence: avgConfidence
    }

    return {
      success: true,
      data: transcriptData,
      processingTime: Date.now() - startTime
    }

  } catch (error) {
    console.error('Transcription error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown transcription error',
      processingTime: Date.now() - startTime
    }
  }
}

/**
 * Transcribe audio in chunks for long files
 */
export async function transcribeLongAudio(
  audioUrl: string,
  chunkDurationSeconds: number = 600, // 10 minutes per chunk
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  const startTime = Date.now()

  try {
    // For now, use single transcription
    // In production, implement audio chunking with FFmpeg or similar
    const result = await transcribeAudio(audioUrl, options)
    
    return {
      ...result,
      processingTime: Date.now() - startTime
    }

  } catch (error) {
    console.error('Long audio transcription error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime: Date.now() - startTime
    }
  }
}

/**
 * Get word-level timestamps
 */
export async function transcribeWithWordTimestamps(
  audioUrl: string,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  return transcribeAudio(audioUrl, {
    ...options,
    timestampGranularities: ['word', 'segment']
  })
}

/**
 * Identify speakers in transcript (using LLM)
 */
export async function identifySpeakers(
  transcript: TranscriptData,
  speakerHints?: string[]
): Promise<TranscriptSegment[]> {
  // Import LLM dynamically to avoid circular dependency
  const { openaiLLM } = await import('../shared/llm')

  const prompt = `تحليل النص التالي وتحديد المتحدثين المختلفين.
  
  النص:
  ${transcript.segments.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n')}
  
  ${speakerHints ? `المتحدثون المحتملون: ${speakerHints.join(', ')}` : ''}
  
  أجب بصيغة JSON:
  {
    "segments": [
      { "id": 0, "speaker": "اسم المتحدث" },
      ...
    ]
  }`

  try {
    const response = await openaiLLM.generateText(prompt)
    const result = JSON.parse(response.content)

    // Merge speaker info with original segments
    return transcript.segments.map((seg, idx) => ({
      ...seg,
      speaker: result.segments?.find((s: any) => s.id === idx)?.speaker
    }))

  } catch (error) {
    console.error('Speaker identification error:', error)
    return transcript.segments
  }
}

/**
 * Format transcript to SRT format
 */
export function formatToSRT(transcript: TranscriptData): string {
  return transcript.segments.map((seg, idx) => {
    const startTime = formatSRTTime(seg.start)
    const endTime = formatSRTTime(seg.end)
    return `${idx + 1}\n${startTime} --> ${endTime}\n${seg.text}\n`
  }).join('\n')
}

/**
 * Format transcript to VTT format
 */
export function formatToVTT(transcript: TranscriptData): string {
  const header = 'WEBVTT\n\n'
  const cues = transcript.segments.map(seg => {
    const startTime = formatVTTTime(seg.start)
    const endTime = formatVTTTime(seg.end)
    return `${startTime} --> ${endTime}\n${seg.text}\n`
  }).join('\n')

  return header + cues
}

// Helper: Format seconds to SRT time (HH:MM:SS,mmm)
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const millis = Math.round((seconds % 1) * 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`
}

// Helper: Format seconds to VTT time (HH:MM:SS.mmm)
function formatVTTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const millis = Math.round((seconds % 1) * 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`
}

export default transcribeAudio




/**
 * Unified LLM Wrapper for OpenAI and Gemini
 * Provides a consistent interface for AI operations
 */

import OpenAI from 'openai'
import type { LLMConfig, LLMResponse, EmbeddingResult, AIMoodType } from './types'
import { extractJSONFromResponse, withRetry } from './utils'

// ============================================
// CONFIGURATION
// ============================================

const DEFAULT_CONFIG: LLMConfig = {
  provider: 'openai',
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Gemini API configuration (using REST API)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// ============================================
// CORE LLM CLASS
// ============================================

export class LLMService {
  private config: LLMConfig

  constructor(config: Partial<LLMConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Generate text completion
   */
  async generateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    if (this.config.provider === 'openai') {
      return this.openaiGenerateText(prompt, systemPrompt)
    } else {
      return this.geminiGenerateText(prompt, systemPrompt)
    }
  }

  /**
   * Classify text into categories
   */
  async classify(text: string, categories: string[]): Promise<{ category: string; confidence: number }> {
    const systemPrompt = `You are a text classifier. Classify the given text into one of these categories: ${categories.join(', ')}. 
    Respond with JSON: { "category": "...", "confidence": 0.0-1.0 }`

    const response = await this.generateText(text, systemPrompt)
    const json = extractJSONFromResponse(response.content)
    
    try {
      return JSON.parse(json)
    } catch {
      return { category: categories[0], confidence: 0.5 }
    }
  }

  /**
   * Generate embeddings for text
   */
  async embed(text: string): Promise<EmbeddingResult> {
    if (this.config.provider === 'openai') {
      return this.openaiEmbed(text)
    } else {
      return this.geminiEmbed(text)
    }
  }

  /**
   * Summarize text
   */
  async summarize(text: string, maxWords: number = 100, language: 'ar' | 'en' = 'ar'): Promise<string> {
    const systemPrompt = language === 'ar' 
      ? `أنت مساعد متخصص في تلخيص النصوص باللغة العربية. قم بتلخيص النص التالي في ${maxWords} كلمة أو أقل. حافظ على الأفكار الرئيسية والنقاط المهمة.`
      : `You are a text summarization assistant. Summarize the following text in ${maxWords} words or less. Preserve the main ideas and key points.`

    const response = await this.generateText(text, systemPrompt)
    return response.content.trim()
  }

  /**
   * Analyze sentiment of text
   */
  async sentiment(text: string): Promise<{ mood: AIMoodType; confidence: number; explanation: string }> {
    const systemPrompt = `أنت محلل مشاعر ونبرة للنصوص العربية. حلل النص التالي وحدد المزاج العام.
    
    المزاج يجب أن يكون أحد الخيارات التالية:
    - تحفيزي: نص يحفز ويشجع على العمل
    - معرفي: نص تعليمي ومعلوماتي
    - نقاشي: نص يطرح أفكاراً للنقاش
    - تحليلي: نص يحلل ويفسر
    - ملهم: نص يلهم ويبث الأمل
    - حيادي: نص موضوعي دون نبرة واضحة
    
    أجب بصيغة JSON:
    {
      "mood": "المزاج",
      "confidence": 0.0-1.0,
      "explanation": "شرح قصير"
    }`

    const response = await this.generateText(text, systemPrompt)
    const json = extractJSONFromResponse(response.content)
    
    try {
      return JSON.parse(json)
    } catch {
      return { mood: 'حيادي', confidence: 0.5, explanation: 'لم يتم تحديد المزاج' }
    }
  }

  /**
   * Extract structured JSON from text using LLM
   */
  async extractJSON<T>(prompt: string, schema: string): Promise<T> {
    const systemPrompt = `You are a JSON extraction assistant. Extract information from the text and return valid JSON matching this schema:
    
    ${schema}
    
    IMPORTANT: Return ONLY valid JSON, no explanations or markdown.`

    const response = await this.generateText(prompt, systemPrompt)
    const json = extractJSONFromResponse(response.content)
    
    return JSON.parse(json) as T
  }

  /**
   * Generate completion with specific format
   */
  async complete(prompt: string, format: 'json' | 'text' | 'list' = 'text'): Promise<string> {
    let systemPrompt = ''
    
    switch (format) {
      case 'json':
        systemPrompt = 'Respond with valid JSON only. No explanations.'
        break
      case 'list':
        systemPrompt = 'Respond with a numbered list. Each item on a new line.'
        break
      default:
        systemPrompt = 'Respond naturally and concisely.'
    }

    const response = await this.generateText(prompt, systemPrompt)
    return response.content
  }

  // ============================================
  // OPENAI IMPLEMENTATIONS
  // ============================================

  private async openaiGenerateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    return withRetry(async () => {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = []
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt })
      }
      messages.push({ role: 'user', content: prompt })

      const completion = await openai.chat.completions.create({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        top_p: this.config.topP,
        frequency_penalty: this.config.frequencyPenalty,
        presence_penalty: this.config.presencePenalty
      })

      return {
        content: completion.choices[0]?.message?.content || '',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        },
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason || 'unknown'
      }
    })
  }

  private async openaiEmbed(text: string): Promise<EmbeddingResult> {
    return withRetry(async () => {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      })

      return {
        embedding: response.data[0].embedding,
        model: response.model,
        dimensions: response.data[0].embedding.length
      }
    })
  }

  // ============================================
  // GEMINI IMPLEMENTATIONS
  // ============================================

  private async geminiGenerateText(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    return withRetry(async () => {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
      
      const response = await fetch(
        `${GEMINI_API_URL}/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullPrompt }]
              }
            ],
            generationConfig: {
              temperature: this.config.temperature,
              maxOutputTokens: this.config.maxTokens,
              topP: this.config.topP
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      return {
        content,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        },
        model: 'gemini-2.0-flash',
        finishReason: data.candidates?.[0]?.finishReason || 'unknown'
      }
    })
  }

  private async geminiEmbed(text: string): Promise<EmbeddingResult> {
    return withRetry(async () => {
      const response = await fetch(
        `${GEMINI_API_URL}/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: {
              parts: [{ text }]
            }
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini Embedding API error: ${response.statusText}`)
      }

      const data = await response.json()
      const embedding = data.embedding?.values || []

      return {
        embedding,
        model: 'text-embedding-004',
        dimensions: embedding.length
      }
    })
  }
}

// ============================================
// SINGLETON INSTANCES
// ============================================

// Default OpenAI instance
export const openaiLLM = new LLMService({ provider: 'openai', model: 'gpt-4o' })

// Gemini instance
export const geminiLLM = new LLMService({ provider: 'gemini', model: 'gemini-2.0-flash' })

// Fast model for simple tasks
export const fastLLM = new LLMService({ provider: 'openai', model: 'gpt-4o-mini', temperature: 0.3 })

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Generate text using default LLM
 */
export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await openaiLLM.generateText(prompt, systemPrompt)
  return response.content
}

/**
 * Classify text using default LLM
 */
export async function classify(text: string, categories: string[]): Promise<{ category: string; confidence: number }> {
  return openaiLLM.classify(text, categories)
}

/**
 * Generate embeddings using default LLM
 */
export async function embed(text: string): Promise<number[]> {
  const result = await openaiLLM.embed(text)
  return result.embedding
}

/**
 * Summarize text using default LLM
 */
export async function summarize(text: string, maxWords: number = 100): Promise<string> {
  return openaiLLM.summarize(text, maxWords, 'ar')
}

/**
 * Analyze sentiment using default LLM
 */
export async function sentiment(text: string): Promise<{ mood: AIMoodType; confidence: number; explanation: string }> {
  return openaiLLM.sentiment(text)
}

/**
 * Extract JSON using default LLM
 */
export async function extractJSON<T>(prompt: string, schema: string): Promise<T> {
  return openaiLLM.extractJSON<T>(prompt, schema)
}

export default LLMService




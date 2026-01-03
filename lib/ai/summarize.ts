import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SummarizeResult {
  summary: string
  topics: string[]
  keyPoints: string[]
}

/**
 * Summarize an episode from its audio transcript
 * This is a placeholder that can be extended with actual audio transcription
 */
export async function summarizeEpisode(
  audioUrlOrTranscript: string
): Promise<SummarizeResult | null> {
  try {
    // In production, you would:
    // 1. Download the audio file
    // 2. Use Whisper API to transcribe
    // 3. Then summarize the transcript
    
    // For now, we'll use a placeholder that assumes we have a transcript
    const isUrl = audioUrlOrTranscript.startsWith('http')
    
    if (isUrl) {
      // Placeholder: In production, transcribe the audio first
      console.log('Audio URL provided, transcription would happen here:', audioUrlOrTranscript)
      return {
        summary: 'ملخص تلقائي سيتم إنشاؤه بعد نسخ الصوت',
        topics: ['موضوع 1', 'موضوع 2'],
        keyPoints: ['نقطة رئيسية 1', 'نقطة رئيسية 2'],
      }
    }

    // Summarize transcript using GPT-4
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي متخصص في تلخيص حلقات البودكاست العربية.
          قم بإنشاء ملخص شامل ومفيد باللغة العربية.
          استخرج المواضيع الرئيسية والنقاط المهمة.
          اجعل الملخص جذاباً ومفيداً للقارئ.`,
        },
        {
          role: 'user',
          content: `قم بتلخيص هذا النص من حلقة بودكاست وإستخراج المواضيع والنقاط الرئيسية:

${audioUrlOrTranscript}

أريد الإجابة بالصيغة التالية (JSON):
{
  "summary": "الملخص هنا",
  "topics": ["موضوع 1", "موضوع 2"],
  "keyPoints": ["نقطة 1", "نقطة 2"]
}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) return null

    const result = JSON.parse(content) as SummarizeResult
    return result
  } catch (error) {
    console.error('Error summarizing episode:', error)
    
    // Return placeholder on error
    return {
      summary: 'لم يتم إنشاء الملخص بعد',
      topics: [],
      keyPoints: [],
    }
  }
}

/**
 * Generate a brief summary for display
 */
export async function generateBriefSummary(
  fullSummary: string,
  maxLength: number = 200
): Promise<string> {
  if (fullSummary.length <= maxLength) {
    return fullSummary
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'قم باختصار النص التالي مع الحفاظ على المعنى الأساسي. اجعله جذاباً ومحفزاً للقراءة.',
        },
        {
          role: 'user',
          content: `اختصر هذا النص إلى ${maxLength} حرف كحد أقصى:\n\n${fullSummary}`,
        },
      ],
      max_tokens: 200,
    })

    return response.choices[0].message.content || fullSummary.slice(0, maxLength) + '...'
  } catch {
    return fullSummary.slice(0, maxLength) + '...'
  }
}




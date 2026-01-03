import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExtractedSpeaker {
  name: string
  bio?: string
  sentiment?: string
  role?: string
}

/**
 * Extract speakers mentioned in a transcript using AI
 */
export async function extractSpeakers(transcript: string): Promise<ExtractedSpeaker[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي متخصص في استخراج المتحدثين من نصوص البودكاست.
          حدد المتحدثين/الضيوف المذكورين في النص.
          استخرج معلومات عن كل متحدث: اسمه، دوره أو تخصصه، والمشاعر/النبرة العامة لحديثه.
          صنف المشاعر إلى: إيجابي، ملهم، تحفيزي، تحليلي، هادئ، نقدي.`,
        },
        {
          role: 'user',
          content: `استخرج المتحدثين من هذا النص:

${transcript}

أريد الإجابة بصيغة JSON:
{
  "speakers": [
    {
      "name": "اسم المتحدث",
      "bio": "وصف مختصر أو تخصصه",
      "sentiment": "المشاعر/النبرة",
      "role": "دوره (مقدم/ضيف/خبير)"
    }
  ]
}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content
    if (!content) return []

    const result = JSON.parse(content) as { speakers: ExtractedSpeaker[] }
    return result.speakers || []
  } catch (error) {
    console.error('Error extracting speakers:', error)
    
    // Return placeholder speakers for demo
    return [
      {
        name: 'متحدث تجريبي',
        bio: 'سيتم استخراج المتحدثين الفعليين عند توفر النص',
        sentiment: 'إيجابي',
        role: 'مقدم',
      },
    ]
  }
}

/**
 * Generate an AI avatar description for a speaker
 */
export async function generateSpeakerAvatarDescription(
  name: string,
  bio?: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'أنت فنان متخصص في وصف الصور الشخصية. اكتب وصفاً فنياً موجزاً يمكن استخدامه لإنشاء صورة رمزية احترافية.',
        },
        {
          role: 'user',
          content: `اكتب وصفاً لصورة رمزية احترافية لشخص يدعى "${name}"${bio ? ` وهو ${bio}` : ''}.
          الوصف يجب أن يكون باللغة الإنجليزية ومناسباً لإنشاء صورة بالذكاء الاصطناعي.
          الأسلوب: احترافي، دافئ، ودي.`,
        },
      ],
      max_tokens: 200,
    })

    return response.choices[0].message.content || 'A professional portrait with warm lighting'
  } catch {
    return 'A professional portrait with warm yellow background'
  }
}

/**
 * Analyze speaker sentiment from their quotes
 */
export async function analyzeSpeakerSentiment(
  quotes: string[]
): Promise<string> {
  if (quotes.length === 0) return 'غير محدد'

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'حلل المشاعر والنبرة العامة من هذه الاقتباسات. صنفها إلى: إيجابي، ملهم، تحفيزي، تحليلي، هادئ، أو نقدي.',
        },
        {
          role: 'user',
          content: `حلل المشاعر من هذه الاقتباسات:
${quotes.join('\n')}

أريد كلمة واحدة فقط تصف المشاعر العامة.`,
        },
      ],
      max_tokens: 50,
    })

    return response.choices[0].message.content?.trim() || 'إيجابي'
  } catch {
    return 'إيجابي'
  }
}

/**
 * Enrich speaker bio with AI
 */
export async function enrichSpeakerBio(
  name: string,
  existingBio?: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'أنت كاتب سير ذاتية محترف. اكتب سيرة ذاتية موجزة وجذابة.',
        },
        {
          role: 'user',
          content: `اكتب سيرة ذاتية قصيرة (2-3 جمل) لـ "${name}"${existingBio ? `. المعلومات المتوفرة: ${existingBio}` : ''}.
          اجعلها احترافية وجذابة.`,
        },
      ],
      max_tokens: 200,
    })

    return response.choices[0].message.content || existingBio || ''
  } catch {
    return existingBio || ''
  }
}




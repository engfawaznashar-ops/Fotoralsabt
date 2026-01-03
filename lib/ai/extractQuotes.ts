import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExtractedQuote {
  text: string
  speakerName?: string
  bookTitle?: string
  context?: string
}

/**
 * Extract notable quotes from a transcript using AI
 */
export async function extractQuotes(transcript: string): Promise<ExtractedQuote[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي متخصص في استخراج الاقتباسات الملهمة والمهمة من نصوص البودكاست.
          ابحث عن:
          - الحكم والمقولات الملهمة
          - الأفكار الرئيسية والمميزة
          - الاقتباسات من الكتب المذكورة
          - العبارات التي يمكن مشاركتها على وسائل التواصل
          
          اختر الاقتباسات الأكثر تأثيراً وقيمة.`,
        },
        {
          role: 'user',
          content: `استخرج الاقتباسات المهمة من هذا النص:

${transcript}

أريد الإجابة بصيغة JSON:
{
  "quotes": [
    {
      "text": "نص الاقتباس",
      "speakerName": "اسم القائل أو null",
      "bookTitle": "عنوان الكتاب إن كان اقتباساً من كتاب أو null",
      "context": "سياق الاقتباس المختصر"
    }
  ]
}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
    })

    const content = response.choices[0].message.content
    if (!content) return []

    const result = JSON.parse(content) as { quotes: ExtractedQuote[] }
    return result.quotes || []
  } catch (error) {
    console.error('Error extracting quotes:', error)
    
    // Return placeholder quotes for demo
    return [
      {
        text: 'اقتباس تجريبي سيتم استبداله عند توفر النص',
        speakerName: 'متحدث تجريبي',
        context: 'سياق تجريبي',
      },
    ]
  }
}

/**
 * Generate a social media ready version of a quote
 */
export async function formatQuoteForSocial(
  quote: string,
  speakerName?: string,
  platform: 'twitter' | 'instagram' = 'twitter'
): Promise<string> {
  const maxLength = platform === 'twitter' ? 280 : 2200

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `أنت خبير في صياغة المحتوى لوسائل التواصل الاجتماعي.
          اكتب نسخة جذابة من الاقتباس مناسبة للنشر على ${platform === 'twitter' ? 'تويتر' : 'انستغرام'}.
          أضف هاشتاقات مناسبة.`,
        },
        {
          role: 'user',
          content: `صغ هذا الاقتباس للنشر (${maxLength} حرف كحد أقصى):
"${quote}"
${speakerName ? `- ${speakerName}` : ''}`,
        },
      ],
      max_tokens: 300,
    })

    return response.choices[0].message.content || quote
  } catch {
    return `"${quote}"${speakerName ? `\n- ${speakerName}` : ''}\n\n#فطور_السبت #بودكاست`
  }
}

/**
 * Find similar quotes
 */
export async function findSimilarQuotes(
  quote: string,
  existingQuotes: string[]
): Promise<string[]> {
  if (existingQuotes.length === 0) return []

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'حدد الاقتباسات المشابهة من حيث المعنى أو الموضوع.',
        },
        {
          role: 'user',
          content: `الاقتباس الأصلي:
"${quote}"

الاقتباسات المتوفرة:
${existingQuotes.map((q, i) => `${i + 1}. "${q}"`).join('\n')}

أعد قائمة بأرقام الاقتباسات المشابهة فقط (مثال: 1, 3, 5)`,
        },
      ],
      max_tokens: 100,
    })

    const content = response.choices[0].message.content || ''
    const indices = content.match(/\d+/g)?.map((n) => parseInt(n) - 1) || []
    
    return indices
      .filter((i) => i >= 0 && i < existingQuotes.length)
      .map((i) => existingQuotes[i])
  } catch {
    return []
  }
}

/**
 * Categorize a quote by topic
 */
export async function categorizeQuote(quote: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `صنف الاقتباس إلى فئات مناسبة.
          الفئات المتاحة: التطوير الذاتي، القيادة، النجاح، العادات، القراءة، الإنتاجية، العلاقات، الصحة، التعلم، الإبداع، المال، الأعمال.`,
        },
        {
          role: 'user',
          content: `صنف هذا الاقتباس:
"${quote}"

أريد قائمة بالفئات المناسبة (1-3 فئات) بصيغة JSON:
{ "categories": ["فئة 1", "فئة 2"] }`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 100,
    })

    const content = response.choices[0].message.content
    if (!content) return ['عام']

    const result = JSON.parse(content) as { categories: string[] }
    return result.categories || ['عام']
  } catch {
    return ['عام']
  }
}




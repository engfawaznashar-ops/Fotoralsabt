import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExtractedBook {
  title: string
  author?: string
  description?: string
}

/**
 * Extract books mentioned in a transcript using AI
 */
export async function extractBooks(transcript: string): Promise<ExtractedBook[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي متخصص في استخراج الكتب المذكورة في نصوص البودكاست.
          استخرج جميع الكتب المذكورة مع معلوماتها.
          إذا لم يُذكر المؤلف صراحة، حاول تخمينه إذا كان الكتاب معروفاً.
          اكتب وصفاً مختصراً وجذاباً لكل كتاب.`,
        },
        {
          role: 'user',
          content: `استخرج جميع الكتب المذكورة في هذا النص:

${transcript}

أريد الإجابة بصيغة JSON:
{
  "books": [
    {
      "title": "عنوان الكتاب",
      "author": "اسم المؤلف أو null",
      "description": "وصف مختصر للكتاب"
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

    const result = JSON.parse(content) as { books: ExtractedBook[] }
    return result.books || []
  } catch (error) {
    console.error('Error extracting books:', error)
    
    // Return placeholder books for demo
    return [
      {
        title: 'كتاب تجريبي',
        author: 'مؤلف تجريبي',
        description: 'سيتم استخراج الكتب الفعلية عند توفر النص',
      },
    ]
  }
}

/**
 * Generate an AI cover description for a book
 */
export async function generateBookCoverDescription(
  title: string,
  author?: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'أنت فنان متخصص في وصف أغلفة الكتب. اكتب وصفاً فنياً موجزاً يمكن استخدامه لإنشاء صورة غلاف.',
        },
        {
          role: 'user',
          content: `اكتب وصفاً فنياً لغلاف كتاب "${title}"${author ? ` للمؤلف ${author}` : ''}. 
          الوصف يجب أن يكون باللغة الإنجليزية ومناسباً لإنشاء صورة بالذكاء الاصطناعي.`,
        },
      ],
      max_tokens: 200,
    })

    return response.choices[0].message.content || 'A minimalist book cover design'
  } catch {
    return 'A minimalist book cover with warm yellow and black colors'
  }
}

/**
 * Search for book information
 */
export async function enrichBookInfo(
  title: string,
  author?: string
): Promise<ExtractedBook> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'أنت مساعد معرفي. قدم معلومات دقيقة عن الكتب.',
        },
        {
          role: 'user',
          content: `قدم معلومات عن كتاب "${title}"${author ? ` للمؤلف ${author}` : ''}.

أريد الإجابة بصيغة JSON:
{
  "title": "العنوان الصحيح",
  "author": "المؤلف",
  "description": "وصف الكتاب في 2-3 جمل"
}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    })

    const content = response.choices[0].message.content
    if (!content) return { title, author }

    return JSON.parse(content) as ExtractedBook
  } catch {
    return { title, author }
  }
}




/**
 * Book Extraction Service
 * Extracts book mentions from transcripts
 */

import { openaiLLM } from '../shared/llm'
import type { BookData, TranscriptData } from '../shared/types'
import { generateId, extractJSONFromResponse, parseTime } from '../shared/utils'

export interface ExtractBooksOptions {
  maxBooks?: number
  minRelevance?: number
  validateBooks?: boolean
}

/**
 * Extract book mentions from transcript
 */
export async function extractBooks(
  transcript: TranscriptData | string,
  options: ExtractBooksOptions = {}
): Promise<BookData[]> {
  const {
    maxBooks = 20,
    minRelevance = 0.3
  } = options

  const text = typeof transcript === 'string' 
    ? transcript 
    : transcript.text

  const segments = typeof transcript === 'object' 
    ? transcript.segments 
    : []

  const prompt = `تحليل النص التالي واستخراج جميع الكتب المذكورة فيه.

النص:
${text.slice(0, 8000)} ${text.length > 8000 ? '...' : ''}

لكل كتاب مذكور، استخرج:
- عنوان الكتاب بالعربية والإنجليزية (إن وجد)
- اسم المؤلف
- السياق الذي ذُكر فيه
- مدى صلته بموضوع النقاش (0-1)
- التصنيف (تنمية ذاتية، قيادة، علم نفس، أعمال، تقنية، فلسفة، تاريخ، إنتاجية)

أجب بصيغة JSON فقط:
{
  "books": [
    {
      "title": "عنوان الكتاب",
      "titleAr": "عنوان الكتاب بالعربية",
      "author": "اسم المؤلف",
      "authorAr": "اسم المؤلف بالعربية",
      "context": "السياق الذي ذُكر فيه الكتاب",
      "relevance": 0.9,
      "category": "تنمية ذاتية"
    }
  ]
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    const books: BookData[] = result.books
      .filter((book: any) => book.relevance >= minRelevance)
      .slice(0, maxBooks)
      .map((book: any) => ({
        id: generateId(),
        title: book.title,
        titleAr: book.titleAr || book.title,
        author: book.author,
        authorAr: book.authorAr || book.author,
        mentionedAt: findBookMentions(text, book.title, segments),
        relevance: book.relevance,
        context: book.context,
        category: book.category
      }))

    return books

  } catch (error) {
    console.error('Book extraction error:', error)
    return []
  }
}

/**
 * Find timestamps where a book is mentioned
 */
function findBookMentions(
  text: string,
  bookTitle: string,
  segments: { start: number; end: number; text: string }[]
): number[] {
  const mentions: number[] = []
  const searchTerms = [bookTitle, bookTitle.toLowerCase()]

  for (const segment of segments) {
    const segmentText = segment.text.toLowerCase()
    if (searchTerms.some(term => segmentText.includes(term.toLowerCase()))) {
      mentions.push(Math.floor(segment.start))
    }
  }

  return [...new Set(mentions)] // Remove duplicates
}

/**
 * Validate book information using external API or LLM
 */
export async function validateBook(book: BookData): Promise<BookData & { validated: boolean }> {
  const prompt = `تحقق من صحة معلومات الكتاب التالي:
  
العنوان: ${book.title}
المؤلف: ${book.author}

هل هذه المعلومات صحيحة؟ إذا لم تكن صحيحة، قدم المعلومات الصحيحة.

أجب بصيغة JSON:
{
  "valid": true/false,
  "correctedTitle": "العنوان الصحيح",
  "correctedAuthor": "المؤلف الصحيح",
  "additionalInfo": "معلومات إضافية عن الكتاب"
}`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const result = JSON.parse(json)

    return {
      ...book,
      title: result.correctedTitle || book.title,
      author: result.correctedAuthor || book.author,
      validated: result.valid
    }

  } catch (error) {
    console.error('Book validation error:', error)
    return { ...book, validated: false }
  }
}

/**
 * Get book category suggestions
 */
export async function suggestBookCategory(
  title: string,
  author: string,
  context?: string
): Promise<string> {
  const categories = [
    'تنمية ذاتية',
    'قيادة',
    'علم نفس',
    'أعمال',
    'تقنية',
    'فلسفة',
    'تاريخ',
    'إنتاجية'
  ]

  const prompt = `ما هو التصنيف المناسب لهذا الكتاب؟

العنوان: ${title}
المؤلف: ${author}
${context ? `السياق: ${context}` : ''}

التصنيفات المتاحة:
${categories.join('\n')}

أجب بالتصنيف فقط (كلمة واحدة أو كلمتين).`

  try {
    const response = await openaiLLM.generateText(prompt)
    const category = response.content.trim()
    
    // Match to closest valid category
    const matchedCategory = categories.find(c => 
      category.includes(c) || c.includes(category)
    )
    
    return matchedCategory || 'أخرى'

  } catch (error) {
    console.error('Category suggestion error:', error)
    return 'أخرى'
  }
}

/**
 * Find similar books based on topic
 */
export async function findSimilarBooks(
  book: BookData,
  allBooks: BookData[]
): Promise<BookData[]> {
  if (allBooks.length <= 1) return []

  const prompt = `من بين الكتب التالية، ما هي الأكثر تشابهاً مع كتاب "${book.titleAr}"؟

الكتب:
${allBooks.filter(b => b.id !== book.id).map(b => b.titleAr).join('\n')}

رتب الكتب حسب درجة التشابه (الأعلى أولاً).
أجب بقائمة من 3-5 كتب فقط:
["كتاب1", "كتاب2", "كتاب3"]`

  try {
    const response = await openaiLLM.generateText(prompt)
    const json = extractJSONFromResponse(response.content)
    const similarTitles = JSON.parse(json)

    return similarTitles
      .map((title: string) => allBooks.find(b => b.titleAr === title || b.title === title))
      .filter((b: BookData | undefined): b is BookData => b !== undefined)

  } catch (error) {
    console.error('Similar books error:', error)
    return []
  }
}

/**
 * Generate AI summary for a book
 */
export async function generateBookSummary(
  book: BookData,
  maxWords: number = 100
): Promise<string> {
  const prompt = `اكتب ملخصاً مختصراً (${maxWords} كلمة كحد أقصى) لكتاب "${book.titleAr}" للمؤلف ${book.author}.

الملخص يجب أن يشمل:
- الفكرة الرئيسية للكتاب
- أهم النقاط
- لمن هذا الكتاب

اكتب بالعربية الفصحى بأسلوب سلس.`

  try {
    const response = await openaiLLM.generateText(prompt)
    return response.content.trim()

  } catch (error) {
    console.error('Book summary error:', error)
    return `كتاب ${book.titleAr} للمؤلف ${book.author}.`
  }
}

export default extractBooks




/**
 * Book Insights Service
 * Generates AI-powered insights for books
 */

import type { BookInsights, QuoteData, BookCategoryType } from '../shared/types'
import { openaiLLM } from '../shared/llm'
import { extractJSONFromResponse } from '../shared/utils'
import { prisma } from '@/lib/db'

// Extended insights interface for the book details page
export interface ExtendedBookInsights extends BookInsights {
  keyIdeas: string[]
  whyImportant: string
  bestEpisode: {
    id: string
    title: string
    episodeNumber: number | null
  } | null
  relatedConcepts: string[]
  toneAnalysis: string
  audienceFit: string
}

/**
 * Get comprehensive insights for a book
 */
export async function getBookInsights(bookId: string): Promise<ExtendedBookInsights | null> {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        episodes: { 
          include: { 
            episode: {
              include: {
                speakers: { include: { speaker: true } }
              }
            }
          }
        },
        quotes: {
          include: {
            speaker: true,
            episode: true
          }
        }
      }
    })

    if (!book) return null

    // Get discussed episodes
    const discussedInEpisodes = book.episodes.map(ep => ({
      id: ep.episode.id,
      title: ep.episode.title,
      titleAr: ep.episode.title,
      date: ep.episode.date,
      relevance: 1
    }))

    // Get related speakers
    const speakerMap = new Map<string, any>()
    for (const ep of book.episodes) {
      for (const sp of ep.episode.speakers) {
        if (!speakerMap.has(sp.speaker.id)) {
          speakerMap.set(sp.speaker.id, sp.speaker)
        }
      }
    }

    const relatedSpeakers = Array.from(speakerMap.values()).map(speaker => ({
      id: speaker.id,
      name: speaker.name,
      relevance: 1
    }))

    // Get top quotes
    const topQuotes = book.quotes.slice(0, 5).map(quote => ({
      id: quote.id,
      text: quote.text,
      textAr: quote.text,
      speaker: quote.speaker?.name,
      timestamp: 0,
      episodeId: quote.episodeId || undefined,
      impact: 80,
      themes: []
    }))

    // Generate AI summary and additional insights
    const aiSummary = await generateBookSummary(book)
    const aiInsights = await generateExtendedBookInsights(book)

    // Determine category
    const category = (book.category as BookCategoryType) || await determineBookCategory(book)

    // Calculate rating
    const rating = calculateBookRating(book)

    // Find best episode (most recent with this book)
    const bestEpisode = book.episodes.length > 0 
      ? {
          id: book.episodes[0].episode.id,
          title: book.episodes[0].episode.title,
          episodeNumber: book.episodes[0].episode.episodeNumber
        }
      : null

    return {
      bookId,
      title: book.title,
      author: book.author || '',
      discussedInEpisodes,
      relatedSpeakers,
      topQuotes,
      aiSummary,
      aiSummaryAr: aiSummary,
      category,
      rating,
      // Extended fields
      keyIdeas: aiInsights.keyIdeas,
      whyImportant: aiInsights.whyImportant,
      bestEpisode,
      relatedConcepts: aiInsights.relatedConcepts,
      toneAnalysis: aiInsights.toneAnalysis,
      audienceFit: aiInsights.audienceFit,
    }

  } catch (error) {
    console.error('Book insights error:', error)
    return null
  }
}

/**
 * Generate extended AI insights for a book
 */
async function generateExtendedBookInsights(book: any): Promise<{
  keyIdeas: string[]
  whyImportant: string
  relatedConcepts: string[]
  toneAnalysis: string
  audienceFit: string
}> {
  const prompt = `أنت محلل كتب ذكي. قم بتحليل هذا الكتاب وأعطني المعلومات التالية بصيغة JSON:

الكتاب: "${book.title}"
المؤلف: ${book.author || 'غير معروف'}
${book.description ? `الوصف: ${book.description}` : ''}

أريد:
1. keyIdeas: مصفوفة من 3-5 أفكار رئيسية (كل فكرة في 5-10 كلمات)
2. whyImportant: لماذا هذا الكتاب مهم؟ (جملة أو جملتين)
3. relatedConcepts: مصفوفة من 3-5 مفاهيم مرتبطة
4. toneAnalysis: ما هو أسلوب الكتاب؟ (أكاديمي، عملي، تحفيزي، قصصي...)
5. audienceFit: من هي الفئة المستهدفة؟ (جملة واحدة)

أجب بصيغة JSON فقط.`

  try {
    const response = await openaiLLM.generateText(prompt)
    const parsed = extractJSONFromResponse(response.content)
    
    return {
      keyIdeas: parsed?.keyIdeas || ['فكرة التحسين المستمر', 'بناء العادات الإيجابية', 'قوة التغيير التدريجي'],
      whyImportant: parsed?.whyImportant || 'يقدم هذا الكتاب منهجية عملية وقابلة للتطبيق لتحسين الحياة اليومية.',
      relatedConcepts: parsed?.relatedConcepts || ['الإنتاجية', 'التنمية الذاتية', 'علم النفس السلوكي'],
      toneAnalysis: parsed?.toneAnalysis || 'عملي وتطبيقي مع أمثلة واقعية',
      audienceFit: parsed?.audienceFit || 'مناسب لكل من يسعى لتطوير ذاته وبناء عادات إيجابية',
    }

  } catch (error) {
    console.error('Extended book insights error:', error)
    return {
      keyIdeas: ['فكرة التحسين المستمر', 'بناء العادات الإيجابية', 'قوة التغيير التدريجي'],
      whyImportant: 'يقدم هذا الكتاب منهجية عملية وقابلة للتطبيق لتحسين الحياة اليومية.',
      relatedConcepts: ['الإنتاجية', 'التنمية الذاتية', 'علم النفس السلوكي'],
      toneAnalysis: 'عملي وتطبيقي مع أمثلة واقعية',
      audienceFit: 'مناسب لكل من يسعى لتطوير ذاته وبناء عادات إيجابية',
    }
  }
}

/**
 * Generate AI summary for a book
 */
async function generateBookSummary(book: any): Promise<string> {
  const prompt = `اكتب ملخصاً مختصراً (50-100 كلمة) لكتاب "${book.title}" للمؤلف ${book.author || 'غير معروف'}.

${book.description ? `وصف الكتاب: ${book.description}` : ''}

الملخص يجب أن يشمل:
- الفكرة الرئيسية
- الفائدة للقارئ
- لمن هذا الكتاب`

  try {
    const response = await openaiLLM.generateText(prompt)
    return response.content.trim()

  } catch (error) {
    console.error('Book summary error:', error)
    return book.description || `كتاب ${book.title} للمؤلف ${book.author || ''}.`
  }
}

/**
 * Determine book category using AI
 */
async function determineBookCategory(book: any): Promise<BookCategoryType> {
  const prompt = `ما هو التصنيف المناسب لهذا الكتاب؟

العنوان: ${book.title}
المؤلف: ${book.author || 'غير معروف'}
${book.description ? `الوصف: ${book.description}` : ''}

التصنيفات المتاحة:
- تنمية ذاتية
- قيادة
- علم نفس
- أعمال
- تقنية
- فلسفة
- تاريخ
- إنتاجية

أجب بالتصنيف فقط (كلمة أو كلمتين).`

  try {
    const response = await openaiLLM.generateText(prompt)
    const category = response.content.trim()

    const validCategories: BookCategoryType[] = [
      'تنمية ذاتية', 'قيادة', 'علم نفس', 'أعمال', 
      'تقنية', 'فلسفة', 'تاريخ', 'إنتاجية'
    ]

    return validCategories.includes(category as BookCategoryType) 
      ? category as BookCategoryType 
      : 'تنمية ذاتية'

  } catch (error) {
    return 'تنمية ذاتية'
  }
}

/**
 * Calculate book rating based on mentions and engagement
 */
function calculateBookRating(book: any): number {
  const episodeCount = book.episodes.length
  const quoteCount = book.quotes.length

  // Base rating
  let rating = 3.5

  // Boost for episode mentions (up to +1)
  rating += Math.min(episodeCount * 0.2, 1)

  // Boost for quotes (up to +0.5)
  rating += Math.min(quoteCount * 0.1, 0.5)

  return Math.min(Math.round(rating * 10) / 10, 5)
}

/**
 * Get book statistics
 */
export async function getBookStats(bookId: string): Promise<{
  mentionCount: number
  quoteCount: number
  speakerCount: number
  firstMentioned: Date | null
  lastMentioned: Date | null
} | null> {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        episodes: { include: { episode: true } },
        quotes: true
      }
    })

    if (!book) return null

    // Get unique speakers
    const speakerIds = new Set<string>()
    for (const ep of book.episodes) {
      const speakers = await prisma.speakerEpisode.findMany({
        where: { episodeId: ep.episodeId },
        select: { speakerId: true }
      })
      speakers.forEach(s => speakerIds.add(s.speakerId))
    }

    // Get date range
    let firstMentioned: Date | null = null
    let lastMentioned: Date | null = null

    for (const ep of book.episodes) {
      const date = ep.episode.date
      if (!firstMentioned || date < firstMentioned) {
        firstMentioned = date
      }
      if (!lastMentioned || date > lastMentioned) {
        lastMentioned = date
      }
    }

    return {
      mentionCount: book.episodes.length,
      quoteCount: book.quotes.length,
      speakerCount: speakerIds.size,
      firstMentioned,
      lastMentioned
    }

  } catch (error) {
    console.error('Book stats error:', error)
    return null
  }
}

/**
 * Get books by category
 */
export async function getBooksByCategory(category: BookCategoryType): Promise<{
  id: string
  title: string
  author: string
  rating: number
}[]> {
  try {
    const books = await prisma.book.findMany({
      where: { category },
      include: {
        episodes: true,
        quotes: true
      }
    })

    return books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author || '',
      rating: calculateBookRating(book)
    }))

  } catch (error) {
    console.error('Books by category error:', error)
    return []
  }
}

/**
 * Compare multiple books
 */
export async function compareBooks(bookIds: string[]): Promise<{
  comparison: {
    bookId: string
    title: string
    author: string
    mentionCount: number
    quoteCount: number
    rating: number
  }[]
}> {
  const insights = await Promise.all(
    bookIds.map(id => getBookInsights(id))
  )

  const validInsights = insights.filter((i): i is BookInsights => i !== null)

  const comparison = await Promise.all(
    validInsights.map(async insight => {
      const stats = await getBookStats(insight.bookId)
      return {
        bookId: insight.bookId,
        title: insight.title,
        author: insight.author,
        mentionCount: stats?.mentionCount || 0,
        quoteCount: stats?.quoteCount || 0,
        rating: insight.rating
      }
    })
  )

  return { comparison }
}

export default getBookInsights


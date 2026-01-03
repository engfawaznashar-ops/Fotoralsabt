import { googleBooksProvider } from './googleBooks'
import { openLibraryProvider } from './openLibrary'
import type { BookMetadata, BookSearchParams, BookProvider } from './types'

const providers: BookProvider[] = [
  googleBooksProvider,
  openLibraryProvider
]

/**
 * البحث عن كتاب باستخدام ISBN
 * يجرب جميع المصادر حتى يجد نتيجة
 */
export async function lookupBookByISBN(isbn: string): Promise<BookMetadata | null> {
  const cleanISBN = isbn.replace(/[^0-9X]/g, '')
  
  for (const provider of providers) {
    try {
      const result = await provider.searchByISBN(cleanISBN)
      if (result) {
        console.log(`✅ Found book via ${provider.name}:`, result.title)
        return result
      }
    } catch (error) {
      console.error(`❌ ${provider.name} failed:`, error)
      continue
    }
  }
  
  return null
}

/**
 * البحث عن كتاب بالعنوان والمؤلف
 * يجمع النتائج من جميع المصادر
 */
export async function searchBooks(params: BookSearchParams): Promise<BookMetadata[]> {
  if (params.isbn) {
    const result = await lookupBookByISBN(params.isbn)
    return result ? [result] : []
  }

  if (!params.title) {
    return []
  }

  const allResults: BookMetadata[] = []

  for (const provider of providers) {
    try {
      const results = await provider.searchByTitleAuthor(params.title, params.author)
      allResults.push(...results)
    } catch (error) {
      console.error(`❌ ${provider.name} search failed:`, error)
      continue
    }
  }

  // إزالة التكرارات بناءً على ISBN
  const uniqueBooks = new Map<string, BookMetadata>()
  
  for (const book of allResults) {
    const key = book.isbn13 || book.isbn10 || `${book.title}-${book.authors[0]}`
    if (!uniqueBooks.has(key)) {
      uniqueBooks.set(key, book)
    }
  }

  return Array.from(uniqueBooks.values()).slice(0, 10)
}

export * from './types'
export { googleBooksProvider, openLibraryProvider }


import type { BookMetadata, BookProvider } from './types'

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'

// تحويل بيانات Google Books إلى BookMetadata
function normalizeGoogleBook(item: any): BookMetadata | null {
  if (!item.volumeInfo) return null

  const info = item.volumeInfo
  
  return {
    title: info.title || '',
    titleEn: info.title,
    titleAr: info.title, // سنترجمه لاحقاً بـAI
    authors: info.authors || [],
    description: info.description,
    coverImageUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                   info.imageLinks?.smallThumbnail?.replace('http:', 'https:'),
    isbn10: info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier,
    isbn13: info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
    publishYear: info.publishedDate ? parseInt(info.publishedDate.split('-')[0]) : undefined,
    language: info.language,
    categories: info.categories || [],
    pageCount: info.pageCount,
    publisher: info.publisher,
    source: 'google_books',
    sourceRef: item.id
  }
}

export const googleBooksProvider: BookProvider = {
  name: 'Google Books',

  async searchByISBN(isbn: string): Promise<BookMetadata | null> {
    try {
      const cleanISBN = isbn.replace(/[^0-9X]/g, '')
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=isbn:${cleanISBN}&maxResults=1`)
      
      if (!response.ok) return null
      
      const data = await response.json()
      if (!data.items || data.items.length === 0) return null
      
      return normalizeGoogleBook(data.items[0])
    } catch (error) {
      console.error('Google Books API error (ISBN):', error)
      return null
    }
  },

  async searchByTitleAuthor(title: string, author?: string): Promise<BookMetadata[]> {
    try {
      let query = `intitle:${title}`
      if (author) {
        query += `+inauthor:${author}`
      }
      
      const response = await fetch(
        `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=5&orderBy=relevance`
      )
      
      if (!response.ok) return []
      
      const data = await response.json()
      if (!data.items) return []
      
      return data.items
        .map(normalizeGoogleBook)
        .filter((book): book is BookMetadata => book !== null)
    } catch (error) {
      console.error('Google Books API error (Title/Author):', error)
      return []
    }
  }
}


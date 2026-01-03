import type { BookMetadata, BookProvider } from './types'

const OPENLIBRARY_API = 'https://openlibrary.org'

// تحويل بيانات OpenLibrary إلى BookMetadata
function normalizeOpenLibraryBook(data: any): BookMetadata | null {
  if (!data) return null

  // استخراج المؤلفين
  const authors = data.authors?.map((a: any) => a.name || a) || []

  return {
    title: data.title || '',
    titleEn: data.title,
    titleAr: data.title, // سنترجمه لاحقاً
    authors: authors,
    description: typeof data.description === 'string' 
      ? data.description 
      : data.description?.value,
    coverImageUrl: data.covers?.[0] 
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
      : undefined,
    isbn10: data.isbn_10?.[0],
    isbn13: data.isbn_13?.[0],
    publishYear: data.publish_date ? parseInt(data.publish_date) : undefined,
    categories: data.subjects?.slice(0, 5) || [],
    pageCount: data.number_of_pages,
    publisher: data.publishers?.[0],
    source: 'open_library',
    sourceRef: data.key
  }
}

export const openLibraryProvider: BookProvider = {
  name: 'Open Library',

  async searchByISBN(isbn: string): Promise<BookMetadata | null> {
    try {
      const cleanISBN = isbn.replace(/[^0-9X]/g, '')
      const response = await fetch(`${OPENLIBRARY_API}/isbn/${cleanISBN}.json`)
      
      if (!response.ok) return null
      
      const data = await response.json()
      return normalizeOpenLibraryBook(data)
    } catch (error) {
      console.error('OpenLibrary API error (ISBN):', error)
      return null
    }
  },

  async searchByTitleAuthor(title: string, author?: string): Promise<BookMetadata[]> {
    try {
      let query = title
      if (author) {
        query += ` ${author}`
      }
      
      const response = await fetch(
        `${OPENLIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=5`
      )
      
      if (!response.ok) return []
      
      const data = await response.json()
      if (!data.docs || data.docs.length === 0) return []
      
      // تحويل نتائج البحث
      const books: BookMetadata[] = []
      for (const doc of data.docs) {
        const metadata: BookMetadata = {
          title: doc.title || '',
          titleEn: doc.title,
          titleAr: doc.title,
          authors: doc.author_name || [],
          coverImageUrl: doc.cover_i 
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            : undefined,
          isbn10: doc.isbn?.[0],
          isbn13: doc.isbn?.find((i: string) => i.length === 13),
          publishYear: doc.first_publish_year,
          categories: doc.subject?.slice(0, 5) || [],
          publisher: doc.publisher?.[0],
          source: 'open_library',
          sourceRef: doc.key
        }
        books.push(metadata)
      }
      
      return books
    } catch (error) {
      console.error('OpenLibrary API error (Title/Author):', error)
      return []
    }
  }
}


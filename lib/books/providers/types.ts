// أنواع بيانات الكتب من المصادر الخارجية

export interface BookMetadata {
  title: string
  titleAr?: string
  titleEn?: string
  authors: string[] // أسماء المؤلفين
  description?: string
  descriptionAr?: string
  coverImageUrl?: string
  isbn10?: string
  isbn13?: string
  publishYear?: number
  language?: string
  categories?: string[]
  pageCount?: number
  publisher?: string
  source: 'google_books' | 'open_library' | 'manual'
  sourceRef?: string
}

export interface BookSearchParams {
  isbn?: string // ISBN-10 أو ISBN-13
  title?: string
  author?: string
  language?: string // للتصفية (مثل: 'ar')
}

export interface BookProvider {
  name: string
  searchByISBN(isbn: string): Promise<BookMetadata | null>
  searchByTitleAuthor(title: string, author?: string): Promise<BookMetadata[]>
}


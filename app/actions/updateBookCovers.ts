'use server'

import { prisma } from '@/lib/db'
import { lookupBookByISBN, searchBooks } from '@/lib/books/providers'

/**
 * تحديث صور الكتب من الإنترنت
 */
export async function updateBookCovers() {
  const books = await prisma.book.findMany({
    where: {
      coverImageUrl: null
    }
  })

  let updated = 0

  for (const book of books) {
    try {
      let metadata = null

      // جرب بالـISBN أولاً
      if (book.isbn13) {
        metadata = await lookupBookByISBN(book.isbn13)
      } else if (book.isbn10) {
        metadata = await lookupBookByISBN(book.isbn10)
      }

      // إذا فشل، جرب بالعنوان
      if (!metadata && (book.titleAr || book.title)) {
        const results = await searchBooks({
          title: book.titleAr || book.title || '',
          author: book.author || undefined
        })
        metadata = results[0]
      }

      // تحديث الصورة
      if (metadata?.coverImageUrl) {
        await prisma.book.update({
          where: { id: book.id },
          data: { coverImageUrl: metadata.coverImageUrl }
        })
        updated++
        console.log(`✅ Updated cover for: ${book.titleAr || book.title}`)
      }
    } catch (error) {
      console.error(`❌ Failed to update ${book.id}:`, error)
    }
  }

  return { success: true, updated }
}

/**
 * جلب صورة كتاب واحد
 */
export async function fetchBookCover(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId }
  })

  if (!book) return null

  try {
    let metadata = null

    if (book.isbn13) {
      metadata = await lookupBookByISBN(book.isbn13)
    } else if (book.titleAr || book.title) {
      const results = await searchBooks({
        title: book.titleAr || book.title || ''
      })
      metadata = results[0]
    }

    if (metadata?.coverImageUrl) {
      await prisma.book.update({
        where: { id: bookId },
        data: { coverImageUrl: metadata.coverImageUrl }
      })
      
      return metadata.coverImageUrl
    }
  } catch (error) {
    console.error('Error fetching cover:', error)
  }

  return null
}


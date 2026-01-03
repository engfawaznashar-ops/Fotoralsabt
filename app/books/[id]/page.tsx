import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { SmartBookCard } from '@/app/components/books/SmartBookCard'
import { ArrowRight, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  // جلب الكتاب مع كل التفاصيل
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      authors: {
        include: {
          author: true
        }
      },
      offers: {
        include: {
          retailer: true
        },
        orderBy: {
          priceAmount: 'asc'
        }
      }
    }
  })

  if (!book) {
    notFound()
  }

  // تحويل البيانات
  const bookData = {
    id: book.id,
    titleAr: book.titleAr || book.title || 'بدون عنوان',
    titleEn: book.titleEn,
    descriptionAr: book.descriptionAr || book.description,
    coverImageUrl: book.coverImageUrl || book.aiCoverUrl,
    authors: book.authors.map(ba => ({ nameAr: ba.author.nameAr })),
    categories: book.categories ? JSON.parse(book.categories) : [],
    publishYear: book.publishYear || undefined,
    language: book.language || undefined,
    aiSummaryAr: book.aiSummaryAr,
    aiKeyTakeaways: book.aiKeyTakeaways ? JSON.parse(book.aiKeyTakeaways) : [],
    aiForWho: book.aiForWho ? JSON.parse(book.aiForWho) : [],
    aiSimilarBooks: book.aiSimilarBooks ? JSON.parse(book.aiSimilarBooks) : [],
    offers: book.offers.map(offer => ({
      id: offer.id,
      retailer: {
        nameAr: offer.retailer.nameAr,
        logoUrl: offer.retailer.logoUrl
      },
      priceAmount: offer.priceAmount || undefined,
      currency: offer.currency,
      offerUrl: offer.offerUrl,
      availability: offer.availability || undefined,
      shippingNote: offer.shippingNote || undefined,
      lastCheckedAt: offer.lastCheckedAt
    }))
  }

  const cheapestPrice = book.offers[0]?.priceAmount || 0

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/books/smart"
              className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-black transition-colors font-tajawal text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للكتب الذكية
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 mb-4">
              <Sparkles className="w-4 h-4 text-brand-black" />
              <span className="text-sm font-tajawal font-bold text-brand-black">
                تحليل ذكي + مقارنة أسعار
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-changa font-bold text-brand-black mb-3">
              {bookData.titleAr}
            </h1>

            {bookData.authors.length > 0 && (
              <p className="text-xl text-brand-gray font-tajawal">
                {bookData.authors.map(a => a.nameAr).join(' • ')}
              </p>
            )}

            {/* Price highlight */}
            {cheapestPrice > 0 && (
              <div className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl">
                <span className="text-sm font-tajawal text-green-900">أفضل سعر:</span>
                <span className="text-3xl font-changa font-black text-green-700">
                  {cheapestPrice}
                </span>
                <span className="text-sm text-green-600">ريال</span>
              </div>
            )}
          </div>

          {/* Full Book Card */}
          <div className="max-w-3xl mx-auto">
            <SmartBookCard book={bookData} variant="full" />
          </div>

          {/* Similar Books */}
          {bookData.aiSimilarBooks && bookData.aiSimilarBooks.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-changa font-bold text-brand-black mb-6 text-center">
                كتب مشابهة
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {bookData.aiSimilarBooks.slice(0, 3).map((similarBook, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-xl border border-brand-sand hover:border-brand-yellow/40 transition-all"
                  >
                    <p className="text-sm font-tajawal text-brand-black text-center">
                      {similarBook}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

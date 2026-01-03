import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { SmartBookCard } from '@/app/components/books/SmartBookCard'
import { PageHeader } from '@/app/components/page-header'
import { BookOpen, Sparkles, TrendingDown } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function SmartBooksPage() {
  // جلب الكتب مع العروض والمؤلفين
  const books = await prisma.book.findMany({
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
          priceAmount: 'asc' // الأرخص أولاً
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  // تحويل البيانات للتوافق مع SmartBookCard
  const booksData = books.map(book => ({
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
      lastCheckedAt: offer.lastCheckedAt
    }))
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header - Enhanced */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 mb-4">
              <Sparkles className="w-4 h-4 text-brand-black animate-pulse" />
              <span className="text-sm font-tajawal font-bold text-brand-black">مدعوم بالذكاء الاصطناعي</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-changa font-black text-brand-black mb-3">
              الكتب الذكية 📚
            </h1>
            <p className="text-lg md:text-xl font-tajawal text-brand-gray max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold text-brand-black">مقارنة الأسعار</span> من متاجر متعددة + 
              <span className="font-bold text-purple-700"> تحليلات ذكية</span> لكل كتاب
            </p>
          </div>

          {/* Info Boxes */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-brand-sand/50 border border-brand-yellow/30 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-brand-yellow" />
                <span className="font-changa font-bold text-brand-black">ذكاء اصطناعي</span>
              </div>
              <p className="text-sm font-tajawal text-brand-gray leading-relaxed">
                ملخصات وأفكار رئيسية لكل كتاب
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 border border-green-300/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="font-changa font-bold text-green-900">مقارنة الأسعار</span>
              </div>
              <p className="text-sm font-tajawal text-green-800 leading-relaxed">
                نجد لك أفضل سعر من {booksData[0]?.offers?.length || 3} متاجر
              </p>
            </div>
            
            <div className="p-4 bg-brand-yellow/20 border border-brand-yellow/40 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-brand-black" />
                <span className="font-changa font-bold text-brand-black">تحديث مستمر</span>
              </div>
              <p className="text-sm font-tajawal text-brand-gray leading-relaxed">
                الأسعار محدثة بشكل دوري
              </p>
            </div>
          </div>

          {/* Books Grid */}
          {booksData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {booksData.map(book => (
                <SmartBookCard key={book.id} book={book} variant="full" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-brand-gray/30 mx-auto mb-4" />
              <p className="text-brand-gray font-tajawal">
                لا توجد كتب حالياً. جرّب تشغيل seed data.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}


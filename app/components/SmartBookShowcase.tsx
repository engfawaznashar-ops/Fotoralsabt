'use client'

import { BookOpen, Sparkles, TrendingDown, ChevronLeft, ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  author: string
  cover?: string
  bestPrice: number
  currency: string
  retailer: string
  aiSummary: string
  categories: string[]
}

// Mock data - سيتم استبداله ببيانات حقيقية
const featuredBooks: Book[] = [
  {
    id: 'book-atomic-habits',
    title: 'العادات الذرية',
    author: 'جيمس كلير',
    cover: '/books/atomic-habits.jpg',
    bestPrice: 75.50,
    currency: 'ريال',
    retailer: 'نون',
    aiSummary: 'منهجية علمية لبناء العادات الإيجابية من خلال تغييرات صغيرة تتراكم لنتائج كبيرة',
    categories: ['تطوير ذاتي', 'إنتاجية']
  },
  {
    id: 'book-deep-work',
    title: 'العمل العميق',
    author: 'كال نيوبورت',
    cover: '/books/deep-work.jpg',
    bestPrice: 63.50,
    currency: 'ريال',
    retailer: 'أمازون',
    aiSummary: 'قواعد للنجاح المركز في عالم مشتت - كيف نعمل بعمق ونحقق نتائج استثنائية',
    categories: ['إنتاجية', 'تركيز']
  }
]

export function SmartBookShowcase() {
  return (
    <section className="section-padding bg-gradient-to-b from-brand-sand to-white relative overflow-hidden">
      {/* Pattern background */}
      <div className="absolute inset-0 pattern-dots opacity-5" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 mb-4">
            <Sparkles className="w-4 h-4 text-brand-black animate-pulse" />
            <span className="text-sm font-tajawal font-bold text-brand-black">
              مدعوم بالذكاء الاصطناعي
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-changa font-bold text-brand-black mb-3">
            الكتب الذكية 📚
          </h2>
          <p className="text-lg text-brand-gray font-tajawal max-w-2xl mx-auto">
            مقارنة الأسعار + تحليلات ذكية لأفضل الكتب
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {featuredBooks.map((book, idx) => (
            <div
              key={book.id}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-brand-yellow/20 hover:border-brand-yellow/40"
            >
              <div className="p-6">
                {/* Book header */}
                <div className="flex gap-4 mb-5">
                  {/* Cover */}
                  <div className="w-24 h-32 flex-shrink-0 bg-brand-sand rounded-xl overflow-hidden shadow-md relative">
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-brand-gray/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-changa font-bold text-brand-black mb-1 leading-tight group-hover:text-brand-yellow transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-brand-gray font-tajawal mb-3">
                      {book.author}
                    </p>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1.5">
                      {book.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="text-xs bg-brand-sand px-2 py-0.5 rounded-full font-tajawal text-brand-gray"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="mb-5 p-4 bg-brand-yellow/10 rounded-xl border border-brand-yellow/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-brand-yellow" />
                    <span className="text-xs font-tajawal font-bold text-brand-black">
                      ملخص ذكي
                    </span>
                  </div>
                  <p className="text-sm text-brand-black font-tajawal leading-relaxed">
                    {book.aiSummary}
                  </p>
                </div>

                {/* Best Price */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-brand-sand/20 rounded-xl border border-green-300/40">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-tajawal font-bold text-green-900">
                          أفضل سعر
                        </span>
                      </div>
                      <p className="text-xs text-brand-gray font-tajawal">{book.retailer}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-changa font-black text-green-700">
                        {book.bestPrice}
                      </p>
                      <p className="text-xs text-green-600">{book.currency}</p>
                    </div>
                  </div>

                  <Button asChild size="sm" className="w-full gap-2">
                    <Link href={`/books/${book.id}`}>
                      <ShoppingCart className="w-4 h-4" />
                      عرض التفاصيل والأسعار
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/books/smart">
              <BookOpen className="w-5 h-5" />
              استكشف جميع الكتب الذكية
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}


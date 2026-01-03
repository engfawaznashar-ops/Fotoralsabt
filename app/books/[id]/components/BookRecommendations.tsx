'use client'

import { BookOpen, Star, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import type { RecommendedBook } from '@/lib/api/books'

interface BookRecommendationsProps {
  recommendations: RecommendedBook[]
}

export function BookRecommendations({ recommendations }: BookRecommendationsProps) {
  if (recommendations.length === 0) {
    return null
  }

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      'تنمية ذاتية': 'bg-emerald-100 text-emerald-700',
      'قيادة': 'bg-indigo-100 text-indigo-700',
      'علم نفس': 'bg-purple-100 text-purple-700',
      'أعمال': 'bg-blue-100 text-blue-700',
      'تقنية': 'bg-slate-100 text-slate-700',
      'فلسفة': 'bg-amber-100 text-amber-700',
      'تاريخ': 'bg-orange-100 text-orange-700',
      'إنتاجية': 'bg-cyan-100 text-cyan-700',
    }
    return colors[category || ''] || 'bg-gray-100 text-gray-600'
  }

  return (
    <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-sand/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand-yellow" />
          </div>
          <div>
            <h2 className="font-changa font-bold text-xl text-brand-black">
              كتب مشابهة قد تعجبك
            </h2>
            <p className="text-sm text-brand-gray font-tajawal">
              توصيات مبنية على الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((book, index) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="group block"
            >
              <div className="h-full bg-gradient-to-b from-brand-sand/30 to-white rounded-2xl p-5 transition-all duration-300 border border-brand-sand hover:border-brand-yellow/30 hover:shadow-warm relative overflow-hidden">
                {/* Recommendation Score Badge */}
                <div className="absolute top-3 left-3">
                  <div className="bg-brand-yellow/20 text-brand-black text-xs font-changa font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {Math.round(book.score * 100)}%
                  </div>
                </div>

                {/* Book Icon */}
                <div className="w-16 h-20 mx-auto mb-4 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-8 h-8 text-brand-yellow" />
                </div>

                {/* Category */}
                {book.category && (
                  <div className="text-center mb-2">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-tajawal ${getCategoryColor(book.category)}`}>
                      {book.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="font-changa font-bold text-brand-black text-center mb-1 group-hover:text-brand-yellow transition-colors line-clamp-2">
                  {book.titleAr || book.title}
                </h3>

                {/* Author */}
                <p className="text-sm text-brand-gray font-tajawal text-center mb-3">
                  {book.author}
                </p>

                {/* Rating */}
                {book.rating && (
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.round(book.rating || 0)
                            ? 'fill-brand-yellow text-brand-yellow'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Reason */}
                <p className="text-xs text-brand-gray/80 font-tajawal text-center line-clamp-2 mb-4">
                  {book.reasonAr || book.reason}
                </p>

                {/* Action Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1.5 group-hover:bg-brand-yellow group-hover:text-brand-black transition-colors"
                >
                  عرض الكتاب
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BookRecommendations




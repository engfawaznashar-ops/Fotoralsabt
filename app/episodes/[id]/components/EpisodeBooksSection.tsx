'use client'

import { BookOpen, Star, ArrowLeft, Play, Sparkles } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import type { EpisodeBook } from '@/lib/api/episodes'

interface EpisodeBooksSectionProps {
  books: EpisodeBook[]
  className?: string
}

export function EpisodeBooksSection({ books, className }: EpisodeBooksSectionProps) {
  if (books.length === 0) return null

  return (
    <section className={cn('py-12 lg:py-16', className)}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl font-changa font-bold text-brand-black">
                الكتب المذكورة
              </h2>
              <p className="text-sm text-brand-gray font-tajawal">
                {books.length} كتاب ذُكر في هذه الحلقة
              </p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <a href="/books">
              تصفح جميع الكتب
              <ArrowLeft className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <a
              key={book.id}
              href={`/books/${book.id}`}
              className="group bg-white rounded-2xl p-5 shadow-card border border-brand-sand hover:shadow-card-hover hover:border-brand-yellow/30 transition-all duration-300"
            >
              <div className="flex gap-4">
                {/* Book Cover */}
                <div className="flex-shrink-0 w-20 h-28 bg-gradient-to-br from-brand-yellow/30 to-brand-sand rounded-xl flex items-center justify-center overflow-hidden">
                  {book.aiCoverUrl ? (
                    <img 
                      src={book.aiCoverUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-brand-gray/50" />
                  )}
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-changa font-bold text-brand-black mb-1 line-clamp-2 group-hover:text-brand-gray transition-colors">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-sm text-brand-gray font-tajawal mb-2">
                      {book.author}
                    </p>
                  )}
                  
                  {/* Category & Rating */}
                  <div className="flex flex-wrap items-center gap-2">
                    {book.category && (
                      <span className="text-xs px-2 py-0.5 bg-brand-sand rounded-full text-brand-gray">
                        {book.category}
                      </span>
                    )}
                    {book.rating && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-current" />
                        {book.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <p className="mt-3 text-sm text-brand-gray font-tajawal line-clamp-2">
                  {book.description}
                </p>
              )}

              {/* AI Badge & Action */}
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-brand-gray">
                  <Sparkles className="w-3 h-3" />
                  AI ملخص متوفر
                </span>
                <button className="inline-flex items-center gap-1 text-xs text-brand-black font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3" />
                  استمع للمقطع
                </button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EpisodeBooksSection


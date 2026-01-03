'use client'

import { BookOpen, Star, StarHalf, Mic, MessageCircle, Users } from 'lucide-react'
import { AiBadge, CategoryBadge } from './AiBadge'
import { StatPill } from './StatPill'
import type { FullBook } from '@/lib/api/books'

interface BookHeroProps {
  book: FullBook
  episodeCount: number
  quoteCount: number
  speakerCount: number
}

export function BookHero({ book, episodeCount, quoteCount, speakerCount }: BookHeroProps) {
  const renderStars = (rating: number | null) => {
    const rate = rating || 0
    const stars = []
    const fullStars = Math.floor(rate)
    const hasHalf = rate % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 fill-brand-yellow text-brand-yellow"
          />
        )
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <StarHalf
            key={i}
            className="w-5 h-5 fill-brand-yellow text-brand-yellow"
          />
        )
      } else {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 fill-gray-200 text-gray-200"
          />
        )
      }
    }

    return stars
  }

  return (
    <section className="relative overflow-hidden bg-white rounded-3xl shadow-warm-lg border border-brand-sand/50">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-brand-yellow/5 via-transparent to-brand-sand/30 pointer-events-none" />
      
      <div className="relative grid md:grid-cols-3 gap-0">
        {/* Book Cover Side */}
        <div className="relative bg-gradient-to-br from-brand-yellow to-brand-yellow/80 min-h-[320px] flex items-center justify-center p-8">
          {/* Pattern Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Book Visual */}
          <div className="relative group">
            {/* Book Shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/20 rounded-full blur-xl" />
            
            {/* Book Cover */}
            {book.aiCoverUrl ? (
              <div className="relative w-36 h-52 rounded-xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                <img
                  src={book.aiCoverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-36 h-52 bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                {/* Book spine effect */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
                
                <BookOpen className="w-16 h-16 text-brand-yellow mb-2" />
                <p className="text-xs text-brand-gray font-tajawal px-4 text-center line-clamp-2">
                  {book.title}
                </p>
              </div>
            )}

            {/* Floating AI Badge */}
            <div className="absolute -top-3 -right-3 animate-bounce-slow">
              <AiBadge text="AI" variant="glow" size="sm" icon="sparkles" />
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="md:col-span-2 p-6 lg:p-8 flex flex-col justify-center">
          {/* Category & AI Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {book.category && (
              <CategoryBadge category={book.category} size="md" />
            )}
            <AiBadge text="ملخص الذكاء الاصطناعي" variant="subtle" size="sm" />
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-changa font-bold text-brand-black mb-2 leading-tight">
            {book.title}
          </h1>

          {/* Author */}
          {book.author && (
            <p className="text-lg text-brand-gray font-tajawal mb-4 flex items-center gap-2">
              <span className="text-brand-yellow">✎</span>
              {book.author}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {renderStars(book.rating)}
            </div>
            {book.rating && (
              <span className="text-sm text-brand-gray font-tajawal">
                ({book.rating.toFixed(1)}/5)
              </span>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <p className="text-brand-gray font-tajawal leading-relaxed mb-6 line-clamp-3">
              {book.description}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex flex-wrap gap-3">
            <StatPill
              icon={Mic}
              value={episodeCount}
              label="حلقة ناقشته"
              variant="highlight"
              size="sm"
            />
            <StatPill
              icon={MessageCircle}
              value={quoteCount}
              label="اقتباس مرتبط"
              variant="default"
              size="sm"
            />
            <StatPill
              icon={Users}
              value={speakerCount}
              label="متحدث ذكره"
              variant="default"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-1 bg-gradient-to-l from-brand-yellow via-brand-yellow/50 to-transparent" />
    </section>
  )
}

export default BookHero




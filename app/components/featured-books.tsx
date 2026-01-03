'use client'

import { BookOpen, Star, ArrowLeft, Headphones, Zap } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { AiExtractedBadge } from './ui/ai-badge'
import type { Book, BookCategory } from '@/types'

interface ExtendedBook extends Book {
  rating?: number
  category?: BookCategory
  mentionedInEpisode?: string
  mentionedAtTime?: string
}

// Mock data with extended fields
const mockBooks: ExtendedBook[] = [
  {
    id: '1',
    title: 'العادات الذرية',
    author: 'جيمس كلير',
    description: 'تغييرات صغيرة، نتائج مذهلة. كتاب يغير طريقة تفكيرك في العادات.',
    rating: 5,
    category: 'تنمية ذاتية',
    mentionedInEpisode: 'الحلقة 156',
    mentionedAtTime: '05:30',
  },
  {
    id: '2',
    title: 'التفكير السريع والبطيء',
    author: 'دانيال كانيمان',
    description: 'رحلة في أعماق العقل البشري وكيفية اتخاذ القرارات.',
    rating: 5,
    category: 'علم نفس',
    mentionedInEpisode: 'الحلقة 150',
    mentionedAtTime: '12:45',
  },
  {
    id: '3',
    title: 'ابدأ بلماذا',
    author: 'سايمون سينك',
    description: 'كيف يلهم القادة العظماء الجميع لاتخاذ الإجراءات.',
    rating: 4,
    category: 'قيادة',
    mentionedInEpisode: 'الحلقة 148',
    mentionedAtTime: '08:20',
  },
  {
    id: '4',
    title: 'قوة العادات',
    author: 'تشارلز دويج',
    description: 'لماذا نفعل ما نفعله في الحياة والعمل.',
    rating: 4,
    category: 'تنمية ذاتية',
    mentionedInEpisode: 'الحلقة 145',
    mentionedAtTime: '15:00',
  },
  {
    id: '5',
    title: 'الأب الغني والأب الفقير',
    author: 'روبرت كيوساكي',
    description: 'ما يعلمه الأغنياء لأبنائهم ولا يعلمه الفقراء.',
    rating: 4,
    category: 'أعمال',
    mentionedInEpisode: 'الحلقة 142',
    mentionedAtTime: '22:30',
  },
  {
    id: '6',
    title: 'فن اللامبالاة',
    author: 'مارك مانسون',
    description: 'لعيش حياة تخالف المألوف.',
    rating: 4,
    category: 'فلسفة',
    mentionedInEpisode: 'الحلقة 140',
    mentionedAtTime: '10:15',
  },
]

const categoryColors: Record<BookCategory, string> = {
  'تنمية ذاتية': 'bg-emerald-100 text-emerald-700',
  'قيادة': 'bg-purple-100 text-purple-700',
  'علم نفس': 'bg-blue-100 text-blue-700',
  'أعمال': 'bg-orange-100 text-orange-700',
  'تقنية': 'bg-cyan-100 text-cyan-700',
  'فلسفة': 'bg-indigo-100 text-indigo-700',
  'تاريخ': 'bg-amber-100 text-amber-700',
  'إنتاجية': 'bg-rose-100 text-rose-700',
}

interface FeaturedBooksProps {
  books?: ExtendedBook[]
}

export function FeaturedBooks({ books = mockBooks }: FeaturedBooksProps) {
  const handleListenToMention = (episodeId: string, time: string) => {
    console.log(`Navigate to episode ${episodeId} at time ${time}`)
    // In production: router.push(`/episodes/${episodeId}#t=${time}`)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-changa font-bold text-brand-black">الكتب المميزة</h2>
              <p className="text-sm text-brand-gray font-tajawal">أحدث الكتب التي ناقشناها</p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2 group hidden sm:flex">
            جميع الكتب
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.slice(0, 6).map((book, index) => (
            <Card
              key={book.id}
              className="group cursor-pointer overflow-hidden animate-fade-in hover:shadow-card-hover transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* Book Cover Placeholder */}
                <div className="relative h-44 bg-gradient-to-br from-brand-yellow to-brand-yellow/60 flex items-center justify-center overflow-hidden">
                  {/* Pattern Background */}
                  <div className="absolute inset-0 pattern-grid opacity-20" />
                  
                  {/* AI Extracted Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <AiExtractedBadge />
                  </div>
                  
                  {/* Book Icon */}
                  <div className="relative z-10 w-18 h-24 bg-white rounded-lg shadow-warm flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-8 h-8 text-brand-yellow" />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/10 transition-colors duration-300" />
                </div>

                {/* Book Info */}
                <div className="p-5">
                  {/* Rating & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= (book.rating || 0) 
                              ? 'fill-brand-yellow text-brand-yellow' 
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {book.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-tajawal ${categoryColors[book.category]}`}>
                        {book.category}
                      </span>
                    )}
                  </div>

                  {/* Title & Author */}
                  <h3 className="font-changa font-bold text-lg text-brand-black mb-1 group-hover:text-brand-yellow transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-brand-gray font-tajawal mb-2">
                    {book.author}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-brand-gray/80 font-tajawal line-clamp-2 mb-4">
                    {book.description}
                  </p>

                  {/* Listen Button */}
                  {book.mentionedInEpisode && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full gap-2 text-brand-yellow hover:bg-brand-yellow/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleListenToMention(book.mentionedInEpisode!, book.mentionedAtTime || '00:00')
                      }}
                    >
                      <Headphones className="w-4 h-4" />
                      <span className="text-xs">استمع للمقطع الذي ذُكر فيه</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <Button variant="ghost" className="gap-2 group">
            جميع الكتب
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}

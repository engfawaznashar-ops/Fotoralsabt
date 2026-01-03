'use client'

import { useState } from 'react'
import { BookOpen, Star, Filter, ChevronLeft, Mic } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { PageHeader, SearchFilterBar } from '@/app/components/page-header'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { AiExtractedBadge } from '@/app/components/ui/ai-badge'
import type { BookCategory } from '@/types'

// Mock data
const mockBooks = [
  {
    id: '1',
    title: 'العادات الذرية',
    author: 'جيمس كلير',
    rating: 5,
    category: 'تنمية ذاتية' as BookCategory,
    episodeCount: 5,
    description: 'تغييرات صغيرة، نتائج مذهلة',
  },
  {
    id: '2',
    title: 'التفكير السريع والبطيء',
    author: 'دانيال كانيمان',
    rating: 5,
    category: 'علم نفس' as BookCategory,
    episodeCount: 3,
    description: 'رحلة في أعماق العقل البشري',
  },
  {
    id: '3',
    title: 'ابدأ بلماذا',
    author: 'سايمون سينك',
    rating: 4,
    category: 'قيادة' as BookCategory,
    episodeCount: 4,
    description: 'كيف يلهم القادة العظماء',
  },
  {
    id: '4',
    title: 'قوة العادات',
    author: 'تشارلز دويج',
    rating: 4,
    category: 'تنمية ذاتية' as BookCategory,
    episodeCount: 2,
    description: 'لماذا نفعل ما نفعله',
  },
  {
    id: '5',
    title: 'الأب الغني والأب الفقير',
    author: 'روبرت كيوساكي',
    rating: 4,
    category: 'أعمال' as BookCategory,
    episodeCount: 3,
    description: 'ما يعلمه الأغنياء لأبنائهم',
  },
  {
    id: '6',
    title: 'فن اللامبالاة',
    author: 'مارك مانسون',
    rating: 4,
    category: 'فلسفة' as BookCategory,
    episodeCount: 2,
    description: 'لعيش حياة تخالف المألوف',
  },
  {
    id: '7',
    title: 'الذكاء العاطفي',
    author: 'دانيال جولمان',
    rating: 5,
    category: 'علم نفس' as BookCategory,
    episodeCount: 4,
    description: 'لماذا قد يكون أهم من الذكاء العقلي',
  },
  {
    id: '8',
    title: 'العقلية',
    author: 'كارول دويك',
    rating: 5,
    category: 'تنمية ذاتية' as BookCategory,
    episodeCount: 2,
    description: 'سيكولوجية النجاح الجديدة',
  },
  {
    id: '9',
    title: 'العادات السبع',
    author: 'ستيفن كوفي',
    rating: 5,
    category: 'قيادة' as BookCategory,
    episodeCount: 6,
    description: 'للناس الأكثر فعالية',
  },
]

const categoryFilters = ['الكل', 'تنمية ذاتية', 'قيادة', 'علم نفس', 'أعمال', 'فلسفة', 'تقنية']

const categoryColors: Record<string, string> = {
  'تنمية ذاتية': 'bg-emerald-100 text-emerald-700',
  'قيادة': 'bg-purple-100 text-purple-700',
  'علم نفس': 'bg-blue-100 text-blue-700',
  'أعمال': 'bg-orange-100 text-orange-700',
  'فلسفة': 'bg-indigo-100 text-indigo-700',
  'تقنية': 'bg-cyan-100 text-cyan-700',
}

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('الكل')

  const filteredBooks = mockBooks.filter(book => {
    if (searchQuery && !book.title.includes(searchQuery) && !book.author.includes(searchQuery)) return false
    if (activeCategory !== 'الكل' && book.category !== activeCategory) return false
    return true
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <PageHeader
            title="جميع الكتب"
            subtitle={`${mockBooks.length} كتاب تم مناقشتها في حلقاتنا`}
            icon={<BookOpen className="w-6 h-6 text-brand-black" />}
          />

          {/* Search & Filters */}
          <SearchFilterBar
            searchPlaceholder="ابحث عن كتاب أو مؤلف..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filters={
              <>
                <Filter className="w-4 h-4 text-brand-gray" />
                {categoryFilters.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-tajawal transition-all ${
                      activeCategory === cat
                        ? 'bg-brand-yellow text-brand-black'
                        : 'bg-white text-brand-gray border border-brand-sand hover:border-brand-yellow'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </>
            }
          />

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <a
                key={book.id}
                href={`/books/${book.id}`}
                className="block"
              >
                <Card
                  className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    {/* Book Cover */}
                    <div className="relative h-40 bg-gradient-to-br from-brand-yellow to-brand-yellow/60 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 pattern-grid opacity-20" />
                      
                      {/* AI Badge */}
                      <div className="absolute top-3 left-3">
                        <AiExtractedBadge />
                      </div>
                      
                      {/* Book Icon */}
                      <div className="relative z-10 w-16 h-22 bg-white rounded-lg shadow-warm flex items-center justify-center transform group-hover:scale-105 transition-transform">
                        <BookOpen className="w-8 h-8 text-brand-yellow" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Rating & Category */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= book.rating 
                                  ? 'fill-brand-yellow text-brand-yellow' 
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-tajawal ${categoryColors[book.category] || 'bg-gray-100 text-gray-700'}`}>
                          {book.category}
                        </span>
                      </div>

                      {/* Title & Author */}
                      <h3 className="font-changa font-bold text-lg text-brand-black mb-1 group-hover:text-brand-yellow transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-brand-gray font-tajawal mb-2">
                        {book.author}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-brand-gray/70 font-tajawal mb-4 line-clamp-2">
                        {book.description}
                      </p>

                      {/* Episode Count */}
                      <div className="flex items-center gap-2 text-brand-gray">
                        <Mic className="w-4 h-4 text-brand-yellow" />
                        <span className="text-sm font-tajawal">{book.episodeCount} حلقات تحدثت عنه</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="gap-2">
              تحميل المزيد
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}




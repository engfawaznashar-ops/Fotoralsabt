'use client'

import { useState } from 'react'
import { Play, Calendar, Clock, BookOpen, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { MoodBadge } from './ui/mood-badge'
import Link from 'next/link'

interface Episode {
  id: string
  title: string
  episodeNumber: number
  date: string
  duration: number
  mood?: string
  summary: string
  topics: string[]
  booksCount: number
  speakersCount: number
  aiRecommendScore?: number
}

// Mock data - حلقات مقترحة بناءً على AI
const recommendedEpisodes: Episode[] = [
  {
    id: '1',
    title: 'كيف تبني عادات تدوم؟',
    episodeNumber: 156,
    date: '2026-01-03',
    duration: 45,
    mood: 'تحفيزي',
    summary: 'مناقشة عميقة لكتاب العادات الذرية وكيف نطبق مبادئه في حياتنا اليومية',
    topics: ['عادات', 'تطوير', 'إنتاجية'],
    booksCount: 3,
    speakersCount: 2,
    aiRecommendScore: 95
  },
  {
    id: '2',
    title: 'قوة التركيز في عصر التشتيت',
    episodeNumber: 142,
    date: '2025-12-20',
    duration: 52,
    mood: 'معرفي',
    summary: 'نستعرض أفكار كتاب العمل العميق ونناقش استراتيجيات عملية للتركيز',
    topics: ['تركيز', 'عمل عميق', 'إنتاجية'],
    booksCount: 2,
    speakersCount: 3,
    aiRecommendScore: 88
  },
  {
    id: '3',
    title: 'فن الانضباط الذاتي',
    episodeNumber: 128,
    date: '2025-12-06',
    duration: 38,
    mood: 'تحليلي',
    summary: 'كيف نبني الانضباط الذاتي ونحافظ عليه في رحلة التطوير المستمر',
    topics: ['انضباط', 'عادات', 'قوة إرادة'],
    booksCount: 2,
    speakersCount: 1,
    aiRecommendScore: 82
  },
  {
    id: '4',
    title: 'القراءة العميقة: كيف نقرأ بفعالية',
    episodeNumber: 139,
    date: '2025-11-22',
    duration: 41,
    mood: 'معرفي',
    summary: 'نناقش طرق القراءة الفعالة وكيف نستوعب ونطبق ما نقرأ',
    topics: ['قراءة', 'تعلم', 'معرفة'],
    booksCount: 4,
    speakersCount: 2,
    aiRecommendScore: 79
  }
]

export function RecommendedEpisodes() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const episodesPerView = 3
  const maxIndex = Math.max(0, recommendedEpisodes.length - episodesPerView)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  const visibleEpisodes = recommendedEpisodes.slice(currentIndex, currentIndex + episodesPerView)

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sand/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-warm">
              <TrendingUp className="w-6 h-6 text-brand-black" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-changa font-bold text-brand-black">
                حلقات مقترحة لك
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                <p className="text-sm text-brand-gray font-tajawal">
                  مختارة بعناية بناءً على اهتماماتك
                </p>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="w-10 h-10 bg-brand-sand hover:bg-brand-yellow/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all"
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5 text-brand-black" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 bg-brand-sand hover:bg-brand-yellow/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all"
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5 text-brand-black" />
            </button>
          </div>
        </div>

        {/* Episodes Carousel */}
        <div className="overflow-hidden mb-8">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${currentIndex * -100 / episodesPerView}%)` }}
          >
            {recommendedEpisodes.map((episode, idx) => (
              <Link
                key={episode.id}
                href={`/episodes/${episode.id}`}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-brand-yellow/30">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Episode Number + AI Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-2 bg-brand-black text-white px-3 py-1.5 rounded-full">
                        <Play className="w-3 h-3" />
                        <span className="text-sm font-tajawal">#{episode.episodeNumber}</span>
                      </div>
                      {episode.aiRecommendScore && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-brand-yellow/20 rounded-full">
                          <Sparkles className="w-3 h-3 text-brand-yellow" />
                          <span className="text-xs font-tajawal text-brand-black font-bold">
                            {episode.aiRecommendScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-changa font-bold text-brand-black mb-3 group-hover:text-brand-yellow transition-colors leading-tight">
                      {episode.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-brand-gray font-tajawal leading-relaxed mb-4 line-clamp-2 flex-grow">
                      {episode.summary}
                    </p>

                    {/* Mood */}
                    {episode.mood && (
                      <div className="mb-4">
                        <MoodBadge mood={episode.mood as any} />
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-brand-gray font-tajawal mb-4 pb-4 border-b border-brand-sand">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{episode.duration} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{episode.booksCount} كتب</span>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1.5">
                      {episode.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="text-xs bg-brand-sand px-2 py-1 rounded-full font-tajawal text-brand-gray"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex 
                  ? 'w-8 bg-brand-yellow' 
                  : 'w-2 bg-brand-sand hover:bg-brand-yellow/30'
              }`}
              aria-label={`الذهاب إلى المجموعة ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/episodes">
              جميع الحلقات
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}


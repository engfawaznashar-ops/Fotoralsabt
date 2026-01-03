'use client'

import { useState, useEffect } from 'react'
import { Newspaper, BookOpen, Users, MessageCircle, ArrowLeft, Calendar, Download, Star, Award, Lightbulb } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { AiBadge } from './ui/ai-badge'
import type { Book, Speaker, Quote } from '@/types'

interface DigestItem {
  id: string
  type: 'book' | 'speaker' | 'quote'
  title: string
  subtitle?: string
  description?: string
}

// Mock data
const mockDigest: DigestItem[] = [
  { id: '1', type: 'book', title: 'العادات الذرية', subtitle: 'جيمس كلير', description: 'تغييرات صغيرة، نتائج مذهلة' },
  { id: '2', type: 'book', title: 'التفكير السريع والبطيء', subtitle: 'دانيال كانيمان', description: 'رحلة في أعماق العقل' },
  { id: '3', type: 'book', title: 'ابدأ بلماذا', subtitle: 'سايمون سينك', description: 'كيف يلهم القادة العظماء' },
  { id: '4', type: 'speaker', title: 'أحمد السالم', subtitle: 'خبير التنمية البشرية', description: '12 حلقة' },
  { id: '5', type: 'speaker', title: 'سارة الخالد', subtitle: 'كاتبة ومؤلفة', description: '8 حلقات' },
  { id: '6', type: 'speaker', title: 'محمد العتيبي', subtitle: 'رائد أعمال', description: '15 حلقة' },
  { id: '7', type: 'quote', title: 'النجاح ليس وجهة نهائية، بل رحلة مستمرة من التعلم والنمو.', subtitle: 'أحمد السالم' },
  { id: '8', type: 'quote', title: 'العادات الصغيرة تشكل مصيرنا', subtitle: 'العادات الذرية' },
  { id: '9', type: 'quote', title: 'القراءة مفتاح العوالم', subtitle: 'سارة الخالد' },
]

// Featured items for "of the week"
const weeklyHighlights = {
  bookOfWeek: {
    title: 'العادات الذرية',
    author: 'جيمس كلير',
    description: 'الكتاب الأكثر مناقشة هذا الأسبوع',
    rating: 5,
  },
  speakerOfWeek: {
    name: 'أحمد السالم',
    title: 'خبير التنمية البشرية',
    insight: 'أكثر متحدث تفاعلاً',
  },
  ideaOfWeek: 'التغييرات الصغيرة المتراكمة تؤدي إلى نتائج استثنائية - ركّز على تحسين 1% يومياً بدلاً من التغييرات الجذرية.',
}

interface WeeklyDigestProps {
  items?: DigestItem[]
}

export function WeeklyDigest({ items = mockDigest }: WeeklyDigestProps) {
  const [currentDate, setCurrentDate] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCurrentDate(
      new Intl.DateTimeFormat('ar-SA', { month: 'long', day: 'numeric' }).format(new Date())
    )
  }, [])

  const books = items.filter((i) => i.type === 'book').slice(0, 3)
  const speakers = items.filter((i) => i.type === 'speaker').slice(0, 3)
  const quotes = items.filter((i) => i.type === 'quote').slice(0, 3)

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  }

  const handleDownloadPdf = () => {
    console.log('Generating weekly PDF digest...')
    // In production: call API to generate PDF
    alert('سيتم تحميل ملخص الأسبوع قريباً!')
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-brand-sand relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pattern-grid opacity-30" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-changa font-bold text-brand-black">الملخص الأسبوعي</h2>
              <p className="text-sm text-brand-gray font-tajawal">أبرز محتوى هذا الأسبوع</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-brand-gray">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-tajawal">
                {mounted ? currentDate : ''}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleDownloadPdf}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">تحميل الملخص PDF</span>
            </Button>
          </div>
        </div>

        {/* Weekly Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Book of the Week */}
          <Card className="bg-white border-none shadow-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-brand-yellow" />
                <span className="text-xs font-tajawal text-brand-gray">كتاب الأسبوع</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-18 bg-brand-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-brand-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-changa font-bold text-brand-black truncate">{weeklyHighlights.bookOfWeek.title}</h4>
                  <p className="text-xs text-brand-gray font-tajawal">{weeklyHighlights.bookOfWeek.author}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-brand-yellow text-brand-yellow" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Speaker of the Week */}
          <Card className="bg-white border-none shadow-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-brand-yellow" />
                <span className="text-xs font-tajawal text-brand-gray">متحدث الأسبوع</span>
                <AiBadge text="AI" variant="subtle" icon="sparkles" className="mr-auto" />
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 ring-2 ring-brand-yellow/30">
                  <AvatarFallback className="bg-brand-yellow text-brand-black">
                    {getInitials(weeklyHighlights.speakerOfWeek.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-changa font-bold text-brand-black truncate">{weeklyHighlights.speakerOfWeek.name}</h4>
                  <p className="text-xs text-brand-gray font-tajawal">{weeklyHighlights.speakerOfWeek.title}</p>
                  <p className="text-xs text-brand-yellow font-tajawal mt-1">{weeklyHighlights.speakerOfWeek.insight}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Idea of the Week */}
          <Card className="bg-white border-none shadow-card overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-brand-yellow" />
                <span className="text-xs font-tajawal text-brand-gray">فكرة الأسبوع</span>
              </div>
              <p className="text-sm font-tajawal text-brand-black leading-relaxed line-clamp-4">
                {weeklyHighlights.ideaOfWeek}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Digest Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Books Column */}
          <Card className="bg-white border-none shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="w-5 h-5 text-brand-yellow" />
                <h3 className="font-changa font-bold text-lg text-brand-black">الكتب</h3>
                <span className="text-xs bg-brand-yellow/20 px-2 py-0.5 rounded-full text-brand-gray mr-auto">
                  {books.length} كتب
                </span>
              </div>
              <div className="space-y-4">
                {books.map((book, index) => (
                  <div key={book.id}>
                    <div className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-11 h-14 bg-brand-sand rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-brand-yellow" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-changa font-bold text-brand-black group-hover:text-brand-yellow transition-colors truncate text-sm">
                          {book.title}
                        </p>
                        <p className="text-xs text-brand-gray font-tajawal">{book.subtitle}</p>
                        <p className="text-xs text-brand-gray/60 font-tajawal mt-0.5">{book.description}</p>
                      </div>
                    </div>
                    {index < books.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 gap-2 group text-sm">
                عرض الكل
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Speakers Column */}
          <Card className="bg-white border-none shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-5 h-5 text-brand-yellow" />
                <h3 className="font-changa font-bold text-lg text-brand-black">المتحدثون</h3>
                <span className="text-xs bg-brand-yellow/20 px-2 py-0.5 rounded-full text-brand-gray mr-auto">
                  {speakers.length} متحدثين
                </span>
              </div>
              <div className="space-y-4">
                {speakers.map((speaker, index) => (
                  <div key={speaker.id}>
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <Avatar className="w-11 h-11">
                        <AvatarFallback className="text-sm bg-brand-sand">
                          {getInitials(speaker.title)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-changa font-bold text-brand-black group-hover:text-brand-yellow transition-colors truncate text-sm">
                          {speaker.title}
                        </p>
                        <p className="text-xs text-brand-gray font-tajawal">{speaker.subtitle}</p>
                        <p className="text-xs text-brand-gray/60 font-tajawal">{speaker.description}</p>
                      </div>
                    </div>
                    {index < speakers.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 gap-2 group text-sm">
                عرض الكل
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Quotes Column */}
          <Card className="bg-white border-none shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle className="w-5 h-5 text-brand-yellow" />
                <h3 className="font-changa font-bold text-lg text-brand-black">الاقتباسات</h3>
                <span className="text-xs bg-brand-yellow/20 px-2 py-0.5 rounded-full text-brand-gray mr-auto">
                  {quotes.length} اقتباسات
                </span>
              </div>
              <div className="space-y-4">
                {quotes.map((quote, index) => (
                  <div key={quote.id}>
                    <div className="group cursor-pointer">
                      <div className="text-2xl text-brand-yellow/40 font-changa leading-none">"</div>
                      <p className="font-tajawal text-brand-black text-sm leading-relaxed mt-1 group-hover:text-brand-yellow transition-colors line-clamp-2">
                        {quote.title}
                      </p>
                      <p className="text-xs text-brand-gray/60 font-tajawal mt-2">
                        — {quote.subtitle}
                      </p>
                    </div>
                    {index < quotes.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 gap-2 group text-sm">
                عرض الكل
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

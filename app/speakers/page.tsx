'use client'

import { useState } from 'react'
import { Users, Mic, BookOpen, TrendingUp, ChevronLeft, ExternalLink, Brain, Map } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { PageHeader, SearchFilterBar } from '@/app/components/page-header'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import type { AIPersona } from '@/types'

// X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Mock data with enhanced details
const mockSpeakers = [
  {
    id: '1',
    name: 'أحمد السالم',
    bio: 'خبير في التنمية البشرية والقيادة',
    aiPersona: 'قيادي' as AIPersona,
    episodeCount: 12,
    booksCount: 8,
    topTopic: 'القيادة والتأثير',
    twitterHandle: 'ahmed_alsalem',
    aiInsights: [
      'يركز على التطوير القيادي المستدام',
      'خبرة 15 عامًا في تدريب القادة',
      'مؤلف 3 كتب في القيادة'
    ]
  },
  {
    id: '2',
    name: 'سارة الخالد',
    bio: 'كاتبة ومؤلفة متخصصة في علم النفس',
    aiPersona: 'إبداعي' as AIPersona,
    episodeCount: 8,
    booksCount: 5,
    topTopic: 'الذكاء العاطفي',
    twitterHandle: 'sara_khaled',
    aiInsights: [
      'تدمج الفن بعلم النفس في تحليلاتها',
      'باحثة دكتوراه في الذكاء العاطفي',
      'كاتبة عمود أسبوعي عن الوعي الذاتي'
    ]
  },
  {
    id: '3',
    name: 'محمد العتيبي',
    bio: 'رائد أعمال ومستثمر',
    aiPersona: 'استراتيجي' as AIPersona,
    episodeCount: 15,
    booksCount: 12,
    topTopic: 'ريادة الأعمال',
    twitterHandle: 'mohammed_otaibi',
    aiInsights: [
      'أسس 5 شركات ناشئة ناجحة',
      'مستثمر في أكثر من 20 مشروع تقني',
      'يركز على الاستراتيجية طويلة المدى'
    ]
  },
  {
    id: '4',
    name: 'نورة القحطاني',
    bio: 'باحثة في التعليم والتطوير',
    aiPersona: 'تحليلي' as AIPersona,
    episodeCount: 6,
    booksCount: 4,
    topTopic: 'التعليم المستمر',
    aiInsights: [
      'متخصصة في تصميم المناهج التعليمية',
      'باحثة في طرق التعلم الحديثة',
      'مستشارة تربوية لـ15 مؤسسة'
    ]
  },
  {
    id: '5',
    name: 'عبدالله الفيصل',
    bio: 'متخصص في التقنية والابتكار',
    aiPersona: 'تقني' as AIPersona,
    episodeCount: 10,
    booksCount: 7,
    topTopic: 'الذكاء الاصطناعي',
    twitterHandle: 'abdullah_faisal',
    aiInsights: [
      'مهندس ذكاء اصطناعي في شركة عالمية',
      'متحدث رئيسي في 20+ مؤتمر تقني',
      'يبسّط التقنية المعقدة للجمهور العام'
    ]
  },
  {
    id: '6',
    name: 'لمياء الحربي',
    bio: 'خبيرة في الصحة النفسية',
    aiPersona: 'تحفيزي' as AIPersona,
    episodeCount: 7,
    booksCount: 6,
    topTopic: 'الصحة النفسية',
    twitterHandle: 'lamya_harbi',
    aiInsights: [
      'معالجة نفسية معتمدة لـ10 سنوات',
      'تقدم جلسات توعية مجانية شهريًا',
      'متخصصة في العلاج المعرفي السلوكي'
    ]
  },
]

const personaColors: Record<AIPersona, string> = {
  'تحليلي': 'bg-blue-100 text-blue-700 border-blue-200',
  'تحفيزي': 'bg-orange-100 text-orange-700 border-orange-200',
  'قيادي': 'bg-purple-100 text-purple-700 border-purple-200',
  'تقني': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'إبداعي': 'bg-pink-100 text-pink-700 border-pink-200',
  'استراتيجي': 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

export default function SpeakersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const filteredSpeakers = mockSpeakers.filter(speaker => {
    if (searchQuery && !speaker.name.includes(searchQuery)) return false
    return true
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <PageHeader
            title="المتحدثون"
            subtitle={`${mockSpeakers.length} متحدث وخبير في حلقاتنا`}
            icon={<Users className="w-6 h-6 text-brand-black" />}
          />

          {/* Search */}
          <SearchFilterBar
            searchPlaceholder="ابحث عن متحدث..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Speakers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker, index) => (
              <a
                key={speaker.id}
                href={`/speakers/${speaker.id}`}
                className="block"
              >
                <Card
                  className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-20 h-20 ring-4 ring-brand-yellow/20 group-hover:ring-brand-yellow/40 transition-all">
                        <AvatarFallback className="text-2xl bg-brand-yellow text-brand-black font-changa">
                          {getInitials(speaker.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-changa font-bold text-xl text-brand-black group-hover:text-brand-yellow transition-colors">
                          {speaker.name}
                        </h3>
                        
                        {/* Twitter Handle */}
                        {speaker.twitterHandle && (
                          <a
                            href={`https://x.com/${speaker.twitterHandle}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-brand-gray hover:text-blue-600 transition-colors group/twitter"
                          >
                            <XIcon className="w-3.5 h-3.5 group-hover/twitter:translate-y-[-1px] transition-transform" />
                            <span className="group-hover/twitter:underline">@{speaker.twitterHandle}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/twitter:opacity-100 transition-opacity" />
                          </a>
                        )}
                        
                        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border mt-2 ${personaColors[speaker.aiPersona]}`}>
                          {speaker.aiPersona}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-brand-gray font-tajawal mb-4 line-clamp-2 leading-relaxed">
                      {speaker.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-brand-gray">
                        <Mic className="w-4 h-4 text-brand-yellow" />
                        <span className="text-sm font-tajawal">{speaker.episodeCount} حلقة</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-brand-gray">
                        <BookOpen className="w-4 h-4 text-brand-yellow" />
                        <span className="text-sm font-tajawal">{speaker.booksCount} كتاب</span>
                      </div>
                    </div>

                    {/* AI Insights - Bullet Points */}
                    {speaker.aiInsights && speaker.aiInsights.length > 0 && (
                      <div className="bg-gradient-to-br from-brand-yellow/5 to-brand-sand/30 rounded-xl p-3 mb-4 border border-brand-yellow/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-3.5 h-3.5 text-brand-yellow" />
                          <span className="text-xs text-brand-gray font-tajawal font-medium">نظرة ذكية</span>
                        </div>
                        <ul className="space-y-1.5">
                          {speaker.aiInsights.slice(0, 3).map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs font-tajawal text-brand-gray leading-relaxed">
                              <span className="text-brand-yellow mt-0.5 flex-shrink-0">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Top Topic */}
                    <div className="bg-brand-sand/50 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-brand-yellow" />
                        <span className="text-xs text-brand-gray font-tajawal">أكثر موضوع</span>
                      </div>
                      <p className="text-sm font-tajawal text-brand-black font-medium">
                        {speaker.topTopic}
                      </p>
                    </div>

                    {/* Quick Links CTA */}
                    <div className="flex items-center gap-2 pt-3 border-t border-brand-sand">
                      <a
                        href={`/speakers/${speaker.id}/episodes`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-sand/50 hover:bg-brand-yellow/20 rounded-lg text-xs font-tajawal text-brand-gray hover:text-brand-black transition-all"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>حلقاته</span>
                      </a>
                      <a
                        href={`/speakers/${speaker.id}/books`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-sand/50 hover:bg-brand-yellow/20 rounded-lg text-xs font-tajawal text-brand-gray hover:text-brand-black transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>كتبه</span>
                      </a>
                      <a
                        href="/map"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-sand/50 hover:bg-brand-yellow/20 rounded-lg text-xs font-tajawal text-brand-gray hover:text-brand-black transition-all"
                      >
                        <Map className="w-3.5 h-3.5" />
                        <span>الخريطة</span>
                      </a>
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




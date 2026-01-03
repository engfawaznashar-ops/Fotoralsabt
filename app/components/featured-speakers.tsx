'use client'

import { Users, ArrowLeft, Quote, TrendingUp, BookOpen, Mic } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { AiBadge } from './ui/ai-badge'
import type { Speaker, AIPersona } from '@/types'

interface ExtendedSpeaker extends Speaker {
  aiPersona?: AIPersona
  episodeCount?: number
  booksCount?: number
  aiTopTopic?: string
  aiInsight?: string
}

// Mock data with extended fields
const mockSpeakers: ExtendedSpeaker[] = [
  {
    id: '1',
    name: 'أحمد السالم',
    bioAI: 'خبير في التنمية البشرية والقيادة',
    sentiment: 'إيجابي',
    aiPersona: 'قيادي',
    episodeCount: 12,
    booksCount: 8,
    aiTopTopic: 'القيادة والتأثير',
    aiInsight: 'أكثر ما تحدث عنه هذا الشهر: القيادة',
  },
  {
    id: '2',
    name: 'سارة الخالد',
    bioAI: 'كاتبة ومؤلفة متخصصة في علم النفس',
    sentiment: 'ملهم',
    aiPersona: 'إبداعي',
    episodeCount: 8,
    booksCount: 5,
    aiTopTopic: 'الذكاء العاطفي',
    aiInsight: 'تركيزها الأخير: الصحة النفسية',
  },
  {
    id: '3',
    name: 'محمد العتيبي',
    bioAI: 'رائد أعمال ومستثمر',
    sentiment: 'تحفيزي',
    aiPersona: 'استراتيجي',
    episodeCount: 15,
    booksCount: 12,
    aiTopTopic: 'ريادة الأعمال',
    aiInsight: 'الموضوع الأبرز: بناء الشركات الناشئة',
  },
  {
    id: '4',
    name: 'نورة القحطاني',
    bioAI: 'باحثة في التعليم والتطوير',
    sentiment: 'تحليلي',
    aiPersona: 'تحليلي',
    episodeCount: 6,
    booksCount: 4,
    aiTopTopic: 'التعليم المستمر',
    aiInsight: 'اهتمامها الحالي: التعلم الذاتي',
  },
  {
    id: '5',
    name: 'عبدالله الفيصل',
    bioAI: 'متخصص في التقنية والابتكار',
    sentiment: 'إيجابي',
    aiPersona: 'تقني',
    episodeCount: 10,
    booksCount: 7,
    aiTopTopic: 'الذكاء الاصطناعي',
    aiInsight: 'محوره الرئيسي: مستقبل التقنية',
  },
  {
    id: '6',
    name: 'لمياء الحربي',
    bioAI: 'خبيرة في الصحة النفسية',
    sentiment: 'هادئ',
    aiPersona: 'تحفيزي',
    episodeCount: 7,
    booksCount: 6,
    aiTopTopic: 'الصحة النفسية',
    aiInsight: 'تركيزها: الوعي والتأمل',
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

const sentimentColors: Record<string, string> = {
  'إيجابي': 'bg-green-100 text-green-700',
  'ملهم': 'bg-purple-100 text-purple-700',
  'تحفيزي': 'bg-orange-100 text-orange-700',
  'تحليلي': 'bg-blue-100 text-blue-700',
  'هادئ': 'bg-cyan-100 text-cyan-700',
}

interface FeaturedSpeakersProps {
  speakers?: ExtendedSpeaker[]
}

export function FeaturedSpeakers({ speakers = mockSpeakers }: FeaturedSpeakersProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  }

  const handleViewProfile = (speakerId: string) => {
    console.log('Navigate to speaker profile:', speakerId)
    // In production: router.push(`/speakers/${speakerId}`)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-brand-sand">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-changa font-bold text-brand-black">المتحدثون</h2>
              <p className="text-sm text-brand-gray font-tajawal">الضيوف والخبراء المميزون</p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2 group hidden sm:flex">
            جميع المتحدثين
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>

        {/* Horizontal Scroll Speakers */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-5 pb-4">
            {speakers.map((speaker, index) => (
              <div
                key={speaker.id}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header: Avatar & Info */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 ring-4 ring-brand-yellow/20 group-hover:ring-brand-yellow/40 transition-all flex-shrink-0">
                    <AvatarImage src={speaker.avatarAI} alt={speaker.name} />
                    <AvatarFallback className="text-lg bg-brand-yellow text-brand-black font-changa">
                      {getInitials(speaker.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-changa font-bold text-lg text-brand-black whitespace-normal line-clamp-1">
                      {speaker.name}
                    </h3>
                    {/* AI Persona Badge */}
                    {speaker.aiPersona && (
                      <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border mt-1 ${personaColors[speaker.aiPersona]}`}>
                        {speaker.aiPersona}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-brand-gray font-tajawal mb-4 whitespace-normal line-clamp-2">
                  {speaker.bioAI}
                </p>

                {/* Mini Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 text-brand-gray">
                    <Mic className="w-4 h-4 text-brand-yellow" />
                    <span className="font-tajawal">{speaker.episodeCount} حلقة</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-gray">
                    <BookOpen className="w-4 h-4 text-brand-yellow" />
                    <span className="font-tajawal">{speaker.booksCount} كتاب</span>
                  </div>
                </div>

                {/* AI Insight Footer */}
                {speaker.aiInsight && (
                  <div className="bg-brand-sand/70 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-yellow" />
                      <span className="text-xs text-brand-gray font-tajawal">AI Insights</span>
                    </div>
                    <p className="text-xs text-brand-black font-tajawal whitespace-normal">
                      {speaker.aiInsight}
                    </p>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  {speaker.sentiment && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sentimentColors[speaker.sentiment] || 'bg-gray-100 text-gray-700'}`}>
                      {speaker.sentiment}
                    </span>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-brand-yellow gap-1"
                    onClick={() => handleViewProfile(speaker.id)}
                  >
                    عرض تأثير المتحدث
                    <ArrowLeft className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <Button variant="ghost" className="gap-2 group">
            جميع المتحدثين
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}

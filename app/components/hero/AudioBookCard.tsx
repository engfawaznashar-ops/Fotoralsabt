'use client'

import { useState } from 'react'
import { Play, Pause, Headphones, BookOpen, Clock, Lightbulb, Users, Tag, Sparkles, MessageCircle } from 'lucide-react'
import Image from 'next/image'

// XIcon for Twitter
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Audio Visualizer Component
function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = [
    { height: 45, delay: 0, duration: 1.1 },
    { height: 75, delay: 0.1, duration: 0.9 },
    { height: 35, delay: 0.2, duration: 1.0 },
    { height: 60, delay: 0.3, duration: 0.85 },
    { height: 50, delay: 0.4, duration: 1.05 },
    { height: 70, delay: 0.5, duration: 0.95 },
    { height: 40, delay: 0.6, duration: 1.15 },
    { height: 55, delay: 0.7, duration: 0.88 },
  ]

  return (
    <div className="flex items-end justify-center gap-1 h-16">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`w-1.5 bg-brand-black/80 rounded-full transition-all ${
            isPlaying ? 'animate-wave' : ''
          }`}
          style={{
            height: isPlaying ? `${bar.height}%` : '30%',
            animationDelay: `${bar.delay}s`,
            animationDuration: `${bar.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export function AudioBookCard() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMoreInfo, setShowMoreInfo] = useState(false)

  // بيانات تحليل ذكي للحلقة
  const episodeAI = {
    booksDiscussed: 3,
    duration: '45 دقيقة',
    categories: ['تطوير ذاتي', 'إنتاجية', 'عادات'],
    participants: [
      { name: 'أحمد السالم', role: 'ضيف', xHandle: 'ahmed_alsalem' },
      { name: 'محمد المنصور', role: 'مقدم', xHandle: 'alm_podcast' }
    ],
    keyPoints: 4,
    quotes: 12
  }

  return (
    <div className="relative w-full max-w-lg group">
      {/* Enhanced Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-yellow/30 via-brand-sand/40 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300" />

      {/* Book Spine - Enlarged */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-brand-yellow via-brand-yellow/95 to-brand-yellow/90 rounded-r-3xl shadow-2xl z-10 border-l border-brand-yellow/20">
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0, 0, 0, 0.1) 4px, rgba(0, 0, 0, 0.1) 5px)`
          }}
        />
        
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-changa font-bold text-brand-black writing-mode-vertical transform rotate-180 tracking-wider">
            الحلقة #156
          </p>
          <div className="w-0.5 h-16 bg-brand-black/20" />
          <BookOpen className="w-5 h-5 text-brand-black/60" />
          <Sparkles className="w-4 h-4 text-brand-black/40" />
        </div>
      </div>

      {/* Main Card - Expanded with Watermarks */}
      <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-7 pr-24 shadow-2xl border-2 border-brand-yellow/30 paper-texture group-hover:shadow-3xl group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        {/* Book & AI Watermarks */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
          {/* Books watermark - top right */}
          <svg className="absolute top-4 left-4 w-16 h-16 text-brand-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
          </svg>
          
          {/* AI Sparkles - bottom left */}
          <svg className="absolute bottom-6 left-6 w-12 h-12 text-brand-yellow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L9.5 9.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
          </svg>
          
          {/* Headphones - center */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-brand-sand" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h2a1 1 0 001-1v-5a1 1 0 00-1-1H5v-2a7 7 0 0114 0v2h-2a1 1 0 00-1 1v5a1 1 0 001 1h2a2 2 0 002-2v-7a9 9 0 00-9-9z"/>
          </svg>
        </div>

        {/* Enhanced paper texture */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(0, 0, 0, 0.02) 32px, rgba(0, 0, 0, 0.02) 33px)`
          }}
        />
        
        {/* Inner shadow */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 16px rgba(0, 0, 0, 0.04), inset 0 -2px 10px rgba(242, 201, 76, 0.04)'
          }}
        />
        {/* Header - Better Spacing */}
        <div className="relative z-10 flex items-start gap-4 mb-5">
          <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-warm flex-shrink-0">
            <Headphones className="w-8 h-8 text-brand-black" />
          </div>
          <div className="text-right flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-brand-yellow/25 px-3 py-1.5 rounded-full mb-2.5 border border-brand-yellow/40">
              <BookOpen className="w-3.5 h-3.5 text-brand-black" />
              <span className="text-xs font-tajawal font-semibold text-brand-black">
                كتاب الحلقة: العادات الذرية
              </span>
            </div>
            <h3 className="font-changa font-bold text-brand-black text-2xl leading-tight mb-1.5">
              الحلقة الأخيرة
            </h3>
            <p className="text-sm text-brand-gray font-tajawal flex items-center gap-2">
              متاحة للاستماع الآن
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </p>
          </div>
        </div>

        {/* Audio Visualizer - Larger */}
        <div className="bg-brand-sand/50 rounded-2xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" 
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 9px)',
              }}
            />
          </div>
          <AudioVisualizer isPlaying={isPlaying} />
        </div>

        {/* Progress Bar - Expanded */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 bg-brand-yellow rounded-full flex items-center justify-center shadow-warm hover:scale-105 transition-transform flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-brand-black" />
              ) : (
                <Play className="w-6 h-6 text-brand-black mr-0.5 fill-current" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="h-2 bg-brand-sand rounded-full overflow-hidden mb-1">
                <div className="h-full w-1/3 bg-brand-yellow rounded-full transition-all duration-300" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-gray font-tajawal">15:30</span>
                <span className="text-xs text-brand-gray font-tajawal">45:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-yellow/25 border border-brand-yellow/40 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-black" />
          <span className="text-xs font-tajawal font-bold text-brand-black">تحليل ذكي بالذكاء الاصطناعي</span>
        </div>

        {/* AI Insights Grid - Better Spacing */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-5">
          {/* Books Count */}
          <div className="flex items-center gap-2.5 bg-brand-sand/50 px-3.5 py-3 rounded-xl border border-brand-yellow/20">
            <div className="w-9 h-9 bg-brand-yellow/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4.5 h-4.5 text-brand-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-tajawal text-brand-gray mb-0.5">كتب مناقشة</p>
              <p className="text-xl font-changa font-bold text-brand-black">{episodeAI.booksDiscussed}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2.5 bg-brand-sand/50 px-3.5 py-3 rounded-xl border border-brand-yellow/20">
            <div className="w-9 h-9 bg-brand-yellow/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4.5 h-4.5 text-brand-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-tajawal text-brand-gray mb-0.5">المدة</p>
              <p className="text-base font-changa font-bold text-brand-black">{episodeAI.duration}</p>
            </div>
          </div>

          {/* Key Points */}
          <div className="flex items-center gap-2.5 bg-brand-sand/50 px-3.5 py-3 rounded-xl border border-brand-yellow/20">
            <div className="w-9 h-9 bg-brand-yellow/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4.5 h-4.5 text-brand-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-tajawal text-brand-gray mb-0.5">أفكار رئيسية</p>
              <p className="text-xl font-changa font-bold text-brand-black">{episodeAI.keyPoints}</p>
            </div>
          </div>

          {/* Quotes */}
          <div className="flex items-center gap-2.5 bg-brand-sand/50 px-3.5 py-3 rounded-xl border border-brand-yellow/20">
            <div className="w-9 h-9 bg-brand-yellow/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4.5 h-4.5 text-brand-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-tajawal text-brand-gray mb-0.5">اقتباسات</p>
              <p className="text-xl font-changa font-bold text-brand-black">{episodeAI.quotes}</p>
            </div>
          </div>
        </div>

        {/* Categories/Topics - Better Spacing */}
        <div className="relative z-10 mb-5 p-3 bg-white/50 rounded-xl border border-brand-sand">
          <p className="text-xs font-tajawal text-brand-gray mb-2.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-brand-yellow" />
            المجالات:
          </p>
          <div className="flex flex-wrap gap-2">
            {episodeAI.categories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 bg-brand-yellow/25 border border-brand-yellow/40 rounded-lg text-xs font-tajawal font-medium text-brand-black"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Participants - Horizontal with Better Spacing */}
        <div className="relative z-10 mb-5 p-3 bg-white/50 rounded-xl border border-brand-sand">
          <p className="text-xs font-tajawal text-brand-gray mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-brand-yellow" />
            المشاركون ({episodeAI.participants.length}):
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
            {episodeAI.participants.map((participant, idx) => (
              <div 
                key={idx} 
                className="flex-shrink-0 w-[150px] bg-brand-sand/40 hover:bg-brand-yellow/10 px-3 py-3 rounded-xl border border-brand-yellow/25 hover:border-brand-yellow/50 transition-all group/participant"
              >
                {/* Avatar Circle */}
                <div className="w-11 h-11 bg-brand-yellow rounded-full flex items-center justify-center mb-2.5 mx-auto shadow-sm">
                  <span className="font-changa font-bold text-brand-black text-base">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                {/* Name */}
                <p className="text-sm font-tajawal font-semibold text-brand-black text-center mb-0.5 line-clamp-1">
                  {participant.name}
                </p>
                
                {/* Role */}
                <p className="text-[11px] font-tajawal text-brand-gray text-center mb-2">
                  {participant.role}
                </p>
                
                {/* X Handle */}
                <a
                  href={`https://x.com/${participant.xHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1 text-[10px] text-brand-gray hover:text-blue-600 transition-colors"
                >
                  <XIcon className="w-3 h-3" />
                  <span className="truncate">@{participant.xHandle}</span>
                </a>
              </div>
            ))}
          </div>
          
          {/* Scroll hint */}
          <p className="text-[10px] text-brand-gray/50 font-tajawal mt-2 text-center">
            ← اسحب لرؤية المزيد
          </p>
        </div>

        {/* Episode Title - Better Spacing */}
        <div className="relative z-10 pt-4 border-t-2 border-brand-yellow/20">
          <p className="font-tajawal text-sm text-brand-black leading-relaxed">
            كيف تبني عادات تدوم؟ - مناقشة كتاب العادات الذرية
          </p>
        </div>
      </div>
    </div>
  )
}


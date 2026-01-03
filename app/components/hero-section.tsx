'use client'

import { Play, BookOpen } from 'lucide-react'
import { AiBadge } from './ui/ai-badge'
import { QuoteStrip } from './hero/QuoteStrip'
import { AudioBookCard } from './hero/AudioBookCard'
import { EnhancedStats } from './hero/EnhancedStats'
import { EnhancedButton } from './hero/EnhancedButton'
import { ReadingModeToggle } from './ReadingModeToggle'

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[80vh] gradient-hero overflow-hidden hero-pattern">
      {/* Reading Mode Toggle - Top Right */}
      <div className="absolute top-6 left-6 z-20">
        <ReadingModeToggle />
      </div>

      {/* BOLD Chapter Numbers Pattern */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.04] overflow-hidden">
        <div className="absolute top-[10%] right-[8%] font-changa font-bold text-[180px] text-brand-black leading-none" style={{ transform: 'rotate(-5deg)' }}>
          01
        </div>
        <div className="absolute top-[45%] left-[5%] font-changa font-bold text-[140px] text-brand-black leading-none" style={{ transform: 'rotate(3deg)' }}>
          02
        </div>
        <div className="absolute bottom-[15%] right-[15%] font-changa font-bold text-[120px] text-brand-black leading-none" style={{ transform: 'rotate(-8deg)' }}>
          فصل
        </div>
      </div>

      {/* Background Pattern - dot grid */}
      <div className="absolute inset-0 pattern-dots opacity-15" />
      
      {/* Decorative Circles - warmer */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-yellow/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-sand/40 rounded-full blur-3xl" />
      
      {/* Book Shelf Texture - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-sand/20 to-transparent pointer-events-none" />
      
      <div className="relative container-custom px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          {/* Left Content */}
          <div className="text-center lg:text-right order-2 lg:order-1 hero-text">
            {/* Top Chip */}
            <div className="inline-flex items-center gap-2 bg-brand-black/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-brand-black rounded-full animate-pulse" />
              <span className="text-sm font-tajawal text-brand-black/80">كل سبت، معرفة جديدة</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-changa font-bold text-brand-black mb-4 animate-slide-up">
              فطور السبت
            </h1>
            <p className="text-xl md:text-2xl font-changa text-brand-gray mb-3 animate-slide-up stagger-1">
              المعرفة بصوت جديد
            </p>
            
            {/* Library Badge - Clear Book Identity */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-l from-blue-50 to-brand-yellow/10 px-4 py-2 rounded-full border border-blue-200/40 mb-6 animate-slide-up stagger-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-tajawal font-medium text-blue-900">
                مكتبة مختصرة من أفضل الكتب
              </span>
            </div>
            
            {/* Rotating Quote Strip */}
            <div className="mb-6 animate-slide-up stagger-1">
              <QuoteStrip />
            </div>
            
            {/* AI Badge */}
            <div className="mb-6 animate-slide-up stagger-1">
              <AiBadge 
                text="مدعوم بالذكاء الاصطناعي" 
                variant="glow"
                icon="sparkles"
              />
            </div>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg font-tajawal text-brand-gray max-w-xl mx-auto lg:mx-0 mb-8 animate-slide-up stagger-2 leading-relaxed">
              بودكاست أسبوعي يقدم لك أفضل الكتب والأفكار من خلال حوارات ملهمة ومناقشات عميقة.
              استمتع بفطورك مع جرعة معرفة.
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 animate-slide-up stagger-2">
              <EnhancedButton
                defaultText="استمع الآن"
                hoverText="ابدأ الفصل الآن"
                icon={Play}
                variant="default"
              />
              <EnhancedButton
                defaultText="تصفح الكتب"
                hoverText="استكشف المكتبة الفكرية"
                icon={BookOpen}
                variant="outline"
              />
            </div>
            
            {/* Enhanced Stats */}
            <div className="animate-slide-up stagger-3">
              <EnhancedStats />
            </div>
          </div>

          {/* Right - Audio Book Card */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="animate-slide-up stagger-3">
              <AudioBookCard />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#FFF7D9"
          />
        </svg>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Quote, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { Button } from '../ui/button'

interface Quote {
  text: string
  source: string
  context?: string
}

const quotes: Quote[] = [
  {
    text: 'القراءة تمنحك حيوات متعددة في حياة واحدة',
    source: 'حلقة #142 - قوة القراءة',
    context: 'نقاش عميق حول كيف تشكل الكتب هويتنا الفكرية وتوسع آفاقنا المعرفية عبر تجارب الآخرين وخبراتهم المتراكمة.'
  },
  {
    text: 'المعرفة ليست ما تحفظه، بل ما تطبقه',
    source: 'حلقة #156 - العادات الذرية',
    context: 'حوار عن الفرق بين المعرفة النظرية والحكمة العملية، وكيف أن التطبيق هو الجسر الحقيقي بين القراءة والتغيير.'
  },
  {
    text: 'كل كتاب عظيم يبدأ بسؤال عظيم',
    source: 'حلقة #128 - فن طرح الأسئلة',
    context: 'استكشاف لكيفية بناء الأفكار الكبرى من أسئلة بسيطة، وكيف أن الفضول هو المحرك الأساسي للمعرفة الإنسانية.'
  },
  {
    text: 'الكتب جسور نحو عقول لم نلتقِ بها',
    source: 'حلقة #151 - الحوار الفكري',
    context: 'مناقشة حول كيف تتيح الكتب لنا الحوار مع مفكرين عبر الزمان والمكان، وكيف نبني شبكة معرفية من أفكار متنوعة.'
  },
  {
    text: 'ليس المهم كم تقرأ، بل كم تستوعب وتتأمل',
    source: 'حلقة #139 - القراءة العميقة',
    context: 'حديث عن جودة القراءة مقابل الكمية، وأهمية التأمل والتفكير النقدي في استيعاب المحتوى بشكل أعمق.'
  }
]

export function QuoteStrip() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length)
        setIsAnimating(false)
        setIsExpanded(false)
      }, 300)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const currentQuote = quotes[currentIndex]

  return (
    <div className="relative w-full max-w-2xl mx-auto lg:mx-0 mb-6">
      {/* Quote Container - Book Page Style */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-yellow/30 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
        {/* Paper texture */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 28px,
                rgba(0, 0, 0, 0.015) 28px,
                rgba(0, 0, 0, 0.015) 29px
              )
            `
          }}
        />
        
        {/* Inner shadow for depth */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.04), inset 0 -2px 8px rgba(242, 201, 76, 0.03)'
          }}
        />
        
        {/* Page corner fold effect */}
        <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-brand-sand to-brand-yellow/30 opacity-60" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        
        {/* Quote Icon */}
        <div className="absolute -top-3 right-4 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
          <Quote className="w-4 h-4 text-brand-black" />
        </div>

        {/* Quote Text */}
        <div
          className={`transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <blockquote className="text-lg md:text-xl font-changa text-brand-black mb-3 leading-relaxed">
            ❝ {currentQuote.text} ❞
          </blockquote>

          {/* Source - Enhanced with Book Connection */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-brand-sand/50">
            <BookOpen className="w-3.5 h-3.5 text-brand-gray/60" />
            <p className="text-sm font-tajawal text-brand-gray">
              من: <span className="font-medium text-brand-black">{currentQuote.source}</span>
            </p>
          </div>

          {/* Context (Expandable) */}
          {isExpanded && currentQuote.context && (
            <div className="mt-4 pt-4 border-t border-brand-yellow/20 animate-slide-up">
              <p className="text-sm font-tajawal text-brand-gray/90 leading-relaxed">
                {currentQuote.context}
              </p>
            </div>
          )}

          {/* Read Context Button */}
          {currentQuote.context && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs font-tajawal text-brand-gray hover:text-brand-black gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  إخفاء السياق
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  اقرأ السياق
                </>
              )}
            </Button>
          )}
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsAnimating(false)
                  setIsExpanded(false)
                }, 300)
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-brand-yellow'
                  : 'w-1.5 bg-brand-yellow/30 hover:bg-brand-yellow/50'
              }`}
              aria-label={`اقتباس ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


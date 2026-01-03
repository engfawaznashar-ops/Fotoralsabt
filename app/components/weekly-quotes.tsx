'use client'

import { useState } from 'react'
import { MessageCircle, Share2, Heart, ArrowLeft, Sparkles, ChevronDown, ChevronUp, Flame, TrendingUp, Lightbulb, BookOpen, Mic, Copy, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { analyzeQuote } from '@/lib/ai/analyzeQuote'
import type { Quote, QuoteAnalysis } from '@/types'

interface ExtendedQuote extends Quote {
  engagement?: number
  isHighlighted?: boolean
  weekContext?: string // "ترند هذا الأسبوع" أو "من حلقة هذا الأسبوع"
  practicalApplication?: string // تطبيق عملي
  aiInsight?: {
    mainIdea: string
    howToApply: string
  }
}

// Mock data with extended fields
const mockQuotes: ExtendedQuote[] = [
  {
    id: '1',
    text: 'النجاح ليس وجهة نهائية، بل رحلة مستمرة من التعلم والنمو.',
    speakerName: 'أحمد السالم',
    episodeTitle: 'الحلقة 156',
    episodeNumber: 156,
    engagement: 245,
    isHighlighted: true,
    weekContext: 'ترند هذا الأسبوع',
    practicalApplication: 'اكتب 3 أشياء تعلمتها اليوم قبل النوم',
    aiInsight: {
      mainIdea: 'النجاح عملية مستمرة وليس حدث منفرد',
      howToApply: 'ركز على التحسين اليومي بدلاً من الكمال'
    }
  },
  {
    id: '2',
    text: 'العادات الصغيرة التي نمارسها يومياً هي التي تشكل مصيرنا.',
    bookTitle: 'العادات الذرية',
    episodeTitle: 'الحلقة 154',
    episodeNumber: 154,
    engagement: 189,
    weekContext: 'من حلقة هذا الأسبوع',
    practicalApplication: 'ابدأ بعادة صغيرة جداً (دقيقتين فقط) واستمر عليها',
    aiInsight: {
      mainIdea: 'التغييرات الصغيرة تتراكم لنتائج كبيرة',
      howToApply: 'اختر عادة واحدة وطبقها لمدة 30 يوم'
    }
  },
  {
    id: '3',
    text: 'القراءة هي المفتاح الذي يفتح أبواب العوالم التي لم نزرها بعد.',
    speakerName: 'سارة الخالد',
    episodeTitle: 'الحلقة 152',
    episodeNumber: 152,
    engagement: 156,
    practicalApplication: 'اقرأ 10 صفحات يومياً من كتاب جديد',
    aiInsight: {
      mainIdea: 'القراءة توسع آفاق التجربة الإنسانية',
      howToApply: 'خصص 15 دقيقة صباحاً للقراءة'
    }
  },
  {
    id: '4',
    text: 'التغيير الحقيقي يبدأ من الداخل، من طريقة تفكيرنا وإيماننا بأنفسنا.',
    speakerName: 'محمد العتيبي',
    bookTitle: 'قوة العادات',
    episodeNumber: 150,
    engagement: 134,
    practicalApplication: 'اكتب جملة إيجابية عن نفسك كل صباح',
    aiInsight: {
      mainIdea: 'الهوية الذاتية محرك التغيير المستدام',
      howToApply: 'غيّر من تعتقد أنك تكون، لا فقط ما تفعل'
    }
  },
  {
    id: '5',
    text: 'المعرفة قوة، لكن تطبيق المعرفة هو القوة الحقيقية.',
    episodeTitle: 'الحلقة 150',
    episodeNumber: 150,
    engagement: 98,
    practicalApplication: 'طبّق فكرة واحدة من كل كتاب تقرأه',
    aiInsight: {
      mainIdea: 'الفعل أقوى من المعرفة النظرية',
      howToApply: 'حوّل كل معلومة لخطوة عمل محددة'
    }
  },
]

interface WeeklyQuotesProps {
  quotes?: ExtendedQuote[]
}

export function WeeklyQuotes({ quotes = mockQuotes }: WeeklyQuotesProps) {
  // Find the most engaged quote (highlighted)
  const sortedQuotes = [...quotes].sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
  const highlightedQuote = sortedQuotes[0]
  const otherQuotes = sortedQuotes.slice(1, 5)

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-sand/50 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-changa font-bold text-brand-black">اقتباسات الأسبوع</h2>
              <p className="text-sm text-brand-gray font-tajawal">كلمات ملهمة من حلقاتنا</p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2 group hidden sm:flex">
            جميع الاقتباسات
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Highlighted Quote - First Card */}
          {highlightedQuote && (
            <QuoteCard 
              quote={highlightedQuote} 
              isHighlighted={true}
              className="md:col-span-2 lg:col-span-1"
            />
          )}
          
          {/* Other Quotes */}
          {otherQuotes.map((quote, index) => (
            <QuoteCard 
              key={quote.id} 
              quote={quote}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <Button variant="ghost" className="gap-2 group">
            جميع الاقتباسات
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}

// Quote Card Component
interface QuoteCardProps {
  quote: ExtendedQuote
  isHighlighted?: boolean
  className?: string
  style?: React.CSSProperties
}

function QuoteCard({ quote, isHighlighted = false, className = '', style }: QuoteCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<QuoteAnalysis | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showPractical, setShowPractical] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleAnalyzeQuote = async () => {
    if (analysis) {
      setShowAnalysis(!showAnalysis)
      return
    }
    
    setIsAnalyzing(true)
    try {
      const result = await analyzeQuote(quote.text)
      setAnalysis(result)
      setShowAnalysis(true)
    } catch (error) {
      console.error('Error analyzing quote:', error)
    }
    setIsAnalyzing(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(quote.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`group cursor-pointer overflow-hidden animate-fade-in transition-all duration-300 hover:shadow-xl ${
          isHighlighted 
            ? 'border-r-4 border-r-brand-yellow bg-gradient-to-l from-brand-yellow/10 to-white shadow-lg scale-[1.02]' 
            : 'border-r-4 border-r-brand-yellow/40 hover:border-r-brand-yellow hover:scale-[1.01]'
        } ${className}`}
        style={style}
      >
        <CardContent className="p-6 relative">
        {/* Week Context Label */}
        {quote.weekContext && (
          <div className="flex items-center gap-2 mb-3">
            {isHighlighted ? (
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-brand-yellow/30 text-brand-black text-xs px-3 py-1 rounded-full font-tajawal font-bold border border-orange-200">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                {quote.weekContext}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-brand-sand text-brand-gray text-xs px-2.5 py-1 rounded-full font-tajawal">
                <TrendingUp className="w-3 h-3" />
                {quote.weekContext}
              </span>
            )}
            {isHighlighted && quote.engagement && (
              <span className="text-xs text-brand-gray font-tajawal flex items-center gap-1">
                <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                {quote.engagement}
              </span>
            )}
          </div>
        )}

        {/* Quote Icon - Enhanced */}
        <div className={`text-5xl font-changa leading-none mb-2 transition-colors ${
          isHighlighted ? 'text-brand-yellow' : 'text-brand-yellow/30'
        }`}>
          ❝
        </div>

        {/* Quote Text - Larger font */}
        <blockquote className={`font-tajawal text-brand-black leading-relaxed mb-4 ${
          isHighlighted ? 'text-lg lg:text-xl font-medium' : 'text-base lg:text-lg'
        }`}>
          {quote.text}
        </blockquote>

        {/* Source Badges - Enhanced */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {quote.speakerName && (
            <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-xs font-tajawal font-medium">
              {quote.speakerName}
            </span>
          )}
          {quote.bookTitle && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-tajawal font-medium">
              <BookOpen className="w-3 h-3" />
              {quote.bookTitle}
            </span>
          )}
          {quote.episodeNumber && (
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg text-xs font-tajawal font-medium">
              <Mic className="w-3 h-3" />
              #{quote.episodeNumber}
            </span>
          )}
        </div>

        {/* Practical Application Chip */}
        {quote.practicalApplication && (
          <button
            onClick={() => setShowPractical(!showPractical)}
            className="w-full mb-3 p-3 bg-gradient-to-r from-brand-yellow/10 to-brand-sand/30 hover:from-brand-yellow/20 hover:to-brand-sand/40 rounded-xl border border-brand-yellow/30 text-right transition-all group/practical"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-brand-yellow" />
                <span className="text-sm font-tajawal font-semibold text-brand-black">
                  تطبيق عملي
                </span>
              </div>
              {showPractical ? (
                <ChevronUp className="w-4 h-4 text-brand-gray" />
              ) : (
                <ChevronDown className="w-4 h-4 text-brand-gray" />
              )}
            </div>
            {showPractical && (
              <p className="text-sm font-tajawal text-brand-gray leading-relaxed mt-2 pr-6">
                {quote.practicalApplication}
              </p>
            )}
          </button>
        )}

        {/* AI Analyze Button - Enhanced */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full gap-2 mb-3 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200/50 text-purple-900 hover:text-purple-700 font-tajawal font-semibold"
          onClick={handleAnalyzeQuote}
          disabled={isAnalyzing}
        >
          <Sparkles className="w-4 h-4" />
          {isAnalyzing ? 'جاري التحليل...' : analysis ? (showAnalysis ? 'إخفاء التحليل' : 'عرض التحليل') : 'تحليل أعمق بالذكاء الاصطناعي'}
          {analysis && (showAnalysis ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
        </Button>

        {/* Analysis Collapsible - Enhanced */}
        {analysis && showAnalysis && (
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-brand-yellow/10 rounded-xl p-4 mb-3 border-2 border-purple-200/50 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-changa font-bold text-purple-900">تحليل ذكي</span>
            </div>
            <p className="text-sm text-brand-black font-tajawal leading-relaxed mb-3">
              {analysis.explanation}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs bg-brand-yellow px-2.5 py-1 rounded-full font-tajawal font-semibold text-brand-black">
                {analysis.theme}
              </span>
              {analysis.relatedConcepts.slice(0, 2).map((concept, i) => (
                <span key={i} className="text-xs bg-white border border-brand-sand px-2.5 py-1 rounded-full font-tajawal text-brand-gray">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions - Enhanced with Tooltips */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <div className="relative group/like">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-1.5 transition-all ${liked ? 'text-red-500' : 'text-brand-gray'}`}
              onClick={() => setLiked(!liked)}
              aria-label="إعجاب"
            >
              <Heart className={`w-4 h-4 transition-transform group-hover/like:scale-110 ${liked ? 'fill-current' : ''}`} />
              <span className="text-xs font-tajawal">{(quote.engagement || 0) + (liked ? 1 : 0)}</span>
            </Button>
            <div className="absolute -top-8 right-0 bg-brand-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/like:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-tajawal">
              إعجاب
            </div>
          </div>

          <div className="relative group/share">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-brand-gray hover:text-blue-600"
              aria-label="مشاركة"
            >
              <Share2 className="w-4 h-4 transition-transform group-hover/share:scale-110" />
              <span className="text-xs font-tajawal">مشاركة</span>
            </Button>
            <div className="absolute -top-8 right-0 bg-brand-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/share:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-tajawal">
              مشاركة الاقتباس
            </div>
          </div>

          <div className="relative group/copy">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-brand-gray hover:text-green-600"
              onClick={handleCopy}
              aria-label="نسخ"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-tajawal">تم</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 transition-transform group-hover/copy:scale-110" />
                  <span className="text-xs font-tajawal">نسخ</span>
                </>
              )}
            </Button>
            <div className="absolute -top-8 right-0 bg-brand-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/copy:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-tajawal">
              نسخ النص
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

      {/* AI Preview on Hover - Floating Box */}
      {isHovered && quote.aiInsight && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 text-white rounded-t-xl p-4 shadow-2xl animate-slide-up z-10 pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-changa font-bold">معاينة ذكية</span>
          </div>
          <div className="space-y-2 text-sm font-tajawal">
            <div>
              <span className="text-purple-200 text-xs">الفكرة الأساسية:</span>
              <p className="text-white/95 leading-relaxed">{quote.aiInsight.mainIdea}</p>
            </div>
            <div>
              <span className="text-purple-200 text-xs">كيف تطبقها اليوم؟</span>
              <p className="text-white/95 leading-relaxed">{quote.aiInsight.howToApply}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

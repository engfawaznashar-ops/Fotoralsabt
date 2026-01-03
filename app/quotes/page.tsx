'use client'

import { useState } from 'react'
import { MessageCircle, Sparkles, Share2, Heart, ChevronLeft, X } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { PageHeader, SearchFilterBar } from '@/app/components/page-header'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'

// Mock data
const mockQuotes = [
  {
    id: '1',
    text: 'النجاح ليس وجهة نهائية، بل رحلة مستمرة من التعلم والنمو.',
    speaker: 'أحمد السالم',
    episodeNumber: 156,
    tag: 'النجاح',
    likes: 234,
  },
  {
    id: '2',
    text: 'العادات الصغيرة التي نمارسها يومياً هي التي تشكل مصيرنا.',
    speaker: 'جيمس كلير',
    book: 'العادات الذرية',
    episodeNumber: 154,
    tag: 'العادات',
    likes: 189,
  },
  {
    id: '3',
    text: 'القراءة هي المفتاح الذي يفتح أبواب العوالم التي لم نزرها بعد.',
    speaker: 'سارة الخالد',
    episodeNumber: 152,
    tag: 'القراءة',
    likes: 312,
  },
  {
    id: '4',
    text: 'التغيير الحقيقي يبدأ من الداخل، من طريقة تفكيرنا وإيماننا بأنفسنا.',
    speaker: 'محمد العتيبي',
    book: 'قوة العادات',
    episodeNumber: 148,
    tag: 'التغيير',
    likes: 156,
  },
  {
    id: '5',
    text: 'المعرفة قوة، لكن تطبيق المعرفة هو القوة الحقيقية.',
    speaker: 'نورة القحطاني',
    episodeNumber: 145,
    tag: 'المعرفة',
    likes: 201,
  },
  {
    id: '6',
    text: 'نحن لا نرتقي إلى مستوى أهدافنا، بل ننحدر إلى مستوى أنظمتنا.',
    speaker: 'جيمس كلير',
    book: 'العادات الذرية',
    episodeNumber: 156,
    tag: 'الأهداف',
    likes: 278,
  },
  {
    id: '7',
    text: 'القائد الحقيقي هو من يصنع قادة آخرين، وليس تابعين.',
    speaker: 'أحمد السالم',
    episodeNumber: 140,
    tag: 'القيادة',
    likes: 165,
  },
  {
    id: '8',
    text: 'الوقت الأفضل لزراعة شجرة كان قبل عشرين سنة، والوقت الثاني الأفضل هو الآن.',
    speaker: 'عبدالله الفيصل',
    episodeNumber: 138,
    tag: 'البدء',
    likes: 298,
  },
]

const tagFilters = ['الكل', 'النجاح', 'العادات', 'القراءة', 'القيادة', 'التغيير', 'المعرفة']

interface AIAnalysis {
  explanation: string
  coreIdea: string
  howToUse: string
}

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState('الكل')
  const [selectedQuote, setSelectedQuote] = useState<typeof mockQuotes[0] | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const filteredQuotes = mockQuotes.filter(quote => {
    if (searchQuery && !quote.text.includes(searchQuery)) return false
    if (activeTag !== 'الكل' && quote.tag !== activeTag) return false
    return true
  })

  const handleAnalyzeQuote = async (quote: typeof mockQuotes[0]) => {
    setSelectedQuote(quote)
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setAiAnalysis({
      explanation: `هذا الاقتباس من ${quote.speaker} يعكس فلسفة عميقة حول ${quote.tag}. يدعونا للتفكير في كيفية تطبيق هذه الحكمة في حياتنا اليومية.`,
      coreIdea: `الفكرة الأساسية هي أن ${quote.tag} ليست مجرد مفهوم نظري، بل هي ممارسة يومية تتطلب الالتزام والصبر.`,
      howToUse: 'يمكنك تطبيق هذا الاقتباس من خلال: 1) التأمل فيه يومياً 2) كتابته في مكان تراه باستمرار 3) مشاركته مع من تحب 4) اتخاذ خطوة عملية واحدة يومياً نحو تحقيقه.',
    })
    setIsAnalyzing(false)
  }

  const closeModal = () => {
    setSelectedQuote(null)
    setAiAnalysis(null)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <PageHeader
            title="اقتباسات الأسبوع"
            subtitle={`${mockQuotes.length} اقتباس ملهم من حلقاتنا`}
            icon={<MessageCircle className="w-6 h-6 text-brand-black" />}
          />

          {/* Search & Filters */}
          <SearchFilterBar
            searchPlaceholder="ابحث في الاقتباسات..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filters={
              <>
                {tagFilters.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-tajawal transition-all ${
                      activeTag === tag
                        ? 'bg-brand-yellow text-brand-black'
                        : 'bg-white text-brand-gray border border-brand-sand hover:border-brand-yellow'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </>
            }
          />

          {/* Quotes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuotes.map((quote, index) => (
              <Card
                key={quote.id}
                className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="text-5xl font-changa text-brand-yellow/30 leading-none mb-3">
                    "
                  </div>

                  {/* Quote Text */}
                  <blockquote className="text-xl font-tajawal text-brand-black leading-relaxed mb-4">
                    {quote.text}
                  </blockquote>

                  {/* Attribution */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-brand-sand px-3 py-1 rounded-full text-sm font-tajawal">
                      {quote.speaker}
                    </span>
                    {quote.book && (
                      <span className="bg-brand-yellow/20 px-3 py-1 rounded-full text-sm font-tajawal">
                        📖 {quote.book}
                      </span>
                    )}
                    <span className="text-sm text-brand-gray/60 font-tajawal">
                      • الحلقة #{quote.episodeNumber}
                    </span>
                  </div>

                  {/* Tag */}
                  <span className="inline-block bg-brand-sand/50 px-2 py-0.5 rounded text-xs font-tajawal text-brand-gray mb-4">
                    #{quote.tag}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{quote.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Share2 className="w-4 h-4" />
                      مشاركة
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1.5 text-brand-yellow mr-auto"
                      onClick={() => handleAnalyzeQuote(quote)}
                    >
                      <Sparkles className="w-4 h-4" />
                      حلّل الاقتباس
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

      {/* AI Analysis Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-warm-lg animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-changa font-bold text-xl text-brand-black">تحليل الاقتباس</h3>
                </div>
                <button onClick={closeModal} className="text-brand-gray hover:text-brand-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quote */}
              <div className="bg-brand-sand/50 rounded-xl p-4 mb-6">
                <p className="font-tajawal text-brand-black leading-relaxed">
                  "{selectedQuote.text}"
                </p>
                <p className="text-sm text-brand-gray font-tajawal mt-2">— {selectedQuote.speaker}</p>
              </div>

              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-brand-gray font-tajawal">جاري التحليل...</p>
                </div>
              ) : aiAnalysis && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-changa font-bold text-brand-black mb-2">شرح ذكي</h4>
                    <p className="text-sm text-brand-gray font-tajawal leading-relaxed">
                      {aiAnalysis.explanation}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-changa font-bold text-brand-black mb-2">الفكرة الأساسية</h4>
                    <p className="text-sm text-brand-gray font-tajawal leading-relaxed">
                      {aiAnalysis.coreIdea}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-changa font-bold text-brand-black mb-2">كيف تستخدمه في حياتك</h4>
                    <p className="text-sm text-brand-gray font-tajawal leading-relaxed">
                      {aiAnalysis.howToUse}
                    </p>
                  </div>
                </div>
              )}

              <Button className="w-full mt-6" onClick={closeModal}>
                إغلاق
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </>
  )
}




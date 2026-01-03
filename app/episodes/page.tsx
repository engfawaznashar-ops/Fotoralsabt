/**
 * Episodes Listing Page
 * Displays all episodes with filters and search
 */

import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { Calendar, Clock, Play, Sparkles, BookOpen, Users, Map, Bell, Headphones, Lightbulb, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'جميع الحلقات | فطور السبت',
  description: 'تصفح جميع حلقات بودكاست فطور السبت',
}

async function getEpisodes() {
  try {
    const episodes = await prisma.episode.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        speakers: {
          include: {
            speaker: true,
          },
        },
        books: {
          include: {
            book: true,
          },
        },
      },
    })
    return episodes
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return []
  }
}

export default async function EpisodesPage() {
  const episodes = await getEpisodes()

  return (
    <main className="min-h-screen bg-brand-sand">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-changa font-bold text-brand-black mb-4">
              جميع الحلقات
            </h1>
            <p className="text-lg text-brand-gray font-tajawal">
              استكشف مكتبتنا الكاملة من الحلقات الملهمة والمعرفية
            </p>
          </div>
        </div>
      </section>

      {/* Episodes Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          {episodes.length === 0 ? (
            <div className="max-w-5xl mx-auto">
              {/* Empty State - Smart & Encouraging */}
              
              {/* Pattern Background */}
              <div 
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Hero Icon - Animated */}
              <div className="text-center mb-12">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-brand-yellow/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-32 h-32 bg-gradient-to-br from-brand-yellow to-brand-yellow/80 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="relative">
                      <Headphones className="w-16 h-16 text-brand-black" />
                      <BookOpen className="w-8 h-8 text-brand-black absolute -bottom-2 -right-2" />
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-changa font-bold text-brand-black mb-3">
                  نجهّز لك مكتبة معرفية مميزة 📚
                </h3>
                <p className="text-lg text-brand-gray font-tajawal mb-2">
                  إلى ذلك الحين، تقدر تبدأ رحلتك من هنا
                </p>
                
                {/* AI Badge - Unified */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 mt-4">
                  <Sparkles className="w-3.5 h-3.5 text-brand-black animate-pulse" />
                  <span className="text-xs font-tajawal font-bold text-brand-black">مدعوم بالذكاء الاصطناعي</span>
                </div>
              </div>

              {/* Daily Quote Section */}
              <div className="mb-12 max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-brand-yellow/20 relative overflow-hidden group/quote">
                  {/* Paper texture */}
                  <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.01) 30px, rgba(0,0,0,0.01) 31px)`
                    }}
                  />
                  
                  <div className="relative">
                    {/* Small label above */}
                    <p className="text-xs text-brand-gray/60 font-tajawal mb-2">
                      اقتباس مختار لك اليوم
                    </p>

                    <div className="flex items-center gap-2 mb-4 relative">
                      <Zap className="w-5 h-5 text-brand-yellow" />
                      <h4 className="text-lg font-changa font-bold text-brand-black">اقتباسك اليوم</h4>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 right-0 bg-brand-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover/quote:opacity-100 pointer-events-none transition-opacity whitespace-nowrap font-tajawal shadow-lg">
                        تم اختياره بناءً على اهتماماتك
                        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-brand-black transform rotate-45" />
                      </div>
                    </div>

                    <blockquote className="text-xl md:text-2xl font-tajawal text-brand-black leading-relaxed mb-4">
                      ❝ العادات الصغيرة التي نمارسها يومياً هي التي تشكل مصيرنا ❞
                    </blockquote>

                    <p className="text-sm text-brand-gray font-tajawal mb-4">
                      — من كتاب العادات الذرية
                    </p>

                    <div className="flex items-center gap-3">
                      <Link
                        href="/quotes"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-black hover:bg-brand-black/90 text-white rounded-xl font-tajawal font-semibold transition-all shadow-md hover:shadow-lg group/ai"
                      >
                        <Sparkles className="w-4 h-4 group-hover/ai:rotate-12 transition-transform" />
                        حلّل الاقتباس
                      </Link>
                      <Link
                        href="/map"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-yellow hover:bg-brand-yellow/80 text-brand-black rounded-xl font-tajawal font-semibold transition-all shadow-md hover:shadow-lg group/explore"
                      >
                        <Map className="w-4 h-4 group-hover/explore:scale-110 transition-transform" />
                        استكشف الفكرة
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Knowledge Paths - 3 Cards */}
              <div className="mb-12">
                <h4 className="text-2xl font-changa font-bold text-brand-black text-center mb-6">
                  مسارات معرفية جاهزة لك
                </h4>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Path 1: Habits */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-brand-yellow/20 hover:border-brand-yellow group/path1 relative">
                    <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center mb-4 group-hover/path1:scale-110 transition-transform">
                      <Lightbulb className="w-6 h-6 text-brand-black" />
                    </div>
                    <h5 className="text-xl font-changa font-bold text-brand-black mb-2">
                      مسار بناء العادات
                    </h5>
                    <p className="text-sm text-brand-gray font-tajawal mb-4 leading-relaxed">
                      رحلة معرفية لفهم العادات وبنائها بشكل علمي ومستدام
                    </p>
                    
                    {/* Hover hint - subtle */}
                    <p className="text-xs text-brand-gray/60 font-tajawal mb-3 h-8 transition-opacity opacity-0 group-hover/path1:opacity-100">
                      مناسب لك إذا كنت تريد تغيير سلوكياتك اليومية
                    </p>

                    <Link
                      href="/map?path=habits"
                      className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-brand-black text-white hover:bg-brand-black/90 rounded-xl font-tajawal font-semibold transition-all group/btn"
                    >
                      ابدأ المسار
                      <TrendingUp className="w-4 h-4 group-hover/btn:translate-x-[-2px] transition-transform" />
                    </Link>
                  </div>

                  {/* Path 2: Deep Thinking - Unified */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200/50 hover:border-blue-400/50 group/path2 relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover/path2:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-white group-hover/path2:rotate-12 transition-transform duration-500" />
                    </div>
                    <h5 className="text-xl font-changa font-bold text-brand-black mb-2">
                      مسار التفكير العميق
                    </h5>
                    <p className="text-sm text-brand-gray font-tajawal mb-4 leading-relaxed">
                      كيف نعمل بعمق في عالم مليء بالمشتتات
                    </p>
                    
                    {/* Hover hint - subtle */}
                    <p className="text-xs text-brand-gray/60 font-tajawal mb-3 h-8 transition-opacity opacity-0 group-hover/path2:opacity-100">
                      مناسب لك إذا كنت تعاني من التشتيت المستمر
                    </p>

                    <Link
                      href="/map?path=deepwork"
                      className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-blue-500 text-white hover:bg-blue-600 rounded-xl font-tajawal font-semibold transition-all group/btn2"
                    >
                      ابدأ المسار
                      <TrendingUp className="w-4 h-4 group-hover/btn2:translate-x-[-2px] transition-transform" />
                    </Link>
                  </div>

                  {/* Path 3: Productivity - Unified */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-200/50 hover:border-green-400/50 group/path3 relative">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover/path3:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h5 className="text-xl font-changa font-bold text-brand-black mb-2">
                      مسار الإنتاجية المستدامة
                    </h5>
                    <p className="text-sm text-brand-gray font-tajawal mb-4 leading-relaxed">
                      من الفوضى إلى النظام: بناء نظام إنتاجي يدوم
                    </p>
                    
                    {/* Hover hint - subtle */}
                    <p className="text-xs text-brand-gray/60 font-tajawal mb-3 h-8 transition-opacity opacity-0 group-hover/path3:opacity-100">
                      مناسب لك إذا كنت تبحث عن تنظيم أفضل لوقتك
                    </p>

                    <Link
                      href="/map?path=productivity"
                      className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-green-500 text-white hover:bg-green-600 rounded-xl font-tajawal font-semibold transition-all group/btn3"
                    >
                      ابدأ المسار
                      <TrendingUp className="w-4 h-4 group-hover/btn3:translate-x-[-2px] transition-transform" />
                    </Link>
                  </div>
                </div>
                
                {/* AI Recommendation - Unified */}
                <div className="text-center mt-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-brand-sand">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                      <span className="text-xs text-brand-gray/70 font-tajawal">مدعوم بالذكاء الاصطناعي</span>
                    </div>
                    <div className="w-px h-4 bg-brand-sand" />
                    <p className="text-sm text-brand-black font-tajawal">
                      نقترح لك البدء بـ <span className="font-semibold text-brand-yellow">مسار بناء العادات</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Main CTAs */}
              <div className="text-center space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/books/smart"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-black hover:bg-brand-black/90 text-white rounded-2xl font-changa font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    <BookOpen className="w-6 h-6" />
                    استكشف الكتب الذكية
                  </Link>

                  <Link
                    href="/speakers"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-black rounded-2xl font-changa font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    <Users className="w-6 h-6" />
                    تعرّف على المتحدثين
                  </Link>
                </div>

                <Link
                  href="#subscribe"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-brand-sand border-2 border-brand-yellow text-brand-black rounded-xl font-tajawal font-semibold transition-all hover:shadow-lg"
                >
                  <Bell className="w-5 h-5" />
                  اشترك ليصلك الجديد
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {episodes.map((episode) => {
                const speakerCount = episode.speakers?.length || 0
                const bookCount = episode.books?.length || 0
                const durationMinutes = episode.duration ? Math.floor(episode.duration / 60) : 0

                return (
                  <Link
                    key={episode.id}
                    href={`/episodes/${episode.id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-brand-beige h-full flex flex-col">
                      {/* Episode Number & Mood */}
                      <div className="flex items-center justify-between mb-4">
                        {episode.episodeNumber && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-brand-black text-white rounded-full text-sm font-tajawal">
                            <Play className="w-3 h-3" />
                            <span>الحلقة {episode.episodeNumber}</span>
                          </div>
                        )}
                        {episode.aiMood && (
                          <div className="px-3 py-1 bg-brand-beige/50 text-brand-black rounded-full text-xs font-tajawal">
                            {episode.aiMood}
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-changa font-bold text-brand-black mb-3 group-hover:text-brand-black/80 transition-colors leading-tight">
                        {episode.title}
                      </h3>

                      {/* Summary */}
                      {episode.summaryAI && (
                        <p className="text-sm text-brand-gray font-tajawal mb-4 line-clamp-3 flex-grow">
                          {episode.summaryAI}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-brand-gray border-t border-brand-sand pt-4 mt-auto">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-tajawal">{formatDate(episode.date)}</span>
                        </div>
                        {durationMinutes > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="font-tajawal">{durationMinutes} دقيقة</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      {(speakerCount > 0 || bookCount > 0) && (
                        <div className="flex items-center gap-3 mt-3 text-xs font-tajawal text-brand-gray">
                          {speakerCount > 0 && (
                            <span>{speakerCount} {speakerCount === 1 ? 'ضيف' : 'ضيوف'}</span>
                          )}
                          {bookCount > 0 && (
                            <span>• {bookCount} {bookCount === 1 ? 'كتاب' : 'كتب'}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}




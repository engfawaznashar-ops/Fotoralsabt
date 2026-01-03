'use client'

import { Newspaper, BookOpen, Users, MessageCircle, Download, Calendar, Sparkles, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { PageHeader } from '@/app/components/page-header'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { AiBadge } from '@/app/components/ui/ai-badge'
import { Separator } from '@/app/components/ui/separator'

// Mock data
const weeklyDigest = {
  weekNumber: 1,
  dateRange: '1 - 7 يناير 2024',
  aiSummary: 'هذا الأسبوع تركز على موضوع بناء العادات الفعالة، مع مناقشة معمقة لكتاب العادات الذرية. استضفنا أحمد السالم الذي شارك رؤيته حول القيادة الملهمة.',
  
  bookOfWeek: {
    id: '1',
    title: 'العادات الذرية',
    author: 'جيمس كلير',
    reason: 'أكثر كتاب ذكر هذا الأسبوع',
  },
  
  speakerOfWeek: {
    id: '1',
    name: 'أحمد السالم',
    reason: 'أكثر متحدث تفاعلاً',
    aiPersona: 'قيادي',
  },
  
  books: [
    { id: '1', title: 'العادات الذرية', author: 'جيمس كلير' },
    { id: '2', title: 'التفكير السريع والبطيء', author: 'دانيال كانيمان' },
    { id: '3', title: 'قوة العادات', author: 'تشارلز دويج' },
  ],
  
  speakers: [
    { id: '1', name: 'أحمد السالم', episodesThisWeek: 2 },
    { id: '2', name: 'سارة الخالد', episodesThisWeek: 1 },
    { id: '3', name: 'محمد العتيبي', episodesThisWeek: 1 },
  ],
  
  topQuotes: [
    {
      id: '1',
      text: 'نحن لا نرتقي إلى مستوى أهدافنا، بل ننحدر إلى مستوى أنظمتنا.',
      speaker: 'جيمس كلير',
    },
    {
      id: '2',
      text: 'التحسن بنسبة 1% يومياً يعني أنك ستكون أفضل 37 مرة خلال سنة.',
      speaker: 'أحمد السالم',
    },
    {
      id: '3',
      text: 'العادات هي الفائدة المركبة للتطوير الذاتي.',
      speaker: 'جيمس كلير',
    },
  ],
}

export default function DigestPage() {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const handleDownloadPdf = () => {
    alert('جاري تحميل ملخص PDF... (وظيفة وهمية)')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <PageHeader
            title="الملخص الأسبوعي"
            subtitle={`الأسبوع ${weeklyDigest.weekNumber} • ${weeklyDigest.dateRange}`}
            icon={<Newspaper className="w-6 h-6 text-brand-black" />}
            actions={
              <Button className="gap-2" onClick={handleDownloadPdf}>
                <Download className="w-4 h-4" />
                تحميل PDF
              </Button>
            }
          />

          {/* AI Summary Card */}
          <Card className="mb-8 shadow-warm-lg border-brand-yellow/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-black" />
                </div>
                <div>
                  <h2 className="font-changa font-bold text-xl text-brand-black">ماذا حدث هذا الأسبوع؟</h2>
                  <AiBadge text="ملخص AI تلقائي" variant="subtle" />
                </div>
              </div>
              <p className="font-tajawal text-brand-gray leading-relaxed text-lg">
                {weeklyDigest.aiSummary}
              </p>
            </CardContent>
          </Card>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Books Column */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-changa font-bold text-lg text-brand-black">الكتب</h3>
                  <span className="text-xs bg-brand-yellow/20 px-2 py-0.5 rounded-full text-brand-gray mr-auto">
                    {weeklyDigest.books.length} كتب
                  </span>
                </div>

                {/* Book of the Week */}
                <div className="bg-gradient-to-br from-brand-yellow/20 to-brand-sand rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-brand-yellow text-brand-black px-2 py-0.5 rounded-full font-tajawal">
                      ⭐ كتاب الأسبوع
                    </span>
                  </div>
                  <a href={`/books/${weeklyDigest.bookOfWeek.id}`} className="block group">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-18 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <BookOpen className="w-7 h-7 text-brand-yellow" />
                      </div>
                      <div>
                        <p className="font-changa font-bold text-brand-black group-hover:text-brand-yellow transition-colors">
                          {weeklyDigest.bookOfWeek.title}
                        </p>
                        <p className="text-sm text-brand-gray font-tajawal">{weeklyDigest.bookOfWeek.author}</p>
                        <p className="text-xs text-brand-gray/60 font-tajawal mt-1">{weeklyDigest.bookOfWeek.reason}</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="space-y-3">
                  {weeklyDigest.books.map((book, index) => (
                    <div key={book.id}>
                      <a href={`/books/${book.id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-14 bg-brand-sand rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-brand-yellow" />
                        </div>
                        <div>
                          <p className="font-changa font-bold text-brand-black text-sm group-hover:text-brand-yellow transition-colors">
                            {book.title}
                          </p>
                          <p className="text-xs text-brand-gray font-tajawal">{book.author}</p>
                        </div>
                      </a>
                      {index < weeklyDigest.books.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full mt-4 gap-2 group">
                  عرض الكل
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Speakers Column */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-changa font-bold text-lg text-brand-black">المتحدثون</h3>
                  <span className="text-xs bg-brand-yellow/20 px-2 py-0.5 rounded-full text-brand-gray mr-auto">
                    {weeklyDigest.speakers.length} متحدثين
                  </span>
                </div>

                {/* Speaker of the Week */}
                <div className="bg-gradient-to-br from-brand-yellow/20 to-brand-sand rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-brand-yellow text-brand-black px-2 py-0.5 rounded-full font-tajawal">
                      ⭐ متحدث الأسبوع
                    </span>
                  </div>
                  <a href={`/speakers/${weeklyDigest.speakerOfWeek.id}`} className="flex items-center gap-3 group">
                    <Avatar className="w-14 h-14 ring-2 ring-brand-yellow/30">
                      <AvatarFallback className="text-lg bg-brand-yellow text-brand-black">
                        {getInitials(weeklyDigest.speakerOfWeek.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-changa font-bold text-brand-black group-hover:text-brand-yellow transition-colors">
                        {weeklyDigest.speakerOfWeek.name}
                      </p>
                      <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-tajawal mt-1">
                        {weeklyDigest.speakerOfWeek.aiPersona}
                      </span>
                      <p className="text-xs text-brand-gray/60 font-tajawal mt-1">{weeklyDigest.speakerOfWeek.reason}</p>
                    </div>
                  </a>
                </div>

                <div className="space-y-3">
                  {weeklyDigest.speakers.map((speaker, index) => (
                    <div key={speaker.id}>
                      <a href={`/speakers/${speaker.id}`} className="flex items-center gap-3 group">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-sm bg-brand-sand">
                            {getInitials(speaker.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-changa font-bold text-brand-black text-sm group-hover:text-brand-yellow transition-colors">
                            {speaker.name}
                          </p>
                          <p className="text-xs text-brand-gray font-tajawal">{speaker.episodesThisWeek} حلقة هذا الأسبوع</p>
                        </div>
                      </a>
                      {index < weeklyDigest.speakers.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full mt-4 gap-2 group">
                  عرض الكل
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Quotes Column */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-changa font-bold text-lg text-brand-black">أهم 3 اقتباسات</h3>
                </div>

                <div className="space-y-4">
                  {weeklyDigest.topQuotes.map((quote, index) => (
                    <div key={quote.id}>
                      <div className="group">
                        <div className="text-2xl text-brand-yellow/40 font-changa leading-none">"</div>
                        <p className="font-tajawal text-brand-black text-sm leading-relaxed mt-1 group-hover:text-brand-yellow transition-colors cursor-pointer">
                          {quote.text}
                        </p>
                        <p className="text-xs text-brand-gray/60 font-tajawal mt-2">
                          — {quote.speaker}
                        </p>
                      </div>
                      {index < weeklyDigest.topQuotes.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full mt-4 gap-2 group">
                  عرض الكل
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Download CTA */}
          <div className="mt-10 text-center">
            <Card className="inline-block shadow-warm">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="text-right">
                  <p className="font-changa font-bold text-lg text-brand-black">
                    احفظ الملخص للقراءة لاحقاً
                  </p>
                  <p className="text-sm text-brand-gray font-tajawal">
                    حمّل نسخة PDF كاملة تشمل جميع المحتوى
                  </p>
                </div>
                <Button size="lg" className="gap-2" onClick={handleDownloadPdf}>
                  <Download className="w-5 h-5" />
                  تحميل PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}




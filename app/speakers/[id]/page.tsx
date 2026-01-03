'use client'

import { Users, Mic, BookOpen, TrendingUp, Brain, Sparkles, BarChart, Play, Clock } from 'lucide-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar'
import { PageHeader } from '@/app/components/page-header'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { AiBadge } from '@/app/components/ui/ai-badge'
import type { AIPersona } from '@/types'

// Mock speaker data
const mockSpeaker = {
  id: '1',
  name: 'أحمد السالم',
  bio: 'خبير في التنمية البشرية والقيادة مع خبرة تزيد عن 15 عاماً في مجال التدريب والتطوير. مؤلف لعدة كتب في مجال القيادة والتأثير.',
  aiPersona: 'قيادي' as AIPersona,
  episodeCount: 12,
  booksCount: 8,
  topTopic: 'القيادة والتأثير',
  
  // AI Insights
  aiToneAnalysis: 'أسلوب تحفيزي مع تركيز على التطبيق العملي',
  aiTopRepeatedTopics: ['القيادة', 'بناء الفرق', 'التأثير', 'التواصل الفعال'],
  aiImpactScore: 92,
  
  // Episodes
  episodes: [
    { id: '1', number: 156, title: 'كيف تبني عادات تدوم؟', duration: 45 },
    { id: '2', number: 148, title: 'فن القيادة الملهمة', duration: 52 },
    { id: '3', number: 140, title: 'التأثير في الآخرين', duration: 38 },
    { id: '4', number: 135, title: 'بناء فرق العمل الناجحة', duration: 41 },
  ],
  
  // Knowledge Links
  knowledgeLinks: [
    { id: 1, label: 'القيادة', x: 150, y: 100 },
    { id: 2, label: 'التأثير', x: 280, y: 80 },
    { id: 3, label: 'التواصل', x: 200, y: 180 },
    { id: 4, label: 'الإلهام', x: 320, y: 160 },
  ],
}

const personaColors: Record<AIPersona, string> = {
  'تحليلي': 'bg-blue-100 text-blue-700',
  'تحفيزي': 'bg-orange-100 text-orange-700',
  'قيادي': 'bg-purple-100 text-purple-700',
  'تقني': 'bg-cyan-100 text-cyan-700',
  'إبداعي': 'bg-pink-100 text-pink-700',
  'استراتيجي': 'bg-emerald-100 text-emerald-700',
}

export default function SpeakerDetailPage() {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand to-white pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <PageHeader
            title=""
            backHref="/speakers"
            backLabel="جميع المتحدثين"
          />

          {/* Hero Card */}
          <Card className="overflow-hidden border-none shadow-warm-lg mb-8">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <Avatar className="w-32 h-32 ring-4 ring-brand-yellow/30">
                  <AvatarFallback className="text-4xl bg-brand-yellow text-brand-black font-changa">
                    {getInitials(mockSpeaker.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-changa font-bold text-brand-black">
                      {mockSpeaker.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-tajawal ${personaColors[mockSpeaker.aiPersona]}`}>
                      AI Persona: {mockSpeaker.aiPersona}
                    </span>
                  </div>

                  <p className="text-brand-gray font-tajawal leading-relaxed mb-6">
                    {mockSpeaker.bio}
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-changa font-bold text-brand-black">{mockSpeaker.episodeCount}</p>
                      <p className="text-sm text-brand-gray font-tajawal">حلقة</p>
                    </div>
                    <div className="w-px h-12 bg-brand-sand" />
                    <div className="text-center">
                      <p className="text-3xl font-changa font-bold text-brand-black">{mockSpeaker.booksCount}</p>
                      <p className="text-sm text-brand-gray font-tajawal">كتاب</p>
                    </div>
                    <div className="w-px h-12 bg-brand-sand" />
                    <div className="text-center">
                      <p className="text-3xl font-changa font-bold text-brand-yellow">{mockSpeaker.aiImpactScore}%</p>
                      <p className="text-sm text-brand-gray font-tajawal">درجة التأثير</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="mb-8 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-yellow/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <h2 className="font-changa font-bold text-xl text-brand-black">AI Insights</h2>
                  <AiBadge text="تحليل ذكي" variant="subtle" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Tone Analysis */}
                <div className="bg-brand-sand/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart className="w-4 h-4 text-brand-yellow" />
                    <span className="text-sm text-brand-gray font-tajawal">تحليل اللهجة</span>
                  </div>
                  <p className="font-tajawal text-brand-black text-sm leading-relaxed">
                    {mockSpeaker.aiToneAnalysis}
                  </p>
                </div>

                {/* Repeated Topics */}
                <div className="bg-brand-sand/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-brand-yellow" />
                    <span className="text-sm text-brand-gray font-tajawal">المواضيع المتكررة</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mockSpeaker.aiTopRepeatedTopics.map((topic, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded-full font-tajawal">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Impact Score */}
                <div className="bg-brand-sand/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-brand-yellow" />
                    <span className="text-sm text-brand-gray font-tajawal">درجة التأثير</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-yellow rounded-full" 
                        style={{ width: `${mockSpeaker.aiImpactScore}%` }}
                      />
                    </div>
                    <span className="font-changa font-bold text-brand-black">{mockSpeaker.aiImpactScore}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Episodes Section */}
          <Card className="mb-8 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-yellow/20 rounded-xl flex items-center justify-center">
                  <Mic className="w-5 h-5 text-brand-yellow" />
                </div>
                <h2 className="font-changa font-bold text-xl text-brand-black">الحلقات</h2>
              </div>

              <div className="space-y-3">
                {mockSpeaker.episodes.map((episode) => (
                  <a 
                    key={episode.id}
                    href={`/episodes/${episode.id}`}
                    className="flex items-center gap-4 p-4 bg-brand-sand/30 rounded-xl hover:bg-brand-sand transition-colors group"
                  >
                    <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center shadow-warm">
                      <span className="font-changa font-bold text-brand-black">{episode.number}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-changa font-bold text-brand-black group-hover:text-brand-yellow transition-colors">
                        {episode.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-brand-gray">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-tajawal">{episode.duration} دقيقة</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="gap-1.5">
                      <Play className="w-4 h-4" />
                      استمع
                    </Button>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Links */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-yellow/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-brand-yellow" />
                </div>
                <h2 className="font-changa font-bold text-xl text-brand-black">خريطة الأفكار</h2>
              </div>

              <div className="bg-brand-sand/30 rounded-2xl p-4">
                <svg viewBox="0 0 400 250" className="w-full h-auto max-h-[200px]">
                  {/* Center node - Speaker */}
                  <circle cx="200" cy="125" r="35" fill="#F2C94C" />
                  <text x="200" y="125" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold">
                    {mockSpeaker.name.split(' ')[0]}
                  </text>

                  {/* Links */}
                  {mockSpeaker.knowledgeLinks.map((link) => (
                    <line 
                      key={link.id}
                      x1="200" y1="125" 
                      x2={link.x} y2={link.y} 
                      stroke="#F2C94C" 
                      strokeWidth="2" 
                      strokeOpacity="0.3" 
                    />
                  ))}

                  {/* Topic nodes */}
                  {mockSpeaker.knowledgeLinks.map((link) => (
                    <g key={link.id} className="cursor-pointer">
                      <circle cx={link.x} cy={link.y} r="28" fill="#4F4F4F" />
                      <text 
                        x={link.x} y={link.y} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fill="white" 
                        fontSize="9" 
                        fontWeight="bold"
                      >
                        {link.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}




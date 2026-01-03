'use client'

import { useState } from 'react'
import { Play, Pause, Calendar, Clock, Sparkles, Users, X, ChevronLeft, Lightbulb } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoodBadge, SentimentMeter } from './ui/mood-badge'
import { EpisodeTimeline } from './ui/episode-timeline'
import { AiBadge } from './ui/ai-badge'
import { useStore } from '@/hooks/useStore'
import { formatDate } from '@/lib/utils'
import type { Episode, Speaker, EpisodeChapter, AIMood } from '@/types'

interface ExtendedEpisode extends Omit<Episode, 'speakers'> {
  speakers?: { speaker: Speaker }[]
}

interface LatestEpisodeProps {
  episode?: ExtendedEpisode
}

// Mock data for demonstration
const mockEpisode: ExtendedEpisode = {
  id: '1',
  title: 'كيف تبني عادات تدوم؟ - مناقشة كتاب القوة الذرية',
  date: new Date().toISOString(),
  summaryAI: 'في هذه الحلقة نناقش كتاب "العادات الذرية" لجيمس كلير، ونستعرض كيف يمكن للتغييرات الصغيرة أن تحدث فرقاً كبيراً في حياتنا. نتحدث عن قوة العادات المركبة.',
  topicsAI: 'العادات,التطوير الذاتي,الإنتاجية,القراءة',
  aiMood: 'تحفيزي',
  duration: 45,
  episodeNumber: 156,
  chapters: [
    { time: '00:00', timeSeconds: 0, label: 'مقدمة' },
    { time: '05:30', timeSeconds: 330, label: 'كتاب العادات الذرية' },
    { time: '20:10', timeSeconds: 1210, label: 'نقاش حول بناء العادات' },
    { time: '31:45', timeSeconds: 1905, label: 'تطبيقات حياتية' },
  ],
  keyBullets: [
    'التحسن بنسبة 1% يومياً يؤدي لنتائج مذهلة على المدى البعيد',
    'ركّز على النظام وليس الهدف فقط',
    'اربط العادة الجديدة بعادة موجودة لديك',
    'البيئة أقوى من قوة الإرادة',
    'احتفل بالإنجازات الصغيرة لتعزيز الدافع',
  ],
  speakers: [
    { speaker: { id: '1', name: 'أحمد السالم', bioAI: 'خبير في التنمية البشرية' } },
    { speaker: { id: '2', name: 'سارة الخالد', bioAI: 'كاتبة ومؤلفة' } },
  ],
}

export function LatestEpisode({ episode = mockEpisode }: LatestEpisodeProps) {
  const [showHighlights, setShowHighlights] = useState(false)
  const { isPlaying, currentEpisodeId, playEpisode, pauseEpisode } = useStore()
  const isCurrentlyPlaying = isPlaying && currentEpisodeId === episode.id

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pauseEpisode()
    } else {
      playEpisode(episode.id)
    }
  }

  const handleSeek = (timeSeconds: number) => {
    console.log('Seek to:', timeSeconds, 'seconds')
  }

  const topics = episode.topicsAI?.split(',') || []
  const speakers = episode.speakers || []

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-brand-sand">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-black" />
          </div>
          <h2 className="text-2xl md:text-3xl font-changa font-bold text-brand-black">الحلقة الأخيرة</h2>
        </div>

        <Card className="overflow-hidden border-none shadow-warm-lg bg-white">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Left Side - Episode Info (3 cols) */}
              <div className="lg:col-span-3 p-6 lg:p-8">
                {/* Top Row: Date, Duration, Mood */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-brand-gray">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-tajawal">{formatDate(episode.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-gray">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-tajawal">{episode.duration || 45} دقيقة</span>
                  </div>
                  {episode.aiMood && (
                    <MoodBadge mood={episode.aiMood as AIMood} />
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-changa font-bold text-brand-black mb-4 leading-tight">
                  {episode.title}
                </h3>

                {/* Speakers Avatars Row */}
                {speakers.length > 0 && (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-brand-gray">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-tajawal">المتحدثون:</span>
                    </div>
                    <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                      {speakers.map(({ speaker }) => (
                        <div key={speaker.id} className="group relative">
                          <Avatar className="w-10 h-10 border-2 border-white ring-2 ring-brand-yellow/20 hover:ring-brand-yellow/50 transition-all cursor-pointer">
                            <AvatarImage src={speaker.avatarAI} alt={speaker.name} />
                            <AvatarFallback className="text-xs bg-brand-yellow text-brand-black">
                              {getInitials(speaker.name)}
                            </AvatarFallback>
                          </Avatar>
                          {/* Tooltip */}
                          <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 bg-brand-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {speaker.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-brand-gray font-tajawal">
                      {speakers.map(s => s.speaker.name).join('، ')}
                    </span>
                  </div>
                )}

                {/* AI Summary */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AiBadge text="ملخص ذكي" variant="subtle" icon="sparkles" />
                  </div>
                  <p className="text-brand-gray font-tajawal leading-relaxed text-sm lg:text-base line-clamp-3">
                    {episode.summaryAI}
                  </p>
                </div>

                {/* AI Sentiment Meter */}
                {episode.aiMood && (
                  <div className="mb-4">
                    <SentimentMeter mood={episode.aiMood as AIMood} />
                  </div>
                )}

                {/* Topics */}
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-brand-sand text-brand-gray text-sm rounded-full font-tajawal"
                      >
                        {topic.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Episode Timeline */}
                {episode.chapters && episode.chapters.length > 0 && (
                  <div className="mb-6">
                    <EpisodeTimeline 
                      chapters={episode.chapters} 
                      onSeek={handleSeek}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={handlePlayPause} size="lg" className="gap-2">
                    {isCurrentlyPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        إيقاف
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        استمع الآن
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2"
                    onClick={() => setShowHighlights(true)}
                  >
                    <Lightbulb className="w-5 h-5" />
                    استكشف نقاط الحلقة
                  </Button>
                </div>
              </div>

              {/* Right Side - Visual (2 cols) */}
              <div className="lg:col-span-2 relative bg-gradient-to-br from-brand-yellow to-brand-yellow/80 min-h-[250px] lg:min-h-full flex items-center justify-center">
                {/* Decorative Pattern */}
                <div className="absolute inset-0 pattern-grid opacity-30" />
                
                {/* Large Play Button */}
                <button
                  onClick={handlePlayPause}
                  className="relative z-10 w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-warm-lg hover:scale-105 transition-transform duration-300"
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-8 h-8 lg:w-10 lg:h-10 text-brand-black" />
                  ) : (
                    <Play className="w-8 h-8 lg:w-10 lg:h-10 text-brand-black mr-[-4px]" />
                  )}
                </button>

                {/* Sound Waves */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 border-4 border-white/20 rounded-full animate-ping" />
                  <div className="absolute w-40 h-40 lg:w-48 lg:h-48 border-4 border-white/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Episode Number Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="font-changa font-bold text-brand-black text-sm">الحلقة #{episode.episodeNumber || 156}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlights Modal */}
      {showHighlights && (
        <EpisodeHighlightsModal
          bullets={episode.keyBullets || []}
          episodeTitle={episode.title}
          onClose={() => setShowHighlights(false)}
        />
      )}
    </section>
  )
}

// Episode Highlights Modal Component
interface EpisodeHighlightsModalProps {
  bullets: string[]
  episodeTitle: string
  onClose: () => void
}

function EpisodeHighlightsModal({ bullets, episodeTitle, onClose }: EpisodeHighlightsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-warm-lg max-w-lg w-full max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-sand">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h3 className="font-changa font-bold text-lg text-brand-black">نقاط الحلقة الرئيسية</h3>
              <p className="text-xs text-brand-gray font-tajawal">مُستخرجة بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-sand flex items-center justify-center hover:bg-brand-yellow/30 transition-colors"
          >
            <X className="w-4 h-4 text-brand-gray" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <p className="text-sm text-brand-gray font-tajawal mb-4 line-clamp-2">
            {episodeTitle}
          </p>
          
          <ul className="space-y-3">
            {bullets.map((bullet, index) => (
              <li 
                key={index}
                className="flex items-start gap-3 p-3 bg-brand-sand/50 rounded-xl animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-changa font-bold text-brand-black">{index + 1}</span>
                </div>
                <p className="text-sm font-tajawal text-brand-black leading-relaxed">
                  {bullet}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-sand">
          <Button onClick={onClose} className="w-full gap-2">
            <ChevronLeft className="w-4 h-4" />
            العودة للحلقة
          </Button>
        </div>
      </div>
    </div>
  )
}

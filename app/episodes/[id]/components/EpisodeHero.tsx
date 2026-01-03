'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Hash, 
  Share2, 
  Bookmark, 
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Download
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import { MoodBadge } from './AiBadge'
import { InlineStat } from './StatPill'
import type { FullEpisode, EpisodeSpeaker, EpisodeChapter } from '@/lib/api/episodes'
import { formatDuration, formatDateAr, parseChapters } from '@/lib/api/episodes'

interface EpisodeHeroProps {
  episode: FullEpisode
  speakers: EpisodeSpeaker[]
  onChapterClick?: (chapter: EpisodeChapter) => void
}

// Audio Waveform Visualizer
function AudioWaveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-end justify-center gap-0.5 h-16">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 bg-brand-yellow/80 rounded-full transition-all duration-200',
            isPlaying ? 'animate-wave' : ''
          )}
          style={{
            height: `${15 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%`,
            animationDelay: `${i * 0.05}s`,
            animationDuration: `${0.6 + Math.random() * 0.3}s`,
          }}
        />
      ))}
    </div>
  )
}

export function EpisodeHero({ episode, speakers, onChapterClick }: EpisodeHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const chapters = parseChapters(episode.chaptersJson)
  const duration = episode.duration || 0
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Update current time
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    audio.addEventListener('timeupdate', updateTime)
    return () => audio.removeEventListener('timeupdate', updateTime)
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const seekTo = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration))
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    seekTo(newTime)
  }

  return (
    <section className="relative bg-gradient-to-b from-brand-yellow via-brand-yellow/90 to-brand-sand overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-sand/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      <div className="relative container-custom px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-28 lg:pb-16">
        {/* Hidden Audio Element */}
        {episode.audioUrl && (
          <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />
        )}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Episode Info */}
          <div className="order-2 lg:order-1">
            {/* Episode Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {episode.episodeNumber && (
                <span className="inline-flex items-center gap-1.5 bg-brand-black text-white text-sm font-tajawal font-medium px-3 py-1 rounded-full">
                  <Hash className="w-3.5 h-3.5" />
                  الحلقة {episode.episodeNumber}
                </span>
              )}
              {episode.aiMood && (
                <MoodBadge mood={episode.aiMood} size="sm" />
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-changa font-bold text-brand-black mb-4 leading-tight">
              {episode.title}
            </h1>

            {/* Episode Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-brand-gray">
              <InlineStat 
                icon={Calendar} 
                value={formatDateAr(episode.date)} 
              />
              <InlineStat 
                icon={Clock} 
                value={formatDuration(episode.duration)} 
                label="مدة الحلقة"
              />
            </div>

            {/* Summary */}
            {episode.summaryAI && (
              <p className="text-base md:text-lg font-tajawal text-brand-gray leading-relaxed mb-6 line-clamp-3">
                {episode.summaryAI}
              </p>
            )}

            {/* Speakers */}
            {speakers.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-tajawal text-brand-gray mb-2">المتحدثون</p>
                <div className="flex flex-wrap gap-2">
                  {speakers.map((speaker) => (
                    <a
                      key={speaker.id}
                      href={`/speakers/${speaker.id}`}
                      className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/50 hover:bg-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-sand flex items-center justify-center">
                        {speaker.avatarAI ? (
                          <img 
                            src={speaker.avatarAI} 
                            alt={speaker.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-brand-gray">
                            {speaker.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-tajawal font-medium text-brand-black">
                        {speaker.name}
                      </span>
                      {speaker.aiPersona && (
                        <span className="text-xs text-brand-gray bg-brand-sand px-2 py-0.5 rounded-full">
                          {speaker.aiPersona}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                {isBookmarked ? 'تم الحفظ' : 'حفظ'}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                مشاركة
              </Button>
              {episode.audioUrl && (
                <Button variant="ghost" size="sm" className="gap-2" asChild>
                  <a href={episode.audioUrl} download>
                    <Download className="w-4 h-4" />
                    تحميل
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Right: Audio Player Card */}
          <div className="order-1 lg:order-2">
            <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-warm-lg border border-white/50">
              {/* Waveform */}
              <div className="bg-brand-sand/50 rounded-2xl p-4 mb-4">
                <AudioWaveform isPlaying={isPlaying} />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div 
                  className="h-2 bg-brand-sand rounded-full cursor-pointer overflow-hidden group"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-brand-yellow rounded-full transition-all duration-100 group-hover:bg-brand-yellow/80"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-tajawal text-brand-gray mt-1">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button 
                  onClick={() => skip(-15)}
                  className="p-2 hover:bg-brand-sand rounded-full transition-colors"
                  title="15 ثانية للخلف"
                >
                  <SkipBack className="w-5 h-5 text-brand-gray" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-brand-yellow rounded-full flex items-center justify-center shadow-warm hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-brand-black" />
                  ) : (
                    <Play className="w-6 h-6 text-brand-black mr-0.5" />
                  )}
                </button>

                <button 
                  onClick={() => skip(15)}
                  className="p-2 hover:bg-brand-sand rounded-full transition-colors"
                  title="15 ثانية للأمام"
                >
                  <SkipForward className="w-5 h-5 text-brand-gray" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={toggleMute}
                  className="p-2 hover:bg-brand-sand rounded-full transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-brand-gray" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-brand-gray" />
                  )}
                </button>

                <span className="text-sm font-tajawal text-brand-gray">
                  {episode.audioUrl ? 'جاهز للتشغيل' : 'الملف الصوتي غير متوفر'}
                </span>
              </div>

              {/* Quick Chapters */}
              {chapters.length > 0 && (
                <div className="mt-4 pt-4 border-t border-brand-sand">
                  <p className="text-xs font-tajawal text-brand-gray mb-2">انتقل إلى</p>
                  <div className="flex flex-wrap gap-1.5">
                    {chapters.slice(0, 4).map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          seekTo(chapter.timeSeconds)
                          onChapterClick?.(chapter)
                        }}
                        className="text-xs font-tajawal px-2 py-1 bg-brand-sand/50 hover:bg-brand-yellow/30 rounded-full transition-colors"
                      >
                        {chapter.time} {chapter.titleAr}
                      </button>
                    ))}
                    {chapters.length > 4 && (
                      <span className="text-xs text-brand-gray px-2 py-1">
                        +{chapters.length - 4} أخرى
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0 60L60 52C120 44 240 28 360 24C480 20 600 28 720 32C840 36 960 36 1080 32C1200 28 1320 20 1380 16L1440 12V60H0Z"
            fill="#FFF7D9"
          />
        </svg>
      </div>
    </section>
  )
}

export default EpisodeHero


'use client'

import { Mic, Play, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import type { BookEpisode } from '@/lib/api/books'

interface BookEpisodesProps {
  episodes: BookEpisode[]
}

export function BookEpisodes({ episodes }: BookEpisodesProps) {
  if (episodes.length === 0) {
    return null
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--'
    const minutes = Math.floor(seconds / 60)
    return `${minutes} دقيقة`
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getMoodColor = (mood: string | null) => {
    const colors: Record<string, string> = {
      'تحفيزي': 'bg-orange-100 text-orange-700',
      'معرفي': 'bg-blue-100 text-blue-700',
      'نقاشي': 'bg-purple-100 text-purple-700',
      'تحليلي': 'bg-teal-100 text-teal-700',
      'ملهم': 'bg-amber-100 text-amber-700',
      'هادئ': 'bg-green-100 text-green-700',
    }
    return colors[mood || ''] || 'bg-gray-100 text-gray-600'
  }

  // Parse highlights if available
  const getHighlight = (highlightsJson: string | null): string | null => {
    if (!highlightsJson) return null
    try {
      const highlights = JSON.parse(highlightsJson)
      if (Array.isArray(highlights) && highlights.length > 0) {
        return highlights[0].text || highlights[0]
      }
    } catch {
      return null
    }
    return null
  }

  return (
    <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-sand/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-brand-yellow" />
          </div>
          <div>
            <h2 className="font-changa font-bold text-xl text-brand-black">
              الحلقات التي ناقشت هذا الكتاب
            </h2>
            <p className="text-sm text-brand-gray font-tajawal">
              {episodes.length} حلقة
            </p>
          </div>
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes.map((episode) => {
            const highlight = getHighlight(episode.highlightsJson)
            
            return (
              <Link
                key={episode.id}
                href={`/episodes/${episode.id}`}
                className="group block"
              >
                <div className="h-full bg-brand-sand/30 hover:bg-brand-sand/60 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-brand-yellow/30 hover:shadow-warm">
                  {/* Episode Number & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="font-changa font-bold text-sm text-brand-black">
                          {episode.episodeNumber || '#'}
                        </span>
                      </div>
                      <span className="text-xs text-brand-gray font-tajawal">
                        {formatDate(episode.date)}
                      </span>
                    </div>
                    
                    {/* AI Mood Badge */}
                    {episode.aiMood && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-tajawal ${getMoodColor(episode.aiMood)}`}>
                        {episode.aiMood}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-changa font-bold text-brand-black mb-2 line-clamp-2 group-hover:text-brand-yellow transition-colors">
                    {episode.title}
                  </h3>

                  {/* Duration */}
                  <div className="flex items-center gap-1 text-sm text-brand-gray font-tajawal mb-3">
                    <Clock className="w-4 h-4" />
                    {formatDuration(episode.duration)}
                  </div>

                  {/* Highlight Snippet */}
                  {highlight && (
                    <div className="bg-white/80 rounded-xl p-3 mb-3 border border-brand-yellow/10">
                      <div className="flex items-center gap-1.5 text-xs text-brand-gray mb-1.5">
                        <Sparkles className="w-3 h-3 text-brand-yellow" />
                        <span className="font-tajawal">مقتطف من الحلقة</span>
                      </div>
                      <p className="text-xs text-brand-gray/80 font-tajawal line-clamp-2">
                        "{highlight}"
                      </p>
                    </div>
                  )}

                  {/* Play Button */}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full gap-1.5 group-hover:bg-brand-yellow group-hover:text-brand-black transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    انتقل للحلقة
                  </Button>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BookEpisodes




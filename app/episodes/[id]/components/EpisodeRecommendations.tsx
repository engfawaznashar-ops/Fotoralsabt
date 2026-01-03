'use client'

import { Sparkles, Clock, Hash, ArrowLeft, Play } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import type { RecommendedEpisode } from '@/lib/api/episodes'
import { formatDuration, formatDateAr } from '@/lib/api/episodes'

interface EpisodeRecommendationsProps {
  recommendations: RecommendedEpisode[]
  currentEpisodeId: string
  className?: string
}

export function EpisodeRecommendations({ 
  recommendations, 
  currentEpisodeId,
  className 
}: EpisodeRecommendationsProps) {
  // Filter out current episode if present
  const filteredRecommendations = recommendations.filter(r => r.id !== currentEpisodeId)

  if (filteredRecommendations.length === 0) return null

  return (
    <section className={cn('py-12 lg:py-16', className)}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl font-changa font-bold text-brand-black">
                حلقات مشابهة
              </h2>
              <p className="text-sm text-brand-gray font-tajawal">
                توصيات مخصصة بناءً على محتوى الحلقة
              </p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <a href="/episodes">
              جميع الحلقات
              <ArrowLeft className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Recommendations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRecommendations.slice(0, 4).map((episode, index) => (
            <a
              key={episode.id}
              href={`/episodes/${episode.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-card border border-brand-sand hover:shadow-card-hover hover:border-brand-yellow/30 transition-all duration-300"
            >
              {/* Episode Card Header */}
              <div className="relative bg-gradient-to-br from-brand-yellow/30 to-brand-sand p-4 h-32 flex items-end">
                {/* Episode Number Badge */}
                {episode.metadata?.episodeNumber && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-brand-black text-white text-xs font-tajawal font-medium px-2 py-1 rounded-full">
                    <Hash className="w-3 h-3" />
                    {episode.metadata.episodeNumber}
                  </span>
                )}
                
                {/* Match Score */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-tajawal font-medium text-brand-black">
                    {Math.round(episode.score * 100)}% تطابق
                  </span>
                </div>

                {/* Play Button */}
                <button className="absolute bottom-4 left-4 w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center shadow-warm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 text-brand-black fill-current ml-0.5" />
                </button>
              </div>

              {/* Episode Info */}
              <div className="p-4">
                <h3 className="font-changa font-bold text-brand-black mb-2 line-clamp-2 group-hover:text-brand-gray transition-colors">
                  {episode.titleAr || episode.title}
                </h3>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-gray mb-3">
                  {episode.metadata?.date && (
                    <span>{formatDateAr(episode.metadata.date)}</span>
                  )}
                  {episode.metadata?.duration && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(episode.metadata.duration)}
                    </span>
                  )}
                </div>

                {/* Reason */}
                <p className="text-xs font-tajawal text-brand-gray line-clamp-2 bg-brand-sand/50 p-2 rounded-lg">
                  <Sparkles className="w-3 h-3 inline mr-1 text-brand-yellow" />
                  {episode.reasonAr || episode.reason}
                </p>

                {/* Speakers */}
                {episode.metadata?.speakers && episode.metadata.speakers.length > 0 && (
                  <div className="mt-3 flex items-center gap-1">
                    <div className="flex -space-x-2 space-x-reverse">
                      {episode.metadata.speakers.slice(0, 3).map((speaker, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 rounded-full bg-brand-sand border-2 border-white flex items-center justify-center"
                          title={speaker}
                        >
                          <span className="text-[10px] font-bold text-brand-gray">
                            {speaker.charAt(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {episode.metadata.speakers.length > 3 && (
                      <span className="text-xs text-brand-gray">
                        +{episode.metadata.speakers.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* View All Link */}
        {filteredRecommendations.length > 4 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="gap-2" asChild>
              <a href="/episodes">
                عرض المزيد من الحلقات
                <ArrowLeft className="w-4 h-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default EpisodeRecommendations


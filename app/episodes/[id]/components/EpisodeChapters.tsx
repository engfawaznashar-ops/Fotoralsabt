'use client'

import { useState } from 'react'
import { Clock, Play, ChevronDown, ChevronUp, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EpisodeChapter } from '@/lib/api/episodes'
import { formatDuration } from '@/lib/api/episodes'

interface EpisodeChaptersProps {
  chapters: EpisodeChapter[]
  currentTime?: number
  totalDuration?: number
  onSeek?: (timeSeconds: number) => void
  className?: string
}

export function EpisodeChapters({
  chapters,
  currentTime = 0,
  totalDuration = 0,
  onSeek,
  className,
}: EpisodeChaptersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (chapters.length === 0) return null

  // Find current chapter
  const currentChapterIndex = chapters.findIndex((chapter, index) => {
    const nextChapter = chapters[index + 1]
    if (!nextChapter) return true
    return currentTime >= chapter.timeSeconds && currentTime < nextChapter.timeSeconds
  })

  const displayChapters = isExpanded ? chapters : chapters.slice(0, 5)

  return (
    <section className={cn('py-12 lg:py-16', className)}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-brand-black" />
          </div>
          <div>
            <h2 className="text-2xl font-changa font-bold text-brand-black">
              فصول الحلقة
            </h2>
            <p className="text-sm text-brand-gray font-tajawal">
              {chapters.length} فصل • انقر للانتقال
            </p>
          </div>
        </div>

        {/* Progress Bar with Chapter Markers */}
        {totalDuration > 0 && (
          <div className="mb-8">
            <div className="relative h-2 bg-brand-sand rounded-full overflow-hidden">
              {/* Progress */}
              <div 
                className="absolute inset-y-0 left-0 bg-brand-yellow rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
              {/* Chapter Markers */}
              {chapters.map((chapter, index) => {
                const position = (chapter.timeSeconds / totalDuration) * 100
                return (
                  <button
                    key={chapter.id}
                    onClick={() => onSeek?.(chapter.timeSeconds)}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform hover:scale-125',
                      index === currentChapterIndex
                        ? 'bg-brand-black border-brand-black'
                        : 'bg-white border-brand-gray/30 hover:border-brand-yellow'
                    )}
                    style={{ left: `${position}%` }}
                    title={chapter.titleAr}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs font-tajawal text-brand-gray mt-1">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
          </div>
        )}

        {/* Chapters List */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-sand overflow-hidden">
          <div className="divide-y divide-brand-sand">
            {displayChapters.map((chapter, index) => {
              const isActive = index === currentChapterIndex
              const isPast = chapters.findIndex(c => c.id === chapter.id) < currentChapterIndex
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => onSeek?.(chapter.timeSeconds)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 text-right transition-colors hover:bg-brand-sand/50',
                    isActive && 'bg-brand-yellow/10'
                  )}
                >
                  {/* Time Badge */}
                  <div 
                    className={cn(
                      'flex-shrink-0 px-3 py-1.5 rounded-lg font-tajawal text-sm font-medium',
                      isActive 
                        ? 'bg-brand-yellow text-brand-black' 
                        : isPast
                          ? 'bg-brand-sand text-brand-gray'
                          : 'bg-brand-sand text-brand-gray'
                    )}
                  >
                    {chapter.time}
                  </div>

                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-tajawal font-medium truncate',
                      isActive ? 'text-brand-black' : 'text-brand-gray'
                    )}>
                      {chapter.titleAr || chapter.title}
                    </p>
                    {chapter.topics && chapter.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {chapter.topics.slice(0, 3).map((topic, i) => (
                          <span key={i} className="text-xs text-brand-gray/70 bg-brand-sand px-1.5 py-0.5 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Play Indicator */}
                  {isActive ? (
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-brand-black fill-current" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-sand flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-3 h-3 text-brand-gray" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Expand/Collapse Button */}
          {chapters.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 p-4 text-sm font-tajawal text-brand-gray hover:bg-brand-sand/50 transition-colors border-t border-brand-sand"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  عرض أقل
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  عرض كل الفصول ({chapters.length})
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default EpisodeChapters


'use client'

import { useState } from 'react'
import { Clock, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EpisodeChapter } from '@/types'

interface EpisodeTimelineProps {
  chapters: EpisodeChapter[]
  onSeek?: (timeSeconds: number) => void
  className?: string
}

export function EpisodeTimeline({ chapters, onSeek, className }: EpisodeTimelineProps) {
  const [activeChapter, setActiveChapter] = useState<number>(0)

  const handleChapterClick = (index: number, timeSeconds: number) => {
    setActiveChapter(index)
    if (onSeek) {
      onSeek(timeSeconds)
    } else {
      console.log('Seek to:', timeSeconds, 'seconds')
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-brand-gray">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-tajawal font-medium">محاور الحلقة</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {chapters.map((chapter, index) => (
          <button
            key={index}
            onClick={() => handleChapterClick(index, chapter.timeSeconds)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-tajawal transition-all duration-200',
              activeChapter === index
                ? 'bg-brand-yellow text-brand-black shadow-warm'
                : 'bg-brand-sand text-brand-gray hover:bg-brand-yellow/30'
            )}
          >
            <span className="text-xs opacity-70">{chapter.time}</span>
            <span>{chapter.label}</span>
            {activeChapter === index && (
              <Play className="w-3 h-3 fill-current" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

interface CompactTimelineProps {
  chapters: EpisodeChapter[]
  currentTime?: number
  totalDuration?: number
  onSeek?: (timeSeconds: number) => void
  className?: string
}

export function CompactTimeline({
  chapters,
  currentTime = 0,
  totalDuration = 2700,
  onSeek,
  className,
}: CompactTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Progress bar */}
      <div className="h-2 bg-brand-sand rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-yellow rounded-full transition-all duration-300"
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        />
      </div>
      
      {/* Chapter markers */}
      <div className="relative h-0">
        {chapters.map((chapter, index) => {
          const position = (chapter.timeSeconds / totalDuration) * 100
          return (
            <button
              key={index}
              onClick={() => onSeek?.(chapter.timeSeconds)}
              className="absolute top-[-4px] w-3 h-3 bg-white border-2 border-brand-yellow rounded-full transform -translate-x-1/2 hover:scale-125 transition-transform"
              style={{ left: `${position}%` }}
              title={`${chapter.time} - ${chapter.label}`}
            />
          )
        })}
      </div>
    </div>
  )
}




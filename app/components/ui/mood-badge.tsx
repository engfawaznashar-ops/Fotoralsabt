'use client'

import { cn } from '@/lib/utils'
import type { AIMood } from '@/types'

interface MoodBadgeProps {
  mood: AIMood
  className?: string
  showBar?: boolean
}

const moodConfig: Record<AIMood, { color: string; bgColor: string; barColor: string }> = {
  'تحفيزي': {
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    barColor: 'bg-orange-400',
  },
  'معرفي': {
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    barColor: 'bg-blue-400',
  },
  'نقاشي': {
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    barColor: 'bg-purple-400',
  },
  'تحليلي': {
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    barColor: 'bg-indigo-400',
  },
  'ملهم': {
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    barColor: 'bg-emerald-400',
  },
  'هادئ': {
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
    barColor: 'bg-cyan-400',
  },
}

export function MoodBadge({ mood, className, showBar = false }: MoodBadgeProps) {
  const config = moodConfig[mood] || moodConfig['معرفي']

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'px-2.5 py-1 rounded-full text-xs font-tajawal font-medium',
          config.bgColor,
          config.color
        )}
      >
        {mood}
      </span>
      {showBar && (
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-24">
          <div
            className={cn('h-full rounded-full', config.barColor)}
            style={{ width: '75%' }}
          />
        </div>
      )}
    </div>
  )
}

interface SentimentMeterProps {
  mood: AIMood
  className?: string
}

export function SentimentMeter({ mood, className }: SentimentMeterProps) {
  const config = moodConfig[mood] || moodConfig['معرفي']

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-tajawal text-brand-gray">نبرة الحلقة</span>
        <span
          className={cn(
            'text-xs font-tajawal font-medium',
            config.color
          )}
        >
          {mood}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            config.barColor
          )}
          style={{ width: '75%' }}
        />
      </div>
    </div>
  )
}




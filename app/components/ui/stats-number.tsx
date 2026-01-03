'use client'

import { cn } from '@/lib/utils'

interface StatsNumberProps {
  value: string
  label: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

const sizeStyles = {
  sm: {
    value: 'text-xl',
    label: 'text-xs',
  },
  md: {
    value: 'text-3xl',
    label: 'text-sm',
  },
  lg: {
    value: 'text-4xl md:text-5xl',
    label: 'text-base',
  },
}

export function StatsNumber({
  value,
  label,
  className,
  size = 'md',
  animate = true,
}: StatsNumberProps) {
  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        'text-center',
        animate && 'animate-fade-in',
        className
      )}
    >
      <p
        className={cn(
          'font-changa font-bold text-brand-black',
          styles.value
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          'text-brand-gray font-tajawal mt-1',
          styles.label
        )}
      >
        {label}
      </p>
    </div>
  )
}

interface StatsRowProps {
  stats: { value: string; label: string }[]
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showDividers?: boolean
}

export function StatsRow({
  stats,
  className,
  size = 'md',
  showDividers = true,
}: StatsRowProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-6 md:gap-8',
        className
      )}
    >
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-6 md:gap-8">
          <StatsNumber
            value={stat.value}
            label={stat.label}
            size={size}
            animate
          />
          {showDividers && index < stats.length - 1 && (
            <div className="hidden md:block w-px h-10 bg-brand-black/20" />
          )}
        </div>
      ))}
    </div>
  )
}




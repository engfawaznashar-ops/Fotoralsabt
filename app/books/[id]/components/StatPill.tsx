'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatPillProps {
  icon: LucideIcon
  value: string | number
  label: string
  variant?: 'default' | 'highlight' | 'muted'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatPill({
  icon: Icon,
  value,
  label,
  variant = 'default',
  size = 'md',
  className,
}: StatPillProps) {
  const variantClasses = {
    default: 'bg-white border-brand-sand',
    highlight: 'bg-brand-yellow/10 border-brand-yellow/30',
    muted: 'bg-brand-sand/50 border-brand-sand',
  }

  const sizeClasses = {
    sm: 'px-3 py-2 gap-2',
    md: 'px-4 py-3 gap-3',
    lg: 'px-5 py-4 gap-4',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const valueSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }

  return (
    <div
      className={cn(
        'flex items-center rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-card',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 bg-brand-yellow/20 rounded-xl">
        <Icon className={cn(iconSizes[size], 'text-brand-black')} />
      </div>
      <div className="text-right">
        <p className={cn('font-changa font-bold text-brand-black', valueSizes[size])}>
          {value}
        </p>
        <p className="text-xs font-tajawal text-brand-gray">{label}</p>
      </div>
    </div>
  )
}

// Stats Row Component
interface StatsRowProps {
  stats: Array<{
    icon: LucideIcon
    value: string | number
    label: string
  }>
  variant?: 'default' | 'highlight' | 'muted'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatsRow({ stats, variant = 'default', size = 'md', className }: StatsRowProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {stats.map((stat, index) => (
        <StatPill
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  )
}

// Inline Stat
interface InlineStatProps {
  icon: LucideIcon
  value: string | number
  label?: string
  className?: string
}

export function InlineStat({ icon: Icon, value, label, className }: InlineStatProps) {
  return (
    <div className={cn('inline-flex items-center gap-1.5 text-sm text-brand-gray', className)}>
      <Icon className="w-4 h-4" />
      <span className="font-tajawal font-medium">{value}</span>
      {label && <span className="text-brand-gray/70">{label}</span>}
    </div>
  )
}

export default StatPill




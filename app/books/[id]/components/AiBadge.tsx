'use client'

import { Sparkles, Brain, Lightbulb, Zap, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AiBadgeProps {
  text: string
  variant?: 'default' | 'subtle' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  icon?: 'sparkles' | 'brain' | 'lightbulb' | 'zap' | 'book'
  className?: string
}

const icons = {
  sparkles: Sparkles,
  brain: Brain,
  lightbulb: Lightbulb,
  zap: Zap,
  book: BookOpen,
}

export function AiBadge({
  text,
  variant = 'default',
  size = 'md',
  icon = 'sparkles',
  className,
}: AiBadgeProps) {
  const Icon = icons[icon]

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const variantClasses = {
    default: 'bg-brand-sand text-brand-gray border border-brand-yellow/30',
    subtle: 'bg-brand-yellow/10 text-brand-gray',
    glow: 'bg-gradient-to-r from-brand-yellow/20 to-brand-sand text-brand-black border border-brand-yellow/40 shadow-warm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-tajawal font-medium rounded-full transition-all duration-200',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <Icon className={cn(iconSizes[size], 'animate-pulse-slow')} />
      <span>{text}</span>
    </span>
  )
}

// Category Badge
interface CategoryBadgeProps {
  category: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  const categoryConfig: Record<string, { bg: string; text: string }> = {
    'تنمية ذاتية': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    'قيادة': { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    'علم نفس': { bg: 'bg-purple-50', text: 'text-purple-600' },
    'أعمال': { bg: 'bg-blue-50', text: 'text-blue-600' },
    'تقنية': { bg: 'bg-slate-50', text: 'text-slate-600' },
    'فلسفة': { bg: 'bg-amber-50', text: 'text-amber-600' },
    'تاريخ': { bg: 'bg-orange-50', text: 'text-orange-600' },
    'إنتاجية': { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  }

  const config = categoryConfig[category] || { bg: 'bg-gray-50', text: 'text-gray-600' }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-tajawal font-medium rounded-full border border-current/20',
        sizeClasses[size],
        config.bg,
        config.text,
        className
      )}
    >
      {category}
    </span>
  )
}

export default AiBadge




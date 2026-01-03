'use client'

import { Sparkles, Brain, Lightbulb, Zap, Heart, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AiBadgeProps {
  text: string
  variant?: 'default' | 'mood' | 'persona' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  icon?: 'sparkles' | 'brain' | 'lightbulb' | 'zap' | 'heart' | 'coffee'
  className?: string
}

const icons = {
  sparkles: Sparkles,
  brain: Brain,
  lightbulb: Lightbulb,
  zap: Zap,
  heart: Heart,
  coffee: Coffee,
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
    mood: 'bg-brand-yellow/20 text-brand-black border border-brand-yellow/50',
    persona: 'bg-brand-black/5 text-brand-black border border-brand-black/10',
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

// Mood-specific badge
interface MoodBadgeProps {
  mood: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MoodBadge({ mood, size = 'md', className }: MoodBadgeProps) {
  const moodConfig: Record<string, { bg: string; text: string; icon: keyof typeof icons }> = {
    'تحفيزي': { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'zap' },
    'معرفي': { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'brain' },
    'نقاشي': { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'lightbulb' },
    'تحليلي': { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'brain' },
    'ملهم': { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'sparkles' },
    'هادئ': { bg: 'bg-green-50', text: 'text-green-600', icon: 'coffee' },
  }

  const config = moodConfig[mood] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'sparkles' as const }
  const Icon = icons[config.icon]

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

  return (
    <span
      className={cn(
        'inline-flex items-center font-tajawal font-medium rounded-full border',
        sizeClasses[size],
        config.bg,
        config.text,
        'border-current/20',
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{mood}</span>
    </span>
  )
}

export default AiBadge


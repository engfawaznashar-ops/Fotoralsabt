'use client'

import { Sparkles, Brain, Zap, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'subtle' | 'outline' | 'glow'
type BadgeIcon = 'sparkles' | 'brain' | 'zap' | 'star'

interface AiBadgeProps {
  text?: string
  variant?: BadgeVariant
  icon?: BadgeIcon
  className?: string
  animate?: boolean
}

const iconMap = {
  sparkles: Sparkles,
  brain: Brain,
  zap: Zap,
  star: Star,
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-brand-yellow/20 text-brand-gray border-brand-yellow/30',
  subtle: 'bg-brand-sand text-brand-gray border-transparent',
  outline: 'bg-transparent text-brand-yellow border-brand-yellow',
  glow: 'bg-brand-yellow/10 text-brand-gray border-brand-yellow/40 shadow-warm',
}

export function AiBadge({
  text = 'مدعوم بالذكاء الاصطناعي',
  variant = 'default',
  icon = 'sparkles',
  className,
  animate = true,
}: AiBadgeProps) {
  const Icon = iconMap[icon]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tajawal font-medium border transition-all duration-300',
        variantStyles[variant],
        animate && 'hover:scale-105',
        className
      )}
    >
      <Icon
        className={cn(
          'w-3.5 h-3.5',
          animate && 'animate-pulse'
        )}
      />
      <span>{text}</span>
    </div>
  )
}

// Preset variants for common use cases
export function AiExtractedBadge({ className }: { className?: string }) {
  return (
    <AiBadge
      text="AI Extracted"
      variant="subtle"
      icon="zap"
      className={className}
    />
  )
}

export function AiGeneratedBadge({ className }: { className?: string }) {
  return (
    <AiBadge
      text="مُولَّد بالذكاء الاصطناعي"
      variant="glow"
      icon="brain"
      className={className}
    />
  )
}

export function AiPoweredBadge({ className }: { className?: string }) {
  return (
    <AiBadge
      text="مدعوم بالذكاء الاصطناعي"
      variant="default"
      icon="sparkles"
      className={className}
    />
  )
}




'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { LucideIcon } from 'lucide-react'

interface EnhancedButtonProps {
  defaultText: string
  hoverText: string
  icon: LucideIcon
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  onClick?: () => void
}

export function EnhancedButton({
  defaultText,
  hoverText,
  icon: Icon,
  variant = 'default',
  size = 'lg',
  onClick
}: EnhancedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant={variant}
      size={size}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`gap-2 text-base rounded-full px-8 transition-all duration-300 ${
        variant === 'default'
          ? 'bg-brand-black text-white hover:bg-brand-black/90 hover:shadow-lg hover:-translate-y-0.5'
          : 'border-2 border-brand-black bg-brand-yellow hover:bg-brand-yellow/80 hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <Icon className={`w-5 h-5 transition-all duration-300 ${
        isHovered ? 'scale-110' : 'scale-100'
      } ${variant === 'default' ? 'fill-current' : ''}`} />
      <span className="relative overflow-hidden inline-block min-w-[120px]">
        <span
          className={`inline-block transition-all duration-300 ${
            isHovered ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
          }`}
        >
          {defaultText}
        </span>
        <span
          className={`absolute inset-0 inline-block transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
          }`}
        >
          {hoverText}
        </span>
      </span>
    </Button>
  )
}


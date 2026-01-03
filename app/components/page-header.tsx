'use client'

import { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  backHref?: string
  backLabel?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  icon,
  backHref,
  backLabel = 'العودة',
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {backHref && (
        <a 
          href={backHref}
          className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-black transition-colors mb-4 font-tajawal text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          {backLabel}
        </a>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center shadow-warm">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-changa font-bold text-brand-black">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-brand-gray font-tajawal mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

interface SearchFilterBarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: ReactNode
  className?: string
}

export function SearchFilterBar({
  searchPlaceholder = 'ابحث...',
  searchValue = '',
  onSearchChange,
  filters,
  className,
}: SearchFilterBarProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-4 mb-8', className)}>
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full h-12 px-4 pr-12 bg-white border-2 border-brand-sand rounded-xl font-tajawal text-brand-black placeholder:text-brand-gray/50 focus:outline-none focus:border-brand-yellow transition-colors"
        />
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Filters */}
      {filters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters}
        </div>
      )}
    </div>
  )
}

interface FilterChipProps {
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function FilterChip({ label, isActive, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-xl text-sm font-tajawal transition-all duration-200',
        isActive
          ? 'bg-brand-yellow text-brand-black shadow-warm'
          : 'bg-white text-brand-gray border border-brand-sand hover:border-brand-yellow'
      )}
    >
      {label}
    </button>
  )
}




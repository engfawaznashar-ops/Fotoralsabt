'use client'

import { Search, BookOpen, Lightbulb, Mic, User, Filter, Play, Square, ChevronRight, ChevronLeft } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import type { NodeType, StoryPath } from './types'

interface KnowledgeMapControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter: NodeType | 'الكل'
  onFilterChange: (filter: NodeType | 'الكل') => void
  storyPaths: StoryPath[]
  activeStoryPath: StoryPath | null
  onStoryPathSelect: (path: StoryPath | null) => void
  isStoryPlaying: boolean
  showEdgeWeight: boolean
  onEdgeWeightToggle: (show: boolean) => void
  onStoryNext?: () => void
  onStoryPrevious?: () => void
}

const filterOptions: Array<{ type: NodeType | 'الكل'; label: string; icon: any }> = [
  { type: 'الكل', label: 'الكل', icon: Filter },
  { type: 'فكرة', label: 'أفكار', icon: Lightbulb },
  { type: 'كتاب', label: 'كتب', icon: BookOpen },
  { type: 'حلقة', label: 'حلقات', icon: Mic },
  { type: 'متحدث', label: 'متحدثون', icon: User },
]

export function KnowledgeMapControls({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  storyPaths,
  activeStoryPath,
  onStoryPathSelect,
  isStoryPlaying,
  showEdgeWeight,
  onEdgeWeightToggle,
  onStoryNext,
  onStoryPrevious
}: KnowledgeMapControlsProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray/50 pointer-events-none" />
        <Input
          type="text"
          placeholder="ابحث عن فكرة أو كتاب أو حلقة أو متحدث..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10 font-tajawal"
        />
      </div>

      {/* Filters */}
      <div>
        <p className="text-xs font-tajawal text-brand-gray mb-2">التصفية:</p>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(({ type, label, icon: Icon }) => {
            const isActive = activeFilter === type
            return (
              <button
                key={type}
                onClick={() => onFilterChange(type)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tajawal transition-all ${
                  isActive
                    ? 'bg-brand-yellow text-brand-black shadow-sm'
                    : 'bg-brand-sand text-brand-gray hover:bg-brand-yellow/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Edge Weight Toggle */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-brand-sand">
        <label htmlFor="edge-weight-toggle" className="text-sm font-tajawal text-brand-black cursor-pointer">
          إظهار قوة العلاقة
        </label>
        <button
          id="edge-weight-toggle"
          onClick={() => onEdgeWeightToggle(!showEdgeWeight)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            showEdgeWeight ? 'bg-brand-yellow' : 'bg-brand-sand'
          }`}
          aria-label={showEdgeWeight ? 'إخفاء قوة العلاقة' : 'إظهار قوة العلاقة'}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              showEdgeWeight ? 'left-0.5' : 'right-0.5'
            }`}
          />
        </button>
      </div>

      {/* Story Paths */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-tajawal text-brand-gray">مسارات معرفية جاهزة:</p>
          {activeStoryPath && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onStoryPathSelect(null)}
              className="gap-1.5 h-7 text-xs"
            >
              <Square className="w-3 h-3" />
              إيقاف المسار
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {storyPaths.map(path => {
            const isActive = activeStoryPath?.id === path.id
            return (
              <button
                key={path.id}
                onClick={() => onStoryPathSelect(isActive ? null : path)}
                className={`w-full text-right p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-brand-yellow/20 border-2 border-brand-yellow'
                    : 'bg-white border border-brand-sand hover:border-brand-yellow/30 hover:bg-brand-sand/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isActive && isStoryPlaying && (
                        <Play className="w-3.5 h-3.5 text-brand-yellow animate-pulse" />
                      )}
                      <h4 className="font-changa font-bold text-sm text-brand-black">{path.title}</h4>
                    </div>
                    <p className="text-xs font-tajawal text-brand-gray leading-relaxed">
                      {path.description}
                    </p>
                    {isActive && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-brand-sand rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-yellow transition-all duration-300"
                            style={{
                              width: `${((path.currentStep + 1) / path.steps.length) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-xs font-tajawal text-brand-gray">
                          {path.currentStep + 1}/{path.steps.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Current Story Step + Navigation */}
      {activeStoryPath && (
        <div className="bg-gradient-to-br from-brand-yellow/10 to-brand-sand/50 rounded-xl p-4 border border-brand-yellow/30 animate-slide-up space-y-3">
          <div>
            <p className="text-xs font-tajawal text-brand-gray mb-1">المرحلة الحالية:</p>
            <p className="text-sm font-tajawal text-brand-black leading-relaxed">
              {activeStoryPath.steps[activeStoryPath.currentStep]?.explanation}
            </p>
          </div>
          
          {/* Story Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onStoryPrevious}
              disabled={activeStoryPath.currentStep === 0}
              className="flex-1 gap-1 text-xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              السابق
            </Button>
            <div className="text-xs font-tajawal text-brand-gray px-2">
              {activeStoryPath.currentStep + 1} / {activeStoryPath.steps.length}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onStoryNext}
              disabled={activeStoryPath.currentStep === activeStoryPath.steps.length - 1}
              className="flex-1 gap-1 text-xs"
            >
              التالي
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


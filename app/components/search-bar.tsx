'use client'

import { useState, useCallback } from 'react'
import { Search, Sparkles, BookOpen, Users, MessageCircle, X, Loader2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useStore } from '@/hooks/useStore'
import { cn } from '@/lib/utils'

const suggestions = [
  { type: 'book' as const, text: 'العادات الذرية', icon: BookOpen },
  { type: 'speaker' as const, text: 'أحمد السالم', icon: Users },
  { type: 'topic' as const, text: 'التطوير الذاتي', icon: Sparkles },
  { type: 'quote' as const, text: 'النجاح رحلة', icon: MessageCircle },
]

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)
  const [localQuery, setLocalQuery] = useState('')
  const { searchQuery, isSearching, setSearchQuery, setIsSearching } = useStore()

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      // Simulate search delay
      setTimeout(() => setIsSearching(false), 500)
    }
  }, [setSearchQuery, setIsSearching])

  const handleSuggestionClick = (text: string) => {
    setLocalQuery(text)
    handleSearch(text)
    setIsFocused(false)
  }

  const clearSearch = () => {
    setLocalQuery('')
    setSearchQuery('')
  }

  const getIconForType = (type: string) => {
    const icons = {
      book: BookOpen,
      speaker: Users,
      topic: Sparkles,
      quote: MessageCircle,
    }
    return icons[type as keyof typeof icons] || Sparkles
  }

  const filteredSuggestions = suggestions.filter(
    (s) => localQuery === '' || s.text.includes(localQuery)
  )

  return (
    <section className="py-12 bg-gradient-to-b from-brand-sand to-white">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-brand-yellow/20 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-brand-gray" />
              <span className="text-sm font-tajawal text-brand-gray">بحث ذكي بالذكاء الاصطناعي</span>
            </div>
            <h2 className="text-xl font-changa font-bold text-brand-black">
              ابحث في المعرفة
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div
              className={cn(
                'relative bg-white rounded-2xl shadow-card transition-all duration-300',
                isFocused && 'shadow-warm-lg ring-2 ring-brand-yellow'
              )}
            >
              <div className="flex items-center gap-3 px-4">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 text-brand-gray animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-brand-gray" />
                )}
                <Input
                  type="text"
                  placeholder="ابحث عن كتاب، متحدث، موضوع، أو اقتباس..."
                  className="border-0 shadow-none focus-visible:ring-0 px-0 h-14 text-base"
                  value={localQuery}
                  onChange={(e) => {
                    setLocalQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
                {localQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={clearSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" className="rounded-xl">
                  بحث
                </Button>
              </div>

              {/* Suggestions Dropdown */}
              {isFocused && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-card-hover border border-border overflow-hidden z-50">
                  <div className="p-2">
                    <p className="text-xs text-brand-gray/60 px-3 py-2 font-tajawal">
                      اقتراحات البحث
                    </p>
                    {filteredSuggestions.map((suggestion, index) => {
                      const Icon = suggestion.icon
                      return (
                        <button
                          key={index}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-sand transition-colors text-right"
                          onClick={() => handleSuggestionClick(suggestion.text)}
                        >
                          <div className="w-8 h-8 bg-brand-yellow/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-brand-gray" />
                          </div>
                          <div className="flex-1">
                            <p className="font-tajawal text-brand-black">{suggestion.text}</p>
                            <p className="text-xs text-brand-gray/60 capitalize">{suggestion.type}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-brand-gray font-tajawal">الأكثر بحثاً:</span>
              {['العادات', 'القيادة', 'الإنتاجية', 'الذكاء الاصطناعي'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSuggestionClick(tag)}
                  className="px-3 py-1 bg-white border border-border rounded-full text-sm font-tajawal text-brand-gray hover:border-brand-yellow hover:bg-brand-sand transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




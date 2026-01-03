'use client'

import { useState } from 'react'
import { MessageSquareQuote, ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EpisodeQuote } from '@/lib/api/episodes'

interface EpisodeQuotesSectionProps {
  quotes: EpisodeQuote[]
  className?: string
}

export function EpisodeQuotesSection({ quotes, className }: EpisodeQuotesSectionProps) {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (quotes.length === 0) return null

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Highlight the first quote as "top quote"
  const topQuote = quotes[0]
  const otherQuotes = quotes.slice(1)

  return (
    <section className={cn('py-12 lg:py-16', className)}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
            <MessageSquareQuote className="w-5 h-5 text-brand-black" />
          </div>
          <div>
            <h2 className="text-2xl font-changa font-bold text-brand-black">
              اقتباسات الحلقة
            </h2>
            <p className="text-sm text-brand-gray font-tajawal">
              {quotes.length} اقتباس مميز
            </p>
          </div>
        </div>

        {/* Top Quote - Featured */}
        {topQuote && (
          <div className="mb-8">
            <div className="relative bg-gradient-to-br from-brand-yellow/20 to-brand-sand rounded-3xl p-6 md:p-8 border-2 border-brand-yellow/40 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full blur-2xl" />
              
              <div className="relative">
                {/* Featured Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 bg-brand-yellow text-brand-black rounded-full">
                    <Sparkles className="w-3 h-3" />
                    اقتباس مميز
                  </span>
                </div>

                {/* Quote Text */}
                <blockquote className="text-xl md:text-2xl font-tajawal text-brand-black leading-relaxed mb-6">
                  "{topQuote.text}"
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {topQuote.speakerName && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-black/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-brand-black">
                            {topQuote.speakerName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-tajawal font-medium text-brand-black">
                          {topQuote.speakerName}
                        </span>
                      </div>
                    )}
                    {topQuote.bookTitle && (
                      <span className="text-sm text-brand-gray bg-white/50 px-2 py-0.5 rounded">
                        من كتاب: {topQuote.bookTitle}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(topQuote.text, topQuote.id)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    title="نسخ الاقتباس"
                  >
                    {copiedId === topQuote.id ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-brand-gray" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Quotes Grid */}
        {otherQuotes.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {otherQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-2xl p-5 shadow-card border border-brand-sand hover:shadow-card-hover hover:border-brand-yellow/30 transition-all duration-300"
              >
                {/* Quote Text */}
                <blockquote 
                  className={cn(
                    'font-tajawal text-brand-black leading-relaxed mb-4 cursor-pointer',
                    expandedQuote === quote.id ? '' : 'line-clamp-3'
                  )}
                  onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                >
                  "{quote.text}"
                </blockquote>

                {/* Expand indicator */}
                {quote.text.length > 150 && (
                  <button
                    onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                    className="text-xs text-brand-gray hover:text-brand-black mb-3 flex items-center gap-1"
                  >
                    {expandedQuote === quote.id ? (
                      <>
                        عرض أقل <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        عرض المزيد <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}

                {/* Attribution & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-sand">
                  <div className="flex items-center gap-2 flex-wrap">
                    {quote.speakerName && (
                      <span className="text-sm font-tajawal text-brand-gray">
                        — {quote.speakerName}
                      </span>
                    )}
                    {quote.bookTitle && (
                      <span className="text-xs text-brand-gray/70 bg-brand-sand px-2 py-0.5 rounded">
                        {quote.bookTitle}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(quote.text, quote.id)}
                    className="p-1.5 hover:bg-brand-sand rounded-lg transition-colors"
                    title="نسخ الاقتباس"
                  >
                    {copiedId === quote.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-brand-gray" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default EpisodeQuotesSection


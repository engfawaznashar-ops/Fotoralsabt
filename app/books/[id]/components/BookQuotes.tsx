'use client'

import { MessageCircle, User, Mic, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import type { BookQuote } from '@/lib/api/books'

interface BookQuotesProps {
  quotes: BookQuote[]
}

export function BookQuotes({ quotes }: BookQuotesProps) {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)
  const [analyzingQuote, setAnalyzingQuote] = useState<string | null>(null)
  const [analyses, setAnalyses] = useState<Record<string, string>>({})

  if (quotes.length === 0) {
    return null
  }

  const handleAnalyzeQuote = async (quoteId: string, quoteText: string) => {
    if (analyses[quoteId]) {
      setExpandedQuote(expandedQuote === quoteId ? null : quoteId)
      return
    }

    setAnalyzingQuote(quoteId)
    
    try {
      // Call the analyze concept API
      const response = await fetch('/api/analyze/concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: quoteText }),
      })

      if (response.ok) {
        const data = await response.json()
        setAnalyses(prev => ({
          ...prev,
          [quoteId]: data.data?.explanation || 'تحليل الاقتباس قيد التطوير...'
        }))
        setExpandedQuote(quoteId)
      } else {
        setAnalyses(prev => ({
          ...prev,
          [quoteId]: 'عذراً، حدث خطأ أثناء التحليل. يرجى المحاولة لاحقاً.'
        }))
        setExpandedQuote(quoteId)
      }
    } catch {
      setAnalyses(prev => ({
        ...prev,
        [quoteId]: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.'
      }))
      setExpandedQuote(quoteId)
    } finally {
      setAnalyzingQuote(null)
    }
  }

  return (
    <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-sand/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-brand-yellow" />
          </div>
          <div>
            <h2 className="font-changa font-bold text-xl text-brand-black">
              اقتباسات مرتبطة بالكتاب
            </h2>
            <p className="text-sm text-brand-gray font-tajawal">
              {quotes.length} اقتباس
            </p>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="p-6 space-y-4">
        {quotes.map((quote, index) => {
          const isExpanded = expandedQuote === quote.id
          const isAnalyzing = analyzingQuote === quote.id
          const isFirst = index === 0

          return (
            <div
              key={quote.id}
              className={`relative rounded-2xl transition-all duration-300 ${
                isFirst 
                  ? 'bg-gradient-to-bl from-brand-yellow/20 to-brand-sand/30 border-2 border-brand-yellow/30' 
                  : 'bg-brand-sand/30 border border-brand-sand hover:border-brand-yellow/20'
              }`}
            >
              {/* Featured Badge */}
              {isFirst && (
                <div className="absolute -top-3 right-4 bg-brand-yellow text-brand-black text-xs font-changa font-bold px-3 py-1 rounded-full shadow-sm">
                  الأكثر تأثيراً
                </div>
              )}

              <div className="p-5">
                {/* Quote Text */}
                <div className="relative mb-4">
                  <span className="text-5xl text-brand-yellow/30 font-changa absolute -top-2 -right-2 leading-none">
                    "
                  </span>
                  <p className="font-tajawal text-brand-black text-lg leading-relaxed pr-6">
                    {quote.text}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-brand-gray font-tajawal mb-4">
                  {quote.speakerName && (
                    <Link
                      href={`/speakers/${quote.speakerId}`}
                      className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {quote.speakerName}
                    </Link>
                  )}
                  
                  {quote.episodeId && (
                    <>
                      <span className="text-brand-sand">•</span>
                      <Link
                        href={`/episodes/${quote.episodeId}`}
                        className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
                      >
                        <Mic className="w-4 h-4" />
                        {quote.episodeTitle ? `الحلقة: ${quote.episodeTitle}` : `الحلقة #${quote.episodeNumber || '—'}`}
                      </Link>
                    </>
                  )}

                  {quote.timestamp && (
                    <>
                      <span className="text-brand-sand">•</span>
                      <span className="text-brand-gray/70">
                        الدقيقة {quote.timestamp}
                      </span>
                    </>
                  )}
                </div>

                {/* Analyze Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAnalyzeQuote(quote.id, quote.text)}
                  disabled={isAnalyzing}
                  className="gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      حلّل الاقتباس
                      {analyses[quote.id] && (
                        isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </>
                  )}
                </Button>

                {/* Analysis Panel */}
                {isExpanded && analyses[quote.id] && (
                  <div className="mt-4 pt-4 border-t border-brand-sand/50">
                    <div className="bg-white rounded-xl p-4 border border-brand-yellow/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-brand-yellow" />
                        <span className="text-sm font-changa font-bold text-brand-black">
                          تحليل AI
                        </span>
                      </div>
                      <p className="text-sm text-brand-gray font-tajawal leading-relaxed">
                        {analyses[quote.id]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default BookQuotes




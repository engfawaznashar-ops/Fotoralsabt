'use client'

import { Sparkles, Lightbulb, HelpCircle, Headphones, Users, Info } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { AiBadge } from './AiBadge'
import type { BookInsightsData } from '@/lib/api/books'

interface BookSummaryAIProps {
  insights: BookInsightsData | null
  bookAiSummary: string | null
}

export function BookSummaryAI({ insights, bookAiSummary }: BookSummaryAIProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Use either the insights summary or the book's AI summary
  const summary = insights?.aiSummary || insights?.aiSummaryAr || bookAiSummary
  const keyIdeas = insights?.keyIdeas || []
  const whyImportant = insights?.whyImportant
  const audienceFit = insights?.audienceFit
  const bestEpisode = insights?.bestEpisode

  if (!summary && keyIdeas.length === 0 && !whyImportant) {
    return null
  }

  return (
    <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-sand/50 bg-gradient-to-l from-brand-yellow/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-yellow" />
            </div>
            <div>
              <h2 className="font-changa font-bold text-xl text-brand-black">
                ملخص ذكي للكتاب
              </h2>
              <AiBadge text="تحليل بالذكاء الاصطناعي" variant="subtle" size="sm" />
            </div>
          </div>

          {/* Info Tooltip */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-2 hover:bg-brand-sand/50 rounded-full transition-colors"
            >
              <Info className="w-5 h-5 text-brand-gray" />
            </button>
            {showTooltip && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-brand-black text-white text-sm p-3 rounded-xl shadow-lg z-10 font-tajawal">
                تم توليد هذا الملخص باستخدام الذكاء الاصطناعي بناءً على محتوى الحلقات التي ناقشت هذا الكتاب
                <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-brand-black" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Summary */}
        {summary && (
          <div className="bg-brand-sand/30 rounded-2xl p-5">
            <p className="text-brand-gray font-tajawal leading-relaxed text-lg">
              {summary}
            </p>
          </div>
        )}

        {/* Key Ideas */}
        {keyIdeas.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 font-changa font-bold text-lg text-brand-black mb-4">
              <Lightbulb className="w-5 h-5 text-brand-yellow" />
              أهم الأفكار
            </h3>
            <div className="flex flex-wrap gap-2">
              {keyIdeas.map((idea, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-l from-brand-yellow/20 to-brand-sand px-4 py-2 rounded-full font-tajawal text-sm text-brand-black border border-brand-yellow/20 hover:border-brand-yellow/40 transition-colors cursor-default"
                >
                  <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                  {idea}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Why Important */}
          {whyImportant && (
            <div className="bg-gradient-to-bl from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100">
              <h3 className="flex items-center gap-2 font-changa font-bold text-base text-brand-black mb-3">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                لماذا هذا الكتاب مهم؟
              </h3>
              <p className="text-brand-gray font-tajawal text-sm leading-relaxed">
                {whyImportant}
              </p>
            </div>
          )}

          {/* Audience Fit */}
          {audienceFit && (
            <div className="bg-gradient-to-bl from-indigo-50 to-white rounded-2xl p-5 border border-indigo-100">
              <h3 className="flex items-center gap-2 font-changa font-bold text-base text-brand-black mb-3">
                <Users className="w-5 h-5 text-indigo-500" />
                الفئة المناسبة لهذا الكتاب
              </h3>
              <p className="text-brand-gray font-tajawal text-sm leading-relaxed">
                {audienceFit}
              </p>
            </div>
          )}
        </div>

        {/* Best Episode */}
        {bestEpisode && (
          <div className="bg-gradient-to-l from-brand-yellow/10 to-brand-sand/30 rounded-2xl p-5 border border-brand-yellow/20">
            <h3 className="flex items-center gap-2 font-changa font-bold text-base text-brand-black mb-3">
              <Headphones className="w-5 h-5 text-brand-yellow" />
              أفضل حلقة تحدثت عنه
            </h3>
            <Link
              href={`/episodes/${bestEpisode.id}`}
              className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center shrink-0">
                <span className="font-changa font-bold text-brand-black">
                  {bestEpisode.episodeNumber || '#'}
                </span>
              </div>
              <div>
                <p className="font-changa font-bold text-brand-black group-hover:text-brand-yellow transition-colors">
                  {bestEpisode.title}
                </p>
                <p className="text-sm text-brand-gray font-tajawal">
                  الحلقة رقم {bestEpisode.episodeNumber || '—'}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default BookSummaryAI




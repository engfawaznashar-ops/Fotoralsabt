'use client'

import { Sparkles, Brain, Lightbulb, TrendingUp, BookOpen, Users, MessageSquare, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AiBadge, MoodBadge } from './AiBadge'
import { StatPill } from './StatPill'
import type { EpisodeInsightsData } from '@/lib/api/episodes'

interface EpisodeInsightsSectionProps {
  insights: EpisodeInsightsData
  className?: string
}

export function EpisodeInsightsSection({ insights, className }: EpisodeInsightsSectionProps) {
  const { 
    mood, 
    moodAr, 
    topIdeas, 
    mostImpactfulSpeaker, 
    mostMentionedBook, 
    summary,
    summaryAr,
    keyTakeaways,
    keyTakeawaysAr, 
    statistics 
  } = insights

  return (
    <section className={cn('py-12 lg:py-16 bg-brand-sand', className)}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl font-changa font-bold text-brand-black">
                رؤى ذكية
              </h2>
              <p className="text-sm text-brand-gray font-tajawal">
                تحليل آلي للحلقة بالذكاء الاصطناعي
              </p>
            </div>
          </div>
          <AiBadge text="AI Generated" variant="glow" size="sm" />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Summary & Key Ideas */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-sand">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-brand-gray" />
                <h3 className="font-changa font-bold text-lg text-brand-black">
                  ملخص الحلقة
                </h3>
                {mood && <MoodBadge mood={mood} size="sm" />}
              </div>
              <p className="font-tajawal text-brand-gray leading-relaxed">
                {summaryAr || summary}
              </p>
            </div>

            {/* Top Ideas */}
            {topIdeas && topIdeas.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-sand">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-changa font-bold text-lg text-brand-black">
                    أبرز الأفكار
                  </h3>
                </div>
                <div className="space-y-4">
                  {topIdeas.map((idea, index) => (
                    <div
                      key={index}
                      className={cn(
                        'relative pr-6 pb-4',
                        index < topIdeas.length - 1 && 'border-b border-brand-sand'
                      )}
                    >
                      {/* Importance indicator */}
                      <div 
                        className="absolute right-0 top-1 w-1 rounded-full bg-brand-yellow"
                        style={{ height: `${Math.min(idea.importance, 100)}%`, maxHeight: '60px', minHeight: '20px' }}
                      />
                      <p className="font-tajawal text-brand-black mb-2">
                        {idea.ideaAr || idea.idea}
                      </p>
                      {idea.relatedTo && idea.relatedTo.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {idea.relatedTo.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="text-xs px-2 py-0.5 bg-brand-sand rounded-full text-brand-gray"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Takeaways */}
            {keyTakeawaysAr && keyTakeawaysAr.length > 0 && (
              <div className="bg-gradient-to-br from-brand-yellow/20 to-brand-sand rounded-2xl p-6 border border-brand-yellow/30">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-brand-black" />
                  <h3 className="font-changa font-bold text-lg text-brand-black">
                    نقاط عملية
                  </h3>
                </div>
                <ul className="space-y-3">
                  {keyTakeawaysAr.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center text-sm font-bold text-brand-black">
                        {index + 1}
                      </span>
                      <span className="font-tajawal text-brand-gray">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Highlights */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-brand-sand">
              <h3 className="font-changa font-bold text-lg text-brand-black mb-4">
                إحصائيات الحلقة
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-sand/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-yellow/30 rounded-lg mx-auto mb-2">
                    <Clock className="w-4 h-4 text-brand-black" />
                  </div>
                  <p className="text-lg font-changa font-bold text-brand-black">
                    {Math.round((statistics?.totalDuration || 0) / 60)}
                  </p>
                  <p className="text-xs font-tajawal text-brand-gray">دقيقة</p>
                </div>
                <div className="bg-brand-sand/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-yellow/30 rounded-lg mx-auto mb-2">
                    <Users className="w-4 h-4 text-brand-black" />
                  </div>
                  <p className="text-lg font-changa font-bold text-brand-black">
                    {statistics?.speakerCount || 0}
                  </p>
                  <p className="text-xs font-tajawal text-brand-gray">متحدث</p>
                </div>
                <div className="bg-brand-sand/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-yellow/30 rounded-lg mx-auto mb-2">
                    <BookOpen className="w-4 h-4 text-brand-black" />
                  </div>
                  <p className="text-lg font-changa font-bold text-brand-black">
                    {statistics?.booksMentioned || 0}
                  </p>
                  <p className="text-xs font-tajawal text-brand-gray">كتاب</p>
                </div>
                <div className="bg-brand-sand/50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-yellow/30 rounded-lg mx-auto mb-2">
                    <MessageSquare className="w-4 h-4 text-brand-black" />
                  </div>
                  <p className="text-lg font-changa font-bold text-brand-black">
                    {statistics?.quotesExtracted || 0}
                  </p>
                  <p className="text-xs font-tajawal text-brand-gray">اقتباس</p>
                </div>
              </div>
            </div>

            {/* Most Impactful Speaker */}
            {mostImpactfulSpeaker && mostImpactfulSpeaker.id && (
              <a 
                href={`/speakers/${mostImpactfulSpeaker.id}`}
                className="block bg-white rounded-2xl p-6 shadow-card border border-brand-sand hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-brand-gray" />
                  <span className="text-sm font-tajawal text-brand-gray">أكثر متحدث تأثيراً</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-sand flex items-center justify-center">
                    <span className="text-lg font-bold text-brand-gray">
                      {mostImpactfulSpeaker.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-changa font-bold text-brand-black">
                      {mostImpactfulSpeaker.name}
                    </p>
                    {mostImpactfulSpeaker.relevance && (
                      <p className="text-xs text-brand-gray">
                        نسبة التأثير: {Math.round(mostImpactfulSpeaker.relevance * 100)}%
                      </p>
                    )}
                  </div>
                </div>
              </a>
            )}

            {/* Most Mentioned Book */}
            {mostMentionedBook && mostMentionedBook.id && (
              <a 
                href={`/books/${mostMentionedBook.id}`}
                className="block bg-white rounded-2xl p-6 shadow-card border border-brand-sand hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-brand-gray" />
                  <span className="text-sm font-tajawal text-brand-gray">أكثر كتاب ذُكر</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-yellow/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-brand-black" />
                  </div>
                  <div>
                    <p className="font-changa font-bold text-brand-black">
                      {mostMentionedBook.title}
                    </p>
                    <p className="text-sm text-brand-gray">
                      {mostMentionedBook.author}
                    </p>
                    <p className="text-xs text-brand-gray">
                      ذُكر {mostMentionedBook.mentionCount} مرات
                    </p>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EpisodeInsightsSection


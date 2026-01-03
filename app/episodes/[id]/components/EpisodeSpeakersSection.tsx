'use client'

import { Users, Mic, BookOpen, ArrowLeft, TrendingUp } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import type { EpisodeSpeaker } from '@/lib/api/episodes'
import { getPersonaColor } from '@/lib/api/episodes'

interface EpisodeSpeakersSectionProps {
  speakers: EpisodeSpeaker[]
  className?: string
}

export function EpisodeSpeakersSection({ speakers, className }: EpisodeSpeakersSectionProps) {
  if (speakers.length === 0) return null

  return (
    <section className={cn('py-12 lg:py-16 bg-brand-sand', className)}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-black" />
            </div>
            <div>
              <h2 className="text-2xl font-changa font-bold text-brand-black">
                المتحدثون
              </h2>
              <p className="text-sm text-brand-gray font-tajawal">
                {speakers.length} متحدث في هذه الحلقة
              </p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <a href="/speakers">
              جميع المتحدثين
              <ArrowLeft className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Speakers Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <a
              key={speaker.id}
              href={`/speakers/${speaker.id}`}
              className="group bg-white rounded-2xl p-6 shadow-card border border-brand-sand hover:shadow-card-hover hover:border-brand-yellow/30 transition-all duration-300"
            >
              {/* Speaker Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-brand-yellow to-brand-sand flex items-center justify-center overflow-hidden">
                  {speaker.avatarAI ? (
                    <img 
                      src={speaker.avatarAI} 
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-brand-black">
                      {speaker.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name & Persona */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-changa font-bold text-lg text-brand-black mb-1 group-hover:text-brand-gray transition-colors">
                    {speaker.name}
                  </h3>
                  {speaker.aiPersona && (
                    <span className={cn(
                      'inline-block text-xs px-2 py-0.5 rounded-full',
                      getPersonaColor(speaker.aiPersona)
                    )}>
                      {speaker.aiPersona}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {speaker.bioAI && (
                <p className="text-sm text-brand-gray font-tajawal line-clamp-2 mb-4">
                  {speaker.bioAI}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 pt-4 border-t border-brand-sand">
                {speaker.episodeCount !== null && (
                  <div className="flex items-center gap-1.5 text-sm text-brand-gray">
                    <Mic className="w-4 h-4" />
                    <span className="font-medium">{speaker.episodeCount}</span>
                    <span className="text-brand-gray/70">حلقة</span>
                  </div>
                )}
                {speaker.aiTopTopic && (
                  <div className="flex items-center gap-1.5 text-sm text-brand-gray">
                    <TrendingUp className="w-4 h-4" />
                    <span className="truncate">{speaker.aiTopTopic}</span>
                  </div>
                )}
              </div>

              {/* AI Insight */}
              {speaker.aiTopTopic && (
                <div className="mt-4 p-3 bg-brand-sand/50 rounded-xl">
                  <p className="text-xs text-brand-gray">
                    <span className="font-medium">أكثر ما يتحدث عنه:</span> {speaker.aiTopTopic}
                  </p>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EpisodeSpeakersSection


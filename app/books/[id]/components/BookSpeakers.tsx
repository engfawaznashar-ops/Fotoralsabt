'use client'

import { Users, User, Sparkles, MessageCircle, Mic } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import type { BookSpeaker } from '@/lib/api/books'

interface BookSpeakersProps {
  speakers: BookSpeaker[]
}

export function BookSpeakers({ speakers }: BookSpeakersProps) {
  if (speakers.length === 0) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
  }

  const getPersonaColor = (persona: string | null) => {
    const colors: Record<string, string> = {
      'تحليلي': 'bg-teal-100 text-teal-700 border-teal-200',
      'تحفيزي': 'bg-orange-100 text-orange-700 border-orange-200',
      'قيادي': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'تقني': 'bg-slate-100 text-slate-700 border-slate-200',
      'إبداعي': 'bg-pink-100 text-pink-700 border-pink-200',
      'استراتيجي': 'bg-violet-100 text-violet-700 border-violet-200',
    }
    return colors[persona || ''] || 'bg-gray-100 text-gray-600 border-gray-200'
  }

  return (
    <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-brand-sand/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-brand-yellow" />
          </div>
          <div>
            <h2 className="font-changa font-bold text-xl text-brand-black">
              المتحدثون الذين ذكروا هذا الكتاب
            </h2>
            <p className="text-sm text-brand-gray font-tajawal">
              {speakers.length} متحدث
            </p>
          </div>
        </div>
      </div>

      {/* Speakers Grid */}
      <div className="p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {speakers.map((speaker) => (
            <Link
              key={speaker.id}
              href={`/speakers/${speaker.id}`}
              className="group block"
            >
              <div className="h-full bg-brand-sand/30 hover:bg-brand-sand/60 rounded-2xl p-5 transition-all duration-300 border border-transparent hover:border-brand-yellow/30 hover:shadow-warm">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-brand-yellow/30 group-hover:border-brand-yellow transition-colors">
                      {speaker.avatarAI ? (
                        <AvatarImage src={speaker.avatarAI} alt={speaker.name} />
                      ) : (
                        <AvatarFallback className="bg-brand-yellow text-brand-black font-changa font-bold">
                          {getInitials(speaker.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {/* Online-like indicator */}
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-3 h-3 text-brand-yellow" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-changa font-bold text-brand-black group-hover:text-brand-yellow transition-colors truncate">
                      {speaker.name}
                    </h3>
                    
                    {/* AI Persona Badge */}
                    {speaker.aiPersona && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-tajawal mt-1 border ${getPersonaColor(speaker.aiPersona)}`}>
                        <Sparkles className="w-3 h-3" />
                        {speaker.aiPersona}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/80 rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-brand-yellow mb-1">
                      <Mic className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-changa font-bold text-brand-black">
                      {speaker.episodeCount || 0}
                    </p>
                    <p className="text-xs text-brand-gray font-tajawal">حلقة</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-brand-yellow mb-1">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-changa font-bold text-brand-black">
                      {speaker.mentionCount}
                    </p>
                    <p className="text-xs text-brand-gray font-tajawal">ذكر للكتاب</p>
                  </div>
                </div>

                {/* Top Topic */}
                {speaker.aiTopTopic && (
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <p className="text-xs text-brand-gray font-tajawal mb-1">
                      أكثر موضوع يتحدث عنه
                    </p>
                    <p className="text-sm font-changa font-bold text-brand-black">
                      {speaker.aiTopTopic}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BookSpeakers




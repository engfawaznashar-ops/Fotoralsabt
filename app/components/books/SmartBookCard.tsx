'use client'

import { useState } from 'react'
import { BookOpen, ShoppingCart, ExternalLink, TrendingDown, Clock, CheckCircle2, AlertCircle, Sparkles, Users, Tag, Lightbulb } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface BookOffer {
  id: string
  retailer: {
    nameAr: string
    logoUrl?: string
  }
  priceAmount?: number
  currency: string
  offerUrl: string
  availability?: string
  lastCheckedAt: Date
}

interface SmartBookCardProps {
  book: {
    id: string
    titleAr: string
    titleEn?: string
    descriptionAr?: string
    coverImageUrl?: string
    authors?: Array<{ nameAr: string }>
    categories?: string[]
    publishYear?: number
    language?: string
    aiSummaryAr?: string
    aiKeyTakeaways?: string[]
    aiForWho?: string[]
    offers?: BookOffer[]
  }
  variant?: 'full' | 'compact'
}

export function SmartBookCard({ book, variant = 'full' }: SmartBookCardProps) {
  const [showAllOffers, setShowAllOffers] = useState(false)

  // إيجاد أرخص عرض
  const cheapestOffer = book.offers?.reduce((min, offer) => {
    if (!offer.priceAmount) return min
    if (!min || !min.priceAmount) return offer
    return offer.priceAmount < min.priceAmount ? offer : min
  }, book.offers[0])

  const hasOffers = book.offers && book.offers.length > 0
  const otherOffers = book.offers?.filter(o => o.id !== cheapestOffer?.id) || []

  return (
    <div className="group relative bg-white rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-brand-yellow/20">
      {/* AI Indicator Badge - Top Right */}
      <div className="absolute top-4 left-4 z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-yellow text-brand-black text-[10px] font-bold shadow-md">
          <Sparkles className="w-3 h-3" />
          تحليل ذكي
        </div>
      </div>

      {/* Paper texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.01) 30px, rgba(0,0,0,0.01) 31px)`
        }}
      />

      <div className="relative p-6 pt-12">
        {/* Header: Cover + Basic Info */}
        <div className="flex gap-4 mb-4">
          {/* Cover */}
          <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-md bg-brand-sand">
            {book.coverImageUrl ? (
              <Image
                src={book.coverImageUrl}
                alt={book.titleAr}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-brand-gray/30" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-changa font-bold text-xl text-brand-black mb-1 line-clamp-2 group-hover:text-brand-yellow transition-colors leading-tight">
              {book.titleAr}
            </h3>
            
            {book.authors && book.authors.length > 0 && (
              <p className="text-base text-brand-gray font-tajawal mb-2 font-medium">
                {book.authors.map(a => a.nameAr).join(' • ')}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {book.categories && book.categories.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 ml-1" />
                  {book.categories[0]}
                </Badge>
              )}
              {book.publishYear && (
                <Badge variant="outline" className="text-xs">
                  {book.publishYear}
                </Badge>
              )}
              {book.language && (
                <Badge variant="outline" className="text-xs">
                  {book.language === 'ar' ? 'عربي' : book.language}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* AI Summary - Unified Colors */}
        {book.aiSummaryAr && variant === 'full' && (
          <div className="mb-4 p-5 bg-brand-yellow/10 rounded-2xl border border-brand-yellow/30 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-brand-yellow flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-black" />
              </div>
              <span className="text-sm font-changa font-bold text-brand-black">ملخص ذكي</span>
            </div>
            <p className="text-base font-tajawal text-brand-black leading-relaxed">
              {book.aiSummaryAr}
            </p>
          </div>
        )}

        {/* Key Takeaways - Enhanced */}
        {book.aiKeyTakeaways && book.aiKeyTakeaways.length > 0 && variant === 'full' && (
          <div className="mb-4 p-4 bg-gradient-to-br from-brand-yellow/10 to-brand-sand/40 rounded-xl border border-brand-yellow/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-brand-yellow" />
              <h4 className="text-sm font-changa font-bold text-brand-black">أفكار رئيسية</h4>
            </div>
            <ul className="space-y-2">
              {book.aiKeyTakeaways.slice(0, 5).map((takeaway, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm font-tajawal text-brand-black leading-relaxed"
                >
                  <span className="flex-shrink-0 w-5 h-5 bg-brand-yellow rounded-full flex items-center justify-center text-xs font-bold text-brand-black">
                    {idx + 1}
                  </span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Best Price Offer - Enhanced */}
        {hasOffers && cheapestOffer && (
          <div className="mb-4 p-5 bg-gradient-to-br from-green-50 via-emerald-50/50 to-brand-yellow/5 rounded-2xl border-2 border-green-300/60 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-green-100 rounded-full">
                  <TrendingDown className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-changa font-bold text-green-900">أفضل سعر ⭐</span>
                </div>
                <p className="text-lg font-changa font-bold text-brand-black mb-1">
                  {cheapestOffer.retailer.nameAr}
                </p>
                <p className="text-xs font-tajawal text-brand-gray">
                  مقارنة من {book.offers?.length || 0} متاجر
                </p>
              </div>
              {cheapestOffer.priceAmount && (
                <div className="text-left bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-3xl font-changa font-black text-green-700 leading-none">
                    {cheapestOffer.priceAmount}
                  </p>
                  <p className="text-sm font-tajawal text-green-600 mt-1">{cheapestOffer.currency}</p>
                </div>
              )}
            </div>

            {/* Availability */}
            {cheapestOffer.availability && (
              <div className="flex items-center gap-1.5 mb-3 text-xs">
                {cheapestOffer.availability === 'متوفر' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                )}
                <span className="font-tajawal text-brand-gray">{cheapestOffer.availability}</span>
              </div>
            )}

            {/* CTA */}
            <Button
              asChild
              className="w-full gap-2"
              size="sm"
            >
              <a
                href={cheapestOffer.offerUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ShoppingCart className="w-4 h-4" />
                اذهب للشراء
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>

            {/* Last checked */}
            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-tajawal text-brand-gray/60">
              <Clock className="w-3 h-3" />
              <span>آخر تحديث: {new Date(cheapestOffer.lastCheckedAt).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        )}

        {/* Other Offers - Enhanced */}
        {otherOffers.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowAllOffers(!showAllOffers)}
              className="flex items-center gap-2 text-sm font-tajawal font-medium text-brand-black hover:text-brand-yellow transition-colors mb-3"
            >
              <span>{showAllOffers ? '▼' : '◀'}</span>
              <span>مقارنة الأسعار من متاجر أخرى ({otherOffers.length})</span>
            </button>

            {showAllOffers && (
              <div className="space-y-2 p-3 bg-brand-sand/20 rounded-xl">
                {otherOffers.map(offer => (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-tajawal font-semibold text-brand-black mb-0.5">
                        {offer.retailer.nameAr}
                      </p>
                      {offer.priceAmount && (
                        <p className="text-lg font-changa font-black text-brand-gray">
                          {offer.priceAmount} <span className="text-sm">{offer.currency}</span>
                        </p>
                      )}
                      {offer.availability && (
                        <p className="text-xs font-tajawal text-brand-gray mt-1">
                          {offer.availability}
                        </p>
                      )}
                    </div>
                    <a
                      href={offer.offerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-brand-yellow hover:bg-brand-yellow/80 rounded-lg text-sm font-tajawal font-medium text-brand-black flex items-center gap-1.5 transition-all hover:shadow-md"
                    >
                      شراء
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Disclaimer */}
        {hasOffers && (
          <p className="text-[10px] font-tajawal text-brand-gray/50 leading-relaxed">
            ⓘ الأسعار تقديرية وقد تتغير — يُرجى التحقق من المتجر قبل الشراء
          </p>
        )}

        {/* For Who */}
        {book.aiForWho && book.aiForWho.length > 0 && variant === 'full' && (
          <div className="mt-4 pt-4 border-t border-brand-sand">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-brand-yellow" />
              <span className="text-xs font-tajawal font-semibold text-brand-black">لمن يناسب:</span>
            </div>
            <ul className="space-y-1">
              {book.aiForWho.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-tajawal text-brand-gray">
                  <span className="text-brand-yellow mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}


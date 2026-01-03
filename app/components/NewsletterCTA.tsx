'use client'

import { useState } from 'react'
import { Bell, Mail, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API call
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 3000)
  }

  return (
    <section className="section-padding bg-gradient-to-br from-brand-yellow via-brand-yellow/90 to-brand-sand relative overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-10" />
      
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-sand/30 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-warm mb-6">
          <Bell className="w-8 h-8 text-brand-black" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-changa font-bold text-brand-black mb-3">
          لا تفوّت الجديد
        </h2>
        <p className="text-lg text-brand-black/80 font-tajawal mb-8 max-w-2xl mx-auto leading-relaxed">
          اشترك في نشرتنا الأسبوعية لتصلك أفضل الكتب والاقتباسات والملخصات الذكية
        </p>

        {/* Form */}
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 bg-white border-2 border-white/50 focus:border-white text-brand-black placeholder:text-brand-gray/60"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-brand-black hover:bg-brand-black/90 text-white gap-2 h-12 px-8 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              اشترك الآن
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl max-w-md mx-auto shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span className="font-tajawal font-semibold text-brand-black">
              تم الاشتراك بنجاح! 🎉
            </span>
          </div>
        )}

        {/* AI Badge */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Sparkles className="w-4 h-4 text-brand-black/60" />
          <p className="text-sm text-brand-black/70 font-tajawal">
            محتوى مختار بعناية بالذكاء الاصطناعي
          </p>
        </div>
      </div>
    </section>
  )
}


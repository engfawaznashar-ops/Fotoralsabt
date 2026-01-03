import Link from 'next/link'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { Radio, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

export default function EpisodeNotFound() {
  return (
    <main className="min-h-screen bg-brand-sand flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Not Found Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="w-20 h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Radio className="w-10 h-10 text-brand-gray" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-changa font-bold text-brand-black mb-4">
            الحلقة غير موجودة
          </h1>

          {/* Description */}
          <p className="text-brand-gray font-tajawal mb-8">
            عذراً، لم نتمكن من العثور على الحلقة التي تبحث عنها. قد تكون الحلقة قد حُذفت أو الرابط غير صحيح.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="gap-2">
              <Link href="/episodes">
                <Radio className="w-4 h-4" />
                تصفح الحلقات
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                الصفحة الرئيسية
              </Link>
            </Button>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t border-brand-yellow/20">
            <p className="text-sm text-brand-gray font-tajawal mb-4">
              جرب أيضاً:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link 
                href="/books" 
                className="text-sm text-brand-gray hover:text-brand-black px-3 py-1.5 bg-white rounded-full transition-colors"
              >
                الكتب
              </Link>
              <Link 
                href="/speakers" 
                className="text-sm text-brand-gray hover:text-brand-black px-3 py-1.5 bg-white rounded-full transition-colors"
              >
                المتحدثون
              </Link>
              <Link 
                href="/quotes" 
                className="text-sm text-brand-gray hover:text-brand-black px-3 py-1.5 bg-white rounded-full transition-colors"
              >
                الاقتباسات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}


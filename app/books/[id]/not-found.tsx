import Link from 'next/link'
import { BookX, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'

export default function BookNotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand/50 to-white pt-24 pb-16 flex items-center">
        <div className="max-w-lg mx-auto px-4 text-center" dir="rtl">
          {/* Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto">
              <BookX className="w-12 h-12 text-brand-yellow" />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-brand-yellow/30 rounded-full animate-ping" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-changa font-bold text-brand-black mb-4">
            عذراً... لم يتم العثور على هذا الكتاب
          </h1>

          {/* Description */}
          <p className="text-brand-gray font-tajawal text-lg mb-8 leading-relaxed">
            يبدو أن الكتاب الذي تبحث عنه غير موجود أو ربما تم نقله.
            <br />
            جرب البحث في مكتبتنا الكاملة.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/books">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <ArrowRight className="w-5 h-5" />
                تصفح جميع الكتب
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="w-5 h-5" />
                الرئيسية
              </Button>
            </Link>
          </div>

          {/* Decorative Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-brand-sand/50 rounded-full blur-3xl" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}




import { Button } from './components/ui/button'
import { Home, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-sand flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] font-changa font-bold text-brand-yellow/20 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Circular Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-yellow/50 to-brand-yellow/30 blur-xl" />
              <div className="relative w-28 h-28 rounded-full bg-brand-yellow shadow-2xl overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="فطور السبت" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Message */}
        <h1 className="text-2xl font-changa font-bold text-brand-black mb-2">
          الصفحة غير موجودة
        </h1>
        <p className="text-brand-gray font-tajawal mb-8">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="gap-2 w-full sm:w-auto">
            <a href="/">
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </a>
          </Button>
          <Button variant="outline" asChild className="gap-2 w-full sm:w-auto">
            <a href="/episodes">
              تصفح الحلقات
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
        
        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-brand-gray font-tajawal mb-4">روابط سريعة:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/books"
              className="text-sm text-brand-gray hover:text-brand-yellow transition-colors font-tajawal"
            >
              الكتب
            </a>
            <span className="text-brand-gray/30">•</span>
            <a
              href="/speakers"
              className="text-sm text-brand-gray hover:text-brand-yellow transition-colors font-tajawal"
            >
              المتحدثون
            </a>
            <span className="text-brand-gray/30">•</span>
            <a
              href="/quotes"
              className="text-sm text-brand-gray hover:text-brand-yellow transition-colors font-tajawal"
            >
              الاقتباسات
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}




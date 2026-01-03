import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'
import { KnowledgeMapSection } from '@/app/components/knowledge-map/KnowledgeMapSection'
import { ArrowRight, Info } from 'lucide-react'

export default function FullMapPage() {
  return (
    <main className="min-h-screen bg-brand-sand">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <div className="section-padding pt-24 lg:pt-28 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <a
              href="/home"
              className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-black transition-colors font-tajawal text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </a>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-changa font-bold text-brand-black mb-4">
            خريطة المعرفة الكاملة
          </h1>
          <p className="text-base md:text-lg font-tajawal text-brand-gray max-w-3xl leading-relaxed mb-6">
            اكتشف كيف ترتبط الأفكار والكتب والحلقات والمتحدثين في شبكة معرفية واحدة.
            استخدم الأدوات أدناه للبحث والتصفية واستكشاف المسارات المعرفية الجاهزة.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-tajawal text-sm text-blue-900 leading-relaxed">
                <strong>نصيحة:</strong> جرّب المسارات المعرفية الجاهزة لتجربة موجّهة،
                أو انقر على أي عقدة لاستكشاف علاقاتها بشكل مباشر.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Knowledge Map */}
      <KnowledgeMapSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}


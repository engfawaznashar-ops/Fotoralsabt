import { Navbar } from '@/app/components/navbar'
import { HeroSection } from '@/app/components/hero-section'
import { SmartBookShowcase } from '@/app/components/SmartBookShowcase'
import { KnowledgeMapSection } from '@/app/components/knowledge-map/KnowledgeMapSection'
import { RecommendedEpisodes } from '@/app/components/RecommendedEpisodes'
import { WeeklyQuotes } from '@/app/components/weekly-quotes'
import { FeaturedSpeakers } from '@/app/components/featured-speakers'
import { NewsletterCTA } from '@/app/components/NewsletterCTA'
import { Footer } from '@/app/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* 1. Hero - المقدمة القوية */}
      <HeroSection />

      {/* 2. الكتب الذكية - القيمة الأساسية */}
      <SmartBookShowcase />

      {/* 3. خريطة المعرفة - الاستكشاف التفاعلي */}
      <KnowledgeMapSection />

      {/* 4. حلقات مقترحة - بدل LatestEpisode */}
      <RecommendedEpisodes />

      {/* 5. اقتباسات ملهمة */}
      <WeeklyQuotes />

      {/* 6. المتحدثون */}
      <FeaturedSpeakers />

      {/* 7. اشترك بالنشرة - CTA نهائي */}
      <NewsletterCTA />

      {/* Footer */}
      <Footer />
    </main>
  )
}




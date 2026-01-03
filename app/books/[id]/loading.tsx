import { Navbar } from '@/app/components/navbar'
import { Footer } from '@/app/components/footer'

export default function BookDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-brand-sand/50 to-white pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" dir="rtl">
          {/* Back Navigation Skeleton */}
          <div className="h-6 w-24 bg-brand-sand/50 rounded-lg animate-pulse" />

          {/* Hero Section Skeleton */}
          <section className="bg-white rounded-3xl shadow-warm-lg border border-brand-sand/50 overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Book Cover Skeleton */}
              <div className="bg-gradient-to-br from-brand-yellow/50 to-brand-yellow/30 min-h-[320px] flex items-center justify-center animate-pulse">
                <div className="w-36 h-52 bg-white/50 rounded-xl" />
              </div>

              {/* Content Skeleton */}
              <div className="md:col-span-2 p-6 lg:p-8 space-y-4">
                {/* Category Badge */}
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-brand-sand/50 rounded-full animate-pulse" />
                  <div className="h-6 w-32 bg-brand-sand/50 rounded-full animate-pulse" />
                </div>

                {/* Title */}
                <div className="h-10 w-3/4 bg-brand-sand/50 rounded-lg animate-pulse" />

                {/* Author */}
                <div className="h-6 w-1/3 bg-brand-sand/50 rounded-lg animate-pulse" />

                {/* Rating */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-5 h-5 bg-brand-sand/50 rounded animate-pulse" />
                  ))}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-brand-sand/30 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-brand-sand/30 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-brand-sand/30 rounded animate-pulse" />
                </div>

                {/* Stats */}
                <div className="flex gap-3 pt-2">
                  <div className="h-16 w-28 bg-brand-sand/50 rounded-2xl animate-pulse" />
                  <div className="h-16 w-28 bg-brand-sand/50 rounded-2xl animate-pulse" />
                  <div className="h-16 w-28 bg-brand-sand/50 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-l from-brand-yellow/50 via-brand-yellow/25 to-transparent" />
          </section>

          {/* AI Summary Section Skeleton */}
          <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-brand-sand/50 bg-gradient-to-l from-brand-yellow/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-sand/50 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-brand-sand/50 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-brand-sand/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-brand-sand/30 rounded-2xl p-5 space-y-2">
                <div className="h-4 w-full bg-white/50 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-white/50 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-white/50 rounded animate-pulse" />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-24 bg-brand-sand/50 rounded-full animate-pulse" />
                <div className="h-8 w-28 bg-brand-sand/50 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-brand-sand/50 rounded-full animate-pulse" />
                <div className="h-8 w-32 bg-brand-sand/50 rounded-full animate-pulse" />
              </div>
            </div>
          </section>

          {/* Episodes Section Skeleton */}
          <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-brand-sand/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-sand/50 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-brand-sand/50 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-brand-sand/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-brand-sand/30 rounded-2xl p-4 animate-pulse">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-brand-yellow/30 rounded-xl" />
                      <div className="h-3 w-16 bg-brand-sand/50 rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-brand-sand/50 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-brand-sand/30 rounded mb-3" />
                    <div className="h-8 w-full bg-brand-sand/50 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quotes Section Skeleton */}
          <section className="bg-white rounded-3xl shadow-card border border-brand-sand/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-brand-sand/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-sand/50 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-44 bg-brand-sand/50 rounded animate-pulse" />
                  <div className="h-4 w-14 bg-brand-sand/30 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-brand-sand/30 rounded-2xl p-5 animate-pulse">
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-white/50 rounded" />
                    <div className="h-4 w-4/5 bg-white/50 rounded" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-4 w-20 bg-brand-sand/50 rounded" />
                    <div className="h-4 w-24 bg-brand-sand/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}




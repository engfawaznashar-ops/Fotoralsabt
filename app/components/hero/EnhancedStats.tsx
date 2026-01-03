'use client'

interface Stat {
  value: string
  label: string
  description: string
}

const stats: Stat[] = [
  {
    value: '150+',
    label: 'حلقة مسجلة',
    description: '150 فكرة نوقشت بعمق'
  },
  {
    value: '300+',
    label: 'كتاب تم الحديث عنها',
    description: 'خلاصة مكتبة كاملة'
  },
  {
    value: '12K+',
    label: 'دقائق استماع',
    description: 'وقت اختاره مستمعون للمعرفة'
  }
]

export function EnhancedStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center lg:text-right group"
        >
          {/* Value */}
          <div className="text-3xl md:text-4xl font-changa font-bold text-brand-black mb-1 transition-transform group-hover:scale-105">
            {stat.value}
          </div>
          
          {/* Label */}
          <div className="text-sm font-tajawal text-brand-gray mb-1">
            {stat.label}
          </div>
          
          {/* Description */}
          <div className="text-xs font-tajawal text-brand-gray/70 leading-relaxed">
            {stat.description}
          </div>
          
          {/* Divider */}
          {index < stats.length - 1 && (
            <div className="hidden sm:block absolute top-1/2 left-0 w-px h-12 bg-brand-yellow/30 transform -translate-y-1/2" />
          )}
        </div>
      ))}
    </div>
  )
}


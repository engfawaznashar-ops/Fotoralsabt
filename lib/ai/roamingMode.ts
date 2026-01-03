import type { RoamingStep } from '@/types'

type StartType = 'book' | 'speaker' | 'concept' | 'episode' | 'quote'

/**
 * Build a roaming path through connected content
 * Placeholder implementation - to be connected to real AI provider
 */
export async function buildRoamingPath(
  startType: StartType,
  startId: string
): Promise<RoamingStep[]> {
  // Mock implementation - creates a journey through connected content
  const paths: Record<StartType, RoamingStep[]> = {
    book: [
      {
        type: 'book',
        id: startId,
        title: 'العادات الذرية',
        description: 'كتاب عن بناء العادات الإيجابية',
        connection: 'نقطة البداية',
      },
      {
        type: 'speaker',
        id: 'sp1',
        title: 'أحمد السالم',
        description: 'ناقش هذا الكتاب في عدة حلقات',
        connection: 'تحدث عن هذا الكتاب',
      },
      {
        type: 'concept',
        id: 'c1',
        title: 'الإنتاجية',
        description: 'مفهوم مرتبط بالعادات',
        connection: 'مفهوم أساسي في الكتاب',
      },
      {
        type: 'episode',
        id: 'ep156',
        title: 'الحلقة 156 - قوة العادات',
        description: 'حلقة مخصصة لمناقشة الكتاب',
        connection: 'تم مناقشته في هذه الحلقة',
      },
      {
        type: 'quote',
        id: 'q1',
        title: 'العادات الصغيرة تشكل مصيرنا',
        description: 'اقتباس ملهم من الحلقة',
        connection: 'اقتباس مميز',
      },
    ],
    speaker: [
      {
        type: 'speaker',
        id: startId,
        title: 'أحمد السالم',
        description: 'خبير في التنمية البشرية',
        connection: 'نقطة البداية',
      },
      {
        type: 'episode',
        id: 'ep156',
        title: 'الحلقة 156',
        description: 'أحدث حلقاته',
        connection: 'شارك في هذه الحلقة',
      },
      {
        type: 'book',
        id: 'b1',
        title: 'العادات الذرية',
        description: 'من الكتب التي يوصي بها',
        connection: 'أوصى بهذا الكتاب',
      },
      {
        type: 'concept',
        id: 'c2',
        title: 'القيادة',
        description: 'مجال تخصصه الأساسي',
        connection: 'موضوعه المفضل',
      },
      {
        type: 'quote',
        id: 'q2',
        title: 'النجاح رحلة مستمرة',
        description: 'من أشهر اقتباساته',
        connection: 'اقتباس مشهور له',
      },
    ],
    concept: [
      {
        type: 'concept',
        id: startId,
        title: 'العادات',
        description: 'أنماط سلوكية متكررة',
        connection: 'نقطة البداية',
      },
      {
        type: 'book',
        id: 'b1',
        title: 'العادات الذرية',
        description: 'أفضل كتاب عن الموضوع',
        connection: 'كتاب أساسي',
      },
      {
        type: 'speaker',
        id: 'sp1',
        title: 'أحمد السالم',
        description: 'متحدث متخصص',
        connection: 'خبير في هذا المجال',
      },
      {
        type: 'episode',
        id: 'ep154',
        title: 'الحلقة 154',
        description: 'حلقة مخصصة للموضوع',
        connection: 'تمت مناقشته هنا',
      },
      {
        type: 'quote',
        id: 'q3',
        title: 'نحن ما نكرره',
        description: 'حكمة عن العادات',
        connection: 'اقتباس ذو صلة',
      },
    ],
    episode: [
      {
        type: 'episode',
        id: startId,
        title: 'الحلقة 156',
        description: 'حلقة عن العادات',
        connection: 'نقطة البداية',
      },
      {
        type: 'book',
        id: 'b1',
        title: 'العادات الذرية',
        description: 'الكتاب الرئيسي في الحلقة',
        connection: 'تمت مناقشته',
      },
      {
        type: 'speaker',
        id: 'sp1',
        title: 'أحمد السالم',
        description: 'ضيف الحلقة',
        connection: 'شارك في الحلقة',
      },
      {
        type: 'concept',
        id: 'c1',
        title: 'الإنتاجية',
        description: 'موضوع فرعي',
        connection: 'تم التطرق إليه',
      },
      {
        type: 'quote',
        id: 'q1',
        title: 'التغيير يبدأ من الداخل',
        description: 'اقتباس من الحلقة',
        connection: 'اقتباس مميز',
      },
    ],
    quote: [
      {
        type: 'quote',
        id: startId,
        title: 'النجاح رحلة مستمرة',
        description: 'اقتباس ملهم',
        connection: 'نقطة البداية',
      },
      {
        type: 'speaker',
        id: 'sp1',
        title: 'أحمد السالم',
        description: 'صاحب الاقتباس',
        connection: 'قائل الاقتباس',
      },
      {
        type: 'episode',
        id: 'ep156',
        title: 'الحلقة 156',
        description: 'مصدر الاقتباس',
        connection: 'ذُكر في هذه الحلقة',
      },
      {
        type: 'book',
        id: 'b2',
        title: 'قوة العادات',
        description: 'كتاب ذو صلة',
        connection: 'كتاب مرتبط بالموضوع',
      },
      {
        type: 'concept',
        id: 'c3',
        title: 'النجاح',
        description: 'المفهوم الأساسي',
        connection: 'الموضوع الرئيسي',
      },
    ],
  }

  return paths[startType] || paths.book
}

/**
 * Get next recommended step in roaming
 */
export async function getNextRoamingStep(
  currentType: StartType,
  _currentId: string
): Promise<RoamingStep | null> {
  const typeSequence: StartType[] = ['book', 'speaker', 'concept', 'episode', 'quote']
  const currentIndex = typeSequence.indexOf(currentType)
  const nextType = typeSequence[(currentIndex + 1) % typeSequence.length]

  return {
    type: nextType,
    id: 'next-1',
    title: 'محتوى مقترح',
    description: 'اكتشف المزيد',
    connection: 'اقتراح ذكي',
  }
}




import { PrismaClient } from '@prisma/client'
import { lookupBookByISBN } from '../lib/books/providers'

const prisma = new PrismaClient()

export async function seedBooks() {
  console.log('📚 Seeding Books, Authors, Retailers, and Offers...')

  // جلب صور الكتب من Google Books API
  console.log('🔍 جلب صور الكتب من الإنترنت...')
  
  let atomicCover = 'https://books.google.com/books/content?id=XfFvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
  let deepWorkCover = 'https://books.google.com/books/content?id=lZRLDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'

  try {
    const atomicData = await lookupBookByISBN('9780735211292')
    if (atomicData?.coverImageUrl) {
      atomicCover = atomicData.coverImageUrl.replace('http:', 'https:')
      console.log('✅ وجدت صورة: Atomic Habits')
      console.log('   URL:', atomicCover)
    }
  } catch (e) {
    console.log('⚠️ استخدام صورة افتراضية: Atomic Habits')
  }

  try {
    const deepWorkData = await lookupBookByISBN('9781455586691')
    if (deepWorkData?.coverImageUrl) {
      deepWorkCover = deepWorkData.coverImageUrl.replace('http:', 'https:')
      console.log('✅ وجدت صورة: Deep Work')
      console.log('   URL:', deepWorkCover)
    }
  } catch (e) {
    console.log('⚠️ استخدام صورة افتراضية: Deep Work')
  }

  // إنشاء المتاجر
  const jarir = await prisma.retailer.upsert({
    where: { id: 'retailer-jarir' },
    update: {},
    create: {
      id: 'retailer-jarir',
      nameAr: 'مكتبة جرير',
      baseUrl: 'https://www.jarir.com',
      logoUrl: '/retailers/jarir.png',
      isActive: true
    }
  })

  const noon = await prisma.retailer.upsert({
    where: { id: 'retailer-noon' },
    update: {},
    create: {
      id: 'retailer-noon',
      nameAr: 'نون',
      baseUrl: 'https://www.noon.com',
      logoUrl: '/retailers/noon.png',
      isActive: true
    }
  })

  const amazon = await prisma.retailer.upsert({
    where: { id: 'retailer-amazon' },
    update: {},
    create: {
      id: 'retailer-amazon',
      nameAr: 'أمازون',
      baseUrl: 'https://www.amazon.sa',
      logoUrl: '/retailers/amazon.png',
      isActive: true
    }
  })

  // إنشاء المؤلفين
  const jamesClear = await prisma.author.upsert({
    where: { id: 'author-james-clear' },
    update: {},
    create: {
      id: 'author-james-clear',
      nameAr: 'جيمس كلير',
      nameEn: 'James Clear',
      bio: 'خبير في بناء العادات ومؤلف كتاب العادات الذرية الأكثر مبيعاً',
      xHandle: 'JamesClear',
      website: 'https://jamesclear.com'
    }
  })

  const calNewport = await prisma.author.upsert({
    where: { id: 'author-cal-newport' },
    update: {},
    create: {
      id: 'author-cal-newport',
      nameAr: 'كال نيوبورت',
      nameEn: 'Cal Newport',
      bio: 'أستاذ علوم الكمبيوتر ومؤلف كتاب العمل العميق',
      xHandle: 'calnewport',
      website: 'https://calnewport.com'
    }
  })

  // إنشاء الكتب
  const atomicHabits = await prisma.book.upsert({
    where: { id: 'book-atomic-habits' },
    update: {
      coverImageUrl: atomicCover
    },
    create: {
      id: 'book-atomic-habits',
      titleAr: 'العادات الذرية',
      titleEn: 'Atomic Habits',
      title: 'العادات الذرية', // legacy
      author: 'جيمس كلير', // legacy
      descriptionAr: 'طريقة سهلة ومثبتة لبناء عادات جيدة والتخلص من السيئة',
      coverImageUrl: atomicCover,
      isbn13: '9780735211292',
      language: 'ar',
      publishYear: 2018,
      categories: JSON.stringify(['تنمية ذاتية', 'إنتاجية', 'علم نفس']),
      source: 'manual',
      aiSummaryAr: 'يقدم جيمس كلير في هذا الكتاب منهجية علمية لبناء العادات الإيجابية والتخلص من السلبية من خلال تغييرات صغيرة (ذرية) تتراكم لتحقيق نتائج كبيرة. يركز على أربع قوانين: اجعلها واضحة، جذابة، سهلة، ومُرضية.',
      aiKeyTakeaways: JSON.stringify([
        'التغيير الحقيقي يأتي من التحسينات الصغيرة المتراكمة',
        'ركز على تغيير الهوية وليس فقط النتائج',
        'اجعل العادات الجيدة سهلة والسيئة صعبة',
        'البيئة أقوى من قوة الإرادة',
        'العادات تتشكل عبر 4 مراحل: إشارة، رغبة، استجابة، مكافأة'
      ]),
      aiForWho: JSON.stringify([
        'من يريد بناء عادات إيجابية دائمة',
        'من يعاني من التسويف والعادات السيئة',
        'المهتمين بالتطوير الذاتي المبني على العلم'
      ]),
      aiSimilarBooks: JSON.stringify([
        'قوة العادات - تشارلز دويج',
        'العادات السبع للأشخاص الأكثر فعالية',
        'لا تؤجل عمل اليوم إلى الغد',
        'الشيء الوحيد',
        'قوة الآن'
      ]),
      aiKnowledgeTags: JSON.stringify(['عادات', 'إنتاجية', 'تطوير', 'سلوك', 'علم نفس'])
    }
  })

  const deepWork = await prisma.book.upsert({
    where: { id: 'book-deep-work' },
    update: {
      coverImageUrl: deepWorkCover
    },
    create: {
      id: 'book-deep-work',
      titleAr: 'العمل العميق',
      titleEn: 'Deep Work',
      title: 'العمل العميق', // legacy
      author: 'كال نيوبورت', // legacy
      descriptionAr: 'قواعد للنجاح المركز في عالم مشتت',
      coverImageUrl: deepWorkCover,
      isbn13: '9781455586691',
      language: 'ar',
      publishYear: 2016,
      categories: JSON.stringify(['إنتاجية', 'تركيز', 'تنمية ذاتية']),
      source: 'manual',
      aiSummaryAr: 'يقدم كال نيوبورت مفهوم "العمل العميق" كمهارة حاسمة في القرن 21. يشرح كيف أن القدرة على التركيز بدون تشتيت على مهام معرفية صعبة هي ما يميز الناجحين. يقدم استراتيجيات عملية لبناء روتين عمل عميق.',
      aiKeyTakeaways: JSON.stringify([
        'العمل العميق هو القدرة الأكثر قيمة في اقتصاد المعرفة',
        'التشتيت المستمر يدمر قدرتنا على التفكير العميق',
        'بناء طقوس وروتين للعمل العميق أساسي',
        'احمِ وقتك كما تحمي أموالك',
        'اعتنق الملل - قاوم إغراء التشتيت الفوري'
      ]),
      aiForWho: JSON.stringify([
        'المهنيين الذين يريدون مضاعفة إنتاجيتهم',
        'من يعانون من التشتيت المستمر',
        'الباحثين والمبدعين الذين يحتاجون تركيز عميق'
      ]),
      aiSimilarBooks: JSON.stringify([
        'التركيز العميق - دانيال جولمان',
        'الأساسيات - جريج ماكيون',
        'الشيء الوحيد',
        'اعمل أربع ساعات فقط',
        'قوة العادات'
      ]),
      aiKnowledgeTags: JSON.stringify(['تركيز', 'إنتاجية', 'عمل عميق', 'تشتيت', 'روتين'])
    }
  })

  // ربط المؤلفين بالكتب
  await prisma.bookAuthor.upsert({
    where: { id: 'ba-atomic-james' },
    update: {},
    create: {
      id: 'ba-atomic-james',
      bookId: atomicHabits.id,
      authorId: jamesClear.id
    }
  })

  await prisma.bookAuthor.upsert({
    where: { id: 'ba-deepwork-cal' },
    update: {},
    create: {
      id: 'ba-deepwork-cal',
      bookId: deepWork.id,
      authorId: calNewport.id
    }
  })

  // إنشاء عروض الأسعار
  // العادات الذرية - 3 عروض
  await prisma.bookOffer.upsert({
    where: { id: 'offer-atomic-jarir' },
    update: {},
    create: {
      id: 'offer-atomic-jarir',
      bookId: atomicHabits.id,
      retailerId: jarir.id,
      priceAmount: 79.00,
      currency: 'SAR',
      offerUrl: 'https://www.jarir.com/atomic-habits',
      availability: 'متوفر',
      lastCheckedAt: new Date()
    }
  })

  await prisma.bookOffer.upsert({
    where: { id: 'offer-atomic-noon' },
    update: {},
    create: {
      id: 'offer-atomic-noon',
      bookId: atomicHabits.id,
      retailerId: noon.id,
      priceAmount: 75.50,
      currency: 'SAR',
      offerUrl: 'https://www.noon.com/atomic-habits',
      availability: 'متوفر',
      shippingNote: 'شحن مجاني',
      lastCheckedAt: new Date()
    }
  })

  await prisma.bookOffer.upsert({
    where: { id: 'offer-atomic-amazon' },
    update: {},
    create: {
      id: 'offer-atomic-amazon',
      bookId: atomicHabits.id,
      retailerId: amazon.id,
      priceAmount: 82.00,
      currency: 'SAR',
      offerUrl: 'https://www.amazon.sa/atomic-habits',
      availability: 'متوفر',
      lastCheckedAt: new Date()
    }
  })

  // العمل العميق - 3 عروض
  await prisma.bookOffer.upsert({
    where: { id: 'offer-deepwork-jarir' },
    update: {},
    create: {
      id: 'offer-deepwork-jarir',
      bookId: deepWork.id,
      retailerId: jarir.id,
      priceAmount: 65.00,
      currency: 'SAR',
      offerUrl: 'https://www.jarir.com/deep-work',
      availability: 'متوفر',
      lastCheckedAt: new Date()
    }
  })

  await prisma.bookOffer.upsert({
    where: { id: 'offer-deepwork-noon' },
    update: {},
    create: {
      id: 'offer-deepwork-noon',
      bookId: deepWork.id,
      retailerId: noon.id,
      priceAmount: 68.00,
      currency: 'SAR',
      offerUrl: 'https://www.noon.com/deep-work',
      availability: 'قد يتأخر',
      lastCheckedAt: new Date()
    }
  })

  await prisma.bookOffer.upsert({
    where: { id: 'offer-deepwork-amazon' },
    update: {},
    create: {
      id: 'offer-deepwork-amazon',
      bookId: deepWork.id,
      retailerId: amazon.id,
      priceAmount: 63.50,
      currency: 'SAR',
      offerUrl: 'https://www.amazon.sa/deep-work',
      availability: 'متوفر',
      shippingNote: 'شحن سريع',
      lastCheckedAt: new Date()
    }
  })

  console.log('✅ Books seeding completed!')
  console.log(`   - 2 Authors`)
  console.log(`   - 2 Books`)
  console.log(`   - 3 Retailers`)
  console.log(`   - 6 Offers`)
}

// تشغيل مباشر إذا تم استدعاء الملف
if (require.main === module) {
  seedBooks()
    .then(() => {
      console.log('✅ Seed completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
}


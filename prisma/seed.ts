import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Speaker
  const speaker = await prisma.speaker.upsert({
    where: { id: 'speaker-001' },
    update: {},
    create: {
      id: 'speaker-001',
      name: 'ضيف تجريبي',
      avatarAI: 'https://api.dicebear.com/7.x/avataaars/svg?seed=speaker001',
      bioAI: 'خبير في التنمية الذاتية والقيادة مع أكثر من 15 عاماً من الخبرة في مجال التطوير الشخصي',
      aiPersona: 'تحليلي',
      aiTopTopic: 'التنمية الذاتية',
      episodeCount: 1,
      bookMentionCount: 1,
    },
  })
  console.log('✓ Created speaker:', speaker.name)

  // Create Book
  const book = await prisma.book.upsert({
    where: { id: 'book-001' },
    update: {},
    create: {
      id: 'book-001',
      // Required fields for modern schema
      titleAr: 'كتاب تجريبي',
      // Optionally fill new required fields as needed by schema
      // Core data for compatibility
      title: 'كتاب تجريبي',
      author: 'مؤلف تجريبي',
      category: 'تنمية ذاتية',
      rating: 4.5,
      aiCoverUrl: 'https://picsum.photos/seed/book001/400/600',
      description: 'كتاب ملهم يتناول مواضيع التطوير الذاتي والنجاح الشخصي',
      aiSummary: 'يقدم هذا الكتاب رؤية شاملة لتطوير الذات من خلال استراتيجيات عملية ومثبتة علمياً. يركز على بناء العادات الإيجابية وتحقيق الأهداف طويلة المدى.',
    },
  })
  console.log('✓ Created book:', book.title)

  // Create Episode
  const episode = await prisma.episode.upsert({
    where: { id: 'episode-001' },
    update: {},
    create: {
      id: 'episode-001',
      title: 'الحلقة التجريبية',
      episodeNumber: 1,
      date: new Date('2024-01-15'),
      duration: 1200, // 20 minutes in seconds
      audioUrl: 'https://example.com/audio/episode-001.mp3',
      aiMood: 'تحفيزي',
      summaryAI: 'حلقة تجريبية تستعرض أهم المواضيع المتعلقة بالتنمية الذاتية والقيادة الفعالة. نناقش مع الضيف أهم الاستراتيجيات التي يمكن تطبيقها لتحقيق النجاح الشخصي والمهني.',
      topicsAI: 'التنمية الذاتية، القيادة، النجاح الشخصي، بناء العادات، تحقيق الأهداف',
      chaptersJson: JSON.stringify([
        {
          title: 'مقدمة الحلقة',
          startTime: 0,
          endTime: 180,
          description: 'نرحب بضيفنا ونستعرض محاور الحلقة',
        },
        {
          title: 'مناقشة الكتاب',
          startTime: 180,
          endTime: 600,
          description: 'نتحدث عن أهم أفكار الكتاب وكيفية تطبيقها',
        },
        {
          title: 'نصائح عملية',
          startTime: 600,
          endTime: 1080,
          description: 'نصائح قابلة للتطبيق الفوري',
        },
        {
          title: 'الخاتمة',
          startTime: 1080,
          endTime: 1200,
          description: 'ملخص الحلقة وكلمة أخيرة',
        },
      ]),
      highlightsJson: JSON.stringify([
        'أهمية بناء العادات اليومية الصغيرة',
        'كيف تحدد أهدافك بطريقة ذكية',
        'استراتيجيات التغلب على المماطلة',
      ]),
      aiInsightsJson: JSON.stringify({
        mainTheme: 'التطوير الذاتي المستدام',
        keyTakeaways: [
          'التغيير الحقيقي يبدأ من العادات الصغيرة',
          'النجاح رحلة وليس وجهة',
          'أهمية الاستمرارية في التطوير الذاتي',
        ],
        emotionalTone: 'إيجابي ومحفز',
        targetAudience: 'المهتمون بالتنمية الذاتية والتطوير المهني',
        difficulty: 'مبتدئ',
      }),
    },
  })
  console.log('✓ Created episode:', episode.title)

  // Link Episode to Book
  await prisma.bookEpisode.upsert({
    where: {
      episodeId_bookId: {
        episodeId: episode.id,
        bookId: book.id,
      },
    },
    update: {},
    create: {
      episodeId: episode.id,
      bookId: book.id,
    },
  })
  console.log('✓ Linked episode to book')

  // Link Episode to Speaker
  await prisma.speakerEpisode.upsert({
    where: {
      episodeId_speakerId: {
        episodeId: episode.id,
        speakerId: speaker.id,
      },
    },
    update: {},
    create: {
      episodeId: episode.id,
      speakerId: speaker.id,
    },
  })
  console.log('✓ Linked episode to speaker')

  // Create Quote 1
  const quote1 = await prisma.quote.upsert({
    where: { id: 'quote-001' },
    update: {},
    create: {
      id: 'quote-001',
      text: 'النجاح ليس مفتاحاً للسعادة، بل السعادة هي مفتاح النجاح. إذا كنت تحب ما تفعله، فستنجح.',
      episodeId: episode.id,
      speakerId: speaker.id,
      bookId: book.id,
    },
  })
  console.log('✓ Created quote 1')

  // Create Quote 2
  const quote2 = await prisma.quote.upsert({
    where: { id: 'quote-002' },
    update: {},
    create: {
      id: 'quote-002',
      text: 'العادات الصغيرة هي التي تصنع الفرق الكبير. ابدأ بخطوة واحدة كل يوم.',
      episodeId: episode.id,
      speakerId: speaker.id,
    },
  })
  console.log('✓ Created quote 2')

  console.log('✅ Database seeded successfully!')
  console.log('\nSummary:')
  console.log('- 1 Speaker created')
  console.log('- 1 Book created')
  console.log('- 1 Episode created')
  console.log('- 2 Quotes created')
  console.log('- Relations connected')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })




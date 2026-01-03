import type { Node, Edge, StoryPath } from './types'

// العقد - موزعة على الأنواع الأربعة
export const mockNodes: Node[] = [
  // === أفكار (8 عقد) ===
  {
    id: 'idea-habits',
    label: 'العادات',
    type: 'فكرة',
    x: 200,
    y: 150,
    description: 'أنماط سلوكية متكررة تشكل حياتنا اليومية وتحدد نتائجنا على المدى الطويل',
    stats: { episodeCount: 12, mentionCount: 45 }
  },
  {
    id: 'idea-productivity',
    label: 'الإنتاجية',
    type: 'فكرة',
    x: 130,
    y: 280,
    description: 'إنجاز الأهم وليس الأكثر - التركيز على النتائج ذات القيمة العالية',
    stats: { episodeCount: 8, mentionCount: 32 }
  },
  {
    id: 'idea-thinking',
    label: 'التفكير',
    type: 'فكرة',
    x: 320,
    y: 250,
    description: 'التمييز بين التفكير السريع الحدسي والتفكير البطيء العميق',
    stats: { episodeCount: 15, mentionCount: 58 }
  },
  {
    id: 'idea-awareness',
    label: 'الوعي',
    type: 'فكرة',
    x: 80,
    y: 130,
    description: 'أساس التطور الشخصي - القدرة على ملاحظة أفكارنا ومشاعرنا دون حكم',
    stats: { episodeCount: 6, mentionCount: 24 }
  },
  {
    id: 'idea-focus',
    label: 'التركيز',
    type: 'فكرة',
    x: 500,
    y: 120,
    description: 'القدرة على توجيه الانتباه الكامل لمهمة واحدة في عالم مليء بالمشتتات',
    stats: { episodeCount: 10, mentionCount: 38 }
  },
  {
    id: 'idea-discipline',
    label: 'الانضباط',
    type: 'فكرة',
    x: 420,
    y: 320,
    description: 'فعل ما يجب فعله حتى لو لم نرغب فيه - جوهر النجاح المستدام',
    stats: { episodeCount: 7, mentionCount: 28 }
  },
  {
    id: 'idea-identity',
    label: 'الهوية',
    type: 'فكرة',
    x: 280,
    y: 50,
    description: 'التغيير الحقيقي يبدأ من تغيير من نعتقد أننا نحن',
    stats: { episodeCount: 5, mentionCount: 19 }
  },
  {
    id: 'idea-deepwork',
    label: 'العمل العميق',
    type: 'فكرة',
    x: 600,
    y: 220,
    description: 'العمل المركز بلا تشتيت في مهام ذات قيمة معرفية عالية',
    stats: { episodeCount: 9, mentionCount: 35 }
  },

  // === كتب (6 عقد) ===
  {
    id: 'book-atomic',
    label: 'العادات الذرية',
    type: 'كتاب',
    x: 350,
    y: 150,
    description: 'دليل عملي لبناء عادات جيدة والتخلص من السيئة عبر تغييرات صغيرة',
    meta: { author: 'جيمس كلير' }
  },
  {
    id: 'book-deepwork',
    label: 'العمل العميق',
    type: 'كتاب',
    x: 550,
    y: 180,
    description: 'قواعد للنجاح المركز في عالم مشتت',
    meta: { author: 'كال نيوبورت' }
  },
  {
    id: 'book-thinking',
    label: 'التفكير السريع والبطيء',
    type: 'كتاب',
    x: 470,
    y: 250,
    description: 'فهم نظامي التفكير في العقل البشري',
    meta: { author: 'دانيال كانمان' }
  },
  {
    id: 'book-power-now',
    label: 'قوة الآن',
    type: 'كتاب',
    x: 150,
    y: 50,
    description: 'دليل للتنوير الروحي والعيش في اللحظة الحاضرة',
    meta: { author: 'إيكهارت تول' }
  },
  {
    id: 'book-7habits',
    label: 'العادات السبع',
    type: 'كتاب',
    x: 520,
    y: 350,
    description: 'عادات الأشخاص الأكثر فعالية',
    meta: { author: 'ستيفن كوفي' }
  },
  {
    id: 'book-essentialism',
    label: 'الأساسيات',
    type: 'كتاب',
    x: 250,
    y: 330,
    description: 'السعي المنضبط للأقل ولكن الأفضل',
    meta: { author: 'جريج ماكيون' }
  },

  // === حلقات (3 عقد) ===
  {
    id: 'ep-156',
    label: 'الحلقة #156',
    type: 'حلقة',
    x: 380,
    y: 200,
    description: 'كيف تبني عادات تدوم؟ - مناقشة كتاب العادات الذرية',
    meta: { episodeNumber: 156 },
    stats: { duration: '45 دقيقة' }
  },
  {
    id: 'ep-142',
    label: 'الحلقة #142',
    type: 'حلقة',
    x: 450,
    y: 120,
    description: 'قوة التركيز في عصر التشتيت',
    meta: { episodeNumber: 142 },
    stats: { duration: '52 دقيقة' }
  },
  {
    id: 'ep-128',
    label: 'الحلقة #128',
    type: 'حلقة',
    x: 300,
    y: 300,
    description: 'فن الانضباط الذاتي',
    meta: { episodeNumber: 128 },
    stats: { duration: '38 دقيقة' }
  },

  // === متحدثون (3 عقد) ===
  {
    id: 'speaker-ahmad',
    label: 'أحمد السالم',
    type: 'متحدث',
    x: 240,
    y: 200,
    description: 'خبير في تطوير العادات والإنتاجية الشخصية',
    meta: { expertise: 'العادات والإنتاجية' },
    stats: { episodeCount: 8 }
  },
  {
    id: 'speaker-sara',
    label: 'سارة الخالد',
    type: 'متحدث',
    x: 600,
    y: 300,
    description: 'باحثة في علم النفس السلوكي والتغيير',
    meta: { expertise: 'علم النفس السلوكي' },
    stats: { episodeCount: 5 }
  },
  {
    id: 'speaker-mohammed',
    label: 'محمد العتيبي',
    type: 'متحدث',
    x: 400,
    y: 380,
    description: 'كاتب ومدرب متخصص في التفكير الاستراتيجي',
    meta: { expertise: 'التفكير الاستراتيجي' },
    stats: { episodeCount: 6 }
  }
]

// الروابط مع أسباب واضحة
export const mockEdges: Edge[] = [
  // العادات ← الإنتاجية
  {
    id: 'e1',
    source: 'idea-habits',
    target: 'idea-productivity',
    weight: 3,
    reason: 'العادات الصحيحة هي أساس الإنتاجية المستدامة',
    tags: ['أساسي']
  },
  // العادات ← كتاب العادات الذرية
  {
    id: 'e2',
    source: 'idea-habits',
    target: 'book-atomic',
    weight: 3,
    reason: 'الكتاب المرجع الأساسي لفهم وبناء العادات',
    tags: ['كتاب مرجعي']
  },
  // كتاب العادات ← الحلقة 156
  {
    id: 'e3',
    source: 'book-atomic',
    target: 'ep-156',
    weight: 3,
    reason: 'الحلقة تناقش الكتاب بعمق مع أمثلة عملية',
    tags: ['مناقشة كتاب']
  },
  // الحلقة 156 ← أحمد السالم
  {
    id: 'e4',
    source: 'ep-156',
    target: 'speaker-ahmad',
    weight: 2,
    reason: 'أحمد ضيف الحلقة ويشارك خبرته في بناء العادات',
    tags: ['ضيف']
  },
  // التركيز ← العمل العميق (الفكرة)
  {
    id: 'e5',
    source: 'idea-focus',
    target: 'idea-deepwork',
    weight: 3,
    reason: 'التركيز هو جوهر العمل العميق المنتج',
    tags: ['مترابط']
  },
  // العمل العميق ← كتاب العمل العميق
  {
    id: 'e6',
    source: 'idea-deepwork',
    target: 'book-deepwork',
    weight: 3,
    reason: 'الكتاب يؤسس لمفهوم العمل العميق ويقدم منهجية',
    tags: ['كتاب مرجعي']
  },
  // كتاب العمل العميق ← الحلقة 142
  {
    id: 'e7',
    source: 'book-deepwork',
    target: 'ep-142',
    weight: 2,
    reason: 'الحلقة تستعرض أفكار الكتاب وتطبيقاته العملية',
    tags: ['استعراض']
  },
  // التفكير ← كتاب التفكير السريع
  {
    id: 'e8',
    source: 'idea-thinking',
    target: 'book-thinking',
    weight: 3,
    reason: 'الكتاب يشرح علميًا كيف يعمل التفكير البشري',
    tags: ['كتاب مرجعي']
  },
  // الانضباط ← الحلقة 128
  {
    id: 'e9',
    source: 'idea-discipline',
    target: 'ep-128',
    weight: 3,
    reason: 'الحلقة مخصصة لموضوع الانضباط الذاتي',
    tags: ['موضوع رئيسي']
  },
  // الهوية ← العادات
  {
    id: 'e10',
    source: 'idea-identity',
    target: 'idea-habits',
    weight: 3,
    reason: 'تغيير الهوية هو المفتاح لتغيير العادات بشكل دائم',
    tags: ['أساسي']
  },
  // الوعي ← قوة الآن
  {
    id: 'e11',
    source: 'idea-awareness',
    target: 'book-power-now',
    weight: 2,
    reason: 'الكتاب يركز على الوعي باللحظة الحاضرة',
    tags: ['روحاني']
  },
  // الانضباط ← كتاب العادات السبع
  {
    id: 'e12',
    source: 'idea-discipline',
    target: 'book-7habits',
    weight: 2,
    reason: 'الكتاب يقدم إطار عمل للانضباط الذاتي',
    tags: ['إطار عمل']
  },
  // الإنتاجية ← كتاب الأساسيات
  {
    id: 'e13',
    source: 'idea-productivity',
    target: 'book-essentialism',
    weight: 3,
    reason: 'الكتاب يعلم كيف نركز على الأساسيات وننتج أكثر',
    tags: ['منهجية']
  },
  // سارة ← الحلقة 156
  {
    id: 'e14',
    source: 'speaker-sara',
    target: 'ep-156',
    weight: 1,
    reason: 'سارة شاركت في تحليل سلوكي للعادات',
    tags: ['مشاركة']
  },
  // محمد ← الحلقة 128
  {
    id: 'e15',
    source: 'speaker-mohammed',
    target: 'ep-128',
    weight: 2,
    reason: 'محمد ضيف الحلقة ومختص بالانضباط',
    tags: ['ضيف']
  },
  // التركيز ← الحلقة 142
  {
    id: 'e16',
    source: 'idea-focus',
    target: 'ep-142',
    weight: 3,
    reason: 'الحلقة بالكامل عن قوة التركيز',
    tags: ['موضوع رئيسي']
  },
  // أحمد ← العادات
  {
    id: 'e17',
    source: 'speaker-ahmad',
    target: 'idea-habits',
    weight: 3,
    reason: 'أحمد متخصص في العادات وتحدث عنها في عدة حلقات',
    tags: ['تخصص']
  }
]

// المسارات القصصية
export const storyPaths: StoryPath[] = [
  {
    id: 'path-habits',
    title: 'مسار بناء العادات',
    description: 'رحلة معرفية لفهم العادات وبنائها بشكل علمي ومستدام',
    currentStep: 0,
    steps: [
      {
        nodeId: 'idea-habits',
        explanation: 'نبدأ بفهم ماهية العادات وكيف تتشكل في عقولنا',
        duration: 3000
      },
      {
        nodeId: 'idea-identity',
        explanation: 'التغيير الدائم يبدأ من تغيير الهوية - من نعتقد أننا نحن',
        duration: 3000
      },
      {
        nodeId: 'book-atomic',
        explanation: 'كتاب العادات الذرية يقدم منهجية علمية للتغيير',
        duration: 3000
      },
      {
        nodeId: 'ep-156',
        explanation: 'نستمع للحلقة لفهم تطبيقات عملية من الكتاب',
        duration: 3000
      },
      {
        nodeId: 'speaker-ahmad',
        explanation: 'أحمد السالم يشارك خبرته الشخصية في بناء العادات',
        duration: 3000
      }
    ]
  },
  {
    id: 'path-deepwork',
    title: 'مسار التفكير العميق',
    description: 'كيف نعمل بعمق في عالم مليء بالمشتتات',
    currentStep: 0,
    steps: [
      {
        nodeId: 'idea-focus',
        explanation: 'التركيز هو المهارة الأكثر قيمة في القرن 21',
        duration: 3000
      },
      {
        nodeId: 'idea-deepwork',
        explanation: 'العمل العميق: القدرة على إنتاج قيمة عالية بتركيز كامل',
        duration: 3000
      },
      {
        nodeId: 'book-deepwork',
        explanation: 'كال نيوبورت يقدم قواعد للنجاح المركز',
        duration: 3000
      },
      {
        nodeId: 'ep-142',
        explanation: 'الحلقة تناقش كيف نطبق العمل العميق عمليًا',
        duration: 3000
      }
    ]
  },
  {
    id: 'path-productivity',
    title: 'مسار الإنتاجية المستدامة',
    description: 'من الفوضى إلى النظام: بناء نظام إنتاجي يدوم',
    currentStep: 0,
    steps: [
      {
        nodeId: 'idea-productivity',
        explanation: 'الإنتاجية الحقيقية: إنجاز الأهم وليس الأكثر',
        duration: 3000
      },
      {
        nodeId: 'book-essentialism',
        explanation: 'السعي المنضبط للأقل ولكن الأفضل',
        duration: 3000
      },
      {
        nodeId: 'idea-discipline',
        explanation: 'الانضباط هو الجسر بين الأهداف والإنجاز',
        duration: 3000
      },
      {
        nodeId: 'ep-128',
        explanation: 'فن الانضباط الذاتي في الحياة اليومية',
        duration: 3000
      },
      {
        nodeId: 'speaker-mohammed',
        explanation: 'محمد يشارك استراتيجيات عملية للإنتاجية',
        duration: 3000
      }
    ]
  }
]


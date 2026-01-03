import { llm } from '../ai/shared/llm'

export interface BookIntelligence {
  summaryAr: string // ملخص بالعربية (3-5 أسطر)
  keyTakeaways: string[] // 5 أفكار رئيسية
  forWho: string[] // 3 نقاط: لمن يناسب
  similarBooks: string[] // 5 كتب مشابهة (عناوين)
  knowledgeTags: string[] // tags للخريطة المعرفية
}

/**
 * توليد ذكاء شامل عن كتاب
 */
export async function generateBookIntelligence(
  title: string,
  author: string,
  description?: string
): Promise<BookIntelligence> {
  const prompt = `أنت خبير في الكتب والمعرفة. مهمتك تحليل كتاب وتقديم رؤى قيمة بالعربية.

الكتاب:
العنوان: ${title}
المؤلف: ${author}
${description ? `الوصف: ${description}` : ''}

اكتب بصيغة JSON فقط (بدون markdown):
{
  "summaryAr": "ملخص مختصر بالعربية (3-5 جمل) يوضح الفكرة الرئيسية والقيمة",
  "keyTakeaways": ["فكرة رئيسية 1", "فكرة رئيسية 2", "...", "فكرة 5"],
  "forWho": ["هذا الكتاب مناسب لـ...", "مفيد لمن يريد...", "يستفيد منه..."],
  "similarBooks": ["عنوان كتاب مشابه 1", "...", "عنوان 5"],
  "knowledgeTags": ["عادات", "إنتاجية", "تفكير", "..."] 
}

قواعد:
- جميع النصوص بالعربية فصيحة واضحة
- الملخص مختصر ومفيد (ليس نسخ من الوصف)
- الأفكار الرئيسية عملية ومركزة
- الكتب المشابهة شهيرة ومعروفة
- Tags بسيطة (كلمة-كلمتين) للربط بخريطة المعرفة`

  try {
    const response = await llm(prompt, {
      temperature: 0.7,
      maxTokens: 1500
    })

    const intelligence: BookIntelligence = JSON.parse(response)
    
    // التحقق من البيانات
    if (!intelligence.summaryAr || !Array.isArray(intelligence.keyTakeaways)) {
      throw new Error('Invalid AI response format')
    }

    return intelligence
  } catch (error) {
    console.error('Book intelligence generation error:', error)
    
    // Fallback بيانات افتراضية
    return {
      summaryAr: `${title} هو كتاب قيم من تأليف ${author}، يقدم رؤى عميقة حول موضوعه.`,
      keyTakeaways: [
        'أفكار قيمة من الكتاب',
        'رؤى عملية قابلة للتطبيق',
        'منهجية واضحة',
        'أمثلة عملية',
        'نصائح قابلة للتنفيذ'
      ],
      forWho: [
        'القراء المهتمين بالتطوير',
        'من يبحث عن المعرفة',
        'المهتمين بالموضوع'
      ],
      similarBooks: [
        'كتب مشابهة في نفس المجال',
        'مراجع إضافية',
        'قراءات موصى بها'
      ],
      knowledgeTags: ['معرفة', 'تطوير', 'تفكير']
    }
  }
}

/**
 * ترجمة عنوان/وصف من الإنجليزية للعربية (إذا لزم)
 */
export async function translateToArabic(text: string, context: 'title' | 'description'): Promise<string> {
  // إذا النص يحتوي على عربي، لا تترجم
  if (/[\u0600-\u06FF]/.test(text)) {
    return text
  }

  const prompt = `ترجم ${context === 'title' ? 'عنوان' : 'وصف'} الكتاب التالي للعربية بشكل احترافي ودقيق:

${text}

قدم الترجمة فقط بدون أي نص إضافي.`

  try {
    const translation = await llm(prompt, {
      temperature: 0.3,
      maxTokens: context === 'title' ? 100 : 500
    })
    
    return translation.trim()
  } catch (error) {
    console.error('Translation error:', error)
    return text // fallback للنص الأصلي
  }
}


# 📚 وحدة ذكاء الكتب - Book Intelligence Module

نظام متكامل لإدارة الكتب مع ذكاء اصطناعي وعروض أسعار تلقائية.

## 🎯 المميزات

### ✅ تم التنفيذ

1. **جلب بيانات الكتب تلقائياً**
   - Google Books API
   - OpenLibrary API
   - البحث بـ ISBN أو العنوان+المؤلف
   - تطبيع البيانات من مصادر متعددة

2. **عروض الأسعار من متاجر متعددة**
   - تخزين عروض من جرير، نون، أمازون
   - حساب الأرخص تلقائياً
   - عرض التوفر (متوفر/غير متوفر/قد يتأخر)
   - آخر تحديث للسعر

3. **ذكاء اصطناعي للكتب**
   - ملخص عربي (3-5 جمل)
   - 5 أفكار رئيسية
   - "لمن يناسب" (3 نقاط)
   - 5 كتب مشابهة
   - Tags للخريطة المعرفية

4. **UI Components**
   - SmartBookCard (كرت ذكي كامل)
   - عرض أفضل سعر
   - عرض متاجر أخرى
   - تصميم Book-inspired

## 📁 الهيكل

\`\`\`
lib/books/
├── providers/
│   ├── types.ts              # أنواع المصادر
│   ├── googleBooks.ts        # Google Books API
│   ├── openLibrary.ts        # OpenLibrary API
│   └── index.ts              # Unified interface
├── bookIntelligence.ts       # AI Layer
└── README.md

app/components/books/
└── SmartBookCard.tsx         # كرت الكتاب الذكي

app/api/books/
└── lookup/route.ts           # API endpoint

prisma/
└── seedBooks.ts              # بيانات تجريبية
\`\`\`

## 🗄️ قاعدة البيانات

### Models جديدة:

**Author** - المؤلفون
- nameAr, nameEn
- bio
- xHandle (Twitter)
- website

**Book** (محدّث)
- titleAr, titleEn
- descriptionAr
- ISBN10, ISBN13
- coverImageUrl
- categories (JSON array)
- AI fields (summary, takeaways, forWho, similarBooks, tags)

**Retailer** - المتاجر
- nameAr
- baseUrl, logoUrl
- isActive

**BookOffer** - عروض الأسعار
- book + retailer
- priceAmount, currency
- offerUrl, availability
- lastCheckedAt

**BookAuthor** - علاقة many-to-many

## 🚀 الاستخدام

### 1. البحث عن كتاب

\`\`\`typescript
import { lookupBookByISBN, searchBooks } from '@/lib/books/providers'

// بالـ ISBN
const book = await lookupBookByISBN('9780735211292')

// بالعنوان
const results = await searchBooks({
  title: 'Atomic Habits',
  author: 'James Clear'
})
\`\`\`

### 2. توليد ذكاء للكتاب

\`\`\`typescript
import { generateBookIntelligence } from '@/lib/books/bookIntelligence'

const intelligence = await generateBookIntelligence(
  'العادات الذرية',
  'جيمس كلير',
  'وصف الكتاب...'
)
\`\`\`

### 3. عرض الكتاب في UI

\`\`\`tsx
import { SmartBookCard } from '@/app/components/books/SmartBookCard'

<SmartBookCard book={bookData} variant="full" />
\`\`\`

## 📊 البيانات التجريبية

### Seed Data (seedBooks.ts):
- ✅ **2 مؤلفين**: جيمس كلير، كال نيوبورت
- ✅ **2 كتاب**: العادات الذرية، العمل العميق
- ✅ **3 متاجر**: جرير، نون، أمازون
- ✅ **6 عروض**: 3 لكل كتاب بأسعار مختلفة

### تشغيل Seed:
\`\`\`bash
npx tsx prisma/seedBooks.ts
\`\`\`

## 🎨 SmartBookCard Features

### المكونات:
1. **Header**: غلاف + عنوان + مؤلف + badges
2. **ملخص ذكي**: مع أيقونة Sparkles
3. **أفكار رئيسية**: Chips قابلة للقراءة
4. **أفضل سعر**: card مميز باللون الأخضر
5. **متاجر أخرى**: قابلة للتوسع
6. **لمن يناسب**: bullets
7. **تنويه الأسعار**: disclaimer صغير

### Variants:
- `full`: كل التفاصيل
- `compact`: ملخص مختصر

## 🔄 سير العمل (Workflow)

### إضافة كتاب جديد:

1. **API Call**:
\`\`\`
POST /api/books/lookup
{ "isbn": "9780735211292" }
\`\`\`

2. **النظام يقوم بـ**:
   - جلب البيانات من Google Books/OpenLibrary
   - ترجمة للعربية إذا لزم
   - توليد ذكاء بالـ AI
   - إرجاع بيانات كاملة

3. **حفظ في DB**:
\`\`\`typescript
await prisma.book.create({
  data: {
    titleAr: enrichedBook.titleAr,
    // ... باقي الحقول
    authors: {
      create: [/* ... */]
    }
  }
})
\`\`\`

4. **إضافة العروض يدوياً** (حالياً):
\`\`\`typescript
await prisma.bookOffer.create({
  data: {
    bookId: book.id,
    retailerId: retailer.id,
    priceAmount: 79.00,
    currency: 'SAR',
    offerUrl: '...',
    availability: 'متوفر'
  }
})
\`\`\`

## 🔮 المرحلة التالية (TODO)

### Phase 2 - Automation:
- [ ] Automated price scraping (مع APIs/affiliate)
- [ ] Cron job لتحديث الأسعار كل 24 ساعة
- [ ] Price history tracking
- [ ] Price alerts للمستخدمين

### Phase 3 - Enhanced AI:
- [ ] توصيات مخصصة للمستخدم
- [ ] AI-generated book comparisons
- [ ] Knowledge graph integration
- [ ] Reading level detection

### Phase 4 - User Features:
- [ ] قوائم القراءة (Reading lists)
- [ ] تقييمات المستخدمين
- [ ] ملاحظات على الكتب
- [ ] مشاركة الاقتباسات

## ⚙️ Configuration

### Environment Variables (مطلوبة):
\`\`\`env
OPENAI_API_KEY=sk-...  # للذكاء الاصطناعي
\`\`\`

### اختياري (للمستقبل):
\`\`\`env
GOOGLE_BOOKS_API_KEY=...  # لزيادة Rate limits
AFFILIATE_JARIR_ID=...     # Affiliate tracking
AFFILIATE_NOON_ID=...
\`\`\`

## 🐛 Known Issues

لا توجد issues حالياً.

## 📝 Notes

- العروض حالياً يدوية - تحتاج إضافة عبر seed أو admin panel
- الأسعار تقديرية - يجب التحقق من المتجر
- AI يحتاج OpenAI API key للعمل
- Google Books API له rate limits (1000 request/day مجاناً)

---

**صُمم بـ ❤️ لمنصة "فطور السبت"**


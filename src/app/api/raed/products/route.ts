// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API المنتجات والدورات
// جميع الدورات مجانية بالكامل 🎁
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

// الدورات المتاحة - مجانية بالكامل مع صيغ تعليمية
const COURSES = [
  {
    id: "prompt_engineering",
    title: "دورة تعليم هندسة الأوامر الذكية (Smart Prompting)",
    price: "مجاني تماماً 🎁",
    description: "تعلم كتابة أوامر احترافية للذكاء الاصطناعي: تشريح الأمر، Chain of Thought، Few-Shot، منع الهلوسة",
    formula: "صيغة المحاكاة التفاعلية (Interactive Simulation)",
    duration: "12 ساعة",
    lessons: 4,
    rating: 4.9,
    keywords: ['هندسة', 'أوامر', 'برومبت', 'prompt', 'GPT', 'ذكاء اصطناعي', 'هندسة الأوامر']
  },
  {
    id: "ai_agents",
    title: "دورة تعليم بناء وكلاء الذكاء الاصطناعي (AI Agents)",
    price: "مجاني تماماً 🎁",
    description: "تعلم استخدام LangChain وربط الأدوات الخارجية والتفكير المنطقي للآلة",
    formula: "صيغة التعلم القائم على المشاريع (Project-Based Learning)",
    duration: "18 ساعة",
    lessons: 4,
    rating: 4.9,
    keywords: ['وكلاء', 'agent', 'agents', 'langchain', 'ذكاء اصطناعي', 'ai', 'روبوت', 'وكيل']
  },
  {
    id: "machine_learning",
    title: "دورة تعليم أساسيات تعلم الآلة (Machine Learning)",
    price: "مجاني تماماً 🎁",
    description: "افهم كيف تفكر الآلة وتدريب النماذج وتنظيف البيانات وأخلاقيات الذكاء الاصطناعي",
    formula: "صيغة التحليل التطبيقي (Applied Analysis)",
    duration: "15 ساعة",
    lessons: 4,
    rating: 4.8,
    keywords: ['تعلم آلي', 'machine learning', 'machine', 'تعلم', 'ml', 'بيانات', 'تحليل', 'نموذج']
  }
];

// GET - الحصول على جميع الدورات
export async function GET() {
  return NextResponse.json({
    success: true,
    courses: COURSES
  });
}

// POST - كشف الدورات المناسبة
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({
        success: true,
        courses: [],
        detection: { wantsToLearn: false, topic: '' }
      });
    }

    const lowerMessage = message.toLowerCase();
    
    // كشف نية التعلم
    const learningKeywords = [
      'تعلم', 'دورة', 'كورس', 'أريد', 'كيف', 'أبدأ',
      'هندسة', 'أوامر', 'برومبت', 'prompt', 'agent',
      'وكلاء', 'machine learning', 'تعلم آلي', 'ذكاء اصطناعي',
      'langchain', 'نموذج', 'بيانات'
    ];
    const wantsToLearn = learningKeywords.some(kw => lowerMessage.includes(kw));

    // البحث عن دورات مناسبة
    const recommendedCourses = COURSES.filter(course => 
      course.keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))
    );

    // إذا لم نجد دورات ويريد التعلم، نعرض الكل
    const finalCourses = recommendedCourses.length > 0 
      ? recommendedCourses 
      : (wantsToLearn ? COURSES : []);

    return NextResponse.json({
      success: true,
      courses: finalCourses,
      detection: {
        wantsToLearn,
        topic: message.substring(0, 50),
        confidence: wantsToLearn ? 85 : 30
      }
    });

  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({
      success: false,
      courses: [],
      error: 'حدث خطأ في تحليل الرسالة'
    });
  }
}

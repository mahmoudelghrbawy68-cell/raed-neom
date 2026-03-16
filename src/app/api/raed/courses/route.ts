// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - نظام إدارة الدورات التعليمية
// جميع الدورات مجانية بالكامل 🎁
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════════
// هيكل الدرس التعليمي
// ═══════════════════════════════════════════════════════════════════════════════
interface Lesson {
  id: string;
  title: string;
  content: string;
  example: string;
  task?: string;
}

interface Course {
  id: string;
  name: string;
  formula: string;
  status: string;
  duration: string;
  lessons: Lesson[];
  keywords: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// الدورة الأولى: هندسة الأوامر الذكية
// ═══════════════════════════════════════════════════════════════════════════════
const PROMPT_ENGINEERING_COURSE: Course = {
  id: "prompt_engineering",
  name: "دورة تعليم هندسة الأوامر الذكية (Smart Prompting)",
  formula: "صيغة المحاكاة التفاعلية (Interactive Simulation)",
  status: "مجاني تماماً 🎁",
  duration: "12 ساعة",
  keywords: ['هندسة', 'أوامر', 'برومبت', 'prompt', 'GPT', 'ذكاء اصطناعي'],
  lessons: [
    {
      id: "1",
      title: "تشريح الأمر الاحترافي (The Anatomy of a Pro Prompt)",
      content: `في هذا الدرس، ننتقل من مجرد 'الدردشة' إلى 'البرمجة اللغوية'. 

الأمر الاحترافي يتكون من 4 أركان أساسية (Framework):

**1. الشخصية (Persona):** 
حدد من هو الذكاء الاصطناعي (مثلاً: أنت خبير أمن سيبراني).

**2. السياق (Context):** 
أعطه المعلومات الخلفية (البيانات التي يعمل عليها).

**3. المهمة (Task):** 
ماذا تريد منه بالضبط وبشكل محدد؟

**4. القيود (Constraints):** 
حدد له ما لا يجب فعله (مثلاً: لا تزد عن 50 كلمة).`,
      example: `"أنت خبير تسويق (شخصية). نريد إطلاق منتج قهوة جديد (سياق). اكتب 3 عناوين جذابة (مهمة). اجعلها باللغة العربية الفصحى فقط (قيود)."`,
      task: "قم بكتابة أمر احترافي باستخدام الأركان الأربعة لطلب خطة تسويقية لمنتج تختاره."
    },
    {
      id: "2",
      title: "سلاسل التفكير (Chain of Thought - CoT)",
      content: `أحدث تقنية لزيادة ذكاء الآلة هي إجبارها على التفكير بصوت عالٍ.

بدلاً من طلب النتيجة مباشرة، نطلب من الآلة: 'فكر خطوة بخطوة' (Let's think step by step).

**الفوائد:**
- يقلل الأخطاء المنطقية بنسبة تصل إلى 80%
- يعطي نتائج أفضل في المهام المعقدة
- يساعد في تتبع خطوات الحل

**متى تستخدمه؟**
- المسائل الرياضية والبرمجية
- التحليل المنطقي المعقد
- اتخاذ القرارات المتعددة المراحل`,
      example: `"حل هذه المسألة الرياضية المعقدة وفكر في كل خطوة واشرح سبب اختيارك لكل معادلة قبل الوصول للناتج النهائي."`,
      task: "اطلب من الذكاء الاصطناعي تحليل مشكلة برمجية باستخدام Chain of Thought."
    },
    {
      id: "3",
      title: "هندسة الأوامر قليلة المحاولات (Few-Shot Prompting)",
      content: `الذكاء الاصطناعي يتعلم بالنماذج. في هذا الدرس نتعلم كيف نعطي الآلة أمثلة قبل طلب المهمة.

**كيف يعمل؟**
إذا أردت من الآلة تصنيف المشاعر، أعطها 3 أمثلة سابقة (Input → Output) ثم اطلب منها تصنيف المدخل الرابع.

**مميزات التقنية:**
- تجعل الردود دقيقة جداً
- مطابقة لأسلوبك الشخصي
- توفر وقت الشرح الطويل`,
      example: `"المدخل: الفيلم رائع | المخرج: إيجابي
المدخل: الخدمة سيئة | المخرج: سلبي
المدخل: الجو مقبول | المخرج: ؟"`,
      task: "أنشئ 3 أمثلة لتعليم الذكاء الاصطناعي كتابة عناوين بريد إلكتروني احترافية."
    },
    {
      id: "4",
      title: "التحكم المطلق ومنع الهلوسة (Anti-Hallucination)",
      content: `أكبر مشكلة في الذكاء الاصطناعي هي 'الهلوسة' (تأليف معلومات).

**التقنية الحديثة لمنع ذلك:**
استخدام 'المطالبة بالصدق' - نضيف للأمر تعليمات صارمة.

**النصيحة الذهبية:**
"إذا لم تكن متأكداً من الإجابة بناءً على البيانات المتوفرة، قل لا أعرف ولا تحاول التأليف."

**علامات الهلوسة:**
- معلومات محددة جداً بدون مصدر
- إحصائيات غريبة
- أسماء أو تواريخ مشبوهة`,
      example: `"لخص هذا التقرير الطبي، وإذا وجدت معلومة غير واضحة، أشر إليها بكلمة [غير مؤكد] بدلاً من استنتاجها."`,
      task: "اكتب أمراً يطلب من الذكاء الاصطناعي البحث عن معلومة مع منع الهلوسة."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// الدورة الثانية: بناء وكلاء الذكاء الاصطناعي
// ═══════════════════════════════════════════════════════════════════════════════
const AI_AGENTS_COURSE: Course = {
  id: "ai_agents",
  name: "دورة تعليم بناء وكلاء الذكاء الاصطناعي (AI Agents)",
  formula: "صيغة التعلم القائم على المشاريع (Project-Based Learning)",
  status: "مجاني تماماً 🎁",
  duration: "18 ساعة",
  keywords: ['وكلاء', 'agent', 'agents', 'langchain', 'ذكاء اصطناعي', 'ai', 'روبوت'],
  lessons: [
    {
      id: "1",
      title: "ما هو وكيل الذكاء الاصطناعي؟ (What is an AI Agent?)",
      content: `وكيل الذكاء الاصطناعي هو برنامج يستطيع:
- فهم المهام المعقدة
- اتخاذ قرارات مستقلة
- استخدام أدوات خارجية
- التفاعل مع البيئة

**الفرق بين Chatbot و Agent:**
- Chatbot: يرد على أسئلتك فقط
- Agent: ينفذ مهام كاملة بشكل مستقل`,
      example: `"وكيل بريد إلكتروني ذكي يقرأ رسائلك، يصنفها، يرد على المهمة، ويحذف السبام."`,
      task: "فكر في 3 مهام يمكن لوكيل ذكي القيام بها بدلاً عنك."
    },
    {
      id: "2",
      title: "مقدمة في LangChain (Introduction to LangChain)",
      content: `LangChain هو إطار عمل لبناء تطبيقات الذكاء الاصطناعي.

**المكونات الأساسية:**
1. **Models:** النماذج اللغوية (GPT-4, Claude, etc.)
2. **Prompts:** قوالب الأوامر
3. **Chains:** سلاسل من المهام المتتالية
4. **Agents:** الوكلاء الأذكياء
5. **Tools:** الأدوات الخارجية

**لماذا LangChain؟**
- سهولة التكامل مع نماذج متعددة
- إدارة الذاكرة والمحادثات
- أدوات جاهزة للعديد من المهام`,
      example: `from langchain.agents import initialize_agent
from langchain.llms import OpenAI

llm = OpenAI(temperature=0)
agent = initialize_agent(tools=[], llm=llm)`,
      task: "قم بتثبيت LangChain وتشغيل مثال بسيط."
    },
    {
      id: "3",
      title: "ربط الأدوات الخارجية (Connecting External Tools)",
      content: `الوكلاء الأذكياء يحتاجون أدوات للتفاعل مع العالم الخارجي.

**أدوات شائعة:**
- البحث على الإنترنت (Google Search)
- قراءة الملفات (PDF, CSV, etc.)
- إرسال الإيميلات
- الوصول لقواعد البيانات
- تنفيذ الأكواد

**كيف تعمل الأدوات؟**
الأداة = اسم + وصف + دالة تنفيذ`,
      example: `from langchain.tools import Tool

def search_web(query):
    # كود البحث هنا
    return results

tool = Tool(
    name="web_search",
    func=search_web,
    description="يبحث على الإنترنت"
)`,
      task: "أنشئ أداة بسيطة تحسب عملية رياضية."
    },
    {
      id: "4",
      title: "التفكير المنطقي للآلة (Machine Reasoning)",
      content: `الوكلاء الأذكياء يستخدمون التفكير المنطقي لحل المشكلات.

**دورة التفكير (Reasoning Loop):**
1. مراقبة (Observation)
2. تفكير (Thought)
3. قرار (Decision)
4. تنفيذ (Action)
5. تكرار حتى الحل

**ReAct Pattern:**
نمط شائع يجمع بين التفكير والتنفيذ:
- Thought: ماذا أفكر؟
- Action: ماذا أفعل؟
- Observation: ماذا حدث؟`,
      example: `Question: كم عدد سكان الرياض؟
Thought: أحتاج البحث عن معلومات حديثة
Action: [web_search] "سكان الرياض 2024"
Observation: 7.6 مليون نسمة
Answer: عدد سكان الرياض 7.6 مليون نسمة`,
      task: "اكتب سيناريو Reasoning Loop لمشكلة من اختيارك."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// الدورة الثالثة: أساسيات تعلم الآلة
// ═══════════════════════════════════════════════════════════════════════════════
const MACHINE_LEARNING_COURSE: Course = {
  id: "machine_learning",
  name: "دورة تعليم أساسيات تعلم الآلة (Machine Learning)",
  formula: "صيغة التحليل التطبيقي (Applied Analysis)",
  status: "مجاني تماماً 🎁",
  duration: "15 ساعة",
  keywords: ['تعلم آلي', 'machine learning', 'machine', 'تعلم', 'ml', 'بيانات', 'تحليل'],
  lessons: [
    {
      id: "1",
      title: "كيف تتعلم الآلة؟ (How Machines Learn)",
      content: `تعلم الآلة هو قدرة الحاسوب على التعلم من البيانات دون برمجة صريحة.

**أنواع التعلم:**
1. **التعلم بالإشراف (Supervised):**
   - بيانات مع الإجابات الصحيحة
   - مثال: تصنيف الصور

2. **التعلم بدون إشراف (Unsupervised):**
   - بيانات بدون إجابات
   - مثال: تجميع العملاء

3. **التعلم بالتعزيز (Reinforcement):**
   - التعلم من التجربة والخطأ
   - مثال: الشطرنج`,
      example: `# تصنيف بسيط
from sklearn.tree import DecisionTreeClassifier

# بيانات التدريب
X = [[150, 50], [180, 80], [160, 60]]
y = ['أنثى', 'ذكر', 'أنثى']

# تدريب النموذج
model = DecisionTreeClassifier()
model.fit(X, y)

# تنبؤ
print(model.predict([[170, 70]]))  # ['ذكر']`,
      task: "جرب مثال التصنيف مع بيانات مختلفة."
    },
    {
      id: "2",
      title: "البيانات والتنظيف (Data & Cleaning)",
      content: `البيانات هي وقود الذكاء الاصطناعي. جودة البيانات = جودة النموذج.

**مشاكل البيانات الشائعة:**
- قيم مفقودة (Missing Values)
- قيم متطرفة (Outliers)
- بيانات مكررة
- تنسيقات مختلفة

**أدوات التنظيف:**
- pandas في Python
- OpenRefine
- Excel`,
      example: `import pandas as pd

# قراءة البيانات
df = pd.read_csv('data.csv')

# إزالة القيم المفقودة
df = df.dropna()

# إزالة المكررات
df = df.drop_duplicates()

# ملء القيم المفقودة
df['age'] = df['age'].fillna(df['age'].mean())`,
      task: "نظف مجموعة بيانات تحتوي على قيم مفقودة."
    },
    {
      id: "3",
      title: "تدريب النماذج (Model Training)",
      content: `تدريب النموذج يعني تعليمه من البيانات.

**خطوات التدريب:**
1. تحضير البيانات
2. تقسيم البيانات (Train/Test Split)
3. اختيار النموذج
4. التدريب (Fit)
5. التقييم (Evaluate)

**المفاهيم الأساسية:**
- **Features:** الخصائص المدخلة
- **Labels:** النتائج المتوقعة
- **Training Data:** بيانات التعلم
- **Test Data:** بيانات الاختبار`,
      example: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# تقسيم البيانات
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# تدريب النموذج
model = LogisticRegression()
model.fit(X_train, y_train)

# تقييم الدقة
accuracy = model.score(X_test, y_test)
print(f"الدقة: {accuracy * 100}%")`,
      task: "درّب نموذجاً على مجموعة بيانات وحسب دقته."
    },
    {
      id: "4",
      title: "أخلاقيات الذكاء الاصطناعي (AI Ethics)",
      content: `مع القوة تأتي المسؤولية. الذكاء الاصطناعي يحتاج أخلاقيات.

**التحديات الأخلاقية:**
1. **التحيز (Bias):**
   - النماذج قد تتعلم التحيز من البيانات
   - مثال: تمييز في التوظيف

2. **الخصوصية (Privacy):**
   - حماية بيانات المستخدمين
   - عدم جمع بيانات غير ضرورية

3. **الشفافية (Transparency):**
   - فهم كيفية اتخاذ القرار
   - تفسير النتائج

4. **التأثير على الوظائف:**
   - أتمتة المهام
   - خلق فرص جديدة`,
      example: `# التحقق من التحيز
def check_bias(predictions, sensitive_features):
    """يفحص وجود تحيز في التنبؤات"""
    for feature in sensitive_features:
        groups = predictions.groupby(feature)
        for name, group in groups:
            print(f"{feature}={name}: {group.mean()}")`,
      task: "اكتب قائمة بـ 5 مبادئ أخلاقية للذكاء الاصطناعي."
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// جميع الدورات
// ═══════════════════════════════════════════════════════════════════════════════
const COURSES: Course[] = [
  PROMPT_ENGINEERING_COURSE,
  AI_AGENTS_COURSE,
  MACHINE_LEARNING_COURSE
];

// ═══════════════════════════════════════════════════════════════════════════════
// API Handlers
// ═══════════════════════════════════════════════════════════════════════════════

// GET - الحصول على جميع الدورات
export async function GET() {
  return NextResponse.json({
    success: true,
    courses: COURSES.map(course => ({
      id: course.id,
      name: course.name,
      formula: course.formula,
      status: course.status,
      duration: course.duration,
      lessonsCount: course.lessons.length,
      keywords: course.keywords
    }))
  });
}

// POST - الحصول على دورة أو درس محدد
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, lessonId, message } = body;

    // إذا طُلب درس محدد
    if (courseId && lessonId) {
      const course = COURSES.find(c => c.id === courseId);
      if (!course) {
        return NextResponse.json({ 
          success: false, 
          error: 'الدورة غير موجودة' 
        });
      }

      const lesson = course.lessons.find(l => l.id === lessonId);
      if (!lesson) {
        return NextResponse.json({ 
          success: false, 
          error: 'الدرس غير موجود' 
        });
      }

      return NextResponse.json({
        success: true,
        course: {
          id: course.id,
          name: course.name,
          formula: course.formula,
          status: course.status
        },
        lesson: lesson
      });
    }

    // إذا طُلبت دورة محددة
    if (courseId) {
      const course = COURSES.find(c => c.id === courseId);
      if (!course) {
        return NextResponse.json({ 
          success: false, 
          error: 'الدورة غير موجودة' 
        });
      }

      return NextResponse.json({
        success: true,
        course: course
      });
    }

    // البحث عن دورات مناسبة
    if (message) {
      const lowerMessage = message.toLowerCase();
      
      const matchingCourses = COURSES.filter(course => 
        course.keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))
      );

      // كشف نية التعلم
      const learningKeywords = ['تعلم', 'دورة', 'كورس', 'أريد', 'كيف', 'أبدأ', 'درس'];
      const wantsToLearn = learningKeywords.some(kw => lowerMessage.includes(kw));

      const finalCourses = matchingCourses.length > 0 
        ? matchingCourses 
        : (wantsToLearn ? COURSES : []);

      return NextResponse.json({
        success: true,
        courses: finalCourses.map(course => ({
          id: course.id,
          name: course.name,
          formula: course.formula,
          status: course.status,
          duration: course.duration,
          lessonsCount: course.lessons.length
        })),
        detection: {
          wantsToLearn,
          topic: message.substring(0, 50)
        }
      });
    }

    return NextResponse.json({
      success: true,
      courses: COURSES.map(course => ({
        id: course.id,
        name: course.name,
        formula: course.formula,
        status: course.status,
        duration: course.duration,
        lessonsCount: course.lessons.length
      }))
    });

  } catch (error) {
    console.error('Courses API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في معالجة الطلب'
    });
  }
}

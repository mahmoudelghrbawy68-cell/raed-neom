// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - الهيكل المعماري للتعلم التفاعلي v3.0
// AcademyPro - Interactive Learning Architecture
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// أنواع البيانات (TypeScript Types)
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface Quiz {
  pass_score: number;
  questions: QuizQuestion[];
}

export interface LessonSections {
  introduction: string;
  core_concept: string;
  practical_example: string;
  common_mistake: string;
  summary: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  sections: LessonSections;
  quiz: Quiz;
  task?: string; // مهمة للمتعلم
}

export interface Course {
  id: string;
  title: string;
  category: string;
  formula: string; // صيغة التعليم
  description: string;
  totalDuration: string;
  status: string; // مجاني/مدفوع
  lessons: Lesson[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// الدورة 1: هندسة الأوامر الذكية (Smart Prompting)
// ═══════════════════════════════════════════════════════════════════════════════

const CourseOne: Course = {
  id: "C1",
  title: "هندسة الأوامر الذكية (Smart Prompting)",
  category: "الأساسيات",
  formula: "صيغة المحاكاة التفاعلية (Interactive Simulation)",
  description: "تعلم كيفية كتابة أوامر احترافية للذكاء الاصطناعي تحقق نتائج دقيقة ومبهرة. من الدردشة العادية إلى البرمجة اللغوية المتقدمة.",
  totalDuration: "12 ساعة",
  status: "مجاني تماماً 🎁",
  lessons: [
    {
      id: "L1",
      title: "تشريح الأمر الاحترافي (The Anatomy of a Pro Prompt)",
      duration: "45 دقيقة",
      sections: {
        introduction: "في هذا الدرس، ننتقل من مجرد 'الدردشة' إلى 'البرمجة اللغوية'. هل تساءلت يوماً لماذا تحصل على ردود عامة وغير دقيقة؟ السر يكمن في بنية الأمر نفسه.",
        core_concept: `الأمر الاحترافي يتكون من 4 أركان أساسية (Framework):

🎯 **1. الشخصية (Persona):**
حدد من هو الذكاء الاصطناعي في هذا السياق.
- مثال: "أنت خبير أمن سيبراني" أو "أنت طبيب أطفال"

📋 **2. السياق (Context):**
أعطه المعلومات الخلفية والبيانات التي يعمل عليها.
- مثال: "الشركة تعمل في مجال التجارة الإلكترونية وتستهدف الشباب"

⚡ **3. المهمة (Task):**
ماذا تريد منه بالضبط وبشكل محدد؟
- مثال: "اكتب 3 عناوين جذابة لإعلان على فيسبوك"

🚫 **4. القيود (Constraints):**
حدد له ما لا يجب فعله والحدود.
- مثال: "لا تزد عن 50 كلمة، استخدم اللغة العربية الفصحى فقط"`,
        practical_example: `مثال شامل ومُحسّن:

\`\`\`
أنت خبير تسويق رقمي متخصص في السوق السعودي (شخصية)

نحن شركة تطلق منتج قهوة عضوية جديدة في الرياض (سياق)

اكتب 3 عناوين جذابة لإعلان على إنستغرام (مهمة)

- اجعلها بالعربية الفصحى
- لا تزد عن 10 كلمات لكل عنوان
- ركز على الفوائد الصحية (قيود)
\`\`\`

💡 **لاحظ الفرق:** كل جزء يساهم في نتيجة دقيقة ومخصصة!`,
        common_mistake: `الخطأ الشائع هو إعطاء المهمة مباشرة دون تحديد شخصية أو سياق.

❌ **مثال خاطئ:**
"اكتب عناوين لإعلان قهوة"

❌ **النتيجة:** عناوين عامة وغير مخصصة، قد تكون بالإنجليزية، قد لا تناسب جمهورك.

✅ **المحل:** أضف الأركان الأربعة واحصل على نتائج مذهلة!`,
        summary: "تذكر دائماً: أعطِ الآلة دوراً (شخصية)، ومعلومات (سياق)، ومهمة واضحة، وحدوداً (قيود). هذه الأركان الأربعة هي مفتاح النجاح في التواصل مع الذكاء الاصطناعي."
      },
      task: "قم بكتابة أمر احترافي يحتوي على الأركان الأربعة لمهمة من اختيارك، ثم جربه في واجهة الذكاء الاصطناعي وشاهد الفرق!",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هو الركن الذي يحدد 'من هو' الذكاء الاصطناعي في الأمر؟",
            options: ["المهمة (Task)", "الشخصية (Persona)", "السياق (Context)", "القيود (Constraints)"],
            correct: 1,
            explanation: "الشخصية (Persona) تحدد الدور الذي سيتقمصه الذكاء الاصطناعي، مثل 'خبير تغذية' أو 'مدرس رياضيات'."
          },
          {
            q: "ما هو الخطأ الشائع في كتابة الأوامر؟",
            options: ["إعطاء أمثلة كثيرة", "إعطاء المهمة مباشرة بدون سياق أو شخصية", "استخدام اللغة العربية", "تحديد القيود بدقة"],
            correct: 1,
            explanation: "إعطاء المهمة مباشرة بدون الأركان الأخرى يؤدي لنتائج عامة وغير دقيقة."
          }
        ]
      }
    },
    {
      id: "L2",
      title: "سلاسل التفكير (Chain of Thought - CoT)",
      duration: "50 دقيقة",
      sections: {
        introduction: "أحدث تقنية لزيادة ذكاء الآلة هي إجبارها على التفكير بصوت عالٍ! اكتشف كيف تقلل الأخطاء بنسبة 80% في المهام المعقدة.",
        core_concept: `**Chain of Thought (CoT)** هي تقنية ثورية تجبر النموذج على عرض منطقه الداخلي.

🧠 **كيف تعمل؟**
بدلاً من طلب النتيجة مباشرة، نطلب من الآلة: "فكر خطوة بخطوة" (Let's think step by step).

📊 **النتائج:**
- تقليل الأخطاء المنطقية بنسبة تصل إلى **80%**
- زيادة الدقة في المهام الحسابية
- تحسين جودة الكود البرمجي

🎯 **متى تستخدمها؟**
- المسائل الرياضية والمنطقية
- تحليل البيانات المعقدة
- كتابة الأكواد البرمجية
- اتخاذ القرارات المتعددة الخطوات`,
        practical_example: `قبل (بدون Chain of Thought):
\`\`\`
❌ احسب: 23 × 47 = ؟
→ قد تكون النتيجة خاطئة!
\`\`\`

بعد (مع Chain of Thought):
\`\`\`
✅ احسب 23 × 47، وفكر في كل خطوة:

1. لنستخدم الضرب الطويل
2. 23 × 7 = 161 (الصف الأول)
3. 23 × 40 = 920 (الصف الثاني)
4. 161 + 920 = 1081

الناتج: 1081 ✓
\`\`\`

💡 **لاحظ:** كل خطوة منطقية ومتتابعة!`,
        common_mistake: `طلب النتيجة النهائية مباشرة في المسائل المعقدة.

❌ **خطأ:** "كم عدد الكلمات في هذا النص؟"
→ قد يعطي تقديراً خاطئاً

✅ **صح:** "عد الكلمات في هذا النص خطوة بخطوة: أولاً قسمه لجمل، ثم عد كل جملة..."
→ نتيجة دقيقة 100%`,
        summary: "شجع الآلة على التفكير المنطقي المتسلسل. عبارات مثل 'فكر بصوت عالٍ' و 'حلل خطوة بخطوة' تحول النتائج بشكل دراماتيكي."
      },
      task: "جرب حل مسألة رياضية معقدة باستخدام تقنية Chain of Thought وقارن النتيجة بالطريقة المباشرة.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هي العبارة السحرية التي تفعّل Chain of Thought؟",
            options: ["أجب بسرعة", "فكر خطوة بخطوة", "اختصار الرد", "باللغة العربية"],
            correct: 1,
            explanation: "عبارة 'فكر خطوة بخطوة' أو 'Let's think step by step' تفعّل تقنية Chain of Thought."
          },
          {
            q: "بنسبة كم تقل الأخطاء المنطقية عند استخدام CoT؟",
            options: ["20%", "40%", "80%", "100%"],
            correct: 2,
            explanation: "الأبحاث تُظهر أن Chain of Thought يقلل الأخطاء المنطقية بنسبة تصل إلى 80% في المهام المعقدة."
          }
        ]
      }
    },
    {
      id: "L3",
      title: "هندسة الأوامر قليلة المحاولات (Few-Shot Prompting)",
      duration: "55 دقيقة",
      sections: {
        introduction: "الذكاء الاصطناعي يتعلم بالنماذج! في هذا الدرس نتعلم كيف نعطي الآلة أمثلة قبل طلب المهمة، للحصول على نتائج دقيقة جداً ومطابقة لأسلوبك الشخصي.",
        core_concept: `**Few-Shot Prompting** = تعليم بالأمثلة

🎯 **المبدأ:**
أعطِ النموذج 2-5 أمثلة (Input → Output) قبل طلب المهمة.

📊 **أنواع التعلم:**
- **Zero-Shot:** بدون أمثلة (للمهام البسيطة)
- **One-Shot:** مثال واحد (للمهام المتوسطة)
- **Few-Shot:** 2-5 أمثلة (للمهام المعقدة أو الأسلوب المحدد)

💡 **لماذا يعمل؟**
النموذج يرى النمط ويتعلمه من الأمثلة، ثم يطبقه على المدخل الجديد.`,
        practical_example: `مثال على Few-Shot للتصنيف:

\`\`\`
صنف المشاعر في الجمل التالية:

المدخل: "الفيلم رائع وممتع!"
المخرج: إيجابي

المدخل: "الخدمة سيئة جداً"
المخرج: سلبي

المدخل: "الطعام مقبول"
المخرج: محايد

المدخل: "تجربتي في المطعم كانت ممتازة"
المخرج: [؟]
\`\`\`

🎯 **النتيجة:** النموذج سيتعلم النمط ويجيب: "إيجابي" ✓`,
        common_mistake: `إعطاء أمثلة غير متسقة أو متناقضة.

❌ **خطأ:**
\`\`\`
المثال الأول: رد رسمي
المثال الثاني: رد عامي
→ النموذج سيحتار!
\`\`\`

✅ **صح:** جميع الأمثلة بنفس الأسلوب والتنسيق`,
        summary: "الأمثلة تعلم النموذج 'الشكل المطلوب'. كلما كانت أمثلتك واضحة ومتسقة، كانت نتائجك أفضل. استخدم 2-5 أمثلة للمهام المعقدة."
      },
      task: "أنشئ مثال Few-Shot لتعليم الذكاء الاصطناعي كتابة عناوين إعلانية بأسلوبك المفضل.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هو Few-Shot Prompting؟",
            options: ["التعلم بدون أمثلة", "إعطاء النموذج أمثلة قبل المهمة", "تقليل حجم الرد", "استخدام نموذج أصغر"],
            correct: 1,
            explanation: "Few-Shot Prompting يعني إعطاء النموذج 2-5 أمثلة قبل المهمة لتعليمه النمط المطلوب."
          },
          {
            q: "كم عدد الأمثلة المثالي في Few-Shot؟",
            options: ["0 أمثلة", "1 مثال فقط", "2-5 أمثلة", "أكثر من 20 مثال"],
            correct: 2,
            explanation: "2-5 أمثلة هي العدد المثالي - كافية لتعليم النمط بدون إطالة مفرطة."
          }
        ]
      }
    },
    {
      id: "L4",
      title: "التحكم المطلق ومنع الهلوسة (Anti-Hallucination)",
      duration: "45 دقيقة",
      sections: {
        introduction: "أكبر مشكلة في الذكاء الاصطناعي هي 'الهلوسة' - تأليف معلومات غير صحيحة! تعلم كيف تمنع ذلك وتتحكم في المخرجات تماماً.",
        core_concept: `**الهلوسة (Hallucination)** = معلومات مُخترعة يقدمها النموذج بثقة!

🚨 **أنواع الهلوسة:**
1. **تأليف حقائق** (تواريخ خاطئة، إحصائيات غير موجودة)
2. **اقتباسات وهمية** (كتب لم تُكتب، دراسات غير موجودة)
3. **استنتاجات خاطئة** (ربط غير صحيح بين المعلومات)

🛡️ **تقنيات المنع:**

1. **المطالبة بالصدق:**
"إذا لم تكن متأكداً، قل لا أعرف"

2. **تحديد المصادر:**
"اعتمد فقط على المعلومات التالية: [النص]"

3. **التقييم الذاتي:**
"قبل الرد، تأكد من صحة كل معلومة"`,
        practical_example: `قبل (معرض للهلوسة):
\`\`\`
❌ "لخص لي تاريخ المملكة العربية السعودية"
→ قد يعطي تواريخ خاطئة!
\`\`\`

بعد (محمي من الهلوسة):
\`\`\`
✅ لخص لي تاريخ المملكة العربية السعودية بناءً على النص التالي فقط:
[النص المصدر]

إذا كانت معلومة غير موجودة في النص، قل: [غير متوفر في المصدر]
لا تستنتج ولا تضف معلومات خارجية.
\`\`\``,
        common_mistake: `الثقة العمياء في كل ما يقوله الذكاء الاصطناعي!

⚠️ **خطر:** استخدام المعلومات في قرارات مهمة دون تحقق

✅ **حل:** 
- اطلب المصادر
- تحقق من المعلومات الحساسة
- استخدم تقنيات منع الهلوسة`,
        summary: "الذكاء الاصطناعي قد 'يهلوس' ويؤلف معلومات. اطلب منه الاعتراف بعدم المعرفة، وحدد مصادره بدقة، ولا تثق عمياءً في كل رد."
      },
      task: "جرب سؤال الذكاء الاصطناعي عن موضوع لا تعرفه، ثم طبق تقنية Anti-Hallucination وقارن النتائج.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هي 'الهلوسة' في الذكاء الاصطناعي؟",
            options: ["رؤية صور غير موجودة", "تأليف معلومات غير صحيحة بثقة", "رفض الإجابة", "بطء الاستجابة"],
            correct: 1,
            explanation: "الهلوسة هي عندما يخترع الذكاء الاصطناعي معلومات غير صحيحة ويقدمها بثقة كأنها حقيقية."
          },
          {
            q: "ما أفضل طريقة لمنع الهلوسة؟",
            options: ["الثقة العمياء", "طلب المصادر والتحقق", "عدم السؤال", "استخدام نموذج أرخص"],
            correct: 1,
            explanation: "طلب المصادر والتحقق من المعلومات الحساسة هي أفضل طريقة لمنع الهلوسة."
          }
        ]
      }
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// الدورة 2: بناء وكلاء الذكاء الاصطناعي (AI Agents)
// ═══════════════════════════════════════════════════════════════════════════════

const CourseTwo: Course = {
  id: "C2",
  title: "بناء وكلاء الذكاء الاصطناعي (AI Agents)",
  category: "المتوسط",
  formula: "التعلم القائم على المشاريع (Project-Based Learning)",
  description: "تعلم بناء وكلاء أذكياء قادرين على التفكير والتنفيذ باستخدام LangChain والأدوات المتقدمة",
  totalDuration: "18 ساعة",
  status: "مجاني تماماً 🎁",
  lessons: [
    {
      id: "L1",
      title: "مقدمة إلى AI Agents - ما الفرق عن Chatbot؟",
      duration: "60 دقيقة",
      sections: {
        introduction: "ما الفرق بين chatbot عادي و AI Agent ذكي؟ الـ Agent يمكنه 'التصرف' و'استخدام أدوات' لتحقيق أهدافك!",
        core_concept: `**AI Agent = عقل + أداة + ذاكرة + تخطيط**

🧠 **1. LLM (العقل):**
يفكر ويقرر أي أداة تستخدم ومتى

🔧 **2. Tools (الأدوات):**
ينفذ المهام - بحث، حساب، API، قاعدة بيانات

💾 **3. Memory (الذاكرة):**
يتذكر السياق والمحادثات السابقة

📋 **4. Planning (التخطيط):**
يخطط خطوات للوصول للهدف

**الفرق الجوهري:**
- Chatbot: يتحدث فقط
- Agent: يتحدث + ينفذ + يتذكر + يخطط`,
        practical_example: `بناء Agent بسيط في Python:

\`\`\`python
from langchain.agents import initialize_agent
from langchain.tools import Tool

# تعريف أداة الحاسبة
def calculator(expression):
    return eval(expression)

calculator_tool = Tool(
    name='calculator',
    func=calculator,
    description='للحسابات الرياضية. المدخل: معادلة رياضية'
)

# إنشاء الوكيل
agent = initialize_agent(
    tools=[calculator_tool],
    llm=llm,
    agent='zero-shot-react-description'
)

# استخدام الوكيل
result = agent.run("كم يساوي 15 × 23 + 100؟")
# Agent سيقرر استخدام الأداة تلقائياً!
\`\`\``,
        common_mistake: "التفكير أن Agent هو مجرد chatbot متقدم. الـ Agent لديه القدرة على التنفيذ الفعلي، وليس فقط المحادثة.",
        summary: "الـ Agent = عقل (LLM) + أدوات + ذاكرة + تخطيط. هذا المزيج يخلق نظاماً قادراً على العمل المستقل والتنفيذ الحقيقي."
      },
      task: "فكر في 3 أدوات يمكن إضافتها لوكيل ذكي يساعدك في حياتك اليومية.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هو المكون المسؤول عن 'التفكير والقرار' في AI Agent؟",
            options: ["الأدوات (Tools)", "الذاكرة (Memory)", "LLM", "التخطيط"],
            correct: 2,
            explanation: "الـ LLM هو العقل الذي يفكر ويقرر أي أداة تستخدم ومتى."
          }
        ]
      }
    },
    {
      id: "L2",
      title: "إطار ReAct - التفكير والتنفيذ",
      duration: "55 دقيقة",
      sections: {
        introduction: "ReAct = Reasoning + Acting. هذا الإطار الثوري يجعل الـ Agent يفكر بصوت عالٍ قبل كل خطوة!",
        core_concept: `**دورة ReAct:**

💭 **Thought:** Agent يفكر ماذا يفعل
⚡ **Action:** يختار أداة وينفذ
👁️ **Observation:** يرى النتيجة
🔄 **Repeat:** يكرر حتى يصل للهدف

**مثال عملي:**
\`\`\`
Thought: المستخدم يريد معرفة طقس الرياض
Action: search_weather('الرياض')
Observation: 35 درجة، مشمس
Thought: الآن لدي المعلومة
Answer: الطقس في الرياض 35 درجة ومشمس ☀️
\`\`\``,
        practical_example: `تنفيذ ReAct في LangChain:

\`\`\`python
from langchain.agents import create_react_agent

prompt = '''
أنت مساعد ذكي. استخدم الأدوات المتاحة.

Thought: فكر في الخطوة التالية
Action: اسم_الأداة[المعامل]
Observation: ستظهر النتيجة هنا
... كرر حتى الوصول للإجابة ...
Answer: الإجابة النهائية
'''

agent = create_react_agent(llm, tools, prompt)
\`\`\``,
        common_mistake: "عدم إعطاء Agent أدوات كافية للمهمة. إذا طلبت منه البحث ولم تعطه أداة بحث، سيفشل.",
        summary: "ReAct يجعل الـ Agent شفافاً - يمكنك رؤية تفكيره! هذا يساعد في التصحيح والتحسين والتعلّم."
      },
      task: "اكتب سيناريو ReAct لوكيل يحجز طعام من مطعم.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ماذا يعني ReAct؟",
            options: ["React JavaScript Library", "Reasoning + Acting", "Real-time Action", "Recursive Algorithm"],
            correct: 1,
            explanation: "ReAct = Reasoning (التفكير) + Acting (التنفيذ). يجمع بين التفكير المنطقي والتنفيذ الفعلي."
          }
        ]
      }
    },
    {
      id: "L3",
      title: "Function Calling - استدعاء الدوال تلقائياً",
      duration: "65 دقيقة",
      sections: {
        introduction: "كيف تجعل الذكاء الاصطناعي يستدعي دوالك البرمجية تلقائياً؟ Function Calling هو الجواب السحري!",
        core_concept: `**Function Calling** يسمح للـ LLM بـ:

1. فهم المتطلبات من النص
2. استدعاء الدالة الصحيحة
3. تمرير المعاملات بشكل صحيح
4. إرجاع النتيجة للمستخدم

**متى تستخدمه؟**
- جلب بيانات من API
- تنفيذ عمليات قاعدة بيانات
- حسابات معقدة
- التكامل مع أنظمة خارجية`,
        practical_example: `تعريف دالة للـ OpenAI:

\`\`\`python
functions = [{
    'name': 'get_weather',
    'description': 'الحصول على الطقس لمدينة معينة',
    'parameters': {
        'type': 'object',
        'properties': {
            'city': {
                'type': 'string',
                'description': 'اسم المدينة بالعربية'
            }
        },
        'required': ['city']
    }
}]

# الـ LLM سيفهم تلقائياً!
response = client.chat.completions.create(
    model='gpt-4o',
    messages=[{'role': 'user', 'content': 'ما طقس الرياض؟'}],
    functions=functions
)
# سيقرر استدعاء get_weather(city='الرياض')
\`\`\``,
        common_mistake: "عدم وصف الدالة والمعاملات بوضوح. الوصف الجيد ضروري ليفهم الـ LLM متى وكيف يستخدم الدالة.",
        summary: "Function Calling = دع الـ LLM يتواصل مع الكود الخاصتك. يفتح آفاقاً لا نهائية للتطبيقات الذكية."
      },
      task: "صمّم دالة يمكن للذكاء الاصطناعي استدعاؤها (مثل: حجز موعد، إرسال إيميل، البحث).",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هو الشرط الأساسي لنجاح Function Calling؟",
            options: ["استخدام GPT-4 فقط", "وصف الدالة والمعاملات بوضوح", "كتابة الدالة بـ JavaScript", "اتصال بالإنترنت"],
            correct: 1,
            explanation: "الوصف الجيد للدالة ومعاملاتها هو المفتاح ليفهم الـ LLM متى وكيف يستخدمها."
          }
        ]
      }
    },
    {
      id: "L4",
      title: "بناء ذاكرة للوكيل",
      duration: "50 دقيقة",
      sections: {
        introduction: "ما الفرق بين محادثة عابرة وعلاقة طويلة الأمد؟ الذاكرة! تعلم كيف تبني ذاكرة ذكية لوكيلك.",
        core_concept: `**أنواع الذاكرة في LangChain:**

1. **ConversationBufferMemory**
   - يحفظ كل شيء
   - مناسب: محادثات قصيرة

2. **ConversationSummaryMemory**
   - يلخص المحادثة
   - مناسب: محادثات طويلة

3. **ConversationBufferWindowMemory**
   - يحفظ آخر N رسالة
   - مناسب: التركيز على السياق القريب

4. **VectorStoreMemory**
   - ذاكرة دلالية (semantic)
   - مناسب: البحث في المحادثات السابقة`,
        practical_example: `إضافة ذاكرة للـ Agent:

\`\`\`python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key='chat_history',
    return_messages=True
)

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent='conversational-react-description',
    memory=memory
)

# الآن الوكيل يتذكر!
agent.run("اسمي أحمد")
agent.run("ما اسمي؟")  # سيرد: أحمد!
\`\`\``,
        common_mistake: "استخدام نوع ذاكرة غير مناسب. إذا كانت المحادثة طويلة، الـ Buffer سيستهلك الكثير من tokens.",
        summary: "الذاكرة تحول المحادثة من 'لقاء عابر' إلى 'علاقة مستمرة'. اختر النوع المناسب لاحتياجك."
      },
      task: "صمّم نظام ذاكرة لوكلاء خدمة العملاء.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "أي نوع ذاكرة أنسب للمحادثات الطويلة جداً؟",
            options: ["Buffer Memory", "Summary Memory", "لا تحتاج ذاكرة", "File Storage"],
            correct: 1,
            explanation: "Summary Memory يلخص المحادثة الطويلة، مما يوفر tokens ويحتفظ بالمعلومات المهمة."
          }
        ]
      }
    },
    {
      id: "L5",
      title: "Multi-Agent Systems - فريق العمل الرقمي",
      duration: "70 دقيقة",
      sections: {
        introduction: "لماذا تعمل وحدك بينما يمكنك بناء فريق من الوكلاء الأذكياء؟ Multi-Agent هو مستقبل الأتمتة!",
        core_concept: `**نظام Multi-Agent:**

🔍 **Researcher Agent:** يبحث ويجمع المعلومات
✍️ **Writer Agent:** يكتب المحتوى
✅ **Reviewer Agent:** يراجع ويصحح
🎭 **Coordinator:** ينسق العمل بينهم

**المبدأ:**
كل Agent متخصص في مهمة واحدة، ويعملون معاً كفريق متكامل.

**أمثلة عملية:**
- فريق كتابة التقارير
- فريق خدمة العملاء
- فريق تحليل البيانات
- فريق تطوير البرمجيات`,
        practical_example: `بناء فريق وكلاء:

\`\`\`python
from langchain.experimental import PlanAndExecute

# وكيل التخطيط
planner = ChatOpenAI(model='gpt-4o')

# وكيل التنفيذ
executor = ChatOpenAI(model='gpt-4o')

# نظام متكامل
agent = PlanAndExecute(
    planner=planner,
    executor=executor,
    tools=[search_tool, calculator_tool, writing_tool]
)

# سيقسم المهمة ويوزعها!
agent.run('اكتب تقريراً عن الطاقة المتجددة في السعودية')
\`\`\``,
        common_mistake: "جعل وكلاء كثيرين بدون تنسيق جيد. أكثر من 5 وكلاء بدون coordinator واضح يسبب فوضى.",
        summary: "Multi-Agent = فريق عمل رقمي. كل عضو متخصص، والنتيجة تفوق ما يمكن لوكيل واحد تحقيقه."
      },
      task: "صمّم فريق Multi-Agent لمشروع من اختيارك.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هو دور الـ Coordinator في نظام Multi-Agent؟",
            options: ["كتابة المحتوى", "البحث عن المعلومات", "تنسيق العمل بين الوكلاء", "حذف الملفات"],
            correct: 2,
            explanation: "الـ Coordinator ينسق العمل بين الوكلاء المختلفين ويضمن تدفق العمل بسلاسة."
          }
        ]
      }
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// الدورة 3: أساسيات تعلم الآلة (Machine Learning)
// ═══════════════════════════════════════════════════════════════════════════════

const CourseThree: Course = {
  id: "C3",
  title: "أساسيات تعلم الآلة (Machine Learning)",
  category: "المتقدم",
  formula: "التحليل التطبيقي (Applied Analysis)",
  description: "فهم أساسيات Machine Learning وتطبيقاتها العملية مع مشاريع حقيقية",
  totalDuration: "15 ساعة",
  status: "مجاني تماماً 🎁",
  lessons: [
    {
      id: "L1",
      title: "ما هو تعلم الآلة؟",
      duration: "45 دقيقة",
      sections: {
        introduction: "هل تساءلت يوماً كيف يتعرف Netflix على أفلامك المفضلة؟ أو كيف يتنبأ الطقس؟ هذا هو تعلم الآلة!",
        core_concept: `**تعلم الآلة (Machine Learning)** = تعليم الكمبيوتر التعلم من البيانات بدلاً من برمجته صراحة.

🎯 **أنواع التعلم:**

1. **Supervised Learning (التعلم المُوجّه)**
   - بيانات مصنفة بعلامات
   - مثال: تصنيف البريد (spam/ham)
   - استخدام: التصنيف، التنبؤ

2. **Unsupervised Learning (التعلم غير المُوجّه)**
   - بيانات بدون علامات
   - مثال: تجميع العملاء
   - استخدام: Clustering، التقليل

3. **Reinforcement Learning (التعلم بالتعزيز)**
   - تعلم بالمكافأة والعقاب
   - مثال: ألعاب، روبوتات
   - استخدام: الأتمتة، الألعاب`,
        practical_example: `مثال بسيط - تصنيف البريد:

\`\`\`python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# بيانات التدريب
emails = ['اشترِ الآن!', 'اجتماع غداً', 'عرض خاص!', 'تقرير العمل']
labels = ['spam', 'normal', 'spam', 'normal']

# تحويل النص لأرقام
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(emails)

# تدريب النموذج
model = MultinomialNB()
model.fit(X, labels)

# تنبؤ
new_email = vectorizer.transform(['عرض حصري لك!'])
print(model.predict(new_email))  # ['spam'] ✓
\`\`\``,
        common_mistake: "الخلط بين AI و ML و DL:\n- AI: الذكاء الاصطناعي (المظلة العامة)\n- ML: تعلم الآلة (جزء من AI)\n- DL: التعلم العميق (جزء من ML)",
        summary: "تعلم الآلة = البيانات + الخوارزمية = نموذج ذكي. كلما كانت بياناتك أفضل، كان نموذجك أقوى."
      },
      task: "فكر في 3 تطبيقات تعلم الآلة التي تستخدمها يومياً.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما نوع التعلم المستخدم في تصنيف البريد إلى spam و normal؟",
            options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Transfer Learning"],
            correct: 1,
            explanation: "تصنيف البريد يستخدم Supervised Learning لأننا ندرب النموذج على بيانات مصنفة مسبقاً."
          }
        ]
      }
    },
    {
      id: "L2",
      title: "دورة حياة مشروع ML",
      duration: "55 دقيقة",
      sections: {
        introduction: "مشروع تعلم الآلة الناجح يمر بمراحل محددة. تعرف على هذه المراحل لضمان نجاح مشروعك!",
        core_concept: `**دورة حياة مشروع ML:**

1️⃣ **فهم المشكلة** - ما الذي نحل؟
2️⃣ **جمع البيانات** - من أين نحصل عليها؟
3️⃣ **تحضير البيانات** - تنظيف وتحويل (80% من الوقت!)
4️⃣ **اختيار النموذج** - أي خوارزمية؟
5️⃣ **التدريب** - تعليم النموذج
6️⃣ **التقييم** - هل يعمل جيداً؟
7️⃣ **النشر** - وضعه في الإنتاج
8️⃣ **المراقبة** - متابعة الأداء`,
        practical_example: `مثال: توقع أسعار المنازل

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# 1. جمع البيانات
data = pd.read_csv('houses.csv')

# 2. تحضير البيانات
X = data[['area', 'rooms', 'age']]
y = data['price']
X_train, X_test, y_train, y_test = train_test_split(X, y)

# 3. تدريب النموذج
model = LinearRegression()
model.fit(X_train, y_train)

# 4. التنبؤ
new_house = [[200, 4, 5]]  # 200m², 4 غرف, 5 سنوات
print(f'السعر المتوقع: {model.predict(new_house)[0]:,.0f} ريال')
\`\`\``,
        common_mistake: "تخطي مرحلة تحضير البيانات. 80% من وقت مشروع ML يُقضى في تحضير البيانات، وهي المرحلة الأهم!",
        summary: "دورة حياة ML واضحة: بيانات نظيفة → نموذج مدرب → تقييم دقيق → نشر ناجح."
      },
      task: "حدد مشكلة يمكن حلها بـ ML واكتب خطوات حلها.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "ما هي المرحلة التي تستهلك معظم وقت مشروع ML؟",
            options: ["تدريب النموذج", "تحضير البيانات", "النشر", "التقييم"],
            correct: 1,
            explanation: "تحضير البيانات يستحوذ على 80% من وقت المشروع تقريباً، وهو العامل الأهم في نجاحه."
          }
        ]
      }
    },
    {
      id: "L3",
      title: "التصنيف والتوقع",
      duration: "60 دقيقة",
      sections: {
        introduction: "التصنيف أم التوقع؟ كلاهما من أهم تطبيقات ML، لكن لكل منهما استخدامه الخاص.",
        core_concept: `**التصنيف (Classification):**
- التنبؤ بفئة (spam/ham، مرض/صحة)
- مخرجات: فئات محددة
- خوارزميات: Decision Trees, SVM, Neural Networks

**التوقع (Regression):**
- التنبؤ بقيمة مستمرة (السعر، الحرارة)
- مخرجات: أرقام متصلة
- خوارزميات: Linear Regression, Random Forest

**كيف تختار؟**
- المخرجات فئات → التصنيف
- المخرجات أرقام → التوقع`,
        practical_example: `مقارنة عملية:

\`\`\`python
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LinearRegression

# تصنيف: مرض السكري (نعم/لا)
X_class = [[45, 120, 85], [30, 90, 70], [55, 150, 100]]
y_class = [1, 0, 1]  # 1=سكري, 0=سليم
clf = DecisionTreeClassifier()
clf.fit(X_class, y_class)
print(clf.predict([[40, 110, 80]]))  # [0] سليم

# توقع: سعر المنزل
X_reg = [[200, 4], [150, 3], [300, 5]]
y_reg = [500000, 350000, 800000]
reg = LinearRegression()
reg.fit(X_reg, y_reg)
print(f'{reg.predict([[180, 3]])[0]:,.0f} ريال')
\`\`\``,
        common_mistake: "استخدام التصنيف لمشكلة توقع أو العكس. راجع نوع المخرجات أولاً!",
        summary: "التصنيف للفئات، التوقع للأرقام. فهم الفرق هو الخطوة الأولى لاختيار الخوارزمية الصحيحة."
      },
      task: "حدد 3 مشاكل تصنيف و 3 مشاكل توقع من حياتك اليومية.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "إذا كنت تريد التنبؤ بدرجة حرارة الغد، أي نوع تستخدم؟",
            options: ["Classification", "Regression", "Clustering", "Reinforcement"],
            correct: 1,
            explanation: "درجة الحرارة قيمة مستمرة (رقم)، لذلك نستخدم Regression (التوقع)."
          }
        ]
      }
    },
    {
      id: "L4",
      title: "تقييم النماذج",
      duration: "50 دقيقة",
      sections: {
        introduction: "نموذجك يعمل، لكن هل يعمل جيداً؟ تعلم كيف تقيس أداء نموذجك بمقاييس علمية دقيقة.",
        core_concept: `**مقاييس التصنيف:**

📊 **Accuracy:** نسبة الصحيح من الكلي
🎯 **Precision:** كم من الإيجابيات صحيح؟
🔍 **Recall:** كم من الإيجابيات الحقيقية اكتشفت؟
⚖️ **F1-Score:** توازن بين Precision و Recall

**مقاييس التوقع:**
📏 **MAE:** متوسط الخطأ المطلق
📐 **MSE:** متوسط مربع الخطأ
📈 **R²:** نسبة التفسير

**⚠️ مهم:** Accuracy ليست كافية دائماً!`,
        practical_example: `حساب المقاييس:

\`\`\`python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

y_true = [1, 0, 1, 1, 0, 1, 0, 0]
y_pred = [1, 0, 1, 0, 0, 1, 0, 1]

print(f'Accuracy: {accuracy_score(y_true, y_pred):.2f}')
print(f'Precision: {precision_score(y_true, y_pred):.2f}')
print(f'Recall: {recall_score(y_true, y_pred):.2f}')
print(f'F1-Score: {f1_score(y_true, y_pred):.2f}')

# Output:
# Accuracy: 0.75
# Precision: 0.80
# Recall: 0.75
# F1-Score: 0.77
\`\`\``,
        common_mistake: "الاعتماد على Accuracy فقط. في البيانات غير المتوازنة، قد يكون Accuracy مضللاً!",
        summary: "Accuracy ليست كافية. استخدم Precision و Recall و F1 لتقييم شامل لنموذجك."
      },
      task: "احسب مقاييس تقييم لنموذج خيالي.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "أي مقياس أنسب لتقييم نموذج يكتشف مرض نادر (بيانات غير متوازنة)؟",
            options: ["Accuracy", "Precision", "Recall", "F1-Score"],
            correct: 3,
            explanation: "F1-Score هو الأفضل للبيانات غير المتوازنة لأنه يوازن بين Precision و Recall."
          }
        ]
      }
    },
    {
      id: "L5",
      title: "مشاريع عملية - من الصفر للإنتاج",
      duration: "90 دقيقة",
      sections: {
        introduction: "حان وقت التطبيق! سنقوم ببناء مشروع ML كامل من الصفر حتى النشر.",
        core_concept: `**مشروعنا: تصنيف مراجعات المنتجات**

🎯 **الهدف:** تحديد ما إذا كانت المراجعة إيجابية أم سلبية

📋 **الخطوات:**
1. جمع البيانات من مصدر موثوق
2. تنظيف وتحضير النصوص
3. تحويل النص لأرقام (TF-IDF)
4. تدريب عدة نماذج
5. اختيار الأفضل
6. حفظ النموذج للإنتاج`,
        practical_example: `الكود الكامل:

\`\`\`python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import joblib

# 1. تحميل البيانات
df = pd.read_csv('reviews.csv')

# 2. تحضير البيانات
df['text'] = df['text'].str.lower().str.replace('[^a-z ]', '')

# 3. تحويل النص لأرقام
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['text'])
y = df['sentiment']

# 4. تقسيم البيانات
X_train, X_test, y_train, y_test = train_test_split(X, y)

# 5. تدريب النموذج
model = SVC(kernel='linear')
model.fit(X_train, y_train)

# 6. التقييم
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# 7. حفظ للإنتاج
joblib.dump(model, 'sentiment_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')
\`\`\``,
        common_mistake: "نسيان حفظ الـ vectorizer مع النموذج! لا يمكنك استخدام النموذج بدون نفس الـ vectorizer.",
        summary: "مشروع كامل = بيانات + تحضير + تدريب + تقييم + حفظ. الآن لديك نموذج جاهز للإنتاج!"
      },
      task: "نفّذ المشروع بالكامل على بيانات حقيقية.",
      quiz: {
        pass_score: 1,
        questions: [
          {
            q: "لماذا نستخدم TF-IDF بدلاً من Count Vectorizer؟",
            options: ["أسرع", "يعطي وزناً أعلى للكلمات المهمة والنادرة", "أسهل في الكتابة", "يدعم العربية فقط"],
            correct: 1,
            explanation: "TF-IDF يعطي وزناً أعلى للكلمات النادرة والمهمة، ويقلل وزن الكلمات الشائعة."
          }
        ]
      }
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// تصدير الدورات
// ═══════════════════════════════════════════════════════════════════════════════

export const learningArchitecture: Course[] = [CourseOne, CourseTwo, CourseThree];

// Alias للتوافق
export const courses = learningArchitecture;

// ═══════════════════════════════════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════════════════════════════════

export function getCourse(courseId: string): Course | undefined {
  return learningArchitecture.find(course => course.id === courseId);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  return course.lessons.find(lesson => lesson.id === lessonId);
}

export function getLessonIndex(courseId: string, lessonId: string): number {
  const course = getCourse(courseId);
  if (!course) return -1;
  return course.lessons.findIndex(lesson => lesson.id === lessonId);
}

export function getAllCourses(): Course[] {
  return learningArchitecture;
}

export function getCourseSummary(courseId: string) {
  const course = getCourse(courseId);
  if (!course) return null;
  
  return {
    id: course.id,
    title: course.title,
    category: course.category,
    formula: course.formula,
    description: course.description,
    totalDuration: course.totalDuration,
    status: course.status,
    lessonsCount: course.lessons.length,
    lessons: course.lessons.map(l => ({
      id: l.id,
      title: l.title,
      duration: l.duration
    }))
  };
}

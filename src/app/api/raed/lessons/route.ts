// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API الدروس التعليمية
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

// بيانات الدورات
const coursesData: Record<number, {
  title: string;
  formula: string;
  price: string;
  lessons: Record<string, {
    title: string;
    content: string;
    example: string;
  }>;
}> = {
  1: {
    title: "دورة تعليم هندسة الأوامر الذكية (Smart Prompting)",
    formula: "صيغة المحاكاة التفاعلية (Interactive Simulation)",
    price: "مجاني تماماً 🎁",
    lessons: {
      "1": {
        title: "تشريح الأمر الاحترافي (The Anatomy of a Pro Prompt)",
        content: `في هذا الدرس، ننتقل من مجرد 'الدردشة' إلى 'البرمجة اللغوية'. 

**الأمر الاحترافي يتكون من 4 أركان أساسية (Framework):**

1. **الشخصية (Persona):** حدد من هو الذكاء الاصطناعي
   - مثال: "أنت خبير أمن سيبراني"
   
2. **السياق (Context):** أعطه المعلومات الخلفية
   - مثال: "نحن نعمل على تطبيق بنكي"
   
3. **المهمة (Task):** ماذا تريد منه بالضبط؟
   - مثال: "حلل هذا الكود وابحث عن الثغرات"
   
4. **القيود (Constraints):** حدد ما لا يجب فعله
   - مثال: "لا تزد عن 50 كلمة"

📝 **مهمة لك:** قم بتطبيق هذا الإطار في محادثتك القادمة مع AI!`,
        example: `**مثال تطبيبي شامل:**

"أنت خبير تسويق (شخصية). نريد إطلاق منتج قهوة جديد في السوق السعودي (سياق). اكتب 3 عناوين إعلانية جذابة (مهمة). اجعلها باللغة العربية الفصحى ولا تزد عن 20 كلمة لكل عنوان (قيود)."`
      },
      "2": {
        title: "سلاسل التفكير (Chain of Thought - CoT)",
        content: `أحدث تقنية لزيادة ذكاء الآلة هي إجبارها على التفكير بصوت عالٍ.

**الطريقة:**
بدلاً من طلب النتيجة مباشرة، نطلب من الآلة: "فكر خطوة بخطوة"

**لماذا تعمل؟**
- تجبر النموذج على شرح منطقه
- تقلل الأخطاء المنطقية بنسبة 80%
- مثالية للمهام المعقدة والبرمجة

**متى تستخدمها؟**
- المسائل الرياضية
- تحليل البيانات
- البرمجة المعقدة
- اتخاذ القرارات

📝 **مهمة لك:** جرب حل مسألة رياضية بهذه الطريقة!`,
        example: `**الصيغة:**
"[المسألة] + دعنا نفكر خطوة بخطوة"

**مثال:**
"إذا كان لدي 100 ريال واشتريت 3 أقلام بـ 15 ريال للقلم، و2 دفاتر بـ 10 ريالات للدفتر. دعنا نفكر خطوة بخطوة، كم بقي معي؟"`
      },
      "3": {
        title: "هندسة الأوامر قليلة المحاولات (Few-Shot Prompting)",
        content: `الذكاء الاصطناعي يتعلم بالنماذج.

**كيف تعمل؟**
- أعطِ الآلة أمثلة قبل طلب المهمة
- إذا أردت تصنيف المشاعر، أعطها 3 أمثلة سابقة
- ثم اطلب منها تصنيف المدخل الرابع

**البنية:**
\`\`\`
مثال 1: [مدخل] → [مخرج]
مثال 2: [مدخل] → [مخرج]
مثال 3: [مدخل] → [مخرج]
الآن: [مدخل جديد] → ؟
\`\`\`

**الفوائد:**
- ردود دقيقة جداً
- مطابقة لأسلوبك الشخصي
- نتائج متسقة

📝 **مهمة لك:** أنشئ 3 أمثلة لمهمة تريدها!`,
        example: `**مثال تطبيقي - تصنيف المشاعر:**

المدخل: "الفيلم رائع وممتع جداً!" | المخرج: إيجابي 😊
المدخل: "الخدمة كانت سيئة وبطيئة" | المخرج: سلبي 😞
المدخل: "المنتج متوسط الجودة" | المخرج: محايد 😐
المدخل: "تجربة رائعة أنصح بها الجميع!" | المخرج: ؟`
      },
      "4": {
        title: "التحكم المطلق ومنع الهلوسة (Anti-Hallucination)",
        content: `أكبر مشكلة في الذكاء الاصطناعي هي 'الهلوسة' (تأليف معلومات).

**ما هي الهلوسة؟**
- عندما يخترع AI معلومات غير صحيحة
- يبدو واثقاً لكنه مخطئ
- شائع في المراجع والإحصائيات

**التقنية الحديثة لمنع ذلك:**
استخدام 'المطالبة بالصدق'

**الصيغة:**
"إذا لم تكن متأكداً، قل لا أعرف"

**متى تستخدمها؟**
- التلخيص الطبي
- المراجع القانونية
- المعلومات الحساسة
- الأبحاث العلمية

📝 **مهمة لك:** جربها عند طلب معلومات تاريخية!`,
        example: `**مثال تطبيقي:**

"لخص هذا التقرير الطبي، وإذا وجدت معلومة غير واضحة أو ناقصة، أشر إليها بكلمة [غير مؤكد] بدلاً من استنتاجها من عندك. لا تخترع أي معلومات."

**هذا يضمن دقة المعلومات ويحمي من الأخطاء!**`
      }
    }
  },
  2: {
    title: "دورة تعليم بناء وكلاء الذكاء الاصطناعي (AI Agents)",
    formula: "صيغة التعلم القائم على المشاريع (Project-Based Learning)",
    price: "مجاني تماماً 🎁",
    lessons: {
      "1": {
        title: "مقدمة في وكلاء الذكاء الاصطناعي",
        content: `**ما هو وكيل AI؟**

الوكيل هو برنامج ذكي يستطيع:
- فهم الأوامر المعقدة
- التخطيط للخطوات تلقائياً
- استخدام أدوات خارجية
- التعلم من النتائج

**الفرق بين Chatbot و Agent:**
- Chatbot: يرد على أسئلتك فقط
- Agent: ينفذ مهام معقدة متعددة الخطوات

**أمثلة على الوكلاء:**
- مساعد الحجز الذكي
- روبوت التحليل المالي
- نظام خدمة العملاء الآلي
- وكيل البحث والتلخيص

📝 **مهمة لك:** فكر في مهمة تريد من وكيل ذكي تنفيذها!`,
        example: `**مثال على وكيل بسيط:**

\`\`\`python
from langchain.agents import initialize_agent, Tool

def search_tool(query):
    # البحث في الإنترنت
    return f"نتائج البحث عن: {query}"

def calculator_tool(expression):
    # حساب رياضي
    return eval(expression)

tools = [
    Tool(name="Search", func=search_tool, description="للبحث"),
    Tool(name="Calculator", func=calculator_tool, description="للحساب")
]

agent = initialize_agent(tools, llm, agent="zero-shot-react")
\`\`\``
      },
      "2": {
        title: "العمل مع LangChain",
        content: `**LangChain:** أهم إطار عمل لبناء تطبيقات AI

**لماذا LangChain؟**
- يسهل بناء التطبيقات المعقدة
- مكونات جاهزة للاستخدام
- يدعم نماذج متعددة
- مجتمع نشط

**المكونات الأساسية:**

1. **LLMs** - نماذج اللغة
2. **Prompts** - قوالب الأوامر
3. **Chains** - سلاسل المعالجة
4. **Agents** - الوكلاء
5. **Tools** - الأدوات
6. **Memory** - الذاكرة

📝 **مهمة لك:** ثبت LangChain وجرّب المثال!`,
        example: `**مثال - إنشاء قالب أمر:**

\`\`\`python
from langchain import PromptTemplate, LLMChain
from langchain_openai import OpenAI

# إنشاء القالب
template = """
أنت مساعد متخصص في {domain}.
المهمة: {task}
السياق: {context}

أجب بشكل احترافي ومفصل:
"""

prompt = PromptTemplate(
    input_variables=["domain", "task", "context"],
    template=template
)

# إنشاء السلسلة
llm = OpenAI(temperature=0.7)
chain = LLMChain(llm=llm, prompt=prompt)

# التنفيذ
result = chain.run(
    domain="التسويق الرقمي",
    task="اقترح استراتيجية",
    context="شركة ناشئة"
)
\`\`\``
      },
      "3": {
        title: "ربط الأدوات الخارجية",
        content: `**لماذا نحتاج أدوات خارجية؟**

النموذج محدود بمعرفته. الأدوات تضيف:
- البحث على الإنترنت 🌐
- قواعد البيانات 💾
- الحسابات المعقدة 🔢
- APIs خارجية 🔗

**أنواع الأدوات الشائعة:**
- Search Tools (بحث جوجل، ويكيبيديا)
- Database Tools (SQL, MongoDB)
- API Tools (الطقس، الأسعار)
- Custom Tools (أدواتك الخاصة)

**كيف تصنع أداة؟**
1. عرّف الدالة
2. غلّفها بـ Tool
3. أضفها للوكيل

📝 **مهمة لك:** أنشئ أداة بسيطة!`,
        example: `**مثال - إنشاء أداة مخصصة:**

\`\`\`python
from langchain.tools import Tool
import requests

def get_weather(city):
    """الحصول على الطقس"""
    api_key = "YOUR_KEY"
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"
    response = requests.get(url)
    data = response.json()
    return f"الطقس في {city}: {data['current']['temp_c']}°C"

# إنشاء الأداة
weather_tool = Tool(
    name="Weather",
    func=get_weather,
    description="للحصول على حالة الطقس. المدخل: اسم المدينة"
)

# إضافتها للوكيل
agent = initialize_agent(
    tools=[weather_tool],
    llm=llm,
    agent="zero-shot-react-description"
)

# الاستخدام
agent.run("كيف الطقس في الرياض اليوم؟")
\`\`\``
      },
      "4": {
        title: "التفكير المنطقي للآلة (ReAct)",
        content: `**ReAct = Reasoning + Acting**

الوكيل يفكر ثم يتصرف في حلقة متكررة:

\`\`\`
1. Thought (فكرة): ماذا أحتاج أن أفعل؟
2. Action (فعل): أي أداة أستخدم؟
3. Observation (ملاحظة): ما النتيجة؟
4. Repeat (تكرار): حتى الوصول للحل
\`\`\`

**مثال واقعي:**
السؤال: "كم عدد سكان العاصمة الفرنسية؟"

- Thought: أحتاج معرفة العاصمة أولاً
- Action: Search "capital of France"
- Observation: Paris
- Thought: الآن أحتاج عدد السكان
- Action: Search "population of Paris 2024"
- Observation: 2.1 million
- Answer: باريس بها 2.1 مليون نسمة

📝 **مهمة لك:** جرب وكيل ReAct مع سؤال معقد!`,
        example: `**مثال - وكيل ReAct كامل:**

\`\`\`python
from langchain.agents import initialize_agent
from langchain_openai import OpenAI

llm = OpenAI(temperature=0)

agent = initialize_agent(
    tools=[search_tool, calculator_tool],
    llm=llm,
    agent="zero-shot-react-description",
    verbose=True  # يظهر خطوات التفكير
)

# سؤال معقد
result = agent.run(
    "كم تبلغ مساحة السعودية بالكيلومتر المربع، وإذا قسمناها على عدد السكان، كم يكون نصيب كل شخص؟"
)

# الوكيل سيقوم:
# 1. البحث عن مساحة السعودية
# 2. البحث عن عدد السكان
# 3. حساب القسمة
# 4. إعطاء النتيجة
\`\`\``
      },
      "5": {
        title: "مشروع عملي: بناء وكيل خدمة العملاء",
        content: `**المشروع النهائي:**

بناء وكيل خدمة عملاء كامل يقوم بـ:
1. استقبال استفسارات العملاء
2. البحث في قاعدة المعرفة
3. الرد بشكل ذكي ولطيف
4. تسجيل المحادثة للمراجعة

**المتطلبات:**
- Python 3.10+
- LangChain
- OpenAI API key
- قاعدة بيانات (SQLite)

**هيكل المشروع:**
\`\`\`
customer_agent/
├── main.py           # نقطة البداية
├── agent.py          # الوكيل الرئيسي
├── tools/
│   ├── search.py     # أداة البحث
│   ├── database.py   # أداة قاعدة البيانات
│   └── ticket.py     # أداة التذاكر
├── prompts/
│   └── system.txt    # أمر النظام
└── data/
    └── knowledge.db  # قاعدة المعرفة
\`\`\`

📝 **مهمة لك:** ابدأ ببناء المشروع!`,
        example: `**الكود الأساسي للمشروع:**

\`\`\`python
# main.py
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, Tool

# تهيئة النموذج
llm = ChatOpenAI(model="gpt-4", temperature=0.7)

# أداة البحث في قاعدة المعرفة
def search_knowledge(query):
    # البحث في قاعدة البيانات
    import sqlite3
    conn = sqlite3.connect('knowledge.db')
    cursor = conn.execute(
        "SELECT answer FROM faq WHERE question LIKE ?", 
        (f"%{query}%",)
    )
    result = cursor.fetchone()
    return result[0] if result else "لم أجد إجابة"

# إنشاء الأدوات
tools = [
    Tool(
        name="Knowledge",
        func=search_knowledge,
        description="للبحث في قاعدة المعرفة"
    )
]

# إنشاء الوكيل
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent="chat-conversational-react-description",
    verbose=True
)

# التشغيل
while True:
    user_input = input("العميل: ")
    if user_input == "خروج":
        break
    response = agent.run(user_input)
    print(f"الوكيل: {response}")
\`\`\``
      }
    }
  },
  3: {
    title: "دورة تعليم أساسيات تعلم الآلة (Machine Learning)",
    formula: "صيغة التحليل التطبيقي (Applied Analysis)",
    price: "مجاني تماماً 🎁",
    lessons: {
      "1": {
        title: "كيف تتعلم الآلة؟",
        content: `**التعلم الآلي = التعلم من البيانات**

بدلاً من برمجة كل قاعدة، نعطي الآلة:
- بيانات كثيرة 📊
- طريقة للتعلم 🧠
- معايير للنجاح ✅

**أنواع التعلم:**

1. **التعلم بالإشراف (Supervised)**
   - بيانات مع Labels
   - مثال: صور قطط → "قطة"
   - الأكثر استخداماً

2. **التعلم بدون إشراف (Unsupervised)**
   - بيانات بدون Labels
   - مثال: تجميع العملاء حسب السلوك
   - لاكتشاف الأنماط

3. **التعلم المعزز (Reinforcement)**
   - تعلم من التجربة والخطأ
   - مثال: ألعاب الشطرنج
   - للمهام التفاعلية

📝 **مهمة لك:** فكر في مشكلة يمكن حلها بكل نوع!`,
        example: `**مثال بسيط - تصنيف الفواكه:**

\`\`\`python
from sklearn.tree import DecisionTreeClassifier

# بيانات التدريب (الوزن، اللون)
# اللون: 0=أحمر، 1=أصفر، 2=أخضر
X = [
    [150, 0],  # تفاحة حمراء
    [130, 0],  # تفاحة حمراء
    [200, 1],  # موزة صفراء
    [180, 1],  # موزة صفراء
    [160, 2],  # كيوي أخضر
]

# التسميات
y = ["تفاحة", "تفاحة", "موزة", "موزة", "كيوي"]

# تدريب النموذج
model = DecisionTreeClassifier()
model.fit(X, y)

# تنبؤ لفاكهة جديدة
new_fruit = [[170, 0]]  # 170 جرام، أحمر
prediction = model.predict(new_fruit)
print(f"التنبؤ: {prediction[0]}")  # تفاحة
\`\`\``
      },
      "2": {
        title: "تحضير البيانات",
        content: `**البيانات النظيفة = نتائج دقيقة** 🎯

80% من وقت علماء البيانات يذهب في التنظيف!

**خطوات تحضير البيانات:**

1. **التنظيف (Cleaning)**
   - إزالة القيم الفارغة
   - تصحيح الأخطاء الإملائية
   - إزالة التكرارات

2. **التحويل (Transformation)**
   - تحويل النصوص لأرقام
   - تطبيع القيم (0-1)
   - إنشاء خصائص جديدة

3. **التقسيم (Splitting)**
   - تدريب (70-80%)
   - اختبار (20-30%)
   - أحياناً تحقق (Validation)

**أدوات مفيدة:**
- Pandas للتنظيف
- Scikit-learn للتحويل

📝 **مهمة لك:** نظّف مجموعة بيانات!`,
        example: `**مثال عملي - تنظيف بيانات:**

\`\`\`python
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

# قراءة البيانات
df = pd.read_csv('customers.csv')

# 1. التنظيف
print("قبل التنظيف:", df.shape)

# إزالة القيم الفارغة
df = df.dropna()

# إزالة التكرارات
df = df.drop_duplicates()

# تصحيح الأخطاء
df['city'] = df['city'].str.strip().str.title()

print("بعد التنظيف:", df.shape)

# 2. التحويل
# تحويل النص لأرقام
le = LabelEncoder()
df['city_encoded'] = le.fit_transform(df['city'])

# تطبيع الأرقام
scaler = StandardScaler()
df[['age', 'income']] = scaler.fit_transform(df[['age', 'income']])

# 3. التقسيم
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    df.drop('target', axis=1),
    df['target'],
    test_size=0.2,
    random_state=42
)

print(f"تدريب: {len(X_train)}, اختبار: {len(X_test)}")
\`\`\``
      },
      "3": {
        title: "تدريب النماذج",
        content: `**كيف ندرّب النموذج؟** 🏋️

العملية:
1. نختار الخوارزمية المناسبة
2. نمرر بيانات التدريب
3. نقيس الأداء
4. نحسّن المعاملات (Hyperparameters)

**الخوارزميات الشائعة:**

| الخوارزمية | الاستخدام |
|------------|----------|
| Linear Regression | التنبؤ بالأرقام |
| Logistic Regression | التصنيف الثنائي |
| Decision Trees | تصنيف وتنبؤ |
| Random Forest | مهام معقدة |
| SVM | تصنيف دقيق |
| Neural Networks | صور ونصوص |

**كيف تختار؟**
- ابدأ بالبسيط
- جرب عدة خوارزميات
- قارن الأداء

📝 **مهمة لك:** درّب 3 نماذج وقارن بينها!`,
        example: `**مثال عملي - تدريب ومقارنة:**

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# تقسيم البيانات
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# قائمة النماذج
models = {
    "Logistic Regression": LogisticRegression(),
    "Decision Tree": DecisionTreeClassifier(),
    "Random Forest": RandomForestClassifier()
}

# تدريب وتقييم كل نموذج
for name, model in models.items():
    # تدريب
    model.fit(X_train, y_train)
    
    # تنبؤ
    predictions = model.predict(X_test)
    
    # دقة
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"{name}: {accuracy * 100:.1f}%")

# Output:
# Logistic Regression: 85.2%
# Decision Tree: 88.7%
# Random Forest: 92.3%
\`\`\``
      },
      "4": {
        title: "تقييم النموذج",
        content: `**هل النموذج جيد؟** 📊

لا تكفي الدقة فقط! نحتاج مقاييس متعددة.

**مقاييس التقييم:**

1. **الدقة (Accuracy)**
   - نسبة التنبؤات الصحيحة
   - غير مناسبة للبيانات غير المتوازنة

2. **الدقة (Precision)**
   - كم من التنبؤات الإيجابية صحيحة؟
   - مهمة عندما الخطأ مكلف

3. **الاستدعاء (Recall)**
   - كم من الحالات الإيجابية اكتشفناها؟
   - مهمة عندما تفويت حالة مكلف

4. **F1 Score**
   - متوسط Precision و Recall
   - أفضل للمقارنة

**مشكلة Overfitting:**
- النموذج يحفظ البيانات بدل التعلم
- يعمل ممتاز على التدريب، سيء على الاختبار
- الحل: Cross-Validation

📝 **مهمة لك:** احسب كل المقاييس لنموذجك!`,
        example: `**مثال عملي - التقييم الشامل:**

\`\`\`python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, classification_report, confusion_matrix
)

# تنبؤات النموذج
y_pred = model.predict(X_test)

# 1. المقاييس الأساسية
print(f"الدقة: {accuracy_score(y_test, y_pred):.2%}")
print(f"Precision: {precision_score(y_test, y_pred):.2%}")
print(f"Recall: {recall_score(y_test, y_pred):.2%}")
print(f"F1 Score: {f1_score(y_test, y_pred):.2%}")

# 2. تقرير مفصل
print("\\nتقرير التصنيف:")
print(classification_report(y_test, y_pred))

# 3. مصفوفة الالتباس
print("\\nمصفوفة الالتباس:")
print(confusion_matrix(y_test, y_pred))

# 4. Cross-Validation للتأكد من عدم Overfitting
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
print(f"\\nCross-Validation: {scores.mean():.2%} (+/- {scores.std():.2%})")

# إذا كان الفرق كبير بين Train و Test → Overfitting
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)
print(f"\\nTrain: {train_score:.2%} vs Test: {test_score:.2%}")
\`\`\``
      },
      "5": {
        title: "أخلاقيات الذكاء الاصطناعي",
        content: `**الذكاء الاصطناعي المسؤول** 🤝

القوة تأتي مع مسؤولية!

**التحديات الأخلاقية:**

1. **التحيز (Bias)**
   - البيانات المتحيزة → قرارات متحيزة
   - مثال: توظيف، إقراض
   - الحل: مراجعة البيانات والخوارزميات

2. **الخصوصية (Privacy)**
   - حماية بيانات المستخدمين
   - الحل: التشفير والتخلص من الهوية

3. **الشفافية (Transparency)**
   - كيف اتخذ القرار؟
   - الحل: نماذج قابلة للتفسير (Explainable AI)

4. **الأمان (Safety)**
   - حماية من الاستخدام الضار
   - الحل: اختبارات أمنية ومراقبة

5. **التأثير على العمل**
   - أتمتة الوظائف
   - الحل: إعادة التدريب

**مبادئ AI المسؤول:**
✅ عادل
✅ شفاف
✅ آمن
✅ خاص
✅ مسؤول

📝 **مهمة لك:** قيّم نموذجك من الناحية الأخلاقية!`,
        example: `**قائمة تحقق أخلاقية:**

\`\`\`
🔍 قبل البدء:
□ هل البيانات متحيزة؟
□ هل تم الحصول على الموافقة؟
□ هل هناك مجموعات متأثرة؟

🔍 أثناء التطوير:
□ هل النموذج قابل للتفسير؟
□ هل تم اختبار التحيزات؟
□ هل تم اختبار الأمان؟

🔍 بعد النشر:
□ هل هناك مراقبة مستمرة؟
□ هل هناك آلية شكاوى؟
□ هل هناك خطة للتحديث؟

⚠️ علامات تحذيرية:
- أداء مختلف على مجموعات مختلفة
- قرارات لا يمكن تفسيرها
- بيانات حساسة بدون حماية
- لا توجد مراجعة بشرية
\`\`\`

**مثال - فحص التحيز:**

\`\`\`python
# فحص الأداء على مجموعات مختلفة
for group in ['male', 'female']:
    mask = X_test['gender'] == group
    group_accuracy = accuracy_score(
        y_test[mask], 
        y_pred[mask]
    )
    print(f"{group}: {group_accuracy:.2%}")

# إذا كان الفرق كبير → هناك تحيز!
\`\`\``
      }
    }
  }
};

// GET - الحصول على درس محدد
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const courseId = parseInt(searchParams.get('courseId') || '0');
  const lessonId = searchParams.get('lessonId') || '0';

  if (!courseId || !lessonId) {
    return NextResponse.json({
      success: false,
      error: 'يرجى تحديد الدورة والدرس'
    });
  }

  const course = coursesData[courseId];
  if (!course) {
    return NextResponse.json({
      success: false,
      error: 'الدورة غير موجودة'
    });
  }

  const lesson = course.lessons[lessonId];
  if (!lesson) {
    return NextResponse.json({
      success: false,
      error: 'الدرس غير موجود'
    });
  }

  // عدد الدروس الكلي
  const totalLessons = Object.keys(course.lessons).length;

  return NextResponse.json({
    success: true,
    lesson: {
      courseId,
      lessonId,
      courseName: course.title,
      formula: course.formula,
      price: course.price,
      totalLessons,
      ...lesson
    }
  });
}

// POST - الحصول على قائمة دروس دورة محددة
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId } = body;

    const course = coursesData[courseId];
    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'الدورة غير موجودة'
      });
    }

    const lessonsList = Object.entries(course.lessons).map(([id, lesson]) => ({
      id,
      title: lesson.title
    }));

    return NextResponse.json({
      success: true,
      course: {
        id: courseId,
        title: course.title,
        formula: course.formula,
        price: course.price,
        lessons: lessonsList
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ'
    });
  }
}

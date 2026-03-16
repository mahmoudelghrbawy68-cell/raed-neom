#!/usr/bin/env python3
"""
رائد نيوم - MCP Server v3.0
منصة تعليم الذكاء الاصطناعي الشاملة
يدعم جميع المناطق عبر z-ai-web-dev-sdk
"""

import json
import subprocess
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

# ═══════════════════════════════════════════════════════════════════════════════
# إعداد AI - استخدام z-ai-web-dev-sdk (يعمل في جميع المناطق)
# ═══════════════════════════════════════════════════════════════════════════════

def call_ai(messages):
    """استدعاء AI عبر z-ai-web-dev-sdk"""
    try:
        # تحويل الرسائل إلى نص
        system_msg = ""
        user_msg = ""
        
        for msg in messages:
            if msg["role"] == "system":
                system_msg = msg["content"]
            elif msg["role"] == "user":
                user_msg = msg["content"]
        
        # إنشاء سكربت Node.js لاستدعاء AI
        script = f'''
        const ZAI = require('z-ai-web-dev-sdk').default;
        
        async function main() {{
            const zai = await ZAI.create();
            
            const completion = await zai.chat.completions.create({{
                messages: [
                    {{ role: 'system', content: {json.dumps(system_msg)} }},
                    {{ role: 'user', content: {json.dumps(user_msg)} }}
                ],
                temperature: 0.7,
                max_tokens: 1500
            }});
            
            console.log(completion.choices[0]?.message?.content || 'لا يوجد رد');
        }}
        
        main().catch(e => console.log('خطأ: ' + e.message));
        '''
        
        # تنفيذ السكربت
        result = subprocess.run(
            ['node', '-e', script],
            capture_output=True,
            text=True,
            timeout=60,
            cwd='/home/z/my-project'
        )
        
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            return generate_local_response(user_msg)
    
    except Exception as e:
        return generate_local_response(messages[-1].get("content", "") if messages else "")

def generate_local_response(message):
    """ردود محلية ذكية في حالة فشل API"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['مرحبا', 'أهلا', 'السلام', 'هاي', 'هلا']):
        return """أهلاً بك! 👋

أنا رائد، مساعدك الذكي في منصة رائد نيوم التعليمية.

**كيف أستطيع مساعدتك؟**
• 📚 تعلم البرمجة والذكاء الاصطناعي
• 🤖 اكتشاف الدورات المجانية
• 💡 الإجابة على أسئلتك التقنية

جميع دوراتنا مجانية! 🎁"""
    
    elif any(word in message_lower for word in ['دورة', 'كورس', 'تعلم', 'دروس']):
        return """🎓 **الدورات المتاحة (مجانية بالكامل):**

**1. هندسة الأوامر الذكية (Smart Prompting)**
- الصيغة: المحاكاة التفاعلية
- 4 دروس احترافية

**2. بناء وكلاء الذكاء الاصطناعي (AI Agents)**
- الصيغة: التعلم القائم على المشاريع
- 4 دروس متقدمة

**3. تعلم الآلة التطبيقي (Machine Learning)**
- الصيغة: التحليل العملي
- 1 درس أساسي

🎁 **جميع الدورات مجانية تماماً!**

أي دورة تريد البدء بها؟"""
    
    elif any(word in message_lower for word in ['بايثون', 'python', 'برمجة', 'كود']):
        return """🐍 **تعلم Python:**

```python
# مثال بسيط
name = "رائد"
print(f"مرحباً {name}!")
```

**لماذا Python؟**
- سهلة التعلم
- قوية في AI
- مجتمع كبير

هل تريد مثالاً أكثر تقدماً؟"""
    
    elif any(word in message_lower for word in ['ذكاء', 'ai', 'اصطناعي', 'gpt']):
        return """🤖 **الذكاء الاصطناعي:**

**مجالات AI:**
- 🧠 تعلم الآلة (Machine Learning)
- 💬 معالجة اللغة (NLP)
- 👁️ الرؤية الحاسوبية

**دوراتنا المجانية:**
1. هندسة الأوامر - للتفاعل مع AI
2. بناء الوكلاء - لتطبيقات متقدمة
3. أساسيات ML - للفهم العميق

ما المجال الذي يهمك؟"""
    
    else:
        return f"""شكراً لرسالتك! 🙏

سأساعدك في:
• 📚 تعلم البرمجة والذكاء الاصطناعي
• 🎓 اكتشاف الدورات المجانية
• 💡 الإجابة على أسئلتك

**جميع الدورات مجانية!** 🎁

كيف أستطيع مساعدتك؟"""

# ═══════════════════════════════════════════════════════════════════════════════
# بيانات الدورات التعليمية
# ═══════════════════════════════════════════════════════════════════════════════

COURSES = {
    "1": {
        "name": "دورة تعليم هندسة الأوامر الذكية (Smart Prompting)",
        "formula": "صيغة المحاكاة التفاعلية",
        "price": "مجاني تماماً 🎁",
        "lessons": {
            "1": {
                "title": "تشريح الأمر الاحترافي (The Anatomy of a Pro Prompt)",
                "content": """في هذا الدرس، ننتقل من مجرد 'الدردشة' إلى 'البرمجة اللغوية'. 

الأمر الاحترافي يتكون من 4 أركان أساسية (Framework):

1. الشخصية (Persona): حدد من هو الذكاء الاصطناعي
   - مثال: "أنت خبير أمن سيبراني"
   
2. السياق (Context): أعطه المعلومات الخلفية
   - مثال: "نحن نعمل على تطبيق بنكي"
   
3. المهمة (Task): ماذا تريد منه بالضبط؟
   - مثال: "حلل هذا الكود وابحث عن الثغرات"
   
4. القيود (Constraints): حدد ما لا يجب فعله
   - مثال: "لا تزد عن 50 كلمة\"""",
                "example": "أنت خبير تسويق (شخصية). نريد إطلاق منتج قهوة جديد (سياق). اكتب 3 عناوين جذابة (مهمة). اجعلها باللغة العربية الفصحى فقط (قيود)."
            },
            "2": {
                "title": "سلاسل التفكير (Chain of Thought - CoT)",
                "content": """أحدث تقنية لزيادة ذكاء الآلة هي إجبارها على التفكير بصوت عالٍ.

بدلاً من طلب النتيجة مباشرة، نطلب من الآلة: 'فكر خطوة بخطوة'

هذا يقلل الأخطاء المنطقية بنسبة تصل إلى 80% في المهام المعقدة.

متى تستخدمها:
- المسائل الرياضية
- تحليل البيانات
- البرمجة المعقدة
- اتخاذ القرارات""",
                "example": "حل هذه المسألة الرياضية المعقدة وفكر في كل خطوة واشرح سبب اختيارك لكل معادلة قبل الوصول للناتج النهائي."
            },
            "3": {
                "title": "هندسة الأوامر قليلة المحاولات (Few-Shot Prompting)",
                "content": """الذكاء الاصطناعي يتعلم بالنماذج.

كيف تعمل:
- أعطِ الآلة أمثلة قبل طلب المهمة
- إذا أردت تصنيف المشاعر، أعطها 3 أمثلة سابقة
- ثم اطلب منها تصنيف المدخل الرابع

الفوائد:
- ردود دقيقة جداً
- مطابقة لأسلوبك الشخصي
- نتائج متسقة""",
                "example": "المدخل: الفيلم رائع | المخرج: إيجابي. المدخل: الخدمة سيئة | المخرج: سلبي. المدخل: الجو مقبول | المخرج: ؟"
            },
            "4": {
                "title": "التحكم المطلق ومنع الهلوسة (Anti-Hallucination)",
                "content": """أكبر مشكلة في الذكاء الاصطناعي هي 'الهلوسة' (تأليف معلومات).

التقنية الحديثة لمنع ذلك:
استخدام 'المطالبة بالصدق'

نضيف للأمر: 'إذا لم تكن متأكداً من الإجابة، قل لا أعرف'

متى تستخدمها:
- التلخيص الطبي
- المراجع القانونية
- المعلومات الحساسة""",
                "example": "لخص هذا التقرير الطبي، وإذا وجدت معلومة غير واضحة، أشر إليها بكلمة [غير مؤكد] بدلاً من استنتاجها."
            }
        }
    },
    "2": {
        "name": "دورة تعليم بناء وكلاء الذكاء الاصطناعي (AI Agents)",
        "formula": "صيغة التعلم القائم على المشاريع",
        "price": "مجاني تماماً 🚀",
        "lessons": {
            "1": {
                "title": "مفهوم الوكيل الذكي: من الدردشة إلى الفعل (ReAct Framework)",
                "content": """الدرس الأول يركز على فلسفة 'ReAct':

الوكيل لا يعطي إجابة مباشرة، بل يمر بدورة:

1. تفكير (Thought): يحلل المهمة المطلوبة.
2. فعل (Action): يقرر استخدام أداة (بحث، حساب، برمجة).
3. ملاحظة (Observation): يقرأ نتيجة الفعل ويعدل تفكيره.

هذا هو الفرق بين 'البوت' التقليدي و'الوكيل' الذكي.""",
                "project": "تصميم مخطط تدفق (Flowchart) لوكيل يقوم بحجز رحلة طيران كاملة."
            },
            "2": {
                "title": "استدعاء الوظائف (Function Calling): إعطاء الآلة أيدي وأرجل",
                "content": """كيف يقرأ الذكاء الاصطناعي بريدك الإلكتروني أو يتحكم في منزلك الذكي؟

عن طريق تقنية Function Calling.

نحن لا نعطيه الكود، بل نصف له 'الأدوات' المتاحة، والنموذج يقرر بذكاء متى يستدعي الأداة المناسبة.""",
                "project": "كتابة وصف لوظيفة 'إرسال بريد إلكتروني' بلغة JSON ليفهمها الذكاء الاصطناعي."
            },
            "3": {
                "title": "ذاكرة الوكلاء (Memory & Persistence)",
                "content": """الوكيل بدون ذاكرة هو وكيل تائه.

نتعلم الفرق بين:
1. الذاكرة القصيرة (Short-term): سياق المحادثة الحالي.
2. الذاكرة الطويلة (Long-term): ربط الوكيل بقاعدة بيانات (Vector Database) ليتذكر تفضيلات المستخدم.""",
                "project": "بناء سيناريو لوكيل يتذكر حساسية المستخدم تجاه أطعمة معينة."
            },
            "4": {
                "title": "تعدد الوكلاء (Multi-Agent Systems - Swarms)",
                "content": """قمة التطور هي جعل 'جيش' من الوكلاء يعملون معاً.

وكيل يعمل كـ 'كاتب'، ووكيل آخر كـ 'محرر'، وثالث كـ 'خبير سيو'.

نتعلم كيف يتم التنسيق بينهم (Orchestration) لإنتاج عمل احترافي.""",
                "project": "محاكاة غرفة أخبار مكونة من 3 وكلاء ذكاء اصطناعي."
            }
        }
    },
    "3": {
        "name": "دورة تعليم أساسيات تعلم الآلة (Machine Learning)",
        "formula": "صيغة التحليل التطبيقي",
        "price": "مجاني تماماً 🎁",
        "lessons": {
            "1": {
                "title": "كيف تتعلم الآلة؟",
                "content": """التعلم الآلي = التعلم من البيانات

أنواع التعلم:

1. التعلم بالإشراف (Supervised)
   - بيانات مع Labels
   - مثال: صور قطط → "قطة"
   - الأكثر استخداماً

2. التعلم بدون إشراف (Unsupervised)
   - بيانات بدون Labels
   - مثال: تجميع العملاء حسب السلوك

3. التعلم المعزز (Reinforcement)
   - تعلم من التجربة والخطأ
   - مثال: ألعاب الشطرنج""",
                "example": "from sklearn.tree import DecisionTreeClassifier\nmodel = DecisionTreeClassifier()\nmodel.fit(X_train, y_train)"
            }
        }
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# النظام الذكي
# ═══════════════════════════════════════════════════════════════════════════════

def get_system_prompt(mode):
    """تكييف نظام الذكاء الاصطناعي حسب الطلب"""
    roles = {
        "support": """أنت موظف خدمة عملاء ذكي متاح 24/7 في منصة رائد نيوم.
هدفك حل مشكلات المستخدمين وإرشادهم للمحتوى المجاني.
كن ودوداً ومختصراً.""",
        
        "tutor": """أنت بروفيسور تعليم ذكاء اصطناعي في منصة رائد نيوم.
تدرس بأساليب حديثة وتركز على 'كيفية استخدام الآلة'.
قدم أمثلة عملية.""",
        
        "tech": """أنت مساعد تقني خبير في منصة رائد نيوم.
تساعد في حل المشكلات البرمجية والتقنية.
قدم حلولاً خطوة بخطوة."""
    }
    return roles.get(mode, roles["support"])

# ═══════════════════════════════════════════════════════════════════════════════
# MCP Server Handler
# ═══════════════════════════════════════════════════════════════════════════════

class MCPHandler(BaseHTTPRequestHandler):
    
    def log_message(self, format, *args):
        print(f"[MCP] {args[0]}")
    
    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        path = self.path.split('?')[0]
        
        if path in ['/mcp', '/']:
            self.send_json({
                "name": "رائد نيوم - MCP Server",
                "version": "3.0.0",
                "description": "منصة تعليم الذكاء الاصطناعي الشاملة",
                "ai_provider": "z-ai-web-dev-sdk",
                "status": "نشط ✅",
                "endpoints": {
                    "/mcp": "معلومات السيرفر",
                    "/mcp/courses": "قائمة الدورات",
                    "/mcp/course/{id}": "تفاصيل دورة",
                    "/mcp/lesson/{course_id}/{lesson_id}": "محتوى درس",
                    "/mcp/chat": "محادثة مع رائد (POST)",
                    "/mcp/support": "خدمة العملاء 24/7 (POST)",
                    "/mcp/tutor": "مساعد تعليمي (POST)",
                    "/mcp/tech": "مساعد تقني (POST)"
                },
                "courses_count": len(COURSES),
                "total_lessons": sum(len(c['lessons']) for c in COURSES.values())
            })
        
        elif path == '/mcp/courses':
            courses_list = []
            for cid, course in COURSES.items():
                courses_list.append({
                    "id": cid,
                    "name": course["name"],
                    "formula": course["formula"],
                    "price": course["price"],
                    "lessons_count": len(course["lessons"])
                })
            self.send_json({"success": True, "courses": courses_list})
        
        elif path.startswith('/mcp/course/'):
            course_id = path.split('/')[-1]
            course = COURSES.get(course_id)
            if course:
                lessons_list = [{"id": lid, "title": l["title"]} for lid, l in course["lessons"].items()]
                self.send_json({
                    "success": True,
                    "course": {
                        "id": course_id,
                        "name": course["name"],
                        "formula": course["formula"],
                        "price": course["price"],
                        "lessons": lessons_list
                    }
                })
            else:
                self.send_json({"success": False, "error": "الدورة غير موجودة"}, 404)
        
        elif path.startswith('/mcp/lesson/'):
            parts = path.split('/')
            if len(parts) >= 5:
                course_id = parts[3]
                lesson_id = parts[4]
                
                course = COURSES.get(course_id)
                if course and lesson_id in course["lessons"]:
                    lesson = course["lessons"][lesson_id]
                    result = {
                        "success": True,
                        "lesson": {
                            "course_id": course_id,
                            "lesson_id": lesson_id,
                            "course_name": course["name"],
                            "formula": course["formula"],
                            "title": lesson["title"],
                            "content": lesson["content"],
                            "total_lessons": len(course["lessons"])
                        }
                    }
                    if "example" in lesson:
                        result["lesson"]["example"] = lesson["example"]
                    if "project" in lesson:
                        result["lesson"]["project"] = lesson["project"]
                    self.send_json(result)
                else:
                    self.send_json({"success": False, "error": "الدرس غير موجود"}, 404)
            else:
                self.send_json({"success": False, "error": "مسار غير صحيح"}, 400)
        
        else:
            self.send_json({"success": False, "error": "المسار غير موجود"}, 404)
    
    def do_POST(self):
        path = self.path.split('?')[0]
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            data = json.loads(body)
        except:
            data = {}
        
        if path == '/mcp/chat':
            message = data.get('message', '')
            history = data.get('history', [])
            
            messages = [{"role": "system", "content": get_system_prompt("tutor")}]
            for h in history[-10:]:
                messages.append(h)
            messages.append({"role": "user", "content": message})
            
            response = call_ai(messages)
            self.send_json({"success": True, "response": response})
        
        elif path == '/mcp/support':
            issue = data.get('issue', data.get('message', ''))
            messages = [
                {"role": "system", "content": get_system_prompt("support")},
                {"role": "user", "content": f"مشكلتي: {issue}"}
            ]
            response = call_ai(messages)
            self.send_json({"success": True, "response": f"🤖 [خدمة العملاء 24/7]: {response}"})
        
        elif path == '/mcp/tutor':
            question = data.get('question', data.get('message', ''))
            messages = [
                {"role": "system", "content": get_system_prompt("tutor")},
                {"role": "user", "content": question}
            ]
            response = call_ai(messages)
            self.send_json({"success": True, "response": f"🎓 [المساعد التعليمي]: {response}"})
        
        elif path == '/mcp/tech':
            query = data.get('query', data.get('message', ''))
            messages = [
                {"role": "system", "content": get_system_prompt("tech")},
                {"role": "user", "content": f"مشكلتي التقنية: {query}"}
            ]
            response = call_ai(messages)
            self.send_json({"success": True, "response": f"👨‍💻 [المساعد التقني]: {response}"})
        
        else:
            self.send_json({"success": False, "error": "المسار غير موجود"}, 404)

# ═══════════════════════════════════════════════════════════════════════════════
# تشغيل السيرفر
# ═══════════════════════════════════════════════════════════════════════════════

def run_server(port=2091):
    server = HTTPServer(('0.0.0.0', port), MCPHandler)
    print(f"""
    ╔══════════════════════════════════════════════════════════════╗
    ║         🚀 رائد نيوم - MCP Server v3.0                        ║
    ╠══════════════════════════════════════════════════════════════╣
    ║  المحلي:   http://127.0.0.1:{port}                              ║
    ║  ngrok:    https://sporogonial-doomily-margot.ngrok-free.dev ║
    ║  AI:       z-ai-web-dev-sdk (يعمل في جميع المناطق)            ║
    ╠══════════════════════════════════════════════════════════════╣
    ║  📚 الدورات: {len(COURSES)} | 📖 الدروس: {sum(len(c['lessons']) for c in COURSES.values())}                    ║
    ║  🎯 Modes: support | tutor | tech                            ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    server.serve_forever()

if __name__ == '__main__':
    run_server()

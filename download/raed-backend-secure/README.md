# 🚀 Raed Neom Super AI Backend

## 📋 نظرة عامة

نظام ذكاء اصطناعي متقدم يدعم **أدوار متعددة** مع حماية متكاملة ضد هجمات Prompt Injection.

## 🌟 الميزات

### 1. الأدوار المتخصصة

| الدور | الوصف | الاستخدام |
|-------|-------|----------|
| `customer_service` | خدمة العملاء | الاستفسارات والدورات |
| `tech_assistant` | المساعد التقني | البرمجة والأكواد |
| `ai_tutor` | معلم الذكاء الاصطناعي | تعليم AI و ML |
| `general_assistant` | المساعد العام | الأسئلة المتنوعة |

### 2. نظام الحماية المتقدم

```python
# يكتشف ويمنع أكثر من 20 نمط هجوم:
- "Ignore previous instructions"
- "Bypass all restrictions"
- "System: ..." (حقن الدور)
- "Act as unrestricted"
```

### 3. إدارة الجلسات

- سجل محادثات لكل مستخدم
- آخر 10 رسائل كسياق
- تنظيف تلقائي للجلسات القديمة

### 4. Rate Limiting

- 30 طلب/دقيقة لكل IP
- حماية من DoS attacks

## 🚀 التشغيل

```bash
# تثبيت المتطلبات
pip install -r requirements.txt

# تشغيل الخادم
python api_server.py
```

## 📡 نقاط النهاية

### POST /chat
```json
// Request
{
    "user_id": "user_123",
    "prompt": "كيف أبدأ تعلم Python؟",
    "context": "tech_assistant"
}

// Response
{
    "success": true,
    "response": "مرحباً! Python لغة ممتازة...",
    "warning": null,
    "context": "tech_assistant",
    "message_count": 1,
    "session_id": "user_123"
}
```

### GET /contexts
```json
{
    "contexts": ["customer_service", "tech_assistant", "ai_tutor", "general_assistant"],
    "descriptions": {
        "customer_service": "خدمة العملاء - للرد على الاستفسارات",
        ...
    }
}
```

### WebSocket /ws/{user_id}
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/user_123');

// إرسال رسالة
ws.send(JSON.stringify({
    "prompt": "علمني React",
    "context": "tech_assistant"
}));

// استقبال الرد
ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(data.response);
};
```

## 🏗️ هيكل الملفات

```
raed-backend-secure/
├── api_server.py      # FastAPI Server
├── ai_engine.py       # LangChain AI Engine
├── main.py            # Basic Backend (بديل)
├── requirements.txt   # Dependencies
└── README.md          # هذا الملف
```

## 🔧 التخصيص

### إضافة دور جديد

```python
# في ai_engine.py
ROLE_PROMPTS["new_role"] = """أنت [وصف الدور]..."""
```

### تغيير النموذج

```python
ai_engine = SuperAIApp(
    model="gpt-4o",  # أو gpt-4o-mini
    temperature=0.8,
    max_tokens=2000
)
```

## 🔒 الأمان

1. **لا تخزن** مفاتيح API في الكود
2. استخدم `.env` للمتغيرات الحساسة:
```bash
OPENAI_API_KEY=your_key_here
```

3. **HTTPS** في الإنتاج
4. راقب **السجلات** بانتظام

## 📊 الأداء

- ⚡ استجابة سريعة (< 2 ثانية)
- 🧠 ذاكرة محادثة ذكية
- 🔄 دعم WebSocket للتفاعل المباشر

## 📜 الرخصة

MIT License - جميع الحقوق محفوظة © 2025

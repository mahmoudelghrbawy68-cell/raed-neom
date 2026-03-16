# 🚀 رائد نيوم - Backend

## FastAPI Backend للصوت في الوقت الحقيقي

### ✨ الميزات

- **Realtime Voice AI** - محادثة صوتية في الوقت الحقيقي مع OpenAI GPT-4o
- **WebSocket Support** - اتصال ثنائي الاتجاه مع المتصفح
- **Telegram Alerts** - تنبيهات فورية عند اهتمام المستخدم بالشراء
- **Course Detection** - كشف تلقائي للدورات المناسبة
- **Session Management** - إدارة جلسات المحادثة

---

## 📦 البنية

```
raed-backend/
├── main.py           # التطبيق الرئيسي
├── requirements.txt  # مكتبات Python
├── Dockerfile        # صورة Docker
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚙️ الإعداد

### 1. المتغيرات البيئية

انسخ `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

ثم عدّل القيم:

```env
OPENAI_API_KEY=sk-your-key-here
TELEGRAM_TOKEN=123456:ABC-xyz   # اختياري
ADMIN_CHAT_ID=123456789         # اختياري
```

### 2. تشغيل محلي

```bash
# تثبيت المتطلبات
pip install -r requirements.txt

# تشغيل الخادم
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. تشغيل مع Docker

```bash
# بناء وتشغيل
docker-compose up --build

# تشغيل في الخلفية
docker-compose up -d
```

---

## 🔌 نقاط النهاية (Endpoints)

### REST API

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/` | حالة الخادم |
| GET | `/health` | فحص الصحة |
| GET | `/courses` | قائمة الدورات |
| POST | `/chat` | محادثة نصية |
| POST | `/detect-product` | كشف المنتجات |

### WebSocket

| Endpoint | الوصف |
|----------|-------|
| `/media-stream` | الصوت في الوقت الحقيقي |

---

## 🎤 مثال WebSocket

```javascript
// JavaScript Client
const ws = new WebSocket('ws://localhost:8000/media-stream');

ws.onopen = () => {
  console.log('متصل!');
  // بدء التسجيل
  ws.send(JSON.stringify({ event: 'start' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.event === 'audio') {
    // تشغيل الصوت
    playAudio(data.payload);
  }
  
  if (data.event === 'text') {
    // عرض النص
    console.log('رد:', data.content);
  }
};

// إرسال الصوت
function sendAudio(audioBase64) {
  ws.send(JSON.stringify({
    event: 'media',
    payload: audioBase64
  }));
}
```

---

## 🔔 التنبيهات (Telegram)

عند إظهار المستخدم اهتماماً بالشراء، يُرسل تنبيه تلقائي:

```
🚀 تنبيه من رائد نيوم:

💰 اهتمام بالشراء: أريد شراء دورة Python
```

---

## 📡 النشر على Render

1. اربط مستودع GitHub بـ Render
2. اختر **Docker** كـ Environment
3. أضف المتغيرات البيئية
4. انشر!

---

## 🛡️ الأمان

- ✅ CORS مُفعّل لجميع الأصول (غيّره في الإنتاج)
- ✅ WebSocket authentication (اختياري)
- ✅ Environment variables محمية

---

## 📄 الترخيص

© 2025 رائد نيوم - جميع الحقوق محفوظة

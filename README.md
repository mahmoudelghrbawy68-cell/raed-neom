# 🚀 رائد نيوم | Raed Neom

<div align="center">

![Version](https://img.shields.io/badge/version-11.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Protected-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![GPT](https://img.shields.io/badge/GPT-5.2-purple.svg)

**منصة التعلم التفاعلي الذكي - Smart Interactive Learning Platform**

[🇸🇦 العربية](#-نظرة-عامة) | [🇬🇧 English](#-overview)

</div>

---

## 📋 نظرة عامة

**رائد نيوم** منصة تعليمية ذكية تقدم دورات مجانية في الذكاء الاصطناعي باستخدام GPT-5.2.

### ✨ المميزات

| الميزة | الوصف |
|--------|-------|
| 🎓 **دورات تفاعلية** | 14 درس في 3 دورات مجانية |
| 🤖 **GPT-5.2** | أحدث نماذج OpenAI عبر OpenRouter |
| 🗣️ **محادثة صوتية** | تسجيل صوتي + تحويل للنص |
| 🔊 **تحويل النص لصوت** | استماع للردود |
| 💬 **بث مباشر** | ردود تدريجية في الوقت الحقيقي |
| 📝 **اختبارات تفاعلية** | تتبع التقدم والدروس |
| 🌙 **واجهة عصرية** | تصميم أنيق مع RTL |

### 📚 الدورات (مجانية بالكامل 🎁)

| الدورة | الدروس | المدة | الصيغة التعليمية |
|--------|--------|-------|-----------------|
| 🎯 هندسة الأوامر الذكية | 4 دروس | 12 ساعة | المحاكاة التفاعلية |
| 🤖 بناء وكلاء AI | 5 دروس | 18 ساعة | التعلم القائم على المشاريع |
| 🧠 أساسيات تعلم الآلة | 5 دروس | 15 ساعة | التحليل التطبيقي |

---

## 🏗️ هيكل المشروع

```
raed-neom/
├── src/app/                           # واجهة Next.js
│   ├── api/raed/                      # APIs
│   │   ├── stream/route.ts            # بث مباشر
│   │   ├── tts/route.ts               # نص لصوت
│   │   ├── asr/route.ts               # صوت لنص
│   │   ├── quiz/route.ts              # اختبارات
│   │   ├── lessons/route.ts           # دروس
│   │   ├── lessons/interactive/       # دروس تفاعلية
│   │   ├── products/route.ts          # المنتجات
│   │   └── support/route.ts           # دعم 24/7
│   ├── page.tsx                       # الواجهة الرئيسية
│   └── layout.tsx                     # التخطيط RTL
├── src/lib/
│   ├── raed-core.ts                   # محرك AI (GPT-5.2)
│   ├── courses-content.ts             # محتوى الدورات
│   ├── interactive-lesson-builder.ts  # بنّاء الدروس
│   └── utils.ts                       # أدوات مساعدة
├── vercel.json                        # إعدادات Vercel
├── render.yaml                        # إعدادات Render
├── railway.toml                       # إعدادات Railway
├── fly.toml                           # إعدادات Fly.io
└── package.json                       # التبعيات
```

---

## 🚀 النشر

### Vercel (الواجهة)
```bash
# النشر المباشر
npx vercel --prod --token YOUR_VERCEL_TOKEN

# أو اربط المستودع من Vercel Dashboard
```

### Render (Backend - اختياري)
```bash
# 1. اربط المستودع من Render Dashboard
# 2. أضف متغيرات البيئة
# 3. Render سيستخدم render.yaml تلقائياً
```

### Railway
```bash
railway login
railway up
railway variables set OPENAI_API_KEY=sk-proj-xxx
```

### Fly.io
```bash
fly launch
fly secrets set OPENAI_API_KEY=sk-proj-xxx
```

---

## 🔧 متغيرات البيئة

### الواجهة (Vercel)
```env
# OpenRouter API (يعمل في جميع المناطق)
OPENROUTER_API_KEY=sk-or-v1-xxx

# أو OpenAI مباشرة (قد لا يعمل في بعض المناطق)
OPENAI_API_KEY=sk-proj-xxx

# Backend URL (اختياري)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

### Backend (Render/Railway/Fly.io)
```env
OPENAI_API_KEY=sk-proj-xxx
TELEGRAM_TOKEN=123456:ABC...
ADMIN_CHAT_ID=987654321
```

---

## 📡 API Endpoints

| Endpoint | النوع | الوصف |
|----------|-------|-------|
| `/api/raed/stream` | POST | محادثة مع بث مباشر (GPT-5.2) |
| `/api/raed/chat` | POST | محادثة عادية |
| `/api/raed/tts` | POST | تحويل النص لصوت |
| `/api/raed/asr` | POST | تحويل الصوت لنص |
| `/api/raed/products` | GET/POST | قائمة الدورات |
| `/api/raed/lessons` | GET/POST | محتوى الدروس |
| `/api/raed/lessons/interactive` | GET/POST | دروس تفاعلية مع مكونات |
| `/api/raed/quiz` | GET/POST | الاختبارات والتقدم |
| `/api/raed/support` | GET/POST | خدمة العملاء 24/7 |

---

## 🔗 الروابط

| البيئة | الرابط |
|--------|--------|
| **الإنتاج** | https://raed-neom-app.vercel.app |
| **GitHub** | https://github.com/mahmoudelghrbawy68-cell/raed-neom |

---

## 📊 الإحصائيات

- **14 درس** تفاعلي
- **3 دورات** مجانية
- **GPT-5.2** عبر OpenRouter
- **45 ساعة** محتوى تعليمي

---

## 📄 الترخيص

```
© 2025 جميع الحقوق محفوظة
المالك: mahmoudelghrbawy68-cell
الإصدار: 11.0.0-PRO
```

---

<div align="center">

**صُنع بـ ❤️ للعالم العربي**

</div>

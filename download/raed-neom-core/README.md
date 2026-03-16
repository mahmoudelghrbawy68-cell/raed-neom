# 🚀 رائد نيوم - Raed Neom Core

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-red.svg)
![License](https://img.shields.io/badge/license-Protected-green.svg)

**نظام الذكاء الاصطناعي الصوتي والبصري المتقدم**

[🇸🇦 العربية](#-نظرة-عامة) | [🇬🇧 English](#-overview)

</div>

---

## 📋 نظرة عامة

**رائد نيوم** هو نظام ذكاء اصطناعي متكامل يتميز بـ:

- 🎤 **Realtime Voice AI** - محادثة صوتية مباشرة مع GPT-4o Realtime
- 👁️ **Vision Analysis** - تحليل الصور والكاميرا
- 🛒 **Smart Sales** - كشف نوايا الشراء التلقائي
- 🛡️ **Neural Guardian** - نظام حماية ذاتي متقدم
- 📱 **Telegram Integration** - إشعارات فورية للمدير

---

## 🏗️ هيكل المشروع

```
📦 raed-neom-core
 ├── 📄 .env                    # متغيرات البيئة
 ├── 📄 docker-compose.yml      # تشغيل Docker
 ├── 📄 README.md               # التوثيق
 │
 ├── 📂 services
 │   ├── 📂 engine              # المحرك (Backend)
 │   │   ├── 📄 main.py         # FastAPI + Realtime WebSocket
 │   │   ├── 📄 security.py     # نظام الحماية
 │   │   ├── 📄 stress_test.py  # اختبار الأداء
 │   │   ├── 📄 requirements.txt
 │   │   └── 📄 Dockerfile
 │   │
 │   └── 📂 gateway             # الواجهة (Frontend)
 │       ├── 📂 src
 │       │   ├── 📂 components
 │       │   │   └── 📄 Dashboard.tsx
 │       │   └── 📄 App.tsx
 │       ├── 📄 package.json
 │       └── 📄 Dockerfile
 │
 └── 📂 data
     └── 📂 postgres            # قاعدة البيانات
         └── 📄 init.sql
```

---

## 🚀 التشغيل السريع

### 1️⃣ استخدام Docker (مُوصى)

```bash
# استنساخ المشروع
git clone https://github.com/YOUR_USERNAME/raed-neom-core.git
cd raed-neom-core

# إعداد البيئة
cp .env.example .env
# عدّل .env وأضف OPENAI_API_KEY

# تشغيل
docker-compose up -d

# عرض السجلات
docker-compose logs -f engine
```

### 2️⃣ تشغيل يدوي

```bash
# Backend
cd services/engine
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd services/gateway
npm install
npm run dev
```

---

## 🔌 نقاط الاتصال (API Endpoints)

| Endpoint | النوع | الوصف |
|----------|-------|-------|
| `GET /` | HTTP | حالة الخادم |
| `GET /health` | HTTP | فحص الصحة |
| `GET /stats` | HTTP | الإحصائيات |
| `WS /v2/raed-stream` | WebSocket | Realtime Voice AI |
| `WS /ws` | WebSocket | محادثة نصية |
| `POST /api/vision` | HTTP | تحليل صورة |
| `POST /api/sales/trigger` | HTTP | تفعيل بيع |

---

## ⚙️ متغيرات البيئة

| المتغير | مطلوب | الوصف |
|---------|-------|-------|
| `OPENAI_API_KEY` | ✅ | مفتاح OpenAI |
| `TELEGRAM_TOKEN` | ❌ | توكن بوت Telegram |
| `ADMIN_CHAT_ID` | ❌ | معرف المدير |
| `CORE_LICENSE` | ❌ | ترخيص المنتج |

---

## 🔒 نظام الحماية

يتميز **حارس نيوم** بـ:

- ✅ التحقق من الترخيص
- ✅ مراقبة سلامة الكود
- ✅ إشعارات فورية للمدير
- ✅ حماية من الهجمات

---

## 📊 اختبار الأداء

```bash
cd services/engine
python stress_test.py
```

---

## 📱 التكامل مع Telegram

1. أنشئ بوت عبر [@BotFather](https://t.me/BotFather)
2. احصل على الـ Token
3. احصل على Chat ID من [@userinfobot](https://t.me/userinfobot)
4. أضفها في `.env`

---

## 🐳 Docker Commands

```bash
# بناء الصور
docker-compose build

# تشغيل
docker-compose up -d

# إيقاف
docker-compose down

# عرض السجلات
docker-compose logs -f

# إعادة التشغيل
docker-compose restart engine
```

---

## 📝 الترخيص

```
© 2025 جميع الحقوق محفوظة
المالك: المستخدم
المنتج: رائد نيوم
الإصدار: 3.0.0-PROTECTED
```

---

<div align="center">

**صُنع بـ ❤️ للعالم العربي**

</div>

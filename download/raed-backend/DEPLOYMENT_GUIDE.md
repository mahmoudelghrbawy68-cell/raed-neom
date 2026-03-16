# 🚀 دليل النشر الكامل - رائد نيوم

## ✅ ما تم إنجازه

| المهمة | الحالة |
|--------|--------|
| ✅ الواجهة على Vercel | تم |
| ✅ تحديث الواجهة | تم |
| ✅ إنشاء Backend | تم |
| ⏳ نشر Backend على Render | **ينتظر OPENAI_API_KEY** |

---

## 🌐 الروابط الحالية

| الخدمة | الرابط |
|--------|--------|
| **الواجهة** | https://my-project-ebon-phi.vercel.app |
| **Backend** | في انتظار النشر |

---

## 📋 خطوات نشر Backend على Render (مجاني)

### الخطوة 1: إنشاء حساب Render
1. اذهب إلى: **https://render.com**
2. اضغط **"Get Started"**
3. سجل باستخدام **GitHub** أو **GitLab**

### الخطوة 2: إنشاء Web Service
1. في Dashboard، اضغط **"New +"**
2. اختر **"Web Service"**
3. اضغط **"Connect a repository"**
4. اختر **"Public Git repository"**

### الخطوة 3: إدخال رابط المستودع
```
https://github.com/YOUR_USERNAME/raed-neom
```
*(ستحتاج لرفع الكود على GitHub أولاً)*

### الخطوة 4: إعدادات الخدمة
```
Name: raed-neom-backend
Region: Oregon (US West)
Branch: main
Root Directory: download/raed-backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

### الخطوة 5: إضافة متغيرات البيئة
```
OPENAI_API_KEY = sk-proj-YOUR_KEY_HERE
TELEGRAM_TOKEN = your_bot_token (اختياري)
ADMIN_CHAT_ID = your_chat_id (اختياري)
ENVIRONMENT = production
ALLOWED_ORIGINS = https://my-project-ebon-phi.vercel.app
```

### الخطوة 6: نشر!
- اضغط **"Create Web Service"**
- انتظر 3-5 دقائق
- ستحصل على رابط مثل: `https://raed-neom-backend.onrender.com`

---

## 📋 رفع الكود على GitHub

### إنشاء مستودع جديد
1. اذهب إلى: **https://github.com/new**
2. اسم المستودع: `raed-neom`
3. اختر **Public**
4. اضغط **"Create repository"**

### رفع الكود
```bash
cd /home/z/my-project

# إضافة remote
git remote add origin https://github.com/YOUR_USERNAME/raed-neom.git

# رفع الكود
git push -u origin master
```

---

## 🔗 ربط الواجهة بالـ Backend

بعد نشر الـ Backend، أضف في Vercel:
1. اذهب إلى مشروعك على Vercel
2. Settings → Environment Variables
3. أضف:
   ```
   NEXT_PUBLIC_BACKEND_URL = https://raed-neom-backend.onrender.com
   ```
4. أعد النشر

---

## 🎯 ملخص الملفات الجاهزة

```
/download/raed-backend/
├── main.py              ✅ المحرك الرئيسي
├── requirements.txt     ✅ المكتبات
├── Dockerfile           ✅ صورة Docker
├── docker-compose.yml   ✅ Docker Compose
├── render.yaml          ✅ تكوين Render
├── railway.toml         ✅ تكوين Railway
├── fly.toml             ✅ تكوين Fly.io
├── .env.example         ✅ مثال الإعدادات
└── README.md            ✅ التوثيق
```

---

## 💡 نصيحة

إذا كنت تريد النشر بسرعة، استخدم **Railway.app**:
1. اذهب إلى: **https://railway.app**
2. اربط GitHub
3. اختر المستودع
4. أضف `OPENAI_API_KEY`
5. انشر! ✅

---

## 📞 الدعم

إذا احتجت مساعدة:
- [توثيق Render](https://render.com/docs)
- [توثيق Railway](https://docs.railway.app)
- [توثيق Fly.io](https://fly.io/docs)

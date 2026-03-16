# 🚀 رائد نيوم - دليل النشر

## ✅ الموقع يعمل بالفعل!

الموقع منشر ويعمل على:
- **URL:** https://raed-neom-app.vercel.app
- **GitHub:** https://github.com/mahmoudelghrbawy68-cell/raed-neom

---

## 📋 خطوات النشر الدائم

### الطريقة 1: عبر Vercel Dashboard (الأسهل)

1. اذهب إلى [vercel.com](https://vercel.com) وإنشاء حساب مجاني
2. اضغط **"Add New Project"**
3. اختر **"Import Git Repository"**
4. اختر مستودع `mahmoudelghrbawy68-cell/raed-neom`
5. اضغط **"Deploy"**

### الطريقة 2: عبر Vercel CLI

```bash
# 1. تسجيل الدخول
npx vercel login

# 2. ربط المشروع
npx vercel link

# 3. النشر للإنتاج
npx vercel --prod
```

### الطريقة 3: عبر GitHub Actions (تلقائي)

1. احصل على Vercel Token من [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. أضف الـ Secrets في GitHub:
   - `VERCEL_TOKEN` - توكن Vercel
   - `VERCEL_ORG_ID` - معرف المؤسسة
   - `VERCEL_PROJECT_ID` - معرف المشروع

---

## 🔑 متغيرات البيئة المطلوبة

أضف هذه المتغيرات في Vercel Dashboard > Settings > Environment Variables:

```
OPENROUTER_API_KEY=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
OPENAI_API_KEY=sk-svcacct-CMaeBCQHRQFZEPpkosPPuI34_R2rtgG1L6nuqsy_klx4a0iqrAg7vgo3y-5MxRLWfrAGZ1ADSOxT3BlbkFJRtJfiteqlUFWoLLVxyZEftL3RKGrYn5k7sHLf5GUFiDZC-CgyjbGO8TIBL7gQ3l5rzu2Cej0engA
```

---

## 📊 اختبار APIs

```bash
# اختبار الدورات
curl https://raed-neom-app.vercel.app/api/raed/products

# اختبار البث المباشر
curl -X POST https://raed-neom-app.vercel.app/api/raed/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"مرحبا"}'
```

---

## 🆘 الدعم

- GitHub Issues: https://github.com/mahmoudelghrbawy68-cell/raed-neom/issues
- Vercel Docs: https://vercel.com/docs

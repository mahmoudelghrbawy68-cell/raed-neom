# 🚀 رائد نيوم - Backend for Render

محرك الذكاء الاصطناعي لـ "رائد نيوم"

## 🚀 النشر على Render

### الطريقة السريعة:

1. اذهب إلى: **https://render.com**
2. سجل باستخدام GitHub
3. اضغط **"New +"** → **"Web Service"**
4. اربط مستودع GitHub
5. الإعدادات:
   - **Name**: `raed-neom-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

6. أضف متغير البيئة:
   ```
   OPENAI_API_KEY = sk-proj-your_key
   ```

7. اضغط **"Create Web Service"**

## 🔌 Endpoints

| Endpoint | النوع | الوصف |
|----------|-------|-------|
| `GET /` | HTTP | حالة الخادم |
| `GET /health` | HTTP | فحص الصحة |
| `POST /chat` | HTTP | محادثة |
| `WS /ws` | WebSocket | محادثة مباشرة |

## 📝 الترخيص

© 2025 جميع الحقوق محفوظة

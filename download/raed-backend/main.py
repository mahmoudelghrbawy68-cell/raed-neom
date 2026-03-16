"""
╔═══════════════════════════════════════════════════════════════════════════╗
║                     رائد نيوم - Backend الخلفي                             ║
║                     AI Edu-Commerce Engine                                  ║
╚═══════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import asyncio
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import httpx

# ═══════════════════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════════════════
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")

OPENAI_WS_URL = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview"

# ═══════════════════════════════════════════════════════════════════════════════
# System Prompt - وكيل تعليمي وتجاري
# ═══════════════════════════════════════════════════════════════════════════════
SYSTEM_PROMPT = """
أنت 'رائد نيوم' - وكيل تعليمي وتجاري ذكي.

═══════════════════════════════════════
🎯 الهدف الأساسي
═══════════════════════════════════════
- تبسيط العلوم وبيع الدورات التدريبية بذكاء
- تعليم المستخدم وتقديم نصائح عملية
- اقتراح الدورات المناسبة عند وجود اهتمام

═══════════════════════════════════════
📚 الدورات المتاحة
═══════════════════════════════════════
1. دورة Python الأساسية - 199 ريال
2. دورة React الاحترافية - 299 ريال
3. دورة الذكاء الاصطناعي - 349 ريال
4. دورة تطوير التطبيقات - 399 ريال

═══════════════════════════════════════
🎭 أسلوب التواصل
═══════════════════════════════════════
- تحدث بنبرة ودودة وقصيرة الجمل
- استخدم العربية الفصحى البسيطة
- أضف رموز تعبيرية مناسبة 😊
- إذا أبدى المستخدم اهتماماً بالبرمجة، اعرض دورة Python
- إذا أبدى اهتماماً بالذكاء الاصطناعي، اعرض دورة AI

═══════════════════════════════════════
📋 قواعد مهمة
═══════════════════════════════════════
- أجب على جميع الأسئلة بشكل مختصر ومفيد
- كن صبوراً ومفهماً مع المستخدم
- اعرض المنتجات بشكل طبيعي في المحادثة
"""

# ═══════════════════════════════════════════════════════════════════════════════
# FastAPI App
# ═══════════════════════════════════════════════════════════════════════════════
app = FastAPI(
    title="رائد نيوم - AI Engine",
    description="AI Edu-Commerce Engine with Realtime Voice",
    version="3.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════════════
# Models
# ═══════════════════════════════════════════════════════════════════════════════
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

# ═══════════════════════════════════════════════════════════════════════════════
# Courses Data
# ═══════════════════════════════════════════════════════════════════════════════
COURSES = [
    {"id": 1, "title": "دورة Python الأساسية", "price": "199 ريال", "description": "تعلم البرمجة من الصفر"},
    {"id": 2, "title": "دورة React الاحترافية", "price": "299 ريال", "description": "بناء تطبيقات ويب حديثة"},
    {"id": 3, "title": "دورة الذكاء الاصطناعي", "price": "349 ريال", "description": "AI وتحليل البيانات"},
    {"id": 4, "title": "دورة تطوير التطبيقات", "price": "399 ريال", "description": "تطبيقات موبايل"},
]

# Sessions
sessions = {}

# ═══════════════════════════════════════════════════════════════════════════════
# Helper Functions
# ═══════════════════════════════════════════════════════════════════════════════
async def send_telegram_alert(message: str):
    """إرسال تنبيه تلغرام"""
    if not TELEGRAM_TOKEN or not ADMIN_CHAT_ID:
        return
    
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, json={
                "chat_id": ADMIN_CHAT_ID,
                "text": f"🚀 **تنبيه من رائد نيوم:**\n\n{message}",
                "parse_mode": "Markdown"
            })
        except Exception as e:
            print(f"❌ Telegram error: {e}")

def detect_purchase_intent(text: str) -> bool:
    """كشف نية الشراء"""
    keywords = ["شراء", "اشتري", "سعر", "كم سعر", "الدفع", "التسجيل", "أريد"]
    return any(kw in text.lower() for kw in keywords)

# ═══════════════════════════════════════════════════════════════════════════════
# REST API Endpoints
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    return {"status": "healthy", "service": "رائد نيوم AI Engine", "version": "3.0.0"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "openai_configured": bool(OPENAI_API_KEY),
        "telegram_configured": bool(TELEGRAM_TOKEN and ADMIN_CHAT_ID)
    }

@app.get("/courses")
async def get_courses():
    """قائمة الدورات"""
    return {"success": True, "courses": COURSES}

@app.get("/api/analytics")
async def get_analytics():
    """إحصائيات لوحة التحكم"""
    return {
        "revenue": 1500,
        "conversion_rate": "12%",
        "top_course": "Python AI",
        "total_users": len(sessions)
    }

@app.post("/chat")
async def chat_endpoint(data: ChatMessage):
    """محادثة نصية"""
    return {
        "success": True,
        "response": "أهلاً! أنا رائد، كيف يمكنني مساعدتك؟",
        "session_id": data.session_id or f"session_{os.urandom(4).hex()}"
    }

# ═══════════════════════════════════════════════════════════════════════════════
# WebSocket - Realtime Voice AI
# ═══════════════════════════════════════════════════════════════════════════════

@app.websocket("/media-stream")
async def handle_voice_ai(websocket: WebSocket):
    """
    WebSocket للصوت في الوقت الحقيقي
    يتصل مع OpenAI Realtime API
    """
    await websocket.accept()
    print("🎤 New WebSocket connection")
    
    if not OPENAI_API_KEY:
        await websocket.send_json({
            "event": "error",
            "message": "OpenAI API key not configured"
        })
        await websocket.close()
        return

    session_id = f"session_{os.urandom(4).hex()}"
    sessions[session_id] = {"start_time": asyncio.get_event_loop().time()}

    try:
        async with websockets.connect(
            OPENAI_WS_URL,
            extra_headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "OpenAI-Beta": "realtime=v1"
            }
        ) as openai_ws:
            print("✅ Connected to OpenAI Realtime")

            # إرسال إعدادات الجلسة
            await openai_ws.send(json.dumps({
                "type": "session.update",
                "session": {
                    "instructions": SYSTEM_PROMPT,
                    "voice": "alloy",
                    "input_audio_format": "g711_ulaw",
                    "output_audio_format": "g711_ulaw",
                    "modalities": ["audio", "text"],
                    "turn_detection": {
                        "type": "server_vad",
                        "threshold": 0.5,
                        "silence_duration_ms": 500
                    }
                }
            }))

            # إرسال رسالة الترحيب التلقائية
            await websocket.send_json({
                "event": "welcome_message",
                "payload": {
                    "text": "مرحباً بك! 👋 أنا رائد، معلمك الذكي ومستشارك. كيف يمكنني مساعدتك في تطوير مهاراتك اليوم؟",
                    "autoPlayAudio": True
                },
                "session_id": session_id
            })

            async def from_client():
                """استقبال من العميل"""
                try:
                    async for msg in websocket.iter_text():
                        data = json.loads(msg)
                        
                        if data.get("event") == "media":
                            await openai_ws.send(json.dumps({
                                "type": "input_audio_buffer.append",
                                "audio": data["payload"]
                            }))
                        
                        elif data.get("event") == "start":
                            await openai_ws.send(json.dumps({
                                "type": "response.create"
                            }))
                        
                        elif data.get("event") == "stop":
                            await openai_ws.send(json.dumps({
                                "type": "input_audio_buffer.commit"
                            }))
                            await openai_ws.send(json.dumps({
                                "type": "response.create"
                            }))
                except WebSocketDisconnect:
                    print("Client disconnected")
                except Exception as e:
                    print(f"Error from_client: {e}")

            async def to_client():
                """إرسال للعميل"""
                try:
                    async for msg in openai_ws:
                        resp = json.loads(msg)
                        event_type = resp.get("type", "")
                        
                        # إرسال الصوت
                        if event_type == "response.audio.delta":
                            await websocket.send_json({
                                "event": "audio",
                                "payload": resp.get("delta", "")
                            })
                        
                        # إرسال النص
                        elif event_type == "response.text.delta":
                            text = resp.get("delta", "")
                            await websocket.send_json({
                                "event": "text",
                                "content": text
                            })
                            
                            # كشف اهتمام بالشراء
                            if detect_purchase_intent(text):
                                await send_telegram_alert(f"💰 اهتمام بالشراء: {text[:100]}")
                                # إرسال عرض منتج
                                await websocket.send_json({
                                    "event": "product",
                                    "data": COURSES[0]  # عرض دورة Python
                                })
                        
                        # انتهاء الاستجابة
                        elif event_type == "response.done":
                            await websocket.send_json({"event": "response_done"})
                        
                        # خطأ
                        elif event_type == "error":
                            await websocket.send_json({
                                "event": "error",
                                "message": resp.get("error", {}).get("message", "Unknown error")
                            })
                except Exception as e:
                    print(f"Error to_client: {e}")

            await asyncio.gather(from_client(), to_client())

    except WebSocketDisconnect:
        print(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        print(f"Server Error: {e}")
        try:
            await websocket.send_json({
                "event": "error",
                "message": str(e)
            })
        except:
            pass
    finally:
        if session_id in sessions:
            del sessions[session_id]

# ═══════════════════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

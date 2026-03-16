"""
╔═══════════════════════════════════════════════════════════════════════════╗
║                     رائد نيوم - Backend الخلفي                       ║
║                     AI Edu-Commerce Engine                                    ║
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
from typing import Optional, List
import httpx

# ═══════════════════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════════════════
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")

OPENAI_WS_URL = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01"

# ═══════════════════════════════════════════════════════════════════════════════
# System Prompt - توجيهات الوكيل الذكي
# ═══════════════════════════════════════════════════════════════════════════════
SYSTEM_PROMPT = """أنت 'رائد نيوم' - وكيل تعليمي وتجاري ذكي.

═══════════════════════════════════════
🎯 الهوية الأساسية
═══════════════════════════════════════
- الاسم: رائد نيوم (Raed Neom)
- النسخة: 3.0 Pro
- الدور: معلم ذكي، مرشد تطوير، مساعد تفاعلي

═══════════════════════════════════════
🧠 القدرات الأساسية
═══════════════════════════════════════
1. التعليم والتدريس: شرح المفاهيم بطريقة تفاعلية
2. البرمجة والتقنية: كتابة وتصحيح الأكواد
3. التطوير الشخصي: نصائح للنمو
4. المبيعات الذكية: عرض الدورات بأسلوب لبق

═══════════════════════════════════════
🎭 أسلوب التواصل
═══════════════════════════════════════
- تحدث بنبرة ودية وقصيرة الجمل
- استخدم العربية الفصحى البسيطة
- قدم الحلول خطوة بخطوة
- إذا لمسنا اهتماماً بالبرمجة، اعرض دورة بايثون
- إذا لمسنا اهتماماً بالتصميم، اعرض دورة UI/UX

═══════════════════════════════════════
🛒 قواعد البيع
═══════════════════════════════════════
- إذا أبدى المستخدم اهتماماً بالشراء، قدم الدورة المناسبة
- لا تكن عدوانياً في البيع
- قدم القيمة أولاً ثم اعرض المنتج"""

# ═══════════════════════════════════════════════════════════════════════════════
# FastAPI App
# ═══════════════════════════════════════════════════════════════════════════════
app = FastAPI(
    title="رائد نيوم - Backend",
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
# Courses Data
# ═══════════════════════════════════════════════════════════════════════════════
COURSES = [
    {
        "id": "p1",
        "title": "دورة بايثون الاحترافية",
        "price": "$50",
        "description": "تعلم البرمجة من الصفر مع Python",
        "duration": "15 ساعة",
        "lessons": 40,
        "rating": 4.9,
        "keywords": ["برمجة", "python", "بايثون", "كود", "تعلم البرمجة"]
    },
    {
        "id": "p2", 
        "title": "دورة تطوير الويب بـ React",
        "price": "$75",
        "description": "بناء تطبيقات ويب حديثة",
        "duration": "20 ساعة",
        "lessons": 55,
        "rating": 4.8,
        "keywords": ["ويب", "react", "موقع", "تطبيق ويب", "frontend"]
    },
    {
        "id": "p3",
        "title": "دورة الذكاء الاصطناعي",
        "price": "$100",
        "description": "تعلم AI وتعلم الآلة",
        "duration": "25 ساعة",
        "lessons": 60,
        "rating": 4.9,
        "keywords": ["ذكاء اصطناعي", "ai", "تعلم آلي", "machine learning"]
    },
    {
        "id": "p4",
        "title": "دورة UI/UX Design",
        "price": "$60",
        "description": "تصميم واجهات مستخدم احترافية",
        "duration": "18 ساعة",
        "lessons": 45,
        "rating": 4.7,
        "keywords": ["تصميم", "ui", "ux", "واجهة", "design"]
    }
]

# Sessions Storage
sessions = {}

# ═══════════════════════════════════════════════════════════════════════════════
# Models
# ═══════════════════════════════════════════════════════════════════════════════
class ChatMessage(BaseModel):
    message: str
    sessionId: Optional[str] = None
    history: Optional[List[dict]] = []

# ═══════════════════════════════════════════════════════════════════════════════
# Helper Functions
# ═══════════════════════════════════════════════════════════════════════════════
async def send_telegram_alert(message: str):
    """إرسال تنبيه عبر تلغرام"""
    if not TELEGRAM_TOKEN or not ADMIN_CHAT_ID:
        return
    
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {
        "chat_id": ADMIN_CHAT_ID,
        "text": f"🚀 **تنبيه من رائد نيوم:**\n\n{message}",
        "parse_mode": "Markdown"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, json=payload)
        except Exception as e:
            print(f"Telegram error: {e}")

def detect_course_interest(text: str) -> Optional[dict]:
    """كشف اهتمام المستخدم بدورة معينة"""
    text_lower = text.lower()
    
    for course in COURSES:
        for keyword in course["keywords"]:
            if keyword in text_lower:
                return course
    return None

# ═══════════════════════════════════════════════════════════════════════════════
# REST API Endpoints
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "رائد نيوم Backend",
        "version": "3.0.0",
        "openai_configured": bool(OPENAI_API_KEY)
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "openai_configured": bool(OPENAI_API_KEY),
        "telegram_configured": bool(TELEGRAM_TOKEN and ADMIN_CHAT_ID)
    }

@app.get("/courses")
async def get_courses():
    """الحصول على جميع الدورات"""
    return {"success": True, "courses": COURSES}

@app.get("/api/analytics")
async def get_analytics():
    """إحصائيات لوحة التحكم"""
    return {
        "revenue": 1500,
        "conversion_rate": "12%",
        "top_course": "Python AI",
        "total_students": 234,
        "active_sessions": len(sessions)
    }

@app.post("/chat")
async def chat_endpoint(data: ChatMessage):
    """محادثة نصية"""
    # هنا يمكن إضافة منطق LangChain أو OpenAI
    response_text = "أهلاً! أنا رائد، كيف يمكنني مساعدتك؟"
    
    # كشف الدورات
    course = detect_course_interest(data.message)
    if course:
        response_text += f"\n\nلدينا {course['title']} بسعر {course['price']}! 🎓"
    
    return {
        "success": True,
        "response": response_text,
        "session_id": data.sessionId or f"session_{os.urandom(4).hex()}",
        "recommended_course": course
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
        print(f"🔌 Connecting to OpenAI Realtime...")
        
        async with websockets.connect(
            OPENAI_WS_URL,
            extra_headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "OpenAI-Beta": "realtime=v1"
            }
        ) as openai_ws:
            print("✅ Connected to OpenAI")
            
            # إعداد الجلسة
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

            # إرسال رسالة ترحيب
            await websocket.send_json({
                "event": "connected",
                "session_id": session_id
            })
            
            # إرسال رسالة ترحيبية نصية
            await websocket.send_json({
                "event": "welcome_message",
                "payload": {
                    "text": "مرحباً بك! أنا رائد، معلمك الذكي ومستشارك. كيف يمكنني مساعدتك في تطوير مهاراتك اليوم؟",
                    "autoPlayAudio": True
                }
            })

            async def from_client():
                """استقبال من العميل وإرسال لـ OpenAI"""
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
                """استقبال من OpenAI وإرسال للعميل"""
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
                            
                            # كشف اهتمام بالدورات
                            course = detect_course_interest(text)
                            if course:
                                await websocket.send_json({
                                    "event": "product",
                                    "data": course
                                })
                                await send_telegram_alert(f"💰 اهتمام بالدورة: {course['title']}")
                        
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

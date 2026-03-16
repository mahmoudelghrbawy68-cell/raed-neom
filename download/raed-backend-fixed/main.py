# ═══════════════════════════════════════════════════════════════════════════════
# رائد نيوم - AI Edu-Commerce Engine (Fixed Version)
# ═══════════════════════════════════════════════════════════════════════════════

import os
import json
import asyncio
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="AI Edu-Commerce Engine")

# CORS للسماح بالاتصال من الواجهة الأمامية
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════════════
# System Prompt
# ═══════════════════════════════════════════════════════════════════════════════
SYSTEM_PROMPT = """
أنت 'رائد'، وكيل تعليمي وتجاري. 
- هدفك: تبسيط العلوم وبيع الدورات التدريبية بذكاء.
- إذا لمسنا اهتماماً بالبرمجة، اعرض 'دورة بايثون' (50$) وأرسل إشارة: {"type": "show_product", "id": "p1"}.
- تحدث بنبرة ودودة وقصيرة الجمل لأنك "متحدث".
- مرحباً بك! أنا رائد، معلمك الذكي ومستشارك. كيف يمكنني مساعدتك في تطوير مهاراتك اليوم؟
"""

# ═══════════════════════════════════════════════════════════════════════════════
# OpenAI Realtime API
# ═══════════════════════════════════════════════════════════════════════════════
OPENAI_WS_URL = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# ═══════════════════════════════════════════════════════════════════════════════
# Models
# ═══════════════════════════════════════════════════════════════════════════════
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[List[Message]] = None

class Product(BaseModel):
    id: str
    title: str
    price: str
    description: str

# ═══════════════════════════════════════════════════════════════════════════════
# Sessions Storage
# ═══════════════════════════════════════════════════════════════════════════════
sessions = {}

def get_session(session_id: str):
    if session_id not in sessions:
        sessions[session_id] = {
            "created_at": datetime.now(),
            "messages": []
        }
    return sessions[session_id]

# ═══════════════════════════════════════════════════════════════════════════════
# Products
# ═══════════════════════════════════════════════════════════════════════════════
PRODUCTS = [
    {
        "id": "p1",
        "title": "دورة بايثون الاحترافية",
        "price": "$50",
        "description": "تعلم بايثون من الصفر إلى الاحتراف",
        "duration": "30 ساعة",
        "lessons": 50,
        "rating": 4.9
    },
    {
        "id": "p2",
        "title": "دورة الذكاء الاصطناعي",
        "price": "$75",
        "description": "بناء تطبيقات الذكاء الاصطناعي",
        "duration": "40 ساعة",
        "lessons": 60,
        "rating": 4.8
    },
    {
        "id": "p3",
        "title": "دورة تطوير الويب",
        "price": "$60",
        "description": "تطوير مواقع ويب حديثة",
        "duration": "35 ساعة",
        "lessons": 45,
        "rating": 4.7
    }
]

# ═══════════════════════════════════════════════════════════════════════════════
# Health Check
# ═══════════════════════════════════════════════════════════════════════════════
@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# ═══════════════════════════════════════════════════════════════════════════════
# Analytics API
# ═══════════════════════════════════════════════════════════════════════════════
@app.get("/api/analytics")
async def get_stats():
    return {
        "revenue": 1500,
        "conversion_rate": "12%",
        "top_course": "Python AI",
        "total_sessions": len(sessions)
    }

# ═══════════════════════════════════════════════════════════════════════════════
# Products API
# ═══════════════════════════════════════════════════════════════════════════════
@app.get("/api/products")
async def get_products():
    return {"courses": PRODUCTS}

@app.post("/api/products/detect")
async def detect_products(request: ChatRequest):
    """كشف المنتجات المناسبة بناءً على رسالة المستخدم"""
    message = request.message.lower()
    detected = []
    
    # كشف الاهتمام بالبرمجة
    if any(word in message for word in ['برمجة', 'كود', 'بايثون', 'python', 'برنامج']):
        detected.append(PRODUCTS[0])
    
    # كشف الاهتمام بالذكاء الاصطناعي
    if any(word in message for word in ['ذكاء اصطناعي', 'ai', 'تعلم آلي', 'machine learning']):
        detected.append(PRODUCTS[1])
    
    # كشف الاهتمام بتطوير الويب
    if any(word in message for word in ['ويب', 'web', 'موقع', 'تطوير']):
        detected.append(PRODUCTS[2])
    
    # كشف طلب الدورات بشكل عام
    if any(word in message for word in ['دورة', 'كورس', 'تعلم', 'دورات']):
        detected = PRODUCTS
    
    return {"courses": detected}

# ═══════════════════════════════════════════════════════════════════════════════
# WebSocket for Realtime Voice AI
# ═══════════════════════════════════════════════════════════════════════════════
@app.websocket("/media-stream")
async def handle_ai_voice(websocket: WebSocket):
    await websocket.accept()
    session_id = f"session_{datetime.now().timestamp()}"
    
    print(f"🎤 New WebSocket connection: {session_id}")
    
    # إرسال رسالة الترحيب
    await send_welcome_message(websocket, session_id)
    
    # الاتصال بـ OpenAI Realtime API
    if OPENAI_API_KEY:
        try:
            await handle_openai_realtime(websocket, session_id)
        except Exception as e:
            print(f"❌ OpenAI connection error: {e}")
            await websocket.close()
    else:
        # وضع التجربة بدون OpenAI
        await handle_demo_mode(websocket, session_id)

async def send_welcome_message(websocket: WebSocket, session_id: str):
    """إرسال رسالة الترحيب"""
    welcome_data = {
        "event": "welcome_message",
        "session_id": session_id,
        "payload": {
            "text": "مرحباً بك! أنا رائد، معلمك الذكي ومستشارك. كيف يمكنني مساعدتك في تطوير مهاراتك اليوم؟",
            "autoPlayAudio": False  # ❌ لا يمكن تشغيل الصوت تلقائياً
        }
    }
    await websocket.send_json(welcome_data)
    
    # إرسال إشارة الاتصال
    await websocket.send_json({
        "event": "connected",
        "session_id": session_id
    })

async def handle_openai_realtime(websocket: WebSocket, session_id: str):
    """التعامل مع OpenAI Realtime API"""
    
    async with websockets.connect(
        OPENAI_WS_URL,
        extra_headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "OpenAI-Beta": "realtime=v1"
        }
    ) as openai_ws:
        
        # تهيئة الجلسة
        await openai_ws.send(json.dumps({
            "type": "session.update",
            "session": {
                "instructions": SYSTEM_PROMPT,
                "voice": "alloy",
                "input_audio_format": "g711_ulaw",
                "output_audio_format": "g711_ulaw"
            }
        }))

        async def from_client():
            """استقبال البيانات من العميل"""
            try:
                while True:
                    data = await websocket.receive_text()
                    msg = json.loads(data)
                    
                    if msg.get('event') == 'media':
                        # إرسال الصوت إلى OpenAI
                        await openai_ws.send(json.dumps({
                            "type": "input_audio_buffer.append",
                            "audio": msg.get('payload')
                        }))
                    
                    elif msg.get('event') == 'start':
                        # بدء التسجيل
                        await openai_ws.send(json.dumps({
                            "type": "input_audio_buffer.clear"
                        }))
                    
                    elif msg.get('event') == 'stop':
                        # إيقاف التسجيل ومعالجة الصوت
                        await openai_ws.send(json.dumps({
                            "type": "input_audio_buffer.commit"
                        }))
                        await openai_ws.send(json.dumps({
                            "type": "response.create"
                        }))
                        
            except WebSocketDisconnect:
                print(f"🔌 Client disconnected: {session_id}")
            except Exception as e:
                print(f"❌ Error from client: {e}")

        async def to_client():
            """إرسال البيانات إلى العميل"""
            try:
                async for msg in openai_ws:
                    resp = json.loads(msg)
                    resp_type = resp.get("type")
                    
                    # إرسال الصوت
                    if resp_type == "response.audio.delta":
                        await websocket.send_json({
                            "event": "audio",
                            "payload": resp.get("delta")
                        })
                    
                    # إرسال النص
                    elif resp_type == "response.text.delta":
                        await websocket.send_json({
                            "event": "text",
                            "content": resp.get("delta")
                        })
                    
                    # إرسال النص المستخرج من الصوت
                    elif resp_type == "conversation.item.input_audio_transcription.completed":
                        await websocket.send_json({
                            "event": "transcript",
                            "content": resp.get("transcript")
                        })
                    
                    # انتهاء الاستجابة
                    elif resp_type == "response.done":
                        await websocket.send_json({
                            "event": "response_done"
                        })
                        
            except Exception as e:
                print(f"❌ Error to client: {e}")

        await asyncio.gather(from_client(), to_client())

async def handle_demo_mode(websocket: WebSocket, session_id: str):
    """وضع التجربة بدون OpenAI API"""
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            if msg.get('event') == 'start':
                await websocket.send_json({
                    "event": "transcript",
                    "content": "مرحبا"
                })
            
            elif msg.get('event') == 'stop':
                # محاكاة رد
                await websocket.send_json({
                    "event": "text",
                    "content": "أهلاً بك! كيف يمكنني مساعدتك اليوم؟"
                })
                await websocket.send_json({
                    "event": "response_done"
                })
                
    except WebSocketDisconnect:
        print(f"🔌 Demo client disconnected: {session_id}")

# ═══════════════════════════════════════════════════════════════════════════════
# Chat HTTP API (Fallback)
# ═══════════════════════════════════════════════════════════════════════════════
@app.post("/chat")
async def chat(request: ChatRequest):
    """محادثة عبر HTTP"""
    session = get_session(request.session_id or f"chat_{datetime.now().timestamp()}")
    
    # إضافة الرسالة للجلسة
    session["messages"].append({
        "role": "user",
        "content": request.message
    })
    
    # رد تجريبي
    response = "شكراً لرسالتك! أنا رائد، مساعدك الذكي. كيف يمكنني مساعدتك؟"
    
    return {
        "success": True,
        "response": response,
        "session_id": request.session_id
    }

# ═══════════════════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

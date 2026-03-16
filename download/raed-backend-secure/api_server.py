# api_server.py - FastAPI Server مع LangChain AI Engine
# ═══════════════════════════════════════════════════════════════════════════════

import logging
from typing import Optional
from fastapi import FastAPI, WebSocket, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from datetime import datetime
import time

from ai_engine import SuperAIApp, PromptSecurity

# ═══════════════════════════════════════════════════════════════════════════════
# إعداد التسجيل
# ═══════════════════════════════════════════════════════════════════════════════

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════════════════
# إعداد FastAPI
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="🚀 Raed Neom Super AI API",
    description="واجهة برمجية متقدمة مع دعم الأدوار المتعددة",
    version="3.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # قيّد هذا في الإنتاج
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════════════════════
# تهيئة المحرك
# ═══════════════════════════════════════════════════════════════════════════════

ai_engine = SuperAIApp(
    model="gpt-4o-mini",
    temperature=0.8,
    max_tokens=1500
)


# ═══════════════════════════════════════════════════════════════════════════════
# Rate Limiting
# ═══════════════════════════════════════════════════════════════════════════════

class RateLimiter:
    def __init__(self, max_requests: int = 30, window: int = 60):
        self.max_requests = max_requests
        self.window = window
        self.requests = {}
    
    def is_allowed(self, ip: str) -> bool:
        now = time.time()
        if ip not in self.requests:
            self.requests[ip] = []
        
        # تنظيف الطلبات القديمة
        self.requests[ip] = [t for t in self.requests[ip] if now - t < self.window]
        
        if len(self.requests[ip]) >= self.max_requests:
            return False
        
        self.requests[ip].append(now)
        return True

rate_limiter = RateLimiter()


# ═══════════════════════════════════════════════════════════════════════════════
# النماذج
# ═══════════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    user_id: str = Field(..., description="معرف المستخدم")
    prompt: str = Field(..., min_length=1, max_length=4000)
    context: str = Field(default="general_assistant", description="customer_service, tech_assistant, ai_tutor, general_assistant")
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    response: str
    warning: Optional[str] = None
    context: str
    message_count: int
    session_id: str

class ContextInfo(BaseModel):
    contexts: list
    descriptions: dict


# ═══════════════════════════════════════════════════════════════════════════════
# Middleware
# ═══════════════════════════════════════════════════════════════════════════════

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    
    # Rate limiting
    if not rate_limiter.is_allowed(client_ip):
        return JSONResponse(
            status_code=429,
            content={
                "success": False,
                "error": "تم تجاوز عدد الطلبات المسموح",
                "retry_after": 60
            }
        )
    
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    return response


# ═══════════════════════════════════════════════════════════════════════════════
# نقاط النهاية
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    """الصفحة الرئيسية"""
    return {
        "name": "🚀 Raed Neom Super AI",
        "version": "3.0.0",
        "contexts": ai_engine.get_available_contexts()
    }


@app.get("/health")
def health_check():
    """فحص الصحة"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "contexts_available": len(ai_engine.get_available_contexts())
    }


@app.get("/contexts", response_model=ContextInfo)
def get_contexts():
    """الحصول على الأدوار المتاحة"""
    return ContextInfo(
        contexts=ai_engine.get_available_contexts(),
        descriptions={
            "customer_service": "خدمة العملاء - للرد على الاستفسارات",
            "tech_assistant": "مساعد تقني - للمساعدة البرمجية",
            "ai_tutor": "معلم AI - لتعليم الذكاء الاصطناعي",
            "general_assistant": "مساعد عام - للأسئلة العامة"
        }
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, req: Request):
    """
    نقطة نهاية المحادثة الرئيسية
    
    - **user_id**: معرف المستخدم الفريد
    - **prompt**: سؤال المستخدم
    - **context**: دور المساعد (customer_service, tech_assistant, ai_tutor, general_assistant)
    """
    client_ip = req.client.host if req.client else "unknown"
    
    # التحقق من السياق
    if request.context not in ai_engine.get_available_contexts():
        raise HTTPException(
            status_code=400,
            detail=f"سياق غير صالح. المتاح: {ai_engine.get_available_contexts()}"
        )
    
    # إنشاء session_id إذا لم يكن موجوداً
    session_id = request.session_id or request.user_id
    
    try:
        # توليد الرد
        result = await ai_engine.generate_response(
            user_id=request.user_id,
            user_input=request.prompt,
            context=request.context,
            include_history=True
        )
        
        logger.info(f"✅ Chat: user={request.user_id}, context={request.context}, ip={client_ip}")
        
        return ChatResponse(
            success=True,
            response=result['response'],
            warning=result.get('warning'),
            context=result['context'],
            message_count=result['message_count'],
            session_id=session_id
        )
        
    except Exception as e:
        logger.error(f"❌ Chat error: {e}")
        raise HTTPException(status_code=500, detail="حدث خطأ داخلي")


@app.delete("/session/{user_id}")
def clear_session(user_id: str):
    """مسح جلسة مستخدم"""
    ai_engine.clear_session(user_id)
    return {"success": True, "message": f"تم مسح جلسة {user_id}"}


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket للمحادثة المباشرة
    
    تنسيق الرسالة: {"prompt": "السؤال", "context": "tech_assistant"}
    """
    await websocket.accept()
    client_ip = websocket.client.host if websocket.client else "unknown"
    
    logger.info(f"🔌 WebSocket connected: user={user_id}, ip={client_ip}")
    
    try:
        while True:
            # استقبال البيانات
            data = await websocket.receive_text()
            
            # تحليل البيانات
            import json
            try:
                msg = json.loads(data)
                prompt = msg.get("prompt", "")
                context = msg.get("context", "general_assistant")
            except:
                prompt = data
                context = "general_assistant"
            
            # توليد الرد
            result = await ai_engine.generate_response(
                user_id=user_id,
                user_input=prompt,
                context=context
            )
            
            # إرسال الرد
            import json
            await websocket.send_text(json.dumps({
                "response": result['response'],
                "warning": result.get('warning'),
                "context": result['context'],
                "message_count": result['message_count']
            }, ensure_ascii=False))
            
    except Exception as e:
        logger.error(f"❌ WebSocket error: {e}")
        await websocket.close()


# ═══════════════════════════════════════════════════════════════════════════════
# تشغيل الخادم
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║         🚀 Raed Neom Super AI API v3.0.0                  ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  الأدوار المتاحة:                                         ║
    ║  • customer_service - خدمة العملاء                        ║
    ║  • tech_assistant - المساعد التقني                        ║
    ║  • ai_tutor - معلم الذكاء الاصطناعي                       ║
    ║  • general_assistant - المساعد العام                      ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    uvicorn.run(app, host="0.0.0.0", port=8000)

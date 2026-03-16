"""
═══════════════════════════════════════════════════════════════════════════════
                    رائد نيوم - Backend for Render
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Optional, Dict, Any

import httpx
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | %(message)s')
logger = logging.getLogger("raed-neom")

# Config
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
PORT = int(os.getenv("PORT", "8000"))

# System Prompt
SYSTEM_PROMPT = """أنت "رائد نيوم" - مساعد ذكي متطور.

🎯 الهوية:
- الاسم: رائد نيوم (Raed Neom)
- الدور: معلم ذكي، مرشد، مساعد صوتي

🧠 القدرات:
1. التعليم والتدريس
2. البرمجة والتقنية
3. التطوير الشخصي
4. الإبداع والتحليل

🎭 أسلوب التواصل:
- ودود ومحفز
- يستخدم الأمثلة والتشبيهات
- يقدم الحلول خطوة بخطوة
- بالعربية الفصحى البسيطة"""

# App
app = FastAPI(title="رائد نيوم", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[list] = []

# Routes
@app.get("/")
async def root():
    return {
        "status": "running",
        "version": "2.0.0",
        "service": "raed-neom-backend",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint using OpenAI"""
    if not OPENAI_API_KEY:
        return JSONResponse({
            "success": False,
            "error": "OpenAI API key not configured"
        }, status_code=500)
    
    try:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            *[{"role": m.get("role", "user"), "content": m.get("content", "")} 
              for m in (request.history or [])[-10:]],
            {"role": "user", "content": request.message}
        ]
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": messages,
                    "max_tokens": 1000,
                    "temperature": 0.7
                },
                timeout=30
            )
            
            data = response.json()
            ai_response = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            return {
                "success": True,
                "response": ai_response,
                "session_id": request.session_id or f"chat_{datetime.now().timestamp()}"
            }
            
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return JSONResponse({
            "success": False,
            "error": str(e)
        }, status_code=500)

# WebSocket for streaming
@app.websocket("/ws")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_json()
            message = data.get("message", "")
            
            if not message:
                continue
            
            if OPENAI_API_KEY:
                try:
                    async with httpx.AsyncClient() as client:
                        response = await client.post(
                            "https://api.openai.com/v1/chat/completions",
                            headers={
                                "Authorization": f"Bearer {OPENAI_API_KEY}",
                                "Content-Type": "application/json"
                            },
                            json={
                                "model": "gpt-4o-mini",
                                "messages": [
                                    {"role": "system", "content": SYSTEM_PROMPT},
                                    {"role": "user", "content": message}
                                ],
                                "max_tokens": 1000
                            },
                            timeout=30
                        )
                        
                        result = response.json()
                        ai_response = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                        
                        await websocket.send_json({
                            "event": "response",
                            "content": ai_response
                        })
                except Exception as e:
                    await websocket.send_json({
                        "event": "error",
                        "message": str(e)
                    })
            else:
                await websocket.send_json({
                    "event": "response",
                    "content": f"مرحباً! أنا رائد. رسالتك: {message}"
                })
                
    except WebSocketDisconnect:
        logger.info("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)

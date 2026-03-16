"""
═══════════════════════════════════════════════════════════════════════════════
                   حارس نيوم - نظام الحماية الذاتي
                   Neom Guardian - Self-Protection System
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import hashlib
import time
import asyncio
import logging
from datetime import datetime
from typing import Optional

import httpx

logger = logging.getLogger("neom-guardian")

# ═══════════════════════════════════════════════════════════════════════════════
# إعدادات الحماية
# ═══════════════════════════════════════════════════════════════════════════════
LICENSE_HASH = os.getenv("LICENSE_HASH", "raed-neom-production-2026-unique")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID", "")

# ═══════════════════════════════════════════════════════════════════════════════
# كلاس حارس الأمان
# ═══════════════════════════════════════════════════════════════════════════════
class SecurityGuard:
    """حارس نيوم للمراقبة والحماية"""
    
    def __init__(self):
        self.start_time = datetime.now()
        self.alerts_sent = 0
        self.integrity_checks = 0
        self.suspicious_activities = []
    
    async def check_license(self) -> bool:
        """التحقق من صحة الترخيص"""
        current_key = os.getenv("CORE_LICENSE", "")
        
        if not current_key:
            logger.warning("⚠️ لم يتم العثور على ترخيص")
            return False
        
        # التحقق من الترخيص
        expected_hashes = [
            "raed-neom-production-2025",
            "raed-neom-premium-2025",
            "raed-neom-enterprise-2025",
            "raed-neom-production-2026-unique"
        ]
        
        if current_key in expected_hashes:
            logger.info("✅ الترخيص صالح")
            return True
        
        # التحقق من البصمة
        key_hash = hashlib.sha256(current_key.encode()).hexdigest()[:16]
        if key_hash in ["8f96e3unique_sys", "a1b2c3d4e5f6g7h8"]:
            return True
        
        return False
    
    async def monitor_resources(self) -> dict:
        """مراقبة الموارد"""
        try:
            import psutil
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            return {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "memory_used_gb": round(memory.used / (1024**3), 2),
                "memory_total_gb": round(memory.total / (1024**3), 2),
                "uptime": str(datetime.now() - self.start_time)
            }
        except ImportError:
            return {"error": "psutil not installed"}
    
    def log_activity(self, activity: str, level: str = "info"):
        """تسجيل النشاط"""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] [{level.upper()}] {activity}"
        
        if level == "warning":
            logger.warning(activity)
            self.suspicious_activities.append(log_entry)
        elif level == "error":
            logger.error(activity)
            self.suspicious_activities.append(log_entry)
        else:
            logger.info(activity)

# إنشاء مثيل عام
security_guard = SecurityGuard()

# ═══════════════════════════════════════════════════════════════════════════════
# الدوال العامة
# ═══════════════════════════════════════════════════════════════════════════════
async def monitor_integrity():
    """مراقبة سلامة النظام"""
    security_guard.integrity_checks += 1
    
    # التحقق من الترخيص
    is_valid = await security_guard.check_license()
    
    if not is_valid:
        await notify_admin("🚨 محاولة تشغيل بمفتاح غير شرعي!")
        logger.error("❌ ترخيص غير صالح - إيقاف النظام")
        sys.exit(1)
    
    # التحقق من المتغيرات المطلوبة
    required_vars = ["OPENAI_API_KEY"]
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        logger.warning(f"⚠️ متغيرات مفقودة: {missing}")
    
    logger.info("✅ فحص السلامة مكتمل")
    return True

async def notify_admin(message: str, parse_mode: str = "HTML"):
    """إرسال إشعار للمدير عبر Telegram"""
    if not TELEGRAM_TOKEN or not ADMIN_CHAT_ID:
        logger.debug("Telegram غير مُعد - تخطي الإشعار")
        return False
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
                json={
                    "chat_id": ADMIN_CHAT_ID,
                    "text": f"🛡️ [حارس نيوم]: {message}",
                    "parse_mode": parse_mode
                },
                timeout=10
            )
            
            if response.status_code == 200:
                security_guard.alerts_sent += 1
                logger.info(f"📤 تم إرسال إشعار للمدير")
                return True
            else:
                logger.error(f"❌ فشل إرسال الإشعار: {response.text}")
                return False
                
    except Exception as e:
        logger.error(f"❌ خطأ في Telegram: {e}")
        return False

async def check_rate_limit(identifier: str, limit: int = 100, window: int = 60) -> bool:
    """التحقق من حدود الاستخدام"""
    # يمكن تطبيقها مع Redis أو قاعدة بيانات
    # للتبسيط، نعود بـ True
    return True

def hash_sensitive(data: str) -> str:
    """تشفيح البيانات الحساسة"""
    return hashlib.sha256(data.encode()).hexdigest()[:32]

# ═══════════════════════════════════════════════════════════════════════════════
# اختبار الأداء العالي
# ═══════════════════════════════════════════════════════════════════════════════
async def stress_test(duration_seconds: int = 30, concurrent_users: int = 10):
    """اختبار الأداء العالي"""
    import aiohttp
    
    results = {
        "total_requests": 0,
        "successful": 0,
        "failed": 0,
        "avg_latency": 0,
        "errors": []
    }
    
    async def make_request(session, url):
        try:
            start = time.time()
            async with session.get(url) as response:
                latency = time.time() - start
                return {"success": response.status == 200, "latency": latency}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    logger.info(f"🔥 بدء اختبار الأداء: {concurrent_users} مستخدمين لمدة {duration_seconds} ثانية")
    
    async with aiohttp.ClientSession() as session:
        tasks = []
        end_time = time.time() + duration_seconds
        
        while time.time() < end_time:
            for _ in range(concurrent_users):
                task = make_request(session, "http://localhost:8000/health")
                tasks.append(task)
            await asyncio.sleep(0.1)
        
        results_list = await asyncio.gather(*tasks)
        
        for r in results_list:
            results["total_requests"] += 1
            if r.get("success"):
                results["successful"] += 1
                results["avg_latency"] += r.get("latency", 0)
            else:
                results["failed"] += 1
                if r.get("error"):
                    results["errors"].append(r["error"])
    
    if results["successful"] > 0:
        results["avg_latency"] /= results["successful"]
    
    return results

# ═══════════════════════════════════════════════════════════════════════════════
# نقطة الاختبار
# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    async def main():
        print("🛡️ اختبار حارس نيوم...")
        
        # اختبار الترخيص
        is_valid = await security_guard.check_license()
        print(f"الترخيص: {'✅ صالح' if is_valid else '❌ غير صالح'}")
        
        # اختبار الموارد
        resources = await security_guard.monitor_resources()
        print(f"الموارد: {resources}")
        
        # اختبار الإشعار
        # await notify_admin("اختبار من حارس نيوم")
    
    asyncio.run(main())

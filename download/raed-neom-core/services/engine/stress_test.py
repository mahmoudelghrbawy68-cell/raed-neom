#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
                  رائد نيوم - اختبار الأداء العالي
                  Raed Neom - Stress Test Suite
═══════════════════════════════════════════════════════════════════════════════
"""

import asyncio
import time
import statistics
from datetime import datetime
from typing import List, Dict, Any

try:
    import aiohttp
    import websockets
except ImportError:
    print("❌ يرجى تثبيت: pip install aiohttp websockets")
    exit(1)

# ═══════════════════════════════════════════════════════════════════════════════
# إعدادات الاختبار
# ═══════════════════════════════════════════════════════════════════════════════
BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000"

class StressTestRunner:
    """مشغل اختبارات الأداء"""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.results: List[Dict[str, Any]] = []
        self.start_time: float = 0
    
    async def test_health_endpoint(self, iterations: int = 100) -> Dict:
        """اختبار نقطة الصحة"""
        latencies = []
        errors = 0
        
        async with aiohttp.ClientSession() as session:
            for i in range(iterations):
                try:
                    start = time.time()
                    async with session.get(f"{self.base_url}/health") as response:
                        latency = (time.time() - start) * 1000
                        if response.status == 200:
                            latencies.append(latency)
                        else:
                            errors += 1
                except Exception as e:
                    errors += 1
                    print(f"❌ خطأ: {e}")
        
        return {
            "test": "health_endpoint",
            "iterations": iterations,
            "successful": len(latencies),
            "errors": errors,
            "avg_latency_ms": statistics.mean(latencies) if latencies else 0,
            "min_latency_ms": min(latencies) if latencies else 0,
            "max_latency_ms": max(latencies) if latencies else 0,
            "p95_latency_ms": statistics.quantiles(latencies, n=20)[18] if len(latencies) > 20 else 0
        }
    
    async def test_concurrent_requests(self, concurrent_users: int = 50, duration: int = 30) -> Dict:
        """اختبار الطلبات المتزامنة"""
        total_requests = 0
        successful = 0
        failed = 0
        latencies = []
        
        async def make_request(session):
            nonlocal total_requests, successful, failed, latencies
            try:
                start = time.time()
                async with session.get(f"{self.base_url}/health") as response:
                    latency = (time.time() - start) * 1000
                    total_requests += 1
                    if response.status == 200:
                        successful += 1
                        latencies.append(latency)
                    else:
                        failed += 1
            except:
                total_requests += 1
                failed += 1
        
        async with aiohttp.ClientSession() as session:
            end_time = time.time() + duration
            tasks = []
            
            while time.time() < end_time:
                for _ in range(concurrent_users):
                    tasks.append(make_request(session))
                
                if len(tasks) >= 1000:
                    await asyncio.gather(*tasks)
                    tasks = []
                
                await asyncio.sleep(0.05)
            
            if tasks:
                await asyncio.gather(*tasks)
        
        return {
            "test": "concurrent_requests",
            "duration_seconds": duration,
            "concurrent_users": concurrent_users,
            "total_requests": total_requests,
            "successful": successful,
            "failed": failed,
            "requests_per_second": total_requests / duration,
            "avg_latency_ms": statistics.mean(latencies) if latencies else 0
        }
    
    async def test_websocket_connection(self, connections: int = 10, duration: int = 10) -> Dict:
        """اختبار اتصالات WebSocket"""
        successful_connections = 0
        failed_connections = 0
        messages_received = 0
        
        async def connect_and_listen():
            nonlocal successful_connections, failed_connections, messages_received
            try:
                async with websockets.connect(f"{WS_URL}/ws") as ws:
                    successful_connections += 1
                    # إرسال رسالة
                    await ws.send('{"message": "test"}')
                    # انتظار الرد
                    response = await asyncio.wait_for(ws.recv(), timeout=5)
                    messages_received += 1
            except Exception as e:
                failed_connections += 1
                print(f"❌ خطأ WebSocket: {e}")
        
        tasks = [connect_and_listen() for _ in range(connections)]
        await asyncio.gather(*tasks)
        
        return {
            "test": "websocket_connections",
            "attempted_connections": connections,
            "successful_connections": successful_connections,
            "failed_connections": failed_connections,
            "messages_received": messages_received
        }
    
    async def run_all_tests(self):
        """تشغيل جميع الاختبارات"""
        print("🔥 بدء اختبارات الأداء...")
        print("=" * 50)
        
        self.start_time = time.time()
        
        # اختبار 1: نقطة الصحة
        print("\n📊 اختبار نقطة الصحة (100 طلب)...")
        result1 = await self.test_health_endpoint(100)
        self.results.append(result1)
        self._print_result(result1)
        
        # اختبار 2: الطلبات المتزامنة
        print("\n📊 اختبار الطلبات المتزامنة (50 مستخدم، 30 ثانية)...")
        result2 = await self.test_concurrent_requests(50, 30)
        self.results.append(result2)
        self._print_result(result2)
        
        # اختبار 3: WebSocket
        print("\n📊 اختبار WebSocket (10 اتصالات)...")
        result3 = await self.test_websocket_connection(10)
        self.results.append(result3)
        self._print_result(result3)
        
        total_time = time.time() - self.start_time
        
        # التقرير النهائي
        print("\n" + "=" * 50)
        print("📋 التقرير النهائي:")
        print("=" * 50)
        print(f"⏱️ إجمالي الوقت: {total_time:.2f} ثانية")
        
        for r in self.results:
            print(f"\n• {r['test']}:")
            for k, v in r.items():
                if k != 'test':
                    print(f"  - {k}: {v}")
        
        return self.results
    
    def _print_result(self, result: Dict):
        """طباعة نتيجة"""
        print(f"✅ نجح: {result.get('successful', result.get('successful_connections', 'N/A'))}")
        print(f"❌ فشل: {result.get('failed', result.get('failed_connections', 'N/A'))}")
        if 'avg_latency_ms' in result:
            print(f"⏱️ متوسط زمن الاستجابة: {result['avg_latency_ms']:.2f}ms")

# ═══════════════════════════════════════════════════════════════════════════════
# نقطة التشغيل
# ═══════════════════════════════════════════════════════════════════════════════
async def main():
    runner = StressTestRunner()
    await runner.run_all_tests()

if __name__ == "__main__":
    print("""
╔═══════════════════════════════════════════════════════════════╗
║           🔥 رائد نيوم - اختبار الأداء العالي 🔥               ║
╚═══════════════════════════════════════════════════════════════╝
    """)
    
    asyncio.run(main())

# ═══════════════════════════════════════════════════════════════════════════════
# advanced_platform.py - منصة تعليمية متقدمة مع إدارة الدورات
# ═══════════════════════════════════════════════════════════════════════════════

import logging
import asyncio
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# إعداد التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════════════════
# التعدادات والنماذج
# ═══════════════════════════════════════════════════════════════════════════════

class CategoryEnum(str, Enum):
    SUPPORT = "support"
    LEARNING = "learning"
    TECH = "tech"


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class UserQuery(BaseModel):
    user_id: str = Field(..., description="معرف المستخدم")
    message: str = Field(..., min_length=1, max_length=4000)
    category: CategoryEnum = Field(default=CategoryEnum.SUPPORT)


class Course(BaseModel):
    id: str
    title: str
    description: str
    field: str
    difficulty: DifficultyLevel
    duration_hours: int
    lessons_count: int
    price: float
    rating: float = Field(default=0.0, ge=0, le=5)
    enrolled_count: int = 0


class Lesson(BaseModel):
    id: str
    title: str
    content: str
    duration_minutes: int
    order: int
    completed: bool = False


class Enrollment(BaseModel):
    user_id: str
    course_id: str
    enrolled_at: datetime
    progress: float = 0.0
    completed_lessons: List[str] = []


class AnalyticsEvent(BaseModel):
    event_type: str
    user_id: str
    data: dict
    timestamp: datetime = Field(default_factory=datetime.now)


# ═══════════════════════════════════════════════════════════════════════════════
# مدير الدورات
# ═══════════════════════════════════════════════════════════════════════════════

class CourseManager:
    """إدارة شاملة للدورات التعليمية"""
    
    def __init__(self):
        self.courses: Dict[str, Course] = {}
        self.lessons: Dict[str, List[Lesson]] = {}
        self.enrollments: Dict[str, List[Enrollment]] = {}
        self._initialize_courses()
    
    def _initialize_courses(self):
        """تهيئة الدورات الافتراضية"""
        
        # دورات Python
        self.add_course(Course(
            id="python_basics",
            title="أساسيات البرمجة بلغة Python",
            description="تعلم Python من الصفر مع مشاريع عملية",
            field="programming",
            difficulty=DifficultyLevel.BEGINNER,
            duration_hours=15,
            lessons_count=20,
            price=199.0,
            rating=4.8,
            enrolled_count=1250
        ))
        
        self.add_course(Course(
            id="python_advanced",
            title="Python المتقدم - OOP & Data Science",
            description="برمجة كائنية التوجه وتحليل البيانات",
            field="programming",
            difficulty=DifficultyLevel.ADVANCED,
            duration_hours=25,
            lessons_count=35,
            price=349.0,
            rating=4.9,
            enrolled_count=890
        ))
        
        # دورات الويب
        self.add_course(Course(
            id="react_basics",
            title="تطوير تطبيقات الويب بـ React",
            description="بناء تطبيقات ويب حديثة مع React و Next.js",
            field="web_development",
            difficulty=DifficultyLevel.INTERMEDIATE,
            duration_hours=20,
            lessons_count=28,
            price=299.0,
            rating=4.7,
            enrolled_count=1450
        ))
        
        # دورات AI
        self.add_course(Course(
            id="ai_fundamentals",
            title="أساسيات الذكاء الاصطناعي",
            description="مقدمة شاملة في AI و Machine Learning",
            field="artificial_intelligence",
            difficulty=DifficultyLevel.BEGINNER,
            duration_hours=18,
            lessons_count=24,
            price=249.0,
            rating=4.9,
            enrolled_count=2100
        ))
        
        self.add_course(Course(
            id="deep_learning",
            title="التعلم العميق - Deep Learning",
            description="شبكات عصبية متقدمة و TensorFlow",
            field="artificial_intelligence",
            difficulty=DifficultyLevel.ADVANCED,
            duration_hours=30,
            lessons_count=40,
            price=449.0,
            rating=4.8,
            enrolled_count=650
        ))
        
        # دورات التصميم
        self.add_course(Course(
            id="ui_ux_design",
            title="تصميم واجهات المستخدم UI/UX",
            description="تصميم تجارب مستخدم احترافية مع Figma",
            field="design",
            difficulty=DifficultyLevel.BEGINNER,
            duration_hours=18,
            lessons_count=22,
            price=249.0,
            rating=4.6,
            enrolled_count=980
        ))
        
        # إضافة دروس لكل دورة
        self._initialize_lessons()
    
    def _initialize_lessons(self):
        """إضافة دروس افتراضية"""
        
        # دروس Python
        self.lessons["python_basics"] = [
            Lesson(id="py_01", title="مقدمة في Python", content="ما هي Python ولماذا نتعلمها؟", duration_minutes=30, order=1),
            Lesson(id="py_02", title="تثبيت Python", content="كيفية تثبيت Python على جهازك", duration_minutes=20, order=2),
            Lesson(id="py_03", title="المتغيرات وأنواع البيانات", content="تعلم المتغيرات والأنواع الأساسية", duration_minutes=45, order=3),
            Lesson(id="py_04", title="الجمل الشرطية", content="if, elif, else", duration_minutes=40, order=4),
            Lesson(id="py_05", title="الحلقات", content="for و while loops", duration_minutes=50, order=5),
        ]
        
        # دروس React
        self.lessons["react_basics"] = [
            Lesson(id="re_01", title="مقدمة في React", content="ما هو React وكيف يعمل؟", duration_minutes=35, order=1),
            Lesson(id="re_02", title="إعداد المشروع", content="create-react-app و Vite", duration_minutes=25, order=2),
            Lesson(id="re_03", title="Components", content="بناء المكونات", duration_minutes=55, order=3),
            Lesson(id="re_04", title="Props و State", content="تمرير البيانات وإدارة الحالة", duration_minutes=60, order=4),
            Lesson(id="re_05", title="Hooks", content="useState و useEffect", duration_minutes=70, order=5),
        ]
        
        # دروس AI
        self.lessons["ai_fundamentals"] = [
            Lesson(id="ai_01", title="ما هو الذكاء الاصطناعي؟", content="مقدمة شاملة", duration_minutes=40, order=1),
            Lesson(id="ai_02", title="أنواع AI", content="Narrow AI vs General AI", duration_minutes=35, order=2),
            Lesson(id="ai_03", title="Machine Learning أساسيات", content="تعلم الآلة من الصفر", duration_minutes=55, order=3),
            Lesson(id="ai_04", title="التعلم بالإشراف", content="Supervised Learning", duration_minutes=60, order=4),
            Lesson(id="ai_05", title="التعلم بدون إشراف", content="Unsupervised Learning", duration_minutes=50, order=5),
        ]
    
    def add_course(self, course: Course):
        """إضافة دورة جديدة"""
        self.courses[course.id] = course
        logger.info(f"📚 Added course: {course.title}")
    
    def get_course(self, course_id: str) -> Optional[Course]:
        """الحصول على دورة بالمعرف"""
        return self.courses.get(course_id)
    
    def get_courses_by_field(self, field: str) -> List[Course]:
        """الحصول على دورات حسب المجال"""
        return [c for c in self.courses.values() if c.field == field]
    
    def get_courses_by_difficulty(self, difficulty: DifficultyLevel) -> List[Course]:
        """الحصول على دورات حسب المستوى"""
        return [c for c in self.courses.values() if c.difficulty == difficulty]
    
    def get_all_courses(self) -> List[Course]:
        """الحصول على جميع الدورات"""
        return list(self.courses.values())
    
    def get_course_curriculum(self, course_id: str) -> List[Lesson]:
        """الحصول على منهج دورة"""
        return self.lessons.get(course_id, [])
    
    def enroll_user(self, user_id: str, course_id: str) -> Enrollment:
        """تسجيل مستخدم في دورة"""
        if course_id not in self.courses:
            raise ValueError("الدورة غير موجودة")
        
        # التحقق من التسجيل المسبق
        if user_id in self.enrollments:
            for e in self.enrollments[user_id]:
                if e.course_id == course_id:
                    return e  # مسجل مسبقاً
        
        enrollment = Enrollment(
            user_id=user_id,
            course_id=course_id,
            enrolled_at=datetime.now()
        )
        
        if user_id not in self.enrollments:
            self.enrollments[user_id] = []
        
        self.enrollments[user_id].append(enrollment)
        
        # تحديث عداد المسجلين
        self.courses[course_id].enrolled_count += 1
        
        logger.info(f"✅ User {user_id} enrolled in {course_id}")
        return enrollment
    
    def update_progress(self, user_id: str, course_id: str, lesson_id: str) -> float:
        """تحديث تقدم المستخدم"""
        if user_id not in self.enrollments:
            return 0.0
        
        for enrollment in self.enrollments[user_id]:
            if enrollment.course_id == course_id:
                if lesson_id not in enrollment.completed_lessons:
                    enrollment.completed_lessons.append(lesson_id)
                
                total_lessons = len(self.lessons.get(course_id, []))
                if total_lessons > 0:
                    enrollment.progress = (len(enrollment.completed_lessons) / total_lessons) * 100
                
                return enrollment.progress
        
        return 0.0
    
    def get_user_enrollments(self, user_id: str) -> List[Enrollment]:
        """الحصول على تسجيلات المستخدم"""
        return self.enrollments.get(user_id, [])


# ═══════════════════════════════════════════════════════════════════════════════
# نظام التحليلات
# ═══════════════════════════════════════════════════════════════════════════════

class AnalyticsManager:
    """نظام تحليلات متقدم"""
    
    def __init__(self):
        self.events: List[AnalyticsEvent] = []
        self.user_stats: Dict[str, dict] = {}
    
    async def log_event(self, event_type: str, user_id: str, data: dict):
        """تسجيل حدث (يعمل في الخلفية)"""
        event = AnalyticsEvent(
            event_type=event_type,
            user_id=user_id,
            data=data
        )
        self.events.append(event)
        
        # تحديث إحصائيات المستخدم
        if user_id not in self.user_stats:
            self.user_stats[user_id] = {
                "total_queries": 0,
                "categories_used": {},
                "last_active": None
            }
        
        self.user_stats[user_id]["total_queries"] += 1
        self.user_stats[user_id]["last_active"] = datetime.now()
        
        if event_type in self.user_stats[user_id]["categories_used"]:
            self.user_stats[user_id]["categories_used"][event_type] += 1
        else:
            self.user_stats[user_id]["categories_used"][event_type] = 1
        
        logger.info(f"📊 Event logged: {event_type} for user {user_id}")
    
    def get_user_stats(self, user_id: str) -> dict:
        """الحصول على إحصائيات المستخدم"""
        return self.user_stats.get(user_id, {})
    
    def get_platform_stats(self) -> dict:
        """الحصول على إحصائيات المنصة"""
        return {
            "total_events": len(self.events),
            "total_users": len(self.user_stats),
            "events_today": len([e for e in self.events 
                               if e.timestamp.date() == datetime.now().date()])
        }


# ═══════════════════════════════════════════════════════════════════════════════
# محرك AI مبسط (يمكن استبداله بالنسخة الكاملة)
# ═══════════════════════════════════════════════════════════════════════════════

class SimpleAIEngine:
    """محرك AI مبسط للردود"""
    
    CONTEXT_RESPONSES = {
        "customer_service": {
            "greeting": "مرحباً بك في رائد نيوم! 🌟 كيف يمكنني مساعدتك؟",
            "courses": "لدينا دورات ممتازة في البرمجة والذكاء الاصطناعي. هل تريد معرفة المزيد؟",
            "pricing": "أسعارنا تبدأ من 199 ريال. الدورات تشمل شهادات معتمدة!",
            "default": "شكراً لتواصلك معنا! كيف يمكنني مساعدتك؟"
        },
        "tech_assistant": {
            "greeting": "أهلاً! أنا المساعد التقني. ما المشكلة التي تواجهها؟",
            "code": "سأساعدك في الكود. أرسل لي الكود المعطوب ورسالة الخطأ.",
            "default": "جاهز لمساعدتك تقنياً! ما سؤالك؟"
        },
        "ai_tutor": {
            "greeting": "مرحباً في درس جديد! 🎓 ما الموضوع الذي نتعلمه اليوم؟",
            "ml": "Machine Learning فرع مثير! هل تريد البدأ من الأساسيات؟",
            "default": "أنا معلمك في الذكاء الاصطناعي. ماذا تريد أن تتعلم؟"
        }
    }
    
    async def generate_response(self, user_id: str, message: str, context: str = "customer_service") -> str:
        """توليد رد ذكي"""
        import random
        
        responses = self.CONTEXT_RESPONSES.get(context, self.CONTEXT_RESPONSES["customer_service"])
        
        # تحديد نوع الرسالة
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["مرحبا", "أهلا", "السلام"]):
            return responses.get("greeting", responses["default"])
        elif any(word in message_lower for word in ["دورة", "دورات", "كورس"]):
            return responses.get("courses", responses["default"])
        elif any(word in message_lower for word in ["سعر", "أسعار", "كم"]):
            return responses.get("pricing", responses["default"])
        elif any(word in message_lower for word in ["كود", "برمجة", "خطأ"]):
            return responses.get("code", responses["default"])
        elif any(word in message_lower for word in ["تعلم", "ذكاء", "machine"]):
            return responses.get("ml", responses["default"])
        
        return responses["default"]


# ═══════════════════════════════════════════════════════════════════════════════
# إنشاء المثيلات
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="🚀 Raed Neom Advanced Edu Platform",
    description="منصة تعليمية متقدمة مع إدارة دورات و AI",
    version="4.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

course_manager = CourseManager()
analytics_manager = AnalyticsManager()
ai_engine = SimpleAIEngine()


# ═══════════════════════════════════════════════════════════════════════════════
# المهام الخلفية
# ═══════════════════════════════════════════════════════════════════════════════

async def log_user_activity(user_id: str, activity_type: str, details: dict):
    """مهمة خلفية لتسجيل النشاط"""
    await analytics_manager.log_event(activity_type, user_id, details)


# ═══════════════════════════════════════════════════════════════════════════════
# نقاط النهاية
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    """الصفحة الرئيسية"""
    return {
        "name": "🚀 Raed Neom Advanced Edu Platform",
        "version": "4.0.0",
        "features": ["multi_agent_ai", "course_management", "analytics", "background_tasks"]
    }


@app.get("/health")
def health_check():
    """فحص الصحة"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "courses_count": len(course_manager.courses),
        "total_enrollments": sum(len(e) for e in course_manager.enrollments.values())
    }


# ═══════════════════════════════════════════════════════════════════════════════
# نقاط نهاية AI
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/ask_ai")
async def handle_request(query: UserQuery, background_tasks: BackgroundTasks):
    """
    نقطة النهاية المركزية للأسئلة.
    تستخدم BackgroundTasks لتسجيل النشاط.
    """
    # خريطة التصنيفات
    context_map = {
        "support": "customer_service",
        "tech": "tech_assistant",
        "learning": "ai_tutor"
    }
    
    role = context_map.get(query.category.value, "customer_service")
    
    # توليد الرد
    response = await ai_engine.generate_response(
        user_id=query.user_id,
        message=query.message,
        context=role
    )
    
    # تسجيل النشاط في الخلفية
    background_tasks.add_task(
        log_user_activity,
        query.user_id,
        f"ai_query_{query.category.value}",
        {"message_length": len(query.message), "role": role}
    )
    
    return {
        "status": "success",
        "agent": role,
        "answer": response,
        "timestamp": datetime.now().isoformat()
    }


# ═══════════════════════════════════════════════════════════════════════════════
# نقاط نهاية الدورات
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/courses")
def list_courses(
    field: Optional[str] = None,
    difficulty: Optional[DifficultyLevel] = None
):
    """عرض جميع الدورات مع إمكانية الفلترة"""
    courses = course_manager.get_all_courses()
    
    if field:
        courses = [c for c in courses if c.field == field]
    if difficulty:
        courses = [c for c in courses if c.difficulty == difficulty]
    
    return {
        "count": len(courses),
        "courses": courses
    }


@app.get("/courses/{course_id}")
def get_course_details(course_id: str):
    """تفاصيل دورة محددة"""
    course = course_manager.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="الدورة غير موجودة")
    
    lessons = course_manager.get_course_curriculum(course_id)
    
    return {
        "course": course,
        "curriculum": lessons
    }


@app.get("/courses/{field}/lessons")
def get_lessons(field: str):
    """الحصول على دروس مجال معين"""
    courses = course_manager.get_courses_by_field(field)
    
    all_lessons = []
    for course in courses:
        lessons = course_manager.get_course_curriculum(course.id)
        all_lessons.extend(lessons)
    
    return {
        "field": field,
        "courses_count": len(courses),
        "lessons": all_lessons
    }


@app.post("/courses/{course_id}/enroll")
def enroll_in_course(course_id: str, user_id: str, background_tasks: BackgroundTasks):
    """التسجيل في دورة"""
    try:
        enrollment = course_manager.enroll_user(user_id, course_id)
        
        # تسجيل في الخلفية
        background_tasks.add_task(
            log_user_activity,
            user_id,
            "course_enrollment",
            {"course_id": course_id}
        )
        
        return {
            "status": "success",
            "message": "تم التسجيل بنجاح",
            "enrollment": enrollment
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/courses/{course_id}/progress")
def update_course_progress(
    course_id: str,
    user_id: str,
    lesson_id: str,
    background_tasks: BackgroundTasks
):
    """تحديث تقدم المستخدم في الدورة"""
    progress = course_manager.update_progress(user_id, course_id, lesson_id)
    
    # تسجيل في الخلفية
    background_tasks.add_task(
        log_user_activity,
        user_id,
        "lesson_completed",
        {"course_id": course_id, "lesson_id": lesson_id, "progress": progress}
    )
    
    return {
        "status": "success",
        "progress": progress,
        "completed": progress >= 100
    }


@app.get("/users/{user_id}/enrollments")
def get_user_enrollments(user_id: str):
    """دورات المستخدم المسجل فيها"""
    enrollments = course_manager.get_user_enrollments(user_id)
    
    result = []
    for e in enrollments:
        course = course_manager.get_course(e.course_id)
        result.append({
            "enrollment": e,
            "course": course
        })
    
    return {
        "user_id": user_id,
        "enrollments_count": len(result),
        "enrollments": result
    }


# ═══════════════════════════════════════════════════════════════════════════════
# نقاط نهاية التحليلات
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/analytics/users/{user_id}")
def get_user_analytics(user_id: str):
    """إحصائيات المستخدم"""
    stats = analytics_manager.get_user_stats(user_id)
    enrollments = course_manager.get_user_enrollments(user_id)
    
    return {
        "user_id": user_id,
        "activity_stats": stats,
        "courses_enrolled": len(enrollments)
    }


@app.get("/analytics/platform")
def get_platform_analytics():
    """إحصائيات المنصة"""
    return analytics_manager.get_platform_stats()


# ═══════════════════════════════════════════════════════════════════════════════
# تشغيل الخادم
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    print("""
    ╔═══════════════════════════════════════════════════════════════╗
    ║      🚀 Raed Neom Advanced Edu Platform v4.0.0               ║
    ╠═══════════════════════════════════════════════════════════════╣
    ║  الميزات:                                                     ║
    ║  • Multi-Agent AI (دعم، تقني، تعليمي)                        ║
    ║  • إدارة الدورات الكاملة                                      ║
    ║  • تتبع التقدم                                                ║
    ║  • تحليلات متقدمة                                             ║
    ║  • Background Tasks                                           ║
    ╚═══════════════════════════════════════════════════════════════╝
    """)
    uvicorn.run(app, host="0.0.0.0", port=8000)

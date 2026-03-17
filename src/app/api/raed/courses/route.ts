// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - نظام إدارة الدورات التعليمية
// جميع الدورات مجانية بالكامل 🎁
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { courses, getCourseById, getLessonById } from '@/lib/courses-content';

// ═══════════════════════════════════════════════════════════════════════════════
// API Handlers
// ═══════════════════════════════════════════════════════════════════════════════

// GET - الحصول على جميع الدورات
export async function GET() {
  return NextResponse.json({
    success: true,
    courses: courses.map(course => ({
      id: course.id,
      name: course.title,
      formula: course.formula,
      status: course.status,
      duration: course.totalDuration,
      lessonsCount: course.lessons.length,
      keywords: course.id === 'prompt_engineering' 
        ? ['هندسة', 'أوامر', 'برومبت', 'prompt', 'GPT', 'ذكاء اصطناعي']
        : course.id === 'ai_agents'
        ? ['وكلاء', 'agent', 'agents', 'langchain', 'ذكاء اصطناعي', 'ai', 'روبوت']
        : ['تعلم آلي', 'machine learning', 'machine', 'تعلم', 'ml', 'بيانات', 'تحليل']
    }))
  });
}

// POST - الحصول على دورة أو درس محدد
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, lessonId, message } = body;

    // إذا طُلب درس محدد
    if (courseId && lessonId) {
      const course = getCourseById(courseId);
      if (!course) {
        return NextResponse.json({ 
          success: false, 
          error: 'الدورة غير موجودة' 
        });
      }

      const lesson = getLessonById(courseId, lessonId);
      if (!lesson) {
        return NextResponse.json({ 
          success: false, 
          error: 'الدرس غير موجود' 
        });
      }

      return NextResponse.json({
        success: true,
        course: {
          id: course.id,
          name: course.title,
          formula: course.formula,
          status: course.status
        },
        lesson: {
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          sections: lesson.sections,
          task: lesson.task,
          quiz: lesson.quiz
        }
      });
    }

    // إذا طُلبت دورة محددة
    if (courseId) {
      const course = getCourseById(courseId);
      if (!course) {
        return NextResponse.json({ 
          success: false, 
          error: 'الدورة غير موجودة' 
        });
      }

      return NextResponse.json({
        success: true,
        course: {
          id: course.id,
          name: course.title,
          formula: course.formula,
          status: course.status,
          duration: course.totalDuration,
          keywords: course.id === 'prompt_engineering' 
            ? ['هندسة', 'أوامر', 'برومبت', 'prompt', 'GPT', 'ذكاء اصطناعي']
            : course.id === 'ai_agents'
            ? ['وكلاء', 'agent', 'agents', 'langchain', 'ذكاء اصطناعي', 'ai', 'روبوت']
            : ['تعلم آلي', 'machine learning', 'machine', 'تعلم', 'ml', 'بيانات', 'تحليل'],
          lessons: course.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            sections: lesson.sections,
            task: lesson.task,
            quiz: lesson.quiz
          }))
        }
      });
    }

    // البحث عن دورات مناسبة
    if (message) {
      const lowerMessage = message.toLowerCase();
      
      const allKeywords = {
        'prompt_engineering': ['هندسة', 'أوامر', 'برومبت', 'prompt', 'GPT', 'ذكاء اصطناعي'],
        'ai_agents': ['وكلاء', 'agent', 'agents', 'langchain', 'ذكاء اصطناعي', 'ai', 'روبوت'],
        'machine_learning': ['تعلم آلي', 'machine learning', 'machine', 'تعلم', 'ml', 'بيانات', 'تحليل']
      };

      const matchingCourses = courses.filter(course => 
        allKeywords[course.id as keyof typeof allKeywords]?.some(keyword => 
          lowerMessage.includes(keyword.toLowerCase())
        )
      );

      // كشف نية التعلم
      const learningKeywords = ['تعلم', 'دورة', 'كورس', 'أريد', 'كيف', 'أبدأ', 'درس'];
      const wantsToLearn = learningKeywords.some(kw => lowerMessage.includes(kw));

      const finalCourses = matchingCourses.length > 0 
        ? matchingCourses 
        : (wantsToLearn ? courses : []);

      return NextResponse.json({
        success: true,
        courses: finalCourses.map(course => ({
          id: course.id,
          name: course.title,
          formula: course.formula,
          status: course.status,
          duration: course.totalDuration,
          lessonsCount: course.lessons.length
        })),
        detection: {
          wantsToLearn,
          topic: message.substring(0, 50)
        }
      });
    }

    return NextResponse.json({
      success: true,
      courses: courses.map(course => ({
        id: course.id,
        name: course.title,
        formula: course.formula,
        status: course.status,
        duration: course.totalDuration,
        lessonsCount: course.lessons.length
      }))
    });

  } catch (error) {
    console.error('Courses API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في معالجة الطلب'
    });
  }
}

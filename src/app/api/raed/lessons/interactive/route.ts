// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API الدروس التفاعلية المحسن
// Interactive Lessons API with LessonBuilder
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { 
  createLessonBuilder,
  renderComponentToHTML,
  type LessonData
} from '@/lib/interactive-lesson-builder';
import { courses, type Course, type Lesson } from '@/lib/courses-content';

// ═══════════════════════════════════════════════════════════════════════════════
// تحويل Lesson إلى LessonData
// ═══════════════════════════════════════════════════════════════════════════════

function convertToLessonData(lesson: Lesson): LessonData {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    sections: lesson.sections,
    quiz: lesson.quiz,
    task: lesson.task
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - الحصول على درس مع المكونات المرئية
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const courseId = searchParams.get('courseId') || 'C1';
  const lessonId = searchParams.get('lessonId') || 'L1';
  const format = searchParams.get('format') || 'components'; // components | html | raw

  // البحث عن الدورة
  const course = courses.find((c: Course) => c.id === courseId);
  if (!course) {
    return NextResponse.json({
      success: false,
      error: 'الدورة غير موجودة'
    }, { status: 404 });
  }

  // البحث عن الدرس
  const lesson = course.lessons.find((l: Lesson) => l.id === lessonId);
  if (!lesson) {
    return NextResponse.json({
      success: false,
      error: 'الدرس غير موجود'
    }, { status: 404 });
  }

  // إنشاء بنّاء الدرس
  const lessonData = convertToLessonData(lesson);
  const builder = createLessonBuilder(lessonData);

  // تحديد التنسيق المطلوب
  if (format === 'html') {
    // إرجاع HTML مباشر
    const components = builder.buildFullLessonView();
    const html = components.map(c => renderComponentToHTML(c)).join('\n');
    
    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        courseId: course.id,
        courseName: course.title,
        formula: course.formula,
        totalLessons: course.lessons.length,
        html
      }
    });
  }

  if (format === 'raw') {
    // إرجاع البيانات الخام
    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        courseId: course.id,
        courseName: course.title,
        ...lesson
      }
    });
  }

  // التنسيق الافتراضي: components
  const components = builder.buildFullLessonView();
  const totalSteps = builder.getTotalSteps();

  return NextResponse.json({
    success: true,
    lesson: {
      id: lesson.id,
      title: lesson.title,
      courseId: course.id,
      courseName: course.title,
      formula: course.formula,
      totalLessons: course.lessons.length,
      totalSteps,
      components
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - الحصول على خطوة محددة من الدرس
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, lessonId, stepIndex = 0 } = body;

    // البحث عن الدورة والدرس
    const course = courses.find((c: Course) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ success: false, error: 'الدورة غير موجودة' }, { status: 404 });
    }

    const lesson = course.lessons.find((l: Lesson) => l.id === lessonId);
    if (!lesson) {
      return NextResponse.json({ success: false, error: 'الدرس غير موجود' }, { status: 404 });
    }

    // إنشاء بنّاء الدرس
    const lessonData = convertToLessonData(lesson);
    const builder = createLessonBuilder(lessonData);

    // الحصول على الخطوة المحددة
    const { component, progress } = builder.buildStepByStepView(stepIndex);

    return NextResponse.json({
      success: true,
      step: {
        index: stepIndex,
        component,
        progress,
        totalSteps: builder.getTotalSteps()
      }
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في معالجة الطلب'
    }, { status: 500 });
  }
}

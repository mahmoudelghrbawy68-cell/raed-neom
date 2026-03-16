// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API الاختبارات والتقدم
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

// Types
interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  sections: {
    introduction: string;
    core_concept: string;
    practical_example: string;
    common_mistake: string;
    summary: string;
  };
  quiz: {
    pass_score: number;
    questions: QuizQuestion[];
  };
}

interface Course {
  id: string;
  title: string;
  category: string;
  formula: string;
  description: string;
  totalDuration: string;
  lessons: Lesson[];
}

// الهيكل المعماري للمحتوى (مبسط للـ API)
const learningArchitecture: Course[] = [
  {
    id: "C1",
    title: "هندسة الأوامر الذكية",
    category: "الأساسيات",
    formula: "المحاكاة التفاعلية",
    description: "تعلم كيفية كتابة أوامر احترافية للذكاء الاصطناعي",
    totalDuration: "12 ساعة",
    lessons: [
      {
        id: "L1",
        title: "تشريح الأمر الاحترافي",
        duration: "45 دقيقة",
        sections: {
          introduction: "لماذا لا يفهمك الذكاء الاصطناعي أحياناً؟",
          core_concept: "الأمر الاحترافي يتكون من 4 أركان",
          practical_example: "مثال: أنت خبير تغذية...",
          common_mistake: "الخطأ الشائع هو إعطاء المهمة مباشرة",
          summary: "تذكر: أعطِ الآلة دوراً، ومعلومات، ومهمة، وحدوداً"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما هو الركن الذي يحدد 'من هو' الذكاء الاصطناعي في الأمر؟",
              options: ["المهمة", "الشخصية (Persona)", "السياق", "القيود"],
              correct: 1,
              explanation: "الشخصية تحدد الدور الذي سيتقمصه الذكاء الاصطناعي"
            }
          ]
        }
      },
      {
        id: "L2",
        title: "سلاسل التفكير (Chain of Thought)",
        duration: "50 دقيقة",
        sections: {
          introduction: "كيف تجعل الذكاء الاصطناعي 'يفكر'؟",
          core_concept: "بإضافة عبارة 'فكر خطوة بخطوة'",
          practical_example: "مثال على التفكير المتسلسل",
          common_mistake: "طلب النتيجة النهائية مباشرة",
          summary: "شجع الآلة على التفكير المنطقي المتسلسل"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما الفائدة الرئيسية من تقنية 'سلاسل التفكير'؟",
              options: ["جعل الرد أسرع", "تقليل الأخطاء المنطقية وزيادة الدقة", "تقصير طول الرد", "توفير تكلفة API"],
              correct: 1,
              explanation: "Chain of Thought يقلل الأخطاء المنطقية بنسبة كبيرة"
            }
          ]
        }
      },
      {
        id: "L3",
        title: "تقنية Few-Shot Learning",
        duration: "55 دقيقة",
        sections: {
          introduction: "هل تعلم أن إعطاء مثال واحد يمكن أن يحسن دقة النموذج بنسبة 50%؟",
          core_concept: "Few-Shot Learning يعني تزويد النموذج بأمثلة",
          practical_example: "مثال على Few-Shot",
          common_mistake: "إعطاء أمثلة غير متسقة",
          summary: "الأمثلة تعلم النموذج 'الشكل المطلوب'"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما هو الفرق بين Zero-Shot و Few-Shot؟",
              options: ["Zero-Shot أسرع", "Few-Shot يستخدم أمثلة لتوجيه النموذج", "لا يوجد فرق", "Zero-Shot أكثر دقة"],
              correct: 1,
              explanation: "Few-Shot يقدم أمثلة للنموذج قبل المهمة"
            }
          ]
        }
      },
      {
        id: "L4",
        title: "التحكم في المخرجات",
        duration: "45 دقيقة",
        sections: {
          introduction: "الحلم بأن تحصل على مخرجات بنفس الشكل الذي تريده!",
          core_concept: "يمكنك تحديد شكل المخرجات بدقة",
          practical_example: "طلب بتنسيق JSON",
          common_mistake: "عدم تحديد التنسيق المطلوب بوضوح",
          summary: "حدد الشكل الذي تريده قبل المهمة"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "أي تنسيق أنسب للحصول على بيانات منظمة يمكن معالجتها برمجياً؟",
              options: ["نص عادي", "JSON", "Markdown", "HTML"],
              correct: 1,
              explanation: "JSON هو التنسيق الأفضل للبيانات المنظمة"
            }
          ]
        }
      }
    ]
  },
  {
    id: "C2",
    title: "بناء وكلاء الذكاء الاصطناعي",
    category: "المتوسط",
    formula: "التعلم القائم على المشاريع",
    description: "تعلم بناء وكلاء ذكيين باستخدام LangChain",
    totalDuration: "18 ساعة",
    lessons: [
      {
        id: "L1",
        title: "مقدمة إلى AI Agents",
        duration: "60 دقيقة",
        sections: {
          introduction: "ما الفرق بين chatbot عادي و AI Agent ذكي؟",
          core_concept: "الـ AI Agent يتكون من: LLM + Tools + Memory + Planning",
          practical_example: "مثال على Agent بسيط",
          common_mistake: "التفكير أن Agent هو مجرد chatbot متقدم",
          summary: "الـ Agent = عقل + أدوات + ذاكرة + تخطيط"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما هو المكون المسؤول عن 'التفكير والقرار' في AI Agent؟",
              options: ["الأدوات (Tools)", "الذاكرة (Memory)", "LLM", "التخطيط"],
              correct: 2,
              explanation: "الـ LLM هو العقل الذي يفكر ويقرر"
            }
          ]
        }
      },
      {
        id: "L2",
        title: "إطار ReAct للتفكير",
        duration: "55 دقيقة",
        sections: {
          introduction: "ReAct = Reasoning + Acting",
          core_concept: "دورة ReAct: Thought → Action → Observation",
          practical_example: "تنفيذ ReAct في LangChain",
          common_mistake: "عدم إعطاء Agent أدوات كافية",
          summary: "ReAct يجعل الـ Agent شفافاً"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ماذا يعني ReAct؟",
              options: ["React JavaScript Library", "Reasoning + Acting", "Real-time Action", "Recursive Algorithm"],
              correct: 1,
              explanation: "ReAct = Reasoning (التفكير) + Acting (التنفيذ)"
            }
          ]
        }
      },
      {
        id: "L3",
        title: "Function Calling المتقدم",
        duration: "65 دقيقة",
        sections: {
          introduction: "كيف تجعل الذكاء الاصطناعي يستدعي دوالك تلقائياً؟",
          core_concept: "Function Calling يسمح للـ LLM باستدعاء الدوال",
          practical_example: "تعريف دالة للـ OpenAI",
          common_mistake: "عدم وصف الدالة بوضوح",
          summary: "Function Calling = دع الـ LLM يتواصل مع الكود"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما هو الشرط الأساسي لنجاح Function Calling؟",
              options: ["استخدام GPT-4 فقط", "وصف الدالة والمعاملات بوضوح", "كتابة الدالة بـ JavaScript", "اتصال بالإنترنت"],
              correct: 1,
              explanation: "الوصف الجيد للدالة هو المفتاح"
            }
          ]
        }
      },
      {
        id: "L4",
        title: "بناء ذاكرة للوكيل",
        duration: "50 دقيقة",
        sections: {
          introduction: "ما الفرق بين محادثة عابرة وعلاقة طويلة الأمد؟",
          core_concept: "أنواع الذاكرة: Buffer, Summary, Window, VectorStore",
          practical_example: "إضافة ذاكرة للـ Agent",
          common_mistake: "استخدام نوع ذاكرة غير مناسب",
          summary: "الذاكرة تحول المحادثة إلى علاقة مستمرة"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "أي نوع ذاكرة أنسب للمحادثات الطويلة جداً؟",
              options: ["Buffer Memory", "Summary Memory", "لا تحتاج ذاكرة", "File Storage"],
              correct: 1,
              explanation: "Summary Memory يلخص المحادثة الطويلة"
            }
          ]
        }
      },
      {
        id: "L5",
        title: "Multi-Agent Systems",
        duration: "70 دقيقة",
        sections: {
          introduction: "لماذا تعمل وحدك بينما يمكنك بناء فريق؟",
          core_concept: "نظام Multi-Agent: Researcher + Writer + Reviewer + Coordinator",
          practical_example: "بناء فريق وكلاء",
          common_mistake: "جعل وكلاء كثيرين بدون تنسيق",
          summary: "Multi-Agent = فريق عمل رقمي"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما هو دور الـ Coordinator في نظام Multi-Agent؟",
              options: ["كتابة المحتوى", "البحث عن المعلومات", "تنسيق العمل بين الوكلاء", "حذف الملفات"],
              correct: 2,
              explanation: "الـ Coordinator ينسق العمل بين الوكلاء"
            }
          ]
        }
      }
    ]
  },
  {
    id: "C3",
    title: "أساسيات تعلم الآلة",
    category: "المتقدم",
    formula: "التحليل التطبيقي",
    description: "فهم أساسيات Machine Learning",
    totalDuration: "15 ساعة",
    lessons: [
      {
        id: "L1",
        title: "ما هو تعلم الآلة؟",
        duration: "45 دقيقة",
        sections: {
          introduction: "كيف يتعرف Netflix على أفلامك المفضلة؟",
          core_concept: "تعلم الآلة = تعليم الكمبيوتر التعلم من البيانات",
          practical_example: "مثال: تصنيف البريد",
          common_mistake: "الخلط بين AI و ML و DL",
          summary: "تعلم الآلة = البيانات + الخوارزمية = نموذج ذكي"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما نوع التعلم المستخدم في تصنيف البريد إلى spam و normal؟",
              options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Transfer Learning"],
              correct: 1,
              explanation: "تصنيف البريد يستخدم Supervervised Learning"
            }
          ]
        }
      },
      {
        id: "L2",
        title: "دورة حياة مشروع ML",
        duration: "55 دقيقة",
        sections: {
          introduction: "مشروع ML الناجح يمر بمراحل محددة",
          core_concept: "دورة الحياة: فهم → جمع → تحضير → تدريب → تقييم → نشر",
          practical_example: "مثال: توقع أسعار المنازل",
          common_mistake: "تخطي مرحلة تحضير البيانات",
          summary: "دورة حياة ML: بيانات نظيفة → نموذج مدرب → نشر ناجح"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "ما هي المرحلة التي تستهلك معظم وقت مشروع ML؟",
              options: ["تدريب النموذج", "تحضير البيانات", "النشر", "التقييم"],
              correct: 1,
              explanation: "تحضير البيانات يستحوذ على 80% من وقت المشروع"
            }
          ]
        }
      },
      {
        id: "L3",
        title: "التصنيف والتوقع",
        duration: "60 دقيقة",
        sections: {
          introduction: "التصنيف أم التوقع؟",
          core_concept: "التصنيف للفئات، التوقع للأرقام",
          practical_example: "مقارنة عملية",
          common_mistake: "استخدام التصنيف لمشكلة توقع أو العكس",
          summary: "التصنيف للفئات، التوقع للأرقام"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "إذا كنت تريد التنبؤ بدرجة حرارة الغد، أي نوع تستخدم؟",
              options: ["Classification", "Regression", "Clustering", "Reinforcement"],
              correct: 1,
              explanation: "درجة الحرارة قيمة مستمرة، لذلك نستخدم Regression"
            }
          ]
        }
      },
      {
        id: "L4",
        title: "تقييم النماذج",
        duration: "50 دقيقة",
        sections: {
          introduction: "هل يعمل نموذجك جيداً؟",
          core_concept: "المقاييس: Accuracy, Precision, Recall, F1-Score",
          practical_example: "حساب المقاييس",
          common_mistake: "الاعتماد على Accuracy فقط",
          summary: "استخدم مقاييس متعددة لتقييم شامل"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "أي مقياس أنسب لتقييم نموذج يكتشف مرض نادر؟",
              options: ["Accuracy", "Precision", "Recall", "F1-Score"],
              correct: 3,
              explanation: "F1-Score هو الأفضل للبيانات غير المتوازنة"
            }
          ]
        }
      },
      {
        id: "L5",
        title: "مشاريع عملية",
        duration: "90 دقيقة",
        sections: {
          introduction: "حان وقت التطبيق!",
          core_concept: "مشروع: تصنيف مراجعات المنتجات",
          practical_example: "الكود الكامل",
          common_mistake: "نسيان حفظ الـ vectorizer",
          summary: "مشروع كامل = بيانات + تحضير + تدريب + تقييم + حفظ"
        },
        quiz: {
          pass_score: 1,
          questions: [
            {
              q: "لماذا نستخدم TF-IDF بدلاً من Count Vectorizer؟",
              options: ["أسرع", "يعطي وزناً أعلى للكلمات المهمة والنادرة", "أسهل في الكتابة", "يدعم العربية فقط"],
              correct: 1,
              explanation: "TF-IDF يعطي وزناً أعلى للكلمات النادرة والمهمة"
            }
          ]
        }
      }
    ]
  }
];

// تخزين تقدم المستخدمين
const userProgress = new Map<string, Set<string>>();

function getCourse(courseId: string): Course | undefined {
  return learningArchitecture.find(c => c.id === courseId);
}

function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourse(courseId);
  return course?.lessons.find(l => l.id === lessonId);
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - الحصول على تقدم المستخدم أو بيانات الدرس
// ═══════════════════════════════════════════════════════════════════════════════
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const courseId = searchParams.get('courseId');
  const lessonId = searchParams.get('lessonId');

  // إذا كان الطلب لدرس محدد
  if (courseId && lessonId) {
    const lesson = getLesson(courseId, lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration,
        sections: lesson.sections,
        quiz: {
          pass_score: lesson.quiz.pass_score,
          questions: lesson.quiz.questions.map(q => ({
            q: q.q,
            options: q.options
            // لا نرسل الإجابة الصحيحة!
          }))
        }
      }
    });
  }

  // إذا كان الطلب لتقدم المستخدم
  if (!userId) {
    return NextResponse.json({ error: 'userId أو courseId و lessonId مطلوب' }, { status: 400 });
  }

  const progress = userProgress.get(userId) || new Set();
  
  if (courseId) {
    const course = getCourse(courseId);
    const courseProgress = Array.from(progress).filter(p => p.startsWith(courseId));
    
    return NextResponse.json({
      success: true,
      courseId,
      courseTitle: course?.title,
      completedLessons: courseProgress.length,
      totalLessons: course?.lessons.length || 0,
      progress: courseProgress,
      percentage: course ? Math.round((courseProgress.length / course.lessons.length) * 100) : 0
    });
  }

  return NextResponse.json({
    success: true,
    userId,
    completedLessons: Array.from(progress),
    totalCompleted: progress.size
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - إرسال اختبار
// ═══════════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, courseId, lessonId, answers } = body;

    if (!userId || !courseId || !lessonId || !Array.isArray(answers)) {
      return NextResponse.json({ 
        error: 'جميع الحقول مطلوبة: userId, courseId, lessonId, answers' 
      }, { status: 400 });
    }

    const lesson = getLesson(courseId, lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 });
    }

    // التحقق من الدرس السابق
    const lessonNumber = parseInt(lessonId.replace('L', ''));
    if (lessonNumber > 1) {
      const previousLessonId = `L${lessonNumber - 1}`;
      const progressKey = `${courseId}_${previousLessonId}`;
      const userCompletedLessons = userProgress.get(userId) || new Set();
      
      if (!userCompletedLessons.has(progressKey)) {
        return NextResponse.json({
          success: false,
          error: '⚠️ لا يمكنك بدء هذا الدرس. يجب عليك اجتياز اختبار الدرس السابق أولاً.',
          previousLesson: previousLessonId
        }, { status: 403 });
      }
    }

    // تصحيح الاختبار
    const quiz = lesson.quiz;
    let correctAnswers = 0;
    const results: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      explanation?: string;
    }> = [];

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const userAnswerIndex = answers[i];
      const isCorrect = userAnswerIndex === question.correct;
      
      if (isCorrect) correctAnswers++;

      results.push({
        question: question.q,
        userAnswer: question.options[userAnswerIndex] || 'لم يتم الاختيار',
        correctAnswer: question.options[question.correct],
        isCorrect,
        explanation: question.explanation
      });
    }

    const passed = correctAnswers >= quiz.pass_score;
    const progressKey = `${courseId}_${lessonId}`;

    if (passed) {
      if (!userProgress.has(userId)) {
        userProgress.set(userId, new Set());
      }
      userProgress.get(userId)!.add(progressKey);
    }

    const course = getCourse(courseId);
    const userCompletedLessons = userProgress.get(userId) || new Set();
    const courseCompleted = Array.from(userCompletedLessons).filter(p => p.startsWith(courseId)).length;

    return NextResponse.json({
      success: true,
      passed,
      score: correctAnswers,
      totalQuestions: quiz.questions.length,
      passScore: quiz.pass_score,
      results,
      courseProgress: {
        completed: courseCompleted,
        total: course?.lessons.length || 0,
        percentage: course ? Math.round((courseCompleted / course.lessons.length) * 100) : 0
      },
      message: passed 
        ? '✅ ممتاز! لقد نجحت في الاختبار. يمكنك الآن الانتقال للدرس التالي.' 
        : '❌ لم تنجح. حاول مرة أخرى وركز على المفاهيم الأساسية.',
      nextLesson: passed && course && lessonNumber < course.lessons.length 
        ? `L${lessonNumber + 1}` 
        : null,
      courseCompleted: passed && course && lessonNumber === course.lessons.length
    });

  } catch (error) {
    console.error('Quiz API Error:', error);
    return NextResponse.json({ 
      error: 'حدث خطأ في معالجة الاختبار',
      success: false 
    }, { status: 500 });
  }
}

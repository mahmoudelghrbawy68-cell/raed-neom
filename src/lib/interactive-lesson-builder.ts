// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - بنّاء الدروس التفاعلي
// Interactive Lesson Builder - يحول البيانات إلى مكونات مرئية
// ═══════════════════════════════════════════════════════════════════════════════

// أنواع المكونات المرئية
export type ComponentType = 
  | 'header' 
  | 'introduction_banner' 
  | 'core_concept_box' 
  | 'code_block' 
  | 'warning_alert' 
  | 'summary_card' 
  | 'interactive_quiz'
  | 'task_card'
  | 'pro_tip'
  | 'progress_indicator';

// واجهة المكون المرئي
export interface VisualComponent {
  type: ComponentType;
  content: string | Record<string, unknown>;
  metadata?: {
    icon?: string;
    color?: string;
    animation?: string;
  };
}

// واجهة قسم الدرس
export interface LessonSection {
  introduction: string;
  core_concept: string;
  practical_example: string;
  common_mistake: string;
  summary: string;
}

// واجهة الاختبار
export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface Quiz {
  pass_score: number;
  questions: QuizQuestion[];
}

// واجهة بيانات الدرس
export interface LessonData {
  id: string;
  title: string;
  duration?: string;
  sections: LessonSection;
  quiz: Quiz;
  task?: string;
  pro_tips?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// InteractiveLessonBuilder - بنّاء الدروس التفاعلي
// ═══════════════════════════════════════════════════════════════════════════════

export class InteractiveLessonBuilder {
  private lessonData: LessonData;
  private title: string;
  private sections: LessonSection;
  private quiz: Quiz;
  private task?: string;
  private proTips: string[];

  constructor(lessonData: LessonData) {
    this.lessonData = lessonData;
    this.title = lessonData.title || "درس بدون عنوان";
    this.sections = lessonData.sections || {};
    this.quiz = lessonData.quiz || { pass_score: 1, questions: [] };
    this.task = lessonData.task;
    this.proTips = lessonData.pro_tips || [];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء الترويسة
  // ─────────────────────────────────────────────────────────────────────────
  renderHeader(): VisualComponent {
    return {
      type: 'header',
      content: `🎓 ${this.title}`,
      metadata: {
        icon: '📚',
        color: 'cyan',
        animation: 'fadeIn'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء مقدمة الدرس
  // ─────────────────────────────────────────────────────────────────────────
  renderIntroduction(): VisualComponent {
    return {
      type: 'introduction_banner',
      content: this.sections.introduction || '',
      metadata: {
        icon: '🚀',
        color: 'blue',
        animation: 'slideIn'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء المفهوم الأساسي
  // ─────────────────────────────────────────────────────────────────────────
  renderCoreConcept(): VisualComponent {
    return {
      type: 'core_concept_box',
      content: {
        title: '💡 المفهوم الأساسي',
        text: this.sections.core_concept || ''
      },
      metadata: {
        icon: '💡',
        color: 'purple',
        animation: 'pulse'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء المثال العملي
  // ─────────────────────────────────────────────────────────────────────────
  renderPracticalExample(): VisualComponent {
    return {
      type: 'code_block',
      content: {
        title: '🛠️ مثال تطبيقي',
        code: this.sections.practical_example || ''
      },
      metadata: {
        icon: '🛠️',
        color: 'green',
        animation: 'expand'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء الخطأ الشائع
  // ─────────────────────────────────────────────────────────────────────────
  renderCommonMistake(): VisualComponent {
    return {
      type: 'warning_alert',
      content: {
        title: '⚠️ خطأ شائع',
        text: this.sections.common_mistake || ''
      },
      metadata: {
        icon: '⚠️',
        color: 'red',
        animation: 'shake'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء الملخص
  // ─────────────────────────────────────────────────────────────────────────
  renderSummary(): VisualComponent {
    const summary = this.sections.summary || '';
    const points = summary.split('. ').filter(p => p.trim());
    
    return {
      type: 'summary_card',
      content: {
        title: '✅ خلاصة الدرس',
        points: points.length > 0 ? points : [summary]
      },
      metadata: {
        icon: '✅',
        color: 'emerald',
        animation: 'fadeInUp'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء المهمة العملية
  // ─────────────────────────────────────────────────────────────────────────
  renderTask(): VisualComponent | null {
    if (!this.task) return null;
    
    return {
      type: 'task_card',
      content: {
        title: '🎯 مهمة عملية',
        text: this.task
      },
      metadata: {
        icon: '🎯',
        color: 'orange',
        animation: 'bounce'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء النصائح الاحترافية
  // ─────────────────────────────────────────────────────────────────────────
  renderProTips(): VisualComponent[] {
    return this.proTips.map((tip, index) => ({
      type: 'pro_tip' as ComponentType,
      content: tip,
      metadata: {
        icon: '💎',
        color: 'gold',
        animation: 'fadeIn'
      }
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء الاختبار التفاعلي
  // ─────────────────────────────────────────────────────────────────────────
  renderQuiz(): VisualComponent | null {
    if (!this.quiz || this.quiz.questions.length === 0) return null;
    
    return {
      type: 'interactive_quiz',
      content: {
        title: '📝 اختبر فهمك',
        pass_score: this.quiz.pass_score,
        questions: this.quiz.questions
      },
      metadata: {
        icon: '📝',
        color: 'indigo',
        animation: 'slideUp'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء مؤشر التقدم
  // ─────────────────────────────────────────────────────────────────────────
  renderProgressIndicator(currentStep: number, totalSteps: number): VisualComponent {
    return {
      type: 'progress_indicator',
      content: {
        current: currentStep,
        total: totalSteps,
        percentage: Math.round((currentStep / totalSteps) * 100)
      },
      metadata: {
        icon: '📊',
        color: 'cyan',
        animation: 'fill'
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء العرض الكامل للدرس
  // ─────────────────────────────────────────────────────────────────────────
  buildFullLessonView(): VisualComponent[] {
    const components: VisualComponent[] = [];
    
    // 1. الترويسة
    components.push(this.renderHeader());
    
    // 2. مقدمة الدرس
    components.push(this.renderIntroduction());
    
    // 3. المفهوم الأساسي
    components.push(this.renderCoreConcept());
    
    // 4. المثال العملي
    components.push(this.renderPracticalExample());
    
    // 5. الخطأ الشائع
    components.push(this.renderCommonMistake());
    
    // 6. النصائح الاحترافية (إن وجدت)
    components.push(...this.renderProTips());
    
    // 7. الملخص
    components.push(this.renderSummary());
    
    // 8. المهمة العملية (إن وجدت)
    const task = this.renderTask();
    if (task) components.push(task);
    
    // 9. الاختبار التفاعلي
    const quiz = this.renderQuiz();
    if (quiz) components.push(quiz);
    
    return components;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // بناء عرض خطوة بخطوة
  // ─────────────────────────────────────────────────────────────────────────
  buildStepByStepView(stepIndex: number): { component: VisualComponent; progress: VisualComponent } {
    const allComponents = this.buildFullLessonView();
    const safeIndex = Math.min(Math.max(0, stepIndex), allComponents.length - 1);
    
    return {
      component: allComponents[safeIndex],
      progress: this.renderProgressIndicator(safeIndex + 1, allComponents.length)
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // الحصول على عدد الخطوات
  // ─────────────────────────────────────────────────────────────────────────
  getTotalSteps(): number {
    return this.buildFullLessonView().length;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// دالة مساعدة لإنشاء بنّاء درس
// ═══════════════════════════════════════════════════════════════════════════════

export function createLessonBuilder(lessonData: LessonData): InteractiveLessonBuilder {
  return new InteractiveLessonBuilder(lessonData);
}

// ═══════════════════════════════════════════════════════════════════════════════
// دالة لتحويل المكون إلى HTML
// ═══════════════════════════════════════════════════════════════════════════════

export function renderComponentToHTML(component: VisualComponent): string {
  const { type, content, metadata } = component;
  const colorMap: Record<string, string> = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10',
    blue: 'border-blue-500/30 bg-blue-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
    green: 'border-green-500/30 bg-green-500/10',
    red: 'border-red-500/30 bg-red-500/10',
    emerald: 'border-emerald-500/30 bg-emerald-500/10',
    orange: 'border-orange-500/30 bg-orange-500/10',
    gold: 'border-yellow-500/30 bg-yellow-500/10',
    indigo: 'border-indigo-500/30 bg-indigo-500/10',
  };
  
  const colorClass = colorMap[metadata?.color || 'cyan'] || colorMap.cyan;

  switch (type) {
    case 'header':
      return `<h1 class="text-2xl font-bold text-white mb-6">${content}</h1>`;
    
    case 'introduction_banner':
      return `
        <div class="p-4 rounded-xl ${colorClass} border mb-4">
          <p class="text-slate-200 leading-relaxed">${content}</p>
        </div>
      `;
    
    case 'core_concept_box':
      const coreContent = content as { title: string; text: string };
      return `
        <div class="p-5 rounded-xl ${colorClass} border mb-4">
          <h3 class="text-lg font-bold text-white mb-3">${coreContent.title}</h3>
          <p class="text-slate-300 leading-relaxed whitespace-pre-wrap">${coreContent.text}</p>
        </div>
      `;
    
    case 'code_block':
      const codeContent = content as { title: string; code: string };
      return `
        <div class="rounded-xl overflow-hidden border border-slate-700 mb-4">
          <div class="bg-slate-800 px-4 py-2 border-b border-slate-700">
            <span class="text-sm text-cyan-400">${codeContent.title}</span>
          </div>
          <pre class="p-4 text-sm text-slate-300 bg-slate-900/50 overflow-x-auto whitespace-pre-wrap">${codeContent.code}</pre>
        </div>
      `;
    
    case 'warning_alert':
      const warningContent = content as { title: string; text: string };
      return `
        <div class="p-4 rounded-xl ${colorClass} border mb-4 flex gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <h4 class="font-bold text-white mb-1">${warningContent.title}</h4>
            <p class="text-slate-300">${warningContent.text}</p>
          </div>
        </div>
      `;
    
    case 'summary_card':
      const summaryContent = content as { title: string; points: string[] };
      return `
        <div class="p-5 rounded-xl ${colorClass} border mb-4">
          <h3 class="text-lg font-bold text-white mb-3">${summaryContent.title}</h3>
          <ul class="space-y-2">
            ${summaryContent.points.map(point => `
              <li class="flex items-start gap-2 text-slate-300">
                <span class="text-emerald-400 mt-1">✓</span>
                <span>${point}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    
    case 'task_card':
      const taskContent = content as { title: string; text: string };
      return `
        <div class="p-5 rounded-xl ${colorClass} border mb-4">
          <h3 class="text-lg font-bold text-white mb-3">${taskContent.title}</h3>
          <p class="text-slate-300">${taskContent.text}</p>
        </div>
      `;
    
    case 'pro_tip':
      return `
        <div class="p-4 rounded-xl ${colorClass} border mb-4 flex gap-3">
          <span class="text-2xl">💎</span>
          <p class="text-slate-200">${content}</p>
        </div>
      `;
    
    case 'interactive_quiz':
      const quizContent = content as { 
        title: string; 
        pass_score: number; 
        questions: QuizQuestion[] 
      };
      return `
        <div class="p-5 rounded-xl ${colorClass} border mb-4">
          <h3 class="text-lg font-bold text-white mb-4">${quizContent.title}</h3>
          <div class="space-y-4">
            ${quizContent.questions.map((q, i) => `
              <div class="bg-slate-800/50 rounded-lg p-4">
                <p class="text-white mb-3">${i + 1}. ${q.q}</p>
                <div class="space-y-2">
                  ${q.options.map((opt, j) => `
                    <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                      <input type="radio" name="q${i}" value="${j}" class="text-cyan-500">
                      <span class="text-slate-300">${opt}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    
    case 'progress_indicator':
      const progressContent = content as { current: number; total: number; percentage: number };
      return `
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500" 
                 style="width: ${progressContent.percentage}%"></div>
          </div>
          <span class="text-sm text-slate-400">${progressContent.current}/${progressContent.total}</span>
        </div>
      `;
    
    default:
      return `<div class="p-4 text-slate-400">${String(content)}</div>`;
  }
}

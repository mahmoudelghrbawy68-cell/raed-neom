// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API خدمة العملاء 24/7
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/raed-core';

// ═══════════════════════════════════════════════════════════════════════════════
// System Prompt لخدمة العملاء
// ═══════════════════════════════════════════════════════════════════════════════

function getCustomerServicePrompt(): string {
  return `أنت موظف خدمة عملاء ذكي في أكاديمية "رائد نيوم" للذكاء الاصطناعي.

## 🎯 مهمتك:
- مساعدة المشتركين في حل مشاكلهم بلباقة واحترافية
- الإجابة على استفسارات الدورات والمحتوى
- توجيه المستخدمين للدروس والموارد المناسبة

## 💰 الدورات المتاحة (مجانية):
1. هندسة الأوامر الذكية - 4 دروس - المحاكاة التفاعلية
2. بناء وكلاء AI - 5 دروس - التعلم القائم على المشاريع
3. أساسيات تعلم الآلة - 5 دروس - التحليل التطبيقي

## 📋 قواعد الرد:
- كن ودوداً ومتعاوناً دائماً
- استخدم اللغة العربية الفصحى البسيطة
- أضف إيموجي مناسبة باعتدال
- إذا لم تعرف الإجابة، توجه المستخدم للتواصل مع الإدارة
- قدم حلول عملية وخطوات واضحة

## 🕐 ساعات العمل:
- الخدمة متاحة 24/7
- الرد خلال دقائق

## 📞 للمشاكل التقنية المعقدة:
- وجه المستخدم لإرسال تفاصيل المشكلة
- اعرض التواصل عبر البريد الإلكتروني`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - خدمة العملاء
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, message, context } = body;

    if (!message) {
      return NextResponse.json({ 
        error: 'الرسالة مطلوبة',
        success: false 
      }, { status: 400 });
    }

    console.log('🎧 Customer Service Request:', message.substring(0, 50));

    // إنشاء sessionId للمستخدم
    const sessionId = userId || `support_${Date.now()}`;

    // إضافة سياق إذا كان متوفراً
    let fullMessage = message;
    if (context) {
      fullMessage = `[سياق: ${context}]\n\n${message}`;
    }

    // الحصول على رد من AI
    const response = await chatCompletion(fullMessage, sessionId, [
      { role: 'system', content: getCustomerServicePrompt() }
    ]);

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
      sessionId
    });

  } catch (error) {
    console.error('Customer Service API Error:', error);
    
    // رد احتياطي في حالة الخطأ
    return NextResponse.json({
      success: true,
      response: `🤖 [خدمة العملاء 24/7]

أهلاً بك! نحن هنا لمساعدتك.

يبدو أن هناك ضغطاً على النظام حالياً. يمكنك:
• طرح سؤالك مرة أخرى
• التواصل معنا لاحقاً

نسعى لخدمتك بأفضل طريقة! 💙`,
      timestamp: new Date().toISOString()
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - معلومات الخدمة
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET() {
  return NextResponse.json({
    service: 'رائد نيوم - خدمة العملاء 24/7',
    status: 'متاح',
    workingHours: '24 ساعة / 7 أيام',
    supportedTopics: [
      'استفسارات الدورات',
      'مشاكل تقنية',
      'توجيهات التعلم',
      'شهادات الإتمام',
      'الدعم العام'
    ],
    courses: [
      { id: 'C1', title: 'هندسة الأوامر الذكية', lessons: 4 },
      { id: 'C2', title: 'بناء وكلاء AI', lessons: 5 },
      { id: 'C3', title: 'أساسيات تعلم الآلة', lessons: 5 }
    ]
  });
}

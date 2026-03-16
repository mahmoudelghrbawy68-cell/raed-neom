// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API الاشتراكات
// Subscription API Endpoint
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { 
  subscriptionService, 
  SUBSCRIPTION_PLANS,
  type SubscriptionPlan 
} from '@/lib/subscription-service';

// ═══════════════════════════════════════════════════════════════════════════════
// GET - الحصول على معلومات الاشتراك أو الخطط
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get('userId');
  const action = searchParams.get('action');

  // الحصول على جميع الخطط
  if (action === 'plans') {
    return NextResponse.json({
      success: true,
      plans: subscriptionService.getAllPlans(),
    });
  }

  // الحصول على معلومات اشتراك مستخدم
  if (userId) {
    const subscription = subscriptionService.getSubscription(userId);
    const isPremium = subscriptionService.isPremiumSubscribed(userId);

    return NextResponse.json({
      success: true,
      subscription: subscription || {
        userId,
        plan: 'free',
        isActive: false,
        aiCallsCount: 0,
        maxFreeCalls: 3,
      },
      isPremium,
    });
  }

  // إرجاع الخطط افتراضياً
  return NextResponse.json({
    success: true,
    plans: subscriptionService.getAllPlans(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - اشتراك جديد أو ترقية
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, plan } = body;

    // اشتراك جديد
    if (action === 'subscribe' && userId && plan) {
      const planInfo = SUBSCRIPTION_PLANS[plan as SubscriptionPlan];
      
      if (!planInfo) {
        return NextResponse.json({
          success: false,
          error: 'خطة الاشتراك غير موجودة',
        }, { status: 400 });
      }

      const result = await subscriptionService.subscribeUser(userId, plan);

      return NextResponse.json({
        success: result.success,
        message: result.message,
        plan: planInfo,
      });
    }

    // إلغاء الاشتراك
    if (action === 'cancel' && userId) {
      const success = subscriptionService.cancelSubscription(userId);

      return NextResponse.json({
        success,
        message: success ? 'تم إلغاء الاشتراك' : 'فشل في إلغاء الاشتراك',
      });
    }

    // التحقق من مكالمة AI
    if (action === 'check-ai-call' && userId) {
      const result = subscriptionService.recordAICall(userId);

      return NextResponse.json({
        success: true,
        allowed: result.allowed,
        remaining: result.remaining,
        message: result.message,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'إجراء غير معروف',
    }, { status: 400 });

  } catch {
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في معالجة الطلب',
    }, { status: 500 });
  }
}

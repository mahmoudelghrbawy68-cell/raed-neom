// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - نظام الاشتراكات والدفع
// Raed Neom - Subscription & Payment System
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// أنواع البيانات
// ═══════════════════════════════════════════════════════════════════════════════

export type SubscriptionPlan = 'free' | 'premium' | 'pro';

export interface UserSubscription {
  userId: string;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate?: Date;
  aiCallsCount: number;
  maxFreeCalls: number;
  isActive: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  amount?: number;
}

export interface SubscriptionPlanInfo {
  id: SubscriptionPlan;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
  features: string[];
  aiCallsLimit: number;
  coursesAccess: 'free' | 'all';
  certificateAccess: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// خطط الاشتراك المتاحة
// ═══════════════════════════════════════════════════════════════════════════════

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPlanInfo> = {
  free: {
    id: 'free',
    name: 'Free Plan',
    nameAr: 'الباقة المجانية',
    price: 0,
    currency: 'USD',
    features: [
      '3 مكالمات AI مجانية يومياً',
      'الوصول للدورات المجانية',
      'شهادات إتمام الدورات',
    ],
    aiCallsLimit: 3,
    coursesAccess: 'free',
    certificateAccess: true,
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    nameAr: 'الباقة المميزة',
    price: 9.99,
    currency: 'USD',
    features: [
      'مكالمات AI غير محدودة',
      'الوصول لجميع الدورات',
      'شهادات معتمدة',
      'دعم أولوية 24/7',
      'تحديثات حصرية',
    ],
    aiCallsLimit: -1, // غير محدود
    coursesAccess: 'all',
    certificateAccess: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    nameAr: 'الباقة الاحترافية',
    price: 29.99,
    currency: 'USD',
    features: [
      'جميع ميزات Premium',
      'جلسات خاصة مع مدرب',
      'مشاريع عملية موجهة',
      'فرص عمل وتوصيات',
      'دعم VIP',
    ],
    aiCallsLimit: -1,
    coursesAccess: 'all',
    certificateAccess: true,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// خدمة الدفع (Payment Service)
// ═══════════════════════════════════════════════════════════════════════════════

export class PaymentService {
  /**
   * معالجة الدفع (تكامل وهمي - يمكن استبداله بـ Stripe/PayPal)
   */
  async processPayment(
    userId: string,
    amount: number,
    description: string,
    paymentMethod?: string
  ): Promise<PaymentResult> {
    console.log(`💰 [PaymentService]: جاري معالجة دفع ${amount}$ من ${userId} لـ ${description}...`);

    // محاكاة معالجة الدفع
    // في التطبيق الحقيقي، سيتم التكامل مع Stripe أو PayPal
    
    if (amount <= 0) {
      return {
        success: false,
        message: 'مبلغ الدفع غير صالح',
      };
    }

    // محاكاة نجاح الدفع
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`✅ [PaymentService]: تم الدفع بنجاح - Transaction: ${transactionId}`);
    
    return {
      success: true,
      transactionId,
      message: 'تم الدفع بنجاح',
      amount,
    };
  }

  /**
   * استرداد المبلغ
   */
  async refund(transactionId: string, reason?: string): Promise<PaymentResult> {
    console.log(`🔄 [PaymentService]: جاري استرداد المبلغ للمعاملة ${transactionId}...`);
    
    return {
      success: true,
      transactionId,
      message: 'تم استرداد المبلغ بنجاح',
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// خدمة الاشتراكات (Subscription Service)
// ═══════════════════════════════════════════════════════════════════════════════

export class SubscriptionService {
  private subscribedUsers: Map<string, UserSubscription> = new Map();
  private paymentService: PaymentService;

  constructor(paymentService?: PaymentService) {
    this.paymentService = paymentService || new PaymentService();
  }

  /**
   * التحقق من حالة الاشتراك
   */
  getSubscription(userId: string): UserSubscription | undefined {
    return this.subscribedUsers.get(userId);
  }

  /**
   * التحقق من وجود اشتراك فعال
   */
  isPremiumSubscribed(userId: string): boolean {
    const subscription = this.subscribedUsers.get(userId);
    if (!subscription) return false;
    
    // التحقق من صلاحية الاشتراك
    if (subscription.endDate && new Date() > subscription.endDate) {
      subscription.isActive = false;
      return false;
    }
    
    return subscription.isActive && subscription.plan !== 'free';
  }

  /**
   * اشتراك مستخدم جديد
   */
  async subscribeUser(
    userId: string,
    plan: SubscriptionPlan = 'premium'
  ): Promise<{ success: boolean; message: string }> {
    const planInfo = SUBSCRIPTION_PLANS[plan];
    
    if (planInfo.price > 0) {
      // معالجة الدفع
      const paymentResult = await this.paymentService.processPayment(
        userId,
        planInfo.price,
        `اشتراك ${planInfo.nameAr}`
      );
      
      if (!paymentResult.success) {
        return { success: false, message: 'فشل في معالجة الدفع' };
      }
    }

    // إنشاء الاشتراك
    const subscription: UserSubscription = {
      userId,
      plan,
      startDate: new Date(),
      endDate: plan === 'free' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
      aiCallsCount: 0,
      maxFreeCalls: planInfo.aiCallsLimit,
      isActive: true,
    };

    this.subscribedUsers.set(userId, subscription);
    
    console.log(`🎉 [SubscriptionService]: تم اشتراك ${userId} في ${planInfo.nameAr}`);
    
    return { success: true, message: `تم الاشتراك بنجاح في ${planInfo.nameAr}` };
  }

  /**
   * إلغاء الاشتراك
   */
  cancelSubscription(userId: string): boolean {
    const subscription = this.subscribedUsers.get(userId);
    if (!subscription) return false;
    
    subscription.isActive = false;
    subscription.endDate = new Date();
    
    console.log(`❌ [SubscriptionService]: تم إلغاء اشتراك ${userId}`);
    return true;
  }

  /**
   * تسجيل مكالمة AI والتحقق من الحد المسموح
   */
  recordAICall(userId: string): { allowed: boolean; remaining: number; message?: string } {
    let subscription = this.subscribedUsers.get(userId);
    
    // إنشاء اشتراك مجاني للمستخدمين الجدد
    if (!subscription) {
      this.subscribeUser(userId, 'free');
      subscription = this.subscribedUsers.get(userId)!;
    }

    const planInfo = SUBSCRIPTION_PLANS[subscription.plan];
    
    // المشتركون Premium/Pro لديهم مكالمات غير محدودة
    if (planInfo.aiCallsLimit === -1) {
      return { allowed: true, remaining: -1 };
    }

    // التحقق من الحد للمستخدمين المجانيين
    if (subscription.aiCallsCount >= planInfo.aiCallsLimit) {
      return {
        allowed: false,
        remaining: 0,
        message: `🚫 لقد تجاوزت الحد الأقصى (${planInfo.aiCallsLimit} مكالمات) للمساعد الذكي. يرجى الترقية للاستخدام غير المحدود.`,
      };
    }

    subscription.aiCallsCount++;
    const remaining = planInfo.aiCallsLimit - subscription.aiCallsCount;
    
    return { allowed: true, remaining };
  }

  /**
   * إعادة تعيين العداد اليومي
   */
  resetDailyCounters(): void {
    for (const subscription of this.subscribedUsers.values()) {
      if (subscription.plan === 'free') {
        subscription.aiCallsCount = 0;
      }
    }
    console.log('🔄 [SubscriptionService]: تم إعادة تعيين عدادات الاستخدام');
  }

  /**
   * الحصول على معلومات الخطة
   */
  getPlanInfo(plan: SubscriptionPlan): SubscriptionPlanInfo {
    return SUBSCRIPTION_PLANS[plan];
  }

  /**
   * الحصول على جميع الخطط
   */
  getAllPlans(): SubscriptionPlanInfo[] {
    return Object.values(SUBSCRIPTION_PLANS);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// خدمة المساعد الذكي (AI Assistant Service)
// ═══════════════════════════════════════════════════════════════════════════════

export type AIMode = 'support' | 'tech' | 'tutor' | 'sales';

export class AIAssistantService {
  private subscriptionService: SubscriptionService;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  /**
   * الحصول على رد من المساعد الذكي
   */
  async getAIResponse(
    userId: string,
    prompt: string,
    mode: AIMode = 'support'
  ): Promise<string> {
    // التحقق من الاشتراك
    const callCheck = this.subscriptionService.recordAICall(userId);
    
    if (!callCheck.allowed) {
      return callCheck.message || '🚫 تجاوزت الحد المسموح. يرجى الترقية.';
    }

    const roles: Record<AIMode, string> = {
      support: 'أنت موظف خدمة عملاء ذكي 24/7. مهمتك مساعدة المستخدمين وتوجيههم بلباقة واحترافية.',
      tech: 'أنت مهندس دعم تقني خبير في الذكاء الاصطناعي. ساعد في حل المشاكل التقنية خطوة بخطوة.',
      tutor: 'أنت بروفيسور في الذكاء الاصطناعي. اشرح المفاهيم التعليمية بأسلوب مبسط ومفهوم.',
      sales: 'أنت مستشار مبيعات ذكي. ساعد العملاء في اختيار الدورات المناسبة لاحتياجاتهم.',
    };

    const systemMessage = roles[mode] || roles.support;

    // سيتم استدعاء API الفعلي من raed-core.ts
    return `[${mode.toUpperCase()}] ${prompt} - تم التوجيه للمعالجة مع system: "${systemMessage.substring(0, 50)}..."`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// إنشاء الخدمات المشتركة
// ═══════════════════════════════════════════════════════════════════════════════

const paymentService = new PaymentService();
export const subscriptionService = new SubscriptionService(paymentService);
export const aiAssistantService = new AIAssistantService(subscriptionService);

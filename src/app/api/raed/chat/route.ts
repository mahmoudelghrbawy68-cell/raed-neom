// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API المحادثة (JSON)
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/raed-core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });
    }

    console.log('💬 Chat request:', message.substring(0, 50));

    // إنشاء معرف الجلسة
    const sid = sessionId || `chat_${Date.now()}`;

    // توليد الرد باستخدام AI حقيقي
    const response = await chatCompletion(message, sid, history);

    return NextResponse.json({
      success: true,
      response,
      sessionId: sid
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في المعالجة', success: false },
      { status: 500 }
    );
  }
}

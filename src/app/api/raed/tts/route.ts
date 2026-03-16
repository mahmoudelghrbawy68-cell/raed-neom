// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API تحويل النص إلى صوت (TTS) - محدّث لاستخدام OpenAI
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/raed-core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice = 'alloy', speed = 1.0 } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'النص مطلوب', success: false },
        { status: 400 }
      );
    }

    console.log('🔊 TTS Request:', text.substring(0, 50));

    // تحويل النص إلى صوت
    const audioBuffer = await textToSpeech(text);

    console.log('✅ TTS Success, size:', audioBuffer.length);

    // إرجاع الصوت كـ base64
    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      audioBase64,
      format: 'mp3'
    });

  } catch (error) {
    console.error('TTS Error:', error);
    
    // في حالة الفشل، نرجع رد مع رسالة خطأ واضحة
    return NextResponse.json(
      { 
        error: 'فشل في تحويل النص لصوت', 
        success: false,
        details: error instanceof Error ? error.message : 'خطأ غير معروف',
        note: 'تأكد من وجود OPENAI_API_KEY في متغيرات البيئة'
      },
      { status: 500 }
    );
  }
}

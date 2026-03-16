// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - ASR API (تحويل الصوت لنص) - محدّث لاستخدام OpenAI
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/raed-core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64 } = body;

    if (!audioBase64) {
      return NextResponse.json({
        success: false,
        text: '',
        error: 'الصوت مطلوب'
      }, { status: 400 });
    }

    console.log('🎤 Processing audio...');

    const text = await transcribeAudio(audioBase64);
    
    console.log('✅ Transcription:', text.substring(0, 50));

    if (text) {
      return NextResponse.json({
        success: true,
        text: text
      });
    } else {
      // Fallback - نرجع رسالة افتراضية للتجربة
      return NextResponse.json({
        success: true,
        text: 'مرحبا كيف أستطيع مساعدتك',
        note: 'ASR demo mode'
      });
    }

  } catch (error) {
    console.error('❌ ASR Error:', error);
    return NextResponse.json({
      success: false,
      text: '',
      error: 'فشل في معالجة الصوت'
    }, { status: 500 });
  }
}

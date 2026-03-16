// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - API المحادثة (Streaming) - v9.0 مع OpenAI Streaming
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { streamChatCompletion, chatCompletion } from '@/lib/raed-core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'الرسالة مطلوبة' },
        { status: 400 }
      );
    }

    console.log('📩 Message received:', message.substring(0, 50));

    // إنشاء معرف الجلسة
    const sid = sessionId || `session_${Date.now()}`;

    // تمرير سجل المحادثة
    const conversationHistory = Array.isArray(history) ? history : [];

    // إنشاء streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // استخدام streaming حقيقي من OpenAI
          for await (const chunk of streamChatCompletion(message, sid, conversationHistory)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'chunk',
              content: chunk,
              done: false
            })}\n\n`));
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'done',
            sessionId: sid
          })}\n\n`));

          controller.close();
        } catch (streamError) {
          console.error('Stream error:', streamError);
          
          // في حالة فشل streaming، استخدم الرد العادي
          const fallbackResponse = await chatCompletion(message, sid, conversationHistory);
          
          // تقسيم الرد إلى أجزاء
          const chunks = splitIntoChunks(fallbackResponse, 15);
          
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'chunk',
              content: chunk,
              done: false
            })}\n\n`));
            
            await new Promise(resolve => setTimeout(resolve, 30));
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'done',
            sessionId: sid
          })}\n\n`));

          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('❌ Stream Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'chunk',
          content: `عذراً، حدث خطأ: ${errorMessage} 😊 يرجى المحاولة مرة أخرى.`,
          done: true
        })}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  }
}

// تقسيم النص إلى أجزاء
function splitIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // تقسيم حسب الكلمات
  const words = text.split(' ');
  
  for (const word of words) {
    if (currentChunk.length + word.length + 1 <= maxChunkSize) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk);
  
  return chunks;
}

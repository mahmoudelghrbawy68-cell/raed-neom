import { NextRequest, NextResponse } from 'next/server';

// رابط الـ Backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://raed-neom-backend.onrender.com';

/**
 * Proxy للتواصل مع الـ Backend
 * يستخدم لتجنب مشاكل CORS
 */
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: 'offline', error: 'Backend unavailable' },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Backend unavailable', success: false },
      { status: 503 }
    );
  }
}

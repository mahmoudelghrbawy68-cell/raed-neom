#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# رائد نيوم - سكربت النشر على Fly.io
# Raed Neom - Fly.io Deployment Script
# ═══════════════════════════════════════════════════════════════════════════════

set -e

echo "🚀 بدء النشر على Fly.io..."

# التحقق من تسجيل الدخول
if ! fly auth whoami &> /dev/null; then
    echo "⚠️ يجب تسجيل الدخول أولاً"
    echo "📝 نفذ: fly auth login"
    exit 1
fi

# إطلاق التطبيق (أول مرة فقط)
echo "📦 إطلاق التطبيق..."
fly launch --yes --now

# إضافة متغيرات البيئة
echo "🔐 إضافة متغيرات البيئة..."
fly secrets set OPENAI_API_KEY="sk-proj-xxx"
fly secrets set OPENROUTER_API_KEY="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"

# نشر التحديثات
echo "🚀 نشر التحديثات..."
fly deploy

echo "✅ تم النشر بنجاح!"
echo "🌐 الرابط: https://raed-neom.fly.dev"

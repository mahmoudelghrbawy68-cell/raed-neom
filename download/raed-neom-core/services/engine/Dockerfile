# ═══════════════════════════════════════════════════════════════════════════════
# رائد نيوم - Dockerfile للمحرك
# ═══════════════════════════════════════════════════════════════════════════════

FROM python:3.11-slim-bookworm

LABEL maintainer="Raed Neom Team"
LABEL version="3.0.0"
LABEL description="Raed Neom AI Engine - Realtime Voice & Vision"

WORKDIR /app

# متغيرات البيئة
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONFAULTHANDLER=1
ENV PORT=8000
ENV ENVIRONMENT=production

# تثبيت المتطلبات النظامية
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# نسخ المتطلبات
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && rm -rf /root/.cache/pip

# نسخ الكود
COPY . .

# إنشاء مستخدم غير root
RUN useradd --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /app
USER appuser

# المنفذ
EXPOSE 8000

# فحص الصحة
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# التشغيل
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]

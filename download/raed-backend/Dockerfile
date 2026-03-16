# ═══════════════════════════════════════════════════════════════════════════════
# رائد نيوم - Docker Image
# ═══════════════════════════════════════════════════════════════════════════════

FROM python:3.11-slim

WORKDIR /app

# تثبيت الاعتمادات اللازمة للنظام
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# نسخ ملف المتطلبات
COPY requirements.txt .

# تثبيت المكتبات Python
RUN pip install --no-cache-dir -r requirements.txt

# نسخ التطبيق
COPY . .

# تشغيل التطبيق
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

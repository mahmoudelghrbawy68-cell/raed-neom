# ═══════════════════════════════════════════════════════════════════════════════
# رائد نيوم - Dockerfile (Fixed)
# ═══════════════════════════════════════════════════════════════════════════════

FROM python:3.11-slim

WORKDIR /app

# تثبيت المتطلبات
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ الكود
COPY main.py .

# المنفذ
EXPOSE 8000

# التشغيل
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

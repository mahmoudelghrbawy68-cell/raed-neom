// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - تكامل الواجهة مع الـ Backend
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * تكوين الـ Backend
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const WS_URL = BACKEND_URL ? BACKEND_URL.replace('http', 'ws').replace('https', 'wss') : '';

/**
 * كلاس التعامل مع Realtime Voice AI
 */
export class RaedVoiceClient {
  private ws: WebSocket | null = null;
  private sessionId: string = '';
  private onAudioCallback: ((audio: string) => void) | null = null;
  private onTextCallback: ((text: string) => void) | null = null;
  private onTranscriptCallback: ((text: string) => void) | null = null;
  private onConnectedCallback: ((data: any) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onResponseDoneCallback: (() => void) | null = null;

  /**
   * الاتصال بالـ Backend
   */
  async connect(): Promise<void> {
    if (!WS_URL) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL not configured');
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${WS_URL}/media-stream`);

        this.ws.onopen = () => {
          console.log('🎤 متصل بـ Realtime Voice AI');
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
          if (data.event === 'connected') {
            resolve();
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ خطأ في WebSocket:', error);
          this.onErrorCallback?.('فشل الاتصال');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 تم إغلاق الاتصال');
        };

        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * معالجة الرسائل الواردة
   */
  private handleMessage(data: any) {
    switch (data.event) {
      case 'connected':
        this.sessionId = data.session_id;
        this.onConnectedCallback?.(data);
        console.log('✅ جلسة:', this.sessionId);
        break;

      case 'audio':
        this.onAudioCallback?.(data.payload);
        break;

      case 'text':
        this.onTextCallback?.(data.content);
        break;

      case 'transcript':
        this.onTranscriptCallback?.(data.content);
        break;

      case 'response_done':
        this.onResponseDoneCallback?.();
        break;

      case 'error':
        this.onErrorCallback?.(data.message);
        break;
    }
  }

  /**
   * إرسال بداية التسجيل
   */
  startRecording() {
    this.ws?.send(JSON.stringify({ event: 'start' }));
  }

  /**
   * إرسال الصوت
   */
  sendAudio(audioBase64: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        event: 'media',
        payload: audioBase64
      }));
    }
  }

  /**
   * إيقاف التسجيل ومعالجة الصوت
   */
  stopRecording() {
    this.ws?.send(JSON.stringify({ event: 'stop' }));
  }

  /**
   * إغلاق الاتصال
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * التحقق من حالة الاتصال
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Setters for callbacks
  onAudio(callback: (audio: string) => void) { this.onAudioCallback = callback; }
  onText(callback: (text: string) => void) { this.onTextCallback = callback; }
  onTranscript(callback: (text: string) => void) { this.onTranscriptCallback = callback; }
  onConnected(callback: (data: any) => void) { this.onConnectedCallback = callback; }
  onError(callback: (error: string) => void) { this.onErrorCallback = callback; }
  onResponseDone(callback: () => void) { this.onResponseDoneCallback = callback; }
}

/**
 * API Helper للتواصل HTTP
 */
export const RaedAPI = {
  /**
   * فحص الصحة
   */
  async health(): Promise<any> {
    if (!BACKEND_URL) return null;
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      return response.json();
    } catch {
      return null;
    }
  },

  /**
   * الإحصائيات
   */
  async stats(): Promise<any> {
    if (!BACKEND_URL) return null;
    try {
      const response = await fetch(`${BACKEND_URL}/stats`);
      return response.json();
    } catch {
      return null;
    }
  },

  /**
   * التحقق من الترخيص
   */
  async verifyLicense(licenseKey: string): Promise<any> {
    if (!BACKEND_URL) return { valid: false };
    try {
      const response = await fetch(`${BACKEND_URL}/verify-license`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey })
      });
      return response.json();
    } catch {
      return { valid: false };
    }
  },

  /**
   * محادثة HTTP
   */
  async chat(message: string, sessionId?: string): Promise<any> {
    if (!BACKEND_URL) return null;
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId })
      });
      return response.json();
    } catch {
      return null;
    }
  }
};

export default RaedVoiceClient;

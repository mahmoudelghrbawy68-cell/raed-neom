/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                     رائد نيوم - لوحة التحكم التفاعلية
 *                     Raed Neom - Interactive Dashboard
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, Send, Sparkles,
  Volume2, VolumeX, Loader2, Bot, User, StopCircle,
  Shield, X, Gift, Heart, Crown, Wifi, WifiOff,
  TrendingUp, Users, Clock, DollarSign, BarChart3,
  Eye, Settings, RefreshCw
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════════════════════════
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  isVoice?: boolean;
}

interface Stats {
  activeSessions: number;
  totalMessages: number;
  voiceInteractions: number;
  visionInteractions: number;
  salesTriggered: number;
}

type Status = 'idle' | 'listening' | 'thinking' | 'speaking' | 'disconnected';

// ═══════════════════════════════════════════════════════════════════════════════
// مكون البطاقة الإحصائية
// ═══════════════════════════════════════════════════════════════════════════════
const StatCard = ({ icon: Icon, label, value, trend, color }: {
  icon: any;
  label: string;
  value: string | number;
  trend?: number;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4"
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
        {trend && (
          <p className={`text-xs ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// مكون فقاعة المحادثة
// ═══════════════════════════════════════════════════════════════════════════════
const ChatBubble = ({ message, isPlaying, onPlayAudio }: {
  message: Message;
  isPlaying: boolean;
  onPlayAudio: (audioUrl: string) => void;
}) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isUser
          ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
          : 'bg-gradient-to-br from-purple-500 to-pink-600'
      } shadow-lg`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative px-4 py-3 rounded-2xl backdrop-blur-sm ${
          isUser
            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white rounded-tl-sm'
            : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 text-slate-200 rounded-tr-sm'
        } shadow-lg`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {message.isVoice && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </span>
          )}
        </div>
        
        <span className="text-xs text-slate-500 px-2">
          {message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// المكون الرئيسي - لوحة التحكم
// ═══════════════════════════════════════════════════════════════════════════════
export const Dashboard: React.FC = () => {
  // الحالات
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا رائد، مساعدك الذكي الشخصي. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [showPremiumOffer, setShowPremiumOffer] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [stats, setStats] = useState<Stats>({
    activeSessions: 0,
    totalMessages: 0,
    voiceInteractions: 0,
    visionInteractions: 0,
    salesTriggered: 0,
  });
  const [showVision, setShowVision] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string>(`session_${Date.now()}`);

  // التمرير التلقائي
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // التحقق من اتصال الـ Backend
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/backend');
        const data = await response.json();
        setBackendConnected(data?.status !== 'offline');
        if (data?.stats) {
          setStats(data.stats);
        }
      } catch {
        setBackendConnected(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // إرسال رسالة
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setStatus('thinking');

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/raed/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: sessionIdRef.current,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('فشل الاتصال');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('فشل قراءة الاستجابة');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk') {
                fullContent += data.content;
                setMessages(prev => prev.map(m =>
                  m.id === assistantMessageId
                    ? { ...m, content: fullContent }
                    : m
                ));
              }
              if (data.type === 'done') setStatus('idle');
            } catch { /* ignore */ }
          }
        }
      }

      if (fullContent) {
        setMessages(prev => prev.map(m =>
          m.id === assistantMessageId
            ? { ...m, content: fullContent }
            : m
        ));
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map(m =>
        m.id === assistantMessageId
          ? { ...m, content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.' }
          : m
      ));
      setStatus('idle');
    }
  }, [messages]);

  // بدء التسجيل
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        setStatus('thinking');

        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = reader.result as string;
            const base64Audio = base64Data.split(',')[1];

            const response = await fetch('/api/raed/asr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio }),
            });

            const data = await response.json();
            if (data.text?.trim()) {
              const voiceMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: `🎤 ${data.text}`,
                timestamp: new Date(),
                isVoice: true,
              };
              setMessages(prev => [...prev, voiceMessage]);
              sendMessage(data.text);
            } else {
              setStatus('idle');
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'لم أتمكن من سماع كلام واضح. يرجى المحاولة مرة أخرى.',
                timestamp: new Date(),
              }]);
            }
          };
        } catch (error) {
          console.error('Error processing audio:', error);
          setStatus('idle');
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('listening');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('لا يمكن الوصول إلى الميكروفون');
    }
  }, [sendMessage]);

  // إيقاف التسجيل
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // إرسال النموذج
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  }, [inputText, sendMessage]);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* الخلفية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-4 p-4 min-h-screen">
        {/* الشريط الجانبي - الإحصائيات */}
        <motion.aside
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-72 flex-shrink-0"
        >
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sticky top-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white">لوحة الإحصائيات</h2>
                <p className="text-xs text-slate-400">النشاط المباشر</p>
              </div>
            </div>

            <div className="grid gap-3">
              <StatCard
                icon={Users}
                label="جلسات نشطة"
                value={stats.activeSessions}
                color="bg-cyan-500"
              />
              <StatCard
                icon={Mic}
                label="تفاعلات صوتية"
                value={stats.voiceInteractions}
                color="bg-purple-500"
              />
              <StatCard
                icon={Eye}
                label="تفاعلات بصرية"
                value={stats.visionInteractions}
                color="bg-pink-500"
              />
              <StatCard
                icon={DollarSign}
                label="مبيعات مكتشفة"
                value={stats.salesTriggered}
                color="bg-emerald-500"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-sm">
                {backendConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Backend متصل</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500">وضع SDK</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 flex flex-col">
          {/* الترويسة */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 blur-lg -z-10"
                  />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    رائد نيوم
                  </h1>
                  <p className="text-sm text-slate-400">مساعدك الذكي الشخصي v3.0</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVision(!showVision)}
                  className={`p-2 rounded-xl ${showVision ? 'bg-purple-500' : 'bg-slate-700'} transition-colors`}
                >
                  {showVision ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-slate-400" />}
                </motion.button>
              </div>
            </div>
          </motion.header>

          {/* منطقة المحادثة */}
          <div
            ref={chatContainerRef}
            className="flex-1 bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mb-4 overflow-y-auto"
          >
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isPlaying={currentPlayingId === message.audioUrl && isPlaying}
                    onPlayAudio={() => {}}
                  />
                ))}
              </AnimatePresence>

              {status === 'thinking' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-slate-700/50 border border-slate-600/30">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full bg-purple-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* منطقة الإدخال */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4"
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  disabled={status === 'thinking' || status === 'speaking'}
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!inputText.trim() || status === 'thinking'}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex-shrink-0">
                <motion.button
                  whileHover={{ scale: isRecording ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={status === 'thinking'}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/30'
                  } disabled:opacity-50`}
                >
                  {isRecording ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </motion.button>
              </div>
            </form>

            <div className="text-center mt-3 text-xs text-slate-500">
              <span>مدعوم بتقنيات الذكاء الاصطناعي المتقدمة • رائد نيوم v3.0</span>
            </div>
          </motion.footer>
        </main>
      </div>

      {/* نافذة العرض المميز */}
      <AnimatePresence>
        {showPremiumOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowPremiumOffer(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-purple-500/30 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <Crown className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-2xl font-bold text-white mb-2">عرض خاص! 🎉</h3>
                <p className="text-slate-400 mb-4">احصل على ميزات حصرية مع رائد نيوم</p>
                <button
                  onClick={() => setShowPremiumOffer(false)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white"
                >
                  لاحقاً
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

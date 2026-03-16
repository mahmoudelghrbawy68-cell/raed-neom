/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                     رائد نيوم - المنصة التعليمية الذكية                      ║
 * ║                     RAED NEOM - Smart Learning Platform                     ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  المالك: المستخدم                                                          ║
 * ║  الإصدار: 3.0.0 PRO                                                        ║
 * ║  © 2025 جميع الحقوق محفوظة                                                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, MicOff, Send, Sparkles, BookOpen, Code, BarChart3,
  Volume2, VolumeX, Loader2, Bot, User, StopCircle, Shield,
  X, Gift, Heart, Crown, Wifi, WifiOff, GraduationCap, ShoppingCart,
  ChevronRight, ChevronLeft, Play, Check
} from 'lucide-react'
import { CourseCard, InlineProductCard } from '@/components/raed/CourseCard'

// ═══════════════════════════════════════════════════════════════════════════════
// معلومات الملكية
// ═══════════════════════════════════════════════════════════════════════════════
const OWNERSHIP = {
  owner: 'المستخدم',
  product: 'رائد نيوم',
  version: '3.0.0-PRO',
  copyright: '© 2025 جميع الحقوق محفوظة',
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
  courses?: Course[]
}

interface Course {
  id: number
  title: string
  price: string
  description: string
  duration: string
  lessons: number
  rating: number
}

type Status = 'idle' | 'listening' | 'thinking' | 'speaking' | 'disconnected'

// ═══════════════════════════════════════════════════════════════════════════════
// Course Viewer - عارض الدروس
// ═══════════════════════════════════════════════════════════════════════════════
interface LessonData {
  courseId: number
  lessonId: string
  courseName: string
  formula: string
  title: string
  content: string
  example: string
  totalLessons: number
}

interface CourseInfo {
  id: number
  title: string
  formula: string
  price: string
  lessons: Array<{ id: string; title: string }>
}

const CourseViewer = ({ 
  courseId, 
  onClose 
}: { 
  courseId: number
  onClose: () => void 
}) => {
  const [course, setCourse] = useState<CourseInfo | null>(null)
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null)
  const [currentLessonId, setCurrentLessonId] = useState<string>('1')
  const [loading, setLoading] = useState(true)

  // جلب بيانات الدورة
  useEffect(() => {
    fetch('/api/raed/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourse(data.course)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [courseId])

  // جلب محتوى الدرس
  useEffect(() => {
    if (!courseId || !currentLessonId) return
    
    let cancelled = false
    
    const fetchLesson = async () => {
      setLoading(true) // eslint-disable-line react-hooks/set-state-in-effect
      try {
        const res = await fetch(`/api/raed/lessons?courseId=${courseId}&lessonId=${currentLessonId}`)
        const data = await res.json()
        if (!cancelled) {
          if (data.success) {
            setCurrentLesson(data.lesson)
          }
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }
    
    fetchLesson()
    
    return () => { cancelled = true }
  }, [courseId, currentLessonId])

  const nextLesson = () => {
    if (!course) return
    const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId)
    if (currentIndex < course.lessons.length - 1) {
      setCurrentLessonId(course.lessons[currentIndex + 1].id)
    }
  }

  const prevLesson = () => {
    if (!course) return
    const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId)
    if (currentIndex > 0) {
      setCurrentLessonId(course.lessons[currentIndex - 1].id)
    }
  }

  const currentIndex = course?.lessons.findIndex(l => l.id === currentLessonId) ?? 0
  const isFirst = currentIndex === 0
  const isLast = course ? currentIndex === course.lessons.length - 1 : false

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
              <span>إغلاق</span>
            </button>
            {course && (
              <div className="text-center flex-1 px-4">
                <h1 className="text-lg md:text-xl font-bold text-white">{course.title}</h1>
                <p className="text-sm text-cyan-400">{course.formula}</p>
              </div>
            )}
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${course?.price.includes('مجاني') ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
              {course?.price || 'مجاني'}
            </div>
          </div>
        </div>

        {/* Lessons Sidebar - Desktop */}
        <div className="max-w-4xl mx-auto flex gap-6">
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-4 bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
              <h3 className="text-sm font-bold text-slate-400 mb-3">الدروس</h3>
              <div className="space-y-2">
                {course?.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonId(lesson.id)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-all ${
                      lesson.id === currentLessonId
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        lesson.id === currentLessonId ? 'bg-cyan-500 text-white' : 'bg-slate-700'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="truncate">{lesson.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : currentLesson ? (
              <motion.div
                key={currentLessonId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden"
              >
                {/* Lesson Header */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>الدرس {currentIndex + 1} من {currentLesson.totalLessons}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{currentLesson.title}</h2>
                </div>

                {/* Lesson Content */}
                <div className="p-6 space-y-6">
                  {/* Main Content */}
                  <div className="prose prose-invert max-w-none">
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {currentLesson.content}
                    </div>
                  </div>

                  {/* Example Section */}
                  {currentLesson.example && (
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        مثال تطبيقي
                      </h4>
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto">
                        {currentLesson.example}
                      </pre>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <button
                      onClick={prevLesson}
                      disabled={isFirst}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        isFirst
                          ? 'opacity-50 cursor-not-allowed text-slate-500'
                          : 'text-white bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                      <span>الدرس السابق</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {course?.lessons.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i === currentIndex ? 'bg-cyan-400' : i < currentIndex ? 'bg-green-400' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>

                    {isLast ? (
                      <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      >
                        <Check className="w-5 h-5" />
                        <span>إنهاء الدورة</span>
                      </button>
                    ) : (
                      <button
                        onClick={nextLesson}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                      >
                        <span>الدرس التالي</span>
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                لم يتم العثور على الدرس
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Premium Offer Popup
// ═══════════════════════════════════════════════════════════════════════════════
const PremiumOfferPopup = ({ 
  onClose, 
  courses,
  onSelectCourse 
}: { 
  onClose: () => void
  courses: Course[]
  onSelectCourse: (courseId: number) => void
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-purple-500/30 shadow-2xl shadow-purple-500/20"
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-700/50 transition-colors">
        <X className="w-5 h-5 text-slate-400" />
      </button>
      
      <div className="text-center mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
        >
          <Crown className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">الدورات التعليمية 🎓</h3>
        <p className="text-slate-400">اختر الدورة المناسبة لك وابدأ رحلة التعلم</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <CourseCard
              title={course.title}
              price={course.price}
              description={course.description}
              duration={course.duration}
              lessons={course.lessons}
              rating={course.rating}
              onBuy={() => {
                onSelectCourse(course.id)
                onClose()
              }}
            />
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="w-full mt-6 py-3 rounded-xl bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
      >
        إغلاق
      </motion.button>
    </motion.div>
  </motion.div>
)

// ═══════════════════════════════════════════════════════════════════════════════
// Welcome Modal - شاشة الترحيب
// ═══════════════════════════════════════════════════════════════════════════════
const WelcomeModal = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4"
  >
    {/* Background Effects */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" />
    </div>

    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative text-center max-w-lg mx-auto"
    >
      {/* Logo */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30"
      >
        <Sparkles className="w-16 h-16 text-white" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          رائد نيوم
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-slate-300 mb-4"
      >
        مساعدك الذكي الشخصي
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-slate-400 mb-8 leading-relaxed"
      >
        مرحباً بك في عالم التعلم الذكي! أنا رائد، سأساعدك في التعلم والبرمجة واكتشاف الدورات التعليمية.
      </motion.p>

      {/* Features */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        {[
          { icon: BookOpen, text: 'التعلم والشرح' },
          { icon: Code, text: 'البرمجة' },
          { icon: GraduationCap, text: 'الدورات' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50"
          >
            <item.icon className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">{item.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
      >
        <span className="flex items-center gap-3">
          <Sparkles className="w-5 h-5" />
          ابدأ المحادثة
          <Volume2 className="w-5 h-5" />
        </span>
        
        {/* Button Glow */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl -z-10"
        />
      </motion.button>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-8 text-xs text-slate-500"
      >
        {OWNERSHIP.copyright} • {OWNERSHIP.product}
      </motion.p>
    </motion.div>
  </motion.div>
)

// ═══════════════════════════════════════════════════════════════════════════════
// Quick Actions
// ═══════════════════════════════════════════════════════════════════════════════
const QuickActions = ({ onAction, disabled }: { onAction: (text: string) => void, disabled?: boolean }) => {
  const actions = [
    { icon: BookOpen, label: 'شرح مفهوم', text: 'اشرح لي مفهوم الذكاء الاصطناعي' },
    { icon: Code, label: 'كتابة كود', text: 'اكتب لي كود بايثون لتحليل البيانات' },
    { icon: GraduationCap, label: 'الدورات', text: 'أريد معرفة الدورات المتاحة وأسعارها' },
  ]

  return (
    <div className="flex gap-2 flex-wrap justify-center mb-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onAction(action.text)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
        >
          <action.icon className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium">{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Status Badge
// ═══════════════════════════════════════════════════════════════════════════════
const StatusBadge = ({ status, mode }: { status: Status, mode: 'ai' | 'sdk' }) => {
  const statusConfig = {
    idle: { text: 'مستعد للمساعدة', color: 'bg-slate-500', icon: Sparkles },
    listening: { text: 'جاري الاستماع...', color: 'bg-cyan-500', icon: Mic },
    thinking: { text: 'جاري التفكير...', color: 'bg-purple-500', icon: Loader2 },
    speaking: { text: 'جاري التحدث...', color: 'bg-emerald-500', icon: Volume2 },
    disconnected: { text: 'غير متصل', color: 'bg-red-500', icon: WifiOff },
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3"
    >
      {/* Mode Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/70 backdrop-blur-sm border border-slate-700/50">
        {mode === 'ai' ? (
          <Sparkles className="w-3 h-3 text-purple-400" />
        ) : (
          <Wifi className="w-3 h-3 text-emerald-400" />
        )}
        <span className="text-xs text-slate-400">
          {mode === 'ai' ? 'AI SDK' : 'Online'}
        </span>
      </div>
      
      {/* Main Status */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/70 backdrop-blur-sm border border-slate-700/50">
        <motion.div
          animate={status === 'thinking' || status === 'listening' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-2 h-2 rounded-full ${config.color}`}
        />
        <config.icon className={`w-4 h-4 text-slate-400 ${status === 'thinking' ? 'animate-spin' : ''}`} />
        <span className="text-sm text-slate-300">{config.text}</span>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Chat Bubble
// ═══════════════════════════════════════════════════════════════════════════════
const ChatBubble = ({ message, isPlaying, onPlayAudio }: { 
  message: Message
  isPlaying: boolean
  onPlayAudio: (audioUrl: string) => void 
}) => {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
            : 'bg-gradient-to-br from-purple-500 to-pink-600'
        } shadow-lg`}
      >
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </motion.div>

      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative px-4 py-3 rounded-2xl backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white rounded-tl-sm'
              : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 text-slate-200 rounded-tr-sm'
          } shadow-lg`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {!isUser && message.audioUrl && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPlayAudio(message.audioUrl!)}
              className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-700/80 border border-slate-600/50 hover:border-purple-500/50 transition-colors"
            >
              {isPlaying ? <StopCircle className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
            </motion.button>
          )}
        </motion.div>
        
        {/* عرض الدورات داخل الرسالة */}
        {message.courses && message.courses.length > 0 && (
          <div className="mt-2 w-full space-y-2">
            {message.courses.map(course => (
              <InlineProductCard
                key={course.id}
                title={course.title}
                price={course.price}
                description={course.description}
                onBuy={() => {
                  setSelectedCourseId(course.id)
                }}
              />
            ))}
          </div>
        )}
        
        <span className="text-xs text-slate-500 px-2">
          {message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Voice Button
// ═══════════════════════════════════════════════════════════════════════════════
const VoiceButton = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording,
  disabled 
}: { 
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  disabled: boolean
}) => (
  <div className="relative">
    {isRecording && (
      <>
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
        />
        <motion.div
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
        />
      </>
    )}

    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={isRecording ? onStopRecording : onStartRecording}
      disabled={disabled}
      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
        isRecording
          ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/30'
          : 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/30 hover:shadow-purple-500/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isRecording ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Mic className="w-8 h-8 text-white" />
        </motion.div>
      )}
    </motion.button>

    {isRecording && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-xs text-red-400">تسجيل</span>
      </motion.div>
    )}
  </div>
)

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function RaedNeomAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const [showCourses, setShowCourses] = useState(false)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [showWelcomeModal, setShowWelcomeModal] = useState(true)
  const [welcomePlayed, setWelcomePlayed] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const sessionIdRef = useRef<string>(`session_${Date.now()}`)
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null)

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // جلب الدورات عند البداية
  useEffect(() => {
    fetch('/api/raed/products')
      .then(res => res.json())
      .then(data => {
        if (data.courses) {
          setAllCourses(data.courses)
        }
      })
      .catch(console.error)
  }, [])

  // تشغيل رسالة الترحيب الصوتية
  const playWelcomeAudio = useCallback(async () => {
    if (welcomePlayed) return
    
    const welcomeText = "مرحباً بك! أنا رائد، معلمك الذكي ومستشارك. كيف يمكنني مساعدتك في تطوير مهاراتك اليوم؟"
    
    try {
      setStatus('speaking')
      setWelcomePlayed(true)
      
      // استدعاء TTS API
      const response = await fetch('/api/raed/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: welcomeText })
      })
      
      if (!response.ok) throw new Error('فشل تحويل النص لصوت')
      
      const data = await response.json()
      
      if (data.success && data.audioBase64) {
        // تحويل base64 إلى blob
        const audioData = atob(data.audioBase64)
        const arrayBuffer = new ArrayBuffer(audioData.length)
        const view = new Uint8Array(arrayBuffer)
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i)
        }
        const blob = new Blob([arrayBuffer], { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(blob)
        
        // تشغيل الصوت
        const audio = new Audio(audioUrl)
        welcomeAudioRef.current = audio
        audio.onended = () => {
          setStatus('idle')
          URL.revokeObjectURL(audioUrl)
        }
        audio.onerror = () => {
          setStatus('idle')
          URL.revokeObjectURL(audioUrl)
        }
        await audio.play()
      }
    } catch (error) {
      console.error('Welcome audio error:', error)
      setStatus('idle')
    }
  }, [welcomePlayed])

  // بدء المحادثة بعد الترحيب
  const startConversation = useCallback(() => {
    setShowWelcomeModal(false)
    
    // إضافة رسالة الترحيب
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً! 👋 أنا رائد، مساعدك الذكي الشخصي.\n\nيمكنني مساعدتك في:\n• التعلم والشرح 📚\n• البرمجة والتقنية 💻\n• معرفة الدورات التعليمية وأسعارها 🎓\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    }])
    
    // تشغيل الصوت
    playWelcomeAudio()
  }, [playWelcomeAudio])

  // Play audio
  const playAudio = useCallback((audioUrl: string) => {
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    setIsPlaying(true)
    setCurrentPlayingId(audioUrl)
    setStatus('speaking')
    audio.onended = () => { setIsPlaying(false); setCurrentPlayingId(null); setStatus('idle') }
    audio.onerror = () => { setIsPlaying(false); setCurrentPlayingId(null); setStatus('idle') }
    audio.play()
  }, [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setIsPlaying(false)
    setCurrentPlayingId(null)
    setStatus('idle')
  }, [])

  // كشف الدورات في الرسالة
  const detectProducts = useCallback(async (message: string): Promise<Course[]> => {
    try {
      const res = await fetch('/api/raed/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await res.json()
      return data.courses || []
    } catch {
      return []
    }
  }, [])

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setStatus('thinking')

    const assistantMessageId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', timestamp: new Date() }])

    try {
      const response = await fetch('/api/raed/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text.trim(),
          sessionId: sessionIdRef.current,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      })

      if (!response.ok) throw new Error('فشل الاتصال')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('فشل قراءة الاستجابة')

      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'chunk') {
                fullContent += data.content
                setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: fullContent } : m))
              }
              if (data.type === 'done') setStatus('idle')
            } catch { /* ignore */ }
          }
        }
      }

      if (fullContent) {
        // كشف الدورات
        const courses = await detectProducts(text)
        if (courses.length > 0) {
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId 
              ? { ...m, content: fullContent, courses } 
              : m
          ))
        } else {
          setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: fullContent } : m))
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.' } : m))
      setStatus('idle')
    }
  }, [messages, detectProducts])

  // Voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => { audioChunksRef.current.push(event.data) }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        setStatus('thinking')

        try {
          const reader = new FileReader()
          reader.readAsDataURL(audioBlob)
          reader.onloadend = async () => {
            const base64Data = reader.result as string
            const base64Audio = base64Data.split(',')[1]
            
            const response = await fetch('/api/raed/asr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio }),
            })
            
            const data = await response.json()
            if (data.text?.trim()) {
              sendMessage(data.text)
            } else {
              setStatus('idle')
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'لم أتمكن من سماع كلام واضح. يرجى المحاولة مرة أخرى.',
                timestamp: new Date(),
              }])
            }
          }
        } catch (error) {
          console.error('Error processing audio:', error)
          setStatus('idle')
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setStatus('listening')
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('لا يمكن الوصول إلى الميكروفون')
    }
  }, [sendMessage])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const handlePlayAudio = useCallback((audioUrl: string) => {
    if (currentPlayingId === audioUrl && isPlaying) { stopAudio() }
    else { playAudio(audioUrl) }
  }, [currentPlayingId, isPlaying, playAudio, stopAudio])

  const handleQuickAction = useCallback((text: string) => { 
    if (text.includes('الدورات')) {
      setShowCourses(true)
    } else {
      sendMessage(text) 
    }
  }, [sendMessage])
  
  const handleSubmit = useCallback((e: React.FormEvent) => { e.preventDefault(); sendMessage(inputText) }, [inputText, sendMessage])

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 blur-lg -z-10" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">رائد نيوم</h1>
                <p className="text-sm text-slate-400">منصتك التعليمية الذكية</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCourses(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 hover:text-white transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-medium">الدورات</span>
              </motion.button>
              <StatusBadge status={status} mode="ai" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <div ref={chatContainerRef} className="h-full overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} isPlaying={currentPlayingId === message.audioUrl && isPlaying} onPlayAudio={handlePlayAudio} />
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
                      <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }} className="w-2 h-2 rounded-full bg-purple-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Input Area */}
      <motion.footer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 border-t border-slate-800/50 backdrop-blur-xl bg-slate-900/80">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <QuickActions onAction={handleQuickAction} disabled={status === 'thinking' || status === 'speaking'} />

          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                disabled={status === 'thinking' || status === 'speaking'}
                className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={!inputText.trim() || status === 'thinking' || status === 'speaking'}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex-shrink-0 pb-6">
              <VoiceButton isRecording={isRecording} onStartRecording={startRecording} onStopRecording={stopRecording} disabled={status === 'thinking' || status === 'speaking'} />
            </div>
          </form>

          {isPlaying && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stopAudio} className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors">
                <VolumeX className="w-4 h-4" />
                <span className="text-sm">إيقاف الصوت</span>
              </motion.button>
            </motion.div>
          )}

          <div className="text-center mt-4 space-y-1">
            <p className="text-xs text-slate-500">مدعوم بتقنيات الذكاء الاصطناعي المتقدمة • {OWNERSHIP.product}</p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
              <Shield className="w-3 h-3 text-cyan-500" />
              <span>المالك: {OWNERSHIP.owner}</span>
              <span className="text-slate-700">•</span>
              <span>{OWNERSHIP.copyright}</span>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Courses Popup */}
      <AnimatePresence>
        {showCourses && (
          <PremiumOfferPopup 
            onClose={() => setShowCourses(false)} 
            courses={allCourses}
            onSelectCourse={(courseId) => {
              setSelectedCourseId(courseId)
              setShowCourses(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Course Viewer */}
      <AnimatePresence>
        {selectedCourseId && (
          <CourseViewer 
            courseId={selectedCourseId}
            onClose={() => setSelectedCourseId(null)}
          />
        )}
      </AnimatePresence>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && <WelcomeModal onStart={startConversation} />}
      </AnimatePresence>
    </div>
  )
}

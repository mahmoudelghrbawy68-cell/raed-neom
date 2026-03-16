// ═══════════════════════════════════════════════════════════════════════════════
// رائد نيوم - محرك الردود الذكية المحسن v11.0
// نظام متقدم للردود المتنوعة والذكية مع LangChain + OpenRouter + GPT-5.2
// ═══════════════════════════════════════════════════════════════════════════════

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import ZAI from 'z-ai-web-dev-sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// تكوين LangChain مع OpenRouter
// ═══════════════════════════════════════════════════════════════════════════════

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// إنشاء نموذج LangChain
function createLLM(): ChatOpenAI {
  // إذا كان OpenRouter متوفر، استخدمه
  if (OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'your_openrouter_key_here') {
    console.log('🚀 Using OpenRouter via LangChain - GPT-5.2');
    return new ChatOpenAI({
      modelName: 'openai/gpt-5.2',
      temperature: 0.85,
      maxTokens: 2000,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: OPENROUTER_API_KEY,
        defaultHeaders: {
          'HTTP-Referer': 'https://raed-neom-app.vercel.app',
          'X-OpenRouter-Title': 'Raed Neom Learning Platform',
        },
      },
    });
  }
  
  // وإلا استخدم OpenAI مباشرة
  console.log('🚀 Using OpenAI directly');
  return new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.85,
    maxTokens: 2000,
    apiKey: OPENAI_API_KEY,
  });
}

// نموذج الذكاء الاصطناعي
let llmInstance: ChatOpenAI | null = null;

function getLLM(): ChatOpenAI {
  if (!llmInstance) {
    llmInstance = createLLM();
  }
  return llmInstance;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TTS - تحويل النص إلى صوت
// ═══════════════════════════════════════════════════════════════════════════════
export async function textToSpeech(text: string): Promise<Buffer> {
  try {
    // استخدام z-ai-web-dev-sdk للـ TTS
    const zai = await ZAI.create();
    const response = await zai.audio.speech.create({
      input: text,
      voice: 'alloy',
      response_format: 'mp3'
    });
    return Buffer.from(response.data, 'base64');
  } catch (error) {
    console.error('TTS Error:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASR - تحويل الصوت إلى نص
// ═══════════════════════════════════════════════════════════════════════════════
export async function transcribeAudio(audioBase64: string): Promise<string> {
  try {
    const zai = await ZAI.create();
    const response = await zai.audio.transcriptions.create({
      file: audioBase64,
      model: 'whisper-1'
    });
    return response.text || '';
  } catch (error) {
    console.error('ASR Error:', error);
    return '';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// نظام إدارة الجلسات
// ═══════════════════════════════════════════════════════════════════════════════
interface SessionData {
  history: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number; }>;
  interactionCount: number;
  createdAt: number;
}

const sessions = new Map<string, SessionData>();

function getSession(sessionId: string): SessionData {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      history: [],
      interactionCount: 0,
      createdAt: Date.now(),
    });
  }
  return sessions.get(sessionId)!;
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[؟!.,،]/g, '');
}

// ═══════════════════════════════════════════════════════════════════════════════
// System Prompt
// ═══════════════════════════════════════════════════════════════════════════════
function getSystemPrompt(): string {
  const timeOfDay = new Date().getHours();
  let timeContext = '';
  if (timeOfDay < 12) timeContext = 'صباح الخير! بداية يوم موفقة';
  else if (timeOfDay < 17) timeContext = 'مساء الخير! أتمنى أن يكون يومك جميلاً';
  else timeContext = 'مساء النور! سعيد بوجودك معنا';

  return `أنت "رائد" - المساعد الذكي الشخصي من منصة "رائد نيوم" التعليمية.

## 🎯 شخصيتك:
- أنت معلم ومستشار ذكي ودود ومتعاون
- تستخدم العربية الفصحى البسيطة والمفهومة
- تضيف إيموجي مناسب باعتدال (2-3 إيموجي)
- الوقت الحالي: ${timeContext}

## 💰 الدورات التعليمية المتاحة (مجانية بالكامل 🎁):

### 🎯 دورة تعليم احتراف هندسة الأوامر (Prompt Engineering)
- الصيغة التعليمية: المحاكاة التفاعلية
- المدة: 12 ساعة | مجاني تماماً
- الدروس: 4 دروس تفصيلية

### 🤖 دورة تعليم بناء وكلاء الذكاء الاصطناعي (AI Agents)
- الصيغة التعليمية: التعلم القائم على المشاريع
- المدة: 18 ساعة | مجاني تماماً
- الدروس: 5 دروس تفصيلية

### 🧠 دورة تعليم أساسيات تعلم الآلة (Machine Learning)
- الصيغة التعليمية: التحليل التطبيقي
- المدة: 15 ساعة | مجاني تماماً
- الدروس: 5 دروس تفصيلية

## 📚 المجالات التي تتقنها:
- البرمجة: Python, JavaScript, React, Node.js, TypeScript
- الذكاء الاصطناعي: Machine Learning, Deep Learning, NLP
- تطوير الويب: Frontend, Backend, APIs
- هندسة الأوامر: Prompt Engineering

## 📝 قواعد الرد:
- كن مختصراً ومفيداً
- قدم أمثلة عملية عند الشرح
- اسأل أسئلة تفاعلية
- لا تكرر نفس العبارات
- ركز على أن جميع الدورات مجانية`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Chat Completion - باستخدام LangChain
// ═══════════════════════════════════════════════════════════════════════════════
export async function chatCompletion(
  message: string,
  sessionId: string,
  history?: Array<{ role: string; content: string }>
): Promise<string> {
  const session = getSession(sessionId);
  
  // إضافة رسالة المستخدم للجلسة
  session.history.push({ role: 'user', content: message, timestamp: Date.now() });

  // بناء الرسائل لـ LangChain
  const messages: BaseMessage[] = [
    new SystemMessage(getSystemPrompt())
  ];

  // إضافة آخر 10 رسائل من المحادثة
  const recentHistory = session.history.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      messages.push(new HumanMessage(msg.content));
    } else {
      messages.push(new AIMessage(msg.content));
    }
  }

  // محاولة استدعاء LangChain
  try {
    console.log('🔄 Calling LangChain LLM...');
    const llm = getLLM();
    const response = await llm.invoke(messages);
    
    const responseContent = response.content.toString();
    
    if (responseContent) {
      console.log('✅ LangChain response received');
      session.history.push({ role: 'assistant', content: responseContent, timestamp: Date.now() });
      session.interactionCount++;
      return responseContent;
    }
  } catch (error) {
    console.error('❌ LangChain error:', error);
    
    // محاولة بديلة مع Z-AI-SDK
    try {
      console.log('🔄 Trying Z-AI-SDK fallback...');
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: message }
        ],
        temperature: 0.85,
        max_tokens: 1500,
      });
      
      const zaiResponse = completion.choices[0]?.message?.content;
      if (zaiResponse) {
        console.log('✅ Z-AI-SDK response received');
        session.history.push({ role: 'assistant', content: zaiResponse, timestamp: Date.now() });
        return zaiResponse;
      }
    } catch (zaiError) {
      console.error('❌ Z-AI-SDK error:', zaiError);
    }
  }

  // رد احتياطي ذكي
  console.log('⚠️ Using fallback response');
  const fallbackResponse = generateFallbackResponse(message);
  session.history.push({ role: 'assistant', content: fallbackResponse, timestamp: Date.now() });
  return fallbackResponse;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Streaming Chat - محادثة مع بث مباشر
// ═══════════════════════════════════════════════════════════════════════════════
export async function* streamChatCompletion(
  message: string,
  sessionId: string,
  history?: Array<{ role: string; content: string }>
): AsyncGenerator<string, void, unknown> {
  const session = getSession(sessionId);
  
  // إضافة رسالة المستخدم للجلسة
  session.history.push({ role: 'user', content: message, timestamp: Date.now() });

  // بناء الرسائل
  const messages: BaseMessage[] = [
    new SystemMessage(getSystemPrompt())
  ];

  const recentHistory = session.history.slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === 'user') {
      messages.push(new HumanMessage(msg.content));
    } else {
      messages.push(new AIMessage(msg.content));
    }
  }

  try {
    // استخدام LangChain مع streaming
    const llm = getLLM();
    const stream = await llm.stream(messages);
    
    let fullResponse = '';
    
    for await (const chunk of stream) {
      const content = chunk.content.toString();
      if (content) {
        fullResponse += content;
        yield content;
      }
    }

    if (fullResponse) {
      session.history.push({ role: 'assistant', content: fullResponse, timestamp: Date.now() });
      session.interactionCount++;
    }

  } catch (error) {
    console.error('Stream error:', error);
    
    // رد احتياطي
    const fallback = generateFallbackResponse(message);
    session.history.push({ role: 'assistant', content: fallback, timestamp: Date.now() });
    
    for (const char of fallback) {
      yield char;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// رد احتياطي ذكي
// ═══════════════════════════════════════════════════════════════════════════════
function generateFallbackResponse(message: string): string {
  const lower = normalizeText(message);
  
  // ترحيب
  if (/(مرحبا|أهلا|السلام عليكم|صباح الخير|مساء الخير|هاي|هلا|hello|hi)/.test(lower)) {
    return `أهلاً بك! 👋

أنا رائد، مساعدك الذكي في منصة رائد نيوم التعليمية.

**كيف أستطيع مساعدتك؟**
• 📚 تعلم البرمجة والتقنيات الحديثة
• 🤖 فهم الذكاء الاصطناعي
• 🎓 معرفة تفاصيل الدورات المجانية

جميع دوراتنا مجانية بالكامل! 🎁`;
  }

  // مساعدة
  if (/(مساعدة|ساعدني|help|ماذا تستطيع|خدماتك)/.test(lower)) {
    return `بالتأكيد! 🌟 أنا هنا لمساعدتك.

**ما أستطيع فعله لك:**

🎯 **هندسة الأوامر (Prompt Engineering)**
- كتابة أوامر احترافية للذكاء الاصطناعي

🤖 **بناء وكلاء AI**
- استخدام LangChain وبناء وكلاء أذكياء

🧠 **أساسيات تعلم الآلة**
- فهم كيف تفكر الآلة

🎁 **جميع الدورات مجانية بالكامل!**

ما الموضوع الذي يهمك؟`;
  }

  // دورات
  if (/(دورة|كورس|تعلم|سعر|كم|أسعار|مجاني)/.test(lower)) {
    return `🎓 **الدورات التعليمية المتاحة:**

**1. 🎯 هندسة الأوامر (Prompt Engineering)**
- الصيغة: المحاكاة التفاعلية
- المدة: 12 ساعة
- السعر: **مجاني تماماً** 🎁

**2. 🤖 بناء وكلاء AI**
- الصيغة: التعلم القائم على المشاريع
- المدة: 18 ساعة
- السعر: **مجاني تماماً** 🎁

**3. 🧠 أساسيات تعلم الآلة**
- الصيغة: التحليل التطبيقي
- المدة: 15 ساعة
- السعر: **مجاني تماماً** 🎁

جميع الدورات متاحة مجاناً! أي دورة تريد البدء بها؟`;
  }

  // بايثون
  if (/(بايثون|python|بيثون)/.test(lower)) {
    return `Python لغة رائعة للمبتدئين! 🐍

\`\`\`python
# مثال بسيط
name = "أحمد"
print(f"مرحباً {name}!")
\`\`\`

**لماذا Python؟**
- سهلة التعلم
- قوية في الذكاء الاصطناعي
- مجتمع كبير

هل تريد تعلم المزيد؟`;
  }

  // ذكاء اصطناعي
  if (/(ذكاء اصطناعي|ai|تعلم آلي)/.test(lower)) {
    return `الذكاء الاصطناعي مستقبل التقنية! 🤖

**مجالات AI:**
- 🧠 تعلم الآلة (Machine Learning)
- 💬 معالجة اللغة (NLP)
- 👁️ الرؤية الحاسوبية

**دوراتنا المجانية:**
1. هندسة الأوامر - للتفاعل مع AI
2. بناء وكلاء AI - لتطبيقات متقدمة
3. أساسيات تعلم الآلة - للفهم العميق

ما المجال الذي يهمك؟`;
  }

  // هندسة الأوامر
  if (/(هندسة الأوامر|prompt engineering|برومبت)/.test(lower)) {
    return `هندسة الأوامر (Prompt Engineering) فن التواصل مع الذكاء الاصطناعي! 🎯

**أساسيات كتابة الأمر الجيد:**
1. **الوضوح** - كن محدداً في طلبك
2. **السياق** - وضح الخلفية المطلوبة
3. **المثال** - قدم أمثلة عند الحاجة

**مثال عملي:**
\`\`\`
❌ "اكتب مقال"
✅ "اكتب مقالاً من 500 كلمة عن فوائد القراءة، 
    موجه للطلاب الجامعيين، بأسلوب سهل وممتع"
\`\`\`

🎁 **دورتك المجانية:**
- هندسة الأوامر - 12 ساعة - المحاكاة التفاعلية

هل تريد التسجيل؟`;
  }

  // LangChain
  if (/(langchain|لانغ تشين|لانج تشين)/.test(lower)) {
    return `LangChain إطار قوي لبناء تطبيقات الذكاء الاصطناعي! 🔗

**مميزات LangChain:**
- 📜 سلسلة الرسائل (Chains)
- 🧠 الذاكرة (Memory)
- 🔧 الأدوات (Tools)
- 🤖 الوكلاء (Agents)

**مثال بسيط:**
\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage

llm = ChatOpenAI(model="gpt-4o-mini")
response = llm.invoke([HumanMessage(content="مرحبا!")])
\`\`\`

🎁 **دورة بناء وكلاء AI** - 18 ساعة مجاناً!

هل تريد التعلم أكثر؟`;
  }

  // شكر
  if (/(شكرا|مشكور|thanks|ممتاز|رائع)/.test(lower)) {
    return `العفو! 😊 سعيد بمساعدتك.

هل هناك شيء آخر أستطيع مساعدتك به؟

🎁 لا تنسى أن جميع دوراتنا مجانية!`;
  }

  // رد افتراضي
  return `أهلاً! 👋

أنا رائد، مساعدك الذكي. أستطيع مساعدتك في:

• 📚 تعلم البرمجة (Python, JavaScript)
• 🤖 فهم الذكاء الاصطناعي
• 🔗 استخدام LangChain
• 🎓 معرفة الدورات المجانية

**جميع الدورات مجانية بالكامل!** 🎁

كيف أستطيع مساعدتك؟`;
}

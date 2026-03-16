# ═══════════════════════════════════════════════════════════════════════════════
# رائد نيوم - مولد توثيق PDF الشامل
# Raed Neom - Comprehensive PDF Documentation Generator
# ═══════════════════════════════════════════════════════════════════════════════

from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    Image, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# ═══════════════════════════════════════════════════════════════════════════════
# تسجيل الخطوط
# ═══════════════════════════════════════════════════════════════════════════════

pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Microsoft YaHei', '/usr/share/fonts/truetype/chinese/msyh.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('Microsoft YaHei', normal='Microsoft YaHei', bold='Microsoft YaHei')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# ═══════════════════════════════════════════════════════════════════════════════
# إنشاء الوثيقة
# ═══════════════════════════════════════════════════════════════════════════════

output_path = '/home/z/my-project/download/Raed_Neom_Comprehensive_Documentation.pdf'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title='Raed Neom - Comprehensive Documentation',
    author='Z.ai',
    creator='Z.ai',
    subject='Complete technical documentation for Raed Neom Smart Learning Platform'
)

# ═══════════════════════════════════════════════════════════════════════════════
# تعريف الأنماط
# ═══════════════════════════════════════════════════════════════════════════════

styles = getSampleStyleSheet()

# أنماط الغلاف
cover_title = ParagraphStyle(
    'CoverTitle',
    fontName='Microsoft YaHei',
    fontSize=36,
    leading=44,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1a365d'),
    spaceAfter=20
)

cover_subtitle = ParagraphStyle(
    'CoverSubtitle',
    fontName='SimHei',
    fontSize=18,
    leading=24,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#2d3748'),
    spaceAfter=30
)

cover_info = ParagraphStyle(
    'CoverInfo',
    fontName='Times New Roman',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#4a5568')
)

# أنماط العناوين
h1_style = ParagraphStyle(
    'H1Style',
    fontName='Microsoft YaHei',
    fontSize=22,
    leading=28,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#1a365d'),
    spaceBefore=20,
    spaceAfter=15
)

h2_style = ParagraphStyle(
    'H2Style',
    fontName='Microsoft YaHei',
    fontSize=16,
    leading=22,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#2b6cb0'),
    spaceBefore=15,
    spaceAfter=10
)

h3_style = ParagraphStyle(
    'H3Style',
    fontName='SimHei',
    fontSize=13,
    leading=18,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#3182ce'),
    spaceBefore=10,
    spaceAfter=8
)

# أنماط النص
body_style = ParagraphStyle(
    'BodyStyle',
    fontName='SimHei',
    fontSize=10.5,
    leading=16,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#2d3748'),
    wordWrap='CJK'
)

body_en = ParagraphStyle(
    'BodyEN',
    fontName='Times New Roman',
    fontSize=10.5,
    leading=16,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#2d3748')
)

code_style = ParagraphStyle(
    'CodeStyle',
    fontName='DejaVuSans',
    fontSize=8,
    leading=11,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#1a202c'),
    backColor=colors.HexColor('#f7fafc')
)

# أنماط الجداول
header_style = ParagraphStyle(
    'TableHeader',
    fontName='SimHei',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.white
)

cell_style = ParagraphStyle(
    'TableCell',
    fontName='SimHei',
    fontSize=9,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#2d3748')
)

cell_en = ParagraphStyle(
    'TableCellEN',
    fontName='Times New Roman',
    fontSize=9,
    leading=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#2d3748')
)

# ═══════════════════════════════════════════════════════════════════════════════
# بناء المحتوى
# ═══════════════════════════════════════════════════════════════════════════════

story = []

# ─────────────────────────────────────────────────────────────────────────────
# صفحة الغلاف
# ─────────────────────────────────────────────────────────────────────────────

story.append(Spacer(1, 100))
story.append(Paragraph('<b>رائد نيوم</b>', cover_title))
story.append(Paragraph('Raed Neom Smart Learning Platform', cover_subtitle))
story.append(Spacer(1, 30))
story.append(Paragraph('Version 11.0.0-PRO', cover_info))
story.append(Spacer(1, 20))
story.append(Paragraph('Comprehensive Technical Documentation', cover_info))
story.append(Spacer(1, 60))
story.append(Paragraph('Powered by GPT-5.2 via OpenRouter', cover_info))
story.append(Spacer(1, 20))
story.append(Paragraph('Owner: mahmoudelghrbawy68-cell', cover_info))
story.append(Spacer(1, 10))
story.append(Paragraph('2025 - All Rights Reserved', cover_info))

story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# جدول المحتويات
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>جدول المحتويات</b>', h1_style))
story.append(Spacer(1, 15))

toc_items = [
    ('1. نظرة عامة على المشروع', 'Project Overview'),
    ('2. المعمارية التقنية', 'Technical Architecture'),
    ('3. الميزات والوظائف', 'Features & Functionality'),
    ('4. واجهات برمجة التطبيقات (APIs)', 'API Endpoints'),
    ('5. نظام الاشتراكات والدفع', 'Subscription & Payment'),
    ('6. هيكل الدروس التفاعلية', 'Interactive Lessons Structure'),
    ('7. هيكل الملفات', 'File Structure'),
    ('8. متغيرات البيئة', 'Environment Variables'),
    ('9. خيارات النشر', 'Deployment Options'),
    ('10. الروابط والمصادر', 'Links & Resources'),
]

for ar, en in toc_items:
    story.append(Paragraph(f'<b>{ar}</b> / <font name="Times New Roman">{en}</font>', body_style))
    story.append(Spacer(1, 6))

story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# 1. نظرة عامة على المشروع
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>1. نظرة عامة على المشروع</b>', h1_style))
story.append(Spacer(1, 10))

story.append(Paragraph('''<b>رائد نيوم</b> هي منصة تعليمية ذكية تفاعلية تقدم دورات مجانية في الذكاء الاصطناعي وتعلم الآلة. تستخدم المنصة أحدث نماذج الذكاء الاصطناعي <font name="Times New Roman">GPT-5.2</font> عبر <font name="Times New Roman">OpenRouter</font> لتوفير تجربة تعليمية مخصصة وتفاعلية.''', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>الخصائص الرئيسية:</b>', h3_style))

features_data = [
    [Paragraph('<b>الميزة</b>', header_style), Paragraph('<b>الوصف</b>', header_style)],
    [Paragraph('النموذج الذكي', cell_style), Paragraph('GPT-5.2 عبر OpenRouter', cell_style)],
    [Paragraph('عدد الدورات', cell_style), Paragraph('3 دورات مجانية', cell_style)],
    [Paragraph('عدد الدروس', cell_style), Paragraph('14 درس تفاعلي', cell_style)],
    [Paragraph('ساعات المحتوى', cell_style), Paragraph('45 ساعة تعليمية', cell_style)],
    [Paragraph('نظام الاشتراكات', cell_style), Paragraph('Free / Premium / Pro', cell_style)],
    [Paragraph('الواجهة', cell_style), Paragraph('Next.js 16 + React', cell_style)],
    [Paragraph('APIs', cell_style), Paragraph('15+ نقطة نهاية', cell_style)],
]

features_table = Table(features_data, colWidths=[4*cm, 10*cm])
features_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))

story.append(features_table)
story.append(Spacer(1, 20))

# ─────────────────────────────────────────────────────────────────────────────
# 2. المعمارية التقنية
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>2. المعمارية التقنية</b>', h1_style))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>2.1 التقنيات المستخدمة</b>', h2_style))

tech_data = [
    [Paragraph('<b>الفئة</b>', header_style), Paragraph('<b>التقنية</b>', header_style), Paragraph('<b>الإصدار</b>', header_style)],
    [Paragraph('Frontend', cell_style), Paragraph('Next.js', cell_en), Paragraph('16.1.3', cell_en)],
    [Paragraph('UI Framework', cell_style), Paragraph('React', cell_en), Paragraph('19', cell_en)],
    [Paragraph('Styling', cell_style), Paragraph('Tailwind CSS', cell_en), Paragraph('4.x', cell_en)],
    [Paragraph('AI Engine', cell_style), Paragraph('LangChain + OpenRouter', cell_en), Paragraph('Latest', cell_en)],
    [Paragraph('AI Model', cell_style), Paragraph('GPT-5.2', cell_en), Paragraph('Latest', cell_en)],
    [Paragraph('Components', cell_style), Paragraph('shadcn/ui', cell_en), Paragraph('Latest', cell_en)],
    [Paragraph('Animation', cell_style), Paragraph('Framer Motion', cell_en), Paragraph('11.x', cell_en)],
    [Paragraph('Language', cell_style), Paragraph('TypeScript', cell_en), Paragraph('5.x', cell_en)],
]

tech_table = Table(tech_data, colWidths=[4*cm, 6*cm, 4*cm])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(tech_table)
story.append(Spacer(1, 15))

story.append(Paragraph('<b>2.2 معمارية النظام</b>', h2_style))

arch_text = '''يعتمد المشروع على معمارية حديثة تتكون من:

• <b>الواجهة الأمامية (Frontend):</b> تطبيق <font name="Times New Roman">Next.js 16</font> مع <font name="Times New Roman">App Router</font> يوفر واجهة مستخدم تفاعلية وسريعة.

• <b>واجهات برمجة التطبيقات (APIs):</b> مجموعة من <font name="Times New Roman">API Routes</font> داخل <font name="Times New Roman">Next.js</font> توفر خدمات المحادثة والبث المباشر والاشتراكات.

• <b>محرك الذكاء الاصطناعي:</b> يستخدم <font name="Times New Roman">LangChain</font> مع <font name="Times New Roman">OpenRouter</font> للاتصال بنموذج <font name="Times New Roman">GPT-5.2</font>.

• <b>نظام الدروس التفاعلية:</b> بنّاء دروس ديناميكي يحول البيانات إلى مكونات مرئية متنوعة.'''

story.append(Paragraph(arch_text, body_style))
story.append(Spacer(1, 20))

# ─────────────────────────────────────────────────────────────────────────────
# 3. الميزات والوظائف
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>3. الميزات والوظائف</b>', h1_style))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>3.1 الدورات التعليمية</b>', h2_style))

courses_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>الدورة</b>', header_style), Paragraph('<b>الدروس</b>', header_style), Paragraph('<b>المدة</b>', header_style), Paragraph('<b>الصيغة</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('هندسة الأوامر الذكية', cell_style), Paragraph('4', cell_style), Paragraph('12 ساعة', cell_style), Paragraph('المحاكاة التفاعلية', cell_style)],
    [Paragraph('2', cell_style), Paragraph('بناء وكلاء AI', cell_style), Paragraph('5', cell_style), Paragraph('18 ساعة', cell_style), Paragraph('التعلم بالمشاريع', cell_style)],
    [Paragraph('3', cell_style), Paragraph('أساسيات تعلم الآلة', cell_style), Paragraph('5', cell_style), Paragraph('15 ساعة', cell_style), Paragraph('التحليل التطبيقي', cell_style)],
]

courses_table = Table(courses_data, colWidths=[1*cm, 5*cm, 2*cm, 3*cm, 4*cm])
courses_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(courses_table)
story.append(Spacer(1, 15))

story.append(Paragraph('<b>3.2 ميزات إضافية</b>', h2_style))

extra_features = '''• <b>المحادثة الصوتية:</b> تسجيل صوتي مع تحويل تلقائي للنص باستخدام <font name="Times New Roman">Whisper</font>

• <b>تحويل النص لصوت:</b> استماع للردود بصوت طبيعي عبر <font name="Times New Roman">TTS API</font>

• <b>البث المباشر:</b> ردود تدريجية في الوقت الحقيقي مع <font name="Times New Roman">Server-Sent Events</font>

• <b>الاختبارات التفاعلية:</b> نظام اختبارات مع تتبع التقدم والنتائج

• <b>خطط الاشتراك:</b> ثلاث خطط (Free, Premium, Pro) مع ميزات مختلفة

• <b>واجهة RTL:</b> دعم كامل للغة العربية مع تصميم من اليمين لليسار'''

story.append(Paragraph(extra_features, body_style))
story.append(Spacer(1, 20))

# ─────────────────────────────────────────────────────────────────────────────
# 4. واجهات برمجة التطبيقات (APIs)
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>4. واجهات برمجة التطبيقات</b>', h1_style))
story.append(Spacer(1, 10))

api_data = [
    [Paragraph('<b>Endpoint</b>', header_style), Paragraph('<b>Method</b>', header_style), Paragraph('<b>الوصف</b>', header_style)],
    [Paragraph('/api/raed/stream', cell_en), Paragraph('POST', cell_en), Paragraph('محادثة مع بث مباشر GPT-5.2', cell_style)],
    [Paragraph('/api/raed/chat', cell_en), Paragraph('POST', cell_en), Paragraph('محادثة عادية', cell_style)],
    [Paragraph('/api/raed/products', cell_en), Paragraph('GET/POST', cell_en), Paragraph('قائمة الدورات', cell_style)],
    [Paragraph('/api/raed/lessons', cell_en), Paragraph('GET/POST', cell_en), Paragraph('محتوى الدروس', cell_style)],
    [Paragraph('/api/raed/lessons/interactive', cell_en), Paragraph('GET/POST', cell_en), Paragraph('دروس تفاعلية', cell_style)],
    [Paragraph('/api/raed/quiz', cell_en), Paragraph('GET/POST', cell_en), Paragraph('الاختبارات والتقدم', cell_style)],
    [Paragraph('/api/raed/subscription', cell_en), Paragraph('GET/POST', cell_en), Paragraph('نظام الاشتراكات', cell_style)],
    [Paragraph('/api/raed/support', cell_en), Paragraph('GET/POST', cell_en), Paragraph('خدمة العملاء 24/7', cell_style)],
    [Paragraph('/api/raed/tts', cell_en), Paragraph('POST', cell_en), Paragraph('تحويل النص لصوت', cell_style)],
    [Paragraph('/api/raed/asr', cell_en), Paragraph('POST', cell_en), Paragraph('تحويل الصوت لنص', cell_style)],
]

api_table = Table(api_data, colWidths=[5*cm, 2.5*cm, 6.5*cm])
api_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(api_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# 5. نظام الاشتراكات والدفع
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>5. نظام الاشتراكات والدفع</b>', h1_style))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>5.1 خطط الاشتراك</b>', h2_style))

plans_data = [
    [Paragraph('<b>الخطة</b>', header_style), Paragraph('<b>السعر</b>', header_style), Paragraph('<b>مكالمات AI</b>', header_style), Paragraph('<b>المميزات</b>', header_style)],
    [Paragraph('Free', cell_en), Paragraph('$0', cell_en), Paragraph('3/يوم', cell_style), Paragraph('دورات مجانية + شهادات', cell_style)],
    [Paragraph('Premium', cell_en), Paragraph('$9.99', cell_en), Paragraph('غير محدود', cell_style), Paragraph('جميع الميزات + دعم 24/7', cell_style)],
    [Paragraph('Pro', cell_en), Paragraph('$29.99', cell_en), Paragraph('غير محدود', cell_style), Paragraph('Premium + جلسات خاصة + VIP', cell_style)],
]

plans_table = Table(plans_data, colWidths=[2.5*cm, 2*cm, 3*cm, 7*cm])
plans_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(plans_table)
story.append(Spacer(1, 15))

story.append(Paragraph('<b>5.2 API الاشتراكات</b>', h2_style))

sub_api_text = '''<b>GET /api/raed/subscription?action=plans</b>
الحصول على جميع الخطط المتاحة.

<b>POST /api/raed/subscription</b>
• <font name="Times New Roman">action: "subscribe"</font> - اشتراك جديد
• <font name="Times New Roman">action: "cancel"</font> - إلغاء الاشتراك
• <font name="Times New Roman">action: "check-ai-call"</font> - التحقق من الحد المسموح'''

story.append(Paragraph(sub_api_text, body_style))
story.append(Spacer(1, 20))

# ─────────────────────────────────────────────────────────────────────────────
# 6. هيكل الدروس التفاعلية
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>6. هيكل الدروس التفاعلية</b>', h1_style))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>6.1 مكونات الدرس</b>', h2_style))

components_data = [
    [Paragraph('<b>المكون</b>', header_style), Paragraph('<b>الوصف</b>', header_style)],
    [Paragraph('header', cell_en), Paragraph('ترويسة الدرس مع العنوان', cell_style)],
    [Paragraph('introduction_banner', cell_en), Paragraph('مقدمة الدرس', cell_style)],
    [Paragraph('core_concept_box', cell_en), Paragraph('المفهوم الأساسي', cell_style)],
    [Paragraph('code_block', cell_en), Paragraph('مثال تطبيقي', cell_style)],
    [Paragraph('warning_alert', cell_en), Paragraph('خطأ شائع', cell_style)],
    [Paragraph('summary_card', cell_en), Paragraph('خلاصة الدرس', cell_style)],
    [Paragraph('task_card', cell_en), Paragraph('مهمة عملية', cell_style)],
    [Paragraph('interactive_quiz', cell_en), Paragraph('اختبار تفاعلي', cell_style)],
    [Paragraph('progress_indicator', cell_en), Paragraph('مؤشر التقدم', cell_style)],
]

comp_table = Table(components_data, colWidths=[4*cm, 10*cm])
comp_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(comp_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# 7. هيكل الملفات
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>7. هيكل الملفات</b>', h1_style))
story.append(Spacer(1, 10))

file_structure = '''<font name="DejaVuSans">raed-neom/
├── src/app/                           # واجهة Next.js
│   ├── api/raed/                      # APIs
│   │   ├── stream/route.ts            # بث مباشر
│   │   ├── chat/route.ts              # محادثة
│   │   ├── products/route.ts          # المنتجات
│   │   ├── lessons/route.ts           # الدروس
│   │   ├── lessons/interactive/       # دروس تفاعلية
│   │   ├── quiz/route.ts              # الاختبارات
│   │   ├── subscription/route.ts      # الاشتراكات
│   │   ├── support/route.ts           # الدعم
│   │   ├── tts/route.ts               # نص لصوت
│   │   └── asr/route.ts               # صوت لنص
│   ├── page.tsx                       # الواجهة الرئيسية
│   └── layout.tsx                     # التخطيط RTL
├── src/lib/
│   ├── raed-core.ts                   # محرك AI (GPT-5.2)
│   ├── courses-content.ts             # محتوى الدورات
│   ├── interactive-lesson-builder.ts  # بنّاء الدروس
│   └── subscription-service.ts        # خدمة الاشتراكات
├── src/components/
│   └── raed/CourseCard.tsx            # بطاقات الدورات
├── vercel.json                        # إعدادات Vercel
├── render.yaml                        # إعدادات Render
├── railway.toml                       # إعدادات Railway
├── fly.toml                           # إعدادات Fly.io
└── package.json                       # التبعيات</font>'''

story.append(Paragraph(file_structure, code_style))
story.append(Spacer(1, 20))

# ─────────────────────────────────────────────────────────────────────────────
# 8. متغيرات البيئة
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>8. متغيرات البيئة</b>', h1_style))
story.append(Spacer(1, 10))

env_data = [
    [Paragraph('<b>المتغير</b>', header_style), Paragraph('<b>مطلوب</b>', header_style), Paragraph('<b>الوصف</b>', header_style)],
    [Paragraph('OPENAI_API_KEY', cell_en), Paragraph('نعم', cell_style), Paragraph('مفتاح OpenAI للنموذج', cell_style)],
    [Paragraph('OPENROUTER_API_KEY', cell_en), Paragraph('نعم', cell_style), Paragraph('مفتاح OpenRouter بديل', cell_style)],
    [Paragraph('DATABASE_URL', cell_en), Paragraph('اختياري', cell_style), Paragraph('رابط قاعدة البيانات', cell_style)],
    [Paragraph('TELEGRAM_TOKEN', cell_en), Paragraph('اختياري', cell_style), Paragraph('توكن بوت تيليجرام', cell_style)],
    [Paragraph('ADMIN_CHAT_ID', cell_en), Paragraph('اختياري', cell_style), Paragraph('معرف المشرف', cell_style)],
    [Paragraph('NEXT_PUBLIC_BACKEND_URL', cell_en), Paragraph('اختياري', cell_style), Paragraph('رابط Backend', cell_style)],
]

env_table = Table(env_data, colWidths=[5*cm, 2*cm, 7*cm])
env_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(env_table)
story.append(Spacer(1, 20))

# ─────────────────────────────────────────────────────────────────────────────
# 9. خيارات النشر
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>9. خيارات النشر</b>', h1_style))
story.append(Spacer(1, 10))

deploy_data = [
    [Paragraph('<b>المنصة</b>', header_style), Paragraph('<b>الأمر</b>', header_style), Paragraph('<b>الحالة</b>', header_style)],
    [Paragraph('Vercel', cell_en), Paragraph('npx vercel --prod', cell_en), Paragraph('منشور', cell_style)],
    [Paragraph('GitHub', cell_en), Paragraph('git push origin master', cell_en), Paragraph('منشور', cell_style)],
    [Paragraph('Render', cell_en), Paragraph('render.yaml', cell_en), Paragraph('جاهز', cell_style)],
    [Paragraph('Railway', cell_en), Paragraph('railway up', cell_en), Paragraph('جاهز', cell_style)],
    [Paragraph('Fly.io', cell_en), Paragraph('fly launch', cell_en), Paragraph('جاهز', cell_style)],
]

deploy_table = Table(deploy_data, colWidths=[3*cm, 6*cm, 3*cm])
deploy_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(deploy_table)
story.append(Spacer(1, 20))

# ─────────────────────────────────────────────────────────────────────────────
# 10. الروابط والمصادر
# ─────────────────────────────────────────────────────────────────────────────

story.append(Paragraph('<b>10. الروابط والمصادر</b>', h1_style))
story.append(Spacer(1, 10))

links_data = [
    [Paragraph('<b>الوصف</b>', header_style), Paragraph('<b>الرابط</b>', header_style)],
    [Paragraph('الموقع الرسمي', cell_style), Paragraph('https://raed-neom-app.vercel.app', cell_en)],
    [Paragraph('GitHub Repository', cell_style), Paragraph('https://github.com/mahmoudelghrbawy68-cell/raed-neom', cell_en)],
    [Paragraph('API Products', cell_style), Paragraph('/api/raed/products', cell_en)],
    [Paragraph('API Stream', cell_style), Paragraph('/api/raed/stream', cell_en)],
    [Paragraph('API Subscription', cell_style), Paragraph('/api/raed/subscription', cell_en)],
    [Paragraph('API Lessons', cell_style), Paragraph('/api/raed/lessons/interactive', cell_en)],
]

links_table = Table(links_data, colWidths=[4*cm, 10*cm])
links_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))

story.append(links_table)
story.append(Spacer(1, 30))

# ─────────────────────────────────────────────────────────────────────────────
# صفحة الختام
# ─────────────────────────────────────────────────────────────────────────────

story.append(PageBreak())
story.append(Spacer(1, 150))
story.append(Paragraph('<b>شكراً لاستخدام رائد نيوم</b>', cover_title))
story.append(Spacer(1, 30))
story.append(Paragraph('© 2025 جميع الحقوق محفوظة', cover_info))
story.append(Paragraph('Owner: mahmoudelghrbawy68-cell', cover_info))
story.append(Paragraph('Version: 11.0.0-PRO', cover_info))
story.append(Spacer(1, 20))
story.append(Paragraph('Powered by GPT-5.2 & LangChain', cover_info))

# ═══════════════════════════════════════════════════════════════════════════════
# بناء الوثيقة
# ═══════════════════════════════════════════════════════════════════════════════

doc.build(story)
print(f"PDF created: {output_path}")

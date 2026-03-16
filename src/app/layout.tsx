import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "رائد نيوم - مساعدك الذكي الشخصي | Raed Neom",
  description: "مساعد ذكي صوتي عربي متطور - المالك: المستخدم",
  keywords: ["رائد نيوم", "مساعد ذكي", "ذكاء اصطناعي", "Neom", "AI Assistant", "Arabic"],
  authors: [{ name: "المستخدم" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "رائد نيوم - مساعدك الذكي الشخصي",
    description: "واجهة مساعد صوتي ذكي باللغة العربية",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
        <meta name="owner" content="المستخدم" />
        <meta name="copyright" content="© 2025 جميع الحقوق محفوظة للمستخدم" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Tajawal', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

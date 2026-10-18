import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "700"],
  preload: false,
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "NordicGlow 北歐旅遊企劃",
  description: "瑞典、挪威極光與峽灣深度旅遊企劃",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060b16",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant-TW"
      data-scroll-behavior="smooth"
      // Next.js 導覽時會在 <html> 暫時寫入 style="scroll-behavior:auto"，避免水合不一致警告
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${notoSerifTC.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col overflow-x-hidden font-sans">
        {/* 極光背景 */}
        <div aria-hidden className="pointer-events-none fixed inset-0">
          <div className="animate-aurora absolute -top-40 -left-40 h-[24rem] w-[24rem] md:h-[36rem] md:w-[36rem] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="animate-aurora absolute top-1/3 -right-40 h-[22rem] w-[22rem] md:h-[32rem] md:w-[32rem] rounded-full bg-cyan-400/15 blur-3xl [animation-delay:-6s]" />
          <div className="animate-aurora absolute bottom-0 left-1/4 h-[20rem] w-[20rem] md:h-[30rem] md:w-[30rem] rounded-full bg-violet-500/15 blur-3xl [animation-delay:-12s]" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

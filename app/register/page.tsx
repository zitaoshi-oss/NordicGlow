import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { glass } from "@/components/glass";
import PageNav from "@/components/PageNav";
import { RegistrationArea, SeatMeter } from "@/components/Seats";
import SectionHeading from "@/components/SectionHeading";
import { trip } from "@/lib/trip";

export const metadata: Metadata = {
  title: "線上報名｜NordicGlow 北歐旅遊企劃",
  description: `極光秘境・挪威峽灣・羅浮敦 13 日線上報名，限額 ${trip.capacity} 人，已報名者可查詢與修改資料。`,
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="grid gap-8 md:gap-10 lg:grid-cols-[2fr_3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading as="h1" eyebrow="Registration" title="線上報名" desc={`本團為${trip.type}，限額 ${trip.capacity} 人，額滿後開放候補。`} />
          <div className={`${glass} mt-8 p-6`}>
            <Suspense fallback={<p className="text-slate-300">名額查詢中…</p>}>
              <SeatMeter />
            </Suspense>
          </div>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li>✓ 送出後專人會與您確認訂金與護照資料</li>
            <li>✓ 飲食需求會提前告知所有餐廳與航空公司</li>
            <li>✓ 實際住宿以行前說明會資料為準</li>
          </ul>
          <div className={`${glass} mt-6 p-6`}>
            <h2 className="font-serif text-xl font-bold text-white">🔍 已經報名了？</h2>
            <p className="mt-2 leading-7 text-slate-300">用報名時填寫的 Email 與手機，查詢正取／候補狀態或修改報名資料。</p>
            <Link
              href="/my-registration"
              className="mt-4 inline-flex rounded-full border border-emerald-300/60 bg-emerald-300/10 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/20"
            >
              報名查詢 →
            </Link>
          </div>
        </div>
        <div className={`${glass} p-5 sm:p-8 lg:p-10`}>
          <Suspense fallback={<p className="text-slate-300">表單載入中…</p>}>
            <RegistrationArea />
          </Suspense>
        </div>
      </div>

      <PageNav current="/register" />
    </main>
  );
}

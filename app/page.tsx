import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { glass, navLinks } from "@/components/glass";
import { SeatBadge } from "@/components/Seats";
import SectionHeading from "@/components/SectionHeading";
import WelcomeName from "@/components/WelcomeName";
import { dayDate, trip } from "@/lib/trip";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 md:pb-28">
      {/* 1. 歡迎・主視覺 */}
      <section className="relative isolate mt-4 overflow-hidden rounded-[1.75rem] border border-white/15 md:mt-6 md:rounded-[2.5rem]">
        <Image
          src="/images/hero-aurora.jpg"
          alt="瑞典阿比斯庫夜空中的綠色極光"
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

        <div className="flex min-h-[82svh] flex-col justify-end gap-8 px-5 pt-28 pb-5 sm:px-8 sm:pb-8 md:gap-10 md:pt-32 lg:px-14 lg:pb-12">
          <div className="max-w-3xl">
            <WelcomeName />
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-slate-950/60 px-3 py-1.5 text-xs font-medium sm:px-4 sm:text-sm text-emerald-200 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              {trip.type}・{trip.diet} {trip.capacity} 人團・報名中
            </span>
            <h1 className="mt-6 font-serif text-[2rem] leading-[1.25] font-bold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              極光秘境
              <br />
              <span className="bg-gradient-to-r from-emerald-200 via-cyan-200 to-violet-200 bg-clip-text text-transparent">
                挪威峽灣・羅浮敦 <span className="whitespace-nowrap">13 日</span>
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:mt-6 sm:text-lg sm:leading-8">{trip.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/register"
                className="rounded-full bg-emerald-300 px-8 py-3.5 text-center font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-200"
              >
                立即報名
              </Link>
              <a
                href="#explore"
                className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                探索行程 ↓
              </a>
              <div className="text-center sm:ml-4 sm:text-left">
                <Suspense fallback={<span className="text-slate-300">名額查詢中…</span>}>
                  <SeatBadge />
                </Suspense>
              </div>
            </div>
          </div>

          <dl className={`${glass} grid grid-cols-2 divide-white/10 lg:grid-cols-4 lg:divide-x`}>
            {[
              ["出發日期", `2027/${dayDate(1)}`],
              ["旅遊天數", `${trip.days} 天・${trip.returnDate} 返台`],
              ["團體人數", `${trip.capacity} 人`],
              ["餐食", trip.diet],
            ].map(([label, value]) => (
              <div key={label} className="px-4 py-4 sm:px-6 sm:py-5">
                <dt className="text-xs text-slate-300 sm:text-sm">{label}</dt>
                <dd className="mt-1 font-serif text-lg font-bold text-white sm:text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2–7. 各區塊入口，點擊前往對應分頁 */}
      <section id="explore" className="scroll-mt-28 pt-20 md:pt-28">
        <SectionHeading eyebrow="Explore" title="探索這趟旅程" desc="從行程亮點、每日安排、景點故事到素食準備與報名，點選區塊查看完整內容。" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {navLinks.map((link, i) => (
            <Link key={link.href} href={link.href} className={`${glass} group flex flex-col overflow-hidden`}>
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={link.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 370px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <span className="absolute bottom-3 left-5 font-mono text-sm text-emerald-300">0{i + 2}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-serif text-2xl font-bold text-white">
                  <span aria-hidden>{link.icon}</span> {link.label}
                </h2>
                <p className="mt-2 flex-1 leading-7 text-slate-300">{link.desc}</p>
                <span className="mt-5 inline-flex w-fit rounded-full border border-emerald-300/60 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100 transition group-hover:bg-emerald-300 group-hover:text-slate-950">
                  {link.href === "/register" ? "報名・查詢報名" : `前往${link.label}`} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

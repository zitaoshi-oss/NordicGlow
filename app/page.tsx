import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { glass } from "@/components/glass";
import RegistrationForm from "@/components/RegistrationForm";
import SectionHeading from "@/components/SectionHeading";
import WelcomeName from "@/components/WelcomeName";
import { readRegistrations } from "@/lib/registrations";
import { dayDate, days, dietTips, features, mapLink, phrases, trip, type Day } from "@/lib/trip";

async function getSeats() {
  await connection();
  const list = await readRegistrations();
  const confirmed = list.filter((r) => r.status === "正取").length;
  return { confirmed, left: Math.max(trip.capacity - confirmed, 0) };
}

async function SeatBadge() {
  const { left } = await getSeats();
  return left > 0 ? (
    <span className="text-emerald-200">
      剩餘 <strong className="font-serif text-2xl text-white">{left}</strong> / {trip.capacity} 席
    </span>
  ) : (
    <span className="text-amber-200">正取已額滿・開放候補</span>
  );
}

async function SeatMeter() {
  const { confirmed, left } = await getSeats();
  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="text-slate-200">已報名</p>
        <p className="text-white">
          <span className="font-serif text-4xl font-bold">{confirmed}</span>
          <span className="text-slate-300"> / {trip.capacity} 人</span>
        </p>
      </div>
      <div className="mt-3 grid grid-cols-8 gap-1.5" aria-hidden>
        {Array.from({ length: trip.capacity }, (_, i) => (
          <span key={i} className={`h-3 rounded-full ${i < confirmed ? "bg-emerald-300" : "bg-white/15"}`} />
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {left > 0 ? `尚有 ${left} 個正取名額` : "正取名額已滿，仍可登記候補"}
      </p>
    </div>
  );
}

async function RegistrationArea() {
  const { left } = await getSeats();
  return <RegistrationForm full={left === 0} />;
}

const linkPill =
  "inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-emerald-300 hover:text-emerald-200";

const lists = [
  { key: "mustSee", icon: "👀", label: "必看" },
  { key: "mustEat", icon: "🥛", label: "必吃（奶素）" },
  { key: "mustBuy", icon: "🛍️", label: "必買" },
] as const;

function DayCard({ d }: { d: Day }) {
  const hasGuide = d.mustSee.length + d.mustEat.length + d.mustBuy.length > 0;
  return (
    <article id={`day-${d.day}`} className="scroll-mt-28">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
        <div className="flex min-w-0 items-end gap-3 sm:gap-4">
          <span className="shrink-0 font-serif text-5xl leading-none sm:text-7xl font-bold text-transparent [-webkit-text-stroke:1.5px_#6ee7b7] select-none">
            {String(d.day).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.3em] text-emerald-300 sm:text-sm">
              DAY {d.day}
              <span className="ml-3 tracking-normal text-slate-200">2027/{dayDate(d.day)}</span>
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl">{d.title}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:ml-auto">
          {d.flight && (
            <span className="rounded-full border border-white/25 bg-slate-950/50 px-3 py-1 font-mono text-sm text-slate-100">
              ✈ {d.flight}
            </span>
          )}
          {d.aurora && (
            <span className="rounded-full border border-emerald-300/60 bg-emerald-300/15 px-3 py-1 text-sm text-emerald-100">
              🌌 極光觀測夜
            </span>
          )}
        </div>
      </header>
      <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">{d.route}</p>

      <div className={`${glass} mt-6 overflow-hidden`}>
        {d.image && (
          <div className={`grid gap-1 ${d.gallery ? "md:grid-cols-[2fr_1fr]" : ""}`}>
            <div className="relative h-52 sm:h-72 md:h-80">
              <Image src={d.image} alt={d.imageAlt ?? d.title} fill sizes="(max-width: 1152px) 100vw, 760px" className="object-cover" />
            </div>
            {d.gallery && (
              <div className="grid grid-cols-2 gap-1 md:grid-cols-1">
                {d.gallery.map((g) => (
                  <div key={g.src} className="relative h-28 sm:h-40 md:h-auto">
                    <Image src={g.src} alt={g.alt} fill sizes="(max-width: 768px) 50vw, 380px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-6 p-5 sm:space-y-8 sm:p-8 lg:p-10">
          <p className="text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">{d.intro}</p>

          {d.spots.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {d.spots.map((spot) => (
                <div key={spot.name} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                  <h4 className="font-serif text-lg font-bold text-white">📍 {spot.name}</h4>
                  <p className="mt-2 leading-7 text-slate-300">{spot.desc}</p>
                  {spot.hours && (
                    <p className="mt-3 flex gap-2 text-sm leading-6 text-emerald-100">
                      <span aria-hidden>🕒</span>
                      <span>
                        <span className="font-medium text-emerald-300">營業時間：</span>
                        {spot.hours}
                      </span>
                    </p>
                  )}
                  {spot.website && (
                    <a href={spot.website} target="_blank" rel="noopener noreferrer" className={`${linkPill} mt-3`}>
                      🌐 官方網站
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasGuide && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lists.map(({ key, icon, label }) =>
                d[key].length > 0 ? (
                  <div key={key} className="rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.06] p-5">
                    <h4 className="font-bold text-emerald-200">
                      {icon} {label}
                    </h4>
                    <ul className="mt-3 space-y-2 text-slate-100">
                      {d[key].map((item) => (
                        <li key={item} className="flex gap-2 leading-7">
                          <span className="text-emerald-300">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
          )}

          {(d.veg.length > 0 || d.vegNote) && (
            <div className="rounded-2xl border border-lime-300/30 bg-lime-300/[0.06] p-5">
              <h4 className="font-bold text-lime-200">🌿 附近素食・素食友善店家</h4>
              {d.veg.length > 0 && (
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {d.veg.map((v) => (
                    <li key={v.name} className="rounded-xl bg-slate-950/50 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white">{v.name}</span>
                        <span className="rounded-full bg-lime-300 px-2 py-0.5 text-xs font-bold text-slate-950">{v.type}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{v.area}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{v.note}</p>
                      <p className="mt-2 flex gap-2 text-sm leading-6 text-lime-100">
                        <span aria-hidden>🕒</span>
                        <span>{v.hours}</span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a href={mapLink(`${v.name}, ${v.address}`)} target="_blank" rel="noopener noreferrer" className={linkPill}>
                          🗺️ 地圖
                        </a>
                        {v.website && (
                          <a href={v.website} target="_blank" rel="noopener noreferrer" className={linkPill}>
                            🌐 網站
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {d.vegNote && <p className="mt-3 leading-7 text-slate-200">{d.vegNote}</p>}
            </div>
          )}

          {d.warning && (
            <p className="rounded-2xl border border-amber-300/50 bg-amber-300/10 p-5 leading-7 text-amber-100">⚠️ {d.warning}</p>
          )}

          <dl className="grid grid-cols-2 gap-4 border-t border-white/15 pt-6 text-sm lg:grid-cols-4">
            {[
              ["早餐", d.meals.breakfast],
              ["午餐", d.meals.lunch],
              ["晚餐", d.meals.dinner],
              ["住宿", d.hotel],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-medium text-emerald-300">{label}</dt>
                <dd className="mt-1 leading-6 text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* 主視覺 */}
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
              <a
                href="#register"
                className="rounded-full bg-emerald-300 px-8 py-3.5 text-center font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-200"
              >
                立即報名
              </a>
              <a
                href="#itinerary"
                className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                每日行程 →
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

      {/* 行程特色 */}
      <section id="features" className="scroll-mt-28 pt-20 md:pt-28">
        <SectionHeading eyebrow="Highlights" title="精選八大行程特色" desc={`${trip.gateway}，13 天走訪挪威峽灣、羅浮敦群島、瑞典拉普蘭與兩國首都。`} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 md:mt-12 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={f.title} className={`${glass} p-6`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{f.icon}</span>
                <span className="font-mono text-sm text-emerald-300">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">{f.title}</h3>
              <p className="mt-2 leading-7 text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-400">※ 極光屬自然現象，受天候、雲量及太陽活動影響，無法保證觀賞成功。</p>
      </section>

      {/* 每日行程 */}
      <section id="itinerary" className="scroll-mt-28 pt-20 md:pt-28">
        <SectionHeading eyebrow="Itinerary" title="每日行程" desc="每一天的景點特色、必看必吃必買，以及附近的素食與素食友善店家。" />
        <nav
          aria-label="快速跳到某一天"
          className="-mx-4 mt-8 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {days.map((d) => (
            <a
              key={d.day}
              href={`#day-${d.day}`}
              className="shrink-0 snap-start rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-sm whitespace-nowrap text-slate-100 transition hover:border-emerald-300 hover:text-emerald-200"
            >
              <span className="text-emerald-300">{dayDate(d.day).slice(0, 5)}</span> {d.title.split("・")[0]}
            </a>
          ))}
        </nav>
        <div className="mt-10 space-y-14 md:mt-14 md:space-y-20">
          {days.map((d) => (
            <DayCard key={d.day} d={d} />
          ))}
        </div>
      </section>

      {/* 素食指南 */}
      <section id="diet" className="scroll-mt-28 pt-20 md:pt-28">
        <SectionHeading eyebrow="Lacto-Vegetarian" title="奶素旅行指南" desc="北歐素食選擇越來越多，但仍有幾個容易踩雷的地方，出發前先了解。" />
        <div className="mt-8 grid gap-4 sm:gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {dietTips.map((tip) => (
            <div key={tip.title} className={`${glass} p-6`}>
              <h3 className="font-serif text-xl font-bold text-white">⚠️ 注意{tip.title}</h3>
              <p className="mt-2 leading-7 text-slate-300">{tip.desc}</p>
            </div>
          ))}
          <div className={`${glass} border-emerald-300/50 p-6`}>
            <h3 className="font-serif text-xl font-bold text-white">💬 點餐小卡</h3>
            <dl className="mt-3 space-y-3">
              {phrases.map((p) => (
                <div key={p.lang}>
                  <dt className="text-sm text-emerald-300">{p.lang}</dt>
                  <dd className="leading-7 text-white">{p.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 報名 */}
      <section id="register" className="scroll-mt-28 py-20 md:py-28">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Registration" title="線上報名" desc={`本團為${trip.type}，限額 ${trip.capacity} 人，額滿後開放候補。`} />
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
          </div>
          <div className={`${glass} p-5 sm:p-8 lg:p-10`}>
            <Suspense fallback={<p className="text-slate-300">表單載入中…</p>}>
              <RegistrationArea />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

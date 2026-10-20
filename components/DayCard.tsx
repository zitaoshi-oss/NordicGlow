import Image from "next/image";
import { glass } from "./glass";
import { dayDate, mapLink, type Day } from "@/lib/trip";

const linkPill =
  "inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:border-emerald-300 hover:text-emerald-200";

const lists = [
  { key: "mustSee", icon: "👀", label: "必看" },
  { key: "mustEat", icon: "🥛", label: "必吃（奶素）" },
  { key: "mustBuy", icon: "🛍️", label: "必買" },
] as const;

export default function DayCard({ d }: { d: Day }) {
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

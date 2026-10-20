import Image from "next/image";
import Link from "next/link";
import { glass } from "./glass";
import PageNav from "./PageNav";
import { countries, topics, type Country } from "@/lib/countries";

// 國旗用 SVG 繪製：Windows 不支援國旗 emoji，會顯示成 SE、NO 字母
function Flag({ slug, className }: { slug: Country["slug"]; className?: string }) {
  return slug === "sweden" ? (
    <svg viewBox="0 0 16 10" className={className} aria-hidden>
      <rect width="16" height="10" fill="#006aa7" />
      <rect x="5" width="2" height="10" fill="#fecc02" />
      <rect y="4" width="16" height="2" fill="#fecc02" />
    </svg>
  ) : (
    <svg viewBox="0 0 22 16" className={className} aria-hidden>
      <rect width="22" height="16" fill="#ba0c2f" />
      <rect x="6" width="4" height="16" fill="#fff" />
      <rect y="6" width="22" height="4" fill="#fff" />
      <rect x="7" width="2" height="16" fill="#00205b" />
      <rect y="7" width="22" height="2" fill="#00205b" />
    </svg>
  );
}

export default function CountryPage({ country }: { country: Country }) {
  const other = country.slug === "sweden" ? countries.norway : countries.sweden;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 md:pb-28">
      {/* 國家主視覺與基本資料 */}
      <section className="relative isolate mt-4 overflow-hidden rounded-[1.75rem] border border-white/15 md:mt-6 md:rounded-[2.5rem]">
        <Image src={country.image} alt={country.imageAlt} fill priority sizes="(max-width: 1152px) 100vw, 1152px" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

        <div className="flex min-h-[60svh] flex-col justify-end gap-8 px-5 pt-24 pb-5 sm:px-8 sm:pb-8 lg:px-14 lg:pb-12">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-emerald-300 uppercase">
              <span className="h-px w-10 bg-emerald-300" />
              Discover {country.nameEn}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              <Flag slug={country.slug} className="mr-3 inline-block h-[0.7em] w-auto rounded-sm align-baseline shadow-lg" />
              認識{country.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">{country.tagline}</p>
          </div>

          <dl className={`${glass} grid grid-cols-2 divide-white/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x`}>
            {country.facts.map(([label, value]) => (
              <div key={label} className="px-4 py-4 sm:px-5">
                <dt className="text-xs text-slate-300 sm:text-sm">{label}</dt>
                <dd className="mt-1 font-serif text-base font-bold text-white sm:text-lg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 六大主題快速跳轉 */}
      <nav
        aria-label="快速跳到主題"
        className="-mx-4 mt-8 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {topics.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="shrink-0 snap-start rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-sm whitespace-nowrap text-slate-100 transition hover:border-emerald-300 hover:text-emerald-200"
          >
            <span aria-hidden>{t.icon}</span> {t.label}
          </a>
        ))}
      </nav>

      <p className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-300/[0.06] px-5 py-4 leading-7 text-emerald-50">
        🧭 {country.tripNote}
      </p>

      <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
        {country.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <header className="flex items-end gap-4">
              <span className="font-serif text-5xl leading-none font-bold text-transparent select-none [-webkit-text-stroke:1.5px_#6ee7b7] sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-xs font-medium tracking-[0.3em] text-emerald-300 uppercase sm:text-sm">{s.eyebrow}</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  <span aria-hidden>{s.icon}</span> {s.title}
                </h2>
              </div>
            </header>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">{s.intro}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.points.map((p) => (
                <div key={p.title} className={`${glass} p-6`}>
                  <h3 className="font-serif text-lg font-bold text-white">{p.title}</h3>
                  <p className="mt-2 leading-7 text-slate-300">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-xs leading-6 text-slate-400">※ 人口、面積等數字為約略值，僅供行前認識參考。</p>

      <Link
        href={`/${other.slug}`}
        className={`${glass} group mt-10 flex items-center justify-between gap-4 p-6 transition hover:border-emerald-300/60`}
      >
        <span>
          <span className="text-sm text-slate-400">繼續認識另一個國家</span>
          <span className="mt-1 block font-serif text-2xl font-bold text-white">
            <Flag slug={other.slug} className="mr-2 inline-block h-[0.75em] w-auto rounded-sm align-baseline" />
            認識{other.name}
          </span>
        </span>
        <span className="text-2xl text-emerald-300 transition group-hover:translate-x-1">→</span>
      </Link>

      <PageNav current={`/${country.slug}`} />
    </main>
  );
}

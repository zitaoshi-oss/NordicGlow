"use client";

import "leaflet/dist/leaflet.css";
import type { LatLngBoundsExpression, Map as LeafletMap, Marker, Polyline } from "leaflet";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { glass } from "./glass";
import { dayDate } from "@/lib/trip";
import { legPath, mapStops, routeLegs, themePosts, transportModes, type TransportMode } from "@/lib/tripMap";

const tripDays = [...new Set(mapStops.map((s) => s.day))];
const LABEL_ZOOM = 7; // 放大到這個層級以上才顯示所有景點名稱，避免整張北歐圖時文字重疊

export default function TripMap() {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const legs = useRef<{ day: number; line: Polyline }[]>([]);
  const [day, setDay] = useState<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Leaflet 會直接操作 window，所以只在瀏覽器端動態載入
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !container.current) return;
      const m = L.map(container.current, { scrollWheelZoom: false, zoomSnap: 0.5 });
      map.current = m;

      // OpenStreetMap 底圖免金鑰；深色效果由 globals.css 的 .trip-map-tiles 濾鏡處理
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: "trip-map-tiles",
        maxZoom: 18,
      }).addTo(m);

      // 點一下地圖才啟用滾輪縮放，避免捲動頁面時被地圖攔截
      m.on("focus", () => m.scrollWheelZoom.enable());
      m.on("blur", () => m.scrollWheelZoom.disable());
      const syncLabels = () => container.current?.classList.toggle("trip-map--labels", m.getZoom() >= LABEL_ZOOM);
      m.on("zoomend", syncLabels);

      legs.current = routeLegs.map((leg) => {
        const mode = transportModes[leg.mode];
        const line = L.polyline(legPath(leg), {
          color: mode.color,
          weight: leg.mode === "flight" ? 2 : 3.5,
          dashArray: mode.dash,
          lineCap: "round",
          opacity: 0.9,
        })
          .bindTooltip(`${mode.icon} DAY ${leg.day}｜${leg.from} → ${leg.to}`, { sticky: true, className: "trip-map-tooltip" })
          .addTo(m);
        return { day: leg.day, line };
      });

      mapStops.forEach((stop, i) => {
        const marker = L.marker([stop.lat, stop.lng], {
          title: `${stop.name}（DAY ${stop.day}）`,
          riseOnHover: true,
          icon: L.divIcon({
            className: "trip-stop",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            html: `<span class="trip-stop__dot">${i + 1}</span><span class="trip-stop__label">${stop.name}${stop.aurora ? " 🌌" : ""}</span>`,
          }),
        })
          .on("click", () => router.push(`/blog/${stop.slug}`))
          .on("mouseover", () => setHovered(stop.slug))
          .on("mouseout", () => setHovered(null))
          .addTo(m);
        markers.current.set(stop.slug, marker);
      });

      m.fitBounds(allBounds(), { padding: [24, 24] });
      syncLabels();
    });

    const markerMap = markers.current;
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markerMap.clear();
      legs.current = [];
    };
  }, [router]);

  // 選擇某一天：只突顯當天的景點與動線，並把地圖移到那一區
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    legs.current.forEach(({ day: d, line }) => line.setStyle({ opacity: day === null || d === day ? 0.9 : 0.12 }));
    markers.current.forEach((marker, slug) => {
      const stop = mapStops.find((s) => s.slug === slug)!;
      marker.getElement()?.classList.toggle("trip-stop--dim", day !== null && stop.day !== day);
    });
    if (day === null) {
      m.flyToBounds(allBounds(), { padding: [24, 24], duration: 0.8 });
    } else {
      const points = [
        ...mapStops.filter((s) => s.day === day).map((s) => [s.lat, s.lng] as [number, number]),
        ...routeLegs.filter((l) => l.day === day).flatMap((l) => l.path),
      ];
      m.flyToBounds(points, { padding: [48, 48], maxZoom: 13, duration: 0.8 });
    }
  }, [day]);

  useEffect(() => {
    markers.current.forEach((marker, slug) => marker.getElement()?.classList.toggle("trip-stop--active", slug === hovered));
  }, [hovered]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
      <div className={`${glass} relative isolate overflow-hidden p-0`}>
        <div ref={container} className="trip-map h-[62svh] min-h-96 w-full lg:h-[44rem]" aria-label="行程景點與交通動線地圖" role="region" />
        <Legend />
      </div>

      <aside className={`${glass} flex flex-col p-5 lg:max-h-[44rem]`}>
        <h2 className="font-serif text-lg font-bold text-white">依天數查看</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <DayChip active={day === null} onClick={() => setDay(null)}>
            全部
          </DayChip>
          {tripDays.map((d) => (
            <DayChip key={d} active={day === d} onClick={() => setDay(d)}>
              DAY {d}
            </DayChip>
          ))}
        </div>

        <p className="mt-5 text-sm text-slate-300">點擊景點名稱，閱讀介紹文章</p>
        <ol className="mt-3 -mr-2 flex-1 space-y-4 overflow-y-auto pr-2">
          {tripDays
            .filter((d) => day === null || d === day)
            .map((d) => (
              <li key={d}>
                <p className="text-xs text-slate-400">
                  <span className="font-medium tracking-[0.2em] text-emerald-300">DAY {d}</span> {dayDate(d)}
                </p>
                <ul className="mt-2 space-y-2">
                  {mapStops.map((stop, i) =>
                    stop.day !== d ? null : (
                      <li key={stop.slug}>
                        <Link
                          href={`/blog/${stop.slug}`}
                          onMouseEnter={() => setHovered(stop.slug)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(stop.slug)}
                          onBlur={() => setHovered(null)}
                          className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${
                            hovered === stop.slug
                              ? "border-emerald-300/70 bg-emerald-300/15 text-white"
                              : "border-white/15 bg-white/5 text-slate-100 hover:border-emerald-300/70 hover:bg-emerald-300/15"
                          }`}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-xs font-bold text-slate-900">
                            {i + 1}
                          </span>
                          <span className="flex-1 font-medium">
                            {stop.name}
                            {stop.aurora && <span title="極光觀測夜"> 🌌</span>}
                          </span>
                          <span aria-hidden className="text-emerald-300">
                            →
                          </span>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </li>
            ))}
        </ol>

        <div className="mt-5 border-t border-white/15 pt-4">
          <p className="text-xs text-slate-400">主題文章</p>
          {themePosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="mt-2 flex items-center gap-3 rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-3 py-2.5 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/20"
            >
              <span aria-hidden>{post.icon}</span>
              <span className="flex-1">{post.name}</span>
              <span aria-hidden className="text-cyan-300">
                →
              </span>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}

function allBounds(): LatLngBoundsExpression {
  return [...mapStops.map((s) => [s.lat, s.lng] as [number, number]), ...routeLegs.flatMap((l) => l.path)];
}

function DayChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active ? "border-emerald-300 bg-emerald-300 text-slate-900" : "border-white/20 text-slate-200 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Legend() {
  return (
    <ul className="pointer-events-none absolute bottom-7 left-3 z-[1000] space-y-1.5 rounded-2xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 backdrop-blur">
      {(Object.keys(transportModes) as TransportMode[]).map((key) => {
        const mode = transportModes[key];
        return (
          <li key={key} className="flex items-center gap-2">
            <svg width="28" height="6" aria-hidden>
              <line x1="2" y1="3" x2="26" y2="3" stroke={mode.color} strokeWidth="3" strokeDasharray={mode.dash} strokeLinecap="round" />
            </svg>
            {mode.icon} {mode.label}
          </li>
        );
      })}
      <li className="flex items-center gap-2">
        <span className="ml-1.5 h-4 w-4 rounded-full bg-emerald-300" aria-hidden />
        <span className="ml-1.5">景點（點擊開啟文章）</span>
      </li>
    </ul>
  );
}

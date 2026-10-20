import type { Metadata } from "next";
import DayCard from "@/components/DayCard";
import PageNav from "@/components/PageNav";
import SectionHeading from "@/components/SectionHeading";
import { dayDate, days } from "@/lib/trip";

export const metadata: Metadata = {
  title: "每日行程｜NordicGlow 北歐旅遊企劃",
  description: "13 天每日行程：景點特色、必看必吃必買、附近素食店家、餐食與住宿。",
};

export default function ItineraryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
      <SectionHeading as="h1" eyebrow="Itinerary" title="每日行程" desc="每一天的景點特色、必看必吃必買，以及附近的素食與素食友善店家。" />
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

      <PageNav current="/itinerary" />
    </main>
  );
}

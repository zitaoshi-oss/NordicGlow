import type { Metadata } from "next";
import { glass } from "@/components/glass";
import PageNav from "@/components/PageNav";
import SectionHeading from "@/components/SectionHeading";
import { dietTips, phrases } from "@/lib/trip";

export const metadata: Metadata = {
  title: "素食指南｜NordicGlow 北歐旅遊企劃",
  description: "北歐奶素旅行注意事項，以及挪威文、瑞典文、英文點餐小卡。",
};

export default function DietPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
      <SectionHeading
        as="h1"
        eyebrow="Lacto-Vegetarian"
        title="奶素旅行指南"
        desc="北歐素食選擇越來越多，但仍有幾個容易踩雷的地方，出發前先了解。"
      />
      <div className="mt-8 grid gap-4 sm:gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
        {dietTips.map((tip) => (
          <div key={tip.title} className={`${glass} p-6`}>
            <h2 className="font-serif text-xl font-bold text-white">⚠️ 注意{tip.title}</h2>
            <p className="mt-2 leading-7 text-slate-300">{tip.desc}</p>
          </div>
        ))}
        <div className={`${glass} border-emerald-300/50 p-6`}>
          <h2 className="font-serif text-xl font-bold text-white">💬 點餐小卡</h2>
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

      <PageNav current="/diet" />
    </main>
  );
}

import type { Metadata } from "next";
import { glass } from "@/components/glass";
import PageNav from "@/components/PageNav";
import SectionHeading from "@/components/SectionHeading";
import { features, trip } from "@/lib/trip";

export const metadata: Metadata = {
  title: "行程特色｜NordicGlow 北歐旅遊企劃",
  description: "北極圈三夜極光、雙峽灣巡禮、雙景觀鐵道與羅浮敦漁屋，精選八大行程特色。",
};

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
      <SectionHeading
        as="h1"
        eyebrow="Highlights"
        title="精選八大行程特色"
        desc={`${trip.gateway}，13 天走訪挪威峽灣、羅浮敦群島、瑞典拉普蘭與兩國首都。`}
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 md:mt-12 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={f.title} className={`${glass} p-6`}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{f.icon}</span>
              <span className="font-mono text-sm text-emerald-300">0{i + 1}</span>
            </div>
            <h2 className="mt-4 font-serif text-xl font-bold text-white">{f.title}</h2>
            <p className="mt-2 leading-7 text-slate-300">{f.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-400">※ 極光屬自然現象，受天候、雲量及太陽活動影響，無法保證觀賞成功。</p>

      <PageNav current="/features" />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import TripMap from "@/components/TripMap";
import { mapStops } from "@/lib/tripMap";

export const metadata: Metadata = {
  title: "景點地圖｜NordicGlow 北歐旅遊企劃",
  description: "在地圖上看 13 天行程的每個景點與交通動線，點擊景點即可閱讀介紹文章。",
};

export default function BlogMapPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-12 md:pb-28">
      <Link href="/blog" className="text-sm text-slate-300 transition hover:text-emerald-200">
        ← 所有景點文章
      </Link>

      <div className="mt-6">
        <SectionHeading
          as="h1"
          eyebrow="Route Map"
          title="景點地圖"
          desc={`從奧斯陸、峽灣、羅浮敦一路到斯德哥爾摩，${mapStops.length} 個景點依行程順序編號，線條標示每天的交通方式。點擊景點名稱或地圖標點，就能開啟該景點的介紹文章。`}
        />
      </div>

      <div className="mt-10 md:mt-14">
        <TripMap />
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-400">
        ※ 動線為示意路線，實際行車路線、渡輪與航班依當地交通狀況調整。去回程的國際航班（高雄－曼谷－北歐）未繪於地圖上。
      </p>
    </main>
  );
}

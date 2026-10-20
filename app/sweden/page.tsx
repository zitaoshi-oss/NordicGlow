import type { Metadata } from "next";
import CountryPage from "@/components/CountryPage";
import { sweden } from "@/lib/countries";

export const metadata: Metadata = {
  title: "認識瑞典｜NordicGlow 北歐旅遊企劃",
  description: "瑞典的歷史國族、政治法治、地理環境、經濟發展、文化與社會，以及日常生活小細節。",
};

export default function SwedenPage() {
  return <CountryPage country={sweden} />;
}

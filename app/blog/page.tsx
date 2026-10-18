import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { glass } from "@/components/glass";
import SectionHeading from "@/components/SectionHeading";
import { posts, readingMinutes } from "@/lib/blog";
import { dayDate } from "@/lib/trip";

export const metadata: Metadata = {
  title: "景點文章｜NordicGlow 北歐旅遊企劃",
  description: "挪威峽灣、羅浮敦群島、瑞典拉普蘭與斯德哥爾摩，行程中每個景點的深度介紹。",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
      <SectionHeading
        as="h1"
        eyebrow="Journal"
        title="景點文章"
        desc={`跟著 13 天的行程順序，認識每一個景點背後的歷史、故事、重要性、風景，以及非去不可的理由。共 ${posts.length} 篇。`}
      />

      <Link
        href="/blog/map"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-300/10 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/20"
      >
        🗺️ 在地圖上看景點與交通動線 →
      </Link>

      <Link href={`/blog/${featured.slug}`} className={`${glass} group mt-10 grid overflow-hidden md:mt-14 md:grid-cols-[3fr_2fr]`}>
        <div className="relative h-56 sm:h-72 md:h-auto md:min-h-80">
          <Image
            src={featured.image}
            alt={featured.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 690px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <PostMeta day={featured.day} country={featured.country} minutes={readingMinutes(featured)} />
          <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">{featured.title}</h2>
          <p className="mt-3 leading-7 text-slate-300">{featured.excerpt}</p>
          <span className="mt-6 text-sm font-semibold text-emerald-300 transition group-hover:text-emerald-200">閱讀全文 →</span>
        </div>
      </Link>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={`${glass} group flex flex-col overflow-hidden`}>
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 370px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <PostMeta day={post.day} country={post.country} minutes={readingMinutes(post)} />
              <h2 className="mt-3 font-serif text-xl font-bold text-white">{post.title}</h2>
              <p className="mt-2 flex-1 leading-7 text-slate-300">{post.excerpt}</p>
              <span className="mt-5 text-sm font-semibold text-emerald-300 transition group-hover:text-emerald-200">閱讀全文 →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

function PostMeta({ day, country, minutes }: { day: number; country: string; minutes: number }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 sm:text-sm">
      <span className="font-medium tracking-[0.2em] text-emerald-300">DAY {day}</span>
      <span>{dayDate(day)}</span>
      <span className="rounded-full border border-white/20 px-2 py-0.5">{country}</span>
      <span>約 {minutes} 分鐘閱讀</span>
    </p>
  );
}

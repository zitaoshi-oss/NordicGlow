import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { glass } from "@/components/glass";
import { getPost, posts, readingMinutes } from "@/lib/blog";
import { dayDate } from "@/lib/trip";

// 所有文章都在建置時預先產生
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title}｜NordicGlow`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.indexOf(post);
  const prev = posts[index - 1];
  const next = posts[index + 1];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-12 md:pb-28">
      <Link href="/blog" className="text-sm text-slate-300 transition hover:text-emerald-200">
        ← 所有景點文章
      </Link>

      <article className="mt-6">
        <header className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/15 md:rounded-[2.5rem]">
          <Image src={post.image} alt={post.imageAlt} fill priority sizes="(max-width: 1152px) 100vw, 1152px" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10" />
          <div className="flex min-h-[55svh] flex-col justify-end px-5 pt-32 pb-8 sm:px-8 md:pb-12 lg:px-14">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-200">
              <span className="font-medium tracking-[0.2em] text-emerald-300">DAY {post.day}</span>
              <span>2027/{dayDate(post.day)}</span>
              <span className="rounded-full border border-white/30 bg-slate-950/40 px-2 py-0.5">{post.country}</span>
              <span>約 {readingMinutes(post)} 分鐘閱讀</span>
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-3xl leading-tight font-bold text-white drop-shadow-lg sm:text-5xl">{post.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">{post.excerpt}</p>
          </div>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
          <div className="max-w-3xl space-y-10">
            <section className="rounded-3xl border border-emerald-300/40 bg-emerald-300/[0.07] p-6 sm:p-8">
              <h2 className="font-serif text-xl font-bold text-emerald-100 sm:text-2xl">✨ 必訪的理由</h2>
              <ol className="mt-4 space-y-3 text-base leading-7 text-slate-100">
                {post.whyVisit.map((reason, i) => (
                  <li key={reason} className="flex gap-3">
                    <span className="font-serif font-bold text-emerald-300">{i + 1}</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ol>
            </section>
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
            <div className={`${glass} p-6`}>
              <h2 className="font-bold text-emerald-200">📍 {post.place}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                行程第 {post.day} 天・2027/{dayDate(post.day)}
              </p>
              <Link
                href={`/#day-${post.day}`}
                className="mt-4 block rounded-full border border-white/30 bg-white/10 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/20"
              >
                看當天行程 →
              </Link>
            </div>
            {post.tips.length > 0 && (
              <div className="rounded-3xl border border-amber-300/40 bg-amber-300/[0.07] p-6">
                <h2 className="font-bold text-amber-100">💡 旅行小提醒</h2>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-100">
                  {post.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="text-amber-300">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              href="/#register"
              className="block rounded-full bg-emerald-300 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-200"
            >
              立即報名
            </Link>
          </aside>
        </div>
      </article>

      <nav aria-label="上一篇／下一篇" className="mt-16 grid gap-4 border-t border-white/15 pt-8 sm:grid-cols-2">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} className={`${glass} p-5 transition hover:border-emerald-300/60`}>
            <span className="text-xs text-slate-400">← 上一篇</span>
            <p className="mt-1 font-serif font-bold text-white">{prev.title}</p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link href={`/blog/${next.slug}`} className={`${glass} p-5 text-right transition hover:border-emerald-300/60`}>
            <span className="text-xs text-slate-400">下一篇 →</span>
            <p className="mt-1 font-serif font-bold text-white">{next.title}</p>
          </Link>
        )}
      </nav>
    </main>
  );
}

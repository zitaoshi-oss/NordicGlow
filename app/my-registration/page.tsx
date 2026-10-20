import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { glass } from "@/components/glass";
import LookupForm from "@/components/LookupForm";
import PageNav from "@/components/PageNav";
import { currentRegistrant } from "@/lib/registrantAuth";
import { findRegistrationsByContact } from "@/lib/registrations";
import { trip } from "@/lib/trip";
import { endLookup } from "./actions";

export const metadata: Metadata = {
  title: "查詢報名｜NordicGlow",
  robots: { index: false, follow: false },
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false });

async function MyRegistrationContent({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const contact = await currentRegistrant();

  if (!contact) {
    return (
      <div className={`${glass} mx-auto mt-16 max-w-md p-8`}>
        <h1 className="font-serif text-3xl font-bold text-white">查詢報名</h1>
        <p className="mt-2 mb-6 text-slate-300">輸入報名時填寫的 Email 與手機，即可查看報名狀態或修改資料。</p>
        <LookupForm />
      </div>
    );
  }

  const list = await findRegistrationsByContact(contact.email, contact.phone);
  const { msg } = await searchParams;

  return (
    <>
      {msg === "updated" && (
        <p className="mb-6 rounded-2xl border border-emerald-300/60 bg-emerald-300/10 px-5 py-3 text-emerald-100" role="status">
          ✓ 已儲存修改
        </p>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium tracking-[0.3em] text-emerald-300">MY REGISTRATION</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">我的報名</h1>
          <p className="mt-2 text-slate-300">
            {trip.title}・{trip.departure} 出發
          </p>
        </div>
        <form action={endLookup}>
          <button className="rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
            結束查詢
          </button>
        </form>
      </div>

      {list.length === 0 ? (
        <div className={`${glass} mt-8 p-10 text-center text-slate-300`}>找不到報名資料，可能已被取消，請與我們聯繫。</div>
      ) : (
        <ul className="mt-8 space-y-4">
          {list.map((r) => (
            <li key={r.id} className={`${glass} p-6`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.status === "正取" ? "bg-emerald-300 text-slate-950" : "bg-amber-300 text-slate-950"}`}
                    >
                      {r.status}
                    </span>
                    <span className="font-serif text-2xl font-bold text-white">{r.nameZh}</span>
                    <span className="text-slate-300">{r.nameEn}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">報名時間：{formatTime(r.createdAt)}</p>
                </div>
                <Link
                  href={`/my-registration/edit/${r.id}`}
                  className="rounded-full bg-emerald-300 px-6 py-2.5 text-center font-semibold text-slate-950 transition hover:bg-emerald-200"
                >
                  修改資料
                </Link>
              </div>
              <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ["身份", r.identity ? r.identity + (r.dharmaName ? `（法名：${r.dharmaName}）` : "") : "未填"],
                  ["房型", r.room + (r.roommate ? `（同住：${r.roommate}）` : "")],
                  ["飲食", `奶素${r.noFiveSpices ? "・不吃五辛" : ""}${r.allergies ? `・${r.allergies}` : ""}`],
                  ["緊急聯絡人", `${r.emergencyName} ${r.emergencyPhone}`],
                  ["備註", r.note || "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="mt-0.5 text-slate-100">{value}</dd>
                  </div>
                ))}
              </dl>
              {r.status === "候補" && (
                <p className="mt-5 text-sm text-amber-200">目前為候補，如有名額釋出將依報名順序優先通知您。</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function MyRegistrationPage({ searchParams }: PageProps<"/my-registration">) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <Suspense fallback={<p className="mt-16 text-center text-slate-300">載入中…</p>}>
        <MyRegistrationContent searchParams={searchParams} />
      </Suspense>

      <PageNav current="/register" />
    </main>
  );
}

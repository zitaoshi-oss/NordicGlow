import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { glass } from "@/components/glass";
import AdminLogin from "@/components/AdminLogin";
import DeleteRegistrationButton from "@/components/DeleteRegistrationButton";
import { isAdmin } from "@/lib/adminAuth";
import { readRegistrations } from "@/lib/registrations";
import { trip } from "@/lib/trip";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "報名後台｜NordicGlow",
  robots: { index: false, follow: false },
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false });

const flashMessages: Record<string, string> = {
  updated: "✓ 已儲存修改",
  deleted: "✓ 已刪除報名",
};

async function AdminContent({ searchParams }: { searchParams: Promise<{ msg?: string; promoted?: string }> }) {
  if (!(await isAdmin())) {
    return (
      <div className={`${glass} mx-auto mt-16 max-w-md p-8`}>
        <h1 className="font-serif text-3xl font-bold text-white">報名後台</h1>
        <p className="mt-2 mb-6 text-slate-300">此頁面含旅客個人資料，請輸入密碼登入。</p>
        <AdminLogin />
      </div>
    );
  }

  const list = await readRegistrations();
  const confirmed = list.filter((r) => r.status === "正取");
  const waitlist = list.filter((r) => r.status === "候補");
  const stats = [
    { label: "正取", value: `${confirmed.length} / ${trip.capacity}` },
    { label: "候補", value: waitlist.length },
    { label: "剩餘名額", value: Math.max(trip.capacity - confirmed.length, 0) },
    { label: "不吃五辛", value: list.filter((r) => r.noFiveSpices).length },
    { label: "單人房", value: list.filter((r) => r.room.startsWith("單人房")).length },
    { label: "有過敏／特殊需求", value: list.filter((r) => r.allergies).length },
  ];
  const left = trip.capacity - confirmed.length;
  const params = await searchParams;
  const flash = flashMessages[params.msg ?? ""];
  const promoted = list.find((r) => r.id === params.promoted);

  return (
    <>
      {flash && (
        <p className="mb-6 rounded-2xl border border-emerald-300/60 bg-emerald-300/10 px-5 py-3 text-emerald-100" role="status">
          {flash}
          {promoted && (
            <>
              ，候補的 <strong className="text-white">{promoted.nameZh}</strong>{" "}
              已依報名順序自動遞補為正取，請記得通知對方（電話 {promoted.phone}）。
            </>
          )}
        </p>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium tracking-[0.3em] text-emerald-300">ADMIN</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">報名名單</h1>
          <p className="mt-2 text-slate-300">
            {trip.title}・{trip.departure} 出發
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/export"
            className="rounded-full bg-emerald-300 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-200"
          >
            ⬇ 匯出 Excel（CSV）
          </a>
          <form action={logout}>
            <button className="rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
              登出
            </button>
          </form>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className={`${glass} p-5`}>
            <dt className="text-sm text-slate-300">{s.label}</dt>
            <dd className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      {left > 0 && waitlist.length > 0 && (
        <p className="mt-6 rounded-2xl border border-amber-300/50 bg-amber-300/10 px-5 py-3 text-amber-100">
          目前有 {left} 個正取空位、{waitlist.length} 位候補。刪除正取時會自動遞補；若空位是因為把正取改成候補而產生，請按候補者的「編輯」手動改為正取（建議依報名先後順序）。
        </p>
      )}

      <div className={`${glass} mt-8 overflow-x-auto`}>
        {list.length === 0 ? (
          <p className="p-10 text-center text-slate-300">目前還沒有人報名。</p>
        ) : (
          <table className="w-full min-w-[1500px] text-left text-sm">
            <thead className="border-b border-white/15 text-emerald-200">
              <tr>
                {["#", "操作", "狀態", "中文姓名", "護照英文姓名", "性別", "生日", "手機", "Email", "房型／同住", "飲食", "緊急聯絡人", "備註", "報名時間"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-100">
              {list.map((r, i) => (
                <tr key={r.id} className="align-top hover:bg-white/5">
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/edit/${r.id}`}
                        className="rounded-full border border-emerald-300/60 px-3 py-1 text-xs font-semibold whitespace-nowrap text-emerald-200 transition hover:bg-emerald-300/15"
                      >
                        編輯
                      </Link>
                      <DeleteRegistrationButton id={r.id} name={r.nameZh} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${r.status === "正取" ? "bg-emerald-300 text-slate-950" : "bg-amber-300 text-slate-950"}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap text-white">{r.nameZh}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.nameEn}</td>
                  <td className="px-4 py-3">{r.gender}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.birthday}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.phone}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="min-w-40 px-4 py-3">
                    {r.room}
                    {r.roommate && <div className="text-slate-400">同住：{r.roommate}</div>}
                  </td>
                  <td className="min-w-32 px-4 py-3">
                    奶素{r.noFiveSpices && <span className="ml-1 text-amber-200">・不吃五辛</span>}
                    {r.allergies && <div className="text-rose-200">⚠ {r.allergies}</div>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.emergencyName}
                    <div className="text-slate-400">{r.emergencyPhone}</div>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-300">{r.note}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">{formatTime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <Suspense fallback={<p className="mt-16 text-center text-slate-300">載入中…</p>}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

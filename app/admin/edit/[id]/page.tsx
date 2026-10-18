import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { glass } from "@/components/glass";
import DeleteRegistrationButton from "@/components/DeleteRegistrationButton";
import EditRegistrationForm from "@/components/EditRegistrationForm";
import { isAdmin } from "@/lib/adminAuth";
import { getRegistration } from "@/lib/registrations";

export const metadata: Metadata = {
  title: "修改報名｜NordicGlow",
  robots: { index: false, follow: false },
};

async function EditContent({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { id } = await params;
  const registration = await getRegistration(id);

  if (!registration) {
    return (
      <div className={`${glass} p-10 text-center`}>
        <p className="text-lg text-white">找不到這筆報名，可能已被刪除。</p>
        <Link href="/admin" className="mt-6 inline-block text-emerald-300 underline">
          回報名名單
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin" className="text-sm text-emerald-300 hover:underline">
            ← 回報名名單
          </Link>
          <h1 className="mt-3 font-serif text-4xl font-bold text-white">修改報名：{registration.nameZh}</h1>
          <p className="mt-2 text-slate-300">
            報名時間：{new Date(registration.createdAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false })}
          </p>
        </div>
        <DeleteRegistrationButton id={registration.id} name={registration.nameZh} large />
      </div>
      <div className={`${glass} mt-8 p-6 md:p-10`}>
        <EditRegistrationForm registration={registration} />
      </div>
    </>
  );
}

export default function EditPage({ params }: PageProps<"/admin/edit/[id]">) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Suspense fallback={<p className="mt-16 text-center text-slate-300">載入中…</p>}>
        <EditContent params={params} />
      </Suspense>
    </main>
  );
}

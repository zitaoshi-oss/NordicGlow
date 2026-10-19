import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { glass } from "@/components/glass";
import SelfEditRegistrationForm from "@/components/SelfEditRegistrationForm";
import { currentRegistrant } from "@/lib/registrantAuth";
import { findRegistrationsByContact } from "@/lib/registrations";

export const metadata: Metadata = {
  title: "修改我的報名｜NordicGlow",
  robots: { index: false, follow: false },
};

async function SelfEditContent({ params }: { params: Promise<{ id: string }> }) {
  const contact = await currentRegistrant();
  if (!contact) redirect("/my-registration");
  const { id } = await params;
  // 只找得到 Email 與手機都相符的報名，避免改到別人的資料
  const registration = (await findRegistrationsByContact(contact.email, contact.phone)).find((r) => r.id === id);

  if (!registration) {
    return (
      <div className={`${glass} p-10 text-center`}>
        <p className="text-lg text-white">找不到這筆報名。</p>
        <Link href="/my-registration" className="mt-6 inline-block text-emerald-300 underline">
          回我的報名
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/my-registration" className="text-sm text-emerald-300 hover:underline">
        ← 回我的報名
      </Link>
      <h1 className="mt-3 font-serif text-4xl font-bold text-white">修改報名：{registration.nameZh}</h1>
      <p className="mt-2 text-slate-300">
        目前狀態：{registration.status}。修改資料不會影響您的報名順序。
      </p>
      <div className={`${glass} mt-8 p-6 md:p-10`}>
        <SelfEditRegistrationForm registration={registration} />
      </div>
    </>
  );
}

export default function SelfEditPage({ params }: PageProps<"/my-registration/edit/[id]">) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Suspense fallback={<p className="mt-16 text-center text-slate-300">載入中…</p>}>
        <SelfEditContent params={params} />
      </Suspense>
    </main>
  );
}

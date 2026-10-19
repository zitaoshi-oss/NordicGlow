"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveOwnRegistration, type SelfEditState } from "@/app/my-registration/actions";
import type { Registration } from "@/lib/registrations";
import RegistrationFields from "./RegistrationFields";

export default function SelfEditRegistrationForm({ registration }: { registration: Registration }) {
  const [state, formAction, pending] = useActionState(saveOwnRegistration.bind(null, registration.id), {
    message: "",
  } as SelfEditState);

  // 第一次顯示用原本的資料；送出失敗後改用剛剛填的值
  const v: Record<string, string> = state.values ?? {
    ...registration,
    noFiveSpices: registration.noFiveSpices ? "on" : "",
  };
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-8" noValidate>
      <RegistrationFields v={v} e={e} contactLocked />

      {state.message && (
        <p className="rounded-2xl border border-rose-300/50 bg-rose-300/10 px-5 py-4 text-rose-100" aria-live="polite">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-emerald-300 px-8 py-3 font-bold text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60"
        >
          {pending ? "儲存中…" : "儲存修改"}
        </button>
        <Link
          href="/my-registration"
          className="rounded-full border border-white/40 px-8 py-3 text-center font-semibold text-white transition hover:bg-white/10"
        >
          取消
        </Link>
      </div>
    </form>
  );
}

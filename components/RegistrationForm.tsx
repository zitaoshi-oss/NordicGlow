"use client";

import { useActionState, useEffect } from "react";
import { register, type RegisterState } from "@/app/actions";
import RegistrationFields from "./RegistrationFields";
import { saveName } from "./WelcomeName";

const initialState: RegisterState = { ok: false, message: "" };

export default function RegistrationForm({ full }: { full: boolean }) {
  const [state, formAction, pending] = useActionState(register, initialState);
  const v = state.values ?? {};
  const e = state.errors ?? {};

  // 報名成功後把中文姓名存成稱呼，下次進站直接歡迎
  useEffect(() => {
    if (state.ok && state.name) saveName(state.name);
  }, [state.ok, state.name]);

  if (state.ok) {
    return (
      <div className="rounded-3xl border border-emerald-300/60 bg-emerald-300/10 p-8 text-center" aria-live="polite">
        <p className="text-4xl">🎉</p>
        <p className="mt-4 text-lg leading-8 text-white">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {full && (
        <p className="rounded-2xl border border-amber-300/50 bg-amber-300/10 px-5 py-4 text-amber-100">
          正取名額已滿，現在送出將登記為候補。
        </p>
      )}

      <RegistrationFields v={v} e={e} />

      <div>
        <label className="flex items-start gap-3 text-slate-100">
          <input type="checkbox" name="agree" defaultChecked={v.agree === "on"} className="mt-1 h-5 w-5 shrink-0 accent-emerald-300" />
          <span>
            我已閱讀並同意報名須知：極光為自然現象無法保證觀賞；漁屋房型配置可能不同；個人資料僅用於本次旅遊作業。
          </span>
        </label>
        {e.agree && <p className="mt-1.5 text-sm text-rose-300">{e.agree}</p>}
      </div>

      {state.message && !state.ok && (
        <p className="rounded-2xl border border-rose-300/50 bg-rose-300/10 px-5 py-4 text-rose-100" aria-live="polite">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-300 py-4 text-lg font-bold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "送出中…" : full ? "登記候補" : "確認報名"}
      </button>
    </form>
  );
}

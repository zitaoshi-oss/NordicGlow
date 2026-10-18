"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, { error: "" });

  return (
    <form action={formAction} className="space-y-4">
      <label htmlFor="password" className="text-sm font-medium text-slate-100">
        後台密碼
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3 text-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30 focus:outline-none"
      />
      {state.error && (
        <p className="text-sm text-rose-300" aria-live="polite">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-300 py-3 font-bold text-slate-950 transition hover:bg-emerald-200 disabled:opacity-60"
      >
        {pending ? "登入中…" : "登入"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { lookup, type LookupState } from "@/app/my-registration/actions";
import { inputClass } from "./RegistrationFields";

export default function LookupForm() {
  const [state, formAction, pending] = useActionState(lookup, { error: "" } as LookupState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-100">
          報名時填寫的 Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.email}
          placeholder="name@example.com"
          autoComplete="email"
          autoFocus
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-slate-100">
          報名時填寫的手機
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={state.phone}
          placeholder="0912-345-678"
          autoComplete="tel"
          className={inputClass}
        />
      </div>
      {state.error && (
        <p className="rounded-2xl border border-rose-300/50 bg-rose-300/10 px-5 py-3 text-rose-100" aria-live="polite">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald-300 py-3 font-bold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "查詢中…" : "查詢報名"}
      </button>
    </form>
  );
}

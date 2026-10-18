"use client";

import { removeRegistration } from "@/app/admin/actions";

export default function DeleteRegistrationButton({ id, name, large }: { id: string; name: string; large?: boolean }) {
  return (
    <form
      action={removeRegistration}
      onSubmit={(event) => {
        if (!confirm(`確定要刪除「${name}」的報名嗎？刪除後無法復原。`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={`rounded-full border border-rose-300/60 font-semibold whitespace-nowrap text-rose-200 transition hover:bg-rose-300/15 ${large ? "px-6 py-3" : "px-3 py-1 text-xs"}`}
      >
        刪除
      </button>
    </form>
  );
}

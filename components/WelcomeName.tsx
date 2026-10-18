"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { inputClass } from "./RegistrationFields";

// 訪客稱呼存在 localStorage，回訪時直接歡迎，不再重問
const KEY = "nordicglow:nickname";
const listeners = new Set<() => void>();

function readName() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveName(name: string) {
  try {
    localStorage.setItem(KEY, name);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
}

export default function WelcomeName() {
  // 伺服器端沒有 localStorage，回傳 null 代表「尚未讀取」
  const name = useSyncExternalStore(subscribe, readName, () => null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // 剛進站還沒有稱呼時，跳出輸入視窗
  useEffect(() => {
    if (name === "") dialogRef.current?.showModal();
  }, [name]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("nickname") ?? "").trim();
    saveName(value || "旅人");
    dialogRef.current?.close();
  }

  return (
    <>
      {name && (
        <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-serif text-xl font-bold text-white drop-shadow sm:text-2xl" aria-live="polite">
          <span>
            👋 歡迎，<span className="text-emerald-200">{name}</span>！
          </span>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="font-sans text-xs font-medium text-slate-300 underline-offset-4 transition hover:text-emerald-200 hover:underline"
          >
            更換稱呼
          </button>
        </p>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="welcome-title"
        onCancel={(e) => {
          // 第一次進站按 Esc 時，以預設稱呼帶過
          if (!name) {
            e.preventDefault();
            saveName("旅人");
            dialogRef.current?.close();
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-white/15 bg-slate-900/90 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm sm:p-8"
      >
        <form onSubmit={onSubmit}>
          <p className="text-4xl">❄️</p>
          <h2 id="welcome-title" className="mt-3 font-serif text-2xl font-bold">
            歡迎來到 Nordic<span className="text-cyan-300">Glow</span>
          </h2>
          <p className="mt-2 leading-7 text-slate-300">請問該怎麼稱呼您呢？</p>
          <label htmlFor="nickname" className="sr-only">
            您的稱呼
          </label>
          <input
            id="nickname"
            name="nickname"
            defaultValue={name ?? ""}
            maxLength={20}
            autoFocus
            autoComplete="nickname"
            placeholder="例如：小明、王小姐"
            className={inputClass}
          />
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-emerald-300 py-3.5 font-bold text-slate-950 transition hover:bg-emerald-200"
          >
            進入官網
          </button>
        </form>
      </dialog>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

const KEY = "nordicglow:visitor-id";
const INTERVAL = 15_000;

// 每個分頁一個 id（sessionStorage），重新整理不會被算成新訪客
function visitorId() {
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export default function OnlineCount() {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    const id = visitorId();
    const ping = () =>
      fetch("/api/online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((data) => typeof data.online === "number" && setOnline(data.online))
        .catch(() => {});

    // 一進站就回報，之後定時心跳；切回分頁時立刻更新
    ping();
    const timer = setInterval(ping, INTERVAL);
    const onVisible = () => document.visibilityState === "visible" && ping();
    const onLeave = () =>
      navigator.sendBeacon("/api/online", new Blob([JSON.stringify({ id, leave: true })], { type: "application/json" }));
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pagehide", onLeave);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  if (online === null) return null;

  return (
    <span
      className="flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-slate-950/50 px-3 py-1.5 text-xs text-emerald-100"
      aria-live="polite"
      title="目前線上人數"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
      <span className="hidden sm:inline">線上</span>
      <strong className="font-semibold text-white">{online}</strong>
      <span className="hidden sm:inline">人</span>
    </span>
  );
}

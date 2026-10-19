"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { glass, navLinks } from "./glass";
import OnlineCount from "./OnlineCount";

export default function Header() {
  const [open, setOpen] = useState(false);

  // 選單開啟時：按 Esc 關閉；視窗放大到平板以上自動收起
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-6xl px-4 sm:top-4">
      <nav className={`${glass} px-4 py-2.5 sm:px-6 sm:py-3`}>
        <div className="flex items-center justify-between">
          <Link href="/#" className="font-serif text-lg font-bold tracking-wide text-white sm:text-xl">
            ❄️ Nordic<span className="text-cyan-300">Glow</span>
          </Link>

          <ul className="hidden gap-6 text-sm text-slate-200 md:flex lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <OnlineCount />
            <Link
              href="/#register"
              className="hidden rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white sm:block"
            >
              立即報名
            </Link>
            <button
              type="button"
              aria-label={open ? "關閉選單" : "開啟選單"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 md:hidden"
            >
              <span className={`h-0.5 w-5 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {open && (
          <ul className="mt-3 flex max-h-[70svh] flex-col gap-1 overflow-y-auto border-t border-white/15 pt-3 md:hidden">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 sm:hidden">
              <Link
                href="/#register"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-white/90 py-3 text-center font-semibold text-slate-900"
              >
                立即報名
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

import Link from "next/link";
import { glass, navLinks } from "./glass";

// 分頁底部導覽：回首頁，或跳到任一其他分頁；current 為目前分頁的路徑
export default function PageNav({ current }: { current: string }) {
  return (
    <nav aria-label="分頁導覽" className={`${glass} mt-16 p-5 sm:p-6 md:mt-20`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 font-semibold text-white transition hover:bg-white/20"
        >
          ← 回首頁
        </Link>
        <ul className="flex flex-wrap gap-2">
          {navLinks.map((link) => {
            const active = link.href === current;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-emerald-300 bg-emerald-300 font-semibold text-slate-950"
                      : "border-white/20 bg-slate-900/60 text-slate-100 hover:border-emerald-300 hover:text-emerald-200"
                  }`}
                >
                  <span aria-hidden>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

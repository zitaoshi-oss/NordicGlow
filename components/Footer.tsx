import Link from "next/link";
import { glass, navLinks } from "./glass";
import { photoCredits } from "./photoCredits";

const destinations = ["奧斯陸・弗萊姆", "松恩峽灣・哈丹格峽灣", "卑爾根", "羅浮敦群島", "基律納・斯德哥爾摩"];

const contacts = [
  { icon: "📞", text: "0919886351" },
  { icon: "✉️", text: "leechinchu@hotmail.com" },
  { icon: "📍", text: "高雄市前金區復元里大同二路11號11樓" },
  { icon: "🕘", text: "週一至週五 09:00–18:00" },
];

const socials = [
  { label: "Instagram", short: "IG" },
  { label: "Facebook", short: "FB" },
  { label: "YouTube", short: "YT" },
  { label: "LINE", short: "LN" },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-10">
      <div className={`${glass} px-6 py-10 sm:px-8 md:py-12`}>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-serif text-xl font-bold tracking-wide text-white">
              ❄️ Nordic<span className="text-cyan-300">Glow</span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              2027/10/05 出發「極光秘境・挪威峽灣・羅浮敦 13 日」奶素私人訂製團，限額 16 人。
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-slate-200 transition hover:bg-white/20 hover:text-white"
                >
                  {social.short}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-white">快速連結</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-cyan-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-white">行程城市</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {destinations.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-white">聯絡我們</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {contacts.map((contact) => (
                <li key={contact.text} className="flex gap-2">
                  <span className="shrink-0">{contact.icon}</span>
                  <span className="min-w-0 break-all">{contact.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <details className="group mt-10 border-t border-white/15 pt-6 text-xs text-slate-300">
          <summary className="cursor-pointer list-none leading-6 transition hover:text-white">
            📷 圖片來源：Wikimedia Commons（點此展開作者與授權）
          </summary>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {photoCredits.map((credit) => (
              <li key={credit.source}>
                <a
                  href={credit.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-cyan-200"
                >
                  {credit.subject} — {credit.author}，{credit.license}
                </a>
              </li>
            ))}
          </ul>
        </details>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-center text-xs text-slate-400 md:flex-row md:text-left">
          <span>© 2027 NordicGlow 北歐旅遊企劃 版權所有</span>
          <span>交通部觀光署註冊編號: 098600 ・ 品保協會會員</span>
        </div>
      </div>
    </footer>
  );
}

// 深色玻璃：半透明底 + 模糊 + 頂部高光，底色夠深讓上面的文字維持高對比
export const glass =
  "rounded-3xl border border-white/15 bg-slate-900/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl";

// 首頁區塊 2–7 各自對應的分頁；頁首、頁尾、首頁卡片與分頁導覽共用
export const navLinks = [
  { href: "/features", label: "行程特色", icon: "✨", image: "/images/lofoten.jpg", desc: "北極圈三夜極光、雙峽灣、雙景觀鐵道等八大亮點。" },
  { href: "/itinerary", label: "每日行程", icon: "🗓️", image: "/images/sognefjord.jpg", desc: "13 天逐日景點、必看必吃必買、餐食與住宿。" },
  { href: "/blog", label: "景點文章", icon: "📖", image: "/images/bryggen.jpg", desc: "每個景點背後的歷史、故事與非去不可的理由。" },
  { href: "/diet", label: "素食指南", icon: "🌿", image: "/images/gamla-stan.jpg", desc: "北歐奶素注意事項，附挪威文、瑞典文點餐小卡。" },
  { href: "/register", label: "線上報名", icon: "📝", image: "/images/hamnoy.jpg", desc: "限額 16 人，線上報名並可隨時查詢、修改報名資料。" },
  { href: "/blog/map", label: "景點地圖", icon: "🗺️", image: "/images/hardanger-bridge.jpg", desc: "在地圖上看所有景點，以及每天的交通方式與動線。" },
];

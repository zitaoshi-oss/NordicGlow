import { hasAdminSession } from "@/lib/adminAuth";
import { readRegistrations } from "@/lib/registrations";

const columns = [
  ["status", "狀態"],
  ["identity", "身份"],
  ["dharmaName", "法名"],
  ["nameZh", "中文姓名"],
  ["nameEn", "護照英文姓名"],
  ["gender", "性別"],
  ["birthday", "生日"],
  ["phone", "手機"],
  ["email", "Email"],
  ["room", "房型"],
  ["roommate", "同住者"],
  ["noFiveSpices", "不吃五辛"],
  ["allergies", "過敏／飲食需求"],
  ["emergencyName", "緊急聯絡人"],
  ["emergencyPhone", "緊急聯絡人電話"],
  ["note", "備註"],
  ["createdAt", "報名時間"],
] as const;

const cell = (value: unknown) => {
  const text = typeof value === "boolean" ? (value ? "是" : "") : String(value ?? "");
  // 避免 Excel 把 = + - @ 開頭的內容當成公式執行
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
};

export async function GET() {
  if (!(await hasAdminSession())) {
    return new Response("未登入", { status: 401 });
  }
  const list = await readRegistrations();
  const rows = [
    columns.map(([, label]) => cell(label)).join(","),
    ...list.map((r) =>
      columns
        .map(([key]) =>
          cell(key === "createdAt" ? new Date(r.createdAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false }) : r[key]),
        )
        .join(","),
    ),
  ];
  // 開頭加 BOM，Excel 開啟中文才不會亂碼
  return new Response(String.fromCharCode(0xfeff) + rows.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registrations.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

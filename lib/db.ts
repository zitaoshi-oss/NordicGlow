import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Neon Postgres 連線：透過 HTTP 查詢，適合 Vercel 這種每次請求可能在不同機器執行的環境
// 連線字串由 Vercel 的 Neon 整合自動設定為 DATABASE_URL，本機用 `vercel env pull .env.local` 取得
let client: NeonQueryFunction<false, false> | undefined;

export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("缺少 DATABASE_URL，請在 Vercel 加入 Neon 資料庫後執行 vercel env pull .env.local");
    client = neon(url);
  }
  return client;
}

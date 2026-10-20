// 建立資料表：npm run db:setup（會讀 .env.local 的 DATABASE_URL，重複執行也不會影響既有資料）
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("缺少 DATABASE_URL，請先執行 vercel env pull .env.local");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    status text NOT NULL CHECK (status IN ('正取', '候補')),
    name_zh text NOT NULL,
    name_en text NOT NULL,
    gender text NOT NULL,
    birthday text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    room text NOT NULL,
    roommate text NOT NULL DEFAULT '',
    no_five_spices boolean NOT NULL DEFAULT false,
    allergies text NOT NULL DEFAULT '',
    emergency_name text NOT NULL,
    emergency_phone text NOT NULL,
    note text NOT NULL DEFAULT ''
  )`,
  // 身份（比丘尼／居士）與法名；舊資料補空字串
  `ALTER TABLE registrations ADD COLUMN IF NOT EXISTS identity text NOT NULL DEFAULT ''`,
  `ALTER TABLE registrations ADD COLUMN IF NOT EXISTS dharma_name text NOT NULL DEFAULT ''`,
  // 報名者用 Email + 手機查詢，手機只比對數字（0912-345-678 與 0912345678 視為相同）
  `CREATE INDEX IF NOT EXISTS registrations_contact_idx
    ON registrations (lower(email), regexp_replace(phone, '\\D', '', 'g'))`,
  // 查詢失敗紀錄，用來限制猜測次數
  `CREATE TABLE IF NOT EXISTS lookup_failures (
    key text NOT NULL,
    at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS lookup_failures_key_idx ON lookup_failures (key, at)`,
];

for (const statement of statements) {
  await sql.query(statement);
}
console.log("✓ 資料表已建立");

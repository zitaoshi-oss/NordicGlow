import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { db } from "./db";

// 報名者查詢：Email + 手機比對成功後，發一個 30 分鐘有效、經 HMAC 簽章的 httpOnly cookie，
// 裡面記著這組 Email 與手機，之後的查看與修改都以它為準
export const REGISTRANT_COOKIE = "registrant_session";
export const REGISTRANT_PATH = "/my-registration";
export const SESSION_MINUTES = 30;

// 查詢失敗限制：同一個 Email 或同一個 IP，15 分鐘內最多失敗 8 次
const MAX_FAILURES = 8;
const WINDOW_MINUTES = 15;

export type Contact = { email: string; phone: string };

function sign(payload: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("缺少 ADMIN_SESSION_SECRET，請在 .env.local 設定");
  // 加上用途前綴，讓報名者的簽章不能拿去冒充後台登入
  return createHmac("sha256", secret).update(`registrant:${payload}`).digest("base64url");
}

export function createRegistrantToken(contact: Contact) {
  const payload = Buffer.from(
    JSON.stringify({ ...contact, exp: Date.now() + SESSION_MINUTES * 60 * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): Contact | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const { email, phone, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
  return exp > Date.now() ? { email, phone } : null;
}

// 給 Server Action 用：直接檢查這次請求帶的 cookie
export async function getRegistrantContact() {
  return verifyToken((await cookies()).get(REGISTRANT_COOKIE)?.value);
}

// 給頁面用：要和當下時間比對，必須在每次請求時判斷
export async function currentRegistrant() {
  await connection();
  return getRegistrantContact();
}

async function failureKeys(email: string) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  return [`email:${email.toLowerCase()}`, `ip:${ip}`];
}

export async function isLookupBlocked(email: string) {
  const rows = await db().query(
    `SELECT 1 FROM lookup_failures
     WHERE key = ANY($1) AND at > now() - make_interval(mins => $2)
     GROUP BY key HAVING count(*) >= $3`,
    [await failureKeys(email), WINDOW_MINUTES, MAX_FAILURES],
  );
  return rows.length > 0;
}

export async function recordLookupFailure(email: string) {
  const sql = db();
  const keys = await failureKeys(email);
  await sql.transaction([
    sql.query("DELETE FROM lookup_failures WHERE at < now() - interval '1 day'"),
    sql.query("INSERT INTO lookup_failures (key) SELECT unnest($1::text[])", [keys]),
  ]);
}

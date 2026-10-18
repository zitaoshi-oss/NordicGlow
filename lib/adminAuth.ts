import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

// 後台登入：密碼與簽章金鑰放在 .env.local，登入後發一個有效期 8 小時、經 HMAC 簽章的 httpOnly cookie
export const ADMIN_COOKIE = "admin_session";
export const SESSION_HOURS = 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("缺少 ADMIN_SESSION_SECRET，請在 .env.local 設定");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("缺少 ADMIN_PASSWORD，請在 .env.local 設定");
  return safeEqual(input, password);
}

export function createSessionToken() {
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

// 給 Server Action 與 Route Handler 用：直接檢查這次請求帶的 cookie
export async function hasAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

// 給頁面用：登入狀態要和當下時間比對，必須在每次請求時判斷，不能預先產生
export async function isAdmin() {
  await connection();
  return hasAdminSession();
}

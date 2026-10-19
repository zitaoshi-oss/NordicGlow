import { Redis } from "@upstash/redis";

// 即時線上人數：每個分頁定時回報心跳，超過 TTL 沒回報就視為離線
// 有設定 Upstash Redis 環境變數時存在 Redis（多台伺服器共用、人數同步）；
// 沒設定時退回記憶體（單一程序，本機開發用），掛在 globalThis 避免熱更新時被清空
const TTL = 30_000;
const MAX_VISITORS = 10_000;
const KEY = "nordicglow:online";

const hasRedis = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
);
const redis = hasRedis ? Redis.fromEnv() : null;

// 用 sorted set 存「訪客 id → 最後心跳時間」，Lua 腳本一次完成清理、寫入、計數（原子操作、只需一次往返）
const heartbeatScript = redis?.createScript<number>(`
  local now = tonumber(ARGV[1])
  local ttl = tonumber(ARGV[3])
  redis.call("ZREMRANGEBYSCORE", KEYS[1], "-inf", now - ttl)
  if redis.call("ZSCORE", KEYS[1], ARGV[2]) or redis.call("ZCARD", KEYS[1]) < tonumber(ARGV[4]) then
    redis.call("ZADD", KEYS[1], now, ARGV[2])
  end
  redis.call("PEXPIRE", KEYS[1], ttl)
  return redis.call("ZCARD", KEYS[1])
`);

const leaveScript = redis?.createScript<number>(`
  redis.call("ZREM", KEYS[1], ARGV[2])
  redis.call("ZREMRANGEBYSCORE", KEYS[1], "-inf", tonumber(ARGV[1]) - tonumber(ARGV[3]))
  return redis.call("ZCARD", KEYS[1])
`);

const g = globalThis as typeof globalThis & { __onlineVisitors?: Map<string, number> };
const visitors = (g.__onlineVisitors ??= new Map());

function prune(now: number) {
  for (const [id, seen] of visitors) {
    if (now - seen > TTL) visitors.delete(id);
  }
}

const args = (id: string) => [String(Date.now()), id, String(TTL), String(MAX_VISITORS)];

export async function heartbeat(id: string): Promise<number> {
  if (heartbeatScript) return heartbeatScript.exec([KEY], args(id));
  const now = Date.now();
  prune(now);
  // 人數上限保護，避免被灌爆記憶體
  if (visitors.has(id) || visitors.size < MAX_VISITORS) visitors.set(id, now);
  return visitors.size;
}

export async function leave(id: string): Promise<number> {
  if (leaveScript) return leaveScript.exec([KEY], args(id));
  visitors.delete(id);
  prune(Date.now());
  return visitors.size;
}

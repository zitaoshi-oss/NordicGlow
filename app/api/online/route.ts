import { heartbeat, leave } from "@/lib/online";

// POST /api/online  body: { id: string, leave?: boolean }
// 前端進站時呼叫一次，之後每 15 秒回報心跳；離開頁面時送 leave: true
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !/^[\w-]{8,64}$/.test(id)) {
    return Response.json({ error: "id 格式錯誤" }, { status: 400 });
  }
  try {
    const online = body.leave === true ? await leave(id) : await heartbeat(id);
    return Response.json({ online }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("線上人數更新失敗", error);
    return Response.json({ error: "線上人數暫時無法取得" }, { status: 503 });
  }
}

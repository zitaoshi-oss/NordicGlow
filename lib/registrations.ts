import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { trip } from "./trip";

// 報名資料存在專案的 data/registrations.json（已加入 .gitignore）
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");

export type Registration = {
  id: string;
  createdAt: string;
  status: "正取" | "候補";
  nameZh: string;
  nameEn: string;
  gender: string;
  birthday: string;
  phone: string;
  email: string;
  room: string;
  roommate: string;
  noFiveSpices: boolean;
  allergies: string;
  emergencyName: string;
  emergencyPhone: string;
  note: string;
};

export async function readRegistrations(): Promise<Registration[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export type RegistrationInput = Omit<Registration, "id" | "createdAt" | "status">;

async function save(list: Registration[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

// 同一個伺服器程序內依序讀寫，避免同時操作時互相覆蓋
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const task = queue.then(fn);
  queue = task.catch(() => {});
  return task;
}

export async function getRegistration(id: string) {
  return (await readRegistrations()).find((r) => r.id === id);
}

export function addRegistration(data: RegistrationInput) {
  return withLock(async () => {
    const list = await readRegistrations();
    const confirmed = list.filter((r) => r.status === "正取").length;
    const entry: Registration = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: confirmed < trip.capacity ? "正取" : "候補",
      ...data,
    };
    await save([...list, entry]);
    return entry;
  });
}

export type UpdateResult = { ok: true } | { ok: false; error: string };

export function updateRegistration(
  id: string,
  data: RegistrationInput & { status: Registration["status"] },
): Promise<UpdateResult> {
  return withLock(async () => {
    const list = await readRegistrations();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return { ok: false, error: "找不到這筆報名，可能已被刪除" };
    const othersConfirmed = list.filter((r, i) => i !== index && r.status === "正取").length;
    if (data.status === "正取" && othersConfirmed >= trip.capacity) {
      return { ok: false, error: `正取已滿 ${trip.capacity} 人，請先將其他人改為候補或刪除` };
    }
    list[index] = { ...list[index], ...data };
    await save(list);
    return { ok: true };
  });
}

export type DeleteResult = { deleted: boolean; promoted?: Registration };

// 刪除一筆報名；若刪的是正取且還有空位，依報名時間由最早的候補自動遞補
export function deleteRegistration(id: string): Promise<DeleteResult> {
  return withLock(async () => {
    const list = await readRegistrations();
    const removed = list.find((r) => r.id === id);
    if (!removed) return { deleted: false };
    const next = list.filter((r) => r.id !== id);

    let promoted: Registration | undefined;
    const confirmed = next.filter((r) => r.status === "正取").length;
    if (removed.status === "正取" && confirmed < trip.capacity) {
      const first = next
        .filter((r) => r.status === "候補")
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
      if (first) {
        first.status = "正取";
        promoted = first;
      }
    }

    await save(next);
    return { deleted: true, promoted };
  });
}

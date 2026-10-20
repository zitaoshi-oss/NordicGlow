import { db } from "./db";
import { trip } from "./trip";

// 報名資料存在 Neon Postgres 的 registrations 資料表（建表：npm run db:setup）

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
  identity: string; // 比丘尼 或 居士；新增此欄位前的舊資料為空字串
  dharmaName: string; // 法名，僅比丘尼填寫
};

export type RegistrationInput = Omit<Registration, "id" | "createdAt" | "status">;

// 資料表欄位（snake_case）對應到程式裡的屬性名稱（camelCase）
const COLUMNS = `id, created_at AS "createdAt", status, name_zh AS "nameZh", name_en AS "nameEn", gender, birthday,
  phone, email, room, roommate, no_five_spices AS "noFiveSpices", allergies,
  emergency_name AS "emergencyName", emergency_phone AS "emergencyPhone", note,
  identity, dharma_name AS "dharmaName"`;

const toRegistration = (row: Record<string, unknown>) =>
  ({ ...row, createdAt: new Date(row.createdAt as string).toISOString() }) as Registration;

// 會影響正取名額的寫入，先取得同一把交易鎖再做，避免多人同時報名時超收
const LOCK = "SELECT pg_advisory_xact_lock(20271005)";

const CONFIRMED_COUNT = "(SELECT count(*) FROM registrations WHERE status = '正取')";

// 手機比對只看數字，Email 不分大小寫
const CONTACT_MATCH = "lower(email) = lower($1) AND regexp_replace(phone, '\\D', '', 'g') = $2";
export const phoneDigits = (phone: string) => phone.replace(/\D/g, "");

const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const inputParams = (d: RegistrationInput) => [
  d.nameZh, d.nameEn, d.gender, d.birthday, d.phone, d.email, d.room, d.roommate,
  d.noFiveSpices, d.allergies, d.emergencyName, d.emergencyPhone, d.note, d.identity, d.dharmaName,
];

// 對應 inputParams 的 $1 ~ $15
const SET_INPUT = `name_zh = $1, name_en = $2, gender = $3, birthday = $4, phone = $5, email = $6, room = $7,
  roommate = $8, no_five_spices = $9, allergies = $10, emergency_name = $11, emergency_phone = $12, note = $13,
  identity = $14, dharma_name = $15`;

export async function readRegistrations(): Promise<Registration[]> {
  const rows = await db().query(`SELECT ${COLUMNS} FROM registrations ORDER BY created_at, id`);
  return rows.map(toRegistration);
}

export async function getRegistration(id: string) {
  if (!isUuid(id)) return undefined;
  const rows = await db().query(`SELECT ${COLUMNS} FROM registrations WHERE id = $1`, [id]);
  return rows[0] ? toRegistration(rows[0]) : undefined;
}

export async function findRegistrationsByContact(email: string, phone: string) {
  const rows = await db().query(`SELECT ${COLUMNS} FROM registrations WHERE ${CONTACT_MATCH} ORDER BY created_at, id`, [
    email,
    phoneDigits(phone),
  ]);
  return rows.map(toRegistration);
}

export async function addRegistration(data: RegistrationInput) {
  const sql = db();
  const [, rows] = await sql.transaction([
    sql.query(LOCK),
    sql.query(
      `INSERT INTO registrations (status, name_zh, name_en, gender, birthday, phone, email, room, roommate,
         no_five_spices, allergies, emergency_name, emergency_phone, note, identity, dharma_name)
       VALUES (CASE WHEN ${CONFIRMED_COUNT} < $16 THEN '正取' ELSE '候補' END,
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING ${COLUMNS}`,
      [...inputParams(data), trip.capacity],
    ),
  ]);
  return toRegistration(rows[0]);
}

export type UpdateResult = { ok: true } | { ok: false; error: string };

const NOT_FOUND: UpdateResult = { ok: false, error: "找不到這筆報名，可能已被刪除" };

// 後台修改：可以改狀態，但改成正取時不能超過名額
export async function updateRegistration(
  id: string,
  data: RegistrationInput & { status: Registration["status"] },
): Promise<UpdateResult> {
  if (!isUuid(id)) return NOT_FOUND;
  const sql = db();
  const [, updated, found] = await sql.transaction([
    sql.query(LOCK),
    sql.query(
      `UPDATE registrations SET ${SET_INPUT}, status = $16
       WHERE id = $17
         AND ($16 <> '正取' OR (SELECT count(*) FROM registrations WHERE status = '正取' AND id <> $17) < $18)
       RETURNING id`,
      [...inputParams(data), data.status, id, trip.capacity],
    ),
    sql.query("SELECT 1 FROM registrations WHERE id = $1", [id]),
  ]);
  if (updated.length > 0) return { ok: true };
  if (found.length === 0) return NOT_FOUND;
  return { ok: false, error: `正取已滿 ${trip.capacity} 人，請先將其他人改為候補或刪除` };
}

// 報名者自己修改：只能改 Email 與手機都相符的那筆，狀態不變
export async function updateOwnRegistration(
  id: string,
  contact: { email: string; phone: string },
  data: RegistrationInput,
): Promise<UpdateResult> {
  if (!isUuid(id)) return NOT_FOUND;
  const rows = await db().query(
    `UPDATE registrations SET ${SET_INPUT}
     WHERE id = $16 AND lower(email) = lower($17) AND regexp_replace(phone, '\\D', '', 'g') = $18
     RETURNING id`,
    [...inputParams(data), id, contact.email, phoneDigits(contact.phone)],
  );
  return rows.length > 0 ? { ok: true } : NOT_FOUND;
}

export type DeleteResult = { deleted: boolean; promoted?: Registration };

// 刪除一筆報名；若刪的是正取且還有空位，依報名時間由最早的候補自動遞補
// （同一個 SQL 內看到的是刪除前的資料，所以正取人數要減掉被刪的這一位）
export async function deleteRegistration(id: string): Promise<DeleteResult> {
  if (!isUuid(id)) return { deleted: false };
  const sql = db();
  const [, rows] = await sql.transaction([
    sql.query(LOCK),
    sql.query(
      `WITH removed AS (
         DELETE FROM registrations WHERE id = $1 RETURNING status
       ), promoted AS (
         UPDATE registrations SET status = '正取'
         WHERE id = (SELECT id FROM registrations WHERE status = '候補' AND id <> $1 ORDER BY created_at, id LIMIT 1)
           AND EXISTS (SELECT 1 FROM removed WHERE status = '正取')
           AND ${CONFIRMED_COUNT} - 1 < $2
         RETURNING ${COLUMNS}
       )
       SELECT (SELECT count(*) FROM removed)::int AS deleted, (SELECT row_to_json(p) FROM promoted p) AS promoted`,
      [id, trip.capacity],
    ),
  ]);
  const { deleted, promoted } = rows[0];
  return { deleted: deleted > 0, promoted: promoted ? toRegistration(promoted) : undefined };
}

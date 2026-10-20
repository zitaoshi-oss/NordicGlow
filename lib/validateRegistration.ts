import type { RegistrationInput } from "./registrations";

// 前台報名與後台修改共用的欄位檢查
const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export function parseRegistration(formData: FormData) {
  const data: RegistrationInput = {
    nameZh: text(formData, "nameZh"),
    nameEn: text(formData, "nameEn").toUpperCase(),
    gender: text(formData, "gender"),
    birthday: text(formData, "birthday"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    room: text(formData, "room"),
    roommate: text(formData, "roommate"),
    noFiveSpices: formData.get("noFiveSpices") === "on",
    allergies: text(formData, "allergies"),
    emergencyName: text(formData, "emergencyName"),
    emergencyPhone: text(formData, "emergencyPhone"),
    note: text(formData, "note"),
    identity: text(formData, "identity"),
    dharmaName: text(formData, "dharmaName"),
  };
  // 居士不需要法名，切換身份後殘留的值一併清掉
  if (data.identity !== "比丘尼") data.dharmaName = "";

  const errors: Record<string, string> = {};
  if (!["比丘尼", "居士"].includes(data.identity)) errors.identity = "請選擇身份";
  if (data.identity === "比丘尼" && !data.dharmaName) errors.dharmaName = "比丘尼請填寫法名";
  if (!data.nameZh) errors.nameZh = "請填寫中文姓名";
  if (!/^[A-Z]+(?:(?:, ?| |-)[A-Z]+)*$/.test(data.nameEn)) errors.nameEn = "請依護照填寫英文姓名，例如 WANG, XIAO-MING";
  if (!data.gender) errors.gender = "請選擇性別";
  if (!data.birthday) errors.birthday = "請填寫出生日期";
  if (!/^[0-9+\-\s]{8,20}$/.test(data.phone)) errors.phone = "請填寫正確的手機號碼";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "請填寫正確的 Email";
  if (!data.room) errors.room = "請選擇房型";
  if (!data.emergencyName) errors.emergencyName = "請填寫緊急聯絡人";
  if (!/^[0-9+\-\s]{8,20}$/.test(data.emergencyPhone)) errors.emergencyPhone = "請填寫緊急聯絡人電話";

  // 送出失敗時把填寫值傳回去，表單才不會被清空
  const values = Object.fromEntries(
    [...formData.entries()].filter(([key]) => !key.startsWith("$")).map(([key, value]) => [key, String(value)]),
  );

  return { data, errors, values };
}

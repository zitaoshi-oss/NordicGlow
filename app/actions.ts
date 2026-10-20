"use server";

import { refresh } from "next/cache";
import { addRegistration } from "@/lib/registrations";
import { parseRegistration } from "@/lib/validateRegistration";

export type RegisterState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  name?: string;
};

export async function register(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const { data, errors, values } = parseRegistration(formData);
  if (formData.get("agree") !== "on") errors.agree = "請勾選同意報名須知";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "有欄位需要修正，請檢查標示紅字的地方。", errors, values };
  }

  const entry = await addRegistration(data);
  refresh();

  // 比丘尼以法名稱呼
  const name = data.identity === "比丘尼" ? `${data.dharmaName}法師` : data.nameZh;
  return entry.status === "正取"
    ? { ok: true, name, message: `${name} 您好，報名成功！您是正取名額，專人將於 3 個工作天內與您聯繫。` }
    : { ok: true, name, message: `${name} 您好，16 位正取名額已滿，已為您登記候補，如有名額釋出將優先通知。` };
}

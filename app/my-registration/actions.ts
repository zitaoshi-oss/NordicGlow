"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  REGISTRANT_COOKIE,
  REGISTRANT_PATH,
  SESSION_MINUTES,
  createRegistrantToken,
  getRegistrantContact,
  isLookupBlocked,
  recordLookupFailure,
} from "@/lib/registrantAuth";
import { findRegistrationsByContact, updateOwnRegistration } from "@/lib/registrations";
import { parseRegistration } from "@/lib/validateRegistration";

export type LookupState = { error: string; email?: string; phone?: string };

export async function lookup(_prev: LookupState, formData: FormData): Promise<LookupState> {
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!email || !phone) return { error: "請填寫報名時的 Email 與手機", email, phone };

  if (await isLookupBlocked(email)) {
    return { error: `查詢失敗次數過多，請 15 分鐘後再試，或直接與我們聯繫。`, email, phone };
  }

  const found = await findRegistrationsByContact(email, phone);
  if (found.length === 0) {
    await recordLookupFailure(email);
    // 失敗時稍微延遲，降低亂猜的速度
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "查無報名資料，請確認 Email 與手機是否與報名時填寫的相同。", email, phone };
  }

  (await cookies()).set(REGISTRANT_COOKIE, createRegistrantToken({ email, phone }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: REGISTRANT_PATH,
    maxAge: SESSION_MINUTES * 60,
  });
  redirect(REGISTRANT_PATH);
}

export async function endLookup() {
  (await cookies()).delete({ name: REGISTRANT_COOKIE, path: REGISTRANT_PATH });
  redirect(REGISTRANT_PATH);
}

export type SelfEditState = {
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function saveOwnRegistration(id: string, _prev: SelfEditState, formData: FormData): Promise<SelfEditState> {
  const contact = await getRegistrantContact();
  if (!contact) redirect(REGISTRANT_PATH);

  // Email 與手機是查詢憑證，報名者不能自己改，一律沿用查詢時的值
  formData.set("email", contact.email);
  formData.set("phone", contact.phone);
  const { data, errors, values } = parseRegistration(formData);

  if (Object.keys(errors).length > 0) {
    return { message: "有欄位需要修正，請檢查標示紅字的地方。", errors, values };
  }

  // 沿用資料庫裡原本的寫法，避免只因大小寫或格式不同就改掉
  const [original] = (await findRegistrationsByContact(contact.email, contact.phone)).filter((r) => r.id === id);
  if (!original) return { message: "找不到這筆報名，可能已被取消，請與我們聯繫。", values };

  const result = await updateOwnRegistration(id, contact, { ...data, email: original.email, phone: original.phone });
  if (!result.ok) return { message: result.error, values };
  redirect(`${REGISTRANT_PATH}?msg=updated`);
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, SESSION_HOURS, checkPassword, createSessionToken, hasAdminSession } from "@/lib/adminAuth";
import { deleteRegistration, updateRegistration } from "@/lib/registrations";
import { parseRegistration } from "@/lib/validateRegistration";

export async function login(_prev: { error: string }, formData: FormData) {
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    // 失敗時稍微延遲，降低暴力猜密碼的速度
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "密碼錯誤" };
  }
  (await cookies()).set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_HOURS * 60 * 60,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}

export type EditState = {
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

// Server Action 可以被直接呼叫，所以每個後台動作都要自己檢查登入，不能只靠頁面擋
async function requireAdmin() {
  if (!(await hasAdminSession())) redirect("/admin");
}

export async function saveRegistration(id: string, _prev: EditState, formData: FormData): Promise<EditState> {
  await requireAdmin();
  const { data, errors, values } = parseRegistration(formData);
  const status = formData.get("status");
  if (status !== "正取" && status !== "候補") errors.status = "請選擇狀態";

  if (Object.keys(errors).length > 0) {
    return { message: "有欄位需要修正，請檢查標示紅字的地方。", errors, values };
  }

  const result = await updateRegistration(id, { ...data, status: status as "正取" | "候補" });
  if (!result.ok) return { message: result.error, values };
  redirect("/admin?msg=updated");
}

export async function removeRegistration(formData: FormData) {
  await requireAdmin();
  const { promoted } = await deleteRegistration(String(formData.get("id") ?? ""));
  redirect(promoted ? `/admin?msg=deleted&promoted=${promoted.id}` : "/admin?msg=deleted");
}

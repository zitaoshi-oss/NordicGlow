// 報名欄位：前台報名表、報名者修改頁與後台修改頁共用
export const inputClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30 focus:outline-none";

function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-slate-100">
        {label}
        {required && <span className="ml-1 text-rose-300">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-rose-300">{error}</p>}
    </div>
  );
}

export default function RegistrationFields({
  v,
  e,
  contactLocked,
}: {
  v: Record<string, string | undefined>;
  e: Record<string, string | undefined>;
  // 報名者自己修改時，Email 與手機是查詢憑證，只能看不能改
  contactLocked?: boolean;
}) {
  const lockedHint = contactLocked ? "這是查詢報名用的資料，如需更改請與我們聯繫" : undefined;
  const lockedClass = contactLocked ? " cursor-not-allowed opacity-60" : "";

  return (
    <>
    <fieldset className="grid gap-5 sm:grid-cols-2">
      <legend className="mb-4 font-serif text-xl font-bold text-white">旅客資料</legend>
      <Field label="中文姓名" name="nameZh" required error={e.nameZh}>
        <input id="nameZh" name="nameZh" defaultValue={v.nameZh} className={inputClass} autoComplete="name" />
      </Field>
      <Field label="護照英文姓名" name="nameEn" required error={e.nameEn} hint="請與護照完全相同，例如 WANG, XIAO-MING">
        <input id="nameEn" name="nameEn" defaultValue={v.nameEn} className={`${inputClass} uppercase`} />
      </Field>
      <Field label="性別" name="gender" required error={e.gender}>
        <select id="gender" name="gender" defaultValue={v.gender ?? ""} className={inputClass}>
          <option value="" disabled>
            請選擇
          </option>
          <option>女</option>
          <option>男</option>
        </select>
      </Field>
      <Field label="出生日期" name="birthday" required error={e.birthday}>
        <input id="birthday" name="birthday" type="date" defaultValue={v.birthday} className={inputClass} />
      </Field>
      <Field label="手機" name="phone" required error={e.phone} hint={lockedHint}>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} placeholder="0912-345-678" className={inputClass + lockedClass} autoComplete="tel" readOnly={contactLocked} />
      </Field>
      <Field label="Email" name="email" required error={e.email} hint={lockedHint}>
        <input id="email" name="email" type="email" defaultValue={v.email} placeholder="name@example.com" className={inputClass + lockedClass} autoComplete="email" readOnly={contactLocked} />
      </Field>
    </fieldset>

    <fieldset className="grid gap-5 sm:grid-cols-2">
      <legend className="mb-4 font-serif text-xl font-bold text-white">住宿與飲食</legend>
      <Field label="房型" name="room" required error={e.room}>
        <select id="room" name="room" defaultValue={v.room ?? ""} className={inputClass}>
          <option value="" disabled>
            請選擇
          </option>
          <option>雙人房（與同行者同住）</option>
          <option>雙人房（由旅行社安排同性室友）</option>
          <option>單人房（需補房差）</option>
        </select>
      </Field>
      <Field label="同住者姓名" name="roommate" hint="選擇與同行者同住時填寫">
        <input id="roommate" name="roommate" defaultValue={v.roommate} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <p className="text-sm font-medium text-slate-100">飲食</p>
        <div className="mt-2 flex flex-col gap-3 rounded-xl border border-white/15 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-white">🥛 本團全程奶素（可食乳製品，不含肉、海鮮、蛋）</span>
          <label className="flex items-center gap-2 text-slate-100">
            <input
              type="checkbox"
              name="noFiveSpices"
              defaultChecked={v.noFiveSpices === "on"}
              className="h-5 w-5 accent-emerald-300"
            />
            我不吃五辛（蔥、蒜、韭、洋蔥等）
          </label>
        </div>
      </div>
      <div className="sm:col-span-2">
        <Field label="食物過敏或其他飲食需求" name="allergies">
          <input id="allergies" name="allergies" defaultValue={v.allergies} placeholder="例如：堅果過敏、不吃菇類" className={inputClass} />
        </Field>
      </div>
    </fieldset>

    <fieldset className="grid gap-5 sm:grid-cols-2">
      <legend className="mb-4 font-serif text-xl font-bold text-white">緊急聯絡人</legend>
      <Field label="姓名" name="emergencyName" required error={e.emergencyName}>
        <input id="emergencyName" name="emergencyName" defaultValue={v.emergencyName} className={inputClass} />
      </Field>
      <Field label="電話" name="emergencyPhone" required error={e.emergencyPhone}>
        <input id="emergencyPhone" name="emergencyPhone" type="tel" defaultValue={v.emergencyPhone} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="備註" name="note">
          <textarea id="note" name="note" rows={3} defaultValue={v.note} placeholder="行動需求、慶生、其他想告訴我們的事" className={inputClass} />
        </Field>
      </div>
    </fieldset>
    </>
  );
}

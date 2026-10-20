import { connection } from "next/server";
import RegistrationForm from "./RegistrationForm";
import { readRegistrations } from "@/lib/registrations";
import { trip } from "@/lib/trip";

async function getSeats() {
  await connection();
  const list = await readRegistrations();
  const confirmed = list.filter((r) => r.status === "正取").length;
  return { confirmed, left: Math.max(trip.capacity - confirmed, 0) };
}

export async function SeatBadge() {
  const { left } = await getSeats();
  return left > 0 ? (
    <span className="text-emerald-200">
      剩餘 <strong className="font-serif text-2xl text-white">{left}</strong> / {trip.capacity} 席
    </span>
  ) : (
    <span className="text-amber-200">正取已額滿・開放候補</span>
  );
}

export async function SeatMeter() {
  const { confirmed, left } = await getSeats();
  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="text-slate-200">已報名</p>
        <p className="text-white">
          <span className="font-serif text-4xl font-bold">{confirmed}</span>
          <span className="text-slate-300"> / {trip.capacity} 人</span>
        </p>
      </div>
      <div className="mt-3 grid grid-cols-8 gap-1.5" aria-hidden>
        {Array.from({ length: trip.capacity }, (_, i) => (
          <span key={i} className={`h-3 rounded-full ${i < confirmed ? "bg-emerald-300" : "bg-white/15"}`} />
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {left > 0 ? `尚有 ${left} 個正取名額` : "正取名額已滿，仍可登記候補"}
      </p>
    </div>
  );
}

export async function RegistrationArea() {
  const { left } = await getSeats();
  return <RegistrationForm full={left === 0} />;
}

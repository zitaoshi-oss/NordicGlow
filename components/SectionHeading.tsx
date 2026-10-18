export default function SectionHeading({
  eyebrow,
  title,
  desc,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-emerald-300 uppercase">
        <span className="h-px w-10 bg-emerald-300" />
        {eyebrow}
      </p>
      <Tag className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">{title}</Tag>
      {desc && <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{desc}</p>}
    </div>
  );
}

export default function StatCard({
  title,
  value,
  subtitle,
  accent = "slate",
}) {
  const accentStyles = {
    slate: "border-slate-700 bg-slate-900",
    emerald: "border-emerald-500/20 bg-emerald-500/10",
    amber: "border-amber-500/20 bg-amber-500/10",
    red: "border-red-500/20 bg-red-500/10",
    sky: "border-sky-500/20 bg-sky-500/10",
    violet: "border-violet-500/20 bg-violet-500/10",
  };

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${accentStyles[accent] || accentStyles.slate}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-slate-300">{subtitle}</p>
          )}
        </div>

        <div className="h-3 w-3 rounded-full bg-white/80" />
      </div>
    </div>
  );
}
export function StatCard({
  value,
  label,
  sublabel,
}: {
  value: string;
  label: string;
  sublabel?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card p-6">
      <p className="text-3xl font-extrabold text-accent sm:text-4xl">{value}</p>
      <p className="mt-2 font-bold text-white">{label}</p>
      {sublabel && <p className="mt-1 text-sm text-white/50">{sublabel}</p>}
    </div>
  );
}

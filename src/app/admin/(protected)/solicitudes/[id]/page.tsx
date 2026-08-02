import Link from "next/link";
import { notFound } from "next/navigation";
import { getMeetingRequestById } from "@/lib/data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-UY", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-white">{value}</p>
    </div>
  );
}

export default async function SolicitudDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = await getMeetingRequestById(id);
  if (!req) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/solicitudes" className="mb-6 inline-block text-sm text-white/50 hover:text-white">
        ← Volver a solicitudes
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{req.name}</h1>
          <p className="text-white/50">{formatDate(req.createdAt)}</p>
        </div>
        {req.emailError ? (
          <span className="shrink-0 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
            Error al notificar: {req.emailError}
          </span>
        ) : req.emailSent ? (
          <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
            Notificado por email
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/50">
            Pendiente de notificar
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-card p-6 sm:grid-cols-2">
        <Row label="Email" value={req.email} />
        <Row label="Teléfono" value={req.phone} />
        <Row label="Empresa" value={req.company} />
        <Row label="Cargo" value={req.role} />
        <Row label="Sitio web" value={req.website} />
        <Row label="Tamaño de la empresa" value={req.companySize} />
        <Row label="Timeline" value={req.timeline} />
        <Row label="Presupuesto" value={req.budget} />
        <div className="sm:col-span-2">
          <Row label="Principal desafío" value={req.mainChallenge} />
        </div>
        {req.message && (
          <div className="sm:col-span-2">
            <Row label="Mensaje" value={req.message} />
          </div>
        )}
      </div>
    </div>
  );
}

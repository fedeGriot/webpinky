import Link from "next/link";
import { getMeetingRequests } from "@/lib/data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function SolicitudesPage() {
  const requests = await getMeetingRequests();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-white">Solicitudes de reunión</h1>
      <p className="mb-8 text-white/50">
        Formularios completados desde /contacto. Se ordenan del más reciente al más antiguo.
      </p>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-card p-6 text-white/50">
          Todavía no hay solicitudes.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-card text-xs font-semibold uppercase tracking-wide text-white/40">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Presupuesto</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white/60">{formatDate(req.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/solicitudes/${req.id}`} className="font-semibold text-white hover:text-accent">
                      {req.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white/70">{req.company}</td>
                  <td className="px-4 py-3 text-white/50">
                    <p>{req.email}</p>
                    <p>{req.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-white/70">{req.timeline}</td>
                  <td className="px-4 py-3 text-white/70">{req.budget}</td>
                  <td className="px-4 py-3">
                    {req.emailError ? (
                      <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                        Error de envío
                      </span>
                    ) : req.emailSent ? (
                      <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                        Notificado
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/50">
                        Pendiente
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

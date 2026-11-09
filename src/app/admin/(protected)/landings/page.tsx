import Link from "next/link";
import { getAllLandings } from "@/lib/data";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

export default async function AdminLandingsPage() {
  const landings = await getAllLandings();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">Landings de servicios</h1>
          <p className="text-white/50">Páginas por servicio en /servicios/…, con la estructura recomendada por Dahseo.</p>
        </div>
        <Link
          href="/admin/landings/nueva"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark"
        >
          + Nueva landing
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {landings.length === 0 && <p className="text-white/40">Todavía no hay landings.</p>}
        {landings.map((landing) => (
          <div
            key={landing.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card p-5 transition hover:border-accent/50"
          >
            <Link href={`/admin/landings/${landing.id}`} className="flex flex-1 items-center justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-bold text-white">{landing.navLabel}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      landing.published ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/50"
                    }`}
                  >
                    {landing.published ? "Publicada" : "Borrador"}
                  </span>
                </div>
                <p className="text-sm text-white/50">{landing.seoTitle}</p>
              </div>
              <span className="text-sm text-white/40">/servicios/{landing.slug} →</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

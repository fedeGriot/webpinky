import Link from "next/link";
import { getAllProjects } from "@/lib/data";
import { moveProject } from "@/lib/actions/projects";
import { ReorderButtons } from "@/components/admin/reorder-buttons";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

export default async function AdminProyectosPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">Proyectos</h1>
          <p className="text-white/50">Casos de estudio del sitio.</p>
        </div>
        <Link
          href="/admin/proyectos/nuevo"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark"
        >
          + Nuevo proyecto
        </Link>
      </div>

      <p className="mb-4 text-xs text-white/40">
        El orden de esta lista es el orden real del sitio (listado, carrusel de Home y
        navegación anterior/siguiente en la ficha) — reordená con las flechas, no hace falta
        escribir números a mano.
      </p>

      <div className="flex flex-col gap-3">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card p-5 transition hover:border-accent/50"
          >
            <ReorderButtons
              action={moveProject}
              id={project.id}
              disableUp={i === 0}
              disableDown={i === projects.length - 1}
            />
            <Link href={`/admin/proyectos/${project.id}/editar`} className="flex flex-1 items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-bold text-white">{project.title}</p>
                  {project.featured && (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                      Destacado
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/50">
                  {project.clientName} · {project.category} · {project.year}
                </p>
              </div>
              <span className="text-sm text-white/40">/proyectos/{project.slug} →</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

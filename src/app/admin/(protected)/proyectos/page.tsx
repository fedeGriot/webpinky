import Link from "next/link";
import { getAllProjects } from "@/lib/data";

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

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/proyectos/${project.id}/editar`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-card p-5 transition hover:border-accent/50"
          >
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
                {project.clientName} · {project.category} · {project.year} · orden {project.order}
              </p>
            </div>
            <span className="text-sm text-white/40">/proyectos/{project.slug} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { createProject } from "@/lib/actions/projects";
import { ProjectFields } from "@/components/admin/project-fields";
import { SaveButton } from "@/components/admin/save-button";
import { getAllProjects } from "@/lib/data";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

export default async function NuevoProyectoPage() {
  const projects = await getAllProjects();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Nuevo proyecto</h1>
      <p className="mb-8 text-white/50">
        Guardá los datos principales; después de crearlo vas a poder agregar stats y piezas de
        galería.
      </p>

      <form action={createProject} className="flex flex-col gap-4">
        <ProjectFields defaults={{ order: projects.length }} />
        <div>
          <SaveButton label="Crear proyecto" />
        </div>
      </form>
    </div>
  );
}

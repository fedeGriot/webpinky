import { createProject } from "@/lib/actions/projects";
import { ProjectFields } from "@/components/admin/project-fields";
import { SaveButton } from "@/components/admin/save-button";

export default function NuevoProyectoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Nuevo proyecto</h1>
      <p className="mb-8 text-white/50">
        Guardá los datos principales; después de crearlo vas a poder agregar stats y piezas de
        galería. Se agrega al final de la lista — reordenalo desde /admin/proyectos si hace falta.
      </p>

      <form action={createProject} className="flex flex-col gap-4">
        <ProjectFields defaults={{}} />
        <div>
          <SaveButton label="Crear proyecto" />
        </div>
      </form>
    </div>
  );
}

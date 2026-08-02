import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import {
  updateProject,
  deleteProject,
  createProjectStat,
  deleteProjectStat,
  moveProjectStat,
  createProjectPiece,
  deleteProjectPiece,
  moveProjectPiece,
} from "@/lib/actions/projects";
import { ProjectFields } from "@/components/admin/project-fields";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { UploadHint } from "@/components/admin/upload-hint";
import { inputClass, labelClass } from "@/components/admin/form-styles";

export default async function EditarProyectoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">{project.title}</h1>
          <p className="text-white/50">/proyectos/{project.slug}</p>
        </div>
        <form action={deleteProject}>
          <input type="hidden" name="id" value={project.id} />
          <DeleteButton confirmMessage={`¿Eliminar el proyecto "${project.title}"? Esta acción no se puede deshacer.`} />
        </form>
      </div>

      <form action={updateProject} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={project.id} />
        <ProjectFields defaults={project} />
        <div>
          <SaveButton />
        </div>
      </form>

      <section className="mt-14">
        <h2 className="mb-1 text-xl font-bold text-white">Stats del proyecto</h2>
        <p className="mb-4 text-sm text-white/50">Los números que aparecen debajo del hero.</p>

        <form action={createProjectStat} className="mb-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="projectId" value={project.id} />
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Valor</label>
            <input name="value" required className={`${inputClass} w-28`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Label</label>
            <input name="label" required className={inputClass} />
          </div>
          <SaveButton label="Agregar stat" />
        </form>
        <p className="mb-4 -mt-2 text-xs text-white/40">Se agrega al final — reordená con las flechas de abajo.</p>

        <div className="flex flex-col gap-2">
          {project.stats.map((stat, i) => (
            <div key={stat.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-card p-4">
              <ReorderButtons
                action={moveProjectStat}
                id={stat.id}
                projectId={project.id}
                disableUp={i === 0}
                disableDown={i === project.stats.length - 1}
              />
              <p className="flex-1 text-white">
                <span className="font-bold text-accent">{stat.value}</span> — {stat.label}
              </p>
              <form action={deleteProjectStat}>
                <input type="hidden" name="id" value={stat.id} />
                <input type="hidden" name="projectId" value={project.id} />
                <DeleteButton confirmMessage="¿Eliminar este stat?" />
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-1 text-xl font-bold text-white">Piezas / galería</h2>
        <p className="mb-4 text-sm text-white/50">
          Piezas creativas del proyecto (con imagen opcional).
        </p>

        <form action={createProjectPiece} className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-card p-5">
          <input type="hidden" name="projectId" value={project.id} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Tipo</label>
              <input name="type" placeholder="video, post, ooh…" className={inputClass} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className={labelClass}>Título</label>
              <input name="title" required className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Subtítulo (opcional)</label>
            <input name="subtitle" className={inputClass} />
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Imagen (opcional)</label>
              <input name="image" type="file" accept="image/*" className="text-sm text-white/70" />
              <UploadHint size="1080×1920px" format="JPG o WEBP" note="siempre se muestra vertical (9:16)" />
            </div>
            <SaveButton label="Agregar pieza" />
          </div>
        </form>
        <p className="mb-4 text-xs text-white/40">
          Se agrega al final — reordená con las flechas de cada pieza. Solo las primeras 3 (en
          este orden) se muestran en la ficha pública del proyecto.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {project.pieces.map((piece, i) => (
            <div key={piece.id} className="rounded-xl border border-white/10 bg-card p-4">
              {piece.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={piece.imageUrl} alt={piece.title} className="mb-3 h-28 w-full rounded-lg object-cover" />
              )}
              <p className="font-bold text-white">{piece.title}</p>
              {piece.subtitle && <p className="text-sm text-white/50">{piece.subtitle}</p>}
              <div className="mt-3 flex items-center justify-between">
                <ReorderButtons
                  action={moveProjectPiece}
                  id={piece.id}
                  projectId={project.id}
                  disableUp={i === 0}
                  disableDown={i === project.pieces.length - 1}
                />
                <form action={deleteProjectPiece}>
                  <input type="hidden" name="id" value={piece.id} />
                  <input type="hidden" name="projectId" value={project.id} />
                  <DeleteButton confirmMessage="¿Eliminar esta pieza?" />
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { getProcessSteps } from "@/lib/data";
import { createProcessStep, updateProcessStep, deleteProcessStep } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";

export default async function ProcesoPage() {
  const steps = await getProcessSteps();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Proceso de trabajo</h1>
      <p className="mb-8 text-white/50">Los pasos de “Cómo trabajamos” en ¿Qué hacemos?.</p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar paso</h2>
        <form action={createProcessStep} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Orden</label>
              <input name="order" type="number" defaultValue={steps.length} className={`${inputClass} w-20`} />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className={labelClass}>Título</label>
              <input name="title" required className={inputClass} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Descripción</label>
            <textarea name="description" required className={textareaClass} />
          </div>
          <div>
            <SaveButton label="Agregar" />
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <form
            key={step.id}
            action={updateProcessStep}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-6"
          >
            <input type="hidden" name="id" value={step.id} />
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Orden</label>
                <input name="order" type="number" defaultValue={step.order} className={`${inputClass} w-20`} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className={labelClass}>Título</label>
                <input name="title" defaultValue={step.title} required className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Descripción</label>
              <textarea name="description" defaultValue={step.description} required className={textareaClass} />
            </div>
            <div className="flex gap-3">
              <SaveButton />
              <form action={deleteProcessStep}>
                <input type="hidden" name="id" value={step.id} />
                <DeleteButton confirmMessage={`¿Eliminar "${step.title}"?`} />
              </form>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

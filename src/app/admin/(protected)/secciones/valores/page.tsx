import { getValues } from "@/lib/data";
import { createValue, updateValue, deleteValue } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

export default async function ValoresPage() {
  const values = await getValues();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Valores</h1>
      <p className="mb-8 text-white/50">“Cosas en las que creemos” en ¿Quiénes somos?.</p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar valor</h2>
        <form action={createValue} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Orden</label>
              <input name="order" type="number" defaultValue={values.length} className={`${inputClass} w-20`} />
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
        {values.map((value) => (
          <form
            key={value.id}
            action={updateValue}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-6"
          >
            <input type="hidden" name="id" value={value.id} />
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Orden</label>
                <input name="order" type="number" defaultValue={value.order} className={`${inputClass} w-20`} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className={labelClass}>Título</label>
                <input name="title" defaultValue={value.title} required className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Descripción</label>
              <textarea name="description" defaultValue={value.description} required className={textareaClass} />
            </div>
            <div className="flex gap-3">
              <SaveButton />
              <form action={deleteValue}>
                <input type="hidden" name="id" value={value.id} />
                <DeleteButton confirmMessage={`¿Eliminar "${value.title}"?`} />
              </form>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

import { getStats } from "@/lib/data";
import { createStat, updateStat, deleteStat } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass, labelClass } from "@/components/admin/form-styles";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

// Los KPIs de "Quiénes somos" se editan en /admin/secciones/about — esta
// página quedó dedicada solo a los stats de "¿Qué hacemos?", que ahora
// pueden ser más de 3: el sitio público elige 3 al azar en cada visita
// (ver pickRandom en src/app/que-hacemos/page.tsx).
const STATS_CONTEXT = "services";

export default async function StatsPage() {
  const stats = await getStats(STATS_CONTEXT);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Stats de servicios</h1>
      <p className="mb-8 text-white/50">
        Números destacados de la sección “Resultados que hablan” en ¿Qué hacemos?. En el sitio se
        muestran siempre 3, elegidos al azar entre todos los que cargues acá — podés agregar más
        de 3 para que vayan rotando en cada visita.
      </p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar stat</h2>
        <form action={createStat} className="flex flex-wrap items-end gap-4">
          <input type="hidden" name="context" value={STATS_CONTEXT} />
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Valor</label>
            <input name="value" required placeholder="Ej: +68%" className={`${inputClass} w-28`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Label</label>
            <input name="label" required placeholder="Ej: Farmacias Pigalle" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Sublabel (opcional)</label>
            <input name="sublabel" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Orden</label>
            <input name="order" type="number" defaultValue={stats.length} className={`${inputClass} w-20`} />
          </div>
          <SaveButton label="Agregar" />
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {stats.map((stat) => (
          <form
            key={stat.id}
            action={updateStat}
            className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-card p-4"
          >
            <input type="hidden" name="id" value={stat.id} />
            <input type="hidden" name="context" value={STATS_CONTEXT} />
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Valor</label>
              <input name="value" defaultValue={stat.value} required className={`${inputClass} w-28`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Label</label>
              <input name="label" defaultValue={stat.label} required className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Sublabel</label>
              <input name="sublabel" defaultValue={stat.sublabel ?? ""} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Orden</label>
              <input name="order" type="number" defaultValue={stat.order} className={`${inputClass} w-20`} />
            </div>
            <SaveButton />
            <form action={deleteStat}>
              <input type="hidden" name="id" value={stat.id} />
              <DeleteButton confirmMessage={`¿Eliminar stat "${stat.label}"?`} />
            </form>
          </form>
        ))}
      </div>
    </div>
  );
}

import { getStats } from "@/lib/data";
import { createStat, updateStat, deleteStat } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass, labelClass } from "@/components/admin/form-styles";

export default async function StatsPage() {
  const [aboutStats, servicesStats] = await Promise.all([getStats("about"), getStats("services")]);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Stats</h1>
      <p className="mb-8 text-white/50">
        Números destacados usados en ¿Quiénes somos? (context “about”) y ¿Qué hacemos? (context
        “services”).
      </p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar stat</h2>
        <form action={createStat} className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Contexto</label>
            <select name="context" className={inputClass}>
              <option value="about">about</option>
              <option value="services">services</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Valor</label>
            <input name="value" required className={`${inputClass} w-28`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Label</label>
            <input name="label" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Sublabel (opcional)</label>
            <input name="sublabel" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Orden</label>
            <input name="order" type="number" defaultValue={0} className={`${inputClass} w-20`} />
          </div>
          <SaveButton label="Agregar" />
        </form>
      </div>

      {[
        { title: "Quiénes somos (about)", items: aboutStats },
        { title: "Qué hacemos (services)", items: servicesStats },
      ].map((group) => (
        <div key={group.title} className="mb-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/40">
            {group.title}
          </h2>
          <div className="flex flex-col gap-3">
            {group.items.map((stat) => (
              <form
                key={stat.id}
                action={updateStat}
                className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-card p-4"
              >
                <input type="hidden" name="id" value={stat.id} />
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Contexto</label>
                  <select name="context" defaultValue={stat.context} className={inputClass}>
                    <option value="about">about</option>
                    <option value="services">services</option>
                  </select>
                </div>
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
      ))}
    </div>
  );
}

import { getAboutContent, getStats } from "@/lib/data";
import { upsertAbout, createStat, updateStat, deleteStat } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { labelClass, inputClass, textareaClass } from "@/components/admin/form-styles";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

const STATS_CONTEXT = "about";

export default async function AboutSectionPage() {
  const [about, stats] = await Promise.all([getAboutContent(), getStats(STATS_CONTEXT)]);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Contenido — Quiénes somos</h1>
      <p className="mb-8 text-white/50">Textos largos de la página institucional.</p>

      <form action={upsertAbout} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="heroTitle">
            Título principal
          </label>
          <input id="heroTitle" name="heroTitle" defaultValue={about?.heroTitle} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="heroBody">
            Párrafo introductorio
          </label>
          <textarea id="heroBody" name="heroBody" defaultValue={about?.heroBody} required className={textareaClass} />
          <p className="text-xs text-white/40">
            Texto plano (sin editor de formato): las frases “ADN digital” se resaltan en negrita
            automáticamente en el sitio, y eso necesita que el texto quede sin etiquetas.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="growthTitle">
            Título — “Crecemos junto a...”
          </label>
          <input id="growthTitle" name="growthTitle" defaultValue={about?.growthTitle} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="growthBody">
            Párrafo — growth partner
          </label>
          <textarea id="growthBody" name="growthBody" defaultValue={about?.growthBody} required className={textareaClass} />
          <p className="text-xs text-white/40">
            Texto plano (sin editor de formato): las frases “growth partner”, “2010” y “500
            marcas” se resaltan en negrita automáticamente en el sitio.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Bloque “Service-Centric”</label>
          <RichTextEditor name="serviceCentricBody" defaultValue={about?.serviceCentricBody} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Bloque “Growth Partner”</label>
          <RichTextEditor name="growthPartnerBody" defaultValue={about?.growthPartnerBody} />
        </div>
        <div>
          <SaveButton />
        </div>
      </form>

      <section className="mt-14">
        <h2 className="mb-1 text-xl font-bold text-white">KPIs</h2>
        <p className="mb-4 text-sm text-white/50">
          Los 4 números destacados debajo del párrafo introductorio (ej. “+15 años construyendo…”).
        </p>

        <form action={createStat} className="mb-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="context" value={STATS_CONTEXT} />
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Valor</label>
            <input name="value" required placeholder="Ej: +15" className={`${inputClass} w-24`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Label</label>
            <input name="label" required placeholder="Ej: años construyendo" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Sublabel (opcional)</label>
            <input name="sublabel" placeholder="Ej: marcas que crecen" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Orden</label>
            <input name="order" type="number" defaultValue={stats.length} className={`${inputClass} w-20`} />
          </div>
          <SaveButton label="Agregar KPI" />
        </form>

        <div className="flex flex-col gap-3">
          {stats.map((stat) => (
            <form
              key={stat.id}
              action={updateStat}
              className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-card p-4"
            >
              <input type="hidden" name="id" value={stat.id} />
              <input type="hidden" name="context" value={STATS_CONTEXT} />
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Valor</label>
                <input name="value" defaultValue={stat.value} required className={`${inputClass} w-24`} />
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
                <DeleteButton confirmMessage={`¿Eliminar el KPI "${stat.value} — ${stat.label}"?`} />
              </form>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}

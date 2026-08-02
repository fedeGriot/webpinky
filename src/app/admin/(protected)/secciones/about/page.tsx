import { getAboutContent } from "@/lib/data";
import { upsertAbout } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { labelClass, inputClass, textareaClass } from "@/components/admin/form-styles";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default async function AboutSectionPage() {
  const about = await getAboutContent();

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
    </div>
  );
}

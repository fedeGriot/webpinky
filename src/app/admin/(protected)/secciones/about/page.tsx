import { getAboutContent } from "@/lib/data";
import { upsertAbout } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { labelClass, inputClass, textareaClass } from "@/components/admin/form-styles";

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
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="serviceCentricBody">
            Bloque “Service-Centric”
          </label>
          <textarea
            id="serviceCentricBody"
            name="serviceCentricBody"
            defaultValue={about?.serviceCentricBody}
            required
            className={textareaClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="growthPartnerBody">
            Bloque “Growth Partner”
          </label>
          <textarea
            id="growthPartnerBody"
            name="growthPartnerBody"
            defaultValue={about?.growthPartnerBody}
            required
            className={textareaClass}
          />
        </div>
        <div>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}

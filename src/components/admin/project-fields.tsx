import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";

export type ProjectFieldDefaults = {
  slug?: string;
  title?: string;
  clientName?: string;
  industry?: string;
  year?: number;
  featured?: boolean;
  order?: number;
  category?: string;
  heroHeadline?: string;
  accentColor?: string;
  summary?: string;
  resultBadge?: string;
  resultLabel?: string;
  challengeTitle?: string;
  challengeBody?: string;
  solutionTitle?: string;
  solutionBody?: string;
  quoteText?: string | null;
  quoteAuthor?: string | null;
  servicesTags?: string[];
};

export function ProjectFields({ defaults = {} }: { defaults?: ProjectFieldDefaults }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Título">
          <input name="title" defaultValue={defaults.title} required className={inputClass} />
        </Field>
        <Field label="Slug (URL)">
          <input name="slug" defaultValue={defaults.slug} required className={inputClass} />
        </Field>
        <Field label="Cliente">
          <input name="clientName" defaultValue={defaults.clientName} required className={inputClass} />
        </Field>
        <Field label="Industria">
          <input name="industry" defaultValue={defaults.industry} required className={inputClass} />
        </Field>
        <Field label="Año">
          <input
            name="year"
            type="number"
            defaultValue={defaults.year ?? new Date().getFullYear()}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Categoría">
          <input name="category" defaultValue={defaults.category} required className={inputClass} />
        </Field>
        <Field label="Orden (posición)">
          <input name="order" type="number" defaultValue={defaults.order ?? 0} className={inputClass} />
        </Field>
        <Field label="Color de acento">
          <input
            name="accentColor"
            type="color"
            defaultValue={defaults.accentColor ?? "#D81470"}
            className={`${inputClass} h-11 p-1`}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-white/70">
        <input type="checkbox" name="featured" defaultChecked={defaults.featured} className="h-4 w-4" />
        Destacar en Home (carrusel de proyectos)
      </label>

      <Field label="Headline (hero de la página de detalle)">
        <input name="heroHeadline" defaultValue={defaults.heroHeadline} required className={inputClass} />
      </Field>
      <Field label="Resumen">
        <textarea name="summary" defaultValue={defaults.summary} required className={textareaClass} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Resultado destacado (badge)">
          <input name="resultBadge" defaultValue={defaults.resultBadge} required className={inputClass} />
        </Field>
        <Field label="Descripción del resultado">
          <input name="resultLabel" defaultValue={defaults.resultLabel} required className={inputClass} />
        </Field>
      </div>

      <Field label="Servicios (uno por línea)">
        <textarea
          name="servicesTags"
          defaultValue={defaults.servicesTags?.join("\n")}
          className={textareaClass}
        />
      </Field>

      <Field label="Título — El desafío">
        <input name="challengeTitle" defaultValue={defaults.challengeTitle} required className={inputClass} />
      </Field>
      <Field label="Cuerpo — El desafío">
        <textarea name="challengeBody" defaultValue={defaults.challengeBody} required className={textareaClass} />
      </Field>
      <Field label="Título — La solución">
        <input name="solutionTitle" defaultValue={defaults.solutionTitle} required className={inputClass} />
      </Field>
      <Field label="Cuerpo — La solución">
        <textarea name="solutionBody" defaultValue={defaults.solutionBody} required className={textareaClass} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Cita (testimonio, opcional)">
          <textarea name="quoteText" defaultValue={defaults.quoteText ?? ""} className={textareaClass} />
        </Field>
        <Field label="Autor de la cita (opcional)">
          <input name="quoteAuthor" defaultValue={defaults.quoteAuthor ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Imagen de portada (opcional)">
        <input name="coverImage" type="file" accept="image/*" className="text-sm text-white/70" />
      </Field>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";
import { UploadBox } from "@/components/admin/upload-box";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

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
  videoUrl?: string | null;
  coverImageListingUrl?: string | null;
  coverImageHeroMobileUrl?: string | null;
  coverImageHeroDesktopUrl?: string | null;
  coverImageCarouselUrl?: string | null;
  summary?: string;
  resultBadge?: string | null;
  resultLabel?: string | null;
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
            defaultValue={defaults.accentColor ?? "#D90B91"}
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

      <Field label="Imagen de portada (opcional) — subí una por cada lugar/tamaño donde aparece">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UploadBox
            name="coverImageListing"
            title="Listado de proyectos"
            size="400×500px"
            currentUrl={defaults.coverImageListingUrl}
          />
          <UploadBox
            name="coverImageHeroMobile"
            title="Ficha del proyecto — Mobile"
            size="330×390px"
            currentUrl={defaults.coverImageHeroMobileUrl}
          />
          <UploadBox
            name="coverImageHeroDesktop"
            title="Ficha del proyecto — Escritorio"
            size="1160×540px"
            currentUrl={defaults.coverImageHeroDesktopUrl}
          />
          <UploadBox
            name="coverImageCarousel"
            title="Carrusel de Home"
            size="380×680px"
            currentUrl={defaults.coverImageCarouselUrl}
          />
        </div>
        <p className="mt-2 text-xs text-white/40">
          JPG o WEBP, hasta 8MB. Si dejás una casilla vacía se conserva la imagen actual de ese lugar.
        </p>
      </Field>

      <Field label="Resumen">
        <RichTextEditor name="summary" defaultValue={defaults.summary} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Resultado destacado (badge, opcional)">
          <input name="resultBadge" defaultValue={defaults.resultBadge ?? ""} placeholder="Ej: +18K" className={inputClass} />
        </Field>
        <Field label="Descripción del resultado (opcional)">
          <input
            name="resultLabel"
            defaultValue={defaults.resultLabel ?? ""}
            placeholder="Ej: seguidores / 3 meses"
            className={inputClass}
          />
        </Field>
      </div>
      <p className="-mt-2 text-xs text-white/40">
        Si dejás alguno vacío, no se muestra el resultado destacado para este proyecto.
      </p>

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
        <RichTextEditor name="challengeBody" defaultValue={defaults.challengeBody} />
      </Field>
      <Field label="Título — La solución">
        <input name="solutionTitle" defaultValue={defaults.solutionTitle} required className={inputClass} />
      </Field>
      <Field label="Cuerpo — La solución">
        <RichTextEditor name="solutionBody" defaultValue={defaults.solutionBody} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Cita (testimonio, opcional)">
          <textarea name="quoteText" defaultValue={defaults.quoteText ?? ""} className={textareaClass} />
        </Field>
        <Field label="Autor de la cita (opcional)">
          <input name="quoteAuthor" defaultValue={defaults.quoteAuthor ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Link de video de YouTube (opcional)">
        <input
          name="videoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          defaultValue={defaults.videoUrl ?? ""}
          className={inputClass}
        />
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

import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getAllProjects, getLandingById, getServices, getTestimonials } from "@/lib/data";
import { getServiceAnimation } from "@/lib/service-animations";
import { deleteLanding, updateLanding } from "@/lib/actions/landings";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ListEditor } from "@/components/admin/list-editor";
import { ProjectPicker } from "@/components/admin/project-picker";
import { SeoDescriptionField, SeoTitleField } from "@/components/admin/seo-description-field";
import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

const ITEM_FIELDS = [
  { key: "title", label: "Título" },
  { key: "body", label: "Texto", multiline: true },
];

export default async function EditarLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ guardado?: string }>;
}) {
  const [{ id }, { guardado }] = await Promise.all([params, searchParams]);
  const [landing, projects, siteServices, testimonials] = await Promise.all([
    getLandingById(id),
    getAllProjects(),
    getServices(),
    getTestimonials(),
  ]);
  if (!landing) notFound();

  const projectOptions = projects.map((p) => ({ id: p.id, label: p.title, hint: `${p.clientName} · ${p.category}` }));
  const animationOptions = [
    { value: "", label: "Sin animación" },
    ...siteServices
      .filter((s) => getServiceAnimation(s.slug))
      .map((s) => ({ value: s.slug, label: `${s.title} (personaje de ¿Qué hacemos?)` })),
  ];
  const testimonialOptions = testimonials.map((t) => ({
    id: t.id,
    label: `${t.authorName} — ${t.company}${t.videoUrl ? " (video)" : ""}`,
    hint: `“${t.quote}”`,
  }));

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">{landing.navLabel}</h1>
          <Link href={`/servicios/${landing.slug}`} target="_blank" className="text-white/50 hover:text-white">
            /servicios/{landing.slug} ↗ {landing.published ? "" : "(vista previa)"}
          </Link>
        </div>
        <form action={deleteLanding}>
          <input type="hidden" name="id" value={landing.id} />
          <DeleteButton confirmMessage={`¿Eliminar la landing "${landing.navLabel}"? Esta acción no se puede deshacer.`} />
        </form>
      </div>

      {guardado && (
        <p role="status" className="mb-6 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
          Cambios guardados.
        </p>
      )}

      <p className="mb-8 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/60">
        En los títulos, lo que escribas entre <strong className="text-white">*asteriscos*</strong> se muestra en rosa
        (ej. “Casos de *marketing digital*”). Las secciones sin contenido no se muestran en la página.
      </p>

      <form action={updateLanding} className="flex flex-col gap-10">
        <input type="hidden" name="id" value={landing.id} />

        <Section title="General y SEO">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre del servicio" name="navLabel" defaultValue={landing.navLabel} hint="Para el breadcrumb y los links." />
            <Field label="Slug (URL)" name="slug" defaultValue={landing.slug} hint="/servicios/<slug>" />
          </div>
          <SeoTitleField defaultValue={landing.seoTitle} />
          <SeoDescriptionField
            defaultValue={landing.seoDescription}
            label="Meta description (SEO)"
            hint="Entre 70 y 160 caracteres, con la keyword principal y un llamado a la acción."
            placeholder=""
            required
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <input type="checkbox" name="published" defaultChecked={landing.published} className="h-4 w-4" />
            Publicada (visible en el sitio y en el sitemap)
          </label>
        </Section>

        <Section title="1. Hero" description="El H1 es el título principal: usá el de la planilla de SEO.">
          <Field label="Etiqueta sobre el título" name="heroEyebrow" defaultValue={landing.heroEyebrow} />
          <Field label="Título (H1)" name="heroTitle" defaultValue={landing.heroTitle} />
          <Field label="Texto" name="heroBody" defaultValue={landing.heroBody} multiline />
          <Field label="Texto del botón" name="heroCtaLabel" defaultValue={landing.heroCtaLabel} hint="Lleva a Contacto." />
        </Section>

        <Section title="2. Marcas que confían" description="Los logos salen de Secciones → Clientes.">
          <Field label="Título" name="clientsTitle" defaultValue={landing.clientsTitle} />
          <Field label="Texto" name="clientsBody" defaultValue={landing.clientsBody} multiline />
        </Section>

        <Section title="3. Puntos de dolor">
          <Field label="Título" name="painTitle" defaultValue={landing.painTitle} />
          <Field label="Introducción" name="painIntro" defaultValue={landing.painIntro} multiline />
          <ListEditor name="painPointsJson" fields={ITEM_FIELDS} defaultItems={landing.painPoints} addLabel="+ Agregar desafío" />
        </Section>

        <Section
          title="4. Servicios y alcance"
          description="Se muestran en dos columnas, con la estructura de ¿Qué hacemos?: bajada, título, texto y la animación del servicio elegido."
        >
          <Field label="Título" name="servicesTitle" defaultValue={landing.servicesTitle} />
          <Field label="Introducción" name="servicesIntro" defaultValue={landing.servicesIntro} multiline />
          <ListEditor
            name="servicesJson"
            fields={[
              { key: "tagline", label: "Bajada (arriba del título)", placeholder: "Definimos el rumbo digital" },
              { key: "title", label: "Título", placeholder: "Estrategia *digital.*" },
              { key: "body", label: "Texto", multiline: true },
              { key: "service", label: "Animación", options: animationOptions },
              { key: "href", label: "Link “Ver más” (opcional)", placeholder: "/servicios/paid-media" },
            ]}
            defaultItems={landing.services.map((s) => ({
              title: s.title,
              body: s.body,
              tagline: s.tagline ?? "",
              service: s.service ?? "",
              href: s.href ?? "",
            }))}
            addLabel="+ Agregar servicio"
          />
        </Section>

        <Section title="5. Casos de éxito" description="Elegí entre 3 y 4 proyectos: se muestran con su desafío, qué hicimos, resultado y servicios. Si quedan menos de 3, se completa con proyectos destacados.">
          <Field label="Título" name="casesTitle" defaultValue={landing.casesTitle} />
          <Field label="Introducción" name="casesIntro" defaultValue={landing.casesIntro} multiline />
          <ProjectPicker name="caseProjectIdsJson" options={projectOptions} defaultIds={landing.caseProjectIds} max={4} />
        </Section>

        <Section
          title="6. Metodología"
          description="Una etapa por paso (Analizamos, Planificamos, Ejecutamos, Optimizamos), contada para este servicio. Si la dejás vacía, se usan las etapas generales de Secciones → Proceso."
        >
          <Field label="Título" name="methodTitle" defaultValue={landing.methodTitle} />
          <Field label="Introducción" name="methodIntro" defaultValue={landing.methodIntro} multiline />
          <ListEditor
            name="methodStepsJson"
            fields={[{ key: "title", label: "Etapa", placeholder: "Analizamos" }, { key: "body", label: "Texto", multiline: true }]}
            defaultItems={landing.methodSteps}
            addLabel="+ Agregar etapa"
          />
        </Section>

        <Section
          title="7. Growth partner y diferenciales"
          description="Opcional: si dejás el texto y la lista vacíos, la sección no se muestra (la idea es usarla en Ecommerce y Performance)."
        >
          <Field label="Título" name="partnerTitle" defaultValue={landing.partnerTitle} />
          <Field label="Texto" name="partnerBody" defaultValue={landing.partnerBody} multiline />
          <ListEditor name="partnerPointsJson" fields={ITEM_FIELDS} defaultItems={landing.partnerPoints} addLabel="+ Agregar diferencial" />
        </Section>

        <Section
          title="8. Testimonios"
          description="Elegí cuáles mostrar. Los testimonios (escritos o en video) se cargan en Secciones → Testimonios."
        >
          <Field label="Título" name="testimonialsTitle" defaultValue={landing.testimonialsTitle} />
          <ProjectPicker
            name="testimonialIdsJson"
            options={testimonialOptions}
            defaultIds={landing.testimonialIds}
            addLabel="+ Agregar testimonio…"
          />
          <Link href="/admin/secciones/testimonios" className="self-start text-sm font-semibold text-white/60 hover:text-white">
            Administrar testimonios →
          </Link>
        </Section>

        <Section title="9. Preguntas frecuentes" description="Enfocadas en la contratación: alcance, presupuesto, tiempos, coordinación.">
          <Field label="Título" name="faqTitle" defaultValue={landing.faqTitle} />
          <ListEditor
            name="faqsJson"
            fields={[
              { key: "question", label: "Pregunta" },
              { key: "answer", label: "Respuesta", multiline: true },
            ]}
            defaultItems={landing.faqs}
            addLabel="+ Agregar pregunta"
          />
        </Section>

        <Section title="10. Contacto" description="Explicá qué pasa después de completar el formulario. El botón lleva a Contacto.">
          <Field label="Etiqueta" name="ctaEyebrow" defaultValue={landing.ctaEyebrow} />
          <Field label="Título" name="ctaTitle" defaultValue={landing.ctaTitle} />
          <Field label="Texto" name="ctaBody" defaultValue={landing.ctaBody} multiline />
        </Section>

        <div className="sticky bottom-0 -mx-5 border-t border-white/10 bg-ink/95 px-5 py-4 backdrop-blur sm:-mx-10 sm:px-10">
          <SaveButton label="Guardar landing" />
        </div>
      </form>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-6">
      <legend className="px-2 text-lg font-bold text-white">{title}</legend>
      {description && <p className="-mt-2 text-sm text-white/50">{description}</p>}
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  defaultValue,
  hint,
  multiline = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {multiline ? (
        <textarea id={name} name={name} defaultValue={defaultValue} className={textareaClass} />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue} className={inputClass} />
      )}
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
}

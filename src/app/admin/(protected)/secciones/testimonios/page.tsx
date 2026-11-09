import { getTestimonials } from "@/lib/data";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

type TestimonialDefaults = {
  quote?: string;
  authorName?: string;
  authorRole?: string | null;
  company?: string;
  videoUrl?: string | null;
  order?: number;
};

function TestimonialFields({ defaults = {} }: { defaults?: TestimonialDefaults }) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Testimonio</label>
        <textarea name="quote" defaultValue={defaults.quote} required className={textareaClass} />
        <p className="text-xs text-white/40">
          Si es en video, escribí la parte más representativa de lo que dice: es lo que se lee junto al video.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nombre y apellido</label>
          <input name="authorName" defaultValue={defaults.authorName} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Cargo (opcional)</label>
          <input name="authorRole" defaultValue={defaults.authorRole ?? ""} placeholder="Gerente de Marketing" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Empresa</label>
          <input name="company" defaultValue={defaults.company} required className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_96px]">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Link del video (opcional)</label>
          <input
            name="videoUrl"
            type="url"
            defaultValue={defaults.videoUrl ?? ""}
            placeholder="https://www.youtube.com/watch?v=..."
            className={inputClass}
          />
          <p className="text-xs text-white/40">
            Los videos de YouTube se reproducen dentro del sitio; cualquier otro link se abre en una pestaña nueva.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Orden</label>
          <input name="order" type="number" defaultValue={defaults.order ?? 0} className={inputClass} />
        </div>
      </div>
    </>
  );
}

export default async function TestimoniosPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Testimonios</h1>
      <p className="mb-8 text-white/50">
        Recomendaciones de clientes, escritas o en video. Cada landing elige cuáles mostrar (Landings → sección
        Testimonios).
      </p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar testimonio</h2>
        <form action={createTestimonial} className="flex flex-col gap-4">
          <TestimonialFields defaults={{ order: testimonials.length }} />
          <div>
            <SaveButton label="Agregar" />
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="rounded-2xl border border-white/10 bg-card p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-bold text-white">
                {testimonial.authorName} <span className="font-normal text-white/50">— {testimonial.company}</span>
              </p>
              <div className="flex items-center gap-3">
                {testimonial.videoUrl && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                    Video
                  </span>
                )}
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={testimonial.id} />
                  <DeleteButton confirmMessage={`¿Eliminar el testimonio de "${testimonial.authorName}"?`} />
                </form>
              </div>
            </div>
            <form action={updateTestimonial} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={testimonial.id} />
              <TestimonialFields defaults={testimonial} />
              <div>
                <SaveButton />
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

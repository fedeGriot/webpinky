import { createLanding } from "@/lib/actions/landings";
import { SaveButton } from "@/components/admin/save-button";
import { inputClass, labelClass } from "@/components/admin/form-styles";

export default function NuevaLandingPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Nueva landing</h1>
      <p className="mb-8 text-white/50">
        Empezá con el nombre y la URL. Se crea como borrador, con todas las secciones listas para completar.
      </p>

      <form action={createLanding} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="navLabel" className={labelClass}>
            Nombre del servicio
          </label>
          <input id="navLabel" name="navLabel" required placeholder="Ej: Paid media" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className={labelClass}>
            Slug (URL)
          </label>
          <input id="slug" name="slug" required placeholder="paid-media" className={inputClass} />
          <p className="text-xs text-white/40">La página va a quedar en /servicios/&lt;slug&gt;. Usá el de la planilla de SEO.</p>
        </div>
        <div>
          <SaveButton label="Crear landing" />
        </div>
      </form>
    </div>
  );
}

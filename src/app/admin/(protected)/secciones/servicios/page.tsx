import { getServices } from "@/lib/data";
import { createService, updateService, deleteService } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { UploadHint } from "@/components/admin/upload-hint";
import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default async function ServiciosPage() {
  const services = await getServices();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Servicios</h1>
      <p className="mb-8 text-white/50">
        Los 6 servicios que se muestran en Home y en detalle en “¿Qué hacemos?”.
      </p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar servicio</h2>
        <form action={createService} className="flex flex-col gap-4">
          <ServiceFields defaultOrder={services.length} />
          <div>
            <SaveButton label="Agregar" />
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {services.map((service) => (
          <form
            key={service.id}
            action={updateService}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-6"
          >
            <input type="hidden" name="id" value={service.id} />
            <ServiceFields
              defaultOrder={service.order}
              defaultIcon={service.icon}
              defaultIconUrl={service.iconUrl}
              defaultIconAccentUrl={service.iconAccentUrl}
              defaultSlug={service.slug}
              defaultTitle={service.title}
              defaultTagline={service.tagline}
              defaultDescription={service.description}
              defaultBullets={service.bullets.join("\n")}
            />
            <div className="flex gap-3">
              <SaveButton />
              <form action={deleteService}>
                <input type="hidden" name="id" value={service.id} />
                <DeleteButton confirmMessage={`¿Eliminar "${service.title}"?`} />
              </form>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

function ServiceFields({
  defaultOrder,
  defaultIcon = "✦",
  defaultIconUrl = null,
  defaultIconAccentUrl = null,
  defaultSlug = "",
  defaultTitle = "",
  defaultTagline = "",
  defaultDescription = "",
  defaultBullets = "",
}: {
  defaultOrder: number;
  defaultIcon?: string;
  defaultIconUrl?: string | null;
  defaultIconAccentUrl?: string | null;
  defaultSlug?: string;
  defaultTitle?: string;
  defaultTagline?: string;
  defaultDescription?: string;
  defaultBullets?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Ícono (emoji de respaldo)</label>
          <input name="icon" defaultValue={defaultIcon} className={inputClass} />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={defaultSlug} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Orden</label>
          <input name="order" type="number" defaultValue={defaultOrder} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Ilustración (opcional)</label>
          <div className="flex items-center gap-3">
            {defaultIconUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={defaultIconUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg bg-white/5 object-contain p-1" />
            )}
            <input name="iconImage" type="file" accept="image/*" className="flex-1 text-sm text-white/70" />
          </div>
          <UploadHint
            sizes={[{ mobile: "500×500px" }]}
            format="PNG con fondo transparente"
            note="tarjetas de servicio en Home y en la lista de ¿Qué hacemos?. Si no se carga, se muestra el emoji de respaldo."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Ilustración — versión acento (opcional)</label>
          <div className="flex items-center gap-3">
            {defaultIconAccentUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={defaultIconAccentUrl}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg bg-white/5 object-contain p-1"
              />
            )}
            <input name="iconAccentImage" type="file" accept="image/*" className="flex-1 text-sm text-white/70" />
          </div>
          <UploadHint
            sizes={[{ mobile: "500×500px" }]}
            format="PNG con fondo transparente"
            note="versión más grande en el detalle de cada servicio en ¿Qué hacemos?. Si no se carga, se muestra el emoji de respaldo."
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Título</label>
        <input name="title" defaultValue={defaultTitle} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Tagline</label>
        <input name="tagline" defaultValue={defaultTagline} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Descripción</label>
        <RichTextEditor name="description" defaultValue={defaultDescription} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Bullets (uno por línea)</label>
        <textarea name="bullets" defaultValue={defaultBullets} required className={textareaClass} />
      </div>
    </>
  );
}

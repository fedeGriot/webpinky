import { getClients } from "@/lib/data";
import { createClient, updateClient, deleteClient } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass, labelClass } from "@/components/admin/form-styles";
import { UploadHint } from "@/components/admin/upload-hint";

export default async function ClientesPage() {
  const clients = await getClients();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Clientes</h1>
      <p className="mb-8 text-white/50">
        Logos/nombres que aparecen en el marquee de “Nuestros clientes”.
      </p>

      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6">
        <h2 className="mb-4 font-bold text-white">Agregar cliente</h2>
        <form action={createClient} className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nombre</label>
            <input name="name" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Orden</label>
            <input name="order" type="number" defaultValue={clients.length} className={`${inputClass} w-20`} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Logo (opcional)</label>
            <input name="logo" type="file" accept="image/*" className="text-sm text-white/70" />
            <UploadHint
              spots={[
                { where: "Carrusel de \"Nuestros clientes\" en Home", size: "~150×64px" },
                { where: "Grilla de clientes en Quiénes somos", size: "~160×64px" },
              ]}
              format="PNG con fondo transparente, 400×200px"
              note="el logo se pinta siempre blanco sólido sin importar su color original — un fondo no transparente lo tapa"
            />
          </div>
          <SaveButton label="Agregar" />
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {clients.map((client) => (
          <div key={client.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card p-4">
            {client.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logoUrl} alt={client.name} className="h-10 w-10 rounded-lg object-cover" />
            )}
            <form action={updateClient} className="flex flex-1 flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={client.id} />
              <input name="name" defaultValue={client.name} required className={`${inputClass} flex-1`} />
              <input name="order" type="number" defaultValue={client.order} className={`${inputClass} w-20`} />
              <div className="flex flex-col gap-1">
                <input name="logo" type="file" accept="image/*" className="text-xs text-white/50" />
                <p className="text-[11px] text-white/40">PNG transparente · 400×200px</p>
              </div>
              <SaveButton />
            </form>
            <form action={deleteClient}>
              <input type="hidden" name="id" value={client.id} />
              <DeleteButton confirmMessage={`¿Eliminar "${client.name}"?`} />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

import { getSiteSettings } from "@/lib/data";
import { upsertSiteSettings } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { labelClass, inputClass } from "@/components/admin/form-styles";

export default async function ConfiguracionPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Configuración del sitio</h1>
      <p className="mb-8 text-white/50">Contacto, dirección y redes sociales del footer.</p>

      <form action={upsertSiteSettings} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" defaultValue={settings?.email} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="foundedYear">
              Año de fundación
            </label>
            <input
              id="foundedYear"
              name="foundedYear"
              type="number"
              defaultValue={settings?.foundedYear}
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="phone1">
              Teléfono 1
            </label>
            <input id="phone1" name="phone1" defaultValue={settings?.phone1} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="phone2">
              Teléfono 2 (opcional)
            </label>
            <input id="phone2" name="phone2" defaultValue={settings?.phone2 ?? ""} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="address">
            Dirección
          </label>
          <input id="address" name="address" defaultValue={settings?.address} required className={inputClass} />
        </div>

        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-white/40">Redes sociales</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="instagramUrl">
              Instagram
            </label>
            <input id="instagramUrl" name="instagramUrl" defaultValue={settings?.instagramUrl ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="linkedinUrl">
              LinkedIn
            </label>
            <input id="linkedinUrl" name="linkedinUrl" defaultValue={settings?.linkedinUrl ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="youtubeUrl">
              YouTube
            </label>
            <input id="youtubeUrl" name="youtubeUrl" defaultValue={settings?.youtubeUrl ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="twitterUrl">
              X / Twitter
            </label>
            <input id="twitterUrl" name="twitterUrl" defaultValue={settings?.twitterUrl ?? ""} className={inputClass} />
          </div>
        </div>

        <div>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}

import { getHeroContent } from "@/lib/data";
import { upsertHero } from "@/lib/actions/sections";
import { SaveButton } from "@/components/admin/save-button";
import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";

// Renderizado dinámico: la sesión ya obliga a esto (verifySession lee
// cookies en el layout), pero se declara explícito para que el build no
// intente pre-renderizar esta página — el volumen con la base de datos
// (/data) recién se monta en runtime en Railway, no durante el build.
export const dynamic = "force-dynamic";

export default async function HeroSectionPage() {
  const hero = await getHeroContent();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-white">Hero — Home</h1>
      <p className="mb-8 text-white/50">
        El bloque principal de la portada, con la palabra que rota en el título.
      </p>

      <form action={upsertHero} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="titleLine1">
            Primera línea del título
          </label>
          <input
            id="titleLine1"
            name="titleLine1"
            defaultValue={hero?.titleLine1}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="titleAccent">
            Palabra/frase destacada (subrayada)
          </label>
          <input
            id="titleAccent"
            name="titleAccent"
            defaultValue={hero?.titleAccent}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="rotatingWords">
            Palabras rotativas (una por línea)
          </label>
          <textarea
            id="rotatingWords"
            name="rotatingWords"
            defaultValue={hero?.rotatingWords.join("\n")}
            required
            className={textareaClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="subtitle">
            Subtítulo
          </label>
          <textarea
            id="subtitle"
            name="subtitle"
            defaultValue={hero?.subtitle}
            required
            className={textareaClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="ctaPrimaryLabel">
              Botón principal
            </label>
            <input
              id="ctaPrimaryLabel"
              name="ctaPrimaryLabel"
              defaultValue={hero?.ctaPrimaryLabel}
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="ctaSecondaryLabel">
              Link secundario
            </label>
            <input
              id="ctaSecondaryLabel"
              name="ctaSecondaryLabel"
              defaultValue={hero?.ctaSecondaryLabel}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { labelClass, textareaClass } from "@/components/admin/form-styles";
import {
  DESCRIPTION_FONT_PX,
  DESCRIPTION_MAX_CHARS,
  DESCRIPTION_MAX_PX,
  DESCRIPTION_MIN_CHARS,
  serpWidth,
} from "@/lib/serp-length";

/**
 * Meta description del proyecto (lo que muestra Google debajo del título),
 * con contador en vivo de caracteres y de píxeles: Google corta por ancho
 * (960px), no solo por cantidad de caracteres.
 */
export function SeoDescriptionField({ defaultValue }: { defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const text = value.trim();
  const chars = text.length;
  const px = serpWidth(text, DESCRIPTION_FONT_PX);
  const tooLong = chars > DESCRIPTION_MAX_CHARS || px > DESCRIPTION_MAX_PX;
  const tooShort = chars > 0 && chars < DESCRIPTION_MIN_CHARS;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="seoDescription" className={labelClass}>
        Meta description (SEO, opcional)
      </label>
      <textarea
        id="seoDescription"
        name="seoDescription"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className={textareaClass}
        placeholder="Ej: Estrategia 360° para el lanzamiento de la marca en Uruguay: expectativa, comunidad y una apertura de alto impacto. Conocé el caso."
      />
      <p className={`text-xs ${tooLong || tooShort ? "text-accent" : "text-white/40"}`}>
        {chars} / {DESCRIPTION_MAX_CHARS} caracteres · {px} / {DESCRIPTION_MAX_PX} px
        {tooLong && " — Google la va a cortar, acortala."}
        {tooShort && ` — muy corta, apuntá a más de ${DESCRIPTION_MIN_CHARS} caracteres.`}
      </p>
      <p className="text-xs text-white/40">
        Entre {DESCRIPTION_MIN_CHARS} y {DESCRIPTION_MAX_CHARS} caracteres, terminando con un llamado a la
        acción (ej. “Conocé el caso.”). Si la dejás vacía, se arma sola a partir del resumen.
      </p>
    </div>
  );
}

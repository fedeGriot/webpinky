"use client";

import { useState } from "react";
import { inputClass, labelClass, textareaClass } from "@/components/admin/form-styles";
import {
  DESCRIPTION_FONT_PX,
  DESCRIPTION_MAX_CHARS,
  DESCRIPTION_MAX_PX,
  DESCRIPTION_MIN_CHARS,
  TITLE_FONT_PX,
  TITLE_MAX_PX,
  serpWidth,
} from "@/lib/serp-length";

/**
 * Meta description (lo que muestra Google debajo del título), con contador en
 * vivo de caracteres y de píxeles: Google corta por ancho (960px), no solo por
 * cantidad de caracteres. Por defecto, con los textos de la ficha de proyecto.
 */
export function SeoDescriptionField({
  defaultValue,
  label = "Meta description (SEO, opcional)",
  hint = "Entre 70 y 160 caracteres, terminando con un llamado a la acción (ej. “Conocé el caso.”). Si la dejás vacía, se arma sola a partir del resumen.",
  placeholder = "Ej: Estrategia 360° para el lanzamiento de la marca en Uruguay: expectativa, comunidad y una apertura de alto impacto. Conocé el caso.",
  required = false,
}: {
  defaultValue?: string | null;
  label?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const text = value.trim();
  const chars = text.length;
  const px = serpWidth(text, DESCRIPTION_FONT_PX);
  const tooLong = chars > DESCRIPTION_MAX_CHARS || px > DESCRIPTION_MAX_PX;
  const tooShort = chars > 0 && chars < DESCRIPTION_MIN_CHARS;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="seoDescription" className={labelClass}>
        {label}
      </label>
      <textarea
        id="seoDescription"
        name="seoDescription"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        required={required}
        className={textareaClass}
        placeholder={placeholder}
      />
      <p className={`text-xs ${tooLong || tooShort ? "text-accent" : "text-white/40"}`}>
        {chars} / {DESCRIPTION_MAX_CHARS} caracteres · {px} / {DESCRIPTION_MAX_PX} px
        {tooLong && " — Google la va a cortar, acortala."}
        {tooShort && ` — muy corta, apuntá a más de ${DESCRIPTION_MIN_CHARS} caracteres.`}
      </p>
      <p className="text-xs text-white/40">{hint}</p>
    </div>
  );
}

/** Title de la página en Google, con el mismo contador (corta a 600px). */
export function SeoTitleField({ defaultValue }: { defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const text = value.trim();
  const px = serpWidth(text, TITLE_FONT_PX);
  const tooLong = px > TITLE_MAX_PX;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="seoTitle" className={labelClass}>
        Title (SEO)
      </label>
      <input
        id="seoTitle"
        name="seoTitle"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className={inputClass}
      />
      <p className={`text-xs ${tooLong ? "text-accent" : "text-white/40"}`}>
        {text.length} caracteres · {px} / {TITLE_MAX_PX} px
        {tooLong && " — Google lo va a cortar, acortalo."}
      </p>
    </div>
  );
}

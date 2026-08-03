import type { ReactNode } from "react";

/**
 * Etiqueta chica en mayúsculas usada como "eyebrow" arriba del título de
 * una sección. `className` es solo para overrides de spacing (mb-2/mb-3/…)
 * — no para cambiar color/tamaño/peso, que son parte del look fijo.
 */
export function SectionEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm font-bold uppercase tracking-wide text-white/40 ${className}`}>{children}</p>;
}
